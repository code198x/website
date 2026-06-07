/**
 * Load Code198x custom languages into shiki-highlight-api
 */
import { loadCustomLanguage, loadBundledLanguage } from 'shiki-highlight-api';
import asmLang from 'shiki/langs/asm.mjs';

// Import custom grammars
import basicGrammar from '../syntax/basic.tmLanguage.json';
import asm6502Grammar from '../syntax/6502.tmLanguage.json';
import amosGrammar from '../syntax/amos.tmLanguage.json';
import sinclairBasicGrammar from '../syntax/sinclair-basic.tmLanguage.json';
import ca65Grammar from '../syntax/ca65.tmLanguage.json';
import z80Grammar from '../syntax/z80.tmLanguage.json';
import m68kGrammar from '../syntax/m68k.tmLanguage.json';

/**
 * Load all Code198x custom languages
 * Call this once at startup before using codeToHighlightHtml
 */
export async function loadCode198xLanguages() {
  // Load C64 BASIC
  await loadCustomLanguage({
    ...basicGrammar,
    name: 'basic',
  });

  // Aliases for C64 BASIC — parity with the markdown shiki config in
  // astro.config.mjs (aliases: ['c64basic', 'commodore-basic']). Registered
  // as re-named copies, the same way '68000' aliases m68k below, so a
  // descriptive `lang="commodore-basic"` works in CodeFromFile / CodeDiff
  // just as `lang="sinclair-basic"` does for the Spectrum.
  await loadCustomLanguage({
    ...basicGrammar,
    name: 'commodore-basic',
  });
  await loadCustomLanguage({
    ...basicGrammar,
    name: 'c64basic',
  });

  // Load 6502 Assembly
  await loadCustomLanguage({
    ...asm6502Grammar,
    name: '6502',
  });

  // Load AMOS BASIC
  await loadCustomLanguage({
    ...amosGrammar,
    name: 'amos',
  });

  // Load Sinclair BASIC
  await loadCustomLanguage({
    ...sinclairBasicGrammar,
    name: 'sinclair-basic',
  });

  // Load ca65 Assembly
  await loadCustomLanguage({
    ...ca65Grammar,
    name: 'ca65',
  });

  // Load Z80 Assembly (ZX Spectrum)
  await loadCustomLanguage({
    ...z80Grammar,
    name: 'z80',
  });

  // Load M68K Assembly (Amiga)
  await loadCustomLanguage({
    ...m68kGrammar,
    name: 'm68k',
  });

  // Alias for legacy language tag used in content
  await loadCustomLanguage({
    ...m68kGrammar,
    name: '68000',
  });

  // Load Shiki's built-in 'asm' language using the new helper
  await loadBundledLanguage('asm');

  // Create 'nasm' alias for asm language
  // Note: Using static import to avoid Vite build race conditions
  // TODO: Replace with createBundledLanguageAlias('asm', 'nasm') once available
  await loadCustomLanguage({
    ...asmLang[0],
    name: 'nasm',
  });
}
