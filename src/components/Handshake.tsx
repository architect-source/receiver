import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Unlock, Cpu } from 'lucide-react';

export const Handshake: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VALIDATING' | 'SECURE'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setStatus('IDLE');
        setProgress(0);
        await new Promise(r => setTimeout(r, 2000));
        
        setStatus('SCANNING');
        for (let i = 0; i <= 100; i += 2) {
          setProgress(i);
          await new Promise(r => setTimeout(r, 50));
        }
        
        setStatus('VALIDATING');
        await new Promise(r => setTimeout(r, 1500));
        
        setStatus('SECURE');
        await new Promise(r => setTimeout(r, 5000));
      }
    };
    sequence();
  }, []);

  return (
    <div className="bg-metal border border-gray-800 p-6 flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div className="scanline" />
      
      <div className="mb-8 relative">
        <motion.div
          animate={{
            rotate: status === 'SCANNING' ? 360 : 0,
            scale: status === 'SECURE' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5, repeat: Infinity }
          }}
          className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
            status === 'SECURE' ? 'border-sovereign shadow-[0_0_20px_rgba(0,255,65,0.3)]' :
            status === 'VALIDATING' ? 'border-yellow-500' :
            status === 'SCANNING' ? 'border-strike border-dashed' :
            'border-gray-800'
          }`}
        >
          {status === 'SECURE' ? (
            <Shield className="w-16 h-16 text-sovereign" />
          ) : status === 'VALIDATING' ? (
            <Cpu className="w-16 h-16 text-yellow-500 animate-pulse" />
          ) : (
            <Lock className={`w-16 h-16 ${status === 'SCANNING' ? 'text-strike' : 'text-gray-700'}`} />
          )}
        </motion.div>
        
        {status === 'SCANNING' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-2 border-strike rounded-full"
          />
        )}
      </div>

      <div className="text-center z-10">
        <h3 className={`text-xl mb-2 ${
          status === 'SECURE' ? 'text-sovereign glitch-text' :
          status === 'STRIKE' ? 'text-strike' :
          'text-white'
        }`}>
          {status === 'IDLE' && 'WAITING FOR HARDWARE'}
          {status === 'SCANNING' && 'SCANNING FREQUENCY'}
          {status === 'VALIDATING' && 'KINETIC VALIDATION'}
          {status === 'SECURE' && 'SOVEREIGN HANDSHAKE ACTIVE'}
        </h3>
        
        <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden mb-2">
          <motion.div
            className={`h-full ${status === 'SECURE' ? 'bg-sovereign' : 'bg-strike'}`}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          {status === 'SECURE' ? 'AES-256 // HARDWARE-BOUND // WINSTON-7' : 'ENCRYPTION LAYER: STANDBY'}
        </p>
      </div>

      <div className="absolute top-2 left-2 text-[8px] text-gray-700 font-mono">
        AUTH_METHOD: 5-AND-3_NON_LINEAR
      </div>
    </div>
  );
};
