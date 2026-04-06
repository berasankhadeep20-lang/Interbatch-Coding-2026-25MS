#include <stdio.h>
#include <fcntl.h>

extern int open(const char*, int, ...);
extern int close(int);
extern long do_syscall(long, long, long, long, long, long, long);

int main(int argc, char *argv[]) {
  const char *path = "/";
  if (argc > 1) path = argv[1];

  int fd = open(path, 0200000); // O_RDONLY | O_DIRECTORY
  if (fd < 0) {
    printf("ls: cannot open %s\n", path);
    return 1;
  }
  char buf[1024];
  while (1) {
    long nread = do_syscall(61, fd, (long)buf, sizeof(buf), 0, 0, 0);
    if (nread <= 0) break;
    long bpos = 0;
    while (bpos < nread) {
      unsigned short d_reclen = *(unsigned short *)(buf + bpos + 16);
      char *d_name = buf + bpos + 19;
      printf("%s\n", d_name);
      bpos += d_reclen;
    }
  }
  close(fd);
  return 0;
}
