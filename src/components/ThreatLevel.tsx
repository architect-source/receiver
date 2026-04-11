import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Activity } from 'lucide-react';

export const ThreatLevel: React.FC = () => {
  const [telemetry, setTelemetry] = useState({ threatLevel: 0, updatedAt: '' });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTelemetry({ threatLevel: 0, updatedAt: '' });
        return;
      }

      const path = 'sectors/oregon/telemetry/current';
      const unsubscribeSnapshot = onSnapshot(doc(db, path), (snapshot) => {
        if (snapshot.exists()) {
          setTelemetry(snapshot.data() as any);
        }
      }, (error) => {
        if (auth.currentUser) {
          console.error('ThreatLevel Firestore Error:', error);
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const level = telemetry.threatLevel;

  return (
    <div className="bg-metal border border-gray-800 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-4 h-4 ${level > 80 ? 'text-strike animate-pulse' : 'text-gray-700'}`} />
        <h3 className="text-xs text-gray-400">THREAT_LEVEL // OREGON_SECTOR</h3>
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
              level > 50 ? 'text-yellow-500' : 
              level > 0 ? 'text-sovereign' : 'text-gray-800'
            }`}>
              {level > 0 ? `${level}%` : '--%'}
            </span>
          </div>
        </div>

        <div className="bg-black/50 p-3 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-gray-500 uppercase">Protocol Status:</span>
            <span className={`text-[9px] font-bold ${level > 80 ? 'text-strike' : 'text-gray-700'}`}>
              {level > 80 ? 'TITAN_STRIKE_ACTIVE' : level > 0 ? 'PASSIVE_MONITORING' : 'AWAITING_TELEMETRY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
