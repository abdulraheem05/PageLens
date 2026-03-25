import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <div className="relative">
        {/* Animated Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
          AI
        </div>
      </div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-6 text-slate-600 font-medium tracking-wide uppercase text-sm"
      >
        Crawling Page & Generating Insights...
      </motion.p>
    </motion.div>
  );
}