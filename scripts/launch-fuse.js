#!/usr/bin/env node

// Fuse ZX Spectrum Emulator Launcher
// Provides instructions for running ZX Spectrum programs

const path = require("path");
const fs = require("fs");

function main() {
  const programPath = process.argv[2];

  if (!programPath) {
    console.log("❌ No program specified");
    process.exit(1);
  }

  console.log("🌈 ZX Spectrum Program Launcher");
  console.log("═══════════════════════════════════");
  console.log();

  if (!fs.existsSync(programPath)) {
    console.log(`❌ Program not found: ${programPath}`);
    console.log();
    console.log("💡 Build your program first:");
    console.log(`   make build-spectrum PROJECT=path/to/your/project`);
    process.exit(1);
  }

  const ext = path.extname(programPath).toLowerCase();

  console.log(`📁 Program: ${programPath}`);
  console.log(`📦 Format: ${ext.toUpperCase()} file`);
  console.log();

  console.log("🚀 To run this program:");
  console.log();

  if (ext === ".tap") {
    console.log("   Option 1 - Fuse Emulator:");
    console.log(`   fuse --tape "${programPath}"`);
    console.log('   Then type: LOAD ""');
    console.log("   And: RUN");
    console.log();
    console.log("   Option 2 - Online emulator:");
    console.log("   Visit: https://torinak.com/qaop");
    console.log("   Load your .TAP file");
  } else if (ext === ".tzx") {
    console.log("   Option 1 - Fuse Emulator:");
    console.log(`   fuse --tape "${programPath}"`);
    console.log("   Enhanced tape format with better compatibility");
    console.log();
    console.log("   Option 2 - ZEsarUX Emulator:");
    console.log(`   zesarux --tape "${programPath}"`);
  } else if (ext === ".sna") {
    console.log("   Option 1 - Fuse Emulator:");
    console.log(`   fuse "${programPath}"`);
    console.log("   Snapshot will load immediately");
    console.log();
    console.log("   Option 2 - Online emulator:");
    console.log("   Visit: https://torinak.com/qaop");
    console.log("   Load your .SNA snapshot");
  } else if (ext === ".z80") {
    console.log("   Option 1 - Fuse Emulator:");
    console.log(`   fuse "${programPath}"`);
    console.log("   Z80 snapshot format");
  }

  console.log();
  console.log("📖 Emulator Installation:");
  console.log("   • Fuse (recommended): ");
  console.log("     - macOS: brew install fuse-emulator");
  console.log("     - Ubuntu: sudo apt install fuse-emulator-utils");
  console.log("     - Windows: Download from fuse-emulator.sourceforge.net");
  console.log();
  console.log("   • ZEsarUX (alternative):");
  console.log("     - Download from github.com/chernandezba/zesarux");
  console.log();
  console.log("⚡ Quick Test:");
  console.log("   If Fuse is installed, run:");
  console.log(`   fuse --tape "${programPath}"`);
  console.log('   Then: LOAD "" CODE');
  console.log("   And: RANDOMIZE USR 32768");
}

if (require.main === module) {
  main();
}
