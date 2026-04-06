#!/bin/bash
set -e
cd /home/a/Interbatch-Coding-2026-25MS/emulator
export PATH=/opt/riscv/bin:$PATH:/usr/lib/emscripten

CC="riscv32-unknown-elf-gcc -O2"
STUBS="syscall_stubs.o syscalls.o"

# Compile stubs
$CC -c syscall_stubs.c -o syscall_stubs.o
$CC -c syscalls.c -o syscalls.o

# Core commands
$CC shell.c $STUBS -o initramfs/elf
$CC ls.c $STUBS -o initramfs/ls
$CC cat.c $STUBS -o initramfs/cat
$CC echo.c $STUBS -o initramfs/echo
$CC mkdir.c $STUBS -o initramfs/mkdir
$CC tree.c $STUBS -o initramfs/tree
$CC cowsay.c $STUBS -o initramfs/cowsay

# New commands
$CC open.c $STUBS -o initramfs/open
$CC neofetch.c $STUBS -o initramfs/neofetch
$CC fortune.c $STUBS -o initramfs/fortune
$CC banner.c $STUBS -o initramfs/banner
$CC weather.c $STUBS -o initramfs/weather
$CC sl.c $STUBS -o initramfs/sl

# Pack initramfs
cd initramfs
rm -f ../../public/initramfs.zip
zip -r ../../public/initramfs.zip .
cd ..

# Build WASM emulator
make clean all
cp emulator.js ../src/emulator-module/
cp emulator.wasm ../public/os/