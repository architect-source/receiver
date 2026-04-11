import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export const MeshGrid: React.FC = () => {
  const [nodes, setNodes] = useState<{id: string, active: boolean}[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setNodes([]);
        return;
      }

      const path = 'sectors/oregon/nodes';
      const unsubscribeSnapshot = onSnapshot(collection(db, path), (snapshot) => {
        const nodeData = snapshot.docs.map(doc => ({
          id: doc.id,
          active: doc.data().active
        }));
        setNodes(nodeData);
      }, (error) => {
        if (auth.currentUser) {
          console.error('MeshGrid Firestore Error:', error);
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // Fallback grid if no nodes are in DB
  const displayNodes = nodes.length > 0 ? nodes : Array(64).fill(null).map((_, i) => ({ id: `node_${i}`, active: false }));

  return (
    <div className="bg-metal border border-gray-800 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs text-gray-400">OREGON_SECTOR_MESH // ALPHA_GRID</h3>
        <span className={`text-[10px] animate-pulse ${nodes.length > 0 ? 'text-sovereign' : 'text-strike'}`}>
          {nodes.length > 0 ? 'LIVE_FEED' : 'OFFLINE'}
        </span>
      </div>
      
      <div className="flex-1 grid grid-cols-8 gap-1">
        {displayNodes.map((node, i) => (
          <motion.div
            key={node.id}
            animate={{
              backgroundColor: node.active ? '#1a1a1a' : '#050505',
              borderColor: node.active ? '#333' : '#1a1a1a',
            }}
            className="aspect-square border flex items-center justify-center relative group"
          >
            <div className={`w-1 h-1 rounded-full ${node.active ? 'bg-sovereign shadow-[0_0_5px_rgba(0,255,65,0.5)]' : 'bg-gray-800'}`} />
            
            <div className="absolute hidden group-hover:block bg-black border border-gray-700 p-1 z-20 text-[8px] -top-6 left-0 whitespace-nowrap">
              {node.id.toUpperCase()} // {node.active ? 'STABLE' : 'DISCONNECTED'}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-[9px] text-gray-600 uppercase">
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>Active Nodes:</span>
          <span className="text-white">{nodes.filter(n => n.active).length}/{displayNodes.length}</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>Threat Nodes:</span>
          <span className="text-strike">0</span>
        </div>
      </div>
    </div>
  );
};
