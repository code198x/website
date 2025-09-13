#!/usr/bin/env node

// VICE C64 Emulator Launcher
// Provides instructions for running C64 programs

const path = require("path");
const fs = require("fs");

function main() {
  const programPath = process.argv[2];

  if (!programPath) {
    console.log("❌ No program specified");
    process.exit(1);
  }

  console.log("🟤 Commodore 64 Program Launcher");
  console.log("═══════════════════════════════════");
  console.log();

  if (!fs.existsSync(programPath)) {
    console.log(`❌ Program not found: ${programPath}`);
    console.log();
    console.log("💡 Build your program first:");
    console.log(`   make build-c64 PROJECT=path/to/your/project`);
    process.exit(1);
  }

  const ext = path.extname(programPath).toLowerCase();

  console.log(`📁 Program: ${programPath}`);
  console.log(`📦 Format: ${ext.toUpperCase()} file`);
  console.log();

  console.log("🚀 To run this program:");
  console.log();

  if (ext === ".prg") {
    console.log("   Option 1 - VICE C64 Emulator:");
    console.log(`   x64 "${programPath}"`);
    console.log();
    console.log("   Option 2 - Online emulator:");
    console.log("   Visit: https://c64online.com");
    console.log("   Upload and run your .PRG file");
  } else if (ext === ".d64") {
    console.log("   Option 1 - VICE C64 Emulator:");
    console.log(`   x64 -8 "${programPath}"`);
    console.log('   Then type: LOAD"*",8,1');
    console.log("   And: RUN");
    console.log();
    console.log("   Option 2 - Online emulator:");
    console.log("   Visit: https://c64online.com");
    console.log("   Upload your .D64 disk image");
  } else if (ext === ".tap") {
    console.log("   Option 1 - VICE C64 Emulator:");
    console.log(`   x64 -1 "${programPath}"`);
    console.log("   Then type: LOAD");
    console.log("   Press PLAY on tape, then RETURN");
    console.log("   When loaded, type: RUN");
  }

  console.log();
  console.log("📖 VICE Emulator Installation:");
  console.log("   • macOS: brew install vice");
  console.log("   • Ubuntu: sudo apt install vice");
  console.log("   • Windows: Download from vice-emu.sourceforge.io");
  console.log();
  console.log("⚡ Quick Test:");
  console.log("   If VICE is installed, run:");
  console.log(`   x64 "${programPath}"`);
}

if (require.main === module) {
  main();
}
