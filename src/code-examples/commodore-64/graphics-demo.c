/* C64 Graphics Mode Demo
   Build: cl65 -t c64 -o demo.prg demo.c */

#include <c64.h>
#include <conio.h>

void set_multicolor_mode(void) {
    __asm__ ("lda $d016");
    __asm__ ("ora #$10");  // Set multicolor bit
    __asm__ ("sta $d016");
}

int main(void) {
    unsigned char x, y;

    // Clear screen
    clrscr();

    // Set colors
    bordercolor(COLOR_BLUE);
    bgcolor(COLOR_BLACK);

    // Enable multicolor mode
    set_multicolor_mode();

    // Draw pattern
    for (y = 0; y < 25; ++y) {
        for (x = 0; x < 40; ++x) {
            gotoxy(x, y);
            cputc((x + y) & 0xFF);
        }
    }

    // Wait for keypress
    cgetc();
    return 0;
}