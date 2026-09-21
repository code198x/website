"""Reload browser-downloaded tapes through a fresh native Spectrum ROM."""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path

website = Path(__file__).resolve().parents[2]
samples = Path(os.environ.get('CODE_SAMPLES_PATH', website.parent / 'code-samples'))
helper = samples / 'sinclair-zx-spectrum/basic/meet-basic/opening/verification/verify.py'
spec = importlib.util.spec_from_file_location('spectrum_transport', helper)
transport = importlib.util.module_from_spec(spec)
spec.loader.exec_module(transport)
p = argparse.ArgumentParser()
p.add_argument('--emulator', required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
output = a.output.resolve()
reports = []
for name in ['greeting', 'sonar']:
    tape = output / f'{name}.tap'
    machine = transport.Spectrum(a.emulator, output)
    try:
        machine.call('load_media', slot='tape-1', kind='tape', path=str(tape))
        machine.statement('LOAD ""')
        machine.call('media_transport', slot='tape-1', transport='start')
        machine.frames(7000)
        if name == 'greeting':
            machine.check('downloaded-greeting-native', ['TAPE COPY', '0 OK'])
        else:
            machine.check('downloaded-sonar-native', ['SONAR', 'Row (1-8, Q)'])
            machine.key('1'); machine.enter()
            machine.key('1'); machine.enter()
            machine.check('downloaded-sonar-found-native', ['Found!'])
        reports.append({'tape': name, 'sha256': hashlib.sha256(tape.read_bytes()).hexdigest(), 'checks': machine.evidence})
    finally:
        machine.close()
(output/'native-results.json').write_text(json.dumps(reports, indent=2)+'\n')
