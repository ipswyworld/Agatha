'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Zap, Globe, Cpu } from 'lucide-react';

interface UnitStatus {
  type: string;
  active: boolean;
  load: number;
}

interface SwarmStatus {
  unit_count: number;
  active_swarms: number;
  units: Record<string, UnitStatus>;
  swarm_intelligence_level: number;
}

interface AgathaStatus {
  ethical_heat: number;
  swarm_status: SwarmStatus;
  governor_stats: {
    agathos_calls: number;
    kakos_calls: number;
  };
}

export default function NeuralDashboard() {
  const [status, setStatus] = useState<AgathaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/agatha/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-black text-blue-500 font-mono">
        <div className="animate-pulse">INITIALIZING NEURAL LINK...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950 border border-red-500 text-red-200 rounded-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" /> System Error
        </h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!status) return null;

  const heatColor = status.ethical_heat > 0.7 ? 'text-red-500' : status.ethical_heat > 0.4 ? 'text-yellow-500' : 'text-blue-500';
  const heatBg = status.ethical_heat > 0.7 ? 'bg-red-500' : status.ethical_heat > 0.4 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 font-mono selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Project Agatha</h1>
          <p className="text-zinc-500 text-sm mt-1">Neural Command & Control Interface v1.0.0</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase">System Status</span>
            <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> ONLINE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ethical Heat Gauge */}
        <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24" />
          </div>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-400">
            <Activity className="w-5 h-5 text-blue-500" /> Ethical Heat
          </h2>
          
          <div className="relative pt-8 flex flex-col items-center">
            <div className="text-5xl font-black mb-2 font-mono tabular-nums tracking-tighter">
              {(status.ethical_heat * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${heatBg}`}
                style={{ width: `${status.ethical_heat * 100}%` }}
              />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Agathos Calls</div>
                <div className="text-blue-400 font-bold">{status.governor_stats.agathos_calls}</div>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Kakos Calls</div>
                <div className="text-red-400 font-bold">{status.governor_stats.kakos_calls}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Swarm Status */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
            <Globe className="w-24 h-24" />
          </div>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-400">
            <Cpu className="w-5 h-5 text-emerald-500" /> Swarm Intelligence
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(status.swarm_status.units).map(([name, unit]) => (
              <div key={name} className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                <div className={`text-[10px] font-bold mb-2 ${unit.type === 'Agathos' ? 'text-blue-400' : 'text-red-400'}`}>
                  {name}
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center relative">
                  <div className={`w-3 h-3 rounded-full ${unit.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-zinc-700'}`} />
                </div>
                <div className="mt-2 text-[8px] text-zinc-500 uppercase font-black">
                  {unit.active ? 'Active' : 'Offline'}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-8 border-t border-zinc-800 pt-6">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Unit Capacity</div>
              <div className="text-xl font-bold">{status.swarm_status.unit_count} / 10</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Swarm Sync</div>
              <div className="text-xl font-bold text-emerald-400">{(status.swarm_status.swarm_intelligence_level * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Active Threads</div>
              <div className="text-xl font-bold text-blue-400">{status.swarm_status.active_swarms}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
