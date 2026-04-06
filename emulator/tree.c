#include <stdio.h>
#include <string.h>

extern long do_syscall(long, long, long, long, long, long, long);
extern int open(const char *, int, ...);
extern int close(int);

static void print_tree(int fd, int depth) {
  char buf[2048];
  long nread = do_syscall(61, fd, (long)buf, sizeof(buf), 0, 0, 0);
  if (nread <= 0) return;

  long bpos = 0;
  while (bpos < nread) {
    unsigned short d_reclen = *(unsigned short *)(buf + bpos + 16);
    unsigned char d_type = *(unsigned char *)(buf + bpos + 18);
    char *d_name = buf + bpos + 19;

    for (int i = 0; i < depth; i++) printf("  ");
    if (d_type == 4) { // DT_DIR
      printf("[%s]\n", d_name);
      // Build sub-path and recurse
      // We'd need the full path here, but for simplicity we skip deep recursion
    } else {
      printf("%s\n", d_name);
    }
    bpos += d_reclen;
  }
}

int main(int argc, char *argv[]) {
  const char *path = "/";
  if (argc > 1) path = argv[1];

  printf("%s\n", path);

  int fd = open(path, 0200000);
  if (fd < 0) {
    printf("tree: cannot open %s\n", path);
    return 1;
  }

  char buf[2048];
  long nread = do_syscall(61, fd, (long)buf, sizeof(buf), 0, 0, 0);
  close(fd);
  if (nread <= 0) return 0;

  long bpos = 0;
  int count = 0;
  // Count entries first
  long tmp = 0;
  while (tmp < nread) {
    unsigned short r = *(unsigned short *)(buf + tmp + 16);
    count++;
    tmp += r;
  }

  int idx = 0;
  bpos = 0;
  while (bpos < nread) {
    unsigned short d_reclen = *(unsigned short *)(buf + bpos + 16);
    unsigned char d_type = *(unsigned char *)(buf + bpos + 18);
    char *d_name = buf + bpos + 19;
    idx++;
    int is_last = (idx == count);

    printf("%s", is_last ? "\\-- " : "|-- ");

    if (d_type == 4) {
      printf("[%s]\n", d_name);
      // Recurse into subdirectory
      char subpath[512];
      if (strcmp(path, "/") == 0)
        sprintf(subpath, "/%s", d_name);
      else
        sprintf(subpath, "%s/%s", path, d_name);

      int sfd = open(subpath, 0200000);
      if (sfd >= 0) {
        char sbuf[2048];
        long snread = do_syscall(61, sfd, (long)sbuf, sizeof(sbuf), 0, 0, 0);
        close(sfd);
        long sb = 0;
        while (sb < snread) {
          unsigned short sr = *(unsigned short *)(sbuf + sb + 16);
          char *sn = sbuf + sb + 19;
          unsigned char st = *(unsigned char *)(sbuf + sb + 18);
          printf("%s    ", is_last ? " " : "|");
          printf("\\-- ");
          if (st == 4)
            printf("[%s]\n", sn);
          else
            printf("%s\n", sn);
          sb += sr;
        }
      }
    } else {
      printf("%s\n", d_name);
    }
    bpos += d_reclen;
  }

  return 0;
}
