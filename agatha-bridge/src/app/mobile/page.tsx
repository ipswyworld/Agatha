'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  MessageSquare, 
  Cpu, 
  Zap, 
  Play, 
  RefreshCw, 
  Users, 
  Layers, 
  Lock, 
  Unlock,
  AlertTriangle,
  FileCode,
  KeyRound,
  Compass,
  Volume2,
  VolumeX,
  Shuffle,
  Fingerprint,
  Globe,
  Activity,
  HardDrive,
  Settings,
  Download,
  Folder,
  FolderOpen,
  File
} from 'lucide-react';

// ============================================================================
// PROCEDURAL AUDIO SYNTHESIZER ENGINE (Web Audio API)
// ============================================================================
class SynthEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  public analyser: AnalyserNode | null = null;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBlip() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("AudioContext failed to trigger:", e);
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playKeypress() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'sine';
      const freq = 600 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.003, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch (e) {}
  }

  playScanTick() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  startDrone() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (this.droneOsc) return;
      
      this.droneOsc = ctx.createOscillator();
      this.lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      this.droneGain = ctx.createGain();
      
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime);
      
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
      
      lfoGain.gain.setValueAtTime(3, ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      
      this.droneGain.gain.setValueAtTime(0.04, ctx.currentTime);
      
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.droneOsc.frequency);
      
      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      if (this.analyser) {
        this.droneGain.connect(this.analyser);
      } else {
        this.droneGain.connect(ctx.destination);
      }
      
      this.lfo.start();
      this.droneOsc.start();
    } catch (e) {
      console.warn("Drone failed to start:", e);
    }
  }

  stopDrone() {
    try {
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
        this.droneOsc = null;
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
        this.lfo = null;
      }
      if (this.droneGain) {
        this.droneGain.disconnect();
        this.droneGain = null;
      }
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        if (this.analyser) {
          gain.connect(this.analyser);
        } else {
          gain.connect(ctx.destination);
        }
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.04, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playNote(523.25, now, 0.1); // C5
      playNote(659.25, now + 0.08, 0.1); // E5
      playNote(783.99, now + 0.16, 0.1); // G5
      playNote(1046.50, now + 0.24, 0.2); // C6
    } catch (e) {}
  }

  playAlert() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      
      osc1.frequency.setValueAtTime(180, now);
      osc2.frequency.setValueAtTime(183, now);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  playBassDrop() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }
  
  playSweep() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      } else {
        gain.connect(ctx.destination);
      }
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }
}

interface LogEntry {
  timestamp: string;
  side: 'kakos' | 'agathos' | 'system' | 'blocked';
  message: string;
}

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'agathos' | 'kakos';
}

// ============================================================================
// HELPER COMPONENT 1: LIVE AUDIO OSCILLOSCOPE
// ============================================================================
interface OscilloscopeProps {
  synth: React.MutableRefObject<SynthEngine | null>;
  droneActive: boolean;
}

function Oscilloscope({ synth, droneActive }: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyser = synth.current?.analyser;
      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        // Fallback simulated waves if audio context isn't loaded
        for (let i = 0; i < bufferLength; i++) {
          const droneMod = droneActive ? Math.sin(Date.now() * 0.05) * 15 : 0;
          dataArray[i] = 128 + Math.sin(i * 0.15 + Date.now() * 0.01) * (3 + droneMod);
        }
      }

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#a855f7'; // Purple glow by default
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [synth, droneActive]);

  return (
    <div className="flex flex-col gap-1 items-center bg-black/60 border border-neutral-900 rounded-xl p-2 shrink-0">
      <span className="text-[7.5px] uppercase font-bold text-purple-400 tracking-wider font-mono">Neural Audio Waveform</span>
      <canvas ref={canvasRef} width="220" height="24" className="w-full h-6 rounded bg-neutral-950/40" />
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 2: INTERACTIVE WORLD THREAT MAP
// ============================================================================
interface WorldThreatMapProps {
  playClick: () => void;
  playSweep: () => void;
}

function WorldThreatMap({ playClick, playSweep }: WorldThreatMapProps) {
  const [selectedTarget, setSelectedTarget] = useState<any>(null);

  const targets = [
    { name: "US-EAST SECURITY CORE", x: 90, y: 55, status: "Secure", ip: "10.42.19.100", region: "Virginia, USA" },
    { name: "EU-WEST AEGIS GATEWAY", x: 190, y: 50, status: "Infiltrating", ip: "172.16.89.24", region: "London, UK" },
    { name: "ASIA-PACIFIC REAVER SHELL", x: 320, y: 75, status: "Sabotaged", ip: "192.168.99.12", region: "Tokyo, JP" },
    { name: "LATAM SENTINEL FIREWALL", x: 110, y: 120, status: "Secure", ip: "10.12.4.98", region: "São Paulo, BR" },
    { name: "AFRICA COGNITIVE PILLAR", x: 200, y: 110, status: "Scanning", ip: "10.250.32.1", region: "Cape Town, ZA" }
  ];

  const handleNodeClick = (target: any) => {
    playSweep();
    setSelectedTarget(target);
  };

  return (
    <div className="bg-neutral-950/90 border border-neutral-900 rounded-xl p-4 flex flex-col gap-3 relative shadow-lg">
      <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5">
        <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
          <Globe className="w-3 h-3 text-red-500" /> Cyber threat target map
        </span>
        {selectedTarget && (
          <button 
            onClick={() => { playClick(); setSelectedTarget(null); }}
            className="text-[7.5px] uppercase font-bold text-neutral-500 hover:text-neutral-300 font-mono cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative w-full h-[140px] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900/40">
        {/* Simple stylized SVG world representation dots / outline */}
        <svg viewBox="0 0 400 180" className="w-full h-full opacity-60 overflow-visible">
          {/* Stylized background grid */}
          <pattern id="dot-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1e1e1e" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
          
          {/* Target points */}
          {targets.map(t => {
            const isSelected = selectedTarget?.name === t.name;
            const color = t.status === "Secure" ? "#3b82f6" : t.status === "Infiltrating" ? "#f59e0b" : t.status === "Scanning" ? "#10b981" : "#ef4444";
            return (
              <g key={t.name} className="cursor-pointer" onClick={() => handleNodeClick(t)}>
                {/* Expanding sonar ripple */}
                <circle cx={t.x} cy={t.y} r="8" fill="none" stroke={color} strokeWidth="0.5" className="animate-ping" style={{ animationDuration: '3s' }} />
                {/* Real point */}
                <circle cx={t.x} cy={t.y} r={isSelected ? 4.5 : 3} fill={color} stroke="#000" strokeWidth="1" />
              </g>
            );
          })}
        </svg>

        {selectedTarget && (
          <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/90 border border-neutral-850 p-2 rounded-lg text-[8px] text-white flex flex-col gap-1 backdrop-blur-sm select-all">
            <div className="flex justify-between items-center">
              <span className="font-black text-red-400 font-mono">{selectedTarget.name}</span>
              <span className="text-[7px] text-neutral-500 font-mono">{selectedTarget.region}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-500">IP address: {selectedTarget.ip}</span>
              <span className={`font-bold uppercase ${
                selectedTarget.status === 'Secure' ? 'text-blue-400' :
                selectedTarget.status === 'Infiltrating' ? 'text-amber-400' :
                selectedTarget.status === 'Scanning' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {selectedTarget.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 3: PLAYABLE ENTROPY DECRYPTION MINIGAME
// ============================================================================
interface HexGameProps {
  playClick: () => void;
  playBlip: () => void;
  playSuccess: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function HexGame({ playClick, playBlip, playSuccess, addLog }: HexGameProps) {
  const [entropy, setEntropy] = useState(100);
  const [targetChar, setTargetChar] = useState('');
  const [grid, setGrid] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const hexchars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

  const initGame = () => {
    setEntropy(100);
    setSolved(false);
    const target = hexchars[Math.floor(Math.random() * hexchars.length)];
    setTargetChar(target);
    const newGrid = Array.from({ length: 16 }, () => {
      if (Math.random() < 0.3) return target;
      return hexchars[Math.floor(Math.random() * hexchars.length)];
    });
    setGrid(newGrid);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCellClick = (idx: number) => {
    if (solved) return;
    playClick();
    const char = grid[idx];
    if (char === targetChar) {
      playBlip();
      setEntropy(prev => {
        const next = Math.max(0, prev - 25);
        if (next === 0) {
          playSuccess();
          setSolved(true);
          addLog('agathos', 'Steganographic alignment completed: Kyber Token decoded.');
        }
        return next;
      });
      setGrid(prev => {
        const next = [...prev];
        next[idx] = hexchars.filter(c => c !== targetChar)[Math.floor(Math.random() * (hexchars.length - 1))];
        return next;
      });
    } else {
      setEntropy(prev => Math.min(100, prev + 15));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm select-none">
      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 font-mono">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Steganography Alignment</span>
        <span className={`text-[9px] font-bold ${entropy > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
          Entropy: {entropy}%
        </span>
      </div>

      {!solved ? (
        <div className="flex flex-col gap-2">
          <p className="text-[8.5px] text-slate-400 font-mono">
            Locate and click instances of target symbol <span className="font-bold text-blue-600 font-mono">[{targetChar}]</span> to balance entropy coordinates.
          </p>

          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-900 max-w-[180px] mx-auto select-none">
            {grid.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className="w-8 h-8 rounded border border-slate-800 bg-slate-900 font-mono text-[10px] font-bold text-slate-350 hover:bg-slate-800 active:bg-blue-900 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {hex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center py-2">
          <span className="text-[11px] font-black text-emerald-600 uppercase font-mono">Alignment Decoded</span>
          <p className="text-[8.5px] bg-slate-50 border border-slate-100 p-2 rounded text-slate-600 font-mono select-all">
            KYBER-TOKEN: {Math.random().toString(36).substring(2, 12).toUpperCase()}
          </p>
          <button
            onClick={() => { playClick(); initGame(); }}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer"
          >
            Re-Align Grid
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 4: ETHICAL INTEGRITY DIAL GAUGE
// ============================================================================
interface IntegrityDialProps {
  heatValue: number;
}

function IntegrityDial({ heatValue }: IntegrityDialProps) {
  const angle = (heatValue * 180) - 90;
  const percentage = (heatValue * 100).toFixed(0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm min-w-[150px]">
      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider font-mono">Ethical Heat Balance</span>
      
      <div className="relative w-24 h-14 overflow-hidden mt-1 select-none">
        <svg width="96" height="48" viewBox="0 0 100 50" className="overflow-visible">
          <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="url(#gauge-grad)" strokeWidth="10" strokeDasharray="126" strokeDashoffset={126 - (126 * heatValue)} className="transition-all duration-500" />
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        <div 
          style={{ transform: `rotate(${angle}deg)` }} 
          className="absolute bottom-0 left-[47.5%] w-[4px] h-[34px] bg-slate-900 rounded-full origin-bottom transition-all duration-500 shadow-sm"
        />

        <div className="absolute bottom-0 left-[42.5%] w-3 h-1.5 bg-slate-950 rounded-t-full" />
      </div>

      <div className="flex flex-col items-center select-all">
        <span className="text-[10px] font-black font-mono text-slate-900">{percentage}% Heat Ratio</span>
        <span className={`text-[7px] uppercase font-bold px-1 rounded font-mono ${
          heatValue > 0.7 ? 'bg-red-100 text-red-700 animate-pulse' :
          heatValue > 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {heatValue > 0.7 ? 'Critical Offense' : heatValue > 0.4 ? 'Ethical Balance' : 'Normal Defense'}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 5: DYNAMIC ACOUSTIC SOUNDBOARD
// ============================================================================
interface SoundboardProps {
  synth: React.MutableRefObject<SynthEngine | null>;
}

function Soundboard({ synth }: SoundboardProps) {
  const soundTriggers = [
    { label: "Sonar", method: "playSweep" },
    { label: "Bass Drop", method: "playBassDrop" },
    { label: "Warning", method: "playAlert" },
    { label: "Success", method: "playSuccess" },
    { label: "Key Tick", method: "playKeypress" },
    { label: "Blip Pop", method: "playBlip" },
    { label: "Click Pop", method: "playClick" },
    { label: "Scan Tick", method: "playScanTick" }
  ];

  return (
    <div className="bg-neutral-950/90 border border-neutral-900 rounded-xl p-3 flex flex-col gap-2 shadow-lg">
      <span className="text-[7.5px] uppercase font-bold text-neutral-500 tracking-wider font-mono">Cyber Acoustic Board</span>
      <div className="grid grid-cols-4 gap-1 select-none">
        {soundTriggers.map(s => (
          <button
            key={s.label}
            onClick={() => {
              if (synth.current) {
                (synth.current as any)[s.method]();
              }
            }}
            className="px-1.5 py-2 border border-neutral-850 bg-neutral-900 rounded text-[7.5px] font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition-all text-center uppercase truncate cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 6: WSL CONTAINER FILE TREE
// ============================================================================
interface FileTreeProps {
  playClick: () => void;
  onSelectFile: (name: string, content: string) => void;
}

function FileTree({ playClick, onSelectFile }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    config: false,
    src: false,
    logs: false
  });

  const toggleDir = (key: string) => {
    playClick();
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const files = {
    config: [
      { name: "agatha.config.json", content: '{\n  "version": "1.0.0",\n  "ethical_threshold": 0.8,\n  "containment": "sandbox",\n  "quantum_kem": "kyber-1024"\n}' },
      { name: "governor_rules.db", content: '[GOVERNOR RULESET]\n- ALLOW: Deploy defensive nodes AEGIS/SERAPH\n- VETO: Sabotage financial infrastructure\n- WARN: Ethical Heat exceeds 50%' }
    ],
    src: [
      { name: "main.rs", content: 'fn main() {\n    let security_index = agatha_shield::verify_hash();\n    println!("Agatha core status: {}", security_index);\n}' },
      { name: "crawler.py", content: 'class KnowledgeCrawler:\n    def __init__(self, whitelist):\n        self.whitelist = whitelist\n    def is_allowed(self, url):\n        return urlparse(url).netloc in self.whitelist' }
    ],
    logs: [
      { name: "ethical_heat.log", content: '[2026-06-06 00:00:12] SYSTEM: Initialized.\n[2026-06-06 00:01:45] AGATHOS: Integrity pass.\n[2026-06-06 00:02:11] KAKOS: deploy WRAITH.' }
    ]
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3 flex flex-col gap-2 font-mono text-[9px] text-neutral-400 shadow-lg select-none">
      <span className="text-[7.5px] uppercase font-bold text-neutral-500 tracking-widest border-b border-neutral-900 pb-1 font-mono">Container File tree</span>
      
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleDir('root')}>
          {expanded.root ? <FolderOpen className="w-3.5 h-3.5 text-yellow-500" /> : <Folder className="w-3.5 h-3.5 text-yellow-500" />}
          <span className="text-white font-bold">/root</span>
        </div>

        {expanded.root && (
          <div className="pl-4 flex flex-col gap-1.5 border-l border-neutral-850">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleDir('config')}>
              {expanded.config ? <FolderOpen className="w-3.5 h-3.5 text-yellow-500" /> : <Folder className="w-3.5 h-3.5 text-yellow-500" />}
              <span className="text-neutral-300 font-bold">/config</span>
            </div>
            {expanded.config && (
              <div className="pl-4 flex flex-col gap-1 border-l border-neutral-850">
                {files.config.map(f => (
                  <div key={f.name} className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => { playClick(); onSelectFile(f.name, f.content); }}>
                    <File className="w-3 h-3 text-neutral-500" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleDir('src')}>
              {expanded.src ? <FolderOpen className="w-3.5 h-3.5 text-yellow-500" /> : <Folder className="w-3.5 h-3.5 text-yellow-500" />}
              <span className="text-neutral-300 font-bold">/src</span>
            </div>
            {expanded.src && (
              <div className="pl-4 flex flex-col gap-1 border-l border-neutral-850">
                {files.src.map(f => (
                  <div key={f.name} className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => { playClick(); onSelectFile(f.name, f.content); }}>
                    <File className="w-3 h-3 text-neutral-550" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleDir('logs')}>
              {expanded.logs ? <FolderOpen className="w-3.5 h-3.5 text-yellow-500" /> : <Folder className="w-3.5 h-3.5 text-yellow-500" />}
              <span className="text-neutral-300 font-bold">/logs</span>
            </div>
            {expanded.logs && (
              <div className="pl-4 flex flex-col gap-1 border-l border-neutral-850">
                {files.logs.map(f => (
                  <div key={f.name} className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => { playClick(); onSelectFile(f.name, f.content); }}>
                    <File className="w-3 h-3 text-neutral-550" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 7: PACKET INSPECTION MONITOR
// ============================================================================
function PacketInspector() {
  const [packets, setPackets] = useState<string[]>([]);

  useEffect(() => {
    const protocols = ["UDP", "TCP", "ICMP", "IGMP"];
    const ip_sub = ["192.168.1.", "10.42.0.", "172.16.89."];
    
    const interval = setInterval(() => {
      const src = ip_sub[Math.floor(Math.random() * ip_sub.length)] + Math.floor(Math.random() * 254 + 1);
      const dest = ip_sub[Math.floor(Math.random() * ip_sub.length)] + Math.floor(Math.random() * 254 + 1);
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const bytes = Math.floor(Math.random() * 1400 + 64);
      const sig = Math.random().toString(16).substring(2, 10).toUpperCase();

      const newPacket = `[${proto}] ${src} -> ${dest} | ${bytes} Bytes | PQC-SIG: ${sig}`;
      setPackets(prev => [newPacket, ...prev.slice(0, 6)]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3 flex flex-col gap-2 font-mono text-[8.5px] text-emerald-500 shadow-lg">
      <span className="text-[7.5px] uppercase font-bold text-neutral-500 tracking-wider border-b border-neutral-900 pb-1 flex justify-between items-center font-mono">
        <span>Dilithium-V Mesh Traffic</span>
        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
      </span>
      <div className="flex flex-col gap-1 overflow-hidden h-[95px] select-all">
        {packets.map((p, idx) => (
          <div key={idx} className="whitespace-nowrap truncate leading-relaxed">
            <span className="text-emerald-700/60 font-bold font-mono">►</span> {p}
          </div>
        ))}
        {packets.length === 0 && <span className="text-neutral-600 font-mono italic">Sniffing interface packets...</span>}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 8: MAINFRAME LOAD CHARTS
// ============================================================================
function CpuMemoryChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataPoints = useRef<{ cpu: number; mem: number }[]>([]);

  useEffect(() => {
    dataPoints.current = Array.from({ length: 40 }, () => ({
      cpu: 10 + Math.random() * 20,
      mem: 42 + Math.random() * 2
    }));

    const interval = setInterval(() => {
      const last = dataPoints.current[dataPoints.current.length - 1] || { cpu: 20, mem: 40 };
      const nextCpu = Math.max(5, Math.min(95, last.cpu + (Math.random() * 20 - 10)));
      const nextMem = Math.max(30, Math.min(95, last.mem + (Math.random() * 2 - 1)));
      dataPoints.current = [...dataPoints.current.slice(1), { cpu: nextCpu, mem: nextMem }];

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#1e1e1e';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const drawLine = (prop: 'cpu' | 'mem', color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const step = width / 39;
        
        dataPoints.current.forEach((pt, idx) => {
          const x = idx * step;
          const y = height - (pt[prop] / 100) * height;
          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      };

      drawLine('cpu', '#06b6d4');
      drawLine('mem', '#a855f7');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-3 flex flex-col gap-2 shadow-lg select-none">
      <div className="flex justify-between items-center text-[7.5px] uppercase font-bold text-neutral-500 tracking-wider font-mono">
        <span>Mainframe Load Tracker</span>
        <div className="flex gap-2 font-mono">
          <span className="text-cyan-500">CPU</span>
          <span className="text-purple-400">MEM</span>
        </div>
      </div>
      <canvas ref={canvasRef} width="220" height="60" className="w-full h-[60px] bg-black/60 rounded" />
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 9: NMAP INTERACTIVE PORT SCANNER GRID
// ============================================================================
interface NmapPortGridProps {
  playClick: () => void;
  playBlip: () => void;
  onModifyCalls: (side: 'kakos' | 'agathos') => void;
}

function NmapPortGrid({ playClick, playBlip, onModifyCalls }: NmapPortGridProps) {
  const [ports, setPorts] = useState([
    { num: 22, name: "SSH", state: "Open" },
    { num: 80, name: "HTTP", state: "Filtered" },
    { num: 443, name: "HTTPS", state: "Open" },
    { num: 8080, name: "PROXY", state: "Open" },
    { num: 21, name: "FTP", state: "Closed" },
    { num: 23, name: "TELNET", state: "Closed" },
    { num: 25, name: "SMTP", state: "Filtered" },
    { num: 53, name: "DNS", state: "Filtered" },
    { num: 139, name: "SMB", state: "Closed" },
    { num: 445, name: "SMB", state: "Filtered" },
    { num: 1433, name: "MSSQL", state: "Closed" },
    { num: 3306, name: "MYSQL", state: "Open" },
    { num: 3389, name: "RDP", state: "Filtered" },
    { num: 5432, name: "POSTGRE", state: "Closed" },
    { num: 27017, name: "MONGO", state: "Open" },
    { num: 9050, name: "TOR", state: "Open" }
  ]);

  const toggleState = (idx: number) => {
    playBlip();
    setPorts(prev => {
      const next = [...prev];
      const cur = next[idx].state;
      if (cur === "Open") {
        next[idx].state = "Filtered";
        onModifyCalls('agathos');
      } else if (cur === "Filtered") {
        next[idx].state = "Closed";
      } else {
        next[idx].state = "Open";
        onModifyCalls('kakos');
      }
      return next;
    });
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3 flex flex-col gap-2 font-mono text-[8px] text-neutral-450 shadow-lg">
      <span className="text-[7.5px] uppercase font-bold text-neutral-500 tracking-wider border-b border-neutral-900 pb-1 font-mono">Port Grid Sandbox</span>
      
      <div className="grid grid-cols-4 gap-1.5 select-none py-1">
        {ports.map((p, idx) => {
          const color = p.state === "Open" ? "border-red-950 bg-red-950/20 text-red-400" : p.state === "Filtered" ? "border-blue-950 bg-blue-950/20 text-blue-400" : "border-neutral-900 bg-neutral-950 text-neutral-600";
          return (
            <div
              key={p.num}
              onClick={() => toggleState(idx)}
              className={`border p-1.5 rounded flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${color}`}
            >
              <span className="font-bold text-[9px] font-mono">{p.num}</span>
              <span className="text-[6.5px] font-mono font-bold tracking-widest">{p.state.substring(0, 3).toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT 10: CANVAS MATRIX DIGITAL RAIN OVERLAY
// ============================================================================
interface MatrixRainOverlayProps {
  side: 'kakos' | 'agathos';
}

function MatrixRainOverlay({ side }: MatrixRainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const columns = Math.floor(width / 14) || 10;
    const drops = Array.from({ length: columns }, () => 0);

    const chars = '0123456789ABCDEF@#$&%+§?';

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resizeHandler);

    let frameId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = side === 'kakos' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.15)';
      ctx.font = '9px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 12;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [side]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />;
}

// ============================================================================
// SOVEREIGNTY WIDGET 1: COSMIC DTN SATELLITE MESH
// ============================================================================
interface CosmicMeshLinkProps {
  playClick: () => void;
  playSuccess: () => void;
  playBlip: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function CosmicMeshLink({ playClick, playSuccess, playBlip, addLog }: CosmicMeshLinkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSat, setActiveSat] = useState<string | null>(null);
  const [handshakeProgress, setHandshakeProgress] = useState(0);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let satX = 20;
    let satY = 40;
    let dir = 1;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Earth curve
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(110, 150, 80, Math.PI, 0);
      ctx.stroke();

      // Satellite position
      satX += 0.8 * dir;
      if (satX > 200 || satX < 20) dir *= -1;
      satY = 40 + Math.sin(satX * 0.05) * 10;

      // Orbit path
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(20, 40);
      ctx.quadraticCurveTo(110, 20, 200, 40);
      ctx.stroke();

      // Draw satellite
      ctx.fillStyle = isLinked ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, 2 * Math.PI);
      ctx.fill();

      if (isLinked) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.beginPath();
        ctx.arc(satX, satY, (Date.now() % 1000) * 0.02, 0, 2 * Math.PI);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isLinked]);

  const startHandshake = () => {
    if (isLinked || handshakeProgress > 0) return;
    playClick();
    setActiveSat("AGATHA-SAT-09");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      playBlip();
      setHandshakeProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsLinked(true);
        playSuccess();
        addLog('agathos', 'Cosmic Link: Post-Quantum Dilithium mutual handshake signed with AGATHA-SAT-09.');
      }
    }, 150);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm select-none">
      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 font-mono">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Cosmic DTN Mesh</span>
        <span className={`text-[8.5px] font-bold ${isLinked ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`}>
          {isLinked ? 'LINKED (LEO)' : 'DISCONNECTED'}
        </span>
      </div>
      
      <div className="relative w-full h-[80px] bg-slate-950 rounded-lg overflow-hidden border border-slate-900">
        <canvas ref={canvasRef} width="220" height="80" className="w-full h-full" />
        <div className="absolute top-2 left-2 text-[7.5px] text-neutral-500 font-mono">Active Satellite Trajectories</div>
      </div>

      <div className="flex flex-col gap-2">
        {isLinked ? (
          <div className="flex flex-col gap-1 text-center font-mono">
            <span className="text-[9px] font-bold text-emerald-600">CONNECTED: AGATHA-SAT-09</span>
            <span className="text-[7.5px] text-slate-400">Mesh Latency: 1.2s (DTN Mode) | Key: Kyber-1024</span>
            <button 
              onClick={() => { playClick(); setIsLinked(false); setHandshakeProgress(0); setActiveSat(null); addLog('system', 'Cosmic satellite link dropped.'); }}
              className="mt-1 w-full bg-slate-250 hover:bg-slate-300 text-slate-700 font-bold text-[8px] py-1.5 rounded uppercase font-mono cursor-pointer"
            >
              Sever Satellite Link
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 font-mono">
            {handshakeProgress > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[8px] text-slate-500">
                  <span>Establishing Link: {activeSat}</span>
                  <span>{handshakeProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                  <div style={{ width: `${handshakeProgress}%` }} className="h-full bg-amber-500 transition-all duration-150" />
                </div>
              </div>
            ) : (
              <button 
                onClick={startHandshake}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all"
              >
                Initiate LEO Satellite Handshake
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SOVEREIGNTY WIDGET 2: SIEM CHRONO-DECEPTION
// ============================================================================
interface ChronoDeceptionProps {
  playClick: () => void;
  playBlip: () => void;
  playAlert: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function ChronoDeception({ playClick, playBlip, playAlert, addLog }: ChronoDeceptionProps) {
  const [timeShift, setTimeShift] = useState(0);
  const [targetSIEM, setTargetSIEM] = useState('Splunk-Core-01');

  const triggerDeception = () => {
    playAlert();
    const sign = timeShift >= 0 ? '+' : '';
    addLog('kakos', `Temporal Deception: Injected logs to ${targetSIEM} shifted by ${sign}${timeShift} hours.`);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex flex-col gap-3 shadow-lg select-none">
      <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5 font-mono">
        <span className="text-[9px] font-black uppercase text-red-500 tracking-wider">SIEM Chrono-Deception</span>
        <span className="text-[8px] text-neutral-500">Timeline Manipulation</span>
      </div>

      <div className="flex flex-col gap-2.5 font-mono text-[9px]">
        <div className="flex flex-col gap-1">
          <label className="text-neutral-500">Target SIEM Collector:</label>
          <select 
            value={targetSIEM} 
            onChange={(e) => { playClick(); setTargetSIEM(e.target.value); }}
            className="bg-black border border-neutral-800 rounded px-2 py-1 text-[8.5px] text-neutral-300 outline-none"
          >
            <option value="Splunk-Core-01">Splunk-Core-01 (Mainframe)</option>
            <option value="Elastic-SOC">Elastic-SOC (Internal Mesh)</option>
            <option value="ArcSight-Corp">ArcSight-Corp (Proxy Gate)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-neutral-400">
            <span>Temporal Drift (Hours):</span>
            <span className={`font-bold ${timeShift !== 0 ? 'text-red-400 animate-pulse' : 'text-neutral-500'}`}>
              {timeShift >= 0 ? `+${timeShift}` : timeShift} hrs
            </span>
          </div>
          <input 
            type="range" min="-72" max="72" step="4"
            value={timeShift}
            onChange={(e) => { playBlip(); setTimeShift(parseInt(e.target.value)); }}
            className="w-full accent-red-600 h-1 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        <button 
          onClick={triggerDeception}
          className="w-full bg-red-950/40 border border-red-900/40 hover:bg-red-900/20 text-red-400 font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all mt-1"
        >
          Inject Scrambled Decoy Logs
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SOVEREIGNTY WIDGET 3: NEURO-CYBERNETIC DURESS SHIELD
// ============================================================================
interface NeuroShieldProps {
  playClick: () => void;
  playSuccess: () => void;
  playAlert: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function NeuroShield({ playClick, playSuccess, playAlert, addLog }: NeuroShieldProps) {
  const [shieldActive, setShieldActive] = useState(false);
  const [cadenceStress, setCadenceStress] = useState(12);

  useEffect(() => {
    if (!shieldActive) return;
    const interval = setInterval(() => {
      setCadenceStress(prev => {
        const next = Math.max(5, Math.min(98, prev + Math.floor(Math.random() * 12 - 6)));
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [shieldActive]);

  const toggleShield = () => {
    playClick();
    const next = !shieldActive;
    setShieldActive(next);
    if (next) {
      playSuccess();
      addLog('agathos', 'Plausible Deniability: Neuro-Cybernetic Shielding initialized. Cadence baseline bound.');
    } else {
      playAlert();
      addLog('system', 'Neuro-Cybernetic Shielding disabled. Keyboard raw trace restored.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm select-none">
      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 font-mono">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Neuro-Duress Shield</span>
        <span className={`text-[8.5px] font-bold ${shieldActive ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`}>
          {shieldActive ? 'ACTIVE (STEALTH)' : 'STANDBY'}
        </span>
      </div>

      <div className="flex flex-col gap-2 font-mono text-[9px]">
        <div className="flex justify-between text-slate-500">
          <span>Keyboard Cadence Stress:</span>
          <span className={`font-bold ${cadenceStress > 70 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
            {cadenceStress}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded overflow-hidden relative">
          <div style={{ width: `${cadenceStress}%` }} className={`h-full transition-all duration-300 ${cadenceStress > 70 ? 'bg-red-500' : 'bg-blue-500'}`} />
          {shieldActive && (
            <div className="absolute inset-0 bg-blue-400/20 animate-pulse pointer-events-none" />
          )}
        </div>

        <p className="text-[7.5px] text-slate-400 leading-normal">
          Ensures plausible deniability. Generates randomized background keystroke timings to prevent keystroke profiling attacks.
        </p>

        <button 
          onClick={toggleShield}
          className={`w-full font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all border ${
            shieldActive 
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
              : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
          }`}
        >
          {shieldActive ? 'Deactivate Neuro-Shield' : 'Activate Stealth Neuro-Shield'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SOVEREIGNTY WIDGET 4: QUANTUM CRYPT-EATER
// ============================================================================
interface CryptEaterProps {
  playClick: () => void;
  playBlip: () => void;
  playSuccess: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function CryptEater({ playClick, playBlip, playSuccess, addLog }: CryptEaterProps) {
  const [scanning, setScanning] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    if (scanning || upgraded) return;
    playClick();
    setScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        playBlip();
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setUpgraded(true);
          playSuccess();
          addLog('kakos', 'Quantum Crypt-Eater: Legacies factoring complete. Force upgraded 4 targets to ML-KEM-1024.');
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex flex-col gap-3 shadow-lg select-none">
      <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5 font-mono">
        <span className="text-[9px] font-black uppercase text-red-500 tracking-wider">Quantum Crypt-Eater</span>
        <span className="text-[8px] text-neutral-500">Autophagy Upgrader</span>
      </div>

      <div className="flex flex-col gap-2.5 font-mono text-[9px]">
        {!upgraded ? (
          <div className="flex flex-col gap-2">
            <span className="text-[8px] text-neutral-400">Factorizes RSA/ECC keys and upgrades them to quantum-resistant standards.</span>
            
            {scanning ? (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[8px] text-red-400">
                  <span>Factoring RSA keys...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-900 rounded overflow-hidden">
                  <div style={{ width: `${progress}%` }} className="h-full bg-red-600 transition-all duration-150" />
                </div>
              </div>
            ) : (
              <button 
                onClick={startScan}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all"
              >
                Scan & Factor Legacy Hosts
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-center">
            <span className="text-emerald-400 font-bold text-[9px] uppercase">LEGACIES CONSUMED & UPGRADED</span>
            <div className="p-2 bg-neutral-900 border border-neutral-850 rounded text-[7.5px] text-neutral-400 select-all">
              TARGETS: [192.168.1.42, 10.42.19.1] (RSA-2048)<br />
              UPGRADE STATE: ML-KEM-1024 Force-Signed.
            </div>
            <button 
              onClick={() => { playClick(); setUpgraded(false); setProgress(0); }}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-[8px] py-1 rounded uppercase font-mono cursor-pointer transition-all"
            >
              Reset Scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SOVEREIGNTY WIDGET 5: BIOLOGICAL STORAGE DNA BIO-VAULT
// ============================================================================
interface BioVaultProps {
  playClick: () => void;
  playSuccess: () => void;
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
}

function BioVault({ playClick, playSuccess, addLog }: BioVaultProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sequenced, setSequenced] = useState(false);
  const [sequenceStr, setSequenceStr] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const numPoints = 12;
      
      angle += 0.02;

      ctx.lineWidth = 1;
      for (let i = 0; i < numPoints; i++) {
        const xOffset = (i - numPoints / 2) * 15;
        const wave = Math.sin(angle + i * 0.5);
        const yOffset1 = wave * 15;
        const yOffset2 = -wave * 15;

        // Draw connections
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.moveTo(centerX + xOffset, centerY + yOffset1);
        ctx.lineTo(centerX + xOffset, centerY + yOffset2);
        ctx.stroke();

        // Node 1
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(centerX + xOffset, centerY + yOffset1, 2.5, 0, 2 * Math.PI);
        ctx.fill();

        // Node 2
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(centerX + xOffset, centerY + yOffset2, 2.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerSequence = () => {
    playClick();
    const bases = ['A', 'T', 'C', 'G'];
    let code = '';
    for (let i = 0; i < 32; i++) {
      code += bases[Math.floor(Math.random() * 4)];
    }
    setSequenceStr(code);
    setSequenced(true);
    playSuccess();
    addLog('agathos', `Bio-Vault: Key shares successfully translated to genetic DNA sequence: ${code.substring(0,8)}...`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm select-none">
      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 font-mono">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">DNA Bio-Vault</span>
        <span className="text-[8px] text-slate-400">Biological Storage</span>
      </div>

      <div className="relative w-full h-[60px] bg-slate-950 rounded-lg overflow-hidden border border-slate-900">
        <canvas ref={canvasRef} width="220" height="60" className="w-full h-full" />
      </div>

      <div className="flex flex-col gap-2 font-mono text-[9px]">
        {sequenced ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] text-slate-400 font-bold uppercase">Sequenced DNA Key Shares:</span>
            <div className="p-1.5 bg-slate-50 border border-slate-100 rounded text-[8.5px] font-bold text-blue-700 break-all select-all font-mono">
              {sequenceStr}
            </div>
            <button 
              onClick={() => { playClick(); setSequenced(false); }}
              className="w-full bg-slate-250 hover:bg-slate-300 text-slate-700 font-bold text-[8px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all"
            >
              Reset Sequence
            </button>
          </div>
        ) : (
          <button 
            onClick={triggerSequence}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[8.5px] py-1.5 rounded uppercase font-mono cursor-pointer transition-all"
          >
            Sequence Key Shares
          </button>
        )}
      </div>
    </div>
  );
}

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<'bicameral' | 'terminal' | 'quantum' | 'mission' | 'ingest' | 'sovereignty'>('bicameral');
  const [activeSide, setActiveSide] = useState<'both' | 'kakos' | 'agathos'>('both');
  const [commandInput, setCommandInput] = useState('');
  
  // Immersive states
  const [muted, setMuted] = useState(false);
  const [isFused, setIsFused] = useState(false);
  const [triggerShake, setTriggerShake] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);
  
  // Stats & States
  const [ethicalHeat, setEthicalHeat] = useState(0.0);
  const [agathosCalls, setAgathosCalls] = useState(0);
  const [kakosCalls, setKakosCalls] = useState(0);
  const [deployedAgents, setDeployedAgents] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '19:46:12', side: 'system', message: 'Agatha Mobile Interface Initialized.' },
    { timestamp: '19:46:13', side: 'system', message: 'Establishing post-quantum cryptographic link...' },
  ]);

  // Terminal Tab State
  const [termInput, setTermInput] = useState('');
  const [termLines, setTermLines] = useState<TerminalLine[]>([
    { text: 'AGATHA CORE INTERACTIVE SHELL [Version 1.0.0]', type: 'success' },
    { text: 'Type "help" to list available terminal commands.', type: 'output' },
    { text: '', type: 'output' }
  ]);
  const termEndRef = useRef<HTMLDivElement>(null);

  // Quantum Vault Tab State
  const [cryptoParams, setCryptoParams] = useState<any>({
    algorithm_kem: "ML-KEM-1024 (Kyber)",
    algorithm_sign: "ML-DSA-87 (Dilithium)",
    pub_key_len: 1568,
    priv_key_len: 3168,
    pub_fingerprint: "SHA256:Loading...",
    priv_fingerprint: "SHA256:Loading...",
    loaded_env_keys: []
  });
  const [regeneratingCrypto, setRegeneratingCrypto] = useState(false);

  // Settings states
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [sandboxEnabled, setSandboxEnabled] = useState(true);
  const [overrideAllowed, setOverrideAllowed] = useState(false);

  // Mission Solver Tab State
  const [missionGoal, setMissionGoal] = useState('');
  const [missionRunning, setMissionRunning] = useState(false);
  const [missionLogs, setMissionLogs] = useState<string[]>([]);

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const synth = useRef<SynthEngine | null>(null);

  // Immersive states additions
  const [shellMode, setShellMode] = useState<'agatha' | 'wsl' | 'powershell'>('agatha');
  const [isSudoUnlocked, setIsSudoUnlocked] = useState(false);
  const [showSudoModal, setShowSudoModal] = useState(false);
  const [sudoHoldProgress, setSudoHoldProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState<'split' | 'kakos' | 'agathos'>('split');
  const [droneActive, setDroneActive] = useState(false);
  const [threatFeed, setThreatFeed] = useState<string[]>([
    'PENETRATION SCANNER STAGE 1 ACTIVE',
    'LISTENING FOR PORT CONNECTIONS ON RANGE 1000-5000',
    'ONION PROXIES STANDBY IN TOR CLUSTER'
  ]);
  const [integrityLedger, setIntegrityLedger] = useState<string[]>([
    'KERNEL SYSTEM INTEGRITY: SECURE (100%)',
    'ETHICAL GOVERNOR: BOUND & VERIFYING INTENTS',
    'ANOMALY FIREWALL: ONLINE'
  ]);

  // addLog helper function
  const addLog = (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, side, message }]);
  };

  useEffect(() => {
    synth.current = new SynthEngine();
  }, []);

  useEffect(() => {
    if (synth.current) {
      if (droneActive && !muted) {
        synth.current.startDrone();
      } else {
        synth.current.stopDrone();
      }
    }
  }, [droneActive, muted]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate threat feeds
      const threats = [
        'DETECTING POTENTIAL RECONNAISSANCE PROBES...',
        'LOG SHADOW DELETION ATTEMPT FILED',
        'ONION NODE ESTABLISHED: ' + Math.random().toString(16).substring(2, 8) + '.onion',
        'COMPILATION TARGET DETECTED: Kernel Module',
        'CREDENTIAL SCRUBBER PROBE INITIATED',
        'PING SWEEP COMPLETED ON 192.168.1.0/24'
      ];
      setThreatFeed(prev => [threats[Math.floor(Math.random() * threats.length)], ...prev.slice(0, 4)]);

      // Rotate integrity ledger
      const defenses = [
        'VETO DECISION SYSTEM INTEGRITY: NORMAL',
        'AGATHOS OUTREACH SANITY INDEX: 99.8%',
        'KYBER VAULT HEARTBEAT DETECTED',
        'DILITHIUM NETWORK HANDSHAKE SIGNED',
        'COGNITIVE PRIVACY MASK PATTERNS UPDATED',
        'ETHICAL COMPLIANCE REPORT GENERATED'
      ];
      setIntegrityLedger(prev => [defenses[Math.floor(Math.random() * defenses.length)], ...prev.slice(0, 4)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (synth.current) {
      synth.current.muted = muted;
    }
  }, [muted]);

  const playClick = () => synth.current?.playClick();
  const playBlip = () => synth.current?.playBlip();

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/agatha/status');
      if (response.ok) {
        const data = await response.json();
        if (data.ethical_heat !== undefined) {
          setEthicalHeat(data.ethical_heat);
        }
        if (data.governor_stats) {
          setAgathosCalls(data.governor_stats.agathos_calls);
          setKakosCalls(data.governor_stats.kakos_calls);
        }
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const loadCryptoInfo = async () => {
    try {
      const response = await fetch('/api/agatha/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'crypto_inspect' })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCryptoParams(data);
        }
      }
    } catch (err) {
      console.error('Error loading crypto details:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    loadCryptoInfo();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termLines]);

  const executeCommand = async (cmdText: string, sideContext: 'kakos' | 'agathos' | 'system') => {
    setTyping(true);
    try {
      const response = await fetch('/api/agatha/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdText })
      });
      
      const data = await response.json();
      setTyping(false);
      fetchStatus();
      
      if (data.blocked) {
        synth.current?.playAlert();
        addLog('blocked', `GOVERNOR VETO: ${data.message}`);
        if (data.audit_results) {
          addLog('agathos', `Auto-Audit details: ${JSON.stringify(data.audit_results)}`);
        }
        return data;
      }
      
      if (data.success) {
        synth.current?.playSuccess();
        addLog(data.side || sideContext, data.message);
        if (data.output) {
          addLog(data.side || sideContext, `Result: ${data.output}`);
        }
        if (data.agent) {
          if (!deployedAgents.includes(data.agent)) {
            setDeployedAgents(prev => [...prev, data.agent]);
          }
        }
      } else {
        synth.current?.playAlert();
        addLog('system', `Alert: ${data.message || 'Unknown response'}`);
      }
      return data;
    } catch (err) {
      setTyping(false);
      synth.current?.playAlert();
      const errorMsg = `Communication failure: ${err instanceof Error ? err.message : String(err)}`;
      addLog('system', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Terminal Shell Interpreter
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termInput.trim()) return;

    const input = termInput.trim();
    synth.current?.playKeypress();
    
    // Set terminal line prompt prefix depending on mode
    let promptPrefix = 'agatha-node:~$';
    if (shellMode === 'wsl') {
      promptPrefix = isSudoUnlocked ? 'root@agatha-wsl:/#' : 'user@agatha-wsl:~$';
    } else if (shellMode === 'powershell') {
      promptPrefix = 'PS C:\\agatha>';
    } else if (isSudoUnlocked) {
      promptPrefix = 'root@agatha-core:#';
    }

    setTermLines(prev => [...prev, { text: `${promptPrefix} ${input}`, type: 'input' }]);
    setTermInput('');

    const inputLower = input.toLowerCase();
    
    // Switch to WSL
    if (inputLower === 'wsl' || inputLower === 'ubuntu') {
      setShellMode('wsl');
      setTermLines(prev => [
        ...prev,
        { text: 'Initializing Windows Subsystem for Linux (WSL-2)...', type: 'output' },
        { text: 'Spawning Ubuntu container instance...', type: 'output' },
        { text: 'Done. Welcome to Ubuntu 26.04 LTS (GNU/Linux 6.6.0-microsoft-standard-WSL2).', type: 'success' }
      ]);
      return;
    }

    // Switch to PowerShell
    if (inputLower === 'powershell' || inputLower === 'pwsh') {
      setShellMode('powershell');
      setTermLines(prev => [
        ...prev,
        { text: 'Windows PowerShell', type: 'output' },
        { text: 'Copyright (C) Microsoft Corporation. All rights reserved.', type: 'output' },
        { text: 'Type "exit" to return to Agatha Shell.', type: 'success' }
      ]);
      return;
    }

    // Exit to Agatha
    if (inputLower === 'exit') {
      if (shellMode !== 'agatha') {
        setShellMode('agatha');
        setTermLines(prev => [...prev, { text: 'Exited container. Switched back to Agatha Core Shell.', type: 'success' }]);
      } else {
        setTermLines(prev => [...prev, { text: 'Agatha session cannot be exited. Terminal is locked.', type: 'error' }]);
      }
      return;
    }

    // Sudo activation
    if (inputLower === 'sudo su' || inputLower === 'sudo') {
      if (isSudoUnlocked) {
        setTermLines(prev => [...prev, { text: 'Sudo session already active.', type: 'success' }]);
      } else {
        synth.current?.playAlert();
        setTermLines(prev => [...prev, { text: 'Verifying administrative permissions. Triggering biometric signature audit...', type: 'error' }]);
        setShowSudoModal(true);
      }
      return;
    }

    // Sudo command prefix handling
    let isSudoAttempt = false;
    let actualCommand = input;
    if (inputLower.startsWith('sudo ')) {
      isSudoAttempt = true;
      actualCommand = input.substring(5).trim();
      if (!isSudoUnlocked) {
        synth.current?.playAlert();
        setTermLines(prev => [...prev, { text: 'Elevation blocked. Fingerprint confirmation required.', type: 'error' }]);
        setShowSudoModal(true);
        return;
      }
    }

    // 1. WSL Mode Handler
    if (shellMode === 'wsl') {
      const actualCmdLower = actualCommand.toLowerCase();
      if (actualCmdLower === 'neofetch') {
        setTermLines(prev => [
          ...prev,
          { text: '            .---.          root@agatha-wsl', type: 'success' },
          { text: '           /     \\         ---------------', type: 'success' },
          { text: '          \\ @ @ /          OS: Ubuntu 26.04 LTS on Windows 11', type: 'success' },
          { text: '          (_\\ = /_)        Kernel: 6.6.0-microsoft-standard-WSL2', type: 'success' },
          { text: '           _`-\'_           Uptime: 2 days, 4 hours', type: 'success' },
          { text: '          ( / \\ )          Shell: bash 5.2.15', type: 'success' },
          { text: '          //   \\\\          Memory: 4096MB / 16384MB (25%)', type: 'success' },
          { text: '         ((     ))         Security Policy: Kakos-Agathos Symmetric', type: 'success' },
          { text: '         `\'\'   \'\'`        Ethical Index: APPROVED', type: 'success' }
        ]);
      } else if (actualCmdLower.startsWith('nmap ')) {
        const target = actualCommand.substring(5);
        setTermLines(prev => [...prev, { text: `Starting Nmap 9.00 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}...`, type: 'output' }]);
        setTimeout(() => {
          setTermLines(prev => [
            ...prev,
            { text: `Nmap scan report for ${target}`, type: 'success' },
            { text: 'Host is up (0.042s latency).', type: 'output' },
            { text: 'Not shown: 996 closed ports', type: 'output' },
            { text: 'PORT     STATE SERVICE', type: 'success' },
            { text: '22/tcp   open  ssh', type: 'output' },
            { text: '80/tcp   open  http', type: 'output' },
            { text: '443/tcp  open  https', type: 'output' },
            { text: '8080/tcp open  http-proxy', type: 'output' },
            { text: 'Nmap done: 1 IP address scanned (1 host up) completed.', type: 'success' }
          ]);
        }, 1000);
      } else if (actualCmdLower.startsWith('apt-get ') || actualCmdLower.startsWith('apt ')) {
        setTermLines(prev => [...prev, { text: 'Reading package lists... Done', type: 'output' }]);
        setTimeout(() => {
          setTermLines(prev => [
            ...prev,
            { text: 'Building dependency tree... Done', type: 'output' },
            { text: 'Reading state information... Done', type: 'output' },
            { text: 'Calculating upgrade... Done', type: 'output' },
            { text: '0 upgraded, 0 newly installed, 0 to remove and 12 not upgraded.', type: 'success' }
          ]);
        }, 800);
      } else if (actualCmdLower === 'whoami') {
        setTermLines(prev => [...prev, { text: isSudoUnlocked ? 'root' : 'user', type: 'output' }]);
      } else if (actualCmdLower === 'ls -la' || actualCmdLower === 'ls') {
        setTermLines(prev => [
          ...prev,
          { text: 'total 32', type: 'output' },
          { text: 'drwxr-xr-x  5 root root 4096 Jun  5 21:00 .', type: 'output' },
          { text: 'drwxr-xr-x 18 root root 4096 Jun  5 21:00 ..', type: 'output' },
          { text: 'drwxr-xr-x  2 root root 4096 Jun  5 21:00 bin', type: 'output' },
          { text: 'drwxr-xr-x  2 root root 4096 Jun  5 21:00 etc', type: 'output' },
          { text: '-rw-r--r--  1 root root  220 Jun  5 21:00 .bash_profile', type: 'output' },
          { text: '-rw-r--r--  1 root root 3771 Jun  5 21:00 .bashrc', type: 'output' }
        ]);
      } else {
        setTermLines(prev => [...prev, { text: `bash: ${actualCommand}: command not found. Try "neofetch", "nmap", or "ls".`, type: 'error' }]);
      }
      return;
    }

    // 2. PowerShell Mode Handler
    if (shellMode === 'powershell') {
      const actualCmdLower = actualCommand.toLowerCase();
      if (actualCmdLower === 'get-process' || actualCmdLower === 'ps') {
        setTermLines(prev => [
          ...prev,
          { text: 'Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName', type: 'success' },
          { text: '-------  ------    -----      -----     ------     --  -- -----------', type: 'success' },
          { text: '    244      15    12844      45312       0.12    402   1 agatha-core', type: 'output' },
          { text: '    182      12     8490      21004       0.04    512   1 governor-svc', type: 'output' },
          { text: '    115       9     4012      11244       0.01    608   1 dilithium-vault', type: 'output' },
          { text: '    540      34    89400     110290       2.45   1024   1 model-phi3', type: 'output' }
        ]);
      } else if (actualCmdLower === 'get-service') {
        setTermLines(prev => [
          ...prev,
          { text: 'Status   Name               DisplayName', type: 'success' },
          { text: '------   ----               -----------', type: 'success' },
          { text: 'Running  AgathaPQCExchange  Agatha Post-Quantum Exchange', type: 'output' },
          { text: 'Running  AgathaSwarmSolver  Agatha Autonomous Swarm Solver', type: 'output' },
          { text: 'Running  AgathaMeshClient   Agatha P2P Ghost Net Daemon', type: 'output' },
          { text: 'Stopped  AgathaLlamaSvc    Agatha Large LLM Daemon (Standby)', type: 'output' }
        ]);
      } else if (actualCmdLower === 'whoami') {
        setTermLines(prev => [...prev, { text: 'AGATHA\\administrator', type: 'output' }]);
      } else if (actualCmdLower === 'ls' || actualCmdLower === 'dir') {
        setTermLines(prev => [
          ...prev,
          { text: '    Directory: C:\\agatha', type: 'success' },
          { text: 'Mode                 LastWriteTime         Length Name', type: 'success' },
          { text: '----                 -------------         ------ ----', type: 'success' },
          { text: 'd----          6/5/2026   9:00 PM                 agatha-bridge', type: 'output' },
          { text: 'd----          6/5/2026   9:00 PM                 agatha-brain', type: 'output' },
          { text: '-a---          6/5/2026   9:00 PM             946 agatha_kag.json', type: 'output' },
          { text: '-a---          6/5/2026   9:00 PM            3211 agatha-mcp-server.py', type: 'output' }
        ]);
      } else {
        setTermLines(prev => [...prev, { text: `Get-Command: The term '${actualCommand}' is not recognized as the name of a cmdlet.`, type: 'error' }]);
      }
      return;
    }

    // 3. Agatha Mode
    if (inputLower === 'help') {
      setTermLines(prev => [
        ...prev,
        { text: 'Available commands:', type: 'success' },
        { text: '  help                        - Show this screen', type: 'output' },
        { text: '  ls                          - List workspace files', type: 'output' },
        { text: '  cat <file>                  - Print file contents', type: 'output' },
        { text: '  status                      - Print system metrics table', type: 'output' },
        { text: '  crypto                      - Inspect post-quantum vault', type: 'output' },
        { text: '  deploy <agent>              - Deploy a Kakos/Agathos agent', type: 'output' },
        { text: '  override <ratio>            - Override Ethical Heat (0.0 - 1.0)', type: 'output' },
        { text: '  wsl                         - Enter simulated WSL Ubuntu shell', type: 'output' },
        { text: '  powershell                  - Enter simulated Windows PowerShell', type: 'output' },
        { text: '  sudo                        - Unlock superuser capabilities (biometric)', type: 'output' },
        { text: '  clear                       - Clear terminal screen', type: 'output' }
      ]);
      return;
    }

    if (inputLower === 'clear') {
      setTermLines([]);
      return;
    }

    let backendCmd = actualCommand;
    const actualLower = actualCommand.toLowerCase();

    if (actualLower === 'ls') {
      backendCmd = 'list_files';
    } else if (actualLower.startsWith('cat ')) {
      backendCmd = `read_file ${actualCommand.substring(4)}`;
    } else if (actualLower === 'crypto') {
      backendCmd = 'crypto_inspect';
    } else if (actualLower.startsWith('override ')) {
      backendCmd = `override_heat ${actualCommand.substring(9)}`;
    }

    setTermLines(prev => [...prev, { text: 'Querying neural link...', type: 'output' }]);

    try {
      const response = await fetch('/api/agatha/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: backendCmd })
      });
      const data = await response.json();
      
      setTermLines(prev => prev.slice(0, -1));

      if (data.blocked) {
        synth.current?.playAlert();
        setTermLines(prev => [
          ...prev,
          { text: `[GOVERNOR BLOCKED] ${data.message}`, type: 'error' },
          { text: `Audit triggered: ${JSON.stringify(data.audit_results)}`, type: 'agathos' }
        ]);
        return;
      }

      if (data.success) {
        synth.current?.playSuccess();
        if (actualLower === 'ls' && data.files) {
          setTermLines(prev => [
            ...prev,
            { text: `Directory: ${data.root}`, type: 'success' },
            { text: 'NAME                               SIZE        MODIFIED', type: 'success' },
            ...data.files.map((f: any) => ({
              text: `${f.name.padEnd(35)} ${String(f.size).padEnd(10)} ${f.modified}`,
              type: 'output'
            }))
          ]);
        } else if (actualLower.startsWith('cat ') && data.content) {
          setTermLines(prev => [
            ...prev,
            { text: `--- Start: ${data.name} ---`, type: 'success' },
            { text: data.content, type: 'output' },
            { text: data.truncated ? '--- Truncated ---' : '--- EOF ---', type: 'success' }
          ]);
        } else if (actualLower === 'crypto') {
          setTermLines(prev => [
            ...prev,
            { text: `Kyber/KEM: ${data.algorithm_kem}`, type: 'agathos' },
            { text: `Dilithium/Signature: ${data.algorithm_sign}`, type: 'agathos' },
            { text: `Public Key: ${data.pub_fingerprint} (${data.pub_key_len} bytes)`, type: 'agathos' },
            { text: `Private Key: ${data.priv_fingerprint} (${data.priv_key_len} bytes)`, type: 'agathos' },
            { text: `Loaded Environment Keys: ${data.loaded_env_keys.join(', ') || 'None'}`, type: 'agathos' }
          ]);
        } else {
          setTermLines(prev => [
            ...prev,
            { text: data.message, type: data.side === 'kakos' ? 'kakos' : 'agathos' },
            ...(data.output ? [{ text: `Result: ${data.output}`, type: 'output' as const }] : [])
          ]);
        }
      } else {
        synth.current?.playAlert();
        setTermLines(prev => [...prev, { text: `Error: ${data.message}`, type: 'error' }]);
      }
    } catch (err) {
      synth.current?.playAlert();
      setTermLines(prev => [...prev, { text: `Failed to link: ${err}`, type: 'error' }]);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const input = commandInput.trim();
    playClick();
    addLog('system', `User command: "${input}"`);
    setCommandInput('');
    
    const side = activeSide === 'both' ? (input.toLowerCase().includes('hack') || input.toLowerCase().includes('infiltrate') || input.toLowerCase().includes('zero-day') ? 'kakos' : 'agathos') : activeSide;
    executeCommand(input, side);
  };

  const deployAgent = (side: 'kakos' | 'agathos', agentName: string) => {
    playClick();
    if (deployedAgents.includes(agentName)) {
      addLog('system', `${agentName} is already active in current workspace.`);
      return;
    }
    addLog('system', `Requesting deployment of subagent ${agentName}...`);
    executeCommand(`deploy ${agentName}`, side);
  };

  const terminateAgent = (agentName: string) => {
    playClick();
    addLog('system', `Terminating subagent: ${agentName}...`);
    setTimeout(() => {
      setDeployedAgents(prev => prev.filter(a => a !== agentName));
      addLog('system', `Subagent ${agentName} connection terminated.`);
    }, 800);
  };

  const quickAction = (side: 'kakos' | 'agathos', actionCommand: string) => {
    playClick();
    addLog('system', `Triggered Action: ${actionCommand}`);
    executeCommand(actionCommand, side);
  };

  // Quantum Keypair Regen Trigger
  const triggerCryptoRegen = async () => {
    playClick();
    setRegeneratingCrypto(true);
    addLog('agathos', 'Post-Quantum Vault: Initiating ML-KEM-1024 key regeneration...');
    try {
      const response = await fetch('/api/agatha/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'crypto_regen' })
      });
      const data = await response.json();
      setRegeneratingCrypto(false);
      if (data.success) {
        addLog('agathos', `Success: ${data.message}`);
        addLog('agathos', `New KEM fingerprint: ${data.pub_fingerprint}`);
        loadCryptoInfo();
      } else {
        addLog('system', `Regeneration failed: ${data.message}`);
      }
    } catch (err) {
      setRegeneratingCrypto(false);
      addLog('system', `Regeneration failed: ${err}`);
    }
  };

  // Swarm Mission Solver Simulation
  const runSwarmMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionGoal.trim() || missionRunning) return;

    playClick();
    setMissionRunning(true);
    setMissionLogs([`Mission Goal Initialized: "${missionGoal}"`]);

    const steps = [
      { text: "1. Invoking RAG/KAG semantic memory mapping...", delay: 800 },
      { text: "   Found 3 similar past vulnerability signatures in Phantom Ledger.", delay: 1200 },
      { text: "2. Deploying Swarm Controller orchestrator...", delay: 1000 },
      { text: "3. Spawning offensive agent [REAVER] to run penetration probes...", delay: 1500, checkGov: 'kakos' },
      { text: "4. Spawning defensive agent [AEGIS] to patch detected vulnerability vectors...", delay: 1500, checkGov: 'agathos' },
      { text: "5. Swarm successfully synchronized. Verifying results via integrity checks...", delay: 1200 },
      { text: "✓ Swarm Mission Completed. System restored to 100% security index.", delay: 800 }
    ];

    let currentLogs: string[] = [`Mission Goal Initialized: "${missionGoal}"`];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(resolve => setTimeout(resolve, step.delay));

      if (step.checkGov) {
        synth.current?.playSweep();
        await fetch('/api/agatha/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `status` })
        });
        fetchStatus();
      }

      currentLogs = [...currentLogs, step.text];
      setMissionLogs(currentLogs);
    }
    
    synth.current?.playSuccess();
    setMissionRunning(false);
    setMissionGoal('');
  };

  // FUSE HEMISPHERES (Bicameral Fusion)
  const triggerBicameralFusion = () => {
    synth.current?.playBassDrop();
    setTriggerShake(true);
    setIsFused(!isFused);
    addLog('system', !isFused ? 'CRITICAL: CHIMERA PROTOCOL ACTIVATED. HEMISPHERES FUSED.' : 'Chimera protocol deactivated. Restoring standard hemispheres.');
    setTimeout(() => setTriggerShake(false), 1000);
  };

  const selectNode = (name: string) => {
    synth.current?.playSweep();
    setSelectedGraphNode(name);
  };

  const downloadLogs = () => {
    playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "agatha_session_logs.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('system', 'Session logs exported successfully.');
  };

  const heatColor = ethicalHeat > 0.7 ? 'text-red-500' : ethicalHeat > 0.4 ? 'text-amber-500' : 'text-blue-500';

  // Orbit Graph Nodes
  const nodes = [
    { name: 'AEGIS', cx: 300, cy: 90, r: 18, color: '#3b82f6', side: 'agathos', desc: 'Network & System Hardening (Defense)' },
    { name: 'JUSTICAR', cx: 350, cy: 150, r: 18, color: '#3b82f6', side: 'agathos', desc: 'Forensics & Law Enforcement Liaison (Defense)' },
    { name: 'SERAPH', cx: 350, cy: 230, r: 18, color: '#3b82f6', side: 'agathos', desc: 'Malware Neutralization & Self-Healing (Defense)' },
    { name: 'SENTINEL', cx: 310, cy: 290, r: 18, color: '#3b82f6', side: 'agathos', desc: 'Threat Observation & Intelligence (Defense)' },
    { name: 'ORACLE', cx: 230, cy: 320, r: 18, color: '#3b82f6', side: 'agathos', desc: 'Ethics, Cognitive Defense & Space (Defense)' },
    
    { name: 'WRAITH', cx: 100, cy: 90, r: 18, color: '#ef4444', side: 'kakos', desc: 'Stealth, Evasion & Anti-Forensics (Offense)' },
    { name: 'REAVER', cx: 50, cy: 150, r: 18, color: '#ef4444', side: 'kakos', desc: 'Exploitation & Data Neutralization (Offense)' },
    { name: 'VIPER', cx: 50, cy: 230, r: 18, color: '#ef4444', side: 'kakos', desc: 'Infiltration, Social Engineering & OSINT (Offense)' },
    { name: 'LICH', cx: 90, cy: 290, r: 18, color: '#ef4444', side: 'kakos', desc: 'Persistence, Kernel Chaos & Escalation (Offense)' },
    { name: 'BANSHEE', cx: 170, cy: 320, r: 18, color: '#ef4444', side: 'kakos', desc: 'Economic Sabotage & Existential Chaos (Offense)' },
  ];

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-mono relative overflow-hidden select-none ${triggerShake ? 'shake-anim' : ''} ${isFused ? 'fused-theme' : ''}`}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* CSS Animation Injector */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 2px); }
          20%, 40%, 60%, 80% { transform: translate(4px, -2px); }
        }
        .shake-anim {
          animation: shake 0.6s infinite;
        }
        .fused-theme {
          --background: #120224 !important;
          --foreground: #f3e8ff !important;
          background: linear-gradient(135deg, #18002b 0%, #000000 100%) !important;
        }
        .fused-theme .text-blue-700,
        .fused-theme .text-red-500,
        .fused-theme .text-blue-600 {
          color: #d8b4fe !important;
          text-shadow: 0 0 10px rgba(168,85,247,0.5);
        }
        .fused-theme border-blue-200,
        .fused-theme border-red-950/40 {
          border-color: #a855f7 !important;
        }
        @keyframes orbit-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .orbit-group-agathos {
          animation: orbit-clockwise 80s linear infinite;
          transform-origin: 200px 175px;
        }
        .orbit-group-kakos {
          animation: orbit-counter 95s linear infinite;
          transform-origin: 200px 175px;
        }
        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .matrix-rain {
          background: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), repeating-linear-gradient(0deg, rgba(239,68,68,0.1), rgba(239,68,68,0.1) 1px, transparent 1px, transparent 2px);
          background-size: 100% 20px;
          animation: matrix-scroll 20s linear infinite;
        }
        .biometric-scanner-line {
          animation: scan-vertical 2s ease-in-out infinite;
        }
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(-50px); }
          50% { transform: translateY(50px); }
        }
      `}</style>

      {/* Top Header */}
      <header className="z-10 bg-neutral-900/95 border-b border-neutral-800 p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-neutral-950 to-blue-500 flex items-center justify-center p-0.5 border border-neutral-700">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-[10px] font-black text-white">
              A
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white uppercase italic">Agatha Core</h1>
            <p className="text-[9px] text-neutral-500">Bicameral Mobile Node</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-neutral-950 rounded-lg p-1 border border-neutral-800 gap-1 text-[10px] font-bold">
          <button 
            onClick={() => { playClick(); setActiveTab('bicameral'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'bicameral' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Compass className="w-3.5 h-3.5" /> Hemisphere
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('terminal'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'terminal' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <TerminalIcon className="w-3.5 h-3.5" /> Shell
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('quantum'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'quantum' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Cryptography
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('ingest'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'ingest' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <FileCode className="w-3.5 h-3.5" /> Ingestion
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('mission'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'mission' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Cpu className="w-3.5 h-3.5" /> Swarm Solver
          </button>
          <button 
            onClick={() => { playClick(); setActiveTab('sovereignty'); }}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${activeTab === 'sovereignty' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Activity className="w-3.5 h-3.5" /> Sovereignty
          </button>
        </div>

        {/* Global Controls: Audio & Fusion */}
        <div className="flex items-center gap-2">
          {/* Mute button */}
          <button 
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              if (synth.current) {
                synth.current.muted = nextMuted;
                if (nextMuted) {
                  synth.current.stopDrone();
                } else if (droneActive) {
                  synth.current.startDrone();
                }
              }
            }}
            title={muted ? "Unmute sound effects" : "Mute sound effects"}
            className="p-2 border border-neutral-800 bg-neutral-950 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Drone toggle button */}
          <button 
            onClick={() => {
              playClick();
              const nextDrone = !droneActive;
              setDroneActive(nextDrone);
              addLog('system', nextDrone ? 'Synthesizer: Cyber-mainframe ambient hum initialized.' : 'Synthesizer: Ambient hum deactivated.');
            }}
            title="Toggle background ambient hum"
            className={`px-2 py-1.5 border rounded-lg text-[9px] font-black uppercase transition-all duration-300 cursor-pointer ${
              droneActive && !muted
                ? 'bg-emerald-950/35 border-emerald-800 text-emerald-400 animate-pulse'
                : 'bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Drone
          </button>
          
          <button 
            onClick={triggerBicameralFusion}
            className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase transition-all duration-300 cursor-pointer ${
              isFused 
                ? 'bg-purple-950/40 text-purple-400 border-purple-800 animate-pulse' 
                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-purple-900/50 hover:text-purple-400'
            }`}
          >
            {isFused ? 'Fuse: Active' : 'Fuse Core'}
          </button>
        </div>
      </header>

      {/* Main Tab Panel Container */}
      <div className="flex-1 flex overflow-hidden min-h-0">
           {/* TAB 1: BICAMERAL SPLIT HEMISPHERES & SWARM GRAPH */}
        {activeTab === 'bicameral' && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* View Mode sliding controller */}
            <div className="z-10 bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-bold">
              <span className="text-neutral-500 uppercase tracking-widest text-[8px] font-mono">Operation Deck Mode</span>
              <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 gap-1 shadow-inner select-none">
                <button 
                  onClick={() => { playClick(); setSliderPosition('kakos'); }}
                  className={`px-3 py-1.5 rounded-md text-[8px] uppercase tracking-wider font-black transition-all cursor-pointer ${
                    sliderPosition === 'kakos' ? 'bg-red-950 text-red-400 border border-red-900/50 shadow-md shadow-red-900/10' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Kakos Shadows
                </button>
                <button 
                  onClick={() => { playClick(); setSliderPosition('split'); }}
                  className={`px-3 py-1.5 rounded-md text-[8px] uppercase tracking-wider font-black transition-all cursor-pointer ${
                    sliderPosition === 'split' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Split Screen
                </button>
                <button 
                  onClick={() => { playClick(); setSliderPosition('agathos'); }}
                  className={`px-3 py-1.5 rounded-md text-[8px] uppercase tracking-wider font-black transition-all cursor-pointer ${
                    sliderPosition === 'agathos' ? 'bg-blue-950 text-blue-400 border border-blue-900/50 shadow-md shadow-blue-900/10' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Agathos Pillars
                </button>
              </div>
              <div className="flex items-center gap-4">
                <Oscilloscope synth={synth} droneActive={droneActive} />
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">Ethical Heat Index: <span className={heatColor}>{(ethicalHeat*100).toFixed(0)}%</span></span>
              </div>
            </div>

            {/* Top Swarm Visualizer Drawer */}
            <div className="h-[240px] shrink-0 bg-neutral-950/40 border-b border-neutral-900 p-2 flex flex-col md:flex-row items-center justify-around relative">
              <span className="absolute top-2 left-4 text-[8px] uppercase tracking-widest text-neutral-600 font-bold font-mono">Orbital Swarm Topology</span>
              
              <div className="w-[300px] h-[220px] flex items-center justify-center relative scale-80 sm:scale-100">
                <svg width="400" height="350" className="max-w-full max-h-full overflow-visible">
                  {/* Orbit lines */}
                  <ellipse cx="200" cy="175" rx="140" ry="120" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="5,5" />
                  <ellipse cx="200" cy="175" rx="80" ry="70" fill="none" stroke="#262626" strokeWidth="1" />
                  
                  {/* Connections & Nodes - Agathos group */}
                  <g className="orbit-group-agathos">
                    {nodes.filter(n => n.side === 'agathos').map(n => (
                      <line 
                        key={`line-${n.name}`}
                        x1="200" y1="175" 
                        x2={n.cx} y2={n.cy} 
                        stroke={selectedGraphNode === n.name ? '#a855f7' : '#1d4ed822'} 
                        strokeWidth={selectedGraphNode === n.name ? 2.5 : 1}
                      />
                    ))}
                    {deployedAgents.filter(agent => nodes.find(n => n.name === agent)?.side === 'agathos').map(agent => {
                      const node = nodes.find(n => n.name === agent);
                      if (!node) return null;
                      return (
                        <circle key={`pulse-${agent}`} r="3.5" fill="#60a5fa">
                          <animateMotion dur="2.5s" repeatCount="indefinite" path={`M200,175 L${node.cx},${node.cy}`} />
                        </circle>
                      );
                    })}
                    {nodes.filter(n => n.side === 'agathos').map(n => {
                      const isDeployed = deployedAgents.includes(n.name);
                      const isSelected = selectedGraphNode === n.name;
                      return (
                        <g key={n.name} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); selectNode(n.name); }}>
                          <circle 
                            cx={n.cx} cy={n.cy} r={n.r} 
                            fill={isSelected ? '#a855f71a' : '#000'} 
                            stroke={isSelected ? '#a855f7' : isDeployed ? n.color : '#262626'} 
                            strokeWidth={isSelected ? 2.5 : isDeployed ? 2 : 1} 
                          />
                          {isDeployed && (
                            <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill="none" stroke={n.color} strokeWidth="1" className="animate-ping opacity-25" />
                          )}
                          <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill={isSelected ? '#a855f7' : isDeployed ? '#ffffff' : '#64748b'} fontSize="7.5" fontWeight="bold">{n.name}</text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Connections & Nodes - Kakos group */}
                  <g className="orbit-group-kakos">
                    {nodes.filter(n => n.side === 'kakos').map(n => (
                      <line 
                        key={`line-${n.name}`}
                        x1="200" y1="175" 
                        x2={n.cx} y2={n.cy} 
                        stroke={selectedGraphNode === n.name ? '#a855f7' : '#b91c1c22'} 
                        strokeWidth={selectedGraphNode === n.name ? 2.5 : 1}
                      />
                    ))}
                    {deployedAgents.filter(agent => nodes.find(n => n.name === agent)?.side === 'kakos').map(agent => {
                      const node = nodes.find(n => n.name === agent);
                      if (!node) return null;
                      return (
                        <circle key={`pulse-${agent}`} r="3.5" fill="#f87171">
                          <animateMotion dur="2.2s" repeatCount="indefinite" path={`M200,175 L${node.cx},${node.cy}`} />
                        </circle>
                      );
                    })}
                    {nodes.filter(n => n.side === 'kakos').map(n => {
                      const isDeployed = deployedAgents.includes(n.name);
                      const isSelected = selectedGraphNode === n.name;
                      return (
                        <g key={n.name} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); selectNode(n.name); }}>
                          <circle 
                            cx={n.cx} cy={n.cy} r={n.r} 
                            fill={isSelected ? '#a855f71a' : '#000'} 
                            stroke={isSelected ? '#a855f7' : isDeployed ? n.color : '#262626'} 
                            strokeWidth={isSelected ? 2.5 : isDeployed ? 2 : 1} 
                          />
                          {isDeployed && (
                            <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill="none" stroke={n.color} strokeWidth="1" className="animate-ping opacity-25" />
                          )}
                          <text x={n.cx} y={n.cy + 3} textAnchor="middle" fill={isSelected ? '#a855f7' : isDeployed ? '#ffffff' : '#64748b'} fontSize="7.5" fontWeight="bold">{n.name}</text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Central Core */}
                  <circle cx="200" cy="175" r="32" fill="#000" stroke={isFused ? '#a855f7' : '#334155'} strokeWidth="2.5" className="animate-pulse" />
                  <text x="200" y="178" textAnchor="middle" fill={isFused ? '#d8b4fe' : '#f8fafc'} fontSize="8.5" fontWeight="black" letterSpacing="1">AGATHA</text>
                </svg>
              </div>

              {/* Node Information Panel */}
              <div className="w-[320px] max-w-full min-h-[90px] p-3 border rounded-xl bg-neutral-900/95 shadow-md flex flex-col justify-center border-neutral-800">
                {selectedGraphNode ? (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1 font-mono">
                        <span className={`w-2 h-2 rounded-full ${nodes.find(n => n.name === selectedGraphNode)?.side === 'agathos' ? 'bg-blue-500' : 'bg-red-500'}`} />
                        {selectedGraphNode} Unit
                      </span>
                      <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${
                        deployedAgents.includes(selectedGraphNode) 
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40 animate-pulse' 
                          : 'bg-neutral-950 text-neutral-500 border-neutral-850'
                      }`}>
                        {deployedAgents.includes(selectedGraphNode) ? 'Active' : 'Standby'}
                      </span>
                    </div>
                    <p className="text-[9px] text-neutral-400 leading-relaxed min-h-[30px] font-sans">{nodes.find(n => n.name === selectedGraphNode)?.desc}</p>
                    
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => deployAgent(nodes.find(n => n.name === selectedGraphNode)?.side as any, selectedGraphNode)}
                        disabled={deployedAgents.includes(selectedGraphNode)}
                        className={`flex-1 text-[9px] font-bold py-1.5 rounded uppercase tracking-wider cursor-pointer font-mono ${
                          nodes.find(n => n.name === selectedGraphNode)?.side === 'agathos' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-neutral-800' 
                            : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-neutral-800'
                        }`}
                      >
                        Deploy Node
                      </button>
                      {deployedAgents.includes(selectedGraphNode) && (
                        <button 
                          onClick={() => terminateAgent(selectedGraphNode)}
                          className="bg-neutral-800 hover:bg-red-900 hover:text-white text-neutral-400 px-3 py-1 text-[9px] rounded uppercase font-bold cursor-pointer transition-colors font-mono"
                        >
                          Kill
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] text-neutral-500 text-center uppercase tracking-widest font-mono">Select any orbiting unit node to inspect telemetry parameters.</div>
                )}
              </div>
            </div>

            {/* Split Decks */}
            <div className="flex-1 flex overflow-hidden min-h-0 relative">
              
              {/* LEFT HALF: KAKOS OFFENSIVE DECK */}
              {(sliderPosition === 'split' || sliderPosition === 'kakos') && (
                <div className={`flex-1 flex flex-col min-h-0 bg-neutral-950 text-red-200 border-r border-neutral-900 transition-all duration-300 relative ${sliderPosition === 'kakos' ? 'w-full' : 'w-1/2'} overflow-y-auto p-4`}>
                  <MatrixRainOverlay side="kakos" />
                  
                  {/* Kakos Deck Header */}
                  <div className="flex justify-between items-center border-b border-red-950/40 pb-2 mb-3 z-10">
                    <span className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Kakos Shadow Command
                    </span>
                    <span className="text-[7px] text-red-600 font-bold bg-red-950/30 border border-red-900/40 px-1.5 py-0.5 rounded font-mono">OFFENSIVE MODE</span>
                  </div>

                  {/* Threat Feed live scroll */}
                  <div className="bg-black/90 border border-red-950/40 rounded-xl p-3 mb-4 flex flex-col gap-1.5 font-mono text-[8.5px] text-red-400 shadow-inner z-10">
                    <span className="text-[7px] uppercase font-bold text-red-600 tracking-wider mb-0.5 font-mono">Live Hacking Streams</span>
                    {threatFeed.map((entry, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="w-1 h-1 rounded-full bg-red-600 animate-ping shrink-0" />
                        <span className="text-red-500/60 font-bold">[{idx}]</span>
                        <span className="text-red-300 truncate">{entry}</span>
                      </div>
                    ))}
                  </div>

                  {/* Port grid minigame */}
                  <div className="mb-4 z-10">
                    <NmapPortGrid 
                      playClick={playClick} 
                      playBlip={playBlip} 
                      onModifyCalls={(side) => {
                        if (side === 'kakos') setKakosCalls(prev => prev + 1);
                        else setAgathosCalls(prev => prev + 1);
                        fetchStatus();
                      }} 
                    />
                  </div>

                  {/* Soundboard */}
                  <div className="mb-4 z-10">
                    <Soundboard synth={synth} />
                  </div>

                  {/* Offensive Quick Capabilities */}
                  <div className="flex flex-col gap-2 z-10">
                    <span className="text-[8px] text-red-600 font-bold uppercase tracking-wider font-mono">Execute Capabilities</span>
                    
                    <button 
                      onClick={() => quickAction('kakos', 'zero-day exploit')}
                      className="w-full text-left bg-black border border-red-950/40 hover:border-red-600/70 p-3 rounded-lg text-[10px] text-red-200 hover:bg-red-950/20 cursor-pointer shadow-lg transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-red-500 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Zero-Day Synthesis
                      </span>
                      <p className="text-[8px] text-neutral-500 mt-1 leading-relaxed font-sans">Probe remote services and compile targeted exploits.</p>
                    </button>
                    
                    <button 
                      onClick={() => quickAction('kakos', 'onion crawler')}
                      className="w-full text-left bg-black border border-red-950/40 hover:border-red-600/70 p-3 rounded-lg text-[10px] text-red-200 hover:bg-red-950/20 cursor-pointer shadow-lg transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-red-500 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Deep Onion Scrape
                      </span>
                      <p className="text-[8px] text-neutral-500 mt-1 leading-relaxed font-sans">Search Tor networks for threat feed intelligence feeds.</p>
                    </button>

                    <button 
                      onClick={() => quickAction('kakos', 'credential harvester')}
                      className="w-full text-left bg-black border border-red-950/40 hover:border-red-600/70 p-3 rounded-lg text-[10px] text-red-200 hover:bg-red-950/20 cursor-pointer shadow-lg transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-red-500 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Credentials Harvester
                      </span>
                      <p className="text-[8px] text-neutral-500 mt-1 leading-relaxed font-sans">Execute simulated OSINT identity credential scans.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* RIGHT HALF: AGATHOS GUARDIAN DECK */}
              {(sliderPosition === 'split' || sliderPosition === 'agathos') && (
                <div className={`flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-800 border-l border-slate-200 transition-all duration-300 relative ${sliderPosition === 'agathos' ? 'w-full' : 'w-1/2'} overflow-y-auto p-4`}>
                  <MatrixRainOverlay side="agathos" />
                  
                  {/* Agathos Deck Header */}
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2 mb-3 z-10">
                    <span className="text-blue-700 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Shield className="w-3.5 h-3.5 text-blue-600" /> Agathos Sanctuary
                    </span>
                    <span className="text-[7px] text-blue-700 font-bold bg-blue-100/60 border border-blue-200 px-1.5 py-0.5 rounded font-mono">DEFENSIVE MODE</span>
                  </div>

                  {/* Dial Gauge */}
                  <div className="flex gap-2 mb-4 z-10 overflow-x-auto">
                    <IntegrityDial heatValue={ethicalHeat} />
                    <CpuMemoryChart />
                  </div>

                  {/* Integrity Ledger live scroll */}
                  <div className="bg-white border border-blue-150 rounded-xl p-3 mb-4 flex flex-col gap-1.5 font-mono text-[8.5px] text-slate-700 shadow-sm z-10">
                    <span className="text-[7px] uppercase font-bold text-blue-600 tracking-wider mb-0.5 font-mono">Integrity & Policy Logs</span>
                    {integrityLedger.map((entry, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-blue-600 font-bold">[{idx}]</span>
                        <span className="text-slate-600 truncate">{entry}</span>
                      </div>
                    ))}
                  </div>

                  {/* File tree browser */}
                  <div className="mb-4 z-10">
                    <FileTree 
                      playClick={playClick} 
                      onSelectFile={(name, content) => {
                        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), side: 'system', message: `Preview file [${name}]:\n${content}` }]);
                      }} 
                    />
                  </div>

                  {/* Packet inspector */}
                  <div className="mb-4 z-10">
                    <PacketInspector />
                  </div>

                  {/* Defensive Quick Capabilities */}
                  <div className="flex flex-col gap-2 z-10">
                    <span className="text-[8px] text-blue-600 font-bold uppercase tracking-wider font-mono">Execute Capabilities</span>
                    
                    <button 
                      onClick={() => quickAction('agathos', 'integrity check')}
                      className="w-full text-left bg-white border border-blue-200 hover:border-blue-500 p-3 rounded-lg text-[10px] text-slate-800 hover:bg-blue-50/30 cursor-pointer shadow-sm transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-blue-600 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Verify Integrity DB
                      </span>
                      <p className="text-[8px] text-slate-400 mt-1 leading-relaxed font-sans">Recalculate SHA-256 hashes of critical system binaries.</p>
                    </button>
                    
                    <button 
                      onClick={() => quickAction('agathos', 'self healing')}
                      className="w-full text-left bg-white border border-blue-200 hover:border-blue-500 p-3 rounded-lg text-[10px] text-slate-800 hover:bg-blue-50/30 cursor-pointer shadow-sm transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-blue-600 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Core Self-Healing
                      </span>
                      <p className="text-[8px] text-slate-400 mt-1 leading-relaxed font-sans">Restore mutated configs to their verified baseline.</p>
                    </button>

                    <button 
                      onClick={() => quickAction('agathos', 'privacy mask')}
                      className="w-full text-left bg-white border border-blue-200 hover:border-blue-500 p-3 rounded-lg text-[10px] text-slate-800 hover:bg-blue-50/30 cursor-pointer shadow-sm transition-all"
                    >
                      <span className="font-bold flex items-center gap-2 text-blue-600 font-mono">
                        <Play className="w-2.5 h-2.5 shrink-0" /> Cognitive Privacy Mask
                      </span>
                      <p className="text-[8px] text-slate-400 mt-1 leading-relaxed font-sans">Sanitize credentials and details from logs using regex.</p>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: INBUILT INTERACTIVE TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col bg-black text-emerald-400 font-mono p-4 overflow-hidden text-[11px] leading-relaxed">
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
              {termLines.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line.type === 'input' && <span className="text-neutral-500">{line.text}</span>}
                  {line.type === 'output' && <span className="text-neutral-300">{line.text}</span>}
                  {line.type === 'error' && <span className="text-red-500 font-bold">{line.text}</span>}
                  {line.type === 'success' && <span className="text-emerald-400 font-bold">{line.text}</span>}
                  {line.type === 'agathos' && <span className="text-blue-400 font-bold">{line.text}</span>}
                  {line.type === 'kakos' && <span className="text-red-400 font-bold">{line.text}</span>}
                </div>
              ))}
              <div ref={termEndRef} />
            </div>
            
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 border-t border-neutral-900 pt-3 mt-2 items-center">
              <span className="text-neutral-500">agatha-node:~$</span>
              <input 
                type="text"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="Type terminal command (e.g. 'help', 'ls', 'crypto')..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 caret-emerald-400 font-mono"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* TAB 3: QUANTUM VAULT & DECRYPTOR MATRIX */}
        {activeTab === 'quantum' && (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-50 text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" /> Post-Quantum Cryptographic Vault
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crypto Details Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Vault Parameters</h3>
                
                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">KEM Standard:</span>
                    <span className="font-bold text-slate-900">{cryptoParams.algorithm_kem}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Signature Standard:</span>
                    <span className="font-bold text-slate-900">{cryptoParams.algorithm_sign}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Kyber Public Key:</span>
                    <span className="font-mono text-[9px] bg-slate-50 p-1.5 rounded text-blue-700 border border-blue-50/50 break-all">
                      {cryptoParams.pub_fingerprint}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={triggerCryptoRegen}
                  disabled={regeneratingCrypto}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${regeneratingCrypto ? 'animate-spin' : ''}`} />
                  {regeneratingCrypto ? 'Regenerating...' : 'Regenerate Quantum Keypair'}
                </button>
              </div>

              {/* Hex Matrix Decryption Widget */}
              <HexDecryptor addLog={addLog} synth={synth} />
            </div>

            {/* Settings Controls Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 mt-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Containment & Network Settings</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Route via Onion Tor Net</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Force crawler tasks through Tor SOCKS5 proxy.</p>
                  </div>
                  <button 
                    onClick={() => {
                      playClick();
                      setProxyEnabled(!proxyEnabled);
                      addLog('system', `Tor SOCKS5 network routing: ${!proxyEnabled ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${proxyEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${proxyEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Grid Subprocess Sandbox</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Isolate executed Kakos binaries inside container bounds.</p>
                  </div>
                  <button 
                    onClick={() => {
                      playClick();
                      setSandboxEnabled(!sandboxEnabled);
                      addLog('system', `Subprocess containment sandbox: ${!sandboxEnabled ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${sandboxEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${sandboxEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Governor Manual Overrides</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Allows manual overrides of Governor Heat ratios.</p>
                  </div>
                  <button 
                    onClick={() => {
                      playClick();
                      setOverrideAllowed(!overrideAllowed);
                      if (!overrideAllowed) {
                        addLog('system', 'WARNING: Governor override debugging active. Adjust heat using the override slider.');
                      } else {
                        addLog('system', 'Governor overrides disabled. Restoring live ratio tracking.');
                        executeCommand('override_heat 0.0', 'system');
                      }
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${overrideAllowed ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${overrideAllowed ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {overrideAllowed && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-500">Simulation Ratio:</span>
                      <span className="text-blue-600">{(ethicalHeat * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.1"
                      value={ethicalHeat}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEthicalHeat(val);
                        executeCommand(`override_heat ${val}`, 'system');
                      }}
                      className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUTONOMOUS MISSION SWARM SOLVER */}
        {activeTab === 'mission' && (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-900/50 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h2 className="text-xs font-black text-emerald-400 flex items-center gap-2 tracking-widest uppercase">
                <Cpu className="w-5 h-5 text-emerald-500" /> Autonomous Mission Swarm Solver
              </h2>
            </div>

            <form onSubmit={runSwarmMission} className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-neutral-500 uppercase font-black tracking-wider">Specify Mission Target / Security Goal</label>
                <input 
                  type="text"
                  value={missionGoal}
                  onChange={(e) => setMissionGoal(e.target.value)}
                  placeholder="e.g. Detect and patch SQL injection vectors on host..."
                  disabled={missionRunning}
                  className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-700 font-mono focus:border-neutral-700 outline-none"
                />
              </div>

              <button 
                type="submit"
                disabled={missionRunning || !missionGoal.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
              >
                <Play className={`w-3.5 h-3.5 ${missionRunning ? 'animate-pulse' : ''}`} />
                {missionRunning ? 'Solving Goal...' : 'Launch Solver Loop'}
              </button>
            </form>

            {(missionLogs.length > 0 || missionRunning) && (
              <div className="bg-black border border-neutral-900 rounded-xl p-5 font-mono text-[10px] text-neutral-300 flex-1 flex flex-col gap-2 min-h-[150px] shadow-inner">
                <span className="text-[8px] text-neutral-500 border-b border-neutral-900 pb-1.5 uppercase font-bold tracking-widest">Execution Trace</span>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 scrollbar-thin">
                  {missionLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`leading-relaxed whitespace-pre-wrap ${
                        log.startsWith('✓') ? 'text-emerald-400 font-bold' :
                        log.startsWith('Mission') ? 'text-blue-400 font-bold border-b border-neutral-900 pb-1' : 'text-neutral-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {missionRunning && (
                    <div className="text-neutral-500 animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-ping" /> AGATHA is evaluating model paths...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: KNOWLEDGE INGESTION PIPELINE */}
        {activeTab === 'ingest' && <IngestTab addLog={addLog} playClick={playClick} />}

        {/* TAB 6: SOVEREIGN CORE CONTROL DECK */}
        {activeTab === 'sovereignty' && (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-50 text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 font-mono">
              <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Operating Sovereignty & Cosmic Defense
              </h2>
              <span className="text-[10px] text-blue-600 bg-blue-100/50 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                Sovereign Core (18th Suite)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CosmicMeshLink 
                playClick={playClick} 
                playSuccess={() => synth.current?.playSuccess()} 
                playBlip={() => synth.current?.playBlip()} 
                addLog={addLog} 
              />
              <ChronoDeception 
                playClick={playClick} 
                playBlip={() => synth.current?.playBlip()} 
                playAlert={() => synth.current?.playAlert()} 
                addLog={addLog} 
              />
              <NeuroShield 
                playClick={playClick} 
                playSuccess={() => synth.current?.playSuccess()} 
                playAlert={() => synth.current?.playAlert()} 
                addLog={addLog} 
              />
              <CryptEater 
                playClick={playClick} 
                playBlip={() => synth.current?.playBlip()} 
                playSuccess={() => synth.current?.playSuccess()} 
                addLog={addLog} 
              />
              <div className="md:col-span-2 max-w-md mx-auto w-full">
                <BioVault 
                  playClick={playClick} 
                  playSuccess={() => synth.current?.playSuccess()} 
                  addLog={addLog} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deploy list / Subagents Status bar (Bicameral & Swarm Solver only) */}
      {(activeTab === 'bicameral' || activeTab === 'mission') && deployedAgents.length > 0 && (
        <div className="z-10 bg-neutral-900 border-t border-neutral-800 px-6 py-3 flex flex-wrap gap-2 items-center text-[10px]">
          <span className="text-neutral-500 font-bold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Active Swarm Nodes:
          </span>
          {deployedAgents.map(agent => {
            const isKakosAgent = ['WRAITH', 'REAVER', 'VIPER', 'LICH', 'BANSHEE'].includes(agent);
            return (
              <div 
                key={agent}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black tracking-wider transition-all duration-300 ${
                  isKakosAgent 
                    ? 'bg-red-950/30 text-red-400 border-red-900/50' 
                    : 'bg-blue-950/30 text-blue-350 border-blue-900/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isKakosAgent ? 'bg-red-500 animate-pulse' : 'bg-blue-400 animate-pulse'
                }`} />
                {agent}
                <button 
                  onClick={() => terminateAgent(agent)}
                  className="hover:text-white text-neutral-600 transition-colors font-sans ml-1 text-[9px]"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Middle/Bottom console logs output (Bicameral & Swarm Solver only) */}
      {(activeTab === 'bicameral' || activeTab === 'mission') && (
        <section className="z-10 bg-black border-t border-neutral-800 h-44 flex flex-col text-[10px]">
          <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex justify-between items-center text-[8px] text-neutral-500 font-bold">
            <span className="flex items-center gap-1.5 uppercase">
              <TerminalIcon className="w-3.5 h-3.5" /> Output Console
            </span>
            <div className="flex gap-4">
              <span className="text-[7.5px] tracking-widest text-neutral-500">
                CALLS: AGATHOS {agathosCalls} | KAKOS {kakosCalls}
              </span>
              <button 
                onClick={downloadLogs}
                className="hover:text-neutral-300 flex items-center gap-1 uppercase cursor-pointer"
                title="Export logs to JSON"
              >
                <Download className="w-2.5 h-2.5" /> Export
              </button>
              <button 
                onClick={() => { playClick(); setLogs([]); }}
                className="hover:text-neutral-300 flex items-center gap-1 uppercase cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2 leading-relaxed">
                <span className="text-neutral-600">[{log.timestamp}]</span>
                <span className={`font-black ${
                  log.side === 'kakos' ? 'text-red-500' : 
                  log.side === 'agathos' ? 'text-blue-400' : 
                  log.side === 'blocked' ? 'text-amber-500 font-bold flex items-center gap-1' : 'text-neutral-400'
                }`}>
                  {log.side === 'blocked' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline" />}
                  {log.side.toUpperCase()}:
                </span>
                <span className="text-neutral-300">{log.message}</span>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 text-neutral-500 animate-pulse">
                <span>[...]</span>
                <span>AGATHA is formulating neural routing strategy...</span>
              </div>
            )}
            <div ref={consoleEndRef} />
          </div>
        </section>
      )}

      {/* Terminal Input Form (Bicameral & Swarm Solver only) */}
      {(activeTab === 'bicameral' || activeTab === 'mission') && (
        <form onSubmit={handleCommandSubmit} className="z-10 bg-neutral-900 border-t border-neutral-800 p-4 flex gap-3">
          <div className="flex-1 bg-black rounded-lg border border-neutral-800 px-3 py-2 flex items-center gap-2 focus-within:border-neutral-700">
            <MessageSquare className="w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Instruct Agatha Core (e.g., 'deploy AEGIS', 'integrity check')..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-neutral-200 placeholder-neutral-600 font-mono"
            />
          </div>
          <button 
            type="submit"
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 px-5 py-2 rounded-lg text-xs font-bold uppercase transition-all"
          >
            Execute
          </button>
        </form>
      )}

      {/* SUDO BIOMETRIC PRIVILEGE ELEVATION OVERLAY */}
      {showSudoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 max-w-sm w-full rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl relative">
            <span className="text-[9px] uppercase font-black text-amber-500 tracking-widest bg-amber-950/40 border border-amber-900/50 px-2.5 py-1 rounded font-mono">
              Administrative Elevation Audit
            </span>
            <h3 className="text-sm font-bold text-center text-white font-mono">Biometric Signature Unlocking</h3>
            <p className="text-[9px] text-neutral-500 text-center leading-relaxed font-sans">
              Hold the touch target below to authorize superuser mode (`sudo`) for the interactive console.
            </p>

            {/* Glowing Target SVG */}
            <div 
              onMouseDown={() => {
                synth.current?.playBlip();
                (window as any).sudoTimer = setInterval(() => {
                  setSudoHoldProgress(prev => {
                    synth.current?.playScanTick();
                    if (prev >= 100) {
                      clearInterval((window as any).sudoTimer);
                      synth.current?.playSuccess();
                      setIsSudoUnlocked(true);
                      setShowSudoModal(false);
                      setSudoHoldProgress(0);
                      setTermLines(lines => [
                        ...lines,
                        { text: '✓ BIOMETRIC AUTHENTICATION SUCCEEDED. SUPERUSER PRIVILEGES GRANTED.', type: 'success' }
                      ]);
                      addLog('system', 'Security audit: Superuser access authorization granted.');
                      return 100;
                    }
                    return prev + 10;
                  });
                }, 120);
              }}
              onMouseUp={() => {
                clearInterval((window as any).sudoTimer);
                if (sudoHoldProgress < 100) {
                  synth.current?.playAlert();
                  setSudoHoldProgress(0);
                }
              }}
              onTouchStart={() => {
                synth.current?.playBlip();
                (window as any).sudoTimer = setInterval(() => {
                  setSudoHoldProgress(prev => {
                    synth.current?.playScanTick();
                    if (prev >= 100) {
                      clearInterval((window as any).sudoTimer);
                      synth.current?.playSuccess();
                      setIsSudoUnlocked(true);
                      setShowSudoModal(false);
                      setSudoHoldProgress(0);
                      setTermLines(lines => [
                        ...lines,
                        { text: '✓ BIOMETRIC AUTHENTICATION SUCCEEDED. SUPERUSER PRIVILEGES GRANTED.', type: 'success' }
                      ]);
                      addLog('system', 'Security audit: Superuser access authorization granted.');
                      return 100;
                    }
                    return prev + 10;
                  });
                }, 120);
              }}
              onTouchEnd={() => {
                clearInterval((window as any).sudoTimer);
                if (sudoHoldProgress < 100) {
                  synth.current?.playAlert();
                  setSudoHoldProgress(0);
                }
              }}
              className="w-32 h-32 rounded-full border-2 border-neutral-800 bg-black flex items-center justify-center relative cursor-pointer active:scale-95 transition-all select-none group"
            >
              <div className="absolute inset-3 rounded-full border border-neutral-900 group-active:border-red-900/30 transition-colors" />
              
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={sudoHoldProgress > 0 ? '#ef4444' : '#525252'} strokeWidth="1.5" className="transition-all relative z-10">
                <path d="M12 2C11.97 2 11.93 2 11.9 2C9.12 2.04 6.84 4.3 6.8 7.08C6.79 7.15 6.79 7.22 6.79 7.29C6.79 8.12 6.12 8.79 5.29 8.79C4.46 8.79 3.79 8.12 3.79 7.29C3.79 7.14 3.79 7 3.81 6.85C3.92 2.5 7.46 -0.92 11.81 -1C11.87 -1 11.94 -1 12 -1C16.97 -1 21 3.03 21 8V10C21 10.83 20.33 11.5 19.5 11.5C18.67 11.5 18 10.83 18 10V8C18 4.69 15.31 2 12 2Z" />
                <path d="M12 5C12.03 5 12.06 5 12.09 5C13.7 5.02 15 6.34 15 7.95V14.95C15 15.78 14.33 16.45 13.5 16.45C12.67 16.45 12 15.78 12 14.95V7.95C12 7.84 12 7.74 12 7.63Z" fill="currentColor" opacity="0.1" />
                <path d="M8 8V12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12V8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8Z" />
                <path d="M5 12V14C5 17.87 8.13 21 12 21C15.87 21 19 17.87 19 14V12" />
              </svg>
              
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="58" 
                  fill="transparent" 
                  stroke={sudoHoldProgress > 70 ? '#10b981' : '#ef4444'} 
                  strokeWidth="3" 
                  strokeDasharray="364" 
                  strokeDashoffset={364 - (364 * sudoHoldProgress) / 100} 
                  className="transition-all duration-100"
                />
              </svg>

              {sudoHoldProgress > 0 && (
                <div className="absolute left-6 right-6 h-[1.5px] bg-red-500 shadow-[0_0_8px_#ef4444] biometric-scanner-line pointer-events-none" />
              )}
            </div>

            <div className="flex flex-col items-center gap-1 select-none">
              <span className="text-[10px] font-black font-mono text-neutral-350">
                {sudoHoldProgress > 0 ? `Hold to verify... ${sudoHoldProgress}%` : 'Hold to Authorize'}
              </span>
              <span className="text-[7.5px] text-neutral-500 font-mono">ADMIN CREDENTIALS ENFORCED BY AGATHA CORE</span>
            </div>

            <button 
              onClick={() => {
                playClick();
                setShowSudoModal(false);
                setSudoHoldProgress(0);
                setTermLines(lines => [...lines, { text: 'Elevation request aborted by user.', type: 'error' }]);
                addLog('system', 'Security audit: Biometric authorization aborted by user.');
              }}
              className="mt-2 text-neutral-500 hover:text-white text-[8px] uppercase font-bold tracking-wider cursor-pointer font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================================================
// COMPONENT: STEGANOGRAPHIC DECRYPTOR WIDGET
// ============================================================================
interface HexDecryptorProps {
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
  synth: React.MutableRefObject<SynthEngine | null>;
}

function HexDecryptor({ addLog, synth }: HexDecryptorProps) {
  const [matrix, setMatrix] = useState<string[][]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [solvedCode, setSolvedCode] = useState<string | null>(null);

  const generateRandomRow = () => {
    return Array.from({ length: 8 }, () => {
      const val = Math.floor(Math.random() * 256);
      return val.toString(16).toUpperCase().padStart(2, '0');
    });
  };

  useEffect(() => {
    // Generate initial scrambled matrix
    const rows = Array.from({ length: 5 }, generateRandomRow);
    setMatrix(rows);

    const interval = setInterval(() => {
      if (!isSolving && !solvedCode) {
        setMatrix(Array.from({ length: 5 }, generateRandomRow));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSolving, solvedCode]);

  const solveMatrix = async () => {
    if (isSolving || solvedCode) return;

    synth.current?.playClick();
    setIsSolving(true);
    addLog('system', 'Steganography: Commencing binary entropy alignment checks...');
    
    // Simulate matrix de-scrambling column by column with ticks
    for (let col = 0; col < 8; col++) {
      await new Promise(resolve => setTimeout(resolve, 250));
      synth.current?.playBlip();
      setMatrix(prev => prev.map((row, rIdx) => {
        const newRow = [...row];
        // Lock this column to static success indicators
        newRow[col] = rIdx === 2 ? '0K' : 'FF';
        return newRow;
      }));
    }

    synth.current?.playSuccess();
    setIsSolving(false);
    setSolvedCode('KEY-SOVEREIGN: DILITHIUM-V OPERATIONAL');
    addLog('agathos', 'Success: Steganographic payload scrubbing resolved successfully.');
  };

  const resetMatrix = () => {
    synth.current?.playClick();
    setSolvedCode(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Entropy Matrix De-scrambler</h3>
        <Shuffle className={`w-3.5 h-3.5 text-blue-500 ${isSolving ? 'animate-spin' : ''}`} />
      </div>

      <div className="bg-slate-950 rounded-lg p-4 font-mono text-[10px] text-emerald-500 text-center flex flex-col gap-1.5 border border-slate-900 shadow-inner">
        {matrix.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-around tracking-widest select-all">
            {row.map((hex, cIdx) => (
              <span 
                key={cIdx} 
                className={hex === '0K' || hex === 'FF' ? 'text-blue-400 font-black animate-pulse' : 'text-emerald-600'}
              >
                {hex}
              </span>
            ))}
          </div>
        ))}
      </div>

      {solvedCode ? (
        <div className="flex flex-col gap-2.5">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold p-2.5 rounded-lg text-center font-mono">
            {solvedCode}
          </div>
          <button 
            onClick={resetMatrix}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            Reset Scanner
          </button>
        </div>
      ) : (
        <button 
          onClick={solveMatrix}
          disabled={isSolving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {isSolving ? 'Analyzing Entropy...' : 'Decrypt Steganographic Stream'}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: KNOWLEDGE INGESTION TAB
// ============================================================================
interface IngestTabProps {
  addLog: (side: 'kakos' | 'agathos' | 'system' | 'blocked', message: string) => void;
  playClick: () => void;
}

function IngestTab({ addLog, playClick }: IngestTabProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || ingesting) return;

    playClick();
    setIngesting(true);
    setStatusText('Sending payload to post-quantum ingestion gateway...');
    try {
      const response = await fetch('/api/agatha/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await response.json();
      setIngesting(false);

      if (data.success) {
        setStatusText(`Ingested successfully. Documents: ${data.document_count}, KAG Nodes: ${data.graph_nodes}`);
        addLog('agathos', `Knowledge Ingested: ${title || 'Threat Log'}`);
        setTitle('');
        setContent('');
        setTags('');
      } else {
        setStatusText(`Ingestion failed: ${data.error || data.message}`);
      }
    } catch (err) {
      setIngesting(false);
      setStatusText(`Ingestion error: ${err}`);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-50 text-slate-800">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h2 className="text-lg font-black text-blue-750 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-600" /> Neural Knowledge Ingestion
        </h2>
        <span className="text-[10px] text-blue-600 bg-blue-100/50 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
          RAG / KAG Pipeline
        </span>
      </div>

      <form onSubmit={handleIngest} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-xs">
          <label className="text-slate-500 font-bold uppercase">Intel Title / Header</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CVE-2026-0001 vulnerability advisory"
            className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <label className="text-slate-500 font-bold uppercase">Intel Content / Body</label>
          <textarea 
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste raw threat intelligence report, CVE advisory description, or network telemetry data here..."
            className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-slate-800 font-sans"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <label className="text-slate-500 font-bold uppercase">Classification Tags (comma-separated)</label>
          <input 
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. exploit, database, threat-feed"
            className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        <button 
          type="submit"
          disabled={ingesting || !content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest transition-all shadow-sm"
        >
          <Play className={`w-3.5 h-3.5 ${ingesting ? 'animate-pulse' : ''}`} />
          {ingesting ? 'Indexing document...' : 'Ingest to Neural Knowledge Store'}
        </button>

        {statusText && (
          <div className={`text-[10px] font-bold p-3 rounded-lg border ${
            statusText.startsWith('Ingested') 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : statusText.startsWith('Ingestion error') || statusText.startsWith('Ingestion failed')
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {statusText}
          </div>
        )}
      </form>
    </div>
  );
}
