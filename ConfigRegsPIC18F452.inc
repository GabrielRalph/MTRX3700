;******************************************************************************
;
;    File Name: ConfigRegsPIC18F452.inc
;
;    PIC18F452 Configuration Bit Settings
;
;    The CONFIG directive defines configuration register data from within the
;    .ASM file. Values set here will override those defined in the MPLAB IDE.
;    The labels following the directive are defined in the file P18F452.inc.
;    The PIC18FXX2 Data Sheet explains the functions of the configuration bits.
;
;    This file is suitable for both debugging and production. Change it to
;    suit your application.
;
;    Usage: #include ConfigRegsPIC18F452.inc
;
;    Bugs:  --
;
;    ToDo:  --
;
;    Revision History
;       Vers    Date         Who?       Revision Detail?
;       1.1     27-Aug-2019  DCR        Improved comments and conditionals
;       1.0     05-Apr-2005  DCR        First release
;
;******************************************************************************

#ifndef __18F452
#error  "ERROR: Configuration-header file mismatch. Verify selected processor."
#endif

; CONFIG1H (address:0x300001, mask:0xCF, default:0x07)
;
; Oscillator Selection:
;   OSC = LP          LP
;   OSC = XT          XT
;   OSC = HS          HS                      (use for Minimal Board)
;   OSC = RC          RC
;   OSC = EC          EC-OSC2 as Clock Out    (use for PICDEM 2 Plus board)
;   OSC = ECIO        EC-OSC2 as RA6
;   OSC = HSPLL       HS-PLL Enabled          (alternate for Minimal Board)
;   OSC = RCIO        RC-OSC2 as RA6
;
; Osc. Switch Enable:
;   OSCS = ON         Enabled
;   OSCS = OFF        Disabled
;
; Power Up Timer:
;   PWRT = ON         Enabled
;   PWRT = OFF        Disabled

    CONFIG OSC = HS, OSCS = OFF, PWRT = ON


; CONFIG2L (address:0x300002, mask:0x1F, default:0x1F)
;
; Brown Out Reset:
;   BOR = OFF         Disabled
;   BOR = ON          Enabled
;
; Brown Out Voltage:
;   BORV = 45         4.5V
;   BORV = 42         4.2V
;   BORV = 27         2.7V
;   BORV = 25         2.5V

    CONFIG BORV = 27

#ifdef __DEBUG
    CONFIG BOR = OFF
#else
    ;  For a production release, consider BOR = ON.
    CONFIG BOR = OFF
#endif


; CONFIG2H (address:0x300003, mask:0x1F, default:0x1F)
;
; Watchdog Timer:
;   WDT = OFF         Disabled
;   WDT = ON          Enabled
;
; Watchdog Postscaler:
;   WDTPS = 1         1:1
;   WDTPS = 2         1:2
;   WDTPS = 4         1:4
;   WDTPS = 8         1:8
;   WDTPS = 16        1:16
;   WDTPS = 32        1:32
;   WDTPS = 64        1:64
;   WDTPS = 128       1:128

    CONFIG WDTPS = 128

#ifdef __DEBUG
    CONFIG WDT = OFF
#else
    ;  For a production release, consider WDT = ON, but note that you will
    ;  need to configure and 'kick' the watchdog timer from your code.
    CONFIG WDT = OFF
#endif


; CONFIG3H (address:0x300005, mask:0x87, default:0x83)
;
; CCP2 Mux:
;   CCP2MUX = OFF     Disable (CCP2 is on RB3)
;   CCP2MUX = ON      Enable  (CCP2 is on RC1)
; CCP2 Mux enabled (RC1)

    CONFIG CCP2MUX = ON ; CCP2 is on RC1 - Default


; CONFIG4L (address:0x300006, mask:0xC5, default:0x85)
;
; Stack Overflow Reset:
;   STVR = OFF        Disabled
;   STVR = ON         Enabled
;
; Low Voltage ICSP:
;   LVP = OFF         Disabled
;   LVP = ON          Enabled
;
; Background Debugger Enable:
;   DEBUG = ON        Enabled
;   DEBUG = OFF       Disabled
; NOTE: LVP = ON is not compatible with DEBUG = ON

    CONFIG STVR = ON

#ifdef __DEBUG
    ; LVP = ON is not compatible with DEBUG = ON
    CONFIG DEBUG = ON       ; debug build
    CONFIG LVP = OFF        ; force LVP OFF
#else
    CONFIG DEBUG=OFF        ; production build
    CONFIG LVP = OFF	    ; can be OFF or ON
#endif


; CONFIG5L (address:0x300008, mask:0x0F, default:0x0F)
;
; Code Protection Block 0:
;   CP0 = ON          Enabled
;   CP0 = OFF         Disabled
;
; Code Protection Block 1:
;   CP1 = ON          Enabled
;   CP1 = OFF         Disabled
;
; Code Protection Block 2:
;   CP2 = ON          Enabled
;   CP2 = OFF         Disabled
;
; Code Protection Block 3:
;   CP3 = ON          Enabled
;   CP3 = OFF         Disabled
; Code protection disabled

  CONFIG CP0 = OFF, CP1 = OFF, CP2 = OFF, CP3 = OFF


; CONFIG5H (address:0x300009, mask:0xC0, default:0xC0)
;
; Boot Block Code Protection:
;   CPB = ON          Enabled
;   CPB = OFF         Disabled
;
; Data EEPROM Code Protection:
;   CPD = ON          Enabled
;   CPD = OFF         Disabled
; Boot block and EEPROM code protection disabled
  CONFIG CPB = OFF, CPD = OFF

; CONFIG6L (address:0x30000A, mask:0x0F, default:0x0F)
;
; Write Protection Block 0:
;   WRT0 = ON         Enabled
;   WRT0 = OFF        Disabled
;
; Write Protection Block 1:
;   WRT1 = ON         Enabled
;   WRT1 = OFF        Disabled
;
; Write Protection Block 2:
;   WRT2 = ON         Enabled
;   WRT2 = OFF        Disabled
;
; Write Protection Block 3:
;   WRT3 = ON         Enabled
;   WRT3 = OFF        Disabled
; PROM Write protection off
  CONFIG WRT0 = OFF, WRT1 = OFF, WRT2 = OFF, WRT3 = OFF



; CONFIG6H (address:0x30000B, mask:0xE0, default:0xE0)
;
; Boot Block Write Protection:
;   WRTB = ON         Enabled
;   WRTB = OFF        Disabled
;
; Configuration Register Write Protection:
;   WRTC = ON         Enabled
;   WRTC = OFF        Disabled
;
; Data EEPROM Write Protection:
;   WRTD = ON         Enabled
;   WRTD = OFF        Disable
; Config Register, Boot block, EEPROM Write protection off
  CONFIG WRTC = OFF, WRTB = OFF, WRTD = OFF

; CONFIG7L (address:0x30000C, mask:0x0F, default:0x0F
;
; Table Read Protection Block 0:
;   EBTR0 = ON        Enabled
;   EBTR0 = OFF       Disabled
;
; Table Read Protection Block 1:
;   EBTR1 = ON        Enabled
;   EBTR1 = OFF       Disabled
;
; Table Read Protection Block 2:
;   EBTR2 = ON        Enabled
;   EBTR2 = OFF       Disabled
;
; Table Read Protection Block 3:
;   EBTR3 = ON        Enabled
;   EBTR3 = OFF       Disabled
    CONFIG EBTR0 = OFF, EBTR1 = OFF, EBTR2 = OFF, EBTR3 = OFF


; CONFIG7H (address:0x30000D, mask:0x40, default:0x40)
;
; Boot Block Table Read Protection:
;   EBTRB = ON        Enabled
;   EBTRB = OFF       Disabled
; Boot block table read protection off
   CONFIG EBTRB = OFF

;------------------------------------------------------------------------------

