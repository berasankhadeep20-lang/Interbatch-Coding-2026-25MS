#include <stdio.h>
#include <string.h>

extern long do_syscall(long, long, long, long, long, long, long);

// Syscall 34 = mkdirat
// mkdirat(AT_FDCWD, path, mode)
// AT_FDCWD = -100

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printf("usage: mkdir <directory>\n");
    return 1;
  }
  char full_path[512];
  if (argv[1][0] != '/') {
    // Check CWD from environment
    extern char **environ;
    const char *cwd = "/";
    if (environ) {
      for (int i = 0; environ[i]; i++) {
        if (strncmp(environ[i], "CWD=", 4) == 0) {
          cwd = environ[i] + 4;
          break;
        }
      }
    }
    if (strcmp(cwd, "/") == 0) {
      sprintf(full_path, "/%s", argv[1]);
    } else {
      sprintf(full_path, "%s/%s", cwd, argv[1]);
    }
  } else {
    strcpy(full_path, argv[1]);
  }
  long ret = do_syscall(34, -100, (long)full_path, 0755, 0, 0, 0);
  if (ret < 0) {
    printf("mkdir: cannot create directory '%s'\n", argv[1]);
    return 1;
  }
  return 0;
}
