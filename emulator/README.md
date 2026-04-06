# RV32I emulator

This is a basic rv32i emulator. Write, read and exit syscalls have been added for interaction with the virtual machine.

## Dependencies

- C standard library
- riscv elf toolchain (optional) - for running assembly code on the emulator

## Building
```
# Build the emulator
make main

# Build and try to run the emulator (unneeded)
make all
```

## Usage

C:

```
riscv32-unknown-elf-gcc -march=rv32i -mabi=ilp32 -o fib.o -c fib.c # gcc
clang --target=riscv32 -march=rv32i -mabi=ilp32 -o fib.o -c fi.c  # or clang
riscv32-unknown-elf-ld -Ttext=0x0 fib.o -o fib.elf
riscv32-unknown-elf-objcopy -O binary fib.elf fib.bin
```
Check for the location of \_start in the objdump:
```
riscv32-unknown-elf-objdump -d fib.elf
```
```
...
3dc:   00008067                ret

000003e0 <_start>:
 3e0:   ff010113                addi    sp,sp,-16
...
```
Replace `programcounter = load_addr` with `programcounter = <location of _start>` in `void load_binary`. [Build](#building) the emulator and run:
```
./main fib.bin
```

Assembly:

```
riscv32-unknown-elf-as -march=rv32i hello.s -o hello.o
riscv32-unknown-elf-ld hello.o -o hello.elf
riscv32-unknown-elf-objcopy -O binary hello.elf hello.bin
./main test.bin
```
