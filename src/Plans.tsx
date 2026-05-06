import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, LayoutDashboard, BarChart3, CreditCard, Zap, LogOut, Check } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Plans() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignOut = () => signOut(auth).then(() => navigate('/login'));

  const selectPlan = async (plan: 'monthly' | 'annual') => {
    if (!auth.currentUser) return;
    setLoading(plan);
    
    const userPath = `users/${auth.currentUser.uid}`;
    
    // Simulate payment process
    setTimeout(async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (plan === 'monthly' ? 1 : 12));
        
        await updateDoc(userRef, {
          plan: plan,
          expiresAt: expiresAt.toISOString()
        });
        alert(`Plano ${plan === 'monthly' ? 'Mensal' : 'Anual'} ativado com sucesso!`);
        navigate('/');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, userPath);
      } finally {
        setLoading(null);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
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
          <Link to="/analysis" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <BarChart3 size={20} /> Análise Pro
          </Link>
          <Link to="/ai-vision" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <Camera size={20} /> IA Vision
          </Link>
          <Link to="/plans" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20">
            <CreditCard size={20} /> Planos
          </Link>
        </div>
        <div className="pt-6 border-t border-slate-800">
           <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-16 text-center">
            <h1 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">Escolha seu Acesso</h1>
            <p className="text-slate-400 max-w-lg mx-auto">Libere sinais ilimitados e análise de tendências em tempo real para maximizar seus resultados.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Mensal</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">R$ 19,90</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Sinais ilimitados', 'Análise de velas roxas', 'Robô 24h', 'Suporte VIP'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="bg-purple-600/20 p-1 rounded-full"><Check size={12} className="text-purple-400" /></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => selectPlan('monthly')}
                disabled={loading !== null}
                className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                {loading === 'monthly' ? 'Processando...' : 'Começar Agora'}
              </button>
            </motion.div>

            {/* Annual Plan */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 border-2 border-purple-600 rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden shadow-[0_0_40px_-10px_rgba(147,51,234,0.3)]"
            >
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black uppercase tracking-tighter px-4 py-2 rounded-bl-2xl">
                Melhor Valor
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Anual</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">R$ 100,00</span>
                  <span className="text-slate-500 text-sm">/ano</span>
                </div>
                <p className="text-purple-400 text-xs font-bold mt-2">Economize R$ 138,80 por ano</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Sinais prioritários', 'Análise de velas rosas', 'Estatísticas completas', 'Acesso antecipado', 'Suporte 24/7'].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="bg-purple-600/20 p-1 rounded-full"><Check size={12} className="text-purple-400" /></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => selectPlan('annual')}
                disabled={loading !== null}
                className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50"
              >
                {loading === 'annual' ? 'Processando...' : 'Obter Agora'}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
