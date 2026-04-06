#include <stdio.h>


extern int jscmd(const char *cmd);

int main(int argc, char **argv) {
  if (argc < 2) {
    printf("Usage: open <app>\n");
    printf("Apps: home about team stack contact neofetch\n");
    printf("      asteroids pong periodic fourier gravity\n");
    printf("      dna grapher physics molecular gameoflife\n");
    printf("      typing flappy matrix-calc slashdotai\n");
    return 1;
  }
  char buf[256];
  snprintf(buf, sizeof(buf), "open:%s", argv[1]);
  jscmd(buf);
  return 0;
}
