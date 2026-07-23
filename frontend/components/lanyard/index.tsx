'use client';

import dynamic from 'next/dynamic';

// Three.js / WebGL components MUST be dynamically imported to avoid SSR errors
const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default Lanyard;
