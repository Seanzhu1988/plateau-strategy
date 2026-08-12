# -*- coding: utf-8 -*-
"""Take a visitor's photo, keep the place, throw away the person.

A phone photo carries far more than the picture. A JPEG straight from a camera
roll typically holds the exact GPS position it was taken at, the device model
and serial, the software, the timestamp to the second, and, on some phones, 
the owner's name in the copyright field. Publishing that file as-is publishes
all of it.

That matters here more than on most sites, because the whole point of the
Destination Book is to refuse to publish where somebody lives. `_is_private
_residence` in app.py already turns away an address that a geocoder classifies
as a home. A photo walks straight past that guard: the address was never typed,
so nothing was checked, and the coordinates ride along inside the file.

So this module does two separate jobs and keeps them separate:

    read_gps(raw)         , where was this taken? Used to place the pin, and
                             passed through the same private-residence check
                             as a typed address before anything is written.
    strip_metadata(raw)   , return the picture with every metadata block gone.

The stored file is always the stripped one. The coordinates are used and then
the file that carried them is discarded. A reader of the published photo learns
the place, not the photographer.

No third-party dependency. Pillow would do this in a line, but it is a large
package to add to a five-package app for one function, and both formats are
simple enough to walk directly:

  * JPEG is a chain of segments, each 0xFF <marker> <2-byte length> <payload>.
    Everything identifying lives in APP1 (EXIF, XMP), APP13 (IPTC) and COM.
    Dropping those segments leaves a valid file every decoder still reads.
  * PNG is a chain of chunks, each <4-byte length> <4-byte type> <data> <CRC>.
    Text lives in tEXt/iTXt/zTXt and EXIF in eXIf. Same idea.
"""
import struct

JPEG_SOI = b"\xff\xd8"
# Segments carrying identity rather than picture. APP2 (ICC colour profile) is
# deliberately KEPT, it changes how the image renders and says nothing about
# the photographer.
_JPEG_DROP = {0xE1,  # APP1, EXIF and XMP
              0xE0,  # APP0, JFIF; harmless but nothing needs it
              0xEC,  # APP12, Picture Info, some cameras write settings here
              0xED,  # APP13, Photoshop/IPTC, often author and copyright
              0xEE,  # APP14, Adobe
              0xFE}  # COM, free-text comment
_PNG_DROP = {b"tEXt", b"iTXt", b"zTXt", b"eXIf", b"tIME"}


def strip_metadata(raw, mime=""):
    """Return the image with identifying metadata removed.

    Unknown or unsupported formats come back unchanged rather than mangled, 
    the caller decides whether to accept a format this cannot clean, and
    returning a broken file would be worse than returning the original."""
    if not raw:
        return raw
    if raw[:2] == JPEG_SOI:
        return _strip_jpeg(raw)
    if raw[:8] == b"\x89PNG\r\n\x1a\n":
        return _strip_png(raw)
    return raw


def _strip_jpeg(raw):
    out = bytearray(JPEG_SOI)
    i = 2
    n = len(raw)
    while i < n - 1:
        if raw[i] != 0xFF:
            break                       # not a marker where one was expected
        marker = raw[i + 1]
        if marker == 0xD9:              # end of image, nothing follows it
            out += raw[i:i + 2]
            return bytes(out)
        if marker == 0xD8 or 0xD0 <= marker <= 0xD7 or marker == 0x01:
            out += raw[i:i + 2]         # standalone markers carry no length
            i += 2
            continue
        if marker == 0xDA:              # start of scan, the picture itself
            out += raw[i:]
            return bytes(out)
        if i + 4 > n:
            break
        seg_len = struct.unpack(">H", raw[i + 2:i + 4])[0]
        end = i + 2 + seg_len
        if seg_len < 2 or end > n:
            break                       # malformed; stop rather than guess
        if marker not in _JPEG_DROP:
            out += raw[i:end]
        i = end
    return bytes(out)


def _strip_png(raw):
    out = bytearray(raw[:8])
    i = 8
    n = len(raw)
    while i + 8 <= n:
        length = struct.unpack(">I", raw[i:i + 4])[0]
        ctype = raw[i + 4:i + 8]
        end = i + 12 + length           # length + type + data + crc
        if end > n:
            break
        if ctype not in _PNG_DROP:
            out += raw[i:end]
        i = end
        if ctype == b"IEND":
            break
    return bytes(out)


# --------------------------------------------------------------------------
# Reading the position, before it is thrown away
# --------------------------------------------------------------------------
def read_gps(raw):
    """(lat, lon) the photo was taken at, or None.

    Walks the EXIF TIFF header to the GPS sub-directory. Returns None for
    anything it cannot read with confidence, a wrong coordinate would put a
    pin on a stranger's house, so every failure here is silent and total."""
    try:
        exif = _jpeg_exif(raw)
        if not exif:
            return None
        if exif[:2] == b"II":
            end = "<"
        elif exif[:2] == b"MM":
            end = ">"
        else:
            return None
        first = struct.unpack(end + "I", exif[4:8])[0]
        gps_off = _ifd_find(exif, first, 0x8825, end)      # GPSInfoIFDPointer
        if not gps_off:
            return None
        lat = _coord(exif, gps_off, 0x0002, 0x0001, end)
        lon = _coord(exif, gps_off, 0x0004, 0x0003, end)
        if lat is None or lon is None:
            return None
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            return None
        if abs(lat) < 0.0001 and abs(lon) < 0.0001:
            return None                                    # null island
        return round(lat, 6), round(lon, 6)
    except Exception:
        return None


def _jpeg_exif(raw):
    """The TIFF block inside the APP1 segment, or None."""
    if raw[:2] != JPEG_SOI:
        return None
    i, n = 2, len(raw)
    while i < n - 1:
        if raw[i] != 0xFF:
            return None
        marker = raw[i + 1]
        if marker == 0xDA:
            return None
        if i + 4 > n:
            return None
        seg_len = struct.unpack(">H", raw[i + 2:i + 4])[0]
        if marker == 0xE1 and raw[i + 4:i + 10] == b"Exif\x00\x00":
            return raw[i + 10:i + 2 + seg_len]
        i += 2 + seg_len
    return None


def _ifd_find(exif, offset, want_tag, end):
    """The value of one tag in one directory, for the pointer tags only."""
    count = struct.unpack(end + "H", exif[offset:offset + 2])[0]
    for k in range(count):
        e = offset + 2 + k * 12
        tag = struct.unpack(end + "H", exif[e:e + 2])[0]
        if tag == want_tag:
            return struct.unpack(end + "I", exif[e + 8:e + 12])[0]
    return None


# Bytes per TIFF type code, for the handful this needs.
_TYPE_SIZE = {1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8}


def _entry_bytes(exif, e, end):
    """The raw value of one IFD entry, wherever TIFF chose to put it.

    This is the rule that broke the first version: a value of four bytes or
    fewer is stored INLINE in the entry, and only a longer one is stored at an
    offset. "N\\0" for a hemisphere is two bytes, so it is inline, reading it
    as a pointer sent the parser off to a random offset and every western
    longitude came back positive, putting Seattle in China."""
    typ, count = struct.unpack(end + "HI", exif[e + 2:e + 8])
    size = _TYPE_SIZE.get(typ, 0) * count
    if size == 0:
        return b""
    if size <= 4:
        return exif[e + 8:e + 8 + size]
    off = struct.unpack(end + "I", exif[e + 8:e + 12])[0]
    return exif[off:off + size]


def _coord(exif, gps_off, tag, ref_tag, end):
    """One GPS coordinate, as signed decimal degrees."""
    count = struct.unpack(end + "H", exif[gps_off:gps_off + 2])[0]
    dms = ref = None
    for k in range(count):
        e = gps_off + 2 + k * 12
        t = struct.unpack(end + "H", exif[e:e + 2])[0]
        if t == tag:
            blob = _entry_bytes(exif, e, end)
            if len(blob) < 24:                       # three rationals
                return None
            parts = []
            for j in range(3):
                num, den = struct.unpack(end + "II", blob[j * 8:j * 8 + 8])
                parts.append(num / den if den else 0.0)
            dms = parts
        elif t == ref_tag:
            ref = _entry_bytes(exif, e, end)[:1].decode("ascii", "ignore")
    if not dms:
        return None
    deg = dms[0] + dms[1] / 60.0 + dms[2] / 3600.0
    if ref and ref.upper() in ("S", "W"):
        deg = -deg
    return deg
