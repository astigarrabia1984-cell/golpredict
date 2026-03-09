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

export default function AlphaOmegaQuantum() {
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
      { id: 204, local: 'Liverpool', visitante: 'Tottenham', attL: 2.5, defL: 1.3, attV: 1.9, defV: 1.7, odd: 1.75 }
    ],
    'CHAMPIONS': [
      { id: 301, local: 'Galatasaray', visitante: 'Liverpool', attL: 1.4, defL: 2.1, attV: 2.6, defV: 1.0, odd: 1.62 },
      { id: 302, local: 'Real Madrid', visitante: 'Man. City', attL: 2.2, defL: 1.5, attV: 2.4, defV: 1.2, odd: 2.40 }
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
        
        const pL = (wL/100).toFixed(1);
        const pE = (dr/100).toFixed(1);
        const pV = (wV/100).toFixed(1);
        
        let winner = "Empate Proyectado";
        if(parseFloat(pL) > parseFloat(pV) && parseFloat(pL) > parseFloat(pE)) winner = p.local;
        if(parseFloat(pV) > parseFloat(pL) && parseFloat(pV) > parseFloat(pE)) winner = p.visitante;

        return { ...p, xGL, xGV, pL, pE, pV, winner };
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
      } else {
        setUser(null);
        setIsPremium(false);
      }
    });
    return () => unsub();
  }, [runQuantumEngine]);

  const iaCombo = useMemo(() => {
    const all = Object.values(analysedDb).flat();
    return all.filter(p => parseFloat(p.pL) > 70 || parseFloat(p.pV) > 70).slice(0, 3);
  }, [analysedDb]);

  if (!user || !isPremium) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1 style={{color:'#fbbf24', fontWeight:'900'}}>ALPHA OMEGA</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', padding:'15px 30px', borderRadius:'10px', border:'none', fontWeight:'900', cursor:'pointer'}}>LOGIN VIP</button>
      </div>
    );
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      <div style={{padding:'15px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #222'}}>
        <span style={{color:'#fbbf24', fontWeight:'900'}}>MONTECARLO V5</span>
        <button onClick={() => signOut(auth)} style={{background:'#333', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'5px', fontSize:'0.7rem'}}>CERRAR</button>
      </div>

      <div style={{display:'flex', background:'#0a0a0a'}}>
        {['mercado', 'ia', 'ticket'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', color: activeTab === t ? '#fbbf24' : '#555', fontWeight:'900', fontSize:'0.7rem'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {activeTab === 'mercado' && !isAnalysing && analysedDb[liga] && (
          <>
            <div style={{display:'flex', gap:'5px', marginBottom:'20px'}}>
              {Object.keys(baseData).map(l => (
                <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'10px', borderRadius:'8px', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#fff', border:'none', fontSize:'0.6rem', fontWeight:'900'}}>{l}</button>
              ))}
            </div>

            {analysedDb[liga].map(p => (
              <div key={p.id} style={{background:'#0a0a0a', padding:'20px', borderRadius:'25px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
                <div style={{textAlign:'center', color:'#fbbf24', fontSize:'0.6rem', fontWeight:'900', marginBottom:'10px'}}>GANADOR PROYECTADO: {p.winner.toUpperCase()}</div>
                
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', textAlign:'center'}}>
                   <div style={{flex:1}}>
                      <div style={{fontSize:'0.6rem', color:'#555'}}>LOCAL</div>
                      <div style={{fontWeight:'900', color:'#fff'}}>{p.pL}%</div>
                   </div>
                   <div style={{flex:1, borderLeft:'1px solid #222', borderRight:'1px solid #222'}}>
                      <div style={{fontSize:'0.6rem', color:'#555'}}>EMPATE</div>
                      <div style={{fontWeight:'900', color:'#fff'}}>{p.pE}%</div>
                   </div>
                   <div style={{flex:1}}>
                      <div style={{fontSize:'0.6rem', color:'#555'}}>VISITA</div>
                      <div style={{fontWeight:'900', color:'#fff'}}>{p.pV}%</div>
                   </div>
                </div>

                <div style={{textAlign:'center', fontWeight:'900', fontSize:'1.1rem', marginBottom:'15px'}}>{p.local} vs {p.visitante}</div>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#fbbf24', fontWeight:'900'}}>@{p.odd}</span>
                  <button onClick={() => setTicket([...ticket, p])} style={{background:'#fbbf24', color:'#000', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'900', fontSize:'0.7rem'}}>AÑADIR</button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'ia' && (
          <div style={{background:'#fbbf24', color:'#000', padding:'30px', borderRadius:'30px', textAlign:'center'}}>
            <h2 style={{fontWeight:'900'}}>COMBINADA IA ELITE</h2>
            {iaCombo.map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', margin:'10px 0', fontWeight:'900', fontSize:'0.8rem'}}>
                <span>{p.local} - GANA</span> <span>@{p.odd}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ticket' && (
          <div style={{background:'#111', padding:'20px', borderRadius:'20px'}}>
             <h2 style={{color:'#fbbf24', textAlign:'center'}}>MI TICKET</h2>
             {ticket.map((p, i) => <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0'}}>{p.local} <span>@{p.odd}</span></div>)}
             {ticket.length > 0 && <button onClick={() => setTicket([])} style={{width:'100%', background:'#ff4444', color:'#fff', border:'none', padding:'10px', marginTop:'20px', borderRadius:'10px', fontWeight:'900'}}>LIMPIAR TODO</button>}
          </div>
        )}
      </div>
    </div>
  );
}

                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
