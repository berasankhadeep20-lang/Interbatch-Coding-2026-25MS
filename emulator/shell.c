#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern int execve(const char *p, char *const a[], char *const e[]);

int main() {
  char cmd[256];

  printf(
      "\nDOSS [Version 0] \n(c) Copyleft 2026 bari. All rights reserved. \n\n");

  char pwd[256] = "/";

  while (1) {
    printf("%s\\> ", pwd);
    if (!fgets(cmd, sizeof(cmd), stdin)) {
      break;
    }

    cmd[strcspn(cmd, "\n")] = 0;

    char *argv[32];
    int argc = 0;
    char *token = strtok(cmd, " ");
    while (token && argc < 31) {
      argv[argc++] = token;
      token = strtok(NULL, " ");
    }
    argv[argc] = NULL;

    if (argc == 0)
      continue;

    if (strcmp(argv[0], "exit") == 0) {
      exit(0);
    } else if (strcmp(argv[0], "cd") == 0) {
      if (argc > 1) {
        if (strcmp(argv[1], "..") == 0) {
          char *last = strrchr(pwd, '/');
          if (last && last != pwd) {
            *last = '\0';
          } else {
            strcpy(pwd, "/");
          }
        } else if (argv[1][0] == '/') {
          strcpy(pwd, argv[1]);
        } else {
          if (strcmp(pwd, "/") != 0) {
            strcat(pwd, "/");
            strcat(pwd, argv[1]);
          } else {
            strcat(pwd, argv[1]);
          }
        }
      } else {
        strcpy(pwd, "/");
      }
    } else if (strcmp(argv[0], "help") == 0) {
      printf("Built-in commands:\n");
      printf("  cd [dir]     - change directory (supports ..)\n");
      printf("  pwd          - print working directory\n");
      printf("  clear        - clear screen\n");
      printf("  help         - show this help\n");
      printf("  exit         - exit shell\n");
      printf("\nExternal commands:\n");
      printf("  ls [dir]     - list directory contents\n");
      printf("  cat <file>   - print file contents\n");
      printf("  echo <msg>   - print a message\n");
      printf("  tree [dir]   - show directory tree\n");
      printf("  mkdir <d>    - create a directory\n");
      printf("  cowsay <m>   - moo\n");
      printf("\nApps (via 'open <name>'):\n");
      printf("  home about team stack contact neofetch\n");
      printf("  asteroids pong periodic fourier gravity\n");
      printf("  dna grapher physics molecular gameoflife\n");
      printf("  typing flappy matrix-calc slashdotai\n");
      printf("\nFun commands:\n");
      printf("  neofetch     - system info + ASCII art\n");
      printf("  fortune      - random programming quote\n");
      printf("  banner <txt> - big ASCII text\n");
      printf("  weather      - campus weather report\n");
      printf("  sl           - steam locomotive\n");
    } else if (strcmp(argv[0], "pwd") == 0) {
      printf("%s\n", pwd);
    } else if (strcmp(argv[0], "clear") == 0) {
      printf("\033[2J\033[H");
    } else {
      char full_cmd[512];
      if (argv[0][0] != '/') {
        sprintf(full_cmd, "/%s", argv[0]);
      } else {
        strcpy(full_cmd, argv[0]);
      }
      // Pass CWD as environment variable
      char cwd_env[280];
      sprintf(cwd_env, "CWD=%s", pwd);
      char *envp[] = {cwd_env, NULL};
      int res = execve(full_cmd, argv, envp);
      if (res < 0) {
        printf("'%s' is not recognized as an internal or external command.\n",
               argv[0]);
      }
    }
  }

  return 0;
}