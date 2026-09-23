import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(process.env.EMU198X_SOURCE_ROOT || path.join(site,'../../Emu198x/emu198x'));
execFileSync(process.execPath,[path.join(source,'scripts/build-browser-player.mjs'),path.join(site,'public/emulators')],{stdio:'inherit'});
