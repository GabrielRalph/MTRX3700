/*
 * File:   Exercise3.c
 * Author: Gabriel Ralph
 *
 * Created on 21 September 2020, 4:57 PM
 *
 * Toggles PORTD<0> on a rising edge detected on PORTB<0>
 * Toggles PORTD<1> on a rising edge detected on PORTB<1>
 * Toggles PORTD<2> every 500ms
 */

#include <stdio.h>
#include <stdlib.h>
#include "../ConfigRegsPIC18f452.h"


#define disableInterrupts() INTCONbits.GIE = 0
#define enableInterrupts() INTCONbits.GIE = 1
#define CompareTime(ms, PC) ms*10000000/1000/PC

void main(void);
void high_int_isr (void);


void main(void) {

    /* ---------------------- Initialize ports B, D ------------------------- */
    TRISD = 0;              // Set all of PORTD as outputs
    TRISB |= 0b00111111;    // Set all but the 2 MSB bits of PORTB as inputs
    PORTD = 0;              // Clear PORTB

    disableInterrupts();

    RCONbits.IPEN = 1;      //  Enable high priority interrupts

    /* ----------------- Setup CCP1 and its interrupt ----------------------- */
    CCP1CON =   0b00001010;     //  Compare mode, Generate software interrupt on compare match
    PIE1bits.CCP1IE = 1;        //  enable CCP1 interrupt
    IPR1bits.CCP1IP = 1;        //  make high priority interrupt
    T1CON =     0b1011001;      //  16-bit, PC = 8, internal clock, turn on
    CCPR1 = CompareTime(50, 8);//  Set compare to every 50ms with PC = 8


    /* -------------------- Setup PORTB interrupts -------------------------- */
    INTCONbits.INT0IE = 1;  //  Enable PORTB RB0 and RB1 interrupts
    INTCON3bits.INT1IE = 1;
    INTCON3bits.INT1IP = 1; // Make PORTB RB1 interrupt a high priority
    //note: all PORTB interrupts trigger on rising edge by default (See INTCON2)

    enableInterrupts();

    while(1){} // Do nothing whilst we wait

}

/* ---------- Link high priority interrupt vector to isr function ----------- */
#pragma code high_vector=0x08
void interrupt_at_high_vector (void){
    _asm GOTO high_int_isr _endasm
}
#pragma code

int i = 0;

/* ------- Define function as high priority interrupt service routine ------- */
#pragma interrupt high_int_isr
void high_int_isr (void){

        i += PIR1bits.CCP1IF;   //Increment i if the interrupt was called by CCP1

        PORTD ^= INTCONbits.INT0IF     // Toggle PORTD<0> if INT0 was triggered
               | INTCON3bits.INT1IF<<1 // Toggle PORTD<1> if INT1 was triggered
               | ((i % 10) / 9) << 2;   // Toggle PORTD<2> on the 10th CCP1 trigger


        PIR1bits.CCP1IF = 0;    // Clear all interrupt flag bits
        INTCONbits.INT0IF = 0;
        INTCON3bits.INT1IF = 0;
        TMR1L = 0;
        TMR1H = 0;
}
