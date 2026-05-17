'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const startAudit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult('');

    // URL'ni tekshiramiz: agar foydalanuvchi http/https yozmagan bo'lsa, avtomatik qo'shamiz
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // 🚀 localhost o'rniga Render'dagi jonli backend manzilingiz o'rnatildi
    const backendUrl = `https://vdx-saas.onrender.com/api/v1/audit?url=${encodeURIComponent(cleanUrl)}&lang=uz`;
    const eventSource = new EventSource(backendUrl);

    eventSource.onmessage = (event) => {
      // Kelayotgan ma'lumot bo'laklarini yig'ib boramiz (Streaming effekti)
      // Ba'zan backend 'data: \n' yuborsa, ortiqcha joy tashlamasligi uchun formatlaymiz
      setResult((prev) => prev + event.data + '\n');
    };

    eventSource.onerror = (err) => {
      console.error("Stream ulana olmadi yoki tugadi:", err);
      eventSource.close();
      setLoading(false);
    };
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-900 relative">
      {/* Orqa fon uchun chiroyli kiber-effekt bezaklari */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Sarlavha qismi */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            🛡️ AI Security Core Active
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-400 mb-4">
            VDX AI // Cyber Auditor
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Veb-saytingiz xavfsizlik holatini real vaqt rejimida skaner qiling va sun'iy intellekt yordamida tuzatish kodlariga ega bo'ling.
          </p>
        </div>

        {/* URL kiritish shakli */}
        <form onSubmit={startAudit} className="bg-slate-900/60 backdrop-blur-md p-4 border border-slate-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Masalan: google.com yoki https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-white font-mono transition-colors"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className="sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Audit qilinmoqda...
              </span>
            ) : 'Auditni boshlash'}
          </button>
        </form>

        {/* Natijalarni ko'rsatish paneli */}
        {result && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Live System Output</span>
              </div>
              <span className="text-xs text-cyan-400 font-mono">Gemini 2.5 Flash</span>
            </div>
            <div className="p-6 md:p-8 max-w-none">
              {/* Natija terminal uslubida chiqishi uchun */}
              <pre className="whitespace-pre-wrap font-mono text-slate-200 leading-relaxed text-xs md:text-sm bg-black/50 p-4 rounded-xl border border-slate-800 max-h-[600px] overflow-y-auto">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
    }
    
