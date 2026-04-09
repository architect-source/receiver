import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Zap, Activity } from 'lucide-react';

export const ThreatLevel: React.FC = () => {
  const [level, setLevel] = useState(15);
  const [isStriking, setIsStriking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => {
        const change = Math.floor(Math.random() * 10) - 4;
        const next = Math.max(5, Math.min(95, prev + change));
        if (next > 80) setIsStriking(true);
        else if (next < 40) setIsStriking(false);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-metal border p-4 h-full flex flex-col transition-colors duration-500 ${
      isStriking ? 'border-strike bg-red-950/10' : 'border-gray-800'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        {isStriking ? (
          <AlertTriangle className="w-4 h-4 text-strike animate-bounce" />
        ) : (
          <Activity className="w-4 h-4 text-gray-500" />
        )}
        <h3 className="text-xs text-gray-400">THREAT_LEVEL // TITAN_PRIME_3100</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative h-32 flex items-end gap-1 mb-4">
          {[...Array(20)].map((_, i) => {
            const threshold = (i / 20) * 100;
            const isActive = level >= threshold;
            return (
              <motion.div
                key={i}
                animate={{
                  height: isActive ? `${(i + 1) * 5}%` : '4px',
                  backgroundColor: !isActive ? '#1a1a1a' : 
                                   level > 80 ? '#ff0000' :
                                   level > 50 ? '#eab308' : '#00ff41'
                }}
                className="flex-1 rounded-t-sm"
              />
            );
          })}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-black ${
              level > 80 ? 'text-strike glitch-text' : 
              level > 50 ? 'text-yellow-500' : 'text-sovereign'
            }`}>
              {level}%
            </span>
          </div>
        </div>

        <div className="bg-black/50 p-3 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-gray-500 uppercase">Protocol Status:</span>
            <span className={`text-[9px] font-bold ${isStriking ? 'text-strike' : 'text-sovereign'}`}>
              {isStriking ? 'TITAN_STRIKE_ACTIVE' : 'PASSIVE_MONITORING'}
            </span>
          </div>
          
          {isStriking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center gap-2 text-[8px] text-strike font-bold"
            >
              <Zap className="w-3 h-3" />
              RECURSIVE_DRAIN_ENGAGED // NG_NODE_ALPHA
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
