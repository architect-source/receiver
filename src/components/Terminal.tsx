import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'STRIKE';
  message: string;
}

export const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: '1', timestamp: new Date().toISOString(), type: 'INFO', message: 'AZRAEL CORE INITIALIZED' },
      { id: '2', timestamp: new Date().toISOString(), type: 'INFO', message: 'WINSTON SECTOR MESH: ONLINE' },
      { id: '3', timestamp: new Date().toISOString(), type: 'INFO', message: 'HARDWARE HANDSHAKE: PENDING' },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const types: LogEntry['type'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'STRIKE'];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = {
        INFO: [
          'Scanning regional nodes...',
          'Metadata fingerprint verified.',
          'Sovereign loopback latency: 12ms',
          'Encrypted packet received.',
        ],
        WARN: [
          'Unrecognized ISP signature detected.',
          'Latency spike in Winston Sector 7.',
          'Credential theft attempt neutralized.',
        ],
        ERROR: [
          'Vampire cluster detected in ng_node_alpha.',
          'Kinetic validation mismatch.',
          'Handshake timeout.',
        ],
        STRIKE: [
          'TITAN STRIKE 10X INITIATED.',
          'Recursive drain active on node 192.168.1.104.',
          'CPU exhaustion protocol: 98% load forced.',
        ],
      };

      const msgList = messages[type];
      const message = msgList[Math.floor(Math.random() * msgList.length)];

      setLogs(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type,
        message
      }].slice(-50));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-metal border border-gray-800 h-full flex flex-col overflow-hidden">
      <div className="bg-gray-900 px-3 py-1 flex justify-between items-center border-b border-gray-800">
        <span className="text-[10px] font-bold text-gray-500">SYSTEM_LOGS // AZRAEL_CORE</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-700 rounded-full" />
          <div className="w-2 h-2 bg-gray-700 rounded-full" />
          <div className="w-2 h-2 bg-gray-700 rounded-full" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1 flex gap-3"
            >
              <span className="text-gray-600">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={`font-bold ${
                log.type === 'INFO' ? 'text-gray-400' :
                log.type === 'WARN' ? 'text-yellow-500' :
                log.type === 'ERROR' ? 'text-red-500' :
                'text-strike glitch-text'
              }`}>
                {log.type}
              </span>
              <span className={log.type === 'STRIKE' ? 'text-white font-bold' : 'text-gray-300'}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
