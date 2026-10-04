"""Compare a browser tape's payload with native assembly, then load it through a fresh ROM."""
import argparse
import hashlib
import importlib.util
import json
import os
import re
import subprocess
from pathlib import Path

WEBSITE = Path(__file__).resolve().parents[2]
SAMPLES = Path(os.environ.get('CODE_SAMPLES_PATH') or WEBSITE.parent / 'code-samples')
helper = SAMPLES / 'sinclair-zx-spectrum/basic/meet-basic/opening/verification/verify.py'
spec = importlib.util.spec_from_file_location('spectrum_transport', helper)
transport = importlib.util.module_from_spec(spec)
spec.loader.exec_module(transport)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--emulator', required=True)
    parser.add_argument('--tape', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    out = args.output.resolve()
    out.mkdir(parents=True, exist_ok=True)
    data = args.tape.read_bytes()
    blocks = []
    cursor = 0
    while cursor < len(data):
        size = int.from_bytes(data[cursor:cursor + 2], 'little')
        block = data[cursor + 2:cursor + 2 + size]
        assert len(block) == size and size >= 2
        checksum = 0
        for byte in block:
            checksum ^= byte
        assert checksum == 0
        blocks.append(block)
        cursor += size + 2
    assert cursor == len(data) and len(blocks) == 4 and blocks[-1][0] == 255
    # The closing lesson (the highest-numbered unit) names the checkpoint its tape holds.
    lessons = WEBSITE / 'src/content/curriculum/sinclair-zx-spectrum/assembly/meteor-storm'
    closing = max(lessons.glob('unit-*.mdx'))
    checkpoint = re.search(r'<MeteorExperiment checkpoint="([^"]+)"', closing.read_text())[1]
    source = SAMPLES / 'sinclair-zx-spectrum/assembly/meteor-storm/checkpoints' / checkpoint / 'meteor-storm.asm'
    subprocess.run(['asm198x', '--dialect', 'pasmo', '--cpu', 'z80', '--sym=' + str(out / 'program.sym'),
                    str(source), '-o', str(out / 'program.bin')], check=True)
    native = (out / 'program.bin').read_bytes()
    assert blocks[-1][1:-1] == native, 'Browser tape machine code differs from native build'
    symbols = {m[1]: int(m[2], 16) for line in (out / 'program.sym').read_text().splitlines()
               if (m := re.match(r'(\w+) = \$(\w+)', line))}
    checks = ['All tape-block checksums pass', 'Browser machine code and assets match native Asm198x byte for byte']
    machine = transport.Spectrum(args.emulator, out)
    try:
        def value(label):
            return machine.call('memory_read', addr=symbols[label], len=1)['bytes'][0]
        machine.call('load_media', slot='tape-1', kind='tape', path=str(args.tape.resolve()))
        machine.statement('LOAD ""')
        machine.call('media_transport', slot='tape-1', transport='start')
        machine.frames(7000)
        assert value('phase') == 0
        assert machine.call('memory_read', addr=32768, len=32)['bytes'] == list(native[:32])
        checks.append('Fresh ROM LOAD reaches the exact program and title')
        machine.call('press_key', key='space', hold_frames=3)
        machine.frames(8)
        assert value('phase') == 1 and value('hull') == 1 and value('ship_x') == 116 and value('storm') == 0
        checks.append('Tape-loaded game launches into the first storm after key release')
        # Colour by place: every cell of each character row holds that row's row_colours byte.
        bands = machine.call('memory_read', addr=symbols['row_colours'], len=24)['bytes']
        # memory_read returns at most 256 bytes, so read the 768-byte map a third at a time.
        attributes = [byte for third in range(3)
                      for byte in machine.call('memory_read', addr=0x5800 + 256 * third, len=256)['bytes']]
        expected = [byte for byte in bands for _ in range(32)]
        wrong = next((cell for cell, (seen, wanted) in enumerate(zip(attributes, expected)) if seen != wanted), None)
        assert len(attributes) == 768 and wrong is None, f'Attribute map differs from row_colours at cell {wrong}'
        checks.append('In flight the attribute map holds row_colours, one byte per character row')
        machine.frames(300)
        assert value('phase') == 2 and value('hull') == 0
        machine.call('press_key', key='r', hold_frames=3)
        machine.frames(8)
        assert value('phase') == 1 and value('hull') == 1
        machine.call('press_key', key='q', hold_frames=3)
        machine.frames(8)
        assert value('phase') == 0
        checks.append('First-hit loss, retry and title return work after real tape loading')
        report = {'method': 'Fresh native 48K ROM tape load, ordinary keyboard and frames, read-only state probes.',
                  'checkpoint': checkpoint,
                  'tape_sha256': hashlib.sha256(data).hexdigest(),
                  'binary_sha256': hashlib.sha256(native).hexdigest(),
                  'emulator_sha256': hashlib.sha256(Path(args.emulator).read_bytes()).hexdigest(), 'checks': checks}
        (out / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
        print('\n'.join(checks))
    finally:
        machine.close()


if __name__ == '__main__':
    main()
