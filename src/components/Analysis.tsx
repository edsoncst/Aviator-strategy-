import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, LayoutDashboard, BarChart3, CreditCard, Zap, LogOut, Info } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion } from 'motion/react';

export default function Analysis({ profile }: { profile: UserProfile | null }) {
  const [stats, setStats] = useState({
    purplePercent: 18.2,
    pinkPercent: 2.1,
    avgPurpleInterval: 4, // minutes
    avgPinkInterval: 42, // minutes
    todayHigh: 342.12
  });

  const handleSignOut = () => signOut(auth);

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
          <Link to="/" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/analysis" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20">
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
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Estatísticas e Tendências</h1>
            <p className="text-slate-400">Análise de tempo entre velas e probabilidades.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-purple-400 font-bold uppercase tracking-widest text-xs">Velas Roxas (2x+)</span>
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="text-6xl font-black mb-1">{stats.purplePercent}%</div>
              <p className="text-slate-500 text-sm mb-8">Ocorrem a cada {stats.avgPurpleInterval} minutos em média</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase text-slate-500 px-1">
                  <span>Probabilidade Próximo Ciclo</span>
                  <span>Alta</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[85%]"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-pink-400 font-bold uppercase tracking-widest text-xs">Velas Rosas (10x+)</span>
                <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="text-6xl font-black mb-1">{stats.pinkPercent}%</div>
              <p className="text-slate-500 text-sm mb-8">Ocorrem a cada {stats.avgPinkInterval} minutos em média</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase text-slate-500 px-1">
                  <span>Probabilidade Próximo Ciclo</span>
                  <span>Baixa</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full w-[15%]"></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8">Tabela de Horários Sugeridos</h3>
            <div className="space-y-4">
              {[
                { time: '12:15', type: 'purple', chance: '90%' },
                { time: '12:42', type: 'pink', chance: '65%' },
                { time: '13:05', type: 'purple', chance: '88%' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold font-mono">{row.time}</div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${row.type === 'pink' ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {row.type}
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm font-medium">Confiança: <span className="text-white">{row.chance}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
