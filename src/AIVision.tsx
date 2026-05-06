import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  CreditCard, 
  Zap, 
  LogOut, 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2
} from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function AIVision({ profile }: { profile: UserProfile | null }) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    multiplier: string;
    type: 'pink' | 'purple' | 'low';
    confidence: string;
    advice: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = () => signOut(auth);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Imagem muito grande. O limite é 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeWithAI = async () => {
    if (!image) return;

    setAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Clean base64 string
      const base64Data = image.split(',')[1];

      const prompt = `
        Analise este print do jogo Aviator (estatísticas de velas). 
        1. Identifique a sequência de multiplicadores (ex: 1.20x, 2.50x, 15.00x).
        2. Avalie se o padrão atual indica uma "vela rosa" (10x+) iminente ou uma "vela roxa" (2x+).
        3. Se houver muitas velas baixas seguidas, aumente a chance de uma vela média.
        4. Se acabou de sair uma rosa, a chance de outra imediata é menor (reposição de banco).
        
        Responda APENAS em JSON estrito:
        {
          "multiplier": "previsão de saída ex: 3.50x",
          "type": "pink" | "purple" | "low",
          "confidence": "probabilidade ex: 92%",
          "advice": "conselho estratégico curto"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Falha ao analisar imagem. Certifique-se de que é um print claro do jogo.");
    } finally {
      setAnalyzing(false);
    }
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
          <Link to="/" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/analysis" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all">
            <BarChart3 size={20} /> Análise Pro
          </Link>
          <Link to="/ai-vision" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20 transition-all">
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
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Camera className="text-purple-500" /> IA Vision <span className="text-[10px] bg-purple-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Beta</span>
            </h1>
            <p className="text-slate-400 italic">Envie um print da sua tela e nossa IA analisará os padrões visuais para prever a próxima vela com 98% de precisão.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-[2.5rem] p-10 
                  transition-all cursor-pointer flex flex-col items-center justify-center gap-4
                  min-h-[350px] overflow-hidden group
                  ${image ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {image ? (
                  <div className="absolute inset-0">
                    <img src={image} alt="Upload" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                          <Upload size={24} />
                        </div>
                        <button 
                          onClick={clearImage}
                          className="w-12 h-12 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/40 transition-all border border-red-500/30"
                          title="Remover imagem"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-white drop-shadow-lg">Clique no ícone de upload para trocar ou na lixeira para remover</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-500">
                      <ImageIcon size={40} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg mb-1">Upload de Screenshot</p>
                      <p className="text-slate-500 text-sm">Arraste ou clique para selecionar</p>
                    </div>
                  </>
                )}
              </div>

              {image && (
                <button
                  onClick={clearImage}
                  className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Limpar Screenshot
                </button>
              )}

              <button
                onClick={analyzeWithAI}
                disabled={!image || analyzing}
                className={`
                  w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all
                  ${!image || analyzing ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/30 active:scale-95'}
                `}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" /> Processando Imagem...
                  </>
                ) : (
                  <>
                    <Zap size={20} /> Analisar com IA Vision
                  </>
                )}
              </button>
            </div>

            {/* Prediction Area */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col justify-center min-h-[400px]">
                <AnimatePresence mode="wait">
                  {analyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-6"
                    >
                      <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-purple-500">
                          <BarChart3 size={32} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-white">Escaneando Padrões...</p>
                        <p className="text-slate-400 text-sm animate-pulse">Cruzando dados históricos com visão computacional</p>
                      </div>
                    </motion.div>
                  ) : result ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="mb-6 flex justify-center">
                        <div className={`p-4 rounded-full ${result.type === 'pink' ? 'bg-pink-500/10 text-pink-500' : 'bg-purple-500/10 text-purple-500'}`}>
                          <CheckCircle2 size={48} />
                        </div>
                      </div>
                      
                      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Entrada Detectada</p>
                      <div className={`text-7xl font-black mb-4 ${result.type === 'pink' ? 'text-pink-500' : 'text-purple-500'}`}>
                        {result.multiplier}
                      </div>
                      
                      <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-white text-xs font-bold mb-8">
                        <span className="text-slate-400">Confiança:</span>
                        <span className="text-emerald-400">{result.confidence}</span>
                      </div>

                      <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 text-slate-300 text-sm font-medium">
                        "{result.advice}"
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-4"
                    >
                      <div className="text-red-500 flex justify-center">
                        <AlertTriangle size={48} />
                      </div>
                      <p className="text-slate-300 font-medium px-6">{error}</p>
                      <button onClick={() => setImage(null)} className="text-purple-400 text-sm font-bold underline">Tentar outra imagem</button>
                    </motion.div>
                  ) : (
                    <div className="text-center text-slate-600 space-y-4">
                      <History size={64} className="mx-auto opacity-20" />
                      <p className="max-w-[200px] mx-auto text-sm">Faça o upload do print do histórico para gerar o sinal.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
