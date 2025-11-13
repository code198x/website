/**
 * Load Code198x custom languages into shiki-highlight-api
 */
import { loadCustomLanguage } from 'shiki-highlight-api';

// Import custom grammars
import basicGrammar from '../syntax/basic.tmLanguage.json';
import asm6502Grammar from '../syntax/6502.tmLanguage.json';
import amosGrammar from '../syntax/amos.tmLanguage.json';
import sinclairBasicGrammar from '../syntax/sinclair-basic.tmLanguage.json';
import ca65Grammar from '../syntax/ca65.tmLanguage.json';

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

  // Load NASM as an alias for Shiki's built-in 'asm' language
  const asmLang = await import('shiki/langs/asm.mjs');
  await loadCustomLanguage({
    ...asmLang.default[0],
    name: 'nasm',
  });
}
