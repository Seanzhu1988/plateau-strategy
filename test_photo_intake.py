# -*- coding: utf-8 -*-
"""A visitor's photo must give us the place and tell nobody who they are.

Built against a REAL JPEG assembled here byte by byte, with a real EXIF block
carrying real GPS rationals, a device name and an owner name — not a mock. The
parsing in photo_intake.py is hand-written binary walking with no library
behind it, and the only way to trust that is to feed it the actual format.

The one that matters most is the last: a photo taken at somebody's house must
not be able to publish their address just because the address was never typed
into the form the guard watches.

    python3 test_photo_intake.py
"""
import struct
import sys

import photo_intake as P

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


# --------------------------------------------------------------- build a JPEG
def rational(num, den=1):
    return struct.pack(">II", num, den)


def build_exif(lat_dms, lat_ref, lon_dms, lon_ref, make=b"SecretPhone X9\x00",
               owner=b"Jane Q Photographer\x00"):
    """A big-endian TIFF block with a GPS sub-IFD, a device and an owner."""
    # Layout: header(8) | IFD0 | GPS IFD | value area
    ifd0_off = 8
    ifd0_entries = 3                                  # Make, Artist, GPS pointer
    ifd0_size = 2 + ifd0_entries * 12 + 4
    gps_off = ifd0_off + ifd0_size
    gps_entries = 4
    gps_size = 2 + gps_entries * 12 + 4
    vals_off = gps_off + gps_size

    vals = b""
    make_off = vals_off + len(vals); vals += make
    owner_off = vals_off + len(vals); vals += owner
    lat_off = vals_off + len(vals); vals += b"".join(rational(*p) for p in lat_dms)
    lon_off = vals_off + len(vals); vals += b"".join(rational(*p) for p in lon_dms)

    def entry(tag, typ, count, payload):
        return struct.pack(">HHI", tag, typ, count) + payload

    ifd0 = struct.pack(">H", ifd0_entries)
    ifd0 += entry(0x010F, 2, len(make), struct.pack(">I", make_off))      # Make
    ifd0 += entry(0x013B, 2, len(owner), struct.pack(">I", owner_off))    # Artist
    ifd0 += entry(0x8825, 4, 1, struct.pack(">I", gps_off))               # GPS ptr
    ifd0 += struct.pack(">I", 0)

    # The hemisphere is two bytes, so TIFF stores it INLINE in the entry rather
    # than at an offset — values of four bytes or fewer always are. Writing it
    # as a pointer here is what a camera never does, and building it the wrong
    # way is what let a parser bug (west read as east) pass unnoticed.
    gps = struct.pack(">H", gps_entries)
    gps += entry(0x0001, 2, 2, lat_ref + b"\x00\x00\x00")                 # LatRef
    gps += entry(0x0002, 5, 3, struct.pack(">I", lat_off))                # Lat
    gps += entry(0x0003, 2, 2, lon_ref + b"\x00\x00\x00")                 # LonRef
    gps += entry(0x0004, 5, 3, struct.pack(">I", lon_off))                # Lon
    gps += struct.pack(">I", 0)

    return b"MM\x00\x2a" + struct.pack(">I", ifd0_off) + ifd0 + gps + vals


def build_jpeg(exif):
    app1 = b"Exif\x00\x00" + exif
    out = b"\xff\xd8"
    out += b"\xff\xe1" + struct.pack(">H", len(app1) + 2) + app1          # EXIF
    com = b"taken by Jane at home"
    out += b"\xff\xfe" + struct.pack(">H", len(com) + 2) + com            # comment
    q = bytes(range(64))
    out += b"\xff\xdb" + struct.pack(">H", len(q) + 3) + b"\x00" + q      # a real table
    out += b"\xff\xda\x00\x08\x01\x01\x00\x00\x3f\x00"                    # scan
    out += b"PICTUREBYTES" + b"\xff\xd9"
    return out


# Space Needle, 47.6205 N / 122.3493 W
SPACE_NEEDLE = build_jpeg(build_exif(
    [(47, 1), (37, 1), (1380, 100)], b"N",
    [(122, 1), (20, 1), (5748, 100)], b"W"))

print("the position is readable, so it can place a pin:")
gps = P.read_gps(SPACE_NEEDLE)
chk("GPS comes back (%s)" % (gps,), gps is not None)
if gps:
    chk("latitude is right (%.4f, want ~47.6205)" % gps[0], abs(gps[0] - 47.6205) < 0.01)
    chk("longitude is right and NEGATIVE for west (%.4f, want ~-122.3493)" % gps[1],
        abs(gps[1] - (-122.3493)) < 0.01)

print("\nsouthern and eastern references flip the sign:")
sydney = build_jpeg(build_exif([(33, 1), (51, 1), (2520, 100)], b"S",
                               [(151, 1), (12, 1), (3600, 100)], b"E"))
g = P.read_gps(sydney)
chk("south is negative (%s)" % (g,), g and g[0] < 0)
chk("east is positive", g and g[1] > 0)

print("\nand then it is all thrown away:")
clean = P.strip_metadata(SPACE_NEEDLE, "image/jpeg")
chk("the GPS is gone from the stored file", P.read_gps(clean) is None)
chk("the device name is gone", b"SecretPhone" not in clean)
chk("the owner's name is gone", b"Photographer" not in clean)
chk("the comment is gone", b"taken by Jane at home" not in clean)
chk("no EXIF marker survives", b"Exif\x00\x00" not in clean)

print("\nbut it is still a usable picture:")
chk("it still starts as a JPEG", clean[:2] == b"\xff\xd8")
chk("it still ends as one", clean[-2:] == b"\xff\xd9")
chk("the image data survived", b"PICTUREBYTES" in clean)
chk("the quantisation table survived — dropping it would break decoding",
    b"\xff\xdb" in clean)
chk("and it got smaller (%d -> %d bytes)" % (len(SPACE_NEEDLE), len(clean)),
    len(clean) < len(SPACE_NEEDLE))

print("\nPNG text chunks go too:")
def png_chunk(t, d):
    return struct.pack(">I", len(d)) + t + d + struct.pack(">I", 0)
png = (b"\x89PNG\r\n\x1a\n"
       + png_chunk(b"IHDR", b"\x00" * 13)
       + png_chunk(b"tEXt", b"Author\x00Jane Q Photographer")
       + png_chunk(b"eXIf", b"MM\x00\x2a" + b"\x00" * 20)
       + png_chunk(b"IDAT", b"PIXELDATA")
       + png_chunk(b"IEND", b""))
cleanp = P.strip_metadata(png, "image/png")
chk("the author is gone", b"Photographer" not in cleanp)
chk("the eXIf chunk is gone", b"eXIf" not in cleanp)
chk("the pixels survived", b"PIXELDATA" in cleanp)
chk("it is still a PNG", cleanp[:8] == b"\x89PNG\r\n\x1a\n")

print("\nnothing it cannot read is mangled:")
chk("a file with no metadata is returned untouched",
    P.strip_metadata(b"\xff\xd8\xff\xd9", "image/jpeg") == b"\xff\xd8\xff\xd9")
chk("an unknown format is returned untouched",
    P.strip_metadata(b"NOTANIMAGE", "application/octet-stream") == b"NOTANIMAGE")
chk("truncated input does not raise", P.read_gps(SPACE_NEEDLE[:40]) is None)
chk("empty input does not raise", P.strip_metadata(b"", "") == b"")
chk("a JPEG with no GPS reads as no GPS",
    P.read_gps(b"\xff\xd8\xff\xd9") is None)

print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
sys.exit(1 if fails else 0)
