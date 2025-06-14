#!/usr/bin/env node

// Debug Build Process
// Helps diagnose build issues

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function main() {
    console.log('🔧 Code Like It\'s 198x - Build Debugger');
    console.log('═══════════════════════════════════════════');
    console.log();
    
    console.log('📋 System Check:');
    
    // Check Docker
    try {
        const dockerVersion = execSync('docker --version', { encoding: 'utf8' });
        console.log(`✅ Docker: ${dockerVersion.trim()}`);
    } catch (e) {
        console.log('❌ Docker: Not installed or not running');
        console.log('   Install Docker Desktop or Docker Engine');
        return;
    }
    
    // Check Docker Compose
    try {
        const composeVersion = execSync('docker-compose --version', { encoding: 'utf8' });
        console.log(`✅ Docker Compose: ${composeVersion.trim()}`);
    } catch (e) {
        console.log('❌ Docker Compose: Not installed');
        return;
    }
    
    // Check Make
    try {
        const makeVersion = execSync('make --version | head -1', { encoding: 'utf8' });
        console.log(`✅ Make: ${makeVersion.trim()}`);
    } catch (e) {
        console.log('❌ Make: Not installed');
        console.log('   Install build-essential (Linux) or Xcode tools (macOS)');
    }
    
    console.log();
    console.log('🐳 Docker Containers:');
    
    const containers = [
        'c64-compiler',
        'zx-spectrum-compiler', 
        'nintendo-entertainment-system-compiler',
        'commodore-amiga-compiler'
    ];
    
    containers.forEach(container => {
        try {
            const result = execSync(`docker-compose ps ${container}`, { encoding: 'utf8' });
            if (result.includes('Up')) {
                console.log(`✅ ${container}: Running`);
            } else {
                console.log(`⚠️  ${container}: Not running`);
            }
        } catch (e) {
            console.log(`❌ ${container}: Not available`);
        }
    });
    
    console.log();
    console.log('📁 Project Structure:');
    
    const requiredPaths = [
        'Makefile',
        'docker-compose.yml',
        'docker/c64/Dockerfile',
        'docker/zx-spectrum/Dockerfile',
        'docker/nintendo-entertainment-system/Dockerfile',
        'docker/commodore-amiga/Dockerfile'
    ];
    
    requiredPaths.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${filePath}`);
        } else {
            console.log(`❌ ${filePath}: Missing`);
        }
    });
    
    console.log();
    console.log('🛠️  Available Build Commands:');
    console.log('   make setup                  - Initialize development environment');
    console.log('   make test-all              - Test all compilation tools');
    console.log('   make new-c64 NAME=hello    - Create new C64 project');
    console.log('   make build-c64 PROJECT=... - Build C64 project');
    console.log();
    
    console.log('🚨 Common Issues:');
    console.log('   1. Docker not running: Start Docker Desktop');
    console.log('   2. Permission denied: Add user to docker group (Linux)');
    console.log('   3. Port conflicts: Stop other containers');
    console.log('   4. Out of disk space: Clean up with "make clean-docker"');
    console.log();
    
    console.log('📖 Getting Help:');
    console.log('   • Run "make help" for available commands');
    console.log('   • Check CLAUDE.md for project documentation');
    console.log('   • Examples in ./examples/ directory');
    console.log();
    
    console.log('🔍 Environment Variables:');
    console.log(`   USER_ID: ${process.env.USER_ID || 'not set'}`);
    console.log(`   GROUP_ID: ${process.env.GROUP_ID || 'not set'}`);
    console.log(`   DOCKER_BUILDKIT: ${process.env.DOCKER_BUILDKIT || 'not set'}`);
}

if (require.main === module) {
    main();
}