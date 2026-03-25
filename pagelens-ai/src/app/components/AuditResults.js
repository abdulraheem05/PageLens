import { motion } from 'framer-motion';
import { 
  FileText, Layout, MousePointer, Link2, Image as ImageIcon, 
  AlertCircle, CheckCircle2, ChevronRight, Terminal, Globe 
} from 'lucide-react';

export default function AuditResults({ data, onReset }) {
  const { metrics, aiResponse, promptLog } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit Report</h2>
          <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
            <Globe size={16} /> {data.url}
          </p>
        </div>
        <button 
          onClick={onReset} 
          className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          ← Run New Analysis
        </button>
      </div>

      {/* Factual Metrics Grid [cite: 16, 17] */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Factual Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTile icon={<FileText className="text-blue-500" />} label="Word Count" value={metrics.wordCount} /> {/* [cite: 18] */}
          <MetricTile icon={<Layout className="text-indigo-500" />} label="Headings (H1-H3)" value={`${metrics.headings.h1} / ${metrics.headings.h2} / ${metrics.headings.h3}`} /> {/* [cite: 19] */}
          <MetricTile icon={<MousePointer className="text-emerald-500" />} label="Total CTAs" value={metrics.ctaCount} /> {/* [cite: 20] */}
          <MetricTile icon={<ImageIcon className="text-orange-500" />} label="Total Images" value={metrics.images.total} /> {/* [cite: 21] */}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main AI Insights Column [cite: 25] */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 size={120} />
            </div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-blue-600 p-1.5 rounded-lg text-white"><CheckCircle2 size={18} /></span>
              Prioritized Recommendations {/* [cite: 37, 39] */}
            </h3>
            
            <div className="space-y-4 relative z-10">
              {aiResponse.recommendations.map((rec, i) => (
                <div key={i} className="group p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{rec.title}</p>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{rec.reasoning}</p> {/* [cite: 40] */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning Trace/Logs [cite: 47, 53] */}
          <details className="group bg-slate-900 rounded-[1.5rem] overflow-hidden transition-all">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span className="flex items-center gap-3 text-slate-400 font-mono text-sm">
                <Terminal size={16} /> Prompt Logs & Reasoning Trace
              </span>
              <ChevronRight className="text-slate-500 group-open:rotate-90 transition-transform" size={16} />
            </summary>
            <div className="p-6 pt-0 font-mono text-[11px] leading-relaxed text-emerald-400 border-t border-slate-800 max-h-[400px] overflow-y-auto">
              <pre className="whitespace-pre-wrap">{promptLog}</pre> {/* [cite: 48, 52] */}
            </div>
          </details>
        </div>

        {/* Technical Sidebar */}
        <div className="space-y-6">
          {/* Secondary Metrics [cite: 20, 22] */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Content Health</h4>
            <div className="space-y-4">
              <HealthItem 
                label="Accessibility (Alt Text)" 
                value={`${(100 - metrics.images.altPercent).toFixed(0)}%`} 
                isWarning={metrics.images.altPercent > 20} 
              />
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 flex items-center gap-2"><Link2 size={14} /> Internal Links</span>
                <span className="font-bold">{metrics.links.internal}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 flex items-center gap-2"><Link2 size={14} /> External Links</span>
                <span className="font-bold">{metrics.links.external}</span>
              </div>
            </div>
          </div>

          {/* Meta Information [cite: 23] */}
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Meta Tags</h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Page Title</span>
                <p className="text-sm font-semibold text-slate-800 mt-1">{metrics.meta.title}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{metrics.meta.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricTile({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function HealthItem({ label, value, isWarning }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        {isWarning ? <AlertCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-emerald-500'}`} 
          style={{ width: value }}
        />
      </div>
      <p className="text-right text-[10px] font-bold mt-1 text-slate-400">{value} Score</p>
    </div>
  );
}