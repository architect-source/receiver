import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLogs([]);
        return;
      }

      const path = 'sectors/oregon/logs';
      const q = query(
        collection(db, path),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const newLogs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LogEntry[];
        
        setLogs(newLogs.reverse());
      }, (error) => {
        // Only handle if it's not a permission error due to logging out
        if (auth.currentUser) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-metal border border-gray-800 h-full flex flex-col overflow-hidden">
      <div className="bg-gray-900 px-3 py-1 flex justify-between items-center border-b border-gray-800">
        <span className="text-[10px] font-bold text-gray-500">SYSTEM_LOGS // OREGON_SECTOR</span>
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${logs.length > 0 ? 'bg-sovereign animate-pulse' : 'bg-strike animate-pulse'}`} />
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
              <span className="text-gray-600">[{log.timestamp.includes('T') ? log.timestamp.split('T')[1].split('.')[0] : '00:00:00'}]</span>
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
        {logs.length === 0 && (
          <div className="mt-4 text-strike animate-pulse font-bold">
            [!] NO DATA DETECTED. CONNECT PHYSICAL RECEIVER OR AUTHENTICATE.
          </div>
        )}
      </div>
    </div>
  );
};
