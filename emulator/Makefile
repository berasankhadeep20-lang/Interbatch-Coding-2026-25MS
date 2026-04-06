CC      := emcc
CFLAGS  := -Wall -Os -Wextra -std=c17
LDFLAGS := -s ASYNCIFY -s EXPORTED_RUNTIME_METHODS='["FS","callMain"]' -s EXPORTED_FUNCTIONS='["_main","_push_input"]' -s INVOKE_RUN=0 -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=1073741824 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME='"createEmulator"'

TARGET := emulator.js

SRCS := src/main.c src/guest.c
OBJS := $(SRCS:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET) emulator.wasm

re: clean all

.PHONY: all clean re
