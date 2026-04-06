
#include <stdio.h>
#include <stdlib.h>

#include "syscalls.h"

int main(int argc, char **argv) {
  printf("Hello from picolibc (or newlib) on RISC-V!\n");
  printf("argc = %d\n", argc);
  for (int i = 0; i < argc; i++) {
    printf("argv[%d] = %s\n", i, argv[i]);
  }
  printf("Allocating memory...\n");
  void *ptr = malloc(1024);
  if (ptr) {
    printf("Malloc returned %p\n", ptr);
    free(ptr);
  }
  return 0;
}

#ifdef __riscv
int _write(int fd, const void *buf, size_t count) {
  return do_syscall(64, fd, (long)buf, count, 0, 0, 0);
}

int _read(int fd, void *buf, size_t count) {
  return do_syscall(63, fd, (long)buf, count, 0, 0, 0);
}

int _close(int fd) { return do_syscall(57, fd, 0, 0, 0, 0, 0); }

int _lseek(int fd, int offset, int whence) {
  return do_syscall(62, fd, offset, whence, 0, 0, 0);
}

int read(int fd, void *b, size_t c) { return _read(fd, b, c); }
int write(int fd, const void *b, size_t c) { return _write(fd, b, c); }
int close(int fd) { return _close(fd); }
off_t lseek(int fd, off_t offset, int whence) {
  return _lseek(fd, offset, whence);
}
#endif