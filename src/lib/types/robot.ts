export type PartCategory = 
  | 'controllers' 
  | 'actuators' 
  | 'sensors' 
  | 'structural' 
  | 'displays' 
  | 'power' 
  | 'accessories';

export interface PinDefinition {
  id: string;
  name: string;
  type: 'power-5v' | 'power-3v3' | 'ground' | 'digital' | 'analog' | 'pwm' | 'i2c' | 'spi' | 'uart' | 'motor-out';
  color?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  xOffset?: number;
}

export interface RobotPartDefinition {
  id: string;
  name: string;
  category: PartCategory;
  description: string;
  dimensions: [number, number, number]; // width, height, depth
  defaultColor?: string;
  pins?: PinDefinition[];
  approxPriceUsd: number;
  tags?: string[];
  specs: {
    voltage?: string;
    current?: string;
    weight?: string;
    interface?: string;
    [key: string]: string | undefined;
  };
  meshType: 
    | 'arduino_uno' 
    | 'arduino_mega'
    | 'arduino_nano' 
    | 'esp32' 
    | 'esp8266'
    | 'raspberry_pi' 
    | 'raspberry_pico'
    | 'servo_sg90' 
    | 'servo_mg996r' 
    | 'servo_mg90s'
    | 'dc_gear_motor' 
    | 'stepper_motor_nema17' 
    | 'stepper_28byj'
    | 'motor_drone_brushless'
    | 'relay_module'
    | 'driver_l298n' 
    | 'driver_tb6612'
    | 'driver_pca9685'
    | 'buzzer_active'
    | 'sensor_ultrasonic' 
    | 'sensor_lidar'
    | 'sensor_camera_ov2640'
    | 'sensor_mpu6050' 
    | 'sensor_ir_tracker' 
    | 'sensor_pir'
    | 'sensor_dht22'
    | 'sensor_gas_mq2'
    | 'display_oled_096'
    | 'display_lcd_1602'
    | 'display_matrix_rgb'
    | 'chassis_2wd' 
    | 'chassis_4wd' 
    | 'chassis_drone_x'
    | 'wheel_rubber' 
    | 'wheel_mecanum'
    | 'tracks_tank'
    | 'caster_wheel' 
    | 'pan_tilt_bracket'
    | 'arm_base' 
    | 'arm_link' 
    | 'arm_gripper' 
    | 'humanoid_leg_link'
    | 'battery_18650_pack' 
    | 'battery_lipo_3s'
    | 'battery_9v' 
    | 'module_buck_converter'
    | 'breadboard_400' 
    | 'solar_panel'
    | 'custom_box';
}

export interface PlacedPart {
  instanceId: string;
  partId: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  customLabel?: string;
  attachedTo?: string;
  isLocked?: boolean;
}

export interface WireConnection {
  id: string;
  sourceInstanceId: string;
  sourcePinId: string;
  targetInstanceId: string;
  targetPinId: string;
  wireColor: string;
  label?: string;
}

export interface CodeData {
  language: 'cpp' | 'python' | 'json';
  code: string;
  fileName: string;
}

export interface BOMItem {
  partId: string;
  name: string;
  category: PartCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specs: Record<string, string | undefined>;
}

export interface RobotProject {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  parts: PlacedPart[];
  wires: WireConnection[];
  code: CodeData;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}
