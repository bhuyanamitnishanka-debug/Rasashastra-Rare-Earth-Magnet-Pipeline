; =========================================================================
; NEPAL-BHARAT RASASHASTRA-AI: MACHINING ROUTINE
# Component: Inner Core Crucible Part (Musha Core)
# Standard: ISO Metric G-Code | Aligned via Manasara Units
; =========================================================================

G21 ; Set system units to millimeters
G90 ; Set machine positioning to Absolute Mode
M03 S12000 ; Spin up milling spindle to 12,000 RPM (Optimal Sintering Cut)

; --- STEP 1: RAPID POSITIONING & APPROACH ---
G00 X45.000 Y45.000 Z5.000 ; Rapid travel directly over the grid center node
M07 ; Engage mist coolant for carbon/ceramic dust suppression

; --- STEP 2: PLUNGE & INITIAL PLUNGE HOLE CUT ---
G01 Z-2.500 F300 ; Linear feed entry plunge into raw stock top surface
G01 X45.000 Y45.000 Z-5.000 F150 ; Feed plunge to initial structural floor depth

; --- STEP 3: INNER CHAMBER CIRCULAR INTERPOLATION ---
G02 X45.000 Y45.000 I10.000 J0.000 F600 ; Counter-clockwise circular excavation cut (Radius: 10mm)
G01 Z-10.000 F150 ; Plunge deeper to mid-section crucible cavity chamber
G02 X45.000 Y45.000 I15.000 J0.000 F800 ; Wider clean-up circular wall pass (Radius: 15mm)

; --- STEP 4: FLOOR FINISHING & BASE RAMPING ---
G01 Z-15.000 F120 ; Reach final internal chamber floor coordinate limit
G03 X45.000 Y45.000 I15.000 J0.000 F400 ; Mirror finishing pass to ensure flat floor geometry

; --- STEP 5: SAFE RETRACTION & SHUTDOWN ---
G00 Z25.000 M05 ; Rapid retract tool along Z-axis and power down spindle safely
M09 ; Shut off coolant system feed lines
M30 ; End of program execution path matrix
; =========================================================================
