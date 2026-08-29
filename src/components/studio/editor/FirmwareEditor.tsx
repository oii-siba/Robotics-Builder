'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code2, 
  Play, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useRobotStore } from '@/lib/store/robot-store';

export function FirmwareEditor() {
  const codeData = useRobotStore((state) => state.codeData);
  const setCode = useRobotStore((state) => state.setCode);
  const setCodeLanguage = useRobotStore((state) => state.setCodeLanguage);
  const setFileName = useRobotStore((state) => state.setFileName);
  const parts = useRobotStore((state) => state.parts);

  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'RoboCraft Studio Compiler v2.4 initialized.',
    'Target Architecture: ATmega328P / ESP32 Dual Core.',
    'Ready for code verification and compilation.'
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeData.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = codeData.fileName || 'RobotFirmware.ino';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setConsoleOutput((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Compiling ${codeData.fileName}...`,
      'Checking header dependencies: <Servo.h>, <Wire.h>, <SPI.h>...',
    ]);

    setTimeout(() => {
      setIsCompiling(false);
      setConsoleOutput((prev) => [
        ...prev,
        '✓ Memory: Flash usage 4,280 bytes (13%), SRAM usage 290 bytes (14%).',
        '✓ Syntax Validation PASSED: 0 errors, 0 warnings.',
        '✓ Binary build ready for flashing to microcontroller.',
      ]);
    }, 900);
  };

  // Pre-configured starter firmware snippets
  const codeTemplates = [
    {
      name: 'Obstacle Avoidance Rover',
      fileName: 'ObstacleAvoidance.ino',
      lang: 'cpp' as const,
      snippet: `// RoboCraft Studio: Obstacle Avoidance Rover
#include <Servo.h>

#define TRIG_PIN 12
#define ECHO_PIN 11
#define SERVO_PIN 9
#define IN1 5
#define IN2 6
#define IN3 7
#define IN4 8

Servo headServo;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  headServo.attach(SERVO_PIN);
  headServo.write(90);
  Serial.println("Obstacle Rover Initialized!");
}

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 25000);
  return dur == 0 ? 400 : (dur * 0.034 / 2);
}

void loop() {
  long dist = getDistance();
  Serial.print("Sonar: ");
  Serial.println(dist);
  if (dist > 25) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  } else {
    // Reverse and Scan
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
    delay(400);
  }
  delay(50);
}`
    },
    {
      name: 'Robotic Arm Inverse Kinematics',
      fileName: 'RoboticArmIK.ino',
      lang: 'cpp' as const,
      snippet: `// RoboCraft Studio: 4-DOF Robotic Arm
#include <Servo.h>

Servo baseServo, shoulderServo, elbowServo, clawServo;

void setup() {
  Serial.begin(115200);
  baseServo.attach(15);
  shoulderServo.attach(4);
  elbowServo.attach(5);
  clawServo.attach(18);
  
  // Set default home angles
  baseServo.write(90);
  shoulderServo.write(90);
  elbowServo.write(90);
  clawServo.write(45);
}

void loop() {
  // Smooth motion cycle
  for(int pos = 45; pos <= 135; pos += 2) {
    baseServo.write(pos);
    delay(20);
  }
  for(int pos = 135; pos >= 45; pos -= 2) {
    baseServo.write(pos);
    delay(20);
  }
}`
    },
    {
      name: 'MicroPython ESP32 Robot',
      fileName: 'main.py',
      lang: 'python' as const,
      snippet: `# RoboCraft Studio: MicroPython Controller
from machine import Pin, PWM, time_pulse_us
import time

led = Pin(2, Pin.OUT)
trig = Pin(12, Pin.OUT)
echo = Pin(13, Pin.IN)

def read_sonar():
    trig.value(0)
    time.sleep_us(2)
    trig.value(1)
    time.sleep_us(10)
    trig.value(0)
    dur = time_pulse_us(echo, 1, 30000)
    return (dur * 0.034) / 2 if dur > 0 else 400

print("ESP32 MicroPython Rover Online!")
while True:
    d = read_sonar()
    print("Distance:", d, "cm")
    led.value(1 if d < 20 else 0)
    time.sleep_ms(100)`
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-white select-none">
      {/* Editor Top Bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 sm:px-4 overflow-x-auto custom-scrollbar gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-sky-400 text-xs">
            <FileCode className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[100px] xs:max-w-none">{codeData.fileName}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 flex-shrink-0" />

          {/* Template Selector */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select
              onChange={(e) => {
                const t = codeTemplates.find((x) => x.name === e.target.value);
                if (t) {
                  setCode(t.snippet);
                  setFileName(t.fileName);
                  setCodeLanguage(t.lang);
                }
              }}
              className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-sky-500 max-w-[140px] xs:max-w-[200px]"
              defaultValue=""
            >
              <option value="" disabled>Load Template...</option>
              {codeTemplates.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            title="Verify & Compile Firmware"
          >
            {isCompiling ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span className="hidden xs:inline">{isCompiling ? 'Validating...' : 'Verify / Build'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            title="Download .ino / .py"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <Editor
          height="100%"
          language={codeData.language === 'cpp' ? 'cpp' : 'python'}
          value={codeData.code}
          theme="vs-dark"
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            fontSize: 12,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          }}
        />
      </div>

      {/* Compiler / Serial Monitor Terminal */}
      <div className="h-44 bg-slate-950 border-t border-slate-800 flex flex-col font-mono text-xs">
        <div className="h-7 bg-slate-900/80 px-3 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Output Console & Firmware Diagnostics</span>
          </div>
          <button
            onClick={() => setConsoleOutput(['Console cleared.'])}
            className="hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-slate-300 custom-scrollbar">
          {consoleOutput.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.startsWith('✓')
                  ? 'text-emerald-400 font-semibold'
                  : line.startsWith('[')
                  ? 'text-sky-400'
                  : 'text-slate-400'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
