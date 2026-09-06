#!/usr/bin/env python3
"""An original disco fanfare for the front of a guide. Nobody else's record.

Four bars at 118bpm: four-on-the-floor kick, hats open on the offbeat, an
octave bass and brass stabs over a plain I IV V I. Every sound is synthesised
here from oscillators and noise, so the file owes nothing to anyone.

Mixed in stems and balanced by measured band energy, because the thing has to
read on a phone speaker that cannot reproduce a kick drum at all. The brass
carries the tune; the low end is only there to push it.
"""
import numpy as np
from scipy.signal import butter, lfilter
import wave

SR = 44100
BPM = 118.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
BARS = 4
TAIL = 0.75          # the landing chord rings to 8.2s; do not sit in silence after it
DUR = BARS * BAR + TAIL
N = int(DUR * SR)

rng = np.random.default_rng(11)
at = lambda t: int(t * SR)


def butt(sig, cut, kind, order=4):
    if kind == "band":
        b, a = butter(order, [cut[0] / (SR / 2), min(cut[1] / (SR / 2), .99)], btype="band")
    else:
        b, a = butter(order, min(cut / (SR / 2), .99), btype=kind)
    return lfilter(b, a, sig)


lp = lambda s, c, o=4: butt(s, c, "low", o)
hp = lambda s, c, o=4: butt(s, c, "high", o)
bp = lambda s, l, h: butt(s, (l, h), "band")


def env(length, attack, decay, curve=4.0, hold=0.0):
    m = int(length * SR)
    e = np.zeros(m)
    a = max(1, int(attack * SR))
    h = int(hold * SR)
    e[:a] = np.linspace(0, 1, a)
    e[a:a + h] = 1.0
    rest = m - a - h
    if rest > 0:
        e[a + h:] = np.exp(-curve * (np.arange(rest) / SR) / max(decay, 1e-6))
    return e


class Stem:
    def __init__(self):
        self.buf = np.zeros(N)

    def add(self, sig, t, g=1.0):
        i = at(t); j = min(N, i + len(sig))
        if j > i:
            self.buf[i:j] += sig[:j - i] * g


# ------------------------------------------------------------------ voices
def kick(length=0.26):
    t = np.arange(int(length * SR)) / SR
    f = 52 + (135 - 52) * np.exp(-34 * t)          # tight, not a sub bomb
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-11 * t)
    beater = bp(rng.normal(0, 1, len(t)), 1400, 5000) * np.exp(-190 * t) * 0.5
    return body * 0.85 + beater


def hat(length, decay, tone=5200, g=1.0):
    t = np.arange(int(length * SR)) / SR
    s = hp(rng.normal(0, 1, len(t)), tone, 6)
    return s * np.exp(-t / decay) * g


def clap():
    t = np.arange(int(0.36 * SR)) / SR
    noise = bp(rng.normal(0, 1, len(t)), 1100, 4200)
    e = np.zeros(len(t))
    for off, g in ((0.0, 1.0), (0.011, .9), (0.022, .78), (0.033, .6)):
        i = at(off)
        e[i:] += np.exp(-150 * t[:len(t) - i]) * g
    e += np.exp(-14 * t) * 0.5
    return noise * e


def saw(freq, length, detune=0.0, top=10):
    t = np.arange(int(length * SR)) / SR
    f = freq * (1 + detune)
    s = np.zeros(len(t))
    for k in range(1, top + 1):
        if f * k > 14000: break
        s += np.sin(2 * np.pi * f * k * t) / k
    return s * (2 / np.pi)


def bass(freq, length):
    t = np.arange(int(length * SR)) / SR
    s = saw(freq, length, top=12) * .75 + np.sin(2 * np.pi * freq * t) * .55
    s = lp(s, 2400)                                  # keep the bite, it is what phones hear
    s = hp(s, 55)
    return s * env(length, .006, .13, 3.2, hold=.02)


def brass(freqs, length, attack=.028, decay=.40, curve=3.0, hold=0.0):
    out = np.zeros(int(length * SR))
    for f in freqs:
        for d in (-.007, 0.0, .007):
            out += saw(f, length, d, top=18)
    out /= len(freqs) ** 0.5 * 3                     # keep a big chord loud
    t = np.arange(len(out)) / SR
    e = env(length, attack, decay, curve, hold)
    bright = lp(out, 7600)
    dark = lp(out, 2300)
    blend = np.clip(np.exp(-6 * t / max(decay, .01)), 0, 1)   # opens then settles
    out = bright * blend + dark * (1 - blend)
    out *= 1 + .035 * np.sin(2 * np.pi * 5.4 * t)
    return out * e


# ------------------------------------------------------------------- notes
D4, Fs4, A4, D5, Fs5 = 293.66, 369.99, 440.00, 587.33, 739.99
G4, B4, G5 = 392.00, 493.88, 783.99
A4_, Cs5, E5, A5 = 440.00, 554.37, 659.25, 880.00
CH = {"D": [D4, Fs4, A4, D5, Fs5], "G": [G4, B4, D5, G5], "A": [A4_, Cs5, E5, A5]}
ROOT = {"D": 73.42, "G": 98.00, "A": 110.00}
PROG = ["D", "G", "A", "D"]

drums, low, horns, air = Stem(), Stem(), Stem(), Stem()

# drums: hold the kick back for the opening hit, then drive
for b in range(BARS * 4):
    t = b * BEAT
    if b >= 1:
        drums.add(kick(), t, 1.0)
    air.add(hat(.055, .018), t, .55)
    air.add(hat(.34, .095, 4300), t + BEAT / 2, .8)
    if b % 2 == 1:
        drums.add(clap(), t, .8)
# a little fill into the last bar
for k, off in enumerate((0.0, .125, .25)):
    drums.add(clap(), 3 * BAR + 3 * BEAT + off, .35 + .2 * k)

# bass from bar 2, so bar 1 is pure fanfare
for bar in range(BARS):
    r = ROOT[PROG[bar]]
    for e8 in range(8):
        if bar == 0 and e8 < 4:
            continue
        t = bar * BAR + e8 * (BEAT / 2)
        low.add(bass(r if e8 % 2 == 0 else r * 2, .23), t, 1.0)

# brass: the tune. big open, answers, held landing chord
horns.add(brass(CH["D"], 1.05, .020, .55, 2.6, hold=.16), 0.0, 1.0)
horns.add(brass(CH["D"], .20, .010, .075), 1.25, .72)
horns.add(brass(CH["D"], .20, .010, .075), 1.50, .62)
horns.add(brass(CH["G"], .62, .018, .30, hold=.06), BAR, .92)
horns.add(brass(CH["G"], .22, .010, .085), BAR + 2 * BEAT, .66)
horns.add(brass(CH["A"], .62, .018, .30, hold=.06), 2 * BAR, .92)
horns.add(brass(CH["A"], .24, .010, .09), 2 * BAR + 2 * BEAT, .70)
horns.add(brass(CH["A"], .24, .010, .09), 2 * BAR + 3 * BEAT, .62)
horns.add(brass(CH["D"], 2.10, .024, 1.15, 2.0, hold=.30), 3 * BAR, 1.15)
air.add(hat(1.8, .55, 3000), 3 * BAR, .5)          # crash under the landing

# ------------------------------------------------- balance by measured band
def band_share(x):
    F = np.abs(np.fft.rfft(x)); f = np.fft.rfftfreq(len(x), 1 / SR)
    e = lambda lo, hi: (F[(f >= lo) & (f < hi)] ** 2).sum()
    tot = e(20, 20000)
    return {k: 100 * e(lo, hi) / tot for k, (lo, hi) in
            {"sub/kick": (20, 120), "bass": (120, 400), "brass/mid": (400, 2000),
             "presence": (2000, 6000), "hats": (6000, 16000)}.items()}


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)))


GAIN = {"drums": .58, "low": .60, "horns": 1.00, "air": .34}
stems = {"drums": drums, "low": low, "horns": horns, "air": air}
for k, s in stems.items():
    s.buf *= GAIN[k] / max(rms(s.buf), 1e-9) * 0.10   # equal-loudness start, then taste

mix = sum(s.buf for s in stems.values())
mix = hp(mix, 42, 2)
mix = mix + butt(mix, (2200, 6000), 'band', 2) * 0.85   # presence, where a phone speaks
mix = mix / np.max(np.abs(mix)) * .93
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
mix[-at(.4):] *= np.linspace(1, 0, at(.4)) ** 1.5
out = np.concatenate([mix, np.zeros(at(.20))])   # a beat before the reader, not a hole

w = wave.open("sting.wav", "wb")
w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes()); w.close()

print(f"wrote sting.wav  {len(out)/SR:.2f}s  peak {np.abs(out).max():.3f}  rms {rms(out):.3f}")
for k, v in band_share(out).items():
    print(f"  {k:11s} {v:5.1f}%")
for k, s in stems.items():
    print(f"  stem {k:6s} rms {rms(s.buf):.4f}")
