#include <stdio.h>

extern int jscmd(const char *cmd);

int main() {
  /* Also trigger JS-side neofetch window */
  jscmd("open:neofetch");

  printf("\n");
  printf("\033[32m     ___   ___  \033[0m  \033[36mslashdot\033[90m@\033[33m25ms-os\033[0m\n");
  printf("\033[32m    /  _| /   \\ \033[0m  \033[90m──────────────────────\033[0m\n");
  printf("\033[32m    \\  \\  | . | \033[0m  \033[36mOS\033[90m: \033[0mSlashDot OS 2026.1-LTS\n");
  printf("\033[32m    _\\  \\ |   | \033[0m  \033[36mBatch\033[90m: \033[0m25MS — IISER Kolkata\n");
  printf("\033[32m   /____/ \\___/ \033[0m  \033[36mClub\033[90m: \033[0mSlashDot Programming Club\n");
  printf("\033[32m   SlashDot OS  \033[0m  \033[36mShell\033[90m: \033[0mDOSS v0\n");
  printf("\033[32m   ------------ \033[0m  \033[36mTerminal\033[90m: \033[0mxterm.js v5.5\n");
  printf("\033[32m   25MS  Batch  \033[0m  \033[36mTheme\033[90m: \033[0mGreen on Black\n");
  printf("                  \033[36mCPU\033[90m: \033[0mBrain @ 3.0GHz (caffeine-cooled)\n");
  printf("                  \033[36mMemory\033[90m: \033[0m8GB (4GB used by browser tabs)\n");
  printf("\n");
  printf("  \033[30;40m   \033[31;41m   \033[32;42m   \033[33;43m   \033[34;44m   \033[35;45m   \033[36;46m   \033[37;47m   \033[0m\n");
  printf("\n");
  return 0;
}
