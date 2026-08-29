export type SchematicCategory = 
  | 'sources' 
  | 'passives' 
  | 'semiconductors' 
  | 'switches' 
  | 'ics_modules' 
  | 'meters' 
  | 'annotations';

export interface SchematicPort {
  id: string;
  name: string;
  type: 'in' | 'out' | 'bidir' | 'power' | 'ground';
  position: 'top' | 'bottom' | 'left' | 'right';
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  color?: string;
}

export interface SchematicSymbolDef {
  id: string;
  name: string;
  category: SchematicCategory;
  prefix: string; // e.g. R, C, D, Q, U, BT, SW
  defaultValue?: string;
  defaultUnit?: string;
  unitOptions?: string[];
  dimensions: { width: number; height: number };
  description: string;
  ports: SchematicPort[];
  svgType: 
    | 'gnd' 
    | 'vcc_5v' 
    | 'vcc_3v3' 
    | 'battery_dc' 
    | 'resistor' 
    | 'potentiometer' 
    | 'capacitor' 
    | 'capacitor_polar' 
    | 'inductor' 
    | 'diode' 
    | 'led' 
    | 'transistor_npn' 
    | 'mosfet_n' 
    | 'switch_spst' 
    | 'push_button' 
    | 'relay_spdt' 
    | 'buzzer' 
    | 'ic_555' 
    | 'regulator_7805' 
    | 'arduino_uno' 
    | 'arduino_nano' 
    | 'esp32_devkit' 
    | 'sensor_ultrasonic' 
    | 'motor_driver_l298n' 
    | 'servo_motor' 
    | 'dc_motor' 
    | 'oled_display' 
    | 'voltmeter' 
    | 'ammeter' 
    | 'text_note';
}

export const SCHEMATIC_SYMBOLS: SchematicSymbolDef[] = [
  // ================= 1. SOURCES =================
  {
    id: 'gnd',
    name: 'Ground (GND)',
    category: 'sources',
    prefix: 'GND',
    dimensions: { width: 50, height: 50 },
    description: '0V Circuit Reference Ground',
    svgType: 'gnd',
    ports: [
      { id: 'GND', name: 'GND', type: 'ground', position: 'top', xPercent: 50, yPercent: 0, color: '#1F2937' },
    ]
  },
  {
    id: 'vcc_5v',
    name: '+5V Power Rail',
    category: 'sources',
    prefix: 'VCC',
    defaultValue: '5V',
    dimensions: { width: 50, height: 50 },
    description: 'Positive 5 Volt DC Power Rail',
    svgType: 'vcc_5v',
    ports: [
      { id: 'VCC', name: '+5V', type: 'power', position: 'bottom', xPercent: 50, yPercent: 100, color: '#EF4444' },
    ]
  },
  {
    id: 'vcc_3v3',
    name: '+3.3V Power Rail',
    category: 'sources',
    prefix: 'VCC',
    defaultValue: '3.3V',
    dimensions: { width: 50, height: 50 },
    description: 'Positive 3.3 Volt Logic Power Rail',
    svgType: 'vcc_3v3',
    ports: [
      { id: '3V3', name: '+3.3V', type: 'power', position: 'bottom', xPercent: 50, yPercent: 100, color: '#F97316' },
    ]
  },
  {
    id: 'battery_dc',
    name: 'DC Battery Cell',
    category: 'sources',
    prefix: 'BT',
    defaultValue: '9V',
    dimensions: { width: 70, height: 80 },
    description: 'DC Power Battery Supply',
    svgType: 'battery_dc',
    ports: [
      { id: 'POS', name: '+', type: 'power', position: 'top', xPercent: 50, yPercent: 0, color: '#EF4444' },
      { id: 'NEG', name: '-', type: 'ground', position: 'bottom', xPercent: 50, yPercent: 100, color: '#1F2937' },
    ]
  },

  // ================= 2. PASSIVES =================
  {
    id: 'resistor',
    name: 'Resistor',
    category: 'passives',
    prefix: 'R',
    defaultValue: '220',
    defaultUnit: 'Ω',
    unitOptions: ['Ω', 'kΩ', 'MΩ'],
    dimensions: { width: 90, height: 50 },
    description: 'Standard Fixed Resistor',
    svgType: 'resistor',
    ports: [
      { id: 'p1', name: '1', type: 'bidir', position: 'left', xPercent: 0, yPercent: 50 },
      { id: 'p2', name: '2', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50 },
    ]
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    category: 'passives',
    prefix: 'POT',
    defaultValue: '10',
    defaultUnit: 'kΩ',
    unitOptions: ['Ω', 'kΩ', 'MΩ'],
    dimensions: { width: 90, height: 75 },
    description: '3-Terminal Variable Resistor Trimmer',
    svgType: 'potentiometer',
    ports: [
      { id: 'p1', name: '1 (A)', type: 'bidir', position: 'left', xPercent: 0, yPercent: 50 },
      { id: 'p2', name: '2 (B)', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50 },
      { id: 'wiper', name: 'Wiper', type: 'bidir', position: 'top', xPercent: 50, yPercent: 0, color: '#3B82F6' },
    ]
  },
  {
    id: 'capacitor',
    name: 'Capacitor (Ceramic)',
    category: 'passives',
    prefix: 'C',
    defaultValue: '100',
    defaultUnit: 'nF',
    unitOptions: ['pF', 'nF', 'μF'],
    dimensions: { width: 80, height: 50 },
    description: 'Non-polarized Ceramic Decoupling Capacitor',
    svgType: 'capacitor',
    ports: [
      { id: 'p1', name: '1', type: 'bidir', position: 'left', xPercent: 0, yPercent: 50 },
      { id: 'p2', name: '2', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50 },
    ]
  },
  {
    id: 'capacitor_polar',
    name: 'Electrolytic Capacitor',
    category: 'passives',
    prefix: 'C',
    defaultValue: '100',
    defaultUnit: 'μF',
    unitOptions: ['μF', 'mF'],
    dimensions: { width: 80, height: 55 },
    description: 'Polarized Electrolytic Filter Capacitor',
    svgType: 'capacitor_polar',
    ports: [
      { id: 'POS', name: '+', type: 'power', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'NEG', name: '-', type: 'ground', position: 'right', xPercent: 100, yPercent: 50, color: '#1F2937' },
    ]
  },

  // ================= 3. SEMICONDUCTORS =================
  {
    id: 'diode',
    name: 'Diode (1N4007)',
    category: 'semiconductors',
    prefix: 'D',
    defaultValue: '1N4007',
    dimensions: { width: 80, height: 50 },
    description: 'Standard Rectifier Diode',
    svgType: 'diode',
    ports: [
      { id: 'A', name: 'Anode (+)', type: 'in', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'K', name: 'Cathode (-)', type: 'out', position: 'right', xPercent: 100, yPercent: 50, color: '#1F2937' },
    ]
  },
  {
    id: 'led',
    name: 'Light Emitting Diode (LED)',
    category: 'semiconductors',
    prefix: 'LED',
    defaultValue: 'Red',
    dimensions: { width: 85, height: 65 },
    description: 'Light Emitting Diode with Indicator Glow',
    svgType: 'led',
    ports: [
      { id: 'A', name: 'Anode (+)', type: 'in', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'K', name: 'Cathode (-)', type: 'out', position: 'right', xPercent: 100, yPercent: 50, color: '#1F2937' },
    ]
  },
  {
    id: 'transistor_npn',
    name: 'NPN BJT Transistor (2N2222)',
    category: 'semiconductors',
    prefix: 'Q',
    defaultValue: '2N2222',
    dimensions: { width: 80, height: 80 },
    description: 'NPN Bipolar Junction Transistor',
    svgType: 'transistor_npn',
    ports: [
      { id: 'B', name: 'Base (B)', type: 'in', position: 'left', xPercent: 0, yPercent: 50, color: '#EAB308' },
      { id: 'C', name: 'Collector (C)', type: 'power', position: 'top', xPercent: 75, yPercent: 0, color: '#EF4444' },
      { id: 'E', name: 'Emitter (E)', type: 'ground', position: 'bottom', xPercent: 75, yPercent: 100, color: '#1F2937' },
    ]
  },
  {
    id: 'mosfet_n',
    name: 'N-Channel MOSFET (IRFZ44N)',
    category: 'semiconductors',
    prefix: 'M',
    defaultValue: 'IRFZ44N',
    dimensions: { width: 80, height: 80 },
    description: 'N-Channel Power MOSFET Switch',
    svgType: 'mosfet_n',
    ports: [
      { id: 'G', name: 'Gate (G)', type: 'in', position: 'left', xPercent: 0, yPercent: 65, color: '#EAB308' },
      { id: 'D', name: 'Drain (D)', type: 'power', position: 'top', xPercent: 75, yPercent: 0, color: '#EF4444' },
      { id: 'S', name: 'Source (S)', type: 'ground', position: 'bottom', xPercent: 75, yPercent: 100, color: '#1F2937' },
    ]
  },

  // ================= 4. SWITCHES & RELAYS =================
  {
    id: 'push_button',
    name: 'Push Button (Tactile Switch)',
    category: 'switches',
    prefix: 'SW',
    dimensions: { width: 75, height: 50 },
    description: 'Normally Open (NO) Momentary Tactile Switch',
    svgType: 'push_button',
    ports: [
      { id: 'p1', name: '1', type: 'bidir', position: 'left', xPercent: 0, yPercent: 50 },
      { id: 'p2', name: '2', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50 },
    ]
  },
  {
    id: 'switch_spst',
    name: 'SPST Toggle Switch',
    category: 'switches',
    prefix: 'SW',
    dimensions: { width: 80, height: 50 },
    description: 'Single-Pole Single-Throw Power Switch',
    svgType: 'switch_spst',
    ports: [
      { id: 'p1', name: '1', type: 'bidir', position: 'left', xPercent: 0, yPercent: 50 },
      { id: 'p2', name: '2', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50 },
    ]
  },
  {
    id: 'relay_spdt',
    name: '5V SPDT Relay Module',
    category: 'switches',
    prefix: 'RLY',
    defaultValue: '5V',
    dimensions: { width: 110, height: 90 },
    description: 'Electromechanical Relay with Coil & Switch contacts',
    svgType: 'relay_spdt',
    ports: [
      { id: 'COIL_POS', name: 'Coil +', type: 'power', position: 'left', xPercent: 0, yPercent: 30, color: '#EF4444' },
      { id: 'COIL_NEG', name: 'Coil -', type: 'ground', position: 'left', xPercent: 0, yPercent: 70, color: '#1F2937' },
      { id: 'COM', name: 'COM', type: 'bidir', position: 'right', xPercent: 100, yPercent: 50, color: '#3B82F6' },
      { id: 'NO', name: 'NO', type: 'bidir', position: 'right', xPercent: 100, yPercent: 20, color: '#10B981' },
      { id: 'NC', name: 'NC', type: 'bidir', position: 'right', xPercent: 100, yPercent: 80, color: '#DC2626' },
    ]
  },
  {
    id: 'buzzer_active',
    name: '5V Active Buzzer / Speaker',
    category: 'switches',
    prefix: 'BZ',
    defaultValue: '5V',
    dimensions: { width: 75, height: 65 },
    description: 'Piezoelectric Audio Alarm Buzzer',
    svgType: 'buzzer',
    ports: [
      { id: 'POS', name: '+', type: 'power', position: 'left', xPercent: 0, yPercent: 35, color: '#EF4444' },
      { id: 'NEG', name: '-', type: 'ground', position: 'left', xPercent: 0, yPercent: 65, color: '#1F2937' },
    ]
  },

  // ================= 5. ICS & ROBOTICS MODULES =================
  {
    id: 'ic_555_timer',
    name: 'NE555 Precision Timer IC',
    category: 'ics_modules',
    prefix: 'U',
    defaultValue: 'NE555',
    dimensions: { width: 130, height: 110 },
    description: 'Classic 8-Pin DIP Timer / Oscillator IC',
    svgType: 'ic_555',
    ports: [
      { id: 'GND', name: '1:GND', type: 'ground', position: 'left', xPercent: 0, yPercent: 20, color: '#1F2937' },
      { id: 'TRIG', name: '2:TRIG', type: 'in', position: 'left', xPercent: 0, yPercent: 40, color: '#EAB308' },
      { id: 'OUT', name: '3:OUT', type: 'out', position: 'left', xPercent: 0, yPercent: 60, color: '#3B82F6' },
      { id: 'RESET', name: '4:RESET', type: 'in', position: 'left', xPercent: 0, yPercent: 80, color: '#10B981' },
      { id: 'VCC', name: '8:VCC', type: 'power', position: 'right', xPercent: 100, yPercent: 20, color: '#EF4444' },
      { id: 'DISCH', name: '7:DISCH', type: 'out', position: 'right', xPercent: 100, yPercent: 40, color: '#F97316' },
      { id: 'THRES', name: '6:THRES', type: 'in', position: 'right', xPercent: 100, yPercent: 60, color: '#EAB308' },
      { id: 'CTRL', name: '5:CTRL', type: 'in', position: 'right', xPercent: 100, yPercent: 80, color: '#8B5CF6' },
    ]
  },
  {
    id: 'arduino_uno',
    name: 'Arduino Uno R3 Microcontroller',
    category: 'ics_modules',
    prefix: 'MCU',
    defaultValue: 'ATmega328P',
    dimensions: { width: 180, height: 210 },
    description: 'ATmega328P based microcontroller board',
    svgType: 'arduino_uno',
    ports: [
      { id: '5V', name: '5V', type: 'power', position: 'left', xPercent: 0, yPercent: 15, color: '#EF4444' },
      { id: '3V3', name: '3V3', type: 'power', position: 'left', xPercent: 0, yPercent: 25, color: '#F97316' },
      { id: 'GND', name: 'GND', type: 'ground', position: 'left', xPercent: 0, yPercent: 35, color: '#1F2937' },
      { id: 'VIN', name: 'VIN', type: 'power', position: 'left', xPercent: 0, yPercent: 45, color: '#DC2626' },
      { id: 'A0', name: 'A0', type: 'in', position: 'left', xPercent: 0, yPercent: 60, color: '#3B82F6' },
      { id: 'A1', name: 'A1', type: 'in', position: 'left', xPercent: 0, yPercent: 70, color: '#3B82F6' },
      { id: 'A4', name: 'A4(SDA)', type: 'bidir', position: 'left', xPercent: 0, yPercent: 80, color: '#10B981' },
      { id: 'A5', name: 'A5(SCL)', type: 'bidir', position: 'left', xPercent: 0, yPercent: 90, color: '#10B981' },

      { id: 'D2', name: 'D2', type: 'bidir', position: 'right', xPercent: 100, yPercent: 15, color: '#EAB308' },
      { id: 'D3', name: 'D3~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 25, color: '#F59E0B' },
      { id: 'D4', name: 'D4', type: 'bidir', position: 'right', xPercent: 100, yPercent: 35, color: '#EAB308' },
      { id: 'D5', name: 'D5~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 45, color: '#F59E0B' },
      { id: 'D6', name: 'D6~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 55, color: '#F59E0B' },
      { id: 'D9', name: 'D9~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 65, color: '#F59E0B' },
      { id: 'D10', name: 'D10~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 75, color: '#F59E0B' },
      { id: 'D11', name: 'D11~PWM', type: 'out', position: 'right', xPercent: 100, yPercent: 85, color: '#F59E0B' },
      { id: 'D12', name: 'D12', type: 'bidir', position: 'right', xPercent: 100, yPercent: 95, color: '#EAB308' },
    ]
  },
  {
    id: 'sensor_ultrasonic',
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'ics_modules',
    prefix: 'SONAR',
    dimensions: { width: 140, height: 90 },
    description: 'Ultrasonic Sonar Distance Measurement Module',
    svgType: 'sensor_ultrasonic',
    ports: [
      { id: 'VCC', name: 'VCC', type: 'power', position: 'bottom', xPercent: 20, yPercent: 100, color: '#EF4444' },
      { id: 'TRIG', name: 'TRIG', type: 'in', position: 'bottom', xPercent: 40, yPercent: 100, color: '#EAB308' },
      { id: 'ECHO', name: 'ECHO', type: 'out', position: 'bottom', xPercent: 60, yPercent: 100, color: '#3B82F6' },
      { id: 'GND', name: 'GND', type: 'ground', position: 'bottom', xPercent: 80, yPercent: 100, color: '#1F2937' },
    ]
  },
  {
    id: 'motor_driver_l298n',
    name: 'L298N Dual H-Bridge Motor Driver',
    category: 'ics_modules',
    prefix: 'DRV',
    dimensions: { width: 170, height: 140 },
    description: 'Dual DC Motor / Stepper Driver Module',
    svgType: 'motor_driver_l298n',
    ports: [
      { id: '12V', name: '12V', type: 'power', position: 'left', xPercent: 0, yPercent: 25, color: '#DC2626' },
      { id: 'GND', name: 'GND', type: 'ground', position: 'left', xPercent: 0, yPercent: 50, color: '#1F2937' },
      { id: '5V_OUT', name: '5V Reg', type: 'power', position: 'left', xPercent: 0, yPercent: 75, color: '#EF4444' },

      { id: 'IN1', name: 'IN1', type: 'in', position: 'bottom', xPercent: 20, yPercent: 100, color: '#EAB308' },
      { id: 'IN2', name: 'IN2', type: 'in', position: 'bottom', xPercent: 40, yPercent: 100, color: '#EAB308' },
      { id: 'IN3', name: 'IN3', type: 'in', position: 'bottom', xPercent: 60, yPercent: 100, color: '#EAB308' },
      { id: 'IN4', name: 'IN4', type: 'in', position: 'bottom', xPercent: 80, yPercent: 100, color: '#EAB308' },

      { id: 'OUT1', name: 'OUT1(M1+)', type: 'out', position: 'right', xPercent: 100, yPercent: 25, color: '#3B82F6' },
      { id: 'OUT2', name: 'OUT2(M1-)', type: 'out', position: 'right', xPercent: 100, yPercent: 45, color: '#3B82F6' },
      { id: 'OUT3', name: 'OUT3(M2+)', type: 'out', position: 'right', xPercent: 100, yPercent: 65, color: '#10B981' },
      { id: 'OUT4', name: 'OUT4(M2-)', type: 'out', position: 'right', xPercent: 100, yPercent: 85, color: '#10B981' },
    ]
  },
  {
    id: 'servo_motor',
    name: 'SG90 / MG996R Servo Motor',
    category: 'ics_modules',
    prefix: 'SRV',
    dimensions: { width: 110, height: 75 },
    description: 'PWM Controlled Angular Positioning Servo',
    svgType: 'servo_motor',
    ports: [
      { id: 'GND', name: 'GND (Brown)', type: 'ground', position: 'left', xPercent: 0, yPercent: 25, color: '#1F2937' },
      { id: 'VCC', name: 'VCC (Red)', type: 'power', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'PWM', name: 'PWM (Orange)', type: 'in', position: 'left', xPercent: 0, yPercent: 75, color: '#F97316' },
    ]
  },
  {
    id: 'dc_motor',
    name: 'DC Gear Motor',
    category: 'ics_modules',
    prefix: 'M',
    dimensions: { width: 85, height: 70 },
    description: '2-Terminal DC Motor',
    svgType: 'dc_motor',
    ports: [
      { id: 'POS', name: 'M+', type: 'in', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'NEG', name: 'M-', type: 'in', position: 'right', xPercent: 100, yPercent: 50, color: '#1F2937' },
    ]
  },

  // ================= 6. MEASUREMENT METERS =================
  {
    id: 'voltmeter',
    name: 'Voltmeter Probe',
    category: 'meters',
    prefix: 'V',
    dimensions: { width: 70, height: 70 },
    description: 'Voltage Difference Meter (V)',
    svgType: 'voltmeter',
    ports: [
      { id: 'POS', name: '+', type: 'in', position: 'top', xPercent: 50, yPercent: 0, color: '#EF4444' },
      { id: 'NEG', name: '-', type: 'in', position: 'bottom', xPercent: 50, yPercent: 100, color: '#1F2937' },
    ]
  },
  {
    id: 'ammeter',
    name: 'Ammeter (Current Meter)',
    category: 'meters',
    prefix: 'A',
    dimensions: { width: 70, height: 70 },
    description: 'Series Current Flow Meter (A)',
    svgType: 'ammeter',
    ports: [
      { id: 'IN', name: 'IN', type: 'in', position: 'left', xPercent: 0, yPercent: 50, color: '#EF4444' },
      { id: 'OUT', name: 'OUT', type: 'out', position: 'right', xPercent: 100, yPercent: 50, color: '#1F2937' },
    ]
  }
];
