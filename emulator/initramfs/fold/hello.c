#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
    printf("Hello from picolibc (or newlib) on RISC-V!\n");
    printf("argc = %d\n", argc);
    for (int i=0; i<argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }
    printf("Allocating memory...\n");
    void *ptr = malloc(1024);
    if (ptr) {
        printf("Malloc returned %p\n", ptr);
        free(ptr);
    }
    return 0;
}
