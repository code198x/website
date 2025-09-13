/**
 * Prism 68000 Assembly Language Definition
 * For Commodore Amiga assembly code highlighting
 */

Prism.languages.m68k = {
  comment: /;.*/,
  directive: {
    pattern:
      /\b(?:ORG|DC|DS|EQU|INCLUDE|INCDIR|SECTION|XDEF|XREF|END|ALIGN|EVEN|ODD|REPT|ENDR|IF|ELSE|ENDIF|IFNE|IFEQ|IFGT|IFGE|IFLT|IFLE|IFDEF|IFNDEF|MACRO|ENDM)\b/i,
    alias: "property",
  },
  string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
  "op-code": {
    pattern:
      /\b(?:ABCD|ADD|ADDA|ADDI|ADDQ|ADDX|AND|ANDI|ASL|ASR|BCC|BCS|BEQ|BGE|BGT|BHI|BLE|BLS|BLT|BMI|BNE|BPL|BRA|BSR|BTST|BVC|BVS|CHK|CLR|CMP|CMPA|CMPI|CMPM|DBCC|DBCS|DBEQ|DBF|DBGE|DBGT|DBHI|DBLE|DBLS|DBLT|DBMI|DBNE|DBPL|DBRA|DBT|DBVC|DBVS|DIVS|DIVU|EOR|EORI|EXG|EXT|ILLEGAL|JMP|JSR|LEA|LINK|LSL|LSR|MOVE|MOVEA|MOVEM|MOVEP|MOVEQ|MULS|MULU|NBCD|NEG|NEGX|NOP|NOT|OR|ORI|PEA|RESET|ROL|ROR|ROXL|ROXR|RTE|RTR|RTS|SBCD|SCC|SCS|SEQ|SF|SGE|SGT|SHI|SLE|SLS|SLT|SMI|SNE|SPL|ST|STOP|SUB|SUBA|SUBI|SUBQ|SUBX|SVC|SVS|SWAP|TAS|TRAP|TRAPV|TST|UNLK|abcd|add|adda|addi|addq|addx|and|andi|asl|asr|bcc|bcs|beq|bge|bgt|bhi|ble|bls|blt|bmi|bne|bpl|bra|bsr|btst|bvc|bvs|chk|clr|cmp|cmpa|cmpi|cmpm|dbcc|dbcs|dbeq|dbf|dbge|dbgt|dbhi|dble|dbls|dblt|dbmi|dbne|dbpl|dbra|dbt|dbvc|dbvs|divs|divu|eor|eori|exg|ext|illegal|jmp|jsr|lea|link|lsl|lsr|move|movea|movem|movep|moveq|muls|mulu|nbcd|neg|negx|nop|not|or|ori|pea|reset|rol|ror|roxl|roxr|rte|rtr|rts|sbcd|scc|scs|seq|sf|sge|sgt|shi|sle|sls|slt|smi|sne|spl|st|stop|sub|suba|subi|subq|subx|svc|svs|swap|tas|trap|trapv|tst|unlk)\b/,
    alias: "keyword",
  },
  "size-suffix": {
    pattern: /\.[bwl]\b/i,
    alias: "operator",
  },
  register: {
    pattern: /\b(?:D[0-7]|A[0-7]|SP|PC|SR|CCR|USP|d[0-7]|a[0-7]|sp|pc|sr|ccr|usp)\b/,
    alias: "variable",
  },
  "hex-number": {
    pattern: /#?\$[\da-f]{1,8}\b|0x[\da-f]{1,8}\b/i,
    alias: "number",
  },
  "binary-number": {
    pattern: /#?%[01]+\b|0b[01]+\b/,
    alias: "number",
  },
  "decimal-number": {
    pattern: /#?\b\d+\b/,
    alias: "number",
  },
  label: {
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*:/m,
    alias: "function",
  },
  "addressing-mode": {
    pattern: /\([aA][0-7](?:\+|\-)?[\da-fA-F$%]*\)|#[\da-fA-F$%]+/,
    alias: "important",
  },
  punctuation: /[(),:]/,
};
