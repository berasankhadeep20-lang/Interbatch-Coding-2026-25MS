#include "guest.h"

#include <dirent.h>
#include <sys/stat.h>

// uint32_t return_stack[MAX_CALL_DEPTH];
int call_depth = 0;

fs_node_t *fs_root;

fs_node_t *fs_create_dir(fs_node_t *parent, const char *name) {
  fs_node_t *n = (fs_node_t *)malloc(sizeof(fs_node_t));
  memset(n, 0, sizeof(*n));
  strcpy(n->name, name);
  n->type = FS_DIR;
  n->parent = parent;
  if (parent && parent->child_count < 2048) {
    parent->children[parent->child_count++] = n;
  }
  return n;
}

void fs_init() { fs_root = fs_create_dir(NULL, ""); }

void fs_load_from_host(fs_node_t *parent, const char *host_path) {
  DIR *dir = opendir(host_path);
  if (!dir)
    return;

  struct dirent *ent;
  while ((ent = readdir(dir)) != NULL) {
    if (strcmp(ent->d_name, ".") == 0 || strcmp(ent->d_name, "..") == 0)
      continue;

    char full_path[1024];
    snprintf(full_path, sizeof(full_path), "%s/%s", host_path, ent->d_name);

    struct stat st;
    if (stat(full_path, &st) == 0) {
      if (S_ISDIR(st.st_mode)) {
        fs_node_t *new_dir = fs_create_dir(parent, ent->d_name);
        fs_load_from_host(new_dir, full_path);
      } else if (S_ISREG(st.st_mode)) {
        FILE *f = fopen(full_path, "rb");
        if (f) {
          uint8_t *data = malloc(st.st_size);
          fread(data, 1, st.st_size, f);
          fclose(f);
          fs_create_file(parent, ent->d_name, data, st.st_size);
        }
      }
    }
  }
  closedir(dir);
}

fs_node_t *fs_lookup(const char *path) {
  // printf("LOOKUP path: '%s'\n", path);
  if (path[0] != '/')
    return NULL;
  fs_node_t *cur = fs_root;
  char temp[256];
  strcpy(temp, path);
  char *token = strtok(temp, "/");
  while (token) {
    int found = 0;
    // printf("token = '%s'\n", token);
    // printf("cur has %d children\n", cur->child_count);
    for (int i = 0; i < cur->child_count; i++) {
      if (strcmp(cur->children[i]->name, token) == 0) {
        cur = cur->children[i];
        found = 1;
        break;
      }
    }
    if (!found)
      return NULL;
    token = strtok(NULL, "/");
  }
  return cur;
}

fs_node_t *fs_create_file(fs_node_t *parent, const char *name, uint8_t *data,
                          uint32_t size) {
  fs_node_t *n = (fs_node_t *)malloc(sizeof(fs_node_t));
  memset(n, 0, sizeof(*n));

  strcpy(n->name, name);
  n->type = FS_FILE;
  n->data = data;
  n->size = size;
  n->parent = parent;

  parent->children[parent->child_count++] = n;
  return n;
}

fd_t fd_table[MAX_FD];

int alloc_fd(fs_node_t *node) {
  for (int i = 0; i < MAX_FD; i++) {
    if (!fd_table[i].used) {
      fd_table[i].used = 1;
      fd_table[i].node = node;
      fd_table[i].offset = 0;
      return i;
    }
  }
  return -1; // no free fd
}

void fs_close(int fd) {
  if (fd < 0 || fd >= MAX_FD)
    return;
  fd_table[fd].used = 0;
}

uint32_t fs_read(int fd, uint8_t *buf, uint32_t count) {
  if (fd < 0 || fd >= MAX_FD || !fd_table[fd].used)
    return 0;

  fd_t *f = &fd_table[fd];
  fs_node_t *node = f->node;

  uint32_t remaining = node->size - f->offset;
  if (count > remaining)
    count = remaining;

  memcpy(buf, node->data + f->offset, count);
  f->offset += count;

  return count;
}

void fs_seek(int fd, uint32_t offset) {
  if (fd < 0 || fd >= MAX_FD || !fd_table[fd].used)
    return;

  if (offset > fd_table[fd].node->size)
    offset = fd_table[fd].node->size;

  fd_table[fd].offset = offset;
}

uint32_t fs_tell(int fd) { return fd_table[fd].offset; }

uint32_t setup_stack(int argc, char **argv, int envc, char **envp,
                     uint8_t *memory, uint32_t mem_size, uint32_t *x) {
  uint32_t sp = mem_size;

  uint32_t *argv_ptrs = malloc(sizeof(uint32_t) * (argc + 1));
  uint32_t *envp_ptrs = malloc(sizeof(uint32_t) * (envc + 1));

  // copy env strings
  for (int i = 0; i < envc; i++) {
    size_t len = strlen(envp[i]) + 1;
    sp -= len;
    // memcpy(&memory[sp], envp[i], len);
    memcpy(&memory[translate(sp)], envp[i], len);
    envp_ptrs[i] = sp;
  }

  // copy arg strings
  for (int i = 0; i < argc; i++) {
    size_t len = strlen(argv[i]) + 1;
    sp -= len;
    // memcpy(&memory[sp], argv[i], len);
    memcpy(&memory[translate(sp)], argv[i], len);
    argv_ptrs[i] = sp;
  }

  // align stack to 16 bytes
  sp &= ~0xF;

  // push auxiliary vectors
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 0; // AT_NULL a_val
  *(uint32_t *)&memory[translate(sp)] = 0; // AT_NULL a_val
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 0; // AT_NULL a_type
  *(uint32_t *)&memory[translate(sp)] = 0; // AT_NULL a_type
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 4096; // AT_PAGESZ a_val
  *(uint32_t *)&memory[translate(sp)] = 4096; // AT_PAGESZ a_val
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 6; // AT_PAGESZ a_type
  *(uint32_t *)&memory[translate(sp)] = 6; // AT_PAGESZ a_type

  // envp[]
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 0; // NULL terminator
  *(uint32_t *)&memory[translate(sp)] = 0; // NULL terminator
  for (int i = envc - 1; i >= 0; i--) {
    sp -= 4;
    // *(uint32_t *)&memory[sp] = envp_ptrs[i];
    *(uint32_t *)&memory[translate(sp)] = envp_ptrs[i];
  }

  // argv[]
  sp -= 4;
  // *(uint32_t *)&memory[sp] = 0; // NULL terminator
  *(uint32_t *)&memory[translate(sp)] = 0; // NULL terminator
  for (int i = argc - 1; i >= 0; i--) {
    sp -= 4;
    // *(uint32_t *)&memory[sp] = argv_ptrs[i];
    *(uint32_t *)&memory[translate(sp)] = argv_ptrs[i];
  }

  // argc
  sp -= 4;
  // *(uint32_t *)&memory[sp] = argc;
  *(uint32_t *)&memory[translate(sp)] = argc;

  // registers for systemV abi: stack pointer is x[2]
  x[2] = sp;

  // some CRTs might optionally use a0/a1, not standard but fine to preserve
  x[10] = argc;
  x[11] = sp + 4; // pointer to argv

  free(argv_ptrs);
  free(envp_ptrs);

  return sp;
}

void load_elf(const char *path, uint32_t base_addr, uint8_t *memory,
              uint32_t *programcounter, uint32_t *pc_inst) {
  fs_node_t *node = fs_lookup(path);
  if (!node || node->type != FS_FILE) {
    if (node)
      printf("name = %s\n", node->name);
    printf("ELF not found: %s\n", path);
    exit(1);
  }

  int fd = alloc_fd(node);
  if (fd < 0) {
    printf("No free file descriptors\n");
    exit(1);
  }

  Elf32_Ehdr eh;
  fs_read(fd, (uint8_t *)&eh, sizeof(eh));

  // check ELF magic
  if (eh.e_ident[0] != 0x7f || eh.e_ident[1] != 'E' || eh.e_ident[2] != 'L' ||
      eh.e_ident[3] != 'F') {
    printf("Invalid ELF\n");
    exit(1);
  }

  // go to program headers
  fs_seek(fd, eh.e_phoff);

  for (int i = 0; i < eh.e_phnum; i++) {
    Elf32_Phdr ph;
    fs_read(fd, (uint8_t *)&ph, sizeof(ph));

    if (ph.p_type != PT_LOAD) {
      fs_seek(fd, eh.e_phoff + (i + 1) * sizeof(Elf32_Phdr));
      continue;
    }

    // load segment
    fs_seek(fd, ph.p_offset);
    uint32_t phys_addr = translate(base_addr + ph.p_vaddr);
    // fs_read(fd, &memory[base_addr + ph.p_vaddr], ph.p_filesz);
    fs_read(fd, &memory[phys_addr], ph.p_filesz);

    // zero BSS
    if (ph.p_memsz > ph.p_filesz) {
      // memset(&memory[base_addr + ph.p_vaddr + ph.p_filesz], 0, ph.p_memsz -
      // ph.p_filesz);
      memset(&memory[phys_addr + ph.p_filesz], 0, ph.p_memsz - ph.p_filesz);
    }

    // restore ph table position
    fs_seek(fd, eh.e_phoff + (i + 1) * sizeof(Elf32_Phdr));
  }

  fs_close(fd);

  // push return address (stack version!)
  // return_stack[call_depth++] = *programcounter;

  *programcounter = base_addr + eh.e_entry;
  *pc_inst = *programcounter;

  // printf("ELF loaded: %s\n", path);
}

void syscall_write(uint32_t *x, uint8_t *memory) {
  uint32_t fd = x[10];
  uint32_t addr = x[11];
  uint32_t len = x[12];

  // uint8_t *buf = &memory[addr];
  uint8_t *buf = &memory[translate(addr)];

  if (fd == 1 || fd == 2) {
    for (uint32_t i = 0; i < len; i++)
      putchar(buf[i]);
    fflush(stdout);
    x[10] = len;
  } else if (fd >= 0 && fd < MAX_FD && fd_table[fd].used) {
    fd_t *f = &fd_table[fd];
    fs_node_t *node = f->node;

    // grow file if needed
    if (f->offset + len > node->size) {
      node->data = (uint8_t *)realloc(node->data, f->offset + len);
      node->size = f->offset + len;
    }

    memcpy(node->data + f->offset, buf, len);
    f->offset += len;

    x[10] = len;
  } else {
    x[10] = -1;
  }
}

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
static char kb_buf[1024];
static int kb_head = 0, kb_tail = 0;

EMSCRIPTEN_KEEPALIVE
void push_input(char c) {
  int next = (kb_tail + 1) % 1024;
  if (next != kb_head) {
    kb_buf[kb_tail] = c;
    kb_tail = next;
  }
}

int sys_getchar() {
  while (kb_head == kb_tail) {
    emscripten_sleep(10);
  }
  char c = kb_buf[kb_head];
  kb_head = (kb_head + 1) % 1024;
  return c;
}
#else
#define sys_getchar getchar
#endif

void syscall_read(uint32_t *x, uint8_t *memory) {
  uint32_t fd = x[10];
  uint32_t addr = x[11];
  uint32_t len = x[12];

  uint8_t *buf = &memory[translate(addr)];

  if (fd == 0) {
    uint32_t i;
    for (i = 0; i < len; i++) {
      int c = sys_getchar();
      if (c == EOF)
        break;
      buf[i] = (uint8_t)c;
      if (c == '\n') {
        i++;
        break;
      }
    }
    x[10] = i;
  } else if (fd >= 0 && fd < MAX_FD && fd_table[fd].used) {
    x[10] = fs_read(fd, buf, len);
  } else {
    x[10] = -1;
  }
}

void syscall_open(uint32_t *x, uint8_t *memory) {
  // char *path = (char *)&memory[x[10]];
  char *path = (char *)&memory[translate(x[10])];
  fs_node_t *node = fs_lookup(path);

  if (!node) {
    x[10] = -1;
  } else {
    x[10] = alloc_fd(node);
  }
}

uint32_t heap = 0x21000000;

static char *my_strdup(const char *s) {
  char *d = malloc(strlen(s) + 1);
  if (d)
    strcpy(d, s);
  return d;
}

void syscall_execve(uint32_t *x, uint8_t *memory, uint32_t *programcounter,
                    uint32_t *pc_inst) {
  // char *path = (char *)&memory[x[10]];
  char *path = (char *)&memory[translate(x[10])];
  char path_copy[256];
  strncpy(path_copy, path, sizeof(path_copy));
  path_copy[sizeof(path_copy) - 1] = '\0';
  // printf("path = %s\n", path);
  char *argv[32];
  int argc = 0;

  uint32_t argv_addr = x[11];
  if (argv_addr) {
    while (argc < 32) {
      uint32_t ptr = *(uint32_t *)&memory[translate(argv_addr)];
      if (ptr == 0)
        break;

      char *tmp = (char *)&memory[translate(ptr)];
      argv[argc++] = my_strdup(tmp);
      argv_addr += 4;
    }
  }

  char *envp[32];
  int envc = 0;
  uint32_t envp_addr = x[12];
  if (envp_addr) {
    while (envc < 32) {
      uint32_t ptr = *(uint32_t *)&memory[translate(envp_addr)];
      if (ptr == 0)
        break;
      envp[envc++] = my_strdup((char *)&memory[translate(ptr)]);
      envp_addr += 4;
    }
  }

  memset(memory, 0, MEM_SIZE * 1); // sizeof(uint32_t));
  memset(x, 0, 32 * sizeof(uint32_t));
  heap = 0x21000000;               // reset heap
  load_elf(path_copy, 0, memory, programcounter, pc_inst);
  *programcounter -= 4;
  setup_stack(argc, argv, envc, envp, memory, BASE_ADDR + MEM_SIZE * 1,
              x); //;sizeof(uint32_t), x);

  for (int i = 0; i < argc; i++)
    free(argv[i]);
  for (int i = 0; i < envc; i++)
    free(envp[i]);
}

void syscall_brk(uint32_t *x, uint8_t *memory) {
  uint32_t new_brk = x[10];

  if (new_brk == 0) {
    x[10] = heap; // return current break
    return;
  }

  if (new_brk >= x[2]) {
    x[10] = -1;
    return;
  }

  heap = new_brk;
  x[10] = heap;
}

void syscall_fstat(uint32_t *x, uint8_t *memory) {
  // dummy fstat for picolibc: mark all desc as character devices (mode 020000 |
  // 0666)
  uint32_t fd = x[10];
  uint32_t stat_addr = x[11];
  // struct stat in newlib for riscv is complex,
  // but usually st_mode is at offset offset 16 or 12.
  // we can just memset the struct to 0 and set st_mode to S_IFCHR
  uint32_t phys = translate(stat_addr);
  // memset(&memory[stat_addr], 0, 64);
  memset(&memory[phys], 0, 64);

  if (fd == 0 || fd == 1 || fd == 2) {
    // *(uint32_t *)&memory[stat_addr + 16] = 0x2000 | 0666; // S_IFCHR
    *(uint32_t *)&memory[phys + 16] = 0x2000 | 0666; // S_IFCHR
  } else {
    // maybe regular file
    // *(uint32_t *)&memory[stat_addr + 16] = 0x8000 | 0666; // S_IFREG
    *(uint32_t *)&memory[phys + 16] = 0x8000 | 0666; // S_IFREG
  }
  x[10] = 0; // success
}

void syscall_lseek(uint32_t *x, uint8_t *memory) {
  uint32_t fd = x[10];
  uint32_t offset = x[11];
  uint32_t whence = x[12];

  if (fd == 0 || fd == 1 || fd == 2) {
    x[10] = -1; // cannot seek streams
    return;
  }

  if (fd >= 0 && fd < MAX_FD && fd_table[fd].used) {
    fd_t *f = &fd_table[fd];
    switch (whence) {
    case 0:
      f->offset = offset;
      break; // SEEK_SET
    case 1:
      f->offset += offset;
      break; // SEEK_CUR
    case 2:
      f->offset = f->node->size + offset;
      break; // SEEK_END
    }
    x[10] = f->offset;
  } else {
    x[10] = -1;
  }
}

void syscall_close(uint32_t *x, uint8_t *memory) {
  uint32_t fd = x[10];
  if (fd == 0 || fd == 1 || fd == 2) {
    x[10] = 0;
    return;
  }
  if (fd >= 0 && fd < MAX_FD && fd_table[fd].used) {
    fs_close(fd);
    x[10] = 0;
  } else {
    x[10] = -1;
  }
}

void syscall_exit_process(uint32_t *x, uint8_t *memory,
                          uint32_t *programcounter, uint32_t *pc_inst) {
  // Respawn shell rather than kill the emulator process
  char *argv[] = {"/elf", NULL};
  char *envp[] = {NULL};
  memset(memory, 0, MEM_SIZE * 1);
  memset(x, 0, 32 * sizeof(uint32_t));
  heap = 0x21000000;
  load_elf("/elf", 0, memory, programcounter, pc_inst);
  *programcounter -= 4;
  setup_stack(1, argv, 0, envp, memory, BASE_ADDR + MEM_SIZE * 1, x);
}

void syscall_gettimeofday(uint32_t *x, uint8_t *memory) {
  x[10] = 0; // dummy success
}

struct linux_dirent64 {
  uint64_t d_ino;
  int64_t d_off;
  unsigned short d_reclen;
  unsigned char d_type;
  char d_name[];
};

void syscall_getdents64(uint32_t *x, uint8_t *memory) {
  uint32_t fd = x[10];
  uint32_t dirp = x[11];
  uint32_t count = x[12];

  if (fd >= MAX_FD || !fd_table[fd].used || fd_table[fd].node->type != FS_DIR) {
    x[10] = -1;
    return;
  }

  fd_t *f = &fd_table[fd];
  uint32_t written = 0;

  while (f->offset < f->node->child_count) {
    fs_node_t *child = f->node->children[f->offset];
    int name_len = strlen(child->name);
    // 8 + 8 + 2 + 1 = 19 bytes of header + name_len + 1 (null terminator)
    // plus padding to 8 bytes boundary
    int reclen = (19 + name_len + 1 + 7) & ~7;

    if (written + reclen > count) {
      if (written == 0) { // buffer too small for even one entry
        x[10] = -1;
        return;
      }
      break;
    }

    // struct linux_dirent64 *ent = (struct linux_dirent64 *)&memory[dirp +
    // written];
    struct linux_dirent64 *ent =
        (struct linux_dirent64 *)&memory[translate(dirp + written)];
    memset(ent, 0, reclen);
    ent->d_ino = f->offset + 100; // dummy inode
    ent->d_off = f->offset + 1;
    ent->d_reclen = reclen;
    ent->d_type = (child->type == FS_DIR) ? 4 : 8; // DT_DIR=4, DT_REG=8
    strcpy(ent->d_name, child->name);

    written += reclen;
    f->offset++;
  }

  x[10] = written; // return bytes written
}

void syscall_jscmd(uint32_t *x, uint8_t *memory) {
  // Custom syscall 511: send OSC escape to JS
  // a0 = pointer to command string in guest memory
  uint32_t addr = x[10];
  char *str = (char *)&memory[translate(addr)];
  // OSC 999 ; <payload> BEL
  printf("\033]999;%s\007", str);
  fflush(stdout);
  x[10] = 0;
}

void syscall_mkdirat(uint32_t *x, uint8_t *memory) {
  // mkdirat(dirfd, path, mode) - we ignore dirfd
  char *path = (char *)&memory[translate(x[11])];
  fs_node_t *parent = fs_root;

  // Navigate to parent directory
  char temp[256];
  strncpy(temp, path, sizeof(temp));
  temp[sizeof(temp) - 1] = '\0';

  char *last_slash = strrchr(temp, '/');
  char *dirname = NULL;
  if (last_slash && last_slash != temp) {
    *last_slash = '\0';
    dirname = last_slash + 1;
    parent = fs_lookup(temp);
    if (!parent || parent->type != FS_DIR) {
      x[10] = (uint32_t)-1;
      return;
    }
  } else if (last_slash == temp) {
    dirname = temp + 1;
  } else {
    dirname = temp;
  }

  // Check if already exists
  for (int i = 0; i < parent->child_count; i++) {
    if (strcmp(parent->children[i]->name, dirname) == 0) {
      x[10] = (uint32_t)-1; // EEXIST
      return;
    }
  }

  fs_create_dir(parent, dirname);
  x[10] = 0;
}
