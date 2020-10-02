
;**********************************************************
;**********************************************************
;*  Microchip Technology Incorporated
;*  Assembled with MPASM V3.20 and MPLINK v3.20
;**********************************************************


    #include "p18cxxx.inc"              ; wrapper for all PIC18 symbols

    ; if building for PIC18F452
    #include "ConfigRegsPIC18f452.inc"  ; set Configuration Registers

    ; Start at the reset address. There *must* be code at address
    ; 0x000 since the PC is loaded with address 0 when the processor
    ; comes out of reset. This declares a code section named 'RST'.
RST code 0x0000
    goto Setup

    ; Start application beyond vector area.
    ; This declares an 'unnamed' code section.
	code    0x0030

; *****************************************************************************
; This function takes a parameter in the WREG, a byte value to be displayed on
; a segmented display connected to PORTD.
; A value of 0 will be displayed with 1 bar and 255 with all 8
; *****************************************************************************
SetupSegments:
  clrf PORTD;
  clrf TRISD;

  return


SetSegments:
    ; Construct a byte by rotating the 3 MSB bits of a given byte
    ; such that they become the 3 LSB of the resulting byte, and
    ; clear the remaining unknown/unused bits
    swapf WREG, W	    ; i.e. rotate left 4 times
    rrncf WREG, w	    ; rotate right once
    andlw B'00000111'	    ; clear unknown bits

    ; Add one to the result, this will prevent the byte from becoming negative
    ; when decrementing.
    addlw 1

    clrf PORTD		    ; clear the display port before loading

    ; Set the carry bit and rotate it in to the display register,
    ; repeat this until the WREG is clear
    LoadSegments:
	bsf STATUS, C
	rlcf PORTD, 1
	decfsz WREG, 1, 0
	bra LoadSegments

    return




SetupAD:
    clrf PORTA
    clrf LATA
    movlw B'00001011'
    movwf TRISA

    movlw B'01000001'	; set Fosc/8 and power up converter
    movwf ADCON0

    movlw B'00000100'	;AN3, AN1, AN0 set as analog inputs, VDD and VSS as VREFS
    movwf ADCON1

    movlw B'11000111'	;Timer on, prescaler 255, 8bit counter on low to high
    movwf T0CON

    return

GetAD:
    bcf ADCON0, 3
    tstfsz WREG
	bsf ADCON0, 3

    WaitForAcquisition:
    btfss   INTCON, TMR0IF  ; Wait for Timer0 to timeout
    bra	    WaitForAcquisition
    bcf     INTCON, TMR0IF


    bsf     ADCON0, GO      ; Start A/D conversion


    WaitForAdConversion:
	btfss   PIR1, ADIF      ; Wait for conversion to complete
	bra    WaitForAdConversion

    return





CONSTANT PR2_PERIOD = 249		; 10MHz / ( 40kHz ) - 1 = 249;
SetupPWM:
    clrf PORTC		;
    clrf TRISC		;

    movlw PR2_PERIOD	;	Set PWM frequency to ~40kHz
    movwf PR2		;

    movlw B'00001100'	;	Set the Compare/Capture/PWM to PWM mode
    movwf CCP1CON	;

    movlw B'00111101'	;	Set the duty cycle as to get 50% cycle
    movwf CCPR1L	;

    movlw B'00000100'	;	Timer 2: postscaler = 1, prescaler = 1, turn timer on
    movwf T2CON		;

    return




; Given a PWM cycle of 40kHz the maximum duty cycle must be 1/40kHz = (DC)*(1/10MHz)
; DC = (0 - 250) ~ (0 - 255)
SetPWMToADRESH:
    swapf ADRESH, W
    andlw B'00110000'	    ;
    iorwf CCP1CON, 1, 0	    ;

    bcf STATUS, C	    ;
    rrcf ADRESH, W	    ;
    bcf STATUS, C	    ;
    rrcf WREG, W	    ;
    movwf CCPR1L	    ;

    return




Setup:
   call SetupSegments
   call SetupAD
   call SetupPWM

Main:
    movlw 1
    call GetAD

    call SetPWMToADRESH

    movlw 0
    call GetAD

    movf ADRESH, W
    call SetSegments

    bra Main

    end
