/**
 * Prism Z80 Assembly Language Definition
 * For ZX Spectrum assembly code highlighting
 */

Prism.languages.z80 = {
	'comment': /;.*/,
	'directive': {
		pattern: /\b(?:ORG|DEFB|DEFW|DEFS|EQU|INCLUDE|INCBIN|END|ALIGN|PHASE|DEPHASE|IF|ELSE|ENDIF|IFDEF|IFNDEF|MACRO|ENDM)\b/i,
		alias: 'property'
	},
	'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
	'op-code': {
		pattern: /\b(?:ADC|ADD|AND|BIT|CALL|CCF|CP|CPD|CPDR|CPI|CPIR|CPL|DAA|DEC|DI|DJNZ|EI|EX|EXX|HALT|IM|IN|INC|IND|INDR|INI|INIR|JP|JR|LD|LDD|LDDR|LDI|LDIR|NEG|NOP|OR|OTDR|OTIR|OUT|OUTD|OUTI|POP|PUSH|RES|RET|RETI|RETN|RL|RLA|RLC|RLCA|RLD|RR|RRA|RRC|RRCA|RRD|RST|SBC|SCF|SET|SLA|SLL|SRA|SRL|SUB|XOR|adc|add|and|bit|call|ccf|cp|cpd|cpdr|cpi|cpir|cpl|daa|dec|di|djnz|ei|ex|exx|halt|im|in|inc|ind|indr|ini|inir|jp|jr|ld|ldd|lddr|ldi|ldir|neg|nop|or|otdr|otir|out|outd|outi|pop|push|res|ret|reti|retn|rl|rla|rlc|rlca|rld|rr|rra|rrc|rrca|rrd|rst|sbc|scf|set|sla|sll|sra|srl|sub|xor)\b/,
		alias: 'keyword'
	},
	'condition': {
		pattern: /\b(?:NZ|Z|NC|C|PO|PE|P|M|nz|z|nc|c|po|pe|p|m)\b/,
		alias: 'builtin'
	},
	'register': {
		pattern: /\b(?:A|B|C|D|E|F|H|L|AF|BC|DE|HL|SP|PC|IX|IY|IXH|IXL|IYH|IYL|a|b|c|d|e|f|h|l|af|bc|de|hl|sp|pc|ix|iy|ixh|ixl|iyh|iyl)\b/,
		alias: 'variable'
	},
	'hex-number': {
		pattern: /#?\$[\da-f]{1,4}\b|0x[\da-f]{1,4}\b/i,
		alias: 'number'
	},
	'binary-number': {
		pattern: /#?%[01]+\b|0b[01]+\b/,
		alias: 'number'
	},
	'decimal-number': {
		pattern: /#?\b\d+\b/,
		alias: 'number'
	},
	'label': {
		pattern: /^[a-zA-Z_][a-zA-Z0-9_]*:/m,
		alias: 'function'
	},
	'punctuation': /[(),:]/
};