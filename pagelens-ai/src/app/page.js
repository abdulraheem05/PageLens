"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import AuditResults from './components/AuditResults';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            {/* Professional Branding */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Audit<span className="text-blue-600">AI</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-md mx-auto">
                High-performance website evaluation powered by advanced AI insights.
              </p>
            </div>

            {/* URL Input Form */}
            <form onSubmit={handleAudit} className="w-full max-w-2xl relative">
              <input
                type="url"
                placeholder="https://example.com"
                required
                className="w-full px-6 py-5 rounded-2xl border border-slate-200 shadow-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-8 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:bg-slate-300"
              >
                {loading ? 'Analyzing...' : 'Run Audit'}
              </button>
            </form>
            
            {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
          </motion.div>
        ) : (
          <AuditResults key="results" data={data} onReset={() => setData(null)} />
        )}
      </AnimatePresence>

      {/* Loading Overlay / Splash Effect */}
      {loading && <SplashScreen />}
    </main>
  );
}