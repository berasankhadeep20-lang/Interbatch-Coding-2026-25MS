#include <stdio.h>


int main() {
  const char *quotes[] = {
    "Any sufficiently advanced technology is indistinguishable from magic. -- Clarke",
    "Programs must be written for people to read. -- Abelson",
    "The best way to predict the future is to invent it. -- Kay",
    "Talk is cheap. Show me the code. -- Torvalds",
    "First, solve the problem. Then, write the code. -- Johnson",
    "It works on my machine. -- Every Developer Ever",
    "There are only two hard things in CS: cache invalidation and naming things.",
    "A monad is just a monoid in the category of endofunctors.",
    "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code.",
    "To understand recursion, you must first understand recursion.",
    "There's no place like 127.0.0.1",
    "sudo rm -rf / the imposter syndrome",
  };
  int n = sizeof(quotes) / sizeof(quotes[0]);
  /* poor man's random: use return address as entropy */
  unsigned int seed = (unsigned int)(long)&seed ^ (unsigned int)(long)quotes;
  int idx = (seed >> 4) % n;
  printf("\n  \"%s\"\n\n", quotes[idx]);
  return 0;
}
