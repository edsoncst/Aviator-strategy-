import { useState, useEffect } from 'react';
import { Camera, MessageCircle, LogOut, LayoutDashboard, BarChart3, CreditCard, Loader2, Zap } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Signal } from '../types';

export default function Dashboard({ profile }: { profile: UserProfile | null }) {
  const navigate = useNavigate();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<Signal[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simulate historical data on load
  useEffect(() => {
    const initialHistory: Signal[] = Array.from({ length: 15 }).map((_, i) => {
      const mult = Math.random() < 0.2 ? (Math.random() * 20 + 10) : (Math.random() * 8 + 1.2);
      return {
        id: Math.random().toString(36).substr(2, 9),
        multiplier: Number(mult.toFixed(2)),
        type: mult >= 10 ? 'pink' : mult >= 2 ? 'purple' : 'low',
        timestamp: new Date(Date.now() - i * 60000).toISOString()
      };
    });
    setHistory(initialHistory);
  }, []);

  // Timer logic for countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSignOut = () => signOut(auth);

  const generateSignal = () => {
    if (profile?.plan === 'free' && history.length > 20) {
      alert('Limite de sinais gratuitos atingido. Evolua seu plano!');
      return;
    }

    setGenerating(true);
    setSignal(null);
    setCountdown(null);

    // Simulate analysis time based on requested "minutes" logic
    setTimeout(() => {
      const isPink = Math.random() < 0.1;
      const isPurple = !isPink && Math.random() < 0.7;
      
      let mult;
      if (isPink) mult = Math.random() * 40 + 10;
      else if (isPurple) mult = Math.random() * 5 + 2;
      else mult = Math.random() * 0.8 + 1.1;

      const newSignal: Signal = {
        id: Math.random().toString(36).substr(2, 9),
        multiplier: Number(mult.toFixed(2)),
        type: mult >= 10 ? 'pink' : mult >= 2 ? 'purple' : 'low',
        timestamp: new Date().toISOString()
      };
      
      setSignal(newSignal);
      setHistory(prev => [newSignal, ...prev.slice(0, 19)]);
      setGenerating(false);
      
      // Artificial "wait" until next opportunity as requested (e.g. 4 mins average)
      setCountdown(Math.floor(Math.random() * 60) + 120); // 2-3 mins countdown
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Aviator Pro</span>
        </div>

        <div className="flex-1 space-y-2">
          <Link to="/" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/analysis" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <BarChart3 size={20} /> Análise Pro
          </Link>
          <Link to="/ai-vision" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <Camera size={20} /> IA Vision
          </Link>
          <Link to="/plans" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <CreditCard size={20} /> Planos
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-purple-400">
              {profile?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{profile?.email || 'Usuário'}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Plano {profile?.plan || 'Free'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-left">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto">
        {/* Floating WhatsApp Support */}
        <a 
          href="https://wa.me/5500000000000" 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all active:scale-90 flex items-center gap-2 group"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">
            Suporte VIP
          </span>
        </a>

        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Painel de Sinais</h1>
            <p className="text-slate-400">IA analisando padrões para velas roxas e rosas.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative text-center">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Status do Algoritmo</h2>
                  
                  <div className="min-h-[220px] flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      {generating ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                          </div>
                          <p className="text-purple-400 animate-pulse font-bold tracking-wider">PROCESSANDO DADOS...</p>
                        </motion.div>
                      ) : signal ? (
                        <motion.div 
                          key="signal"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center"
                        >
                          <div className={`text-7xl md:text-9xl font-black mb-4 tracking-tighter filter drop-shadow-lg ${signal.type === 'pink' ? 'text-pink-500' : 'text-purple-500'}`}>
                            {signal.multiplier}x
                          </div>
                          <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${signal.type === 'pink' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                            {signal.type === 'pink' ? 'Vela Rosa Identificada' : 'Vela Roxa Identificada'}
                          </div>
                          {countdown !== null && (
                            <p className="mt-6 text-slate-500 text-xs font-medium">Re-análise automática em {countdown}s</p>
                          )}
                        </motion.div>
                      ) : (
                        <div className="text-slate-600 flex flex-col items-center gap-4">
                          <Zap size={48} className="opacity-20" />
                          <p className="font-medium">Pronto para iniciar nova análise.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={generateSignal}
                    disabled={generating || countdown !== null}
                    className="mt-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-purple-900/20 transition-all active:scale-95 disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                  >
                    Hackear Algoritmo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Assertividade</p>
                  <p className="text-2xl font-black text-green-400">97.8%</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Intervalo Roxa</p>
                  <p className="text-2xl font-black text-purple-400">4 min</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl col-span-2 md:col-span-1">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Intervalo Rosa</p>
                  <p className="text-2xl font-black text-pink-400">42 min</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col h-[600px]">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 px-2 text-slate-400">
                <Zap size={14} className="text-purple-500" /> Histórico
              </h2>
              <div className="flex-1 overflow-y-auto space-y-3 px-1 scrollbar-hide">
                {history.map((s, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/30 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-800/60 transition-all">
                    <div>
                      <p className={`font-black text-xl tracking-tight ${s.type === 'pink' ? 'text-pink-500' : s.type === 'purple' ? 'text-purple-500' : 'text-slate-400'}`}>
                        {s.multiplier}x
                      </p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase">{new Date(s.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${s.type === 'pink' ? 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]' : s.type === 'purple' ? 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]' : 'bg-slate-700'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
