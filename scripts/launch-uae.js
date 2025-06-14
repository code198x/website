#!/usr/bin/env node

// UAE Amiga Emulator Launcher
// Provides instructions for running Amiga programs

const path = require('path');
const fs = require('fs');

function main() {
    const programPath = process.argv[2];
    
    if (!programPath) {
        console.log('❌ No program specified');
        process.exit(1);
    }

    console.log('🟦 Commodore Amiga Program Launcher');
    console.log('═══════════════════════════════════════');
    console.log();
    
    if (!fs.existsSync(programPath)) {
        console.log(`❌ Program not found: ${programPath}`);
        console.log();
        console.log('💡 Build your program first:');
        console.log(`   make build-amiga PROJECT=path/to/your/project`);
        process.exit(1);
    }

    const ext = path.extname(programPath).toLowerCase();
    
    console.log(`📁 Program: ${programPath}`);
    console.log(`📦 Format: ${ext ? ext.toUpperCase() + ' file' : 'Amiga executable'}`);
    console.log();
    
    console.log('🚀 To run this program:');
    console.log();
    
    if (ext === '.adf') {
        console.log('   Option 1 - FS-UAE (Recommended):');
        console.log(`   fs-uae --floppy_drive_0="${programPath}"`);
        console.log('   Boot from floppy and run your program');
        console.log();
        console.log('   Option 2 - WinUAE/E-UAE:');
        console.log(`   Load "${programPath}" into DF0:`);
        console.log('   Boot and navigate to your program');
    } else {
        console.log('   Option 1 - FS-UAE with Workbench:');
        console.log('   1. Start FS-UAE with Workbench disk');
        console.log('   2. Copy your executable to the virtual Amiga');
        console.log('   3. Double-click to run, or use CLI');
        console.log();
        console.log('   Option 2 - Direct execution (requires AmigaOS):');
        console.log('   1. Mount a directory containing your program');
        console.log('   2. Open CLI/Shell on Amiga');
        console.log(`   3. Type: ${path.basename(programPath, ext)}`);
        console.log();
        console.log('   Option 3 - Create ADF disk:');
        console.log(`   make build-amiga-disk PROJECT=path/to/your/project`);
        console.log('   Then use the .adf file');
    }
    
    console.log();
    console.log('📖 Emulator Installation:');
    console.log('   • FS-UAE (Recommended):');
    console.log('     - macOS: brew install fs-uae');
    console.log('     - Ubuntu: sudo apt install fs-uae');
    console.log('     - Windows: Download from fs-uae.net');
    console.log();
    console.log('   • AMIBERRY (Raspberry Pi):');
    console.log('     - GitHub: github.com/midwan/amiberry');
    console.log();
    console.log('   • vAmiga (macOS):');
    console.log('     - GitHub: github.com/dirkwhoffmann/vAmiga');
    console.log();
    console.log('⚡ Quick Setup:');
    console.log('   1. Download Workbench 1.3 ADF (legally obtained)');
    console.log('   2. Start FS-UAE:');
    console.log('      fs-uae --floppy_drive_0="workbench13.adf"');
    console.log('   3. Transfer your program to the virtual Amiga');
    console.log();
    console.log('🖥️  Amiga System Requirements:');
    console.log('   • CPU: 68000 (7.16 MHz)');
    console.log('   • RAM: 512KB Chip RAM minimum');
    console.log('   • Kickstart ROM required for emulation');
    console.log();
    console.log('💾 File Formats:');
    console.log('   • Executable: Direct Amiga binary');
    console.log('   • ADF: Amiga Disk File (floppy image)');
    console.log('   • HDF: Hard Disk File');
    console.log();
    
    if (ext === '') {
        console.log('🔧 Your executable is ready to run on:');
        console.log('   • Real Amiga hardware');
        console.log('   • Any Amiga emulator with Kickstart ROM');
        console.log('   • MiSTer FPGA Amiga core');
    }
}

if (require.main === module) {
    main();
}