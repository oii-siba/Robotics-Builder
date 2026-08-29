import { RobotProject } from '../types/robot';

export const PRESET_PROJECTS: RobotProject[] = [
  {
    id: 'preset-obstacle-rover-2wd',
    title: 'Obstacle Avoiding 2WD Smart Rover',
    description: 'Autonomous rover equipped with an HC-SR04 Ultrasonic sensor mounted on a sweeping SG90 servo. Detects obstacles and navigates around rooms automatically.',
    category: 'wheeled_rover',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parts: [
      {
        instanceId: 'chassis-1',
        partId: 'chassis_2wd_acrylic',
        name: 'Main Chassis Plate',
        position: [0, 0.2, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#0EA5E9',
      },
      {
        instanceId: 'motor-left',
        partId: 'dc_gear_motor_tt',
        name: 'Left TT DC Motor',
        position: [-0.9, -0.1, -0.4],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'motor-right',
        partId: 'dc_gear_motor_tt',
        name: 'Right TT DC Motor',
        position: [0.9, -0.1, -0.4],
        rotation: [0, Math.PI, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'wheel-left',
        partId: 'wheel_rubber_65mm',
        name: 'Left Rubber Wheel',
        position: [-1.2, -0.1, -0.4],
        rotation: [0, 0, Math.PI / 2],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'wheel-right',
        partId: 'wheel_rubber_65mm',
        name: 'Right Rubber Wheel',
        position: [1.2, -0.1, -0.4],
        rotation: [0, 0, -Math.PI / 2],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'caster-front',
        partId: 'caster_wheel_ball',
        name: 'Front Caster Wheel',
        position: [0, -0.2, 0.8],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'mcu-uno',
        partId: 'arduino_uno',
        name: 'Arduino Uno R3',
        position: [0, 0.35, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'driver-l298n',
        partId: 'driver_l298n',
        name: 'L298N Motor Driver',
        position: [0, 0.35, -0.6],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'servo-pan',
        partId: 'servo_sg90',
        name: 'Head Pan Servo',
        position: [0, 0.45, 0.9],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'sensor-sonar',
        partId: 'sensor_ultrasonic_hcsr04',
        name: 'HC-SR04 Sonar Eyes',
        position: [0, 0.7, 0.9],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'battery-pack',
        partId: 'battery_18650_dual_pack',
        name: '7.4V Li-Ion Battery',
        position: [0, 0.35, -1.1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
    ],
    wires: [
      { id: 'w1', sourceInstanceId: 'sensor-sonar', sourcePinId: 'VCC', targetInstanceId: 'mcu-uno', targetPinId: '5V', wireColor: '#EF4444' },
      { id: 'w2', sourceInstanceId: 'sensor-sonar', sourcePinId: 'GND', targetInstanceId: 'mcu-uno', targetPinId: 'GND_1', wireColor: '#1F2937' },
      { id: 'w3', sourceInstanceId: 'sensor-sonar', sourcePinId: 'TRIG', targetInstanceId: 'mcu-uno', targetPinId: 'D12', wireColor: '#EAB308' },
      { id: 'w4', sourceInstanceId: 'sensor-sonar', sourcePinId: 'ECHO', targetInstanceId: 'mcu-uno', targetPinId: 'D11', wireColor: '#3B82F6' },
      { id: 'w5', sourceInstanceId: 'servo-pan', sourcePinId: 'PWM', targetInstanceId: 'mcu-uno', targetPinId: 'D9', wireColor: '#F97316' },
      { id: 'w6', sourceInstanceId: 'driver-l298n', sourcePinId: 'IN1', targetInstanceId: 'mcu-uno', targetPinId: 'D5', wireColor: '#10B981' },
      { id: 'w7', sourceInstanceId: 'driver-l298n', sourcePinId: 'IN2', targetInstanceId: 'mcu-uno', targetPinId: 'D6', wireColor: '#10B981' },
      { id: 'w8', sourceInstanceId: 'driver-l298n', sourcePinId: 'IN3', targetInstanceId: 'mcu-uno', targetPinId: 'D7', wireColor: '#10B981' },
      { id: 'w9', sourceInstanceId: 'driver-l298n', sourcePinId: 'IN4', targetInstanceId: 'mcu-uno', targetPinId: 'D8', wireColor: '#10B981' },
    ],
    code: {
      language: 'cpp',
      fileName: 'ObstacleAvoidance.ino',
      code: `// ==========================================
// RoboCraft Studio: Obstacle Avoiding Rover
// Hardware: Arduino Uno + HC-SR04 + L298N + SG90
// ==========================================

#include <Servo.h>

#define TRIG_PIN 12
#define ECHO_PIN 11
#define SERVO_PIN 9

// L298N Motor Pins
#define IN1 5
#define IN2 6
#define IN3 7
#define IN4 8

Servo headServo;
int distanceThreshold = 25; // in cm

void setup() {
  Serial.begin(9600);
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  headServo.attach(SERVO_PIN);
  headServo.write(90); // Look straight
  
  delay(1000);
  Serial.println("RoboCraft Rover Ready! Starting Navigation loop...");
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 400; // max range
  return duration * 0.034 / 2;
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnLeft() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void stopBot() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void loop() {
  long distance = readDistance();
  Serial.print("Front Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance > distanceThreshold) {
    moveForward();
  } else {
    stopBot();
    delay(300);
    moveBackward();
    delay(400);
    stopBot();
    
    // Look Right
    headServo.write(20);
    delay(500);
    long rightDist = readDistance();
    
    // Look Left
    headServo.write(160);
    delay(500);
    long leftDist = readDistance();
    
    // Reset to Center
    headServo.write(90);
    delay(300);
    
    if (rightDist > leftDist && rightDist > 20) {
      turnRight();
      delay(450);
    } else if (leftDist >= rightDist && leftDist > 20) {
      turnLeft();
      delay(450);
    } else {
      // Dead end, spin around 180 deg
      turnRight();
      delay(800);
    }
  }
  delay(50);
}`
    }
  },
  {
    id: 'preset-robotic-arm-4dof',
    title: '4-DOF Articulated Robotic Arm',
    description: 'Precision robotic arm with rotating base, shoulder, elbow, wrist pitch, and mechanical claw gripper for pick-and-place automation.',
    category: 'robotic_arm',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parts: [
      {
        instanceId: 'base-turn',
        partId: 'robotic_arm_base',
        name: 'Turntable Arm Base',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'servo-base',
        partId: 'servo_mg996r',
        name: 'Base Yaw Servo (MG996R)',
        position: [0, 0.2, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'link-shoulder',
        partId: 'arm_link',
        name: 'Shoulder Arm Link',
        position: [0, 0.8, 0.2],
        rotation: [0.4, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'servo-elbow',
        partId: 'servo_mg996r',
        name: 'Elbow Pitch Servo',
        position: [0, 1.4, 0.5],
        rotation: [0, Math.PI / 2, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'link-forearm',
        partId: 'arm_link',
        name: 'Forearm Link',
        position: [0, 1.9, 0.3],
        rotation: [-0.6, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'gripper-claw',
        partId: 'arm_gripper',
        name: 'End-Effector Claw Gripper',
        position: [0, 2.3, 0.1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'mcu-esp32',
        partId: 'esp32_devkit',
        name: 'ESP32 Wi-Fi Controller',
        position: [0.8, 0.05, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
    ],
    wires: [
      { id: 'w_arm_1', sourceInstanceId: 'servo-base', sourcePinId: 'PWM', targetInstanceId: 'mcu-esp32', targetPinId: 'D15', wireColor: '#F97316' },
      { id: 'w_arm_2', sourceInstanceId: 'servo-elbow', sourcePinId: 'PWM', targetInstanceId: 'mcu-esp32', targetPinId: 'D4', wireColor: '#EAB308' },
    ],
    code: {
      language: 'cpp',
      fileName: 'RoboticArmIK.ino',
      code: `// ==========================================
// RoboCraft Studio: 4-DOF Robotic Arm Controller
// Target: ESP32 + 4x MG996R Servos + Gripper
// ==========================================

#include <ESP32Servo.h>

Servo servoBase;
Servo servoShoulder;
Servo servoElbow;
Servo servoGripper;

const int pinBase = 15;
const int pinShoulder = 4;
const int pinElbow = 5;
const int pinGripper = 18;

void setup() {
  Serial.begin(115200);
  
  servoBase.attach(pinBase);
  servoShoulder.attach(pinShoulder);
  servoElbow.attach(pinElbow);
  servoGripper.attach(pinGripper);
  
  // Home position
  moveToHome();
  Serial.println("Robotic Arm Calibrated at Home position.");
}

void moveToHome() {
  servoBase.write(90);
  servoShoulder.write(90);
  servoElbow.write(90);
  servoGripper.write(30); // Open claw
}

void pickAndPlace() {
  // 1. Move over object
  servoBase.write(45);
  delay(600);
  
  // 2. Reach down
  servoShoulder.write(120);
  servoElbow.write(60);
  delay(600);
  
  // 3. Close Claw (Grip)
  servoGripper.write(90);
  delay(500);
  
  // 4. Lift up
  servoShoulder.write(70);
  delay(600);
  
  // 5. Rotate to target bin
  servoBase.write(135);
  delay(800);
  
  // 6. Release (Drop)
  servoGripper.write(30);
  delay(500);
  
  // Return Home
  moveToHome();
  delay(1000);
}

void loop() {
  pickAndPlace();
  delay(3000);
}`
    }
  },
  {
    id: 'preset-line-follower-3ir',
    title: 'Autonomous PID Line Follower',
    description: 'High-speed line tracking robot utilizing a 3-channel TCRT5000 IR sensor array and high-RPM gear motors.',
    category: 'line_follower',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parts: [
      {
        instanceId: 'chassis-base',
        partId: 'chassis_2wd_acrylic',
        name: 'Chassis Base',
        position: [0, 0.2, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'ir-left',
        partId: 'sensor_ir_line_tracker',
        name: 'Left IR Sensor',
        position: [-0.4, 0.05, 1.1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'ir-center',
        partId: 'sensor_ir_line_tracker',
        name: 'Center IR Sensor',
        position: [0, 0.05, 1.1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'ir-right',
        partId: 'sensor_ir_line_tracker',
        name: 'Right IR Sensor',
        position: [0.4, 0.05, 1.1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      {
        instanceId: 'mcu-nano',
        partId: 'arduino_nano',
        name: 'Arduino Nano V3',
        position: [0, 0.3, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
    ],
    wires: [],
    code: {
      language: 'cpp',
      fileName: 'LineFollowerPID.ino',
      code: `// ==========================================
// RoboCraft Studio: High-Speed Line Follower
// Hardware: Arduino Nano + 3x IR Sensors + L298N
// ==========================================

#define IR_LEFT   2
#define IR_CENTER 3
#define IR_RIGHT  4

#define ENA 5
#define IN1 6
#define IN2 7
#define IN3 8
#define IN4 9
#define ENB 10

int baseSpeed = 180;

void setup() {
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_CENTER, INPUT);
  pinMode(IR_RIGHT, INPUT);
  
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT);
}

void loop() {
  int left = digitalRead(IR_LEFT);
  int center = digitalRead(IR_CENTER);
  int right = digitalRead(IR_RIGHT);
  
  // Line is detected as LOW or HIGH based on surface
  if (center == LOW && left == HIGH && right == HIGH) {
    // Go Straight
    setMotors(baseSpeed, baseSpeed);
  } else if (left == LOW) {
    // Turn Left sharply
    setMotors(0, baseSpeed);
  } else if (right == LOW) {
    // Turn Right sharply
    setMotors(baseSpeed, 0);
  }
}

void setMotors(int speedL, int speedR) {
  analogWrite(ENA, speedL);
  analogWrite(ENB, speedR);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}`
    }
  }
];
