// #include <math.h>

#include "funct.h"
#include "guest.h"

// https://docs.riscv.org/reference/isa/unpriv/_images/svg-6e79131cf8a4d97ce98f508a368da764a7b11e95.sv
uint32_t x[32] = {0};
uint32_t csr[4096] = {0};
uint32_t f[32] = {0};
uint32_t fcsr = 0;
uint32_t programcounter = 0;
uint32_t pc_inst = 0;
uint32_t reservation = 0xFFFFFFFF; // invalid

// uint8_t memory[262144] = {0};
uint8_t *memory;

static inline uint32_t bits(uint32_t x, int hi, int lo) {
  return (x >> lo) & ((1u << (hi - lo + 1)) - 1);
}

static inline int32_t sext(uint32_t x, int bits) {
  return (int32_t)(x << (32 - bits)) >> (32 - bits);
}

static inline void illegal(uint32_t instr) {
  printf("Illegal instruction=%u at pc=%08x\n", instr, programcounter);
  exit(1);
}

void op_imm(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  int32_t imm_i = sext(bits(instr, 31, 20), 12); //(int32_t)instr >> 20;
  uint32_t shamt = bits(instr, 24, 20); //(instr >> 20) & 0x1F;   // bits 24:20
  switch (funct3) {
  case F3_ADDI: {
    x[rd] = x[rs1] + imm_i;
    break;
  }
  case F3_ANDI: {
    x[rd] = x[rs1] & imm_i;
    break;
  }
  case F3_ORI: {
    x[rd] = x[rs1] | imm_i;
    break;
  }
  case F3_XORI: {
    x[rd] = x[rs1] ^ imm_i;
    break;
  }
  case F3_SLTI: {
    x[rd] = (int32_t)x[rs1] < imm_i ? 1 : 0;
    break;
  }
  case F3_SLTIU: {
    x[rd] = x[rs1] < (uint32_t)imm_i ? 1 : 0;
    break;
  }
  case F3_SLLI: {
    x[rd] = x[rs1] << shamt;
    break;
  }
  case F3_SRLI_SRAI: {
    uint32_t funct7 = (instr >> 25) & 0x7F; // bits 31:25
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] >> shamt;
      break;
    } // SRLI
    case 0b0100000: {
      x[rd] = (int32_t)x[rs1] >> shamt;
      break;
    } // SRAI
    default: {
      illegal(instr);
      break;
    }
    }
    break;
  }
  default: {
    illegal(instr);
    break;
  }
  }
  programcounter += 4;
  x[0] = 0;
}

void op(uint32_t instr) {
  // https://docs.riscv.org/reference/isa/unpriv/_images/svg-6e79131cf8a4d97ce98f508a368da764a7b11e95.svg
  // uint32_t opcode =  instr        & 0x7F;   // bits 6:0
  uint32_t rd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rs2 = bits(instr, 24, 20);    //(instr >> 20) & 0x1F;   // bits 24:20
  uint32_t funct7 = (instr >> 25) & 0x7F; // bits 31:25
  switch (funct3) {
  case 0b000: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] + x[rs2];
      break;
    } // ADD
    case 0b0100000: {
      x[rd] = x[rs1] - x[rs2];
      break;
    } // SUB
    case 0b0000001: {
      x[rd] = x[rs1] * x[rs2];
      break;
    } // mul
    default: {
      illegal(instr);
      break;
    }
    }
    break;
  }
  // case F3_AND: { x[rd] = x[rs1] & x[rs2]; break; }
  case 0b111: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] & x[rs2];
      break;
    } // AND
    case 0b0000001: { // remu
      if (x[rs2] == 0)
        x[rd] = 0xFFFFFFFF;
      else
        x[rd] = x[rs1] % x[rs2];
      break;
    }
    default: {
      illegal(instr);
      break;
    }
    }
    break;
  }
  // case F3_OR: { x[rd] = x[rs1] | x[rs2]; break; }
  case 0b110: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] | x[rs2];
      break;
    } // OR
    case 0b0000001: { // rem
      if ((int32_t)x[rs2] == 0)
        x[rd] = (uint32_t)-1;
      else if ((int32_t)x[rs1] == (int32_t)0x80000000 && (int32_t)x[rs2] == -1)
        x[rd] = (uint32_t)0x80000000;
      else
        x[rd] = (int32_t)x[rs1] % (int32_t)x[rs2];
      break;
    }
    }
    break;
  }
  case 0b100: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] ^ x[rs2];
      break;
    } // XOR
    case 0b0000001: { // div
      if ((int32_t)x[rs2] == 0)
        x[rd] = (uint32_t)-1;
      else if ((int32_t)x[rs1] == (int32_t)0x80000000 && (int32_t)x[rs2] == -1)
        x[rd] = (uint32_t)0x80000000;
      else
        x[rd] = (int32_t)x[rs1] / (int32_t)x[rs2];
      break;
    }
    }
    break;
  }
  case 0b010: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = (int32_t)x[rs1] < (int32_t)x[rs2] ? 1 : 0;
      break;
    } // SLT
    case 0b0000001: {
      x[rd] =
          (uint32_t)(((int64_t)(int32_t)x[rs1] * (int64_t)(uint64_t)x[rs2]) >>
                     32); // mulhsu
      break;
    }
    }
    break;
  }
  case 0b011: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] < x[rs2] ? 1 : 0;
      break;
    } // SLTU
    case 0b0000001: {
      x[rd] = (uint32_t)(((uint64_t)x[rs1] * (uint64_t)x[rs2]) >> 32); // mulhu
      break;
    }
    }
    break;
  }
  case 0b001: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] << (x[rs2] & 0x1F);
      break;
    } // SLL
    case 0b0000001: {
      x[rd] =
          (uint32_t)(((int64_t)(int32_t)x[rs1] * (int64_t)(int32_t)x[rs2]) >>
                     32); // mulh
      break;
    }
    }
    break;
  }
  case 0b101: {
    switch (funct7) {
    case 0b0000000: {
      x[rd] = x[rs1] >> (x[rs2] & 0x1F);
      break;
    } // SRLI
    case 0b0100000: {
      x[rd] = (int32_t)x[rs1] >> (x[rs2] & 0x1F);
      break;
    } // SRAI
    case 0b0000001: { // divu
      if (x[rs2] == 0)
        x[rd] = 0xFFFFFFFF;
      else
        x[rd] = x[rs1] / x[rs2];
      break;
    }
    default: {
      illegal(instr);
      break;
    }
    }
    break;
  }
  default: {
    illegal(instr);
    break;
  }
  }
  programcounter += 4;
  x[0] = 0;
}

void lui(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7); //(instr >> 7)  & 0x1F;   // bits 11:7
  int32_t imm_u = instr & 0xFFFFF000;
  x[rd] = (int32_t)imm_u;
  x[0] = 0;
  programcounter += 4;
}

void auipc(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7); //(instr >> 7)  & 0x1F;   // bits 11:7
  int32_t imm_u = instr & 0xFFFFF000;
  x[rd] = pc_inst + (int32_t)imm_u;
  x[0] = 0;
  programcounter += 4;
}

void jal(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7); //(instr >> 7)  & 0x1F;   // bits 11:7
  int32_t imm_j =
      sext((bits(instr, 31, 31) << 20) | (bits(instr, 19, 12) << 12) |
               (bits(instr, 20, 20) << 11) | (bits(instr, 30, 21) << 1),
           21);
  x[rd] = (int32_t)pc_inst + 4;
  programcounter = pc_inst + imm_j;
  x[0] = 0;
}

void jalr(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7);   //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t rs1 = bits(instr, 19, 15); //(instr >> 15) & 0x1F;   // bits 19:15
  int32_t imm_i = sext(bits(instr, 31, 20),
                       12); //(int32_t)instr >> 20;
                            // programcounter = (x[rs1]+sext(imm_i, 12));
  uint32_t next = pc_inst + 4;
  programcounter = (x[rs1] + imm_i) & ~1;
  x[rd] = next;
  x[0] = 0;
}

void branch(uint32_t instr) {
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rs2 = bits(instr, 24, 20);    //(instr >> 20) & 0x1F;   // bits 24:20
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  uint32_t imm_b =
      sext((bits(instr, 31, 31) << 12) | (bits(instr, 7, 7) << 11) |
               (bits(instr, 30, 25) << 5) | (bits(instr, 11, 8) << 1),
           13);
  switch (funct3) {
  case F3_BEQ: {
    programcounter = pc_inst + ((x[rs1] == x[rs2]) ? imm_b : 4);
    break;
  }
  case F3_BNE: {
    programcounter = pc_inst + ((x[rs1] != x[rs2]) ? imm_b : 4);
    break;
  }
  case F3_BLT: {
    programcounter =
        pc_inst + (((int32_t)x[rs1] < (int32_t)x[rs2]) ? imm_b : 4);
    break;
  }
  case F3_BLTU: {
    programcounter = pc_inst + ((x[rs1] < x[rs2]) ? imm_b : 4);
    break;
  }
  case F3_BGE: {
    programcounter =
        pc_inst + (((int32_t)x[rs1] >= (int32_t)x[rs2]) ? imm_b : 4);
    break;
  }
  case F3_BGEU: {
    programcounter = pc_inst + ((x[rs1] >= x[rs2]) ? imm_b : 4);
    break;
  }
  default: {
    illegal(instr);
    break;
  }
  }
}

void load(uint32_t instr) {
  int32_t srd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  int32_t imm_i = sext(bits(instr, 31, 20), 12); //(int32_t)instr >> 20;
  uint32_t addr = x[rs1] + imm_i;
  // if (srd == 1) printf("load ra <- %u from %u\n", imm_i, addr);
  switch (funct3) {
  case F3_LB: {
    // x[srd] = sext(memory[addr], 8);
    x[srd] = sext(memory[translate(addr)], 8);
    break;
  }
  case F3_LH: {
    // x[srd] = sext(memory[addr] | (memory[addr + 1] << 8), 16);
    uint32_t phys = translate(addr);
    x[srd] = sext(memory[phys] | (memory[phys + 1] << 8), 16);
    break;
  }
  case F3_LW: {
    // x[srd] = memory[addr] | (memory[addr + 1] << 8) | (memory[addr + 2] <<
    // 16) | (memory[addr + 3] << 24);
    uint32_t phys = translate(addr);
    x[srd] = memory[phys] | (memory[phys + 1] << 8) | (memory[phys + 2] << 16) |
             (memory[phys + 3] << 24);
    break;
  }
  case F3_LBU: {
    // x[srd] = memory[addr];
    x[srd] = memory[translate(addr)];
    break;
  }
  case F3_LHU: {
    // x[srd] = memory[addr] | (memory[addr + 1] << 8);
    uint32_t phys = translate(addr);
    x[srd] = memory[phys] | (memory[phys + 1] << 8);
    break;
  }
  default: {
    illegal(instr);
    break;
  }
  }
  programcounter += 4;
  x[0] = 0;
}

void store(uint32_t instr) {
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rs2 = bits(instr, 24, 20);    //(instr >> 20) & 0x1F;   // bits 24:20
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  int32_t imm_s = sext((bits(instr, 31, 25) << 5) | bits(instr, 11, 7), 12);
  uint32_t addr = x[rs1] + imm_s;
  // if (rs2 == 1) printf("store ra %u -> %u\n", x[rs2], addr);
  switch (funct3) {
  case F3_SB: {
    // memory[addr] = x[rs2] & 0xFF;
    memory[translate(addr)] = x[rs2] & 0xFF;
    break;
  }
  case F3_SH: {
    // memory[addr + 0] = (x[rs2] >> 0) & 0xFF;
    // memory[addr + 1] = (x[rs2] >> 8) & 0xFF;
    uint32_t phys = translate(addr);
    memory[phys + 0] = (x[rs2] >> 0) & 0xFF;
    memory[phys + 1] = (x[rs2] >> 8) & 0xFF;
    break;
  }
  case F3_SW: {
    // memory[addr + 0] = (x[rs2] >> 0) & 0xFF;
    // memory[addr + 1] = (x[rs2] >> 8) & 0xFF;
    // memory[addr + 2] = (x[rs2] >> 16) & 0xFF;
    // memory[addr + 3] = (x[rs2] >> 24) & 0xFF;
    uint32_t phys = translate(addr);
    memory[phys + 0] = (x[rs2] >> 0) & 0xFF;
    memory[phys + 1] = (x[rs2] >> 8) & 0xFF;
    memory[phys + 2] = (x[rs2] >> 16) & 0xFF;
    memory[phys + 3] = (x[rs2] >> 24) & 0xFF;
    break;
  }
  default: {
    illegal(instr);
    break;
  }
  }
  programcounter += 4;
}

// void env(uint32_t instr) {
//   int32_t imm_i = sext(bits(instr, 31, 20), 12); //(int32_t)instr >> 20;
//   switch (imm_i) {
//     case 0x0: { exit(1); break; } //ECALL
//     case 0x1: { exit(1); break; } //EBREAK
//     default: { illegal(instr); break; }
//   }
// }

void env(uint32_t instr) {
  uint32_t imm_i = bits(instr, 31, 20);
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  if (imm_i != 0) {
    illegal(instr);
    return;
  }

  switch (funct3) {
  case 0b000: {               // ECALL/EBREAK
    uint32_t syscall = x[17]; // a7
    switch (syscall) {
      // exit(int code)
    case 93: { // exit
    }
    case 94: { // exit_group
      syscall_exit_process(x, memory, &programcounter, &pc_inst);
      break;
    }
      // write(int fd, const void *buf, size_t count)
    case 64: { // write
      syscall_write(x, memory);
      break;
    }
    // read(int fd, void *buf, size_t count)
    case 63: { // read
      syscall_read(x, memory);
      break;
    }
    case 57: { // close
      syscall_close(x, memory);
      break;
    }
    case 62: { // lseek
      syscall_lseek(x, memory);
      break;
    }
    case 56: { // openat (for picolibc open)
      // openat(dirfd, path, flags) - dirfd is a0, path is a1.
      // since it's a flat FS we ignore dirfd (AT_FDCWD) and just use path
      // we shift the registers to let syscall_open handle it
      uint32_t old_a0 = x[10];
      x[10] = x[11]; // make a0 point to path
      syscall_open(x, memory);
      break;
    }
    case 61: { // getdents64
      syscall_getdents64(x, memory);
      break;
    }
    case 80: { // fstat
      syscall_fstat(x, memory);
      break;
    }
    case 169: { // gettimeofday
      syscall_gettimeofday(x, memory);
      break;
    }
    case 214: { // brk
      syscall_brk(x, memory);
      break;
    }
    // execve(const char *path, char *const _Nullable argv[], char *const
    // _Nullable envp[])
    case 221: { // execve
      syscall_execve(x, memory, &programcounter, &pc_inst);
      break;
    }
    case 1024: { // open
      syscall_open(x, memory);
      break;
    }
    case 34: { // mkdirat
      syscall_mkdirat(x, memory);
      break;
    }
    default: {
      printf("Unknown syscall %u\n", syscall);
      x[10] = -1;
      break;
    }
    }
    break;
  }
  case 0b001: { // csrrw
    if (rd == 0)
      break;
    x[rd] = csr[imm_i];
    csr[imm_i] = x[rs1];
    break;
  }
  case 0b010: { // csrrs
    x[rd] = csr[imm_i];
    if (rs1 == 0)
      break;
    csr[imm_i] |= x[rs1];
    break;
  }
  case 0b011: { // csrrs
    x[rd] = csr[imm_i];
    if (rs1 == 0)
      break;
    csr[imm_i] &= ~(x[rs1]);
    break;
  }
  case 0b101: { // csrrwi
    if (rd == 0)
      break;
    x[rd] = csr[imm_i];
    csr[imm_i] = rs1;
    break;
  }
  case 0b110: { // csrrsi
    x[rd] = csr[imm_i];
    if (rs1 == 0)
      break;
    csr[imm_i] |= rs1;
    break;
  }
  case 0b111: { // csrrsi
    x[rd] = csr[imm_i];
    if (rs1 == 0)
      break;
    csr[imm_i] &= ~(rs1);
    break;
  }
  }
  programcounter += 4;
  x[0] = 0;
}

void fence(uint32_t instr) {
  int32_t imm_i = sext(bits(instr, 31, 20), 12); //(int32_t)instr >> 20;
  uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits 14:12
  switch (imm_i) {
  case 0b000000010000: {
    getchar();
    break;
  } // PAUSE
  case 0b100000110011: {
    break;
  } // FENCE.TSO
  default: {
    break;
  } // FENCE //case 0b0000 0000 0000 _ 00000 000:
  }
  switch (funct3) {
  case 0b001: {
    break;
  } // FENCE.I
  }
  // printf("fence");
  programcounter += 4;
}

static inline uint32_t memloadword(uint32_t addr) {
  uint32_t phys = translate(addr);
  // return memory[addr] | (memory[addr + 1] << 8) | (memory[addr + 2] << 16) |
  // (memory[addr + 3] << 24);
  return memory[phys] | (memory[phys + 1] << 8) | (memory[phys + 2] << 16) |
         (memory[phys + 3] << 24);
}

static inline void memstoreword(uint32_t addr, uint32_t data) {
  uint32_t phys = translate(addr);
  // memory[addr + 0] = (data >> 0) & 0xFF;
  // memory[addr + 1] = (data >> 8) & 0xFF;
  // memory[addr + 2] = (data >> 16) & 0xFF;
  // memory[addr + 3] = (data >> 24) & 0xFF;
  memory[phys + 0] = (data >> 0) & 0xFF;
  memory[phys + 1] = (data >> 8) & 0xFF;
  memory[phys + 2] = (data >> 16) & 0xFF;
  memory[phys + 3] = (data >> 24) & 0xFF;
}

void atomic(uint32_t instr) {
  // uint32_t funct3 = bits(instr, 14, 12); //(instr >> 12) & 0x07;   // bits
  // 14:12
  uint32_t funct5 = bits(instr, 31, 27); //(instr >> 12) & 0x07;   // bits 14:12
  uint32_t rd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rs2 = bits(instr, 24, 20);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t addr = x[rs1];
  switch (funct5) {
  case 0b00010: { // lr.w
    reservation = addr;
    x[rd] = memloadword(addr);
    break;
  }
  case 0b00011: { // sc.w
    if (reservation == addr) {
      memstoreword(addr, x[rs2]);
      x[rd] = 0; // success
    } else {
      x[rd] = 1; // fail
    }
    reservation = 0xFFFFFFFF;
    break;
  }
  case 0b00000: { // amoadd.w
    uint32_t t = memloadword(addr);
    memstoreword(addr, t + x[rs2]);
    x[rd] = t;
    break;
  }
  case 0b00001: { // amoswap.w
    uint32_t t = memloadword(addr);
    memstoreword(addr, x[rs2]);
    x[rd] = t;
    break;
  }
  case 0b01000: { // amoor.w
    uint32_t t = memloadword(addr);
    memstoreword(addr, t | x[rs2]);
    x[rd] = t;
    break;
  }
  case 0b00100: { // amoxor.w
    uint32_t t = memloadword(addr);
    memstoreword(addr, t ^ x[rs2]);
    x[rd] = t;
    break;
  }
  case 0b10100: { // amomax.w
    int32_t a = (int32_t)memloadword(addr);
    int32_t b = (int32_t)x[rs2];
    memstoreword(addr, (uint32_t)((a > b) ? a : b));
    x[rd] = (uint32_t)a;
    break;
  }
  case 0b11100: { // amomaxu.w
    uint32_t t = memloadword(addr);
    uint32_t b = x[rs2];
    memstoreword(addr, (t > b) ? t : b);
    x[rd] = t;
    break;
  }
  case 0b10000: { // amomin.w
    int32_t a = (int32_t)memloadword(addr);
    int32_t b = (int32_t)x[rs2];
    memstoreword(addr, (uint32_t)((a < b) ? a : b));
    x[rd] = (uint32_t)a;
    break;
  }
  case 0b11000: { // amominu.w
    uint32_t t = memloadword(addr);
    uint32_t b = x[rs2];
    memstoreword(addr, (t < b) ? t : b);
    x[rd] = t;
    break;
  }
  }
  programcounter += 4;
}

void flw(uint32_t instr) {
  uint32_t rs1 = bits(instr, 19, 15); //(instr >> 15) & 0x1F;   // bits 19:15
  int32_t imm_i = sext(bits(instr, 31, 20), 12); //(int32_t)instr >> 20;
  uint32_t addr = x[rs1] + imm_i;
  uint32_t rd = bits(instr, 11, 7); //(instr >> 7)  & 0x1F;   // bits 11:7
  f[rd] = memloadword(addr);
  programcounter += 4;
}

void fsw(uint32_t instr) {
  uint32_t rs1 = bits(instr, 19, 15);
  uint32_t rs2 = bits(instr, 24, 20);
  int32_t imm = sext((bits(instr, 31, 25) << 5) | bits(instr, 11, 7), 12);
  uint32_t addr = x[rs1] + imm;
  memstoreword(addr, f[rs2]);
  programcounter += 4;
}

void op_f(uint32_t instr) {
  uint32_t rd = bits(instr, 11, 7);      //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t rm = bits(instr, 14, 12);     //(instr >> 7)  & 0x1F;   // bits 11:7
  uint32_t rs1 = bits(instr, 19, 15);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t rs2 = bits(instr, 24, 20);    //(instr >> 15) & 0x1F;   // bits 19:15
  uint32_t funct5 = bits(instr, 31, 27); //(instr >> 12) & 0x07;   // bits 14:12
  if (rm != 0b000 && rm != 0b111) {
    illegal(instr); // XXX: rounding modes, nan propagation, fcsr handling
  }
  switch (funct5) {
  case 0b00000: { // fadd.s
    float a, b, res;
    memcpy(&a, &f[rs1], sizeof(float));
    memcpy(&b, &f[rs2], sizeof(float));
    res = a + b;
    memcpy(&f[rd], &res, sizeof(float));
    break;
  }
  case 0b00010: { // fmul.s
    float a, b, res;
    memcpy(&a, &f[rs1], sizeof(float));
    memcpy(&b, &f[rs2], sizeof(float));
    res = a * b;
    memcpy(&f[rd], &res, sizeof(float));
    break;
  }
  case 0b00001: { // fsub.s
    float a, b, res;
    memcpy(&a, &f[rs1], sizeof(float));
    memcpy(&b, &f[rs2], sizeof(float));
    res = a - b;
    memcpy(&f[rd], &res, sizeof(float));
    break;
  }
  case 0b00011: { // fdiv.s
    float a, b, res;
    memcpy(&a, &f[rs1], sizeof(float));
    memcpy(&b, &f[rs2], sizeof(float));
    res = a / b;
    memcpy(&f[rd], &res, sizeof(float));
    break;
  }
  // case 0b01011: { //fsqrt.s
  //   float a, res;
  //   memcpy(&a, &f[rs1], sizeof(float));
  //   res = sqrtf(a);
  //   memcpy(&f[rd], &res, sizeof(float));
  //   break;
  // }
  case 0b00101: {                  // fmin_max.s
    switch (bits(instr, 14, 12)) { // rm : inline for now
    case 0b000: {                  // fmin.s
      float a, b, res;
      memcpy(&a, &f[rs1], sizeof(float));
      memcpy(&b, &f[rs2], sizeof(float));
      res = (a < b) ? a : b;
      memcpy(&f[rd], &res, sizeof(float));
      break;
    }
    case 0b001: { // fmax.s
      float a, b, res;
      memcpy(&a, &f[rs1], sizeof(float));
      memcpy(&b, &f[rs2], sizeof(float));
      res = (a > b) ? a : b;
      memcpy(&f[rd], &res, sizeof(float));
      break;
    }
    }
    break;
  }
  case 0b11000: {
    switch (rs2) {
    case 0b00000: { // fcvt.w.s
      float a;
      memcpy(&a, &f[rs1], sizeof(float));
      x[rd] = (int32_t)a;
      break;
    }
    case 0b00001: { // fcvt.wu.s
      float a;
      memcpy(&a, &f[rs1], sizeof(float));
      x[rd] = (uint32_t)a;
      break;
    }
    }
    break;
  }
  case 0b11010: {
    switch (rs2) {
    case 0b00000: { // fcvt.s.w
      float res = (float)(int32_t)x[rs1];
      memcpy(&f[rd], &res, sizeof(int32_t));
      break;
    }
    case 0b00001: { // fcvt.s.wu
      float res = (float)(uint32_t)x[rs1];
      memcpy(&f[rd], &res, sizeof(uint32_t));
      break;
    }
    }
    break;
  }
    // TODO: rest of rv32f
  }
}

typedef void (*OpHandler)(uint32_t instr);

OpHandler opcode_table[256] = {
    [0b0010011] = op_imm, [0b0110111] = lui,   [0b0010111] = auipc,
    [0b0110011] = op,     [0b1101111] = jal,   [0b1100111] = jalr,
    [0b1100011] = branch, [0b0000011] = load,  [0b0100011] = store,
    [0b1110011] = env,    [0b0001111] = fence, [0b0101111] = atomic,
    //[0b0000111] = flw,
    //[0b0100111] = fsw,
    //[0b1010011] = op_f,
};

void dump_binary(int num) {
  for (int i = (sizeof(int) * 8) - 1; i >= 0; i--) {
    printf("%d", (num >> i) & 1);
    if (i % 4 == 0) {
      printf(" ");
    }
  }
  printf("\n");
}

void dump_reg() {
  printf("unsigned: ");
  for (int i = 0; i < 32; i++) {
    printf("%u ", x[i]);
  }
  printf("\n");
  printf("signed: ");
  for (int i = 0; i < 32; i++) {
    printf("%d ", (int32_t)x[i]);
  }
  printf("\n");
}
// #define BASE_ADDR 0x10000000
//
// static inline uint32_t translate(uint32_t vaddr) {
//   if (vaddr < BASE_ADDR) {
//     printf("Invalid access below base: 0x%08x\n", vaddr);
//     exit(1);
//   }
//
//   uint32_t phys = vaddr - BASE_ADDR;
//
//   if (phys >= MEM_SIZE) {
//     printf("Out of bounds access: vaddr=0x%08x phys=0x%08x\n", vaddr, phys);
//     exit(1);
//   }
//
//   return phys;
// }

void boot(const char *path, uint32_t load_addr) {
  // Not used via direct binary copy anymore
}

uint32_t return_pc = 0;
extern uint32_t heap;

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

int main(int argc, char *argv[], char *envp[]) {
  if (argc < 2) {
    printf("usage: %s program.bin\n", argv[0]);
    return 1;
  }

  memset(x, 0, sizeof(x));
  memory = calloc(MEM_SIZE, 1);

  x[2] = BASE_ADDR + MEM_SIZE;

  fs_init();
  fs_load_from_host(fs_root, "initramfs");

  // count host envc
  int envc = 0;
  while (envp && envp[envc])
    envc++;

  heap = 0x21000000;
  load_elf(argv[1], 0, memory, &programcounter, &pc_inst);

  setup_stack(argc - 1, &argv[1], envc, envp, memory, BASE_ADDR + MEM_SIZE, x);

  while (1) {
#ifdef __EMSCRIPTEN__
    static int steps = 0;
    if (steps++ > 200000) {
      emscripten_sleep(0);
      steps = 0;
    }
#endif
    uint32_t phys = programcounter - BASE_ADDR;

    uint32_t instr = memory[phys + 0] | (memory[phys + 1] << 8) |
                     (memory[phys + 2] << 16) | (memory[phys + 3] << 24);
    uint32_t opcode = instr & 0x7F;
    if (!opcode_table[opcode]) {
      printf("Illegal opcode %02x at pc=%08x\n", opcode, programcounter);
      printf("Instr: %16x\n", instr);
      exit(1);
    }
    pc_inst = programcounter;
    opcode_table[opcode](instr);
    if (programcounter & 3) {
      printf("PC misaligned: %08x\n", programcounter);
      exit(1);
    }
  }
  free(memory);
  return 0;
}
