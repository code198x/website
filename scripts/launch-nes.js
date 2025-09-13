#!/usr/bin/env node

// NES Emulator Launcher
// Provides instructions for running NES ROMs

const path = require("path");
const fs = require("fs");

function main() {
  const programPath = process.argv[2];

  if (!programPath) {
    console.log("❌ No ROM specified");
    process.exit(1);
  }

  console.log("🎮 Nintendo Entertainment System ROM Launcher");
  console.log("═══════════════════════════════════════════════");
  console.log();

  if (!fs.existsSync(programPath)) {
    console.log(`❌ ROM not found: ${programPath}`);
    console.log();
    console.log("💡 Build your ROM first:");
    console.log(`   make build-nes PROJECT=path/to/your/project`);
    process.exit(1);
  }

  const ext = path.extname(programPath).toLowerCase();

  if (ext !== ".nes") {
    console.log(`❌ Invalid file format: ${ext}`);
    console.log("   NES ROMs must have .nes extension");
    process.exit(1);
  }

  console.log(`📁 ROM: ${programPath}`);
  console.log(`📦 Format: iNES ROM file`);

  // Check ROM size
  const stats = fs.statSync(programPath);
  const romSize = stats.size;
  console.log(`📏 Size: ${romSize} bytes`);

  // Basic ROM validation
  const buffer = fs.readFileSync(programPath);
  const header = buffer.slice(0, 4);
  const isValidNES = header.toString() === "NES\x1a";

  if (!isValidNES) {
    console.log("⚠️  Warning: Invalid iNES header detected");
  } else {
    const prgBanks = buffer[4];
    const chrBanks = buffer[5];
    console.log(`🏦 PRG Banks: ${prgBanks} (${prgBanks * 16}KB)`);
    console.log(`🎨 CHR Banks: ${chrBanks} (${chrBanks * 8}KB)`);
  }

  console.log();
  console.log("🚀 To run this ROM:");
  console.log();

  console.log("   Option 1 - FCEux (Recommended):");
  console.log(`   fceux "${programPath}"`);
  console.log();

  console.log("   Option 2 - Nestopia:");
  console.log(`   nestopia "${programPath}"`);
  console.log();

  console.log("   Option 3 - Mesen (High accuracy):");
  console.log(`   mesen "${programPath}"`);
  console.log();

  console.log("   Option 4 - Online emulator:");
  console.log("   Visit: https://jsnes.org");
  console.log("   Or: https://tetris.com/play-tetris");
  console.log();

  console.log("   Option 5 - Browser (JSNES):");
  console.log("   Visit: https://fir.sh/projects/jsnes/");

  console.log();
  console.log("📖 Emulator Installation:");
  console.log("   • FCEux:");
  console.log("     - macOS: brew install fceux");
  console.log("     - Ubuntu: sudo apt install fceux");
  console.log("     - Windows: Download from fceux.com");
  console.log();
  console.log("   • Nestopia:");
  console.log("     - macOS: brew install nestopia-ue");
  console.log("     - Ubuntu: sudo apt install nestopia");
  console.log();
  console.log("   • Mesen:");
  console.log("     - Download from github.com/SourMesen/Mesen");
  console.log();
  console.log("⚡ Quick Test:");
  console.log("   If FCEux is installed, run:");
  console.log(`   fceux "${programPath}"`);
  console.log();
  console.log("🎯 Controls:");
  console.log("   Arrow Keys: D-Pad");
  console.log("   Z: A Button");
  console.log("   X: B Button");
  console.log("   Enter: Start");
  console.log("   Right Shift: Select");
}

if (require.main === module) {
  main();
}
