/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { UserProfile } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import Plans from './Plans';
import AIVision from './AIVision';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userPath = `users/${firebaseUser.uid}`;
        const docRef = doc(db, 'users', firebaseUser.uid);
        try {
          // Tentativa de buscar do servidor diretamente para contornar erro de "offline" persistente
          const docSnap = await getDocFromServer(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (err) {
          console.error("Erro ao carregar perfil do servidor:", err);
          // Fallback para getDoc normal caso seja erro de rede temporário
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            }
          } catch (secondErr) {
            console.error("Erro final ao carregar perfil:", secondErr);
            if (secondErr instanceof Error && (secondErr.message.includes('permission') || secondErr.message.includes('offline'))) {
              try {
                handleFirestoreError(secondErr, OperationType.GET, userPath);
              } catch (jsonErr) {
                console.warn("Firestore error details:", jsonErr);
              }
            }
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route 
          path="/" 
          element={user ? <Dashboard profile={profile} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analysis" 
          element={user ? <Analysis profile={profile} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/plans" 
          element={user ? <Plans /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/ai-vision" 
          element={user ? <AIVision profile={profile} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

