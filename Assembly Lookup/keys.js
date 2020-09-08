var ASSEMBLY = {
  "PIC18MCU": {
    "Keys": {
      "Register Files": {
        "dest": "Destination either the WREG register or the specfied register file location. See d.",
        "f": "Register file address\nf 8-bit (0xOO to 0xFF)\nf' 12-bit (0xOOO to OxFFF) - source address\nf'' 12-bit (0xOOO to OxFFF)-destination address",
        "r": "0, 1 or 2 for FSR number",
        "x": "Don't care bit ('0' or '1')",
        "z": "Indirect adressing offset\n7-bit offset value for Indirect addressing of register files (source)\nz'' 7-bit offset value for indirect addressing of register files (destination)",
      },
      "Literals":{
        "k": "4-bit literal field, constant data or label.",
        "kk": "8-bit literal field, constant data or label.",
        "kkk": "12-bit literal field, constant data or label.",
      },
      "Offsets, Increments/Decrements": {
        "n": "The relative address (2's complement number) for\nrelative branch Instructions, or the direct address for\nCall/Branch and Return Instructions.",
        // "TBLPTR register read/write mode": {
        //   "*": "No Change to register",
        //   "*+": "Post-Increment register",
        //   "*-": "Post-Decrement register",
        //   "+*": "Pre-Increment register"
        // }
      },
      "Bits": {
        "a": "RAM access bit\na = 0:RAM location in Access RAM (BSR register is ignored)\na = 1: RAM bank Is specified by BSA register (default)",
        "b": "Bit address within an 8-bit file register (0 to 7).",
        "d": "Destination select bit\nd = 0:store result in WREG\nd = 1:store result in file register (default)",
        "s": "Fast Call/Return mode select bit\ns = 0:do not update into/from shadow register (default)\ns = 1:certain registers loaded into/from shadow registers (Fast mode)",
      },
      "Named Registers":{
        "BSR": "Bank Select Register. Used to select the current RAM bank",
        "FSR": "File Select Register",
        "PCL": "Program Counter Low Byte",
        "PCH": "Program Counter High Byte",
        "PCLATH": "Program Counter High Byte Latch",
        "PCLATU": "Program Counter Upper Byte Latch",
        "PRODH": "Product of Muhiply High Byte",
        "PRODL": "Product of Muhiply Low Byte",
        "STATUS": "Status Register",
        "TABLAT": "8-bit Table Latch",
        "TBLPTR": "21-bit Table Pointer (points to a Program Memory location)",
        "WREG": "Working register (accumulator)",
      },
      "ALU Status bits": {
        "C": "Carry",
        "DC": "Digit Carry",
        "Z": "Zero",
        "OV": "Overflow",
        "N": "Negative"
      },
      "Named Bits": {

        "TO": "Time-out bit",
        "PD": "Power-down bit",
        "PEIE": "Peripheral Interrupt Enable bit",
        "GIE": "Global lntemJpt Enable blt(s)",
        "GIEL": "Global lntemJpt Enable blt(s)",
        "GIEH": "Global lntemJpt Enable blt(s)"
      },
      "Named Device Features": {
        "MCLR": "Master clear device reset",
        "PC": "Program Counter",
        "TOS": "Top-of-stack",
        "WDT": "Watchdog llmer"
      },
      "Misc. Descriptors": {
        "→": "Assigned to",
        "|": "Or operation",
        "!": "Not operator"
      }
    },
    "Instruction Set": {
      "Bit-Oriented Register Operations": {
        "xblank": {
          "Hex": "xblank",
          "Mnemonic": "xblank",
          "Description": "xblank",
          "Function": "xblank"
        }
      },
      "Control Operations": {
        "xblank": {
          "Hex": "xblank",
          "Mnemonic": "xblank",
          "Description": "xblank",
          "Function": "xblank"
        }
      },
      "Literal Operations": {
        "xblank": {
          "Hex": "xblank",
          "Mnemonic": "xblank",
          "Description": "xblank",
          "Function": "xblank"
        }
      },
      "Memory Operations": {
        "xblank": {
          "Hex": "xblank",
          "Mnemonic": "xblank",
          "Description": "xblank",
          "Function": "xblank"
        }
      },
      "PIC18 Extneded Instructions": {
        "xblank": {
          "Hex": "xblank",
          "Mnemonic": "xblank",
          "Description": "xblank",
          "Function": "xblank"
        }
      },
      "Byte-Oriented Register Operations": {
        "ADDWF": {
          "Hex": "27f*",
          "Mnemonic": "ADDWF f,d,a",
          "Description": "ADD WREG to f",
          "Function": "WREG+f → dest"
        },
        "ADDWFC": {
          "Hex": "23f*",
          "Mnemonic": "ADDWFC f,d,a",
          "Description": "ADD WREG and Carry bit to f",
          "Function": "WREG+f+C → dest"
        },
        "ANDWF": {
          "Hex": "17f*",
          "Mnemonic": "ANDWF f,d,a",
          "Description": "AND WREG with f",
          "Function": "WREG&f → dest"
        },
        "CLRF": {
          "Hex": "6Bf*",
          "Mnemonic": "CLRF f,a",
          "Description": "Clear f",
          "Function": "0 → f"
        },
        "COMF": {
          "Hex": "1Ff*",
          "Mnemonic": "COMF f,d,a",
          "Description": "Complement f",
          "Function": "!f → f"
        },
      },
    }
  }
}

var ITNS = {"Bit-Oriented Register Operations":{"BCF":{"Hex":"91f*","Mnemonic":"BCF f,b,a","Description":"Bit Clear f","Function":"0 → f<b>"},"BSF":{"Hex":"81f*","Mnemonic":"BSF f,b,a","Description":"Bit Set f","Function":"1 → f<b>"},"BTFSC":{"Hex":"B1f*","Mnemonic":"BTFSC f,b,a","Description":"Bit test f, skip if clear","Function":"if f<b> = 0, PC+4 → PC, else PC+2 → PC"},"BTFSS":{"Hex":"A1f*","Mnemonic":"BTFSS f,b,a","Description":"Bit test f, skip if set","Function":"If f<b>=1, PC+4 → PC, else PC+2 → PC"},"BTG":{"Hex":"71f*","Mnemonic":"BTG f,b,a","Description":"Bit Toggle f","Function":"!f<b> → f<b>"}},"Control Operations":{"BC":{"Hex":"E2n","Mnemonic":"BC n","Description":"Branch if Carry","Function":"if C=1, PC+2+2*n → PC, else PC+2 → PC"},"BN":{"Hex":"E6n","Mnemonic":"BN n","Description":"Branch if Negative","Function":"if N=1, PC+2+2*n → PC, else PC+2 → PC"},"BNC":{"Hex":"E3n","Mnemonic":"BNC n","Description":"Branch if Not Carry","Function":"if C=0, PC+2+2*n → PC, else PC+2 → PC"},"BNN":{"Hex":"E7n","Mnemonic":"BNN n","Description":"Branch if Not Negative","Function":"if N=0, PC+2+2*n → PC, else PC+2 → PC"},"BNOV":{"Hex":"E5n","Mnemonic":"BNOV n","Description":"Branch if Not Overflow","Function":"if OV = 0, PC+2+2*n → PC, else PC+2 → PC"},"BNZ":{"Hex":"E1n","Mnemonic":"BNZ n","Description":"Branch if Not Zero","Function":"if Z=0, PC+2+2*n → PC, else PC+2 → PC"},"BOV":{"Hex":"E4n","Mnemonic":"BOV n","Description":"Branch if Overflow","Function":"if OV=1, PC+2+2*n → PC, else PC+2 → PC"},"BRA":{"Hex":"D'0'n","Mnemonic":"BRA n","Description":"Branch Unconditionally","Function":" PC+2+2*n → PC"},"BZ":{"Hex":"E0n","Mnemonic":"BZ n","Description":"Branch if Zero","Function":"if Z=1, PC+2+2*n → PC, else PC+2 → PC"},"CALL":{"Hex":"ECkk* Fkkk","Mnemonic":"CALL n,s","Description":"Call Subroutine 1st word 2nd word","Function":"PC+4 → TOS, n → PC<20:1>, if s=1, WREG → WREGs, STATUS → STATUSs, BSR → BSRs"},"CLRWDT":{"Hex":"0004","Mnemonic":"CLRWDT","Description":"Clear Watchdog Timer","Function":"0 → WDT, 0 → WDT postscaler, 1 → TO, 1 → PD"},"DAW":{"Hex":"0007","Mnemonic":"DAW","Description":"Decimal Adjust WREG","Function":"if WREG<3:0> > 9 or DC=1, WREG<3:0>+6 → WREG<3:0>, else WREG<3:0> → WREG<3:0>; if WREG<7:4> > 9 or C=1, WREG<7:4>+6 → WREG<7:4>, else WREG<7:4> → WREG<7:4>"},"GOTO":{"Hex":"EFkk Fkkk","Mnemonic":"GOTO n","Description":"Go to address 1st word 2nd word","Function":"n → PC<20:1>"},"NOP":{"Hex":"Fxxx","Mnemonic":"NOP","Description":"No Operation","Function":"No Operation (2-word instruction)"},"POP":{"Hex":"0006","Mnemonic":"POP","Description":"Pop top of return stack (TOS)","Function":"TOS-1 → TOS"},"PUSH":{"Hex":"0005","Mnemonic":"PUSH","Description":"Push top of return stack (TOS)","Function":"PC+2 → TOS"},"RCALL":{"Hex":"D'1'n","Mnemonic":"RCALL n","Description":"Relative Call","Function":"PC+2 → TOS, PC+2+2*n → PC"},"RESET":{"Hex":"00FF","Mnemonic":"RESET","Description":"Software device reset","Function":"Same as MCLR reset"},"RETFIE":{"Hex":"0010*","Mnemonic":"RETFIE s","Description":"Return from interrupt (and enable interrupts)","Function":"TOS → PC, 1 → GIE/GIEH or PEIE/GIEL, if s=1, WREGs → WREG, STATUSs → STATUS, BSRs → BSR, PCLATU/PCLATH unch"},"RETURN":{"Hex":"0012*","Mnemonic":"RETURN s","Description":"Return from subroutine","Function":"TOS → PC, if s=1, WREGs → WREG, STATUSs → STATUS, BSRs → BSR, PCLATU,PCLATH unch"},"SLEEP":{"Hex":"0003","Mnemonic":"SLEEP","Description":"Enter SLEEP mode","Function":"0 → WDT, 0 → WDT postscaler, 1 → TO, 0 → PD"}},"Literal Operations":{"ADDLW":{"Hex":"0Fkk","Mnemonic":"ADDLW kk","Description":"Add literal to WREG","Function":"WREG+kk → WREG"},"ANDLW":{"Hex":"OBkk","Mnemonic":"ANDLW kk","Description":"AND literal with WREG","Function":"\tWREG & kk → WREG"},"IORLW":{"Hex":"09kk","Mnemonic":"IORLW kk","Description":"Inclusive OR literal with WREG","Function":"WREG | kk → WREG"},"LFSR":{"Hex":"EErk F0kk","Mnemonic":"LFSR r, kk","Description":"Move literal (12 bit) 2nd word to FSRr 1st word","Function":"kk → FSRr"},"MOVLB":{"Hex":"010k","Mnemonic":"MOVLB k","Description":"Move literal to BSR<3:0>","Function":"kk → BSR"},"MOVLW":{"Hex":"0Ekk","Mnemonic":"MOVLW kk","Description":"Move literal to WREG","Function":"kk → WREG"},"MULLW":{"Hex":"0Dkk","Mnemonic":"MULLW kk","Description":"Multiply literal with WREG","Function":"WREG * kk → PRODH:PRODL"},"RETLW":{"Hex":"0Ckk","Mnemonic":"RETLW kk","Description":"Return with literal in WREG","Function":"kk → WREG"},"SUBLW":{"Hex":"08kk","Mnemonic":"SUBLW kk","Description":"Subtract WREG from literal","Function":"kk - WREG → WREG"},"XORLW":{"Hex":"0Akk","Mnemonic":"XORLW kk","Description":"Exclusive OR literal with WREG","Function":"WREG XOR kk → WREG"}},"Memory Operations":{"TBLRD*":{"Hex":"0008","Mnemonic":"TBLRD*","Description":"Table Read","Function":"Prog Mem (TBLPTR) → TABLAT"},"TBLRD*+":{"Hex":"0009","Mnemonic":"TBLRD*+","Description":"Table Read with post-increment","Function":"Prog Meme (TBLPTR) → TABLAT, TBLPTR + 1 → TBLPTR"},"TBLRD*-":{"Hex":"000A","Mnemonic":"TBLRD*-","Description":"Table Read with post-decrement","Function":"Prog Mem (TBLPTR) → TABLAT, TBLPTR - 1 → TBLPTR"},"TBLRD+*":{"Hex":"000B","Mnemonic":"TBLRD+*","Description":"Table Read with pre-increment","Function":"TBLPTR + 1 → TBLPTR, Prop mem (TBLPTR) → TABLAT"},"TBLWT*":{"Hex":"000C","Mnemonic":"TBLWT*","Description":"Table Write","Function":"TABLAT → Prog Mem (TBLPTR)"},"TBLWT*+":{"Hex":"000D","Mnemonic":"TBLWT*+","Description":"Table Write with post-increment","Function":"TABLAT → Prog Mem (TBLPTR), TBLPTR + 1 → TBLPTR"},"TBLWT*-":{"Hex":"000E","Mnemonic":"TBLWT*-","Description":"Table Write with post-decrement","Function":"TABLAT → Prog Mem (TBLPTR), TBLPTR - 1 → TBLPTR"},"TBLWT+*":{"Hex":"000F","Mnemonic":"TBLWT+*","Description":"Table Write with pre-increment","Function":"TBLPTR + 1 → TBLPTR, TABLAT → Prog Mem (TBLPTR)"}},"PIC18 Extneded Instructions":{"ADDFSR":{"Hex":"E8fk","Mnemonic":"ADDFSR f,k","Description":"Add literal to FSR","Function":"FSR(f) + k → FSR(f)"},"ADDULNK":{"Hex":"E8Ck","Mnemonic":"ADDULNK k","Description":"Add literal to FSR2 and return","Function":"FSR2 + k → FSR2, (TOS) → PC"},"CALLW":{"Hex":"0014","Mnemonic":"CALLW","Description":"Call subroutine using WREG","Function":"(PC + 2) → TOS, (WREG) → PCL, (PCLATH) → PCH, (PCLATU) → PCU"},"MOVSF":{"Hex":"EB'0'z Ffff","Mnemonic":"MOVSF z', f''","Description":"Move z' (source) to 1st word, f'' (destination) 2nd word","Function":"((FSR2)  + z') → f''"},"MOVSS":{"Hex":"EB'1'z Fxzz","Mnemonic":"MOVSS z', z''","Description":"\tmove z' (soruce) to 1st word, z'' (destination) 2nd word","Function":"((FSR2) + z') → (FSR2) + z\")"},"PUSHL":{"Hex":"EAkk","Mnemonic":"PUSHL k","Description":"Store literal at FSR2, decrement FSR2","Function":"k → (FSR2), FR2 - 1 → FSR2"},"SUBFSR":{"Hex":"E9fk","Mnemonic":"SUBFSR f, k","Description":"Subtract literal from FSR","Function":"FSR(f - k) → FSR(f)"},"SUBULNK":{"Hex":"E9Ck","Mnemonic":"SUBULNK k","Description":"Subtract literal from FSR2 and return","Function":"\tFSR - k → FSR2, (TOS) → PC"}},"Byte-Oriented Register Operations":{"ADDWF":{"Hex":"27f*","Mnemonic":"ADDWF f,d,a","Description":"ADD WREG to f","Function":"WREG+f → dest"},"ADDWFC":{"Hex":"23f*","Mnemonic":"ADDWFC f,d,a","Description":"ADD WREG and Carry bit to f","Function":"WREG+f+C → dest"},"ANDWF":{"Hex":"17f*","Mnemonic":"ANDWF f,d,a","Description":"AND WREG with f","Function":"WREG&f → dest"},"CLRF":{"Hex":"6Bf*","Mnemonic":"CLRF f,a","Description":"Clear f","Function":"0 → f"},"COMF":{"Hex":"1Ff*","Mnemonic":"COMF f,d,a","Description":"Complement f","Function":"!f → f"},"CPFSEQ":{"Hex":"63f*","Mnemonic":"CPFSEQ f, a","Description":"Compare f with WREG, skip is f=WREG","Function":"f-WREG, if f=WREG,PC+4 → PC, else PC+2 → PC"},"CPFSGT":{"Hex":"65f*","Mnemonic":"CPFSGT f,a","Description":"Compare f with WREG, skip if f > WREG","Function":"f-WREG, if f > WREG, PC+4 → PC, else PC+2 → PC"},"CPFSLT":{"Hex":"61f*","Mnemonic":"CPFSLT f,a","Description":"Compare f with WREG, skip if f < WREG","Function":"f-WREG, if f < WREG, PC+4 → PC, else PC+2 → PC"},"DECF":{"Hex":"07f*","Mnemonic":"DECF f,d,a","Description":"Decrement f","Function":"f - 1 → dest"},"DECFSZ":{"Hex":"2Ff*","Mnemonic":"DECFSZ f,d,a","Description":"Decrement f, skip if 0","Function":"f - 1 → dest, if dest = 0, PC+4 → PC, else PC+2 → PC"},"DCFSNZ":{"Hex":"4Ff*","Mnemonic":"DCFSNZ f,d,a","Description":"Decrement f, skip if not 0","Function":"\tf - 1 → dest, if dest ≠ 0, PC+4 → PC, else PC+2 → PC"},"INCF":{"Hex":"2Bf*","Mnemonic":"INCF f,d,a","Description":"Increment f","Function":"f + 1 → dest"},"INCFSZ":{"Hex":"3Ff*","Mnemonic":"INCFSZ f,d,a","Description":"Increment f, skip if 0 ","Function":"f + 1 → dest, if dest = 0, PC+4 → PC, else PC+2 → PC"},"INFSNZ":{"Hex":"4Bf*","Mnemonic":"INFSNZ f,d,a","Description":"Increment f, skip if not 0","Function":"f + 1 → dest, if dest ≠ 0, PC+4 → PC, else PC+2 → PC"},"IORWF":{"Hex":"13f*","Mnemonic":"IORWF f,d,a","Description":"Inclusive OR WREG with f","Function":"WREG | f → dest"},"MOVF":{"Hex":"53f*","Mnemonic":"MOVF f,d,a","Description":"Move f","Function":"f → dest"},"MOVFF":{"Hex":"Cf' Ff''","Mnemonic":"MOVFF f',f\"","Description":"Move f' to f\" (second word)","Function":"f' → f''"},"MOVWF":{"Hex":"6Ff*","Mnemonic":"MOVWF f,a","Description":"Move WREG to f","Function":"WREG → f"},"MULWF":{"Hex":"03f*","Mnemonic":"MULWF f,a","Description":"Multiply WREG with f","Function":"WREG * f → PRODH:PRODL"},"NEGF":{"Hex":"6Df*","Mnemonic":"NEGF f,a","Description":"Negate f","Function":"-f → f"},"RLCF":{"Hex":"37f*","Mnemonic":"RLCF f,d,a","Description":"Rotate left f through Carry","Function":"add pic"},"RLNCF":{"Hex":"47f*","Mnemonic":"RLNCF f,d,a","Description":"Rotate left f (no carry)","Function":"add pic"},"RRCF":{"Hex":"33f*","Mnemonic":"RRCF f,d,a","Description":"Rotate right f through Carry","Function":"add pic"},"RRNCF":{"Hex":"43f*","Mnemonic":"RRNCF f,d,a","Description":"Rotate right f (no carry)","Function":"add pic"},"SETF":{"Hex":"69f*","Mnemonic":"SETF f,a","Description":"Set f","Function":"0xFF → f"},"SUBFWB":{"Hex":"57f*","Mnemonic":"SUBFWB f,d,a","Description":"Subtract f from WREG with Borrow","Function":"WREG - f - C → dest"},"SUBWF":{"Hex":"5Ff*","Mnemonic":"SUBWF f,d,a","Description":"Subtract WREG from f","Function":"f - WREG → dest"},"SUBWFB":{"Hex":"5Bf*","Mnemonic":"SUBWFB f,d,a","Description":"Subtract WREG from f with Borrow","Function":"f - WREG - C → dest"},"WAPF":{"Hex":"3Bf*","Mnemonic":"WAPF f,d,a","Description":"Swap nibbles of f","Function":"f<3:0> → dest<7:4>, f<7:4> → dest<3:0>"},"TSTFSZ":{"Hex":"67f*","Mnemonic":"TSTFSZ f,a","Description":"Test f, skip if 0","Function":"PC+4 → PC, if f=0, else PC+2 → PC"},"XORWF":{"Hex":"1Bf*","Mnemonic":"XORWF f,d,a","Description":"Exclusive OR WREG with f","Function":"WREG XOR f → dest"}}}
