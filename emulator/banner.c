#include <stdio.h>
#include <string.h>

/* Big block letters using # characters - 5 rows high */
static const char *font[128][5];

static void init_font() {
  /* Initialize space */
  for (int i = 0; i < 128; i++)
    for (int r = 0; r < 5; r++)
      font[i][r] = "   ";

  font['A'][0] = " ## "; font['A'][1] = "#  #"; font['A'][2] = "####"; font['A'][3] = "#  #"; font['A'][4] = "#  #";
  font['B'][0] = "### "; font['B'][1] = "#  #"; font['B'][2] = "### "; font['B'][3] = "#  #"; font['B'][4] = "### ";
  font['C'][0] = " ###"; font['C'][1] = "#   "; font['C'][2] = "#   "; font['C'][3] = "#   "; font['C'][4] = " ###";
  font['D'][0] = "### "; font['D'][1] = "#  #"; font['D'][2] = "#  #"; font['D'][3] = "#  #"; font['D'][4] = "### ";
  font['E'][0] = "####"; font['E'][1] = "#   "; font['E'][2] = "### "; font['E'][3] = "#   "; font['E'][4] = "####";
  font['F'][0] = "####"; font['F'][1] = "#   "; font['F'][2] = "### "; font['F'][3] = "#   "; font['F'][4] = "#   ";
  font['G'][0] = " ###"; font['G'][1] = "#   "; font['G'][2] = "# ##"; font['G'][3] = "#  #"; font['G'][4] = " ###";
  font['H'][0] = "#  #"; font['H'][1] = "#  #"; font['H'][2] = "####"; font['H'][3] = "#  #"; font['H'][4] = "#  #";
  font['I'][0] = "###"; font['I'][1] = " # "; font['I'][2] = " # "; font['I'][3] = " # "; font['I'][4] = "###";
  font['J'][0] = "  ##"; font['J'][1] = "  # "; font['J'][2] = "  # "; font['J'][3] = "# # "; font['J'][4] = " # ";
  font['K'][0] = "#  #"; font['K'][1] = "# # "; font['K'][2] = "##  "; font['K'][3] = "# # "; font['K'][4] = "#  #";
  font['L'][0] = "#   "; font['L'][1] = "#   "; font['L'][2] = "#   "; font['L'][3] = "#   "; font['L'][4] = "####";
  font['M'][0] = "#   #"; font['M'][1] = "## ##"; font['M'][2] = "# # #"; font['M'][3] = "#   #"; font['M'][4] = "#   #";
  font['N'][0] = "#  #"; font['N'][1] = "## #"; font['N'][2] = "# ##"; font['N'][3] = "#  #"; font['N'][4] = "#  #";
  font['O'][0] = " ## "; font['O'][1] = "#  #"; font['O'][2] = "#  #"; font['O'][3] = "#  #"; font['O'][4] = " ## ";
  font['P'][0] = "### "; font['P'][1] = "#  #"; font['P'][2] = "### "; font['P'][3] = "#   "; font['P'][4] = "#   ";
  font['Q'][0] = " ## "; font['Q'][1] = "#  #"; font['Q'][2] = "#  #"; font['Q'][3] = "# ##"; font['Q'][4] = " ###";
  font['R'][0] = "### "; font['R'][1] = "#  #"; font['R'][2] = "### "; font['R'][3] = "# # "; font['R'][4] = "#  #";
  font['S'][0] = " ###"; font['S'][1] = "#   "; font['S'][2] = " ## "; font['S'][3] = "   #"; font['S'][4] = "### ";
  font['T'][0] = "#####"; font['T'][1] = "  #  "; font['T'][2] = "  #  "; font['T'][3] = "  #  "; font['T'][4] = "  #  ";
  font['U'][0] = "#  #"; font['U'][1] = "#  #"; font['U'][2] = "#  #"; font['U'][3] = "#  #"; font['U'][4] = " ## ";
  font['V'][0] = "#   #"; font['V'][1] = "#   #"; font['V'][2] = " # # "; font['V'][3] = " # # "; font['V'][4] = "  #  ";
  font['W'][0] = "#   #"; font['W'][1] = "#   #"; font['W'][2] = "# # #"; font['W'][3] = "## ##"; font['W'][4] = "#   #";
  font['X'][0] = "#  #"; font['X'][1] = " ## "; font['X'][2] = " ## "; font['X'][3] = " ## "; font['X'][4] = "#  #";
  font['Y'][0] = "#   #"; font['Y'][1] = " # # "; font['Y'][2] = "  #  "; font['Y'][3] = "  #  "; font['Y'][4] = "  #  ";
  font['Z'][0] = "####"; font['Z'][1] = "  # "; font['Z'][2] = " #  "; font['Z'][3] = "#   "; font['Z'][4] = "####";
  font[' '][0] = "  "; font[' '][1] = "  "; font[' '][2] = "  "; font[' '][3] = "  "; font[' '][4] = "  ";
  font['!'][0] = "#"; font['!'][1] = "#"; font['!'][2] = "#"; font['!'][3] = " "; font['!'][4] = "#";
}

int main(int argc, char **argv) {
  if (argc < 2) {
    printf("Usage: banner <text>\n");
    return 1;
  }

  init_font();

  /* Combine args into single string */
  char text[256] = "";
  for (int i = 1; i < argc; i++) {
    if (i > 1) strcat(text, " ");
    strcat(text, argv[i]);
  }

  /* Uppercase it */
  for (int i = 0; text[i]; i++) {
    if (text[i] >= 'a' && text[i] <= 'z') text[i] -= 32;
  }

  printf("\n");
  for (int row = 0; row < 5; row++) {
    printf("  ");
    for (int i = 0; text[i]; i++) {
      unsigned char ch = (unsigned char)text[i];
      if (ch < 128) printf("%s ", font[ch][row]);
    }
    printf("\n");
  }
  printf("\n");
  return 0;
}
