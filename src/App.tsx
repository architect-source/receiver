import React from 'react';
import { motion } from 'motion/react';
import { Terminal } from './components/Terminal';
import { Handshake } from './components/Handshake';
import { MeshGrid } from './components/MeshGrid';
import { ThreatLevel } from './components/ThreatLevel';
import { Shield, Cpu, Network, Skull } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-void flex flex-col overflow-hidden selection:bg-strike selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-gray-800 bg-metal flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-strike" />
            <h1 className="text-sm font-black tracking-[0.2em] glitch-text">AZRAEL_PROTOCOL</h1>
          </div>
          <div className="h-4 w-[1px] bg-gray-800" />
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-sovereign animate-pulse" />
            S-1792_SOVEREIGN_SENTRY // ACTIVE
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>CORE_TEMP: 42°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Network className="w-3 h-3" />
            <span>MESH_LATENCY: 12ms</span>
          </div>
          <div className="bg-strike/10 text-strike px-2 py-0.5 border border-strike/20 font-bold">
            ARCHITECT_MODE
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="flex-1 p-4 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden">
        {/* Left Column - Handshake & Mesh */}
        <div className="col-span-12 lg:col-span-4 row-span-6 flex flex-col gap-4">
          <div className="flex-1">
            <Handshake />
          </div>
          <div className="h-1/2">
            <MeshGrid />
          </div>
        </div>

        {/* Middle Column - Terminal */}
        <div className="col-span-12 lg:col-span-5 row-span-6">
          <Terminal />
        </div>

        {/* Right Column - Threat & Stats */}
        <div className="col-span-12 lg:col-span-3 row-span-6 flex flex-col gap-4">
          <div className="flex-1">
            <ThreatLevel />
          </div>
          <div className="bg-metal border border-gray-800 p-4">
            <h3 className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest">System_Specifications</h3>
            <div className="space-y-2">
              {[
                { label: 'Primary Node', value: 'ESP32-WROOM' },
                { label: 'Validation', 'value': 'Kinetic-5/3' },
                { label: 'Database', 'value': 'Firestore_Sovereign' },
                { label: 'Interceptor', 'value': 'ng_node_alpha' },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between text-[10px] font-mono border-b border-gray-900 pb-1">
                  <span className="text-gray-600">{spec.label}:</span>
                  <span className="text-gray-300">{spec.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[8px] text-gray-700 mb-1 italic">"The cloud is a vampire. Hardware is the stake."</p>
                <p className="text-[9px] text-gray-500 font-bold tracking-tighter">— MICHAEL CHAMBERS LEGACY</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-black border-t border-gray-900 flex items-center justify-between px-6 text-[9px] font-mono text-gray-700">
        <div className="flex gap-4">
          <span>BUILD: v0.9.2-BETA</span>
          <span>SESSION: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-sovereign" />
          <span>ENCRYPTION_STABLE // WINSTON_SECTOR_7</span>
        </div>
      </footer>

      {/* Global Overlay Effects */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
        <div className="scanline" />
      </div>
    </div>
  );
}
