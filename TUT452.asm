;**********************************************************
;*  tut452.asm
;**********************************************************
;*  Microchip Technology Incorporated
;*  17 March 2003
;*  Assembled with MPASM V3.20 and MPLINK v3.20
;**********************************************************
;*  This program configures the A/D Module to convert on
;*  A/D channel 0 (the potentiometer) and display the
;*  results on the LEDS on PORTB.
;**********************************************************

    #include "p18cxxx.inc"              ; wrapper for all PIC18 symbols

    ; if building for PIC18F452
    #include "ConfigRegsPIC18f452.inc"  ; set Configuration Registers
    
    ; if building for PIC18F4520
    ;#include "ConfigRegsPIC18f4520.inc" ; set Configuration Registers
    
    ; Start at the reset address. There *must* be code at address
    ; 0x000 since the PC is loaded with address 0 when the processor
    ; comes out of reset. This declares a code section named 'RST'.
RST code 0x0000
    goto Setup

    ; Start application beyond vector area.
    ; This declares an 'unnamed' code section.
	code    0x0030
Setup:
    clrf    PORTB           ; Clear PORTB
    clrf    TRISB           ; PORTB all outputs, display 4 MSB's
    
    movlw B'11111111'
    movwf PORTB
                            ; of A/D result on LEDs
    movlw   B'01000001'     ; Fosc/8, A/D enabled
    movwf   ADCON0
    movlw   B'00001110'     ; Left justify, 1 analog channel
    movwf   ADCON1          ; VDD and VSS references

    movlw   B'11000111'     ; TMR0 prescaler, 1:256
    movwf   T0CON

Main:
    btfss   INTCON, TMR0IF  ; Wait for Timer0 to timeout
    goto    Main
    bcf     INTCON, TMR0IF

    bsf     ADCON0, GO      ; Start A/D conversion

WaitForAdConversion:
    btfss   PIR1, ADIF      ; Wait for conversion to complete
    goto    WaitForAdConversion

    movf   ADRESH, W          ; Write A/D result to PORTB
    movwf PORTB
    goto    Main            ; Do it again

    end
