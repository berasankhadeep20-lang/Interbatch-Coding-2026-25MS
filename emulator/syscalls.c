#include <stdint.h>
#include <sys/stat.h>

#ifdef __riscv
long do_syscall(long n, long a0, long a1, long a2, long a3, long a4, long a5) {
  register long x10 asm("a0") = a0;
  register long x11 asm("a1") = a1;
  register long x12 asm("a2") = a2;
  register long x13 asm("a3") = a3;
  register long x14 asm("a4") = a4;
  register long x15 asm("a5") = a5;
  register long x17 asm("a7") = n;

  asm volatile("ecall"
               : "+r"(x10)
               : "r"(x11), "r"(x12), "r"(x13), "r"(x14), "r"(x15), "r"(x17)
               : "memory");

  return x10;
}
#endif