#!/usr/bin/env python3
"""Encode a captured PNG frame sequence into a silent looping animation.

Why this exists
---------------
198x/decisions/capturing-published-software.md permits exactly one moving-image
form for published software: a silent looping animation, delivered as animated
WebP from a captured PNG frame sequence. Video is excluded — not because motion
is a problem, but because the container carries an audio track, and audio is the
one thing that decision rules out outright.

The pipeline could not produce that format. `code-samples/_capture/capture.py`
emits MP4 and nothing else, which left the only permitted format unbuildable and
the forbidden one a single manifest line away. The decision names that exact
arrangement as a drift trigger:

    Reaching for MP4 ... because the pipeline's `record_video` was already there
    and emitting a frame sequence was more work. That convenience is exactly how
    the audio rule gets bypassed without anyone deciding to bypass it.

So this closes the gap from the permitted side rather than policing the other.

The format is the enforcement
-----------------------------
WebP has no audio track. Not "we remember to strip it" — the container cannot
carry one. That is why the decision chose it over "MP4 with the audio removed",
and why this tool needs no audio check: there is nothing to check.

Frame rate
----------
Captures run at the machine's real field rate and are encoded at it. 50Hz PAL is
20ms per frame exactly. 60Hz NTSC is 16.67ms and WebP frame durations are whole
milliseconds, so it encodes at 17ms — 58.8Hz, a 2% slow drift. That is recorded
rather than hidden, and it is still far better than halving the rate, which the
decision forbids outright for subjects like flicker where the rate IS the
subject.

Usage
-----
    animate.py encode 'frames/*.png' -o out.webp --hz 50
    animate.py verify out.webp
    animate.py --self-test
"""

import argparse
import glob
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

FIELD_RATES = {50: 20, 60: 17}          # Hz -> frame duration in whole ms


def _require(tool):
    if shutil.which(tool) is None:
        sys.exit(f"{tool} not found. It ships with libwebp (brew install webp).")
    return tool


def encode(frames, out, hz, loop=0):
    """PNG sequence -> animated WebP, lossless, at the machine's field rate."""
    if hz not in FIELD_RATES:
        sys.exit(f"--hz must be one of {sorted(FIELD_RATES)}; got {hz}")
    if len(frames) < 2:
        sys.exit(f"an animation needs at least two frames; got {len(frames)}")

    duration = FIELD_RATES[hz]
    cmd = [_require("img2webp"), "-loop", str(loop)]
    for frame in frames:
        # Lossless per frame: these are flat-palette machine pixels, and lossy
        # encoding smears dithering — the same failure that washed out the
        # earlier MP4 captures before yuv444p/crf12 fixed them.
        cmd += ["-d", str(duration), "-lossless", str(frame)]
    cmd += ["-o", str(out)]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"img2webp failed:\n{result.stderr}")

    # Read the encoded durations back rather than trusting the encoder. This is
    # not ceremony: img2webp coalesces identical consecutive frames, so the
    # chunk count is legitimately lower than the source frame count. That is
    # only correct if the durations were summed. An encoder that dropped frames
    # without summing would produce an animation that runs fast, which for a
    # subject like flicker misrepresents the hardware — precisely what the
    # decision forbids when it rules out halving the frame rate.
    expected_ms = len(frames) * duration
    chunks, actual_ms = _durations(out)
    if actual_ms != expected_ms:
        sys.exit(
            f"{out}: encoded to {actual_ms}ms but the source is {expected_ms}ms "
            f"({len(frames)} frames x {duration}ms). Frames were dropped without "
            f"their time being carried over; the animation would play fast."
        )

    coalesced = len(frames) - chunks
    note = f", {coalesced} duplicate frame(s) coalesced" if coalesced else ""
    size_kb = Path(out).stat().st_size / 1024
    print(f"{out}: {len(frames)} source frames at {duration}ms ({hz}Hz) -> "
          f"{chunks} chunk(s){note}, {actual_ms/1000:.2f}s loop, {size_kb:.0f} KB")
    return out


def _durations(path):
    """(frame chunk count, total duration in ms) read back from the file."""
    out = subprocess.run([_require("webpinfo"), str(path)],
                         capture_output=True, text=True)
    total, chunks = 0, 0
    for line in out.stdout.splitlines():
        if "Duration:" in line:
            total += int(line.rsplit(None, 1)[-1])
        if "Chunk ANMF" in line:
            chunks += 1
    return chunks, total


def verify(path):
    """Confirm the file really is an animation, and say what it contains."""
    out = subprocess.run([_require("webpinfo"), str(path)],
                         capture_output=True, text=True)
    if out.returncode != 0:
        print(f"{path}: webpinfo rejected this file\n{out.stdout}{out.stderr}")
        return 1

    text = out.stdout
    chunks, total_ms = _durations(path)
    if "Chunk ANIM" not in text or chunks < 2:
        print(f"{path}: NOT an animation — {chunks} frame chunk(s) found. "
              f"A still published as an animation is a mistake in both directions.")
        return 1

    print(f"{path}: animated WebP, {chunks} frame chunk(s), {total_ms/1000:.2f}s.")
    print(f"  At 50Hz that is {total_ms // 20} fields of machine time. Chunks can be "
          f"fewer than captured frames: identical consecutive frames are coalesced "
          f"and their durations summed, so the run time is preserved.")
    print("  Audio: impossible — the WebP container has no audio track, which is "
          "why the decision chose this format over stripping it from an MP4.")
    return 0


def self_test():
    """Prove the encoder produces a real animation from known input.

    Same reasoning as verify-clash.py's controls: a tool nobody has watched
    succeed is a tool that reports success on everything.
    """
    from PIL import Image
    tmp = Path(tempfile.mkdtemp(prefix="animate-selftest-"))
    frames = []
    for i in range(4):
        im = Image.new("RGB", (64, 48), (0, 0, 0))
        for y in range(48):
            for x in range(i * 8, i * 8 + 8):
                im.putpixel((x, y), (255, 255, 255))
        path = tmp / f"f{i:02d}.png"
        im.save(path)
        frames.append(path)

    out = tmp / "selftest.webp"
    encode(frames, out, hz=50)
    if verify(out) != 0:
        print("self-test FAIL — encoder did not produce a verifiable animation")
        return 1
    print("self-test PASS — four frames in, four-frame animation out")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd")

    enc = sub.add_parser("encode", help="PNG frame sequence -> animated WebP")
    enc.add_argument("frames", nargs="+", help="frame paths or a glob")
    enc.add_argument("-o", "--out", required=True)
    enc.add_argument("--hz", type=int, default=50, help="50 (PAL) or 60 (NTSC)")
    enc.add_argument("--loop", type=int, default=0, help="0 = forever")

    ver = sub.add_parser("verify", help="confirm a file is a real animation")
    ver.add_argument("path")

    ap.add_argument("--self-test", action="store_true",
                    help="prove the encoder works against known input")
    args = ap.parse_args()

    if args.self_test:
        return self_test()
    if args.cmd == "encode":
        paths = sorted(p for pattern in args.frames for p in glob.glob(pattern)) \
            or sorted(Path(p) for p in args.frames if Path(p).exists())
        encode([Path(p) for p in paths], Path(args.out), args.hz, args.loop)
        return 0
    if args.cmd == "verify":
        return verify(Path(args.path))
    ap.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
