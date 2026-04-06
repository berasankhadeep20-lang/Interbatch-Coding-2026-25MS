.section .text
.global _start

.macro FAIL
  la a1, fail_msg
  li a0, 1
  li a2, 5
  li a7, 64
  ecall

  # print test number
  mv a0, s11
  li a7, 93     # exit(code = test number)
  ecall
.endm

.macro ASSERT_EQ reg, val
  addi s11, s11, 1
  li t6, \val
  bne \reg, t6, 1f
  j 2f
1:
  FAIL
2:
.endm

.macro ASSERT_EQ_REG r1, r2
  addi s11, s11, 1
  bne \r1, \r2, 1f
  j 2f
1:
  FAIL
2:
.endm

_start:

  li s11, 0    # test counter
################################
# LUI / AUIPC
################################
  lui t0, 0x12345
  ASSERT_EQ t0, 0x12345000

  ASSERT_EQ_REG t1, t2

################################
# ADD / SUB / ADDI
################################
  li t0, 10
  li t1, 3
  add t2, t0, t1
  ASSERT_EQ t2, 13

  sub t2, t0, t1
  ASSERT_EQ t2, 7

  addi t2, t0, -5
  ASSERT_EQ t2, 5

################################
# AND / OR / XOR
################################
  li t0, 0b1100
  li t1, 0b1010
  and t2, t0, t1
  ASSERT_EQ t2, 0b1000

  or t2, t0, t1
  ASSERT_EQ t2, 0b1110

  xor t2, t0, t1
  ASSERT_EQ t2, 0b0110

################################
# Shifts
################################
  li t0, 1
  slli t1, t0, 5
  ASSERT_EQ t1, 32

  srli t1, t1, 3
  ASSERT_EQ t1, 4

  li t0, -8
  srai t1, t0, 2
  ASSERT_EQ t1, -2

################################
# SLT / SLTU
################################
  li t0, -1
  li t1, 1
  slt t2, t0, t1
  ASSERT_EQ t2, 1

  sltu t2, t0, t1
  ASSERT_EQ t2, 0

################################
# Branches
################################
  li t0, 5
  li t1, 5
  beq t0, t1, 1f
  FAIL
1:

  bne t0, t1, 2f
  j 3f
2:
  FAIL
3:

################################
# JAL / JALR
################################
  jal ra, func

after:
  nop          # success path
  j done

  FAIL         # must NOT execute

func:
  jalr zero, ra, 0

done:

################################
# Memory tests
################################
  la t0, data_area

  li t1, 0x12345678
  sw t1, 0(t0)
  lw t2, 0(t0)
  ASSERT_EQ t2, 0x12345678

  li t1, 0x7f
  sb t1, 4(t0)
  lb t2, 4(t0)
  ASSERT_EQ t2, 0x7f

  li t1, 0xff
  sb t1, 5(t0)
  lb t2, 5(t0)
  ASSERT_EQ t2, -1

################################
# Success
################################
  la a1, ok_msg
  li a0, 1
  li a2, 3
  li a7, 64
  ecall

  li a0, 0
  li a7, 93
  ecall

.section .bss
.align 4
data_area:
  .space 16

.section .rodata
ok_msg:
  .ascii "OK\n"
fail_msg:
  .ascii "FAIL\n"
