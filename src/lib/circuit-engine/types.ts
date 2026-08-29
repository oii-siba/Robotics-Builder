export type ComponentCategory = 
  | 'controllers'     // 🧠 Controllers & Development Boards
  | 'motors'          // ⚙️ Motors & Actuators
  | 'drivers'         // 🔌 Motor Drivers & Controllers
  | 'sensors'         // 👁️ Sensors
  | 'vision'          // 📷 Vision & AI
  | 'wireless'        // 📡 Communication & Wireless
  | 'power'           // 🔋 Power & Battery
  | 'indicators'      // 💡 LEDs & Indicators
  | 'controls'        // 🔘 Switches & Controls
  | 'displays'        // 🖥️ Displays
  | 'audio'           // 🔊 Audio & Sound
  | 'electronics'     // 🧩 Electronic Components & Passives
  | 'connectors'      // 🔗 Connectivity & Wires
  | 'mechanical'      // 🛞 Mechanical & Robot Chassis
  | 'robot_arms'      // 🦾 Robot Arm & End Effectors
  | 'drones'          // 🚁 Drone Components
  | 'navigation'      // 🧭 Navigation & IMU/GPS
  | 'protection'      // 🛡️ Safety & Protection
  | 'testing'         // 🧪 Measurement & Testing
  | 'prototyping';    // 🧱 Prototyping & Breadboards

export type PinType = 
  | 'digital' 
  | 'analog' 
  | 'pwm' 
  | 'power-5v' 
  | 'power-3v3' 
  | 'power-12v' 
  | 'ground' 
  | 'i2c' 
  | 'spi' 
  | 'uart' 
  | 'motor-out' 
  | 'passive';

export interface Point {
  x: number;
  y: number;
}

export interface CircuitPinDef {
  id: string;
  name: string;
  type: PinType;
  x: number; // relative to component top-left (0..width)
  y: number; // relative to component top-left (0..height)
  side: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  voltage?: string;
}

export interface CircuitComponentDef {
  id: string;
  name: string;
  category: ComponentCategory;
  subcategory: string;
  prefix: string;
  width: number;
  height: number;
  bodyColor?: string;
  accentColor?: string;
  description: string;
  voltage?: string;
  current?: string;
  interfaces?: string[];
  pins: CircuitPinDef[];
  specs?: Record<string, string>;
  renderType: 
    | 'ic_chip' 
    | 'esp32' 
    | 'arduino_uno' 
    | 'arduino_nano'
    | 'raspberry_pi'
    | 'driver_l298n' 
    | 'ultrasonic' 
    | 'motor_dc' 
    | 'servo_sg90' 
    | 'ir_sensor' 
    | 'battery' 
    | 'resistor' 
    | 'led' 
    | 'button' 
    | 'gnd_sym' 
    | 'vcc_sym' 
    | 'oled_display';
}

export interface PlacedCircuitComponent {
  instanceId: string;
  defId: string;
  label: string;
  value?: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
}

export interface CircuitWire {
  id: string;
  fromComponentId?: string;
  fromPinId?: string;
  fromPoint?: Point; // When tapped onto a wire
  toComponentId?: string;
  toPinId?: string;
  toPoint?: Point; // When tapped onto a wire
  waypoints?: Point[]; // Custom user-directed bend corners
  color: string;
  label?: string;
  isJunction?: boolean;
}

export type EditorTool = 'select' | 'wire' | 'delete' | 'pan';

export interface CircuitProjectData {
  id: string;
  title: string;
  description?: string;
  components: PlacedCircuitComponent[];
  wires: CircuitWire[];
  createdAt: string;
  updatedAt: string;
}
