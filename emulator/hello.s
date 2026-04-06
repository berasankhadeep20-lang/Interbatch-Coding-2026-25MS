.section .text
.global _start

_start:
  li a0, 1              # fd = stdout
  la a1, msg            # buffer
  li a2, 14             # length
  li a7, 64             # write
  ecall

  li a0, 0              # exit code
  li a7, 93             # exit
  ecall

.section .rodata
msg:
  .ascii "Hello, world!\n"
