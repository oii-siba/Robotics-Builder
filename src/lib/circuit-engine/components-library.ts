import { CircuitComponentDef } from './types';

export const CIRCUIT_COMPONENTS_LIBRARY: CircuitComponentDef[] = [
  // =========================================================================
  // 1. 🧠 CONTROLLERS & DEVELOPMENT BOARDS
  // =========================================================================
  {
    id: 'esp32_devkit',
    name: 'ESP32 DevKit V1',
    category: 'controllers',
    subcategory: 'ESP32',
    prefix: 'ESP32',
    width: 140,
    height: 240,
    bodyColor: '#1E293B',
    accentColor: '#38BDF8',
    description: '30-Pin Dual-Core 240MHz Wi-Fi & BLE Microcontroller',
    voltage: '3.3V / 5V VIN',
    current: '80-240mA',
    interfaces: ['GPIO', 'ADC', 'PWM', 'I2C', 'SPI', 'UART'],
    renderType: 'esp32',
    pins: [
      { id: '3V3', name: '3V3', type: 'power-3v3', x: 0, y: 30, side: 'left', color: '#F97316' },
      { id: 'GND_1', name: 'GND', type: 'ground', x: 0, y: 50, side: 'left', color: '#1F2937' },
      { id: 'D15', name: 'D15', type: 'digital', x: 0, y: 70, side: 'left', color: '#EAB308' },
      { id: 'D2', name: 'D2(LED)', type: 'digital', x: 0, y: 90, side: 'left', color: '#EAB308' },
      { id: 'D4', name: 'D4', type: 'digital', x: 0, y: 110, side: 'left', color: '#EAB308' },
      { id: 'D16', name: 'RX2', type: 'uart', x: 0, y: 130, side: 'left', color: '#8B5CF6' },
      { id: 'D17', name: 'TX2', type: 'uart', x: 0, y: 150, side: 'left', color: '#8B5CF6' },
      { id: 'D5', name: 'D5', type: 'digital', x: 0, y: 170, side: 'left', color: '#EAB308' },
      { id: 'D18', name: 'SCK', type: 'spi', x: 0, y: 190, side: 'left', color: '#10B981' },
      { id: 'D19', name: 'MISO', type: 'spi', x: 0, y: 210, side: 'left', color: '#10B981' },

      { id: 'VIN', name: 'VIN(5V)', type: 'power-5v', x: 140, y: 30, side: 'right', color: '#EF4444' },
      { id: 'GND_2', name: 'GND', type: 'ground', x: 140, y: 50, side: 'right', color: '#1F2937' },
      { id: 'D13', name: 'D13', type: 'digital', x: 140, y: 70, side: 'right', color: '#EAB308' },
      { id: 'D12', name: 'D12', type: 'digital', x: 140, y: 90, side: 'right', color: '#EAB308' },
      { id: 'D14', name: 'D14', type: 'digital', x: 140, y: 110, side: 'right', color: '#EAB308' },
      { id: 'D27', name: 'D27', type: 'digital', x: 140, y: 130, side: 'right', color: '#EAB308' },
      { id: 'D26', name: 'GPIO26', type: 'digital', x: 140, y: 150, side: 'right', color: '#EAB308' },
      { id: 'D25', name: 'GPIO25', type: 'digital', x: 140, y: 170, side: 'right', color: '#EAB308' },
      { id: 'D22', name: 'SCL', type: 'i2c', x: 140, y: 190, side: 'right', color: '#10B981' },
      { id: 'D21', name: 'SDA', type: 'i2c', x: 140, y: 210, side: 'right', color: '#10B981' },
    ]
  },
  {
    id: 'arduino_uno',
    name: 'Arduino Uno R3',
    category: 'controllers',
    subcategory: 'Arduino',
    prefix: 'UNO',
    width: 150,
    height: 220,
    bodyColor: '#005C61',
    accentColor: '#00878F',
    description: 'Standard ATmega328P 16MHz microcontroller board',
    voltage: '5V (7-12V VIN)',
    current: '50mA',
    interfaces: ['GPIO', 'ADC', 'PWM', 'I2C', 'SPI', 'UART'],
    renderType: 'arduino_uno',
    pins: [
      { id: '5V', name: '5V', type: 'power-5v', x: 0, y: 30, side: 'left', color: '#EF4444' },
      { id: '3V3', name: '3V3', type: 'power-3v3', x: 0, y: 50, side: 'left', color: '#F97316' },
      { id: 'GND_1', name: 'GND', type: 'ground', x: 0, y: 70, side: 'left', color: '#1F2937' },
      { id: 'VIN', name: 'VIN', type: 'power-5v', x: 0, y: 90, side: 'left', color: '#DC2626' },
      { id: 'A0', name: 'A0', type: 'analog', x: 0, y: 120, side: 'left', color: '#3B82F6' },
      { id: 'A1', name: 'A1', type: 'analog', x: 0, y: 140, side: 'left', color: '#3B82F6' },
      { id: 'A4', name: 'A4(SDA)', type: 'i2c', x: 0, y: 170, side: 'left', color: '#10B981' },
      { id: 'A5', name: 'A5(SCL)', type: 'i2c', x: 0, y: 190, side: 'left', color: '#10B981' },

      { id: 'D2', name: 'D2', type: 'digital', x: 150, y: 30, side: 'right', color: '#EAB308' },
      { id: 'D3', name: 'D3~', type: 'pwm', x: 150, y: 50, side: 'right', color: '#F59E0B' },
      { id: 'D4', name: 'D4', type: 'digital', x: 150, y: 70, side: 'right', color: '#EAB308' },
      { id: 'D5', name: 'D5~', type: 'pwm', x: 150, y: 90, side: 'right', color: '#F59E0B' },
      { id: 'D6', name: 'D6~', type: 'pwm', x: 150, y: 110, side: 'right', color: '#F59E0B' },
      { id: 'D9', name: 'D9~', type: 'pwm', x: 150, y: 130, side: 'right', color: '#F59E0B' },
      { id: 'D10', name: 'D10~', type: 'pwm', x: 150, y: 150, side: 'right', color: '#F59E0B' },
      { id: 'D11', name: 'D11~', type: 'pwm', x: 150, y: 170, side: 'right', color: '#F59E0B' },
      { id: 'D12', name: 'D12', type: 'digital', x: 150, y: 190, side: 'right', color: '#EAB308' },
      { id: 'D13', name: 'D13', type: 'digital', x: 150, y: 210, side: 'right', color: '#EAB308' },
    ]
  },
  {
    id: 'arduino_nano',
    name: 'Arduino Nano V3',
    category: 'controllers',
    subcategory: 'Arduino',
    prefix: 'NANO',
    width: 120,
    height: 180,
    bodyColor: '#005C61',
    accentColor: '#00878F',
    description: 'Compact Breadboard-friendly ATmega328P board',
    voltage: '5V',
    current: '30mA',
    interfaces: ['GPIO', 'ADC', 'PWM', 'I2C', 'UART'],
    renderType: 'ic_chip',
    pins: [
      { id: 'D2', name: 'D2', type: 'digital', x: 0, y: 30, side: 'left', color: '#EAB308' },
      { id: 'D3', name: 'D3~', type: 'pwm', x: 0, y: 55, side: 'left', color: '#F59E0B' },
      { id: 'D4', name: 'D4', type: 'digital', x: 0, y: 80, side: 'left', color: '#EAB308' },
      { id: 'D5', name: 'D5~', type: 'pwm', x: 0, y: 105, side: 'left', color: '#F59E0B' },
      { id: 'D6', name: 'D6~', type: 'pwm', x: 0, y: 130, side: 'left', color: '#F59E0B' },
      { id: '5V', name: '5V', type: 'power-5v', x: 120, y: 30, side: 'right', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 120, y: 55, side: 'right', color: '#1F2937' },
      { id: 'A4', name: 'A4(SDA)', type: 'i2c', x: 120, y: 80, side: 'right', color: '#10B981' },
      { id: 'A5', name: 'A5(SCL)', type: 'i2c', x: 120, y: 105, side: 'right', color: '#10B981' },
    ]
  },
  {
    id: 'rpi_pico_w',
    name: 'Raspberry Pi Pico W',
    category: 'controllers',
    subcategory: 'Raspberry Pi',
    prefix: 'PICO_W',
    width: 130,
    height: 200,
    bodyColor: '#10B981',
    accentColor: '#059669',
    description: 'RP2040 Dual ARM Cortex-M0+ with Wi-Fi & BLE',
    voltage: '3.3V (VSYS 5V)',
    current: '30-100mA',
    interfaces: ['GPIO', 'ADC', 'PWM', 'I2C', 'SPI', 'UART'],
    renderType: 'ic_chip',
    pins: [
      { id: 'GP0', name: 'GP0(TX)', type: 'uart', x: 0, y: 30, side: 'left', color: '#8B5CF6' },
      { id: 'GP1', name: 'GP1(RX)', type: 'uart', x: 0, y: 55, side: 'left', color: '#8B5CF6' },
      { id: 'GND_1', name: 'GND', type: 'ground', x: 0, y: 80, side: 'left', color: '#1F2937' },
      { id: 'GP4', name: 'GP4(SDA)', type: 'i2c', x: 0, y: 105, side: 'left', color: '#10B981' },
      { id: 'GP5', name: 'GP5(SCL)', type: 'i2c', x: 0, y: 130, side: 'left', color: '#10B981' },
      { id: 'VBUS', name: 'VBUS(5V)', type: 'power-5v', x: 130, y: 30, side: 'right', color: '#EF4444' },
      { id: 'VSYS', name: 'VSYS', type: 'power-5v', x: 130, y: 55, side: 'right', color: '#DC2626' },
      { id: '3V3', name: '3V3_OUT', type: 'power-3v3', x: 130, y: 80, side: 'right', color: '#F97316' },
      { id: 'GND_2', name: 'GND', type: 'ground', x: 130, y: 105, side: 'right', color: '#1F2937' },
    ]
  },
  {
    id: 'stm32_bluepill',
    name: 'STM32F103C8T6 Blue Pill',
    category: 'controllers',
    subcategory: 'STM32',
    prefix: 'STM32',
    width: 120,
    height: 190,
    bodyColor: '#1E40AF',
    accentColor: '#38BDF8',
    description: '32-Bit ARM Cortex-M3 72MHz Microcontroller Board',
    voltage: '3.3V / 5V VIN',
    current: '40mA',
    interfaces: ['GPIO', 'ADC', 'PWM', 'I2C', 'SPI', 'CAN'],
    renderType: 'ic_chip',
    pins: [
      { id: '3V3', name: '3.3V', type: 'power-3v3', x: 0, y: 30, side: 'left', color: '#F97316' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 55, side: 'left', color: '#1F2937' },
      { id: 'PA0', name: 'PA0', type: 'analog', x: 0, y: 80, side: 'left', color: '#3B82F6' },
      { id: 'PA1', name: 'PA1', type: 'analog', x: 0, y: 105, side: 'left', color: '#3B82F6' },
      { id: '5V', name: '5V', type: 'power-5v', x: 120, y: 30, side: 'right', color: '#EF4444' },
      { id: 'PB6', name: 'PB6(SCL)', type: 'i2c', x: 120, y: 55, side: 'right', color: '#10B981' },
      { id: 'PB7', name: 'PB7(SDA)', type: 'i2c', x: 120, y: 80, side: 'right', color: '#10B981' },
    ]
  },

  // =========================================================================
  // 2. ⚙️ MOTORS & ACTUATORS
  // =========================================================================
  {
    id: 'dc_gear_motor',
    name: 'TT DC Gear Motor (Dual Shaft)',
    category: 'motors',
    subcategory: 'DC Motors',
    prefix: 'MOT',
    width: 90,
    height: 70,
    bodyColor: '#EAB308',
    accentColor: '#CA8A04',
    description: '3V-6V High-Torque Robotic Wheel Drive Motor',
    voltage: '3V - 6V DC',
    current: '250mA (1.5A stall)',
    renderType: 'motor_dc',
    pins: [
      { id: 'M_POS', name: 'M+ (Red)', type: 'motor-out', x: 0, y: 25, side: 'left', color: '#EF4444' },
      { id: 'M_NEG', name: 'M- (Black)', type: 'motor-out', x: 0, y: 45, side: 'left', color: '#1F2937' },
    ]
  },
  {
    id: 'n20_micro_motor',
    name: 'N20 Micro Metal Gear Motor',
    category: 'motors',
    subcategory: 'DC Motors',
    prefix: 'N20',
    width: 80,
    height: 60,
    bodyColor: '#64748B',
    accentColor: '#F59E0B',
    description: '6V 300RPM Miniature Precision Metal Gear Motor',
    voltage: '6V DC',
    current: '100mA',
    renderType: 'motor_dc',
    pins: [
      { id: 'POS', name: 'M+', type: 'motor-out', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'NEG', name: 'M-', type: 'motor-out', x: 0, y: 40, side: 'left', color: '#1F2937' },
    ]
  },
  {
    id: 'servo_sg90',
    name: 'SG90 9g Micro Servo',
    category: 'motors',
    subcategory: 'Servos',
    prefix: 'SRV',
    width: 100,
    height: 75,
    bodyColor: '#1E40AF',
    accentColor: '#3B82F6',
    description: '180-Degree PWM Controlled 1.8kg-cm Micro Servo',
    voltage: '4.8V - 6V DC',
    current: '10mA idle (650mA stall)',
    renderType: 'servo_sg90',
    pins: [
      { id: 'GND', name: 'GND (Brown)', type: 'ground', x: 0, y: 20, side: 'left', color: '#78350F' },
      { id: 'VCC', name: 'VCC (Red)', type: 'power-5v', x: 0, y: 40, side: 'left', color: '#EF4444' },
      { id: 'PWM', name: 'PWM (Orange)', type: 'pwm', x: 0, y: 60, side: 'left', color: '#F97316' },
    ]
  },
  {
    id: 'servo_mg996r',
    name: 'MG996R Metal Gear High-Torque Servo',
    category: 'motors',
    subcategory: 'Servos',
    prefix: 'SRV_MG',
    width: 110,
    height: 85,
    bodyColor: '#1F2937',
    accentColor: '#F59E0B',
    description: '11kg-cm High Torque Metal Gear Servo for Robotic Arms',
    voltage: '4.8V - 7.2V DC',
    current: '100mA idle (2.5A stall)',
    renderType: 'servo_sg90',
    pins: [
      { id: 'GND', name: 'GND (Brown)', type: 'ground', x: 0, y: 25, side: 'left', color: '#1F2937' },
      { id: 'VCC', name: 'VCC (Red)', type: 'power-5v', x: 0, y: 50, side: 'left', color: '#EF4444' },
      { id: 'PWM', name: 'PWM (Orange)', type: 'pwm', x: 0, y: 75, side: 'left', color: '#F97316' },
    ]
  },
  {
    id: 'stepper_nema17',
    name: 'NEMA 17 Stepper Motor',
    category: 'motors',
    subcategory: 'Steppers',
    prefix: 'NEMA17',
    width: 110,
    height: 95,
    bodyColor: '#334155',
    accentColor: '#94A3B8',
    description: 'Bipolar 4-Wire 1.8° 42N-cm Precision Stepper Motor',
    voltage: '12V DC',
    current: '1.5A per phase',
    renderType: 'ic_chip',
    pins: [
      { id: 'A1', name: 'Coil A+', type: 'motor-out', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'A2', name: 'Coil A-', type: 'motor-out', x: 0, y: 40, side: 'left', color: '#3B82F6' },
      { id: 'B1', name: 'Coil B+', type: 'motor-out', x: 0, y: 60, side: 'left', color: '#10B981' },
      { id: 'B2', name: 'Coil B-', type: 'motor-out', x: 0, y: 80, side: 'left', color: '#1F2937' },
    ]
  },
  {
    id: 'solenoid_12v',
    name: '12V Electromagnetic Push-Pull Solenoid',
    category: 'motors',
    subcategory: 'Linear Actuators',
    prefix: 'SOL',
    width: 90,
    height: 65,
    bodyColor: '#1E293B',
    accentColor: '#F59E0B',
    description: '12V Linear Electromagnetic Plunger Actuator',
    voltage: '12V DC',
    current: '800mA',
    renderType: 'ic_chip',
    pins: [
      { id: 'POS', name: 'V+ (12V)', type: 'power-12v', x: 0, y: 22, side: 'left', color: '#DC2626' },
      { id: 'NEG', name: 'GND (-)', type: 'ground', x: 0, y: 44, side: 'left', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 3. 🔌 MOTOR DRIVERS & CONTROLLERS
  // =========================================================================
  {
    id: 'l298n_driver',
    name: 'L298N Dual H-Bridge Motor Driver',
    category: 'drivers',
    subcategory: 'H-Bridge Drivers',
    prefix: 'L298N',
    width: 160,
    height: 160,
    bodyColor: '#991B1B',
    accentColor: '#EF4444',
    description: 'Dual H-Bridge Driver Module (2A Peak per Channel)',
    voltage: '5V - 35V DC',
    current: '2A continuous',
    renderType: 'driver_l298n',
    pins: [
      { id: 'VCC_12V', name: '12V Power', type: 'power-12v', x: 0, y: 35, side: 'left', color: '#DC2626' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 75, side: 'left', color: '#1F2937' },
      { id: 'VCC_5V', name: '5V Reg Out', type: 'power-5v', x: 0, y: 115, side: 'left', color: '#EF4444' },

      { id: 'ENA', name: 'ENA', type: 'pwm', x: 25, y: 160, side: 'bottom', color: '#F59E0B' },
      { id: 'IN1', name: 'IN1', type: 'digital', x: 55, y: 160, side: 'bottom', color: '#EAB308' },
      { id: 'IN2', name: 'IN2', type: 'digital', x: 80, y: 160, side: 'bottom', color: '#EAB308' },
      { id: 'IN3', name: 'IN3', type: 'digital', x: 105, y: 160, side: 'bottom', color: '#EAB308' },
      { id: 'IN4', name: 'IN4', type: 'digital', x: 130, y: 160, side: 'bottom', color: '#EAB308' },

      { id: 'OUT1', name: 'OUT1(M1+)', type: 'motor-out', x: 160, y: 35, side: 'right', color: '#3B82F6' },
      { id: 'OUT2', name: 'OUT2(M1-)', type: 'motor-out', x: 160, y: 65, side: 'right', color: '#3B82F6' },
      { id: 'OUT3', name: 'OUT3(M2+)', type: 'motor-out', x: 160, y: 105, side: 'right', color: '#10B981' },
      { id: 'OUT4', name: 'OUT4(M2-)', type: 'motor-out', x: 160, y: 135, side: 'right', color: '#10B981' },
    ]
  },
  {
    id: 'pca9685_driver',
    name: 'PCA9685 16-Channel 12-bit PWM Driver',
    category: 'drivers',
    subcategory: 'Servo Drivers',
    prefix: 'PCA9685',
    width: 150,
    height: 120,
    bodyColor: '#1E293B',
    accentColor: '#38BDF8',
    description: 'I2C Bus 16-Channel PWM Servo Controller',
    voltage: '5V - 6V DC',
    interfaces: ['I2C', 'PWM'],
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 30, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 55, side: 'left', color: '#1F2937' },
      { id: 'SDA', name: 'SDA', type: 'i2c', x: 0, y: 80, side: 'left', color: '#10B981' },
      { id: 'SCL', name: 'SCL', type: 'i2c', x: 0, y: 105, side: 'left', color: '#10B981' },

      { id: 'PWM0', name: 'PWM 0', type: 'pwm', x: 150, y: 30, side: 'right', color: '#F97316' },
      { id: 'PWM1', name: 'PWM 1', type: 'pwm', x: 150, y: 55, side: 'right', color: '#F97316' },
      { id: 'PWM2', name: 'PWM 2', type: 'pwm', x: 150, y: 80, side: 'right', color: '#F97316' },
      { id: 'PWM3', name: 'PWM 3', type: 'pwm', x: 150, y: 105, side: 'right', color: '#F97316' },
    ]
  },
  {
    id: 'a4988_driver',
    name: 'A4988 Stepper Motor Driver Carrier',
    category: 'drivers',
    subcategory: 'Stepper Drivers',
    prefix: 'A4988',
    width: 120,
    height: 110,
    bodyColor: '#991B1B',
    accentColor: '#EF4444',
    description: 'Microstepping Driver with Translator (2A Peak)',
    voltage: '8V - 35V Motor Power',
    renderType: 'ic_chip',
    pins: [
      { id: 'VDD', name: 'VDD (5V)', type: 'power-5v', x: 0, y: 25, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 50, side: 'left', color: '#1F2937' },
      { id: 'STEP', name: 'STEP', type: 'digital', x: 0, y: 75, side: 'left', color: '#EAB308' },
      { id: 'DIR', name: 'DIR', type: 'digital', x: 0, y: 95, side: 'left', color: '#EAB308' },

      { id: 'VMOT', name: 'VMOT(12V)', type: 'power-12v', x: 120, y: 25, side: 'right', color: '#DC2626' },
      { id: '1A', name: '1A', type: 'motor-out', x: 120, y: 50, side: 'right', color: '#3B82F6' },
      { id: '1B', name: '1B', type: 'motor-out', x: 120, y: 75, side: 'right', color: '#3B82F6' },
      { id: '2A', name: '2A', type: 'motor-out', x: 120, y: 95, side: 'right', color: '#10B981' },
    ]
  },
  {
    id: 'relay_module_5v',
    name: '5V SPDT Relay Module (Optoisolated)',
    category: 'drivers',
    subcategory: 'Relays',
    prefix: 'RLY',
    width: 110,
    height: 90,
    bodyColor: '#1D4ED8',
    accentColor: '#38BDF8',
    description: '10A 250VAC High Voltage Relay Module with Status LED',
    voltage: '5V DC',
    current: '70mA trigger',
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 25, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 50, side: 'left', color: '#1F2937' },
      { id: 'IN', name: 'IN', type: 'digital', x: 0, y: 75, side: 'left', color: '#EAB308' },

      { id: 'NO', name: 'NO', type: 'motor-out', x: 110, y: 25, side: 'right', color: '#10B981' },
      { id: 'COM', name: 'COM', type: 'motor-out', x: 110, y: 50, side: 'right', color: '#3B82F6' },
      { id: 'NC', name: 'NC', type: 'motor-out', x: 110, y: 75, side: 'right', color: '#EF4444' },
    ]
  },

  // =========================================================================
  // 4. 👁️ SENSORS
  // =========================================================================
  {
    id: 'sensor_ultrasonic',
    name: 'HC-SR04 Ultrasonic Sonar Sensor',
    category: 'sensors',
    subcategory: 'Distance',
    prefix: 'SONAR',
    width: 130,
    height: 85,
    bodyColor: '#0284C7',
    accentColor: '#38BDF8',
    description: '2cm - 400cm Non-Contact Distance Measuring Module',
    voltage: '5V DC',
    current: '15mA',
    renderType: 'ultrasonic',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 20, y: 85, side: 'bottom', color: '#EF4444' },
      { id: 'TRIG', name: 'TRIG', type: 'digital', x: 50, y: 85, side: 'bottom', color: '#EAB308' },
      { id: 'ECHO', name: 'ECHO', type: 'digital', x: 80, y: 85, side: 'bottom', color: '#3B82F6' },
      { id: 'GND', name: 'GND', type: 'ground', x: 110, y: 85, side: 'bottom', color: '#1F2937' },
    ]
  },
  {
    id: 'sensor_ir_tcrt5000',
    name: 'TCRT5000 IR Line Tracker Module',
    category: 'sensors',
    subcategory: 'Infrared',
    prefix: 'IR',
    width: 90,
    height: 70,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Infrared Reflective Optical Line Sensor with Comparator',
    voltage: '3.3V - 5V DC',
    renderType: 'ir_sensor',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 18, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 35, side: 'left', color: '#1F2937' },
      { id: 'DO', name: 'DO', type: 'digital', x: 0, y: 52, side: 'left', color: '#EAB308' },
    ]
  },
  {
    id: 'sensor_mpu6050',
    name: 'MPU6050 6-Axis Gyro & Accelerometer',
    category: 'sensors',
    subcategory: 'Motion / IMU',
    prefix: 'IMU',
    width: 110,
    height: 85,
    bodyColor: '#047857',
    accentColor: '#10B981',
    description: '3-Axis Gyroscope + 3-Axis Accelerometer with DMP',
    voltage: '3.3V - 5V',
    interfaces: ['I2C'],
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 40, side: 'left', color: '#1F2937' },
      { id: 'SCL', name: 'SCL', type: 'i2c', x: 0, y: 60, side: 'left', color: '#10B981' },
      { id: 'SDA', name: 'SDA', type: 'i2c', x: 110, y: 20, side: 'right', color: '#10B981' },
      { id: 'INT', name: 'INT', type: 'digital', x: 110, y: 50, side: 'right', color: '#8B5CF6' },
    ]
  },
  {
    id: 'sensor_dht22',
    name: 'DHT22 Digital Temperature & Humidity',
    category: 'sensors',
    subcategory: 'Environmental',
    prefix: 'DHT',
    width: 90,
    height: 70,
    bodyColor: '#FFFFFF',
    accentColor: '#0284C7',
    description: 'High Precision Temp (-40..80°C) & Humidity (0..100%)',
    voltage: '3.3V - 5V',
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'DATA', name: 'DATA', type: 'digital', x: 0, y: 40, side: 'left', color: '#EAB308' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 60, side: 'left', color: '#1F2937' },
    ]
  },
  {
    id: 'sensor_pir_motion',
    name: 'HC-SR501 PIR Motion Detector',
    category: 'sensors',
    subcategory: 'Motion',
    prefix: 'PIR',
    width: 100,
    height: 80,
    bodyColor: '#FFFFFF',
    accentColor: '#10B981',
    description: 'Pyroelectric Passive Infrared Human Motion Sensor (7m)',
    voltage: '5V - 12V',
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 25, side: 'left', color: '#EF4444' },
      { id: 'OUT', name: 'OUT(3.3V)', type: 'digital', x: 0, y: 50, side: 'left', color: '#EAB308' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 70, side: 'left', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 5. 📷 VISION & AI
  // =========================================================================
  {
    id: 'esp32_cam_mod',
    name: 'ESP32-CAM (OV2640 2MP Camera)',
    category: 'vision',
    subcategory: 'AI Cameras',
    prefix: 'CAM',
    width: 130,
    height: 160,
    bodyColor: '#1E293B',
    accentColor: '#EAB308',
    description: 'ESP32 Wi-Fi + Bluetooth + OV2640 2MP Camera + MicroSD',
    voltage: '5V',
    current: '180-310mA',
    interfaces: ['Wi-Fi', 'UART', 'GPIO'],
    renderType: 'esp32',
    pins: [
      { id: '5V', name: '5V', type: 'power-5v', x: 0, y: 30, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 55, side: 'left', color: '#1F2937' },
      { id: 'U0R', name: 'U0R(RX)', type: 'uart', x: 0, y: 80, side: 'left', color: '#8B5CF6' },
      { id: 'U0T', name: 'U0T(TX)', type: 'uart', x: 0, y: 105, side: 'left', color: '#8B5CF6' },
      { id: 'IO0', name: 'GPIO0(Flash)', type: 'digital', x: 0, y: 130, side: 'left', color: '#EAB308' },
      { id: 'IO4', name: 'GPIO4(LED)', type: 'digital', x: 130, y: 55, side: 'right', color: '#EAB308' },
    ]
  },

  // =========================================================================
  // 6. 📡 WIRELESS & COMMUNICATION
  // =========================================================================
  {
    id: 'hc05_bluetooth',
    name: 'HC-05 Bluetooth Serial Module',
    category: 'wireless',
    subcategory: 'Bluetooth',
    prefix: 'BT',
    width: 110,
    height: 80,
    bodyColor: '#1E40AF',
    accentColor: '#38BDF8',
    description: 'Bluetooth 2.0+EDR SPP Serial Wireless Transceiver',
    voltage: '3.6V - 6V',
    interfaces: ['UART'],
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 40, side: 'left', color: '#1F2937' },
      { id: 'TXD', name: 'TXD', type: 'uart', x: 0, y: 60, side: 'left', color: '#8B5CF6' },
      { id: 'RXD', name: 'RXD(3.3V)', type: 'uart', x: 110, y: 20, side: 'right', color: '#8B5CF6' },
      { id: 'STATE', name: 'STATE', type: 'digital', x: 110, y: 50, side: 'right', color: '#EAB308' },
    ]
  },
  {
    id: 'nrf24l01_rf',
    name: 'nRF24L01+ 2.4GHz RF Transceiver',
    category: 'wireless',
    subcategory: 'RF Wireless',
    prefix: 'NRF',
    width: 110,
    height: 85,
    bodyColor: '#0F172A',
    accentColor: '#10B981',
    description: '2.4GHz ISM Band 2Mbps Wireless Data Transceiver',
    voltage: '3.3V (5V Tolerant Inputs)',
    interfaces: ['SPI'],
    renderType: 'ic_chip',
    pins: [
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 20, side: 'left', color: '#1F2937' },
      { id: 'VCC', name: 'VCC(3.3V)', type: 'power-3v3', x: 0, y: 40, side: 'left', color: '#F97316' },
      { id: 'CE', name: 'CE', type: 'digital', x: 0, y: 60, side: 'left', color: '#EAB308' },
      { id: 'CSN', name: 'CSN', type: 'spi', x: 110, y: 20, side: 'right', color: '#10B981' },
      { id: 'SCK', name: 'SCK', type: 'spi', x: 110, y: 40, side: 'right', color: '#10B981' },
      { id: 'MOSI', name: 'MOSI', type: 'spi', x: 110, y: 60, side: 'right', color: '#10B981' },
    ]
  },

  // =========================================================================
  // 7. 🔋 POWER & BATTERY
  // =========================================================================
  {
    id: 'battery_pack_74v',
    name: '7.4V 2S Li-ion Battery Pack (2x 18650)',
    category: 'power',
    subcategory: 'Batteries',
    prefix: 'BAT',
    width: 90,
    height: 100,
    bodyColor: '#1E293B',
    accentColor: '#F59E0B',
    description: '7.4V 2600mAh High-Discharge Robotics Power Source',
    voltage: '7.4V - 8.4V',
    renderType: 'battery',
    pins: [
      { id: 'POS', name: 'VCC (+)', type: 'power-5v', x: 45, y: 0, side: 'top', color: '#EF4444' },
      { id: 'NEG', name: 'GND (-)', type: 'ground', x: 45, y: 100, side: 'bottom', color: '#1F2937' },
    ]
  },
  {
    id: 'buck_converter_lm2596',
    name: 'LM2596 Step-Down DC-DC Buck Converter',
    category: 'power',
    subcategory: 'Regulators',
    prefix: 'BUCK',
    width: 120,
    height: 80,
    bodyColor: '#1E40AF',
    accentColor: '#38BDF8',
    description: 'High-Efficiency 3A 7-35V In to Stable 5V Out Regulator',
    voltage: 'IN: 7-35V | OUT: 1.25-30V',
    current: '3A Max',
    renderType: 'ic_chip',
    pins: [
      { id: 'IN_POS', name: 'IN +', type: 'power-12v', x: 0, y: 25, side: 'left', color: '#DC2626' },
      { id: 'IN_NEG', name: 'IN -', type: 'ground', x: 0, y: 55, side: 'left', color: '#1F2937' },
      { id: 'OUT_POS', name: 'OUT + (5V)', type: 'power-5v', x: 120, y: 25, side: 'right', color: '#EF4444' },
      { id: 'OUT_NEG', name: 'OUT -', type: 'ground', x: 120, y: 55, side: 'right', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 8. 💡 LEDS & INDICATORS
  // =========================================================================
  {
    id: 'led_diode',
    name: '5mm LED (Light Emitting Diode)',
    category: 'indicators',
    subcategory: 'LEDs',
    prefix: 'LED',
    width: 70,
    height: 60,
    bodyColor: '#0F172A',
    accentColor: '#EF4444',
    description: '20mA Forward Current Indicator Diode with Glow',
    voltage: '2.0V - 3.2V',
    current: '20mA',
    renderType: 'led',
    pins: [
      { id: 'A', name: 'Anode (+)', type: 'passive', x: 0, y: 30, side: 'left', color: '#EF4444' },
      { id: 'K', name: 'Cathode (-)', type: 'ground', x: 70, y: 30, side: 'right', color: '#1F2937' },
    ]
  },
  {
    id: 'ws2812b_neopixel',
    name: 'WS2812B NeoPixel RGB LED Strip',
    category: 'indicators',
    subcategory: 'Addressable LEDs',
    prefix: 'NEO',
    width: 110,
    height: 60,
    bodyColor: '#0F172A',
    accentColor: '#8B5CF6',
    description: 'Individually Addressable 24-bit TrueColor RGB LED',
    voltage: '5V DC',
    renderType: 'ic_chip',
    pins: [
      { id: '5V', name: '5V', type: 'power-5v', x: 0, y: 18, side: 'left', color: '#EF4444' },
      { id: 'DIN', name: 'DIN', type: 'digital', x: 0, y: 40, side: 'left', color: '#EAB308' },
      { id: 'GND', name: 'GND', type: 'ground', x: 110, y: 18, side: 'right', color: '#1F2937' },
      { id: 'DOUT', name: 'DOUT', type: 'digital', x: 110, y: 40, side: 'right', color: '#EAB308' },
    ]
  },

  // =========================================================================
  // 9. 🔘 SWITCHES & CONTROLS
  // =========================================================================
  {
    id: 'push_button_sw',
    name: 'Tactile Momentary Push Button',
    category: 'controls',
    subcategory: 'Buttons',
    prefix: 'SW',
    width: 70,
    height: 45,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Standard 4-Pin Momentary Tactile Switch',
    renderType: 'button',
    pins: [
      { id: 'p1', name: '1', type: 'passive', x: 0, y: 22, side: 'left', color: '#38BDF8' },
      { id: 'p2', name: '2', type: 'passive', x: 70, y: 22, side: 'right', color: '#38BDF8' },
    ]
  },
  {
    id: 'joystick_2axis',
    name: '2-Axis Dual Potentiometer Analog Joystick',
    category: 'controls',
    subcategory: 'Joysticks',
    prefix: 'JOY',
    width: 100,
    height: 85,
    bodyColor: '#1E293B',
    accentColor: '#38BDF8',
    description: 'X-Y Dual Axis Analog Controller with Push Button',
    voltage: '5V DC',
    renderType: 'ic_chip',
    pins: [
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 15, side: 'left', color: '#1F2937' },
      { id: '5V', name: '5V', type: 'power-5v', x: 0, y: 32, side: 'left', color: '#EF4444' },
      { id: 'VRX', name: 'VRX', type: 'analog', x: 0, y: 50, side: 'left', color: '#3B82F6' },
      { id: 'VRY', name: 'VRY', type: 'analog', x: 0, y: 68, side: 'left', color: '#3B82F6' },
      { id: 'SW', name: 'SW', type: 'digital', x: 100, y: 40, side: 'right', color: '#EAB308' },
    ]
  },

  // =========================================================================
  // 10. 🖥️ DISPLAYS
  // =========================================================================
  {
    id: 'oled_096_i2c',
    name: '0.96" I2C OLED Display (128x64)',
    category: 'displays',
    subcategory: 'OLED',
    prefix: 'OLED',
    width: 100,
    height: 80,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Monochrome 128x64 SSD1306 Graphic Display',
    voltage: '3.3V - 5V',
    interfaces: ['I2C'],
    renderType: 'oled_display',
    pins: [
      { id: 'GND', name: 'GND', type: 'ground', x: 15, y: 0, side: 'top', color: '#1F2937' },
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 40, y: 0, side: 'top', color: '#EF4444' },
      { id: 'SCL', name: 'SCL', type: 'i2c', x: 65, y: 0, side: 'top', color: '#10B981' },
      { id: 'SDA', name: 'SDA', type: 'i2c', x: 90, y: 0, side: 'top', color: '#10B981' },
    ]
  },
  {
    id: 'lcd_1602_i2c',
    name: '16x2 Character LCD Display (I2C Adapter)',
    category: 'displays',
    subcategory: 'LCD',
    prefix: 'LCD',
    width: 140,
    height: 70,
    bodyColor: '#005C61',
    accentColor: '#00878F',
    description: '16 Characters x 2 Lines Alphanumeric Backlit LCD',
    voltage: '5V DC',
    interfaces: ['I2C'],
    renderType: 'ic_chip',
    pins: [
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 15, side: 'left', color: '#1F2937' },
      { id: 'VCC', name: 'VCC(5V)', type: 'power-5v', x: 0, y: 32, side: 'left', color: '#EF4444' },
      { id: 'SDA', name: 'SDA', type: 'i2c', x: 0, y: 50, side: 'left', color: '#10B981' },
      { id: 'SCL', name: 'SCL', type: 'i2c', x: 140, y: 32, side: 'right', color: '#10B981' },
    ]
  },

  // =========================================================================
  // 11. 🔊 AUDIO & SOUND
  // =========================================================================
  {
    id: 'buzzer_5v_active',
    name: '5V Active Piezo Buzzer',
    category: 'audio',
    subcategory: 'Buzzers',
    prefix: 'BZ',
    width: 70,
    height: 60,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Built-in Oscillation 2.3kHz Alarm Sounder (85dB)',
    voltage: '3.3V - 5V',
    current: '30mA',
    renderType: 'ic_chip',
    pins: [
      { id: 'POS', name: 'VCC (+)', type: 'power-5v', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'NEG', name: 'GND (-)', type: 'ground', x: 0, y: 45, side: 'left', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 12. 🧩 ELECTRONIC COMPONENTS & PASSIVES
  // =========================================================================
  {
    id: 'resistor_pass',
    name: 'Resistor (220Ω / 1kΩ / 10kΩ)',
    category: 'electronics',
    subcategory: 'Passives',
    prefix: 'R',
    width: 80,
    height: 40,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: '1/4W 5% Metal Film Current Limiting Resistor',
    renderType: 'resistor',
    pins: [
      { id: 'p1', name: '1', type: 'passive', x: 0, y: 20, side: 'left', color: '#38BDF8' },
      { id: 'p2', name: '2', type: 'passive', x: 80, y: 20, side: 'right', color: '#38BDF8' },
    ]
  },
  {
    id: 'mosfet_irfz44n',
    name: 'IRFZ44N N-Channel Power MOSFET',
    category: 'electronics',
    subcategory: 'Transistors',
    prefix: 'Q',
    width: 90,
    height: 70,
    bodyColor: '#1E293B',
    accentColor: '#38BDF8',
    description: '55V 49A Low RDS(on) Power Switching Transistor',
    renderType: 'ic_chip',
    pins: [
      { id: 'G', name: 'Gate', type: 'digital', x: 0, y: 20, side: 'left', color: '#EAB308' },
      { id: 'D', name: 'Drain', type: 'motor-out', x: 0, y: 50, side: 'left', color: '#3B82F6' },
      { id: 'S', name: 'Source', type: 'ground', x: 90, y: 35, side: 'right', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 13. 🛞 MECHANICAL & ROBOT CHASSIS
  // =========================================================================
  {
    id: 'chassis_2wd',
    name: '2WD Acrylic Smart Robot Chassis',
    category: 'mechanical',
    subcategory: 'Chassis',
    prefix: 'CHS',
    width: 120,
    height: 100,
    bodyColor: '#0F172A',
    accentColor: '#0284C7',
    description: 'Laser-Cut Transparent Acrylic Plate with Motor Mounts',
    renderType: 'ic_chip',
    pins: []
  },
  {
    id: 'mecanum_wheel_set',
    name: '60mm Omni-Directional Mecanum Wheel',
    category: 'mechanical',
    subcategory: 'Wheels',
    prefix: 'WHL',
    width: 80,
    height: 80,
    bodyColor: '#1E293B',
    accentColor: '#CA8A04',
    description: '45-Degree Roller Wheel for 360° Holonomic Movement',
    renderType: 'ic_chip',
    pins: []
  },

  // =========================================================================
  // 14. 🦾 ROBOT ARMS & EFFECTORS
  // =========================================================================
  {
    id: 'servo_gripper_claw',
    name: '2-Finger Robotic Servo Gripper Claw',
    category: 'robot_arms',
    subcategory: 'End Effectors',
    prefix: 'CLAW',
    width: 110,
    height: 85,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: 'Acrylic Parallel Mechanical Claw Driven by SG90/MG996R',
    renderType: 'servo_sg90',
    pins: [
      { id: 'GND', name: 'GND', type: 'ground', x: 0, y: 25, side: 'left', color: '#1F2937' },
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 50, side: 'left', color: '#EF4444' },
      { id: 'PWM', name: 'PWM', type: 'pwm', x: 0, y: 75, side: 'left', color: '#F97316' },
    ]
  },

  // =========================================================================
  // 15. 🧭 NAVIGATION & GPS
  // =========================================================================
  {
    id: 'neo6m_gps',
    name: 'NEO-6M Satellite GPS Receiver Module',
    category: 'navigation',
    subcategory: 'GPS',
    prefix: 'GPS',
    width: 100,
    height: 80,
    bodyColor: '#0F172A',
    accentColor: '#38BDF8',
    description: '50-Channel High Sensitivity Satellite Navigation Receiver',
    voltage: '3V - 5V',
    interfaces: ['UART'],
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC', name: 'VCC', type: 'power-5v', x: 0, y: 20, side: 'left', color: '#EF4444' },
      { id: 'RX', name: 'RX', type: 'uart', x: 0, y: 40, side: 'left', color: '#8B5CF6' },
      { id: 'TX', name: 'TX', type: 'uart', x: 0, y: 60, side: 'left', color: '#8B5CF6' },
      { id: 'GND', name: 'GND', type: 'ground', x: 100, y: 40, side: 'right', color: '#1F2937' },
    ]
  },

  // =========================================================================
  // 16. 🧱 PROTOTYPING & BREADBOARDS
  // =========================================================================
  {
    id: 'breadboard_400pt',
    name: '400-Point Solderless Breadboard',
    category: 'prototyping',
    subcategory: 'Breadboards',
    prefix: 'BB',
    width: 160,
    height: 110,
    bodyColor: '#F8FAFC',
    accentColor: '#38BDF8',
    description: 'Dual Power Rail Solderless Experiment Circuit Board',
    renderType: 'ic_chip',
    pins: [
      { id: 'VCC_BUS', name: 'VCC Rail', type: 'power-5v', x: 0, y: 30, side: 'left', color: '#EF4444' },
      { id: 'GND_BUS', name: 'GND Rail', type: 'ground', x: 0, y: 80, side: 'left', color: '#1F2937' },
    ]
  }
];
