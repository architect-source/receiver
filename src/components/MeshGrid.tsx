import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const MeshGrid: React.FC = () => {
  const [nodes, setNodes] = useState<boolean[]>(Array(64).fill(true));

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => {
        const next = [...prev];
        const index = Math.floor(Math.random() * next.length);
        next[index] = Math.random() > 0.1; // 10% chance of a node going "dark" or "malicious"
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-metal border border-gray-800 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs text-gray-400">WINSTON_SECTOR_MESH // ALPHA_GRID</h3>
        <span className="text-[10px] text-sovereign animate-pulse">LIVE_FEED</span>
      </div>
      
      <div className="flex-1 grid grid-cols-8 gap-1">
        {nodes.map((active, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: active ? '#1a1a1a' : '#ff0000',
              borderColor: active ? '#333' : '#ff0000',
              boxShadow: active ? 'none' : '0 0 10px rgba(255, 0, 0, 0.5)',
            }}
            className="aspect-square border flex items-center justify-center relative group"
          >
            <div className={`w-1 h-1 rounded-full ${active ? 'bg-gray-700' : 'bg-white animate-ping'}`} />
            
            <div className="absolute hidden group-hover:block bg-black border border-gray-700 p-1 z-20 text-[8px] -top-6 left-0 whitespace-nowrap">
              NODE_{i.toString(16).toUpperCase()} // {active ? 'STABLE' : 'MALICIOUS_INTERCEPT'}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-[9px] text-gray-600 uppercase">
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>Active Nodes:</span>
          <span className="text-white">{nodes.filter(n => n).length}/64</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>Threat Nodes:</span>
          <span className="text-strike">{nodes.filter(n => !n).length}</span>
        </div>
      </div>
    </div>
  );
};
