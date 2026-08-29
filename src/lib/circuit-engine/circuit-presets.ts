import { PlacedCircuitComponent, CircuitWire } from './types';

export interface CircuitPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  components: PlacedCircuitComponent[];
  wires: CircuitWire[];
}

export const PRESET_CIRCUITS: CircuitPreset[] = [
  // ================= 1. OBSTACLE AVOIDING ROVER =================
  {
    id: 'preset-obstacle-rover',
    name: 'Obstacle Avoiding Robot Car',
    category: 'wheeled_rover',
    description: 'ESP32 controller wired to an L298N Dual H-Bridge, HC-SR04 Ultrasonic Sonar, and Head-Panning SG90 Servo.',
    components: [
      { instanceId: 'esp32-1', defId: 'esp32_devkit', label: 'ESP32_MCU', x: 280, y: 100, rotation: 0 },
      { instanceId: 'drv-1', defId: 'l298n_driver', label: 'L298N_Driver', x: 580, y: 110, rotation: 0 },
      { instanceId: 'sonar-1', defId: 'sensor_ultrasonic', label: 'HC_SR04_Eyes', x: 280, y: 400, rotation: 0 },
      { instanceId: 'servo-1', defId: 'servo_sg90', label: 'Head_Servo', x: 80, y: 400, rotation: 0 },
      { instanceId: 'motor-l', defId: 'dc_gear_motor', label: 'Motor_Left', x: 840, y: 90, rotation: 0 },
      { instanceId: 'motor-r', defId: 'dc_gear_motor', label: 'Motor_Right', x: 840, y: 220, rotation: 0 },
      { instanceId: 'bat-1', defId: 'battery_pack', label: '7.4V_Battery', x: 80, y: 130, rotation: 0 },
    ],
    wires: [
      { id: 'w1', fromComponentId: 'esp32-1', fromPinId: 'D25', toComponentId: 'drv-1', toPinId: 'IN1', color: '#38BDF8', label: 'GPIO25 ➔ IN1' },
      { id: 'w2', fromComponentId: 'esp32-1', fromPinId: 'D26', toComponentId: 'drv-1', toPinId: 'IN2', color: '#38BDF8', label: 'GPIO26 ➔ IN2' },
      { id: 'w3', fromComponentId: 'esp32-1', fromPinId: 'D27', toComponentId: 'drv-1', toPinId: 'IN3', color: '#38BDF8', label: 'GPIO27 ➔ IN3' },
      { id: 'w4', fromComponentId: 'esp32-1', fromPinId: 'D14', toComponentId: 'drv-1', toPinId: 'IN4', color: '#38BDF8', label: 'GPIO14 ➔ IN4' },
      { id: 'w5', fromComponentId: 'drv-1', fromPinId: 'OUT1', toComponentId: 'motor-l', toPinId: 'M_POS', color: '#EF4444' },
      { id: 'w6', fromComponentId: 'drv-1', fromPinId: 'OUT2', toComponentId: 'motor-l', toPinId: 'M_NEG', color: '#1F2937' },
      { id: 'w7', fromComponentId: 'drv-1', fromPinId: 'OUT3', toComponentId: 'motor-r', toPinId: 'M_POS', color: '#EF4444' },
      { id: 'w8', fromComponentId: 'drv-1', fromPinId: 'OUT4', toComponentId: 'motor-r', toPinId: 'M_NEG', color: '#1F2937' },
      { id: 'w9', fromComponentId: 'sonar-1', fromPinId: 'VCC', toComponentId: 'esp32-1', toPinId: 'VIN', color: '#EF4444' },
      { id: 'w10', fromComponentId: 'sonar-1', fromPinId: 'GND', toComponentId: 'esp32-1', toPinId: 'GND_1', color: '#1F2937' },
      { id: 'w11', fromComponentId: 'sonar-1', fromPinId: 'TRIG', toComponentId: 'esp32-1', toPinId: 'D13', color: '#EAB308' },
      { id: 'w12', fromComponentId: 'sonar-1', fromPinId: 'ECHO', toComponentId: 'esp32-1', toPinId: 'D12', color: '#38BDF8' },
      { id: 'w13', fromComponentId: 'servo-1', fromPinId: 'PWM', toComponentId: 'esp32-1', toPinId: 'D4', color: '#F97316' },
      { id: 'w14', fromComponentId: 'bat-1', fromPinId: 'POS', toComponentId: 'drv-1', toPinId: 'VCC_12V', color: '#DC2626' },
      { id: 'w15', fromComponentId: 'bat-1', fromPinId: 'NEG', toComponentId: 'drv-1', toPinId: 'GND', color: '#1F2937' },
    ]
  },

  // ================= 2. LINE FOLLOWER ROBOT =================
  {
    id: 'preset-line-follower',
    name: 'Autonomous Line Follower Robot',
    category: 'line_follower',
    description: 'Arduino Uno with 2x TCRT5000 IR Sensors for black line tracking and L298N differential steering.',
    components: [
      { instanceId: 'uno-1', defId: 'arduino_uno', label: 'Arduino_Uno', x: 260, y: 100, rotation: 0 },
      { instanceId: 'drv-1', defId: 'l298n_driver', label: 'L298N_Driver', x: 560, y: 100, rotation: 0 },
      { instanceId: 'ir-left', defId: 'sensor_ir', label: 'IR_Left', x: 80, y: 100, rotation: 0 },
      { instanceId: 'ir-right', defId: 'sensor_ir', label: 'IR_Right', x: 80, y: 220, rotation: 0 },
      { instanceId: 'motor-l', defId: 'dc_gear_motor', label: 'Motor_Left', x: 820, y: 80, rotation: 0 },
      { instanceId: 'motor-r', defId: 'dc_gear_motor', label: 'Motor_Right', x: 820, y: 200, rotation: 0 },
    ],
    wires: [
      { id: 'lf-w1', fromComponentId: 'ir-left', fromPinId: 'DO', toComponentId: 'uno-1', toPinId: 'A0', color: '#EAB308' },
      { id: 'lf-w2', fromComponentId: 'ir-right', fromPinId: 'DO', toComponentId: 'uno-1', toPinId: 'A1', color: '#EAB308' },
      { id: 'lf-w3', fromComponentId: 'uno-1', fromPinId: 'D5', toComponentId: 'drv-1', toPinId: 'IN1', color: '#38BDF8' },
      { id: 'lf-w4', fromComponentId: 'uno-1', fromPinId: 'D6', toComponentId: 'drv-1', toPinId: 'IN2', color: '#38BDF8' },
      { id: 'lf-w5', fromComponentId: 'uno-1', fromPinId: 'D9', toComponentId: 'drv-1', toPinId: 'IN3', color: '#38BDF8' },
      { id: 'lf-w6', fromComponentId: 'uno-1', fromPinId: 'D10', toComponentId: 'drv-1', toPinId: 'IN4', color: '#38BDF8' },
      { id: 'lf-w7', fromComponentId: 'drv-1', fromPinId: 'OUT1', toComponentId: 'motor-l', toPinId: 'M_POS', color: '#EF4444' },
      { id: 'lf-w8', fromComponentId: 'drv-1', fromPinId: 'OUT2', toComponentId: 'motor-l', toPinId: 'M_NEG', color: '#1F2937' },
      { id: 'lf-w9', fromComponentId: 'drv-1', fromPinId: 'OUT3', toComponentId: 'motor-r', toPinId: 'M_POS', color: '#EF4444' },
      { id: 'lf-w10', fromComponentId: 'drv-1', fromPinId: 'OUT4', toComponentId: 'motor-r', toPinId: 'M_NEG', color: '#1F2937' },
    ]
  },

  // ================= 3. 4-DOF ROBOTIC ARM =================
  {
    id: 'preset-robotic-arm',
    name: '4-DOF Articulated Robotic Arm',
    category: 'robotic_arm',
    description: 'Multi-joint robotic arm with Base, Shoulder, Elbow, and Claw Gripper servos controlled by ESP32.',
    components: [
      { instanceId: 'esp32-arm', defId: 'esp32_devkit', label: 'ESP32_Arm_Brain', x: 260, y: 120, rotation: 0 },
      { instanceId: 'srv-base', defId: 'servo_sg90', label: 'Base_Yaw_Servo', x: 560, y: 60, rotation: 0 },
      { instanceId: 'srv-shoulder', defId: 'servo_sg90', label: 'Shoulder_Servo', x: 560, y: 160, rotation: 0 },
      { instanceId: 'srv-elbow', defId: 'servo_sg90', label: 'Elbow_Servo', x: 560, y: 260, rotation: 0 },
      { instanceId: 'srv-claw', defId: 'servo_sg90', label: 'Claw_Gripper', x: 560, y: 360, rotation: 0 },
      { instanceId: 'oled-1', defId: 'oled_096_i2c', label: 'OLED_Display', x: 80, y: 140, rotation: 0 },
    ],
    wires: [
      { id: 'arm-w1', fromComponentId: 'srv-base', fromPinId: 'PWM', toComponentId: 'esp32-arm', toPinId: 'D13', color: '#F97316' },
      { id: 'arm-w2', fromComponentId: 'srv-shoulder', fromPinId: 'PWM', toComponentId: 'esp32-arm', toPinId: 'D12', color: '#F97316' },
      { id: 'arm-w3', fromComponentId: 'srv-elbow', fromPinId: 'PWM', toComponentId: 'esp32-arm', toPinId: 'D14', color: '#F97316' },
      { id: 'arm-w4', fromComponentId: 'srv-claw', fromPinId: 'PWM', toComponentId: 'esp32-arm', toPinId: 'D27', color: '#F97316' },
      { id: 'arm-w5', fromComponentId: 'oled-1', fromPinId: 'SDA', toComponentId: 'esp32-arm', toPinId: 'D21', color: '#10B981' },
      { id: 'arm-w6', fromComponentId: 'oled-1', fromPinId: 'SCL', toComponentId: 'esp32-arm', toPinId: 'D22', color: '#10B981' },
    ]
  },

  // ================= 4. BLUETOOTH RC CAR =================
  {
    id: 'preset-bluetooth-rc',
    name: 'Bluetooth Smartphone RC Car',
    category: 'wireless_rc',
    description: 'Wireless Bluetooth LE remote-controlled 2WD car with speed control and LED headlights.',
    components: [
      { instanceId: 'esp32-rc', defId: 'esp32_devkit', label: 'ESP32_BLE', x: 260, y: 110, rotation: 0 },
      { instanceId: 'drv-rc', defId: 'l298n_driver', label: 'L298N_Driver', x: 560, y: 110, rotation: 0 },
      { instanceId: 'mot-l', defId: 'dc_gear_motor', label: 'Left_Motor', x: 820, y: 90, rotation: 0 },
      { instanceId: 'mot-r', defId: 'dc_gear_motor', label: 'Right_Motor', x: 820, y: 210, rotation: 0 },
      { instanceId: 'headlight', defId: 'led_diode', label: 'Headlight_LED', x: 80, y: 260, rotation: 0 },
      { instanceId: 'res-hl', defId: 'resistor_pass', label: 'R_220_Ohm', x: 80, y: 160, rotation: 0 },
    ],
    wires: [
      { id: 'rc-1', fromComponentId: 'esp32-rc', fromPinId: 'D25', toComponentId: 'drv-rc', toPinId: 'IN1', color: '#38BDF8' },
      { id: 'rc-2', fromComponentId: 'esp32-rc', fromPinId: 'D26', toComponentId: 'drv-rc', toPinId: 'IN2', color: '#38BDF8' },
      { id: 'rc-3', fromComponentId: 'esp32-rc', fromPinId: 'D27', toComponentId: 'drv-rc', toPinId: 'IN3', color: '#38BDF8' },
      { id: 'rc-4', fromComponentId: 'esp32-rc', fromPinId: 'D14', toComponentId: 'drv-rc', toPinId: 'IN4', color: '#38BDF8' },
      { id: 'rc-5', fromComponentId: 'esp32-rc', fromPinId: 'D2', toComponentId: 'res-hl', toPinId: 'p1', color: '#EAB308' },
      { id: 'rc-6', fromComponentId: 'res-hl', fromPinId: 'p2', toComponentId: 'headlight', toPinId: 'A', color: '#EAB308' },
      { id: 'rc-7', fromComponentId: 'drv-rc', fromPinId: 'OUT1', toComponentId: 'mot-l', toPinId: 'M_POS', color: '#EF4444' },
      { id: 'rc-8', fromComponentId: 'drv-rc', fromPinId: 'OUT2', toComponentId: 'mot-l', toPinId: 'M_NEG', color: '#1F2937' },
    ]
  }
];
