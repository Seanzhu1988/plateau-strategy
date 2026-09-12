/* Prepare one visitor-selected photo locally. No network requests or photo storage. */
(function (root) {
  'use strict';
  var MAX_RAW_BYTES = 24 * 1024 * 1024;
  var MAX_OUTPUT_BYTES = 6 * 1024 * 1024;
  var MAX_PIXELS = 64000000;
  var MAX_DIMENSION = 16000;
  var LONG_EDGE = 1920;
  var DEADLINE_MS = 15000;

  function failure(code) {
    var error = new Error(code);
    error.name = code === 'cancelled' ? 'AbortError' : 'GalleryPhotoError';
    error.code = error.reason = code;
    return error;
  }
  function bounds(width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 16 || height < 16) throw failure('invalid_image');
    if (width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_PIXELS) throw failure('image_too_large');
  }
  function ascii(bytes, start, count) {
    return String.fromCharCode.apply(null, bytes.subarray(start, start + count));
  }
  function orientation(bytes, start, end) {
    // TIFF metadata is read only to orient the pixels. None is copied to the output.
    if (start + 8 > end) return 1;
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var little = ascii(bytes, start, 2) === 'II';
    if (!little && ascii(bytes, start, 2) !== 'MM') return 1;
    if (view.getUint16(start + 2, little) !== 42) return 1;
    var directory = start + view.getUint32(start + 4, little);
    if (directory < start || directory + 2 > end) return 1;
    var count = view.getUint16(directory, little);
    for (var i = 0; i < count && i < 1024; i++) {
      var offset = directory + 2 + i * 12;
      if (offset + 12 > end) break;
      if (view.getUint16(offset, little) === 274 && view.getUint16(offset + 2, little) === 3 && view.getUint32(offset + 4, little) === 1) {
        var value = view.getUint16(offset + 8, little);
        return value >= 1 && value <= 8 ? value : 1;
      }
    }
    return 1;
  }
  function heifDimensions(bytes, data) {
    // Read HEIF image-property dimensions, including the full grid image, before
    // handing compressed pixels to a native decoder. Do not walk media payloads.
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), count = 0;
    function walk(start, end, depth) {
      if (depth > 4) throw failure('invalid_image');
      for (var position = start; position < end;) {
        if (++count > 4096 || position + 8 > end) throw failure('invalid_image');
        var size = view.getUint32(position), name = ascii(bytes, position + 4, 4), header = 8;
        if (size === 1) {
          if (position + 16 > end || view.getUint32(position + 8) !== 0) throw failure('invalid_image');
          size = view.getUint32(position + 12); header = 16;
        } else if (size === 0) size = end - position;
        if (size < header || position + size > end) throw failure('invalid_image');
        var body = position + header, limit = position + size;
        if (name === 'meta' && depth === 0) {
          if (body + 4 > limit) throw failure('invalid_image');
          walk(body + 4, limit, 1);
        } else if ((name === 'iprp' && depth === 1) || (name === 'ipco' && depth === 2)) {
          walk(body, limit, depth + 1);
        } else if (name === 'ispe' && depth === 3) {
          if (body + 12 > limit || bytes[body] !== 0) throw failure('invalid_image');
          var width = view.getUint32(body + 4), height = view.getUint32(body + 8);
          bounds(width, height);
          if (width * height > data.width * data.height) { data.width = width; data.height = height; }
        }
        position = limit;
      }
    }
    walk(0, bytes.length, 0);
    if (!data.width || !data.height) throw failure('unsupported_format');
  }
  function inspect(bytes) {
    var data = {format: '', width: 0, height: 0, orientation: 1};
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      data.format = 'jpeg';
      for (var pos = 2; pos + 4 <= bytes.length;) {
        if (bytes[pos++] !== 255) break;
        while (bytes[pos] === 255) pos++;
        var marker = bytes[pos++];
        if (marker === 218 || marker === 217 || marker === undefined) break;
        if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
        if (pos + 2 > bytes.length) break;
        var length = view.getUint16(pos);
        if (length < 2 || pos + length > bytes.length) break;
        if (marker === 225 && length >= 16 && ascii(bytes, pos + 2, 6) === 'Exif\x00\x00') data.orientation = orientation(bytes, pos + 8, pos + length);
        if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].indexOf(marker) !== -1 && length >= 8) {
          data.height = view.getUint16(pos + 3); data.width = view.getUint16(pos + 5);
        }
        pos += length;
      }
    } else if (bytes.length >= 24 && ascii(bytes, 0, 8) === '\x89PNG\r\n\x1a\n' && ascii(bytes, 12, 4) === 'IHDR') {
      data.format = 'png'; data.width = view.getUint32(16); data.height = view.getUint32(20);
      for (var p = 8; p + 12 <= bytes.length;) {
        var size = view.getUint32(p), end = p + 12 + size;
        if (end > bytes.length) break;
        if (ascii(bytes, p + 4, 4) === 'eXIf') data.orientation = orientation(bytes, p + 8, p + 8 + size);
        p = end;
      }
    } else if (bytes.length >= 30 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
      data.format = 'webp';
      for (var w = 12; w + 8 <= bytes.length;) {
        var chunk = ascii(bytes, w, 4), chunkSize = view.getUint32(w + 4, true), body = w + 8;
        if (body + chunkSize > bytes.length) break;
        if (chunk === 'VP8X' && chunkSize >= 10) {
          data.width = 1 + bytes[body + 4] + (bytes[body + 5] << 8) + (bytes[body + 6] << 16);
          data.height = 1 + bytes[body + 7] + (bytes[body + 8] << 8) + (bytes[body + 9] << 16);
        } else if (!data.width && chunk === 'VP8 ' && chunkSize >= 10 && ascii(bytes, body + 3, 3) === '\x9d\x01\x2a') {
          data.width = view.getUint16(body + 6, true) & 16383; data.height = view.getUint16(body + 8, true) & 16383;
        } else if (!data.width && chunk === 'VP8L' && chunkSize >= 5 && bytes[body] === 47) {
          var packed = view.getUint32(body + 1, true);
          data.width = (packed & 16383) + 1; data.height = ((packed >>> 14) & 16383) + 1;
        } else if (chunk === 'EXIF') {
          var tiff = ascii(bytes, body, 6) === 'Exif\x00\x00' ? body + 6 : body;
          data.orientation = orientation(bytes, tiff, body + chunkSize);
        }
        w = body + chunkSize + (chunkSize % 2);
      }
    } else if (bytes.length >= 16 && ascii(bytes, 4, 4) === 'ftyp') {
      var boxSize = view.getUint32(0), brands = [];
      if (boxSize >= 16 && boxSize <= bytes.length && boxSize <= 4096) {
        brands.push(ascii(bytes, 8, 4));
        for (var b = 16; b + 4 <= boxSize; b += 4) brands.push(ascii(bytes, b, 4));
        if (brands.some(function (brand) { return ['heic', 'heix', 'hevc', 'hevx'].indexOf(brand) !== -1; })) data.format = 'heif';
      }
    }
    if (!data.format) throw failure('unsupported_format');
    if (data.format === 'heif') heifDimensions(bytes, data);
    bounds(data.width, data.height);
    return data;
  }

  async function prepare(file, options) {
    options = options || {};
    var signal = options.signal;
    if (signal && signal.aborted) throw failure('cancelled');
    if (!file || typeof file.arrayBuffer !== 'function' || !Number.isFinite(file.size) || file.size <= 0) throw failure('invalid_image');
    if (file.size > MAX_RAW_BYTES) throw failure('image_too_large');
    var type = (file.type || '').toLowerCase().split(';')[0].trim();
    if (type && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/octet-stream'].indexOf(type) === -1) throw failure('unsupported_format');

    var active = true, stopped = null, rejectStop, bitmap = null, image = null, url = null, canvas = null;
    var interrupted = new Promise(function (_, reject) { rejectStop = reject; });
    interrupted.catch(function () {});
    function stop(code) { if (!stopped) { stopped = failure(code); active = false; rejectStop(stopped); } }
    function abort() { stop('cancelled'); }
    function check() { if (!active) throw stopped || failure('cancelled'); }
    function wait(promise, closeLate) {
      return Promise.race([Promise.resolve(promise).then(function (value) {
        if (!active) { if (closeLate) closeLate(value); check(); }
        return value;
      }), interrupted]);
    }
    var timer = root.setTimeout(function () { stop('preparation_timeout'); }, DEADLINE_MS);
    if (signal) signal.addEventListener('abort', abort, {once: true});
    try {
      var bytes = new Uint8Array(await wait(file.arrayBuffer()));
      var info = inspect(bytes);
      bytes = null;
      check();
      var decodeOptions = {imageOrientation: 'from-image', resizeQuality: 'high'};
      if (info.format !== 'heif' && Math.max(info.width, info.height) > LONG_EDGE) {
        var swap = info.orientation >= 5 && info.orientation <= 8;
        var orientedWidth = swap ? info.height : info.width, orientedHeight = swap ? info.width : info.height;
        // A single dimension preserves the aspect ratio after EXIF orientation.
        decodeOptions[orientedWidth >= orientedHeight ? 'resizeWidth' : 'resizeHeight'] = LONG_EDGE;
      }
      if (typeof root.createImageBitmap === 'function') {
        try {
          bitmap = await wait(root.createImageBitmap(file, decodeOptions), function (late) { late.close(); });
        } catch (error) { check(); /* Safari may decode HEIC only through its native Image path. */ }
      }
      if (!bitmap) {
        if (!root.Image || !root.URL || !root.URL.createObjectURL) throw failure('preparation_unavailable');
        image = new root.Image();
        image.decoding = 'async';
        url = root.URL.createObjectURL(file);
        await wait(new Promise(function (resolve, reject) {
          image.onload = resolve;
          image.onerror = function () { reject(failure(info.format === 'heif' ? 'unsupported_format' : 'invalid_image')); };
          image.src = url;
        }));
      }
      check();
      var source = bitmap || image, width = bitmap ? bitmap.width : image.naturalWidth, height = bitmap ? bitmap.height : image.naturalHeight;
      bounds(width, height);
      var scale = Math.min(1, LONG_EDGE / Math.max(width, height));
      if (!root.document || !root.document.createElement) throw failure('preparation_unavailable');
      canvas = root.document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale)); canvas.height = Math.max(1, Math.round(height * scale));
      var context = canvas.getContext('2d', {alpha: false});
      if (!context || typeof canvas.toBlob !== 'function') throw failure('preparation_unavailable');
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      if (bitmap) { bitmap.close(); bitmap = null; }
      var output;
      for (var quality of [0.88, 0.76, 0.62]) {
        output = await wait(new Promise(function (resolve, reject) {
          canvas.toBlob(function (blob) {
            if (!blob || blob.type !== 'image/jpeg' || !blob.size) reject(failure('preparation_unavailable'));
            else resolve(blob);
          }, 'image/jpeg', quality);
        }));
        if (output.size < MAX_OUTPUT_BYTES) break;
      }
      check();
      if (output.size >= MAX_OUTPUT_BYTES) throw failure('image_too_large');
      return typeof root.File === 'function' ? new root.File([output], 'gallery-photo.jpg', {type: 'image/jpeg'}) : output;
    } catch (error) {
      if (stopped) throw stopped;
      if (error && error.name === 'GalleryPhotoError') throw error;
      throw failure('invalid_image');
    } finally {
      active = false;
      root.clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', abort);
      if (bitmap) bitmap.close();
      if (image) { image.onload = image.onerror = null; image.removeAttribute('src'); }
      if (url) root.URL.revokeObjectURL(url);
      if (canvas) { canvas.width = 0; canvas.height = 0; }
    }
  }
  root.PSXGalleryPhoto = Object.freeze({prepare: prepare});
})(typeof window !== 'undefined' ? window : globalThis);
