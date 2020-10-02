/*
 * File:   Exercise4.c
 * Author: Gabriel Ralph
 *
 * Created on 23 September 2020, 3:40 PM
 */

#include <stdio.h>
#include <stdlib.h>
#include "../ConfigRegsPIC18f452.h"
/*
 *
 */
#define DATA 0
#define CLK 1
#define LOAD 2
#define SRCLK 3
#define RCLK 4

#define SET(x) {_asm BSF PORTD, x, 0 _endasm}
#define CLR(x) {_asm BCF PORTD, x, 0 _endasm}
#define RISE(x) {_asm BCF PORTD, x, 0 BSF PORTD, x, 0_endasm}
#define FALL(x) {_asm BSF PORTD, x, 0 BCF PORTD, x, 0_endasm}

void shiftAcross(int);
void initShift(void);

void delay(void);
void initDelay(void);


void main(void) {

    initShift();       // Initialize PORTD for shift register controll
    initDelay();       // Initialize TIMER1 and CCP1 for delay

    while(1){
      delay();         // Wait until 33.3344ms have elapsed
      shiftAcross();   // Shift the byte across from the 165 to 595
    }
}

void initDelay(void){
    T1CON = 0b10110001;     // 16-bit, 8 PC, internal clock Fosc/4
    CCP1CON = 0b00000010;   // Compare, toggle
    CCPR1 = 10417;          // 10,000,000/4/8/30Hz = 10416.66667 ~ 10417
    TMR1L = 0;              // Clear timer
    TMR1H = 0;
}
void delay(void){
    //Wait for compare
    while(PIR1bits.CCP1IF == 0){
    }

    //Reset
    PIR1bits.CCP1IF = 0;
    TMR1L = 0;
    TMR1H = 0;
}

void initShift(void){
    TRISD = 1;  // Use RD0 as an input and the rest as outputs
    PORTD = 0;  // Clear PORTD
}
void shiftAcross(int res){
    int i;
    RISE(LOAD);                       //Load 165 with the state of the dip switch
    for(i = 0; i < 8; i++){           //For every bit in a byte
        res |= (PORTD & 1) << (7 - i);  //Store the nth bit in the nth bit of res
        RISE(SRCLK);                    //Trigger the 595 clock to push the 165's QH bit into the 595's serial register
        RISE(CLK);                      //Trigger the 165 clock to push the next dip switch state to QH
    }
    RISE(RCLK);                       //Trigger the RCLK to latch the data through to output (595)
    return res;
}
