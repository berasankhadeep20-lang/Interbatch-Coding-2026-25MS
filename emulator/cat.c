#include <stdio.h>
#include <fcntl.h>
extern int open(const char*, int, ...);
extern int read(int, void*, unsigned long);
extern int write(int, const void*, unsigned long);
extern int close(int);

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printf("usage: cat <file>\n");
    return 1;
  }
  char full_path[512];
  if (argv[1][0] != '/') {
      sprintf(full_path, "/%s", argv[1]);
  } else {
      sprintf(full_path, "%s", argv[1]);
  }
  int fd = open(full_path, 0); // O_RDONLY
  if (fd < 0) {
    printf("cat: %s: No such file or directory\n", argv[1]);
    return 1;
  }
  char buf[128];
  int n;
  while ((n = read(fd, buf, sizeof(buf))) > 0) {
    write(1, buf, n);
  }
  close(fd);
  return 0;
}
