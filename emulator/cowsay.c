#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
  char msg[512] = "";
  for (int i = 1; i < argc; i++) {
    if (i > 1) strcat(msg, " ");
    strcat(msg, argv[i]);
  }
  if (strlen(msg) == 0) strcpy(msg, "moo");

  int len = strlen(msg);
  printf(" ");
  for (int i = 0; i < len + 2; i++) printf("_");
  printf("\n");
  printf("< %s >\n", msg);
  printf(" ");
  for (int i = 0; i < len + 2; i++) printf("-");
  printf("\n");
  printf("        \\   ^__^\n");
  printf("         \\  (oo)\\_______\n");
  printf("            (__)\\       )\\/\\\n");
  printf("                ||----w |\n");
  printf("                ||     ||\n");
  return 0;
}
