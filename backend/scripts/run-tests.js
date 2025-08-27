#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Running YaYa Wallet API Tests...\n');

const jest = spawn('npx', ['jest', '--verbose', '--colors'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

jest.on('close', (code) => {
  process.exit(code);
});