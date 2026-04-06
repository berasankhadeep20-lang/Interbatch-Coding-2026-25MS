#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MEM_SIZE 512 * 1024 * 1024

#define BASE_ADDR 0x0

static inline uint32_t translate(uint32_t vaddr) {
  if (vaddr == 0) {
    printf("Null pointer dereference!\n");
    exit(1);
  }

  uint32_t phys = vaddr - BASE_ADDR;

  if (phys >= MEM_SIZE) {
    printf("Out of bounds access: vaddr=0x%08x phys=0x%08x\n", vaddr, phys);
    exit(1);
  }

  return phys;
}
