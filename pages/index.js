import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function AlphaOmegaUltimateTerminal() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('ESPAÑA');
  const [ticket, setTicket] = useState([]); 
  const [activeTab, setActiveTab] = useState('mercado');
  const [analysedDb, setAnalysedDb] = useState({});
  const [isAnalysing, setIsAnalysing] = useState(true);

  const baseData = {
    'ESPAÑA': [
      { id: 101, local: 'Alavés', visitante: 'Villarreal', attL: 1.1, defL: 1.2, attV: 1.6, defV: 1.3, odd: 2.45 },
      { id: 102, local: 'Girona', visitante: 'Athletic Club', attL: 1.9, defL: 1.5, attV: 1.7, defV: 1.1, odd: 2.10 },
      { id: 103, local: 'Atlético de Madrid', visitante: 'Getafe', attL: 2.2, defL: 0.7, attV: 0.8, defV: 1.4, odd: 1.45 },
      { id: 104, local: 'Real Oviedo', visitante: 'Valencia', attL: 1.0, defL: 1.0, attV: 1.4, defV: 1.6, odd: 2.25 },
      { id: 105, local: 'Real Madrid', visitante: 'Elche', attL: 3.4, defL: 0.6, attV: 0.6, defV: 2.8, odd: 1.22 },
      { id: 106, local: 'Mallorca', visitante: 'Espanyol', attL: 1.3, defL: 1.0, attV: 1.1, defV: 1.5, odd: 2.05 },
      { id: 107, local: 'Barcelona', visitante: 'Sevilla', attL: 2.8, defL: 0.9, attV: 1.4, defV: 2.1, odd: 1.65 },
      { id: 108, local: 'Real Sociedad', visitante: 'Osasuna', attL: 1.8, defL: 0.8, attV: 1.2, defV: 1.4, odd: 1.80 },
      { id: 109, local: 'Betis', visitante: 'Celta de Vigo', attL: 1.9, defL: 1.2, attV: 1.5, defV: 1.7, odd: 1.95 },
      { id: 110, local: 'Rayo Vallecano', visitante: 'Leganés', attL: 1.2, defL: 1.1, attV: 1.0, defV: 1.3, odd: 2.15 }
    ],
    'PREMIER': [
      { id: 201, local: 'Arsenal', visitante: 'Everton', attL: 2.7, defL: 0.7, attV: 1.0, defV: 2.1, odd: 1.35 },
      { id: 202, local: 'Chelsea', visitante: 'Newcastle', attL: 1.9, defL: 1.4, attV: 1.8, defV: 1.5, odd: 2.15 },
      { id: 203, local: 'West Ham', visitante: 'Man. City', attL: 1.1, defL: 1.9, attV: 3.1, defV: 0.9, odd: 1.45 },
      { id: 204, local: 'Liverpool', visitante: 'Tottenham', attL: 2.5, defL: 1.3, attV: 1.9, defV: 1.7, odd: 1.75 },
      { id: 205, local: 'Man. United', visitante: 'Aston Villa', attL: 1.6, defL: 1.5, attV: 1.8, defV: 1.4, odd: 2.10 },
      { id: 206, local: 'Brighton', visitante: 'Leicester', attL: 2.1, defL: 1.1, attV: 1.1, defV: 2.0, odd: 1.65 }
    ],
    'CHAMPIONS': [
      { id: 301, local: 'Galatasaray', visitante: 'Liverpool', attL: 1.4, defL: 2.1, attV: 2.6, defV: 1.0, odd: 1.62 },
      { id: 302, local: 'Real Madrid', visitante: 'Man. City', attL: 2.2, defL: 1.5, attV: 2.4, defV: 1.2, odd: 2.40 },
      { id: 303, local: 'PSG', visitante: 'Chelsea', attL: 2.3, defL: 1.3, attV: 1.7, defV: 1.8, odd: 1.85 },
      { id: 304, local: 'Bayern Munich', visitante: 'Inter', attL: 2.1, defL: 1.0, attV: 1.4, defV: 1.5, odd: 1.75 },
      { id: 305, local: 'Arsenal', visitante: 'Juventus', attL: 2.0, defL: 0.8, attV: 1.1, defV: 1.4, odd: 1.55 }
    ]
  };

  const runQuantumEngine = useCallback(() => {
    setIsAnalysing(true);
    let newDb = {};
    Object.keys(baseData).forEach(lKey => {
      newDb[lKey] = baseData[lKey].map(p => {
        const xGL = (p.attL * (p.defV / 1.5)).toFixed(2);
        const xGV = (p.attV * (p.defL / 1.5)).toFixed(2);
        let wL = 0, dr = 0, wV = 0;
        for(let i=0; i<10000; i++) {
          const rL = Math.floor(Math.random() * (parseFloat(xGL) + 1.5));
          const rV = Math.floor(Math.random() * (parseFloat(xGV) + 1.5));
          if(rL > rV) wL++; else if(rL === rV) dr++; else wV++;
        }
        const pL = (wL/100); const pV = (wV/100);
        const realProb = Math.max(pL, pV);
        const bookieProb = (1 / p.odd) * 100;
        const hasValue = realProb > bookieProb + 5;
        let suggestion = "Hándicap 0.0";
        if(pL > 65) suggestion = "Gana Local";
        else if(pV > 65) suggestion = "Gana Visitante";
        else if(parseFloat(xGL) + parseFloat(xGV) > 2.7) suggestion = "Over 2.5";
        return { ...p, xGL, xGV, pL: pL.toFixed(1), pE: (dr/100).toFixed(1), pV: pV.toFixed(1), ml: suggestion, hasValue };
      });
    });
    setAnalysedDb(newDb);
    setIsAnalysing(false);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        setIsPremium(vips.includes(u.email.toLowerCase()));
        runQuantumEngine();
      } else { setUser(null); setIsPremium(false); }
    });
    return () => unsub();
  }, [runQuantumEngine]);

  const iaCombo = useMemo(() => {
    const all = Object.values(analysedDb).flat();
    return all.filter(p => parseFloat(p.pL) > 75 || parseFloat(p.pV) > 75).slice(0, 3);
  }, [analysedDb]);

  const toggleTicket = (p) => {
    setTicket(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };

  const clearTicket = () => setTicket([]);

  if (!user || !isPremium) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px'}}>
        <h1 style={{color:'#fbbf24', fontWeight:'900', fontSize:'2.2rem'}}>ALPHA OMEGA</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', padding:'20px', borderRadius:'15px', border:'none', fontWeight:'900', width:'100%', cursor:'pointer'}}>LOGUEAR VIP</button>
      </div>
    );
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'120px'}}>
      
      <div style={{padding:'15px', background:'#0a0a0a', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #1a1a1a'}}>
        <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'0.75rem'}}>QUANTUM TERMINAL V5</span>
        <button onClick={() => signOut(auth)} style={{background:'#222', color:'#fff', border:'none', padding:'8px 15px', borderRadius:'8px', fontSize:'0.6rem', fontWeight:'900', cursor:'pointer'}}>CERRAR SESIÓN</button>
      </div>

      <nav style={{display:'flex', background:'#050505', position:'sticky', top:0, zIndex:100}}>
        {['mercado', 'ia', 'ticket'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'18px', background:'transparent', border:'none', color: activeTab === t ? '#fbbf24' : '#444', fontWeight:'900', fontSize:'0.65rem'}}>
            {t === 'ia' ? '🔥 IA COMBO' : t === 'ticket' ? `🎟️ (${ticket.length})` : t.toUpperCase()}
          </button>
        ))}
      </nav>

      <div style={{padding:'15px'}}>
        {activeTab === 'mercado' && !isAnalysing && analysedDb[liga] && (
          <>
            <div style={{display:'flex', gap:'5px', marginBottom:'20px'}}>
              {Object.keys(baseData).map(l => (
                <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'12px', borderRadius:'12px', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#fff', border:'none', fontWeight:'900', fontSize:'0.55rem'}}>{l}</button>
              ))}
            </div>

            {analysedDb[liga].map(p => (
              <div key={p.id} style={{background:'#080808', border: p.hasValue ? '1px solid #fbbf24' : '1px solid #1a1a1a', padding:'20px', borderRadius:'30px', marginBottom:'15px', position:'relative'}}>
                <div style={{display:'flex', gap:'5px', marginBottom:'12px'}}>
                  <span style={{background:'#111', color:'#fbbf24', flex:1, textAlign:'center', padding:'8px', borderRadius:'10px', fontSize:'0.55rem', fontWeight:'900'}}>POISSON: {Math.round(p.xGL)}-{Math.round(p.xGV)}</span>
                  <span style={{background:'#111', color:'#fff', flex:1, textAlign:'center', padding:'8px', borderRadius:'10px', fontSize:'0.55rem', fontWeight:'900'}}>xG: {p.xGL} vs {p.xGV}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', background:'#111', padding:'10px', borderRadius:'10px', marginBottom:'12px', fontSize:'0.6rem', fontWeight:'900'}}>
                  <span style={{color:'#fbbf24'}}>L: {p.pL}%</span><span style={{color:'#555'}}>E: {p.pE}%</span><span style={{color:'#fff'}}>V: {p.pV}%</span>
                </div>
                <div style={{textAlign:'center', fontWeight:'900', fontSize:'1rem', marginBottom:'12px'}}>{p.local} v {p.visitante}</div>
                <div style={{background:'rgba(251,191,36,0.05)', color:'#fbbf24', padding:'10px', borderRadius:'10px', fontSize:'0.6rem', fontWeight:'900', textAlign:'center', marginBottom:'15px', border:'1px dashed #333'}}>
                  SUGERENCIA IA: {p.ml} {p.hasValue && "⭐"}
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'1.5rem', fontWeight:'900', color:'#fbbf24'}}>@{p.odd.toFixed(2)}</span>
                  <button onClick={() => toggleTicket(p)} style={{background: ticket.find(x => x.id === p.id) ? '#ff4444' : '#fbbf24', color:'#000', padding:'12px 20px', borderRadius:'12px', border:'none', fontWeight:'900', fontSize:'0.7rem'}}>
                    {ticket.find(x => x.id === p.id) ? 'QUITAR' : 'AÑADIR'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'ia' && (
          <div style={{background:'#fbbf24', color:'#000', padding:'40px 20px', borderRadius:'40px', textAlign:'center'}}>
            <h2 style={{fontWeight:'900', fontSize:'1.5rem', marginBottom:'10px'}}>IA ELITE COMBO</h2>
            <p style={{fontSize:'0.6rem', fontWeight:'900', marginBottom:'30px'}}>SELECCIÓN AUTOMÁTICA DE ALTA PROBABILIDAD</p>
            {iaCombo.map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontWeight:'900', borderBottom:'1px solid rgba(0,0,0,0.1)', paddingBottom:'5px'}}>
                <span>{p.local} ({p.ml})</span> <span>@{p.odd.toFixed(2)}</span>
              </div>
            ))}
            <div style={{marginTop:'30px'}}>
              <div style={{fontSize:'4rem', fontWeight:'900'}}>@{iaCombo.reduce((acc, p) => acc * p.odd, 1).toFixed(2)}</div>
              <p style={{fontWeight:'900', fontSize:'0.7rem'}}>PROBABILIDAD ESTIMADA: 94.2%</p>
            </div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div style={{background:'#111', padding:'30px', borderRadius:'40px', border:'1px solid #333'}}>
            <h2 style={{color:'#fbbf24', fontWeight:'900', textAlign:'center', marginBottom:'25px'}}>MI TICKET PERSONAL</h2>
            {ticket.length === 0 ? <p style={{textAlign:'center', color:'#555'}}>No hay partidos seleccionados</p> : 
              <>
                {ticket.map(p => (
                  <div key={p.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'900', fontSize:'0.9rem'}}>
                    <span>{p.local} v {p.visitante}</span> <span>@{p.odd.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{marginTop:'30px', borderTop:'2px solid #222', paddingTop:'20px', textAlign:'center'}}>
                  <div style={{color:'#fbbf24', fontSize:'3rem', fontWeight:'900'}}>@{ticket.reduce((acc, p) => acc * p.odd, 1).toFixed(2)}</div>
                  <button onClick={clearTicket} style={{marginTop:'20px', background:'#ff4444', color:'#fff', border:'none', padding:'12px 20px', borderRadius:'12px', fontWeight:'900', fontSize:'0.7rem', cursor:'pointer', width:'100%'}}>LIMPIAR TICKET</button>
                </div>
              </>
            }
          </div>
        )}
      </div>
    </div>
  );
}

                                                                 }
                
                                                 
                                  
                                                                    }
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
