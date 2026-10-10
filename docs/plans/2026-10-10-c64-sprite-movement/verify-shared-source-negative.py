"""Prove the evidence audit rejects a changed shared include at the new pin."""
import argparse
import importlib.util
import re
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--samples', type=Path, required=True)
args = parser.parse_args()
site = Path(__file__).resolve().parents[3]
source = site / 'docs/plans/2026-10-08-pattern-evidence-status/verify.py'
spec = importlib.util.spec_from_file_location('status_check', source)
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
page = (site / 'src/content/patterns/commodore-64/assembly/physics/sprite-movement-bounds.mdx').read_text()
revision = re.search(r'/blob/([0-9a-f]{40})/', page).group(1)
shared = 'commodore-64/patterns/assembly/rendering/hardware-sprites/sprite.inc'
original = module.git_file
injected = []


def changed_shared_file(repository: Path, pin: str, path: str) -> bytes:
    data = original(repository, pin, path)
    if pin == revision and path == shared:
        injected.append(path)
        return data + b'\n; deliberately mismatched pinned source\n'
    return data


module.git_file = changed_shared_file
try:
    module.verify(site, args.samples)
except AssertionError as error:
    assert injected == [shared], f'failed before the shared-source control: {error}'
    assert error.args == (shared,), error
    print(f'PASS: rejected changed shared include at {revision}: {error}')
else:
    raise AssertionError('evidence audit accepted a mismatched shared include')
