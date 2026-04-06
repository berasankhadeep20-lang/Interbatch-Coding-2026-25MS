#include "syscalls.h"
#include <fcntl.h>
#include <stdarg.h>
#include <sys/stat.h>

#ifndef O_CREAT
#define O_CREAT 0100
#endif

int _write(int fd, const void *buf, unsigned long count) { return do_syscall(64, fd, (long)buf, count, 0, 0, 0); }
int _read(int fd, void *buf, unsigned long count) { return do_syscall(63, fd, (long)buf, count, 0, 0, 0); }
int _close(int fd) { return do_syscall(57, fd, 0, 0, 0, 0, 0); }
int _lseek(int fd, int offset, int whence) { return do_syscall(62, fd, offset, whence, 0, 0, 0); }
int _open(const char *path, int flags, int mode) { return do_syscall(56, -100, (long)path, flags, mode, 0, 0); }
int _fstat(int fd, struct stat *st) { return do_syscall(80, fd, (long)st, 0, 0, 0, 0); }
int _isatty(int fd) { return 1; }
void _exit(int code) { do_syscall(93, code, 0, 0, 0, 0, 0); while (1); }
int open(const char *path, int flags, ...) { int mode=0; if (flags & O_CREAT){ va_list ap; va_start(ap, flags); mode = va_arg(ap, int); va_end(ap); } return _open(path, flags, mode); }
int read(int fd, void *b, unsigned long c) { return _read(fd, b, c); }
int write(int fd, const void *b, unsigned long c) { return _write(fd, b, c); }
int close(int fd) { return _close(fd); }
long lseek(int fd, long offset, int whence) { return _lseek(fd, offset, whence); }
int execve(const char *p, char *const a[], char *const e[]) { return do_syscall(221, (long)p, (long)a, (long)e, 0, 0, 0); }
int jscmd(const char *cmd) { return do_syscall(511, (long)cmd, 0, 0, 0, 0, 0); }
