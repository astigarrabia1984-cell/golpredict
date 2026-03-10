import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const MY_API_KEY = '695217108b2d5b5c02822e3dd4d6ce26'; 

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('soccer_spain_la_liga');
  const [analysedDb, setAnalysedDb] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [selections, setSelections] = useState([]);
  const [activeTab, setActiveTab] = useState('mercado');

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
  const CONTACT_NUMBER = "34618923117";

  // --- NÚCLEO MATEMÁTICO (ELO + POISSON + MONTE CARLO) ---
  const runDeepAnalysis = (oddL, oddE, oddV) => {
    const ITERATIONS = 10000;
    const implL = 1 / oddL;
    const implV = 1 / oddV;
    const eloFactor = (implL / implV);

    let lambdaL = (2.7 * (implL / (implL + implV + (1/oddE)))) * 1.1; 
    let lambdaV = (2.7 * (implV / (implL + implV + (1/oddE))));

    let winsL = 0, draws = 0, winsV = 0;
    const getPoisson = (l) => {
      let L = Math.exp(-l), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    for (let i = 0; i < ITERATIONS; i++) {
      const gL = getPoisson(lambdaL);
      const gV = getPoisson(lambdaV);
      if (gL > gV) winsL++;
      else if (gL === gV) draws++;
      else winsV++;
    }

    const pL = (winsL / ITERATIONS) * 100;
    const pE = (draws / ITERATIONS) * 100;
    const pV = (winsV / ITERATIONS) * 100;

    return { 
      pL, pE, pV, 
      valL: (pL / 100) * oddL > 1.12, 
      valE: (pE / 100) * oddE > 1.12, 
      valV: (pV / 100) * oddV > 1.12, 
      eloFactor: eloFactor.toFixed(2) 
    };
  };

  const fetchLiveOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    try {
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${liga}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const processed = data.map(match => {
          const bookie = match.bookmakers[0];
          if (!bookie) return null;
          const outcomes = bookie.markets[0].outcomes;
          const oL = outcomes.find(o => o.name === match.home_team)?.price;
          const oV = outcomes.find(o => o.name === match.away_team)?.price;
          const oE = outcomes.find(o => o.name === 'Draw')?.price;
          if (!oL || !oV || !oE) return null;

          const stats = runDeepAnalysis(oL, oE, oV);
          return { id: match.id, home: match.home_team, away: match.away_team, oL, oE, oV, ...stats };
        }).filter(x => x !== null);
        setAnalysedDb(prev => ({ ...prev, [liga]: processed }));
      }
    } catch (e) { console.error(e); }
    setIsSimulating(false);
  }, [liga, isVIP]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email.toLowerCase().trim())) {
        setIsVIP(true); setUser(u);
      } else { setIsVIP(false); setUser(u); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isVIP) fetchLiveOdds(); }, [liga, isVIP, fetchLiveOdds]);

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24', fontFamily:'monospace'}}>GOLPREDICT V14.1...</div>;

  if (!user || !isVIP) return (
    <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'30px', fontFamily:'monospace'}}>
      <h2 style={{color:'#fbbf24'}}>ACCESO RESTRINGIDO</h2>
      <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', padding:'15px 30px', border:'none', borderRadius:'10px', fontWeight:'900', marginBottom:'15px'}}>INICIAR SESIÓN</button>
      <button onClick={() => window.open(`https://wa.me/${CONTACT_NUMBER}?text=Quiero%20ser%20VIP`, '_blank')} style={{background:'#25D366', color:'#fff', border:'none', padding:'15px 30px', borderRadius:'10px', fontWeight:'900'}}>SOLICITAR VIP</button>
    </div>
  );

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{color:'#fbbf24', fontSize:'1rem'}}>GOLPREDICT <span style={{color:'#4ade80'}}>MAX</span></h1>
        <button onClick={() => signOut(auth)} style={{color:'#ff4444', background:'none', border:'none', fontSize:'0.6rem'}}>LOGOUT</button>
      </div>

      <div style={{display:'flex', gap:'8px', padding:'15px', overflowX:'auto'}}>
        {[{id:'soccer_spain_la_liga', n:'ESP'}, {id:'soccer_epl', n:'ENG'}, {id:'soccer_uefa_champions_league', n:'UCL'}].map(l => (
          <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'10px', borderRadius:'5px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'900'}}>{l.n}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {isSimulating ? <p style={{color:'#fbbf24', textAlign:'center', fontSize:'0.6rem'}}>EJECUTANDO TRIPLE MOTOR IA...</p> : (
          analysedDb[liga]?.map(p => (
            <div key={p.id} style={{background:'#080808', padding:'15px', borderRadius:'15px', marginBottom:'12px', border:'1px solid #1a1a1a'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{fontSize:'0.75rem', fontWeight:'900'}}>{p.home} v {p.away}</span>
                <span style={{fontSize:'0.5rem', color:'#fbbf24'}}>ELO: {p.eloFactor}</span>
              </div>
              <div style={{display:'flex', gap:'5px'}}>
                {[{l:'1', q:p.oL, p:p.pL, v:p.valL}, {l:'X', q:p.oE, p:p.pE, v:p.valE}, {l:'2', q:p.oV, p:p.pV, v:p.valV}].map(o => (
                  <button key={o.l} onClick={() => setSelections([...selections, p])} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', color:'#fff', padding:'10px 5px', borderRadius:'10px'}}>
                    <div style={{fontSize:'0.85rem', fontWeight:'900'}}>@{o.q}</div>
                    <div style={{fontSize:'0.55rem', color: o.v ? '#4ade80' : '#444'}}>{o.p.toFixed(1)}%</div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{position:'fixed', bottom:0, width:'100%', maxWidth:'480px', background:'#050505', display:'flex', borderTop:'1px solid #222', padding:'15px 0'}}>
        <button onClick={() => setActiveTab('mercado')} style={{flex:1, color: activeTab === 'mercado' ? '#fbbf24' : '#444', background:'none', border:'none', fontWeight:'900'}}>PREDICCIONES</button>
        <button onClick={() => setActiveTab('ticket')} style={{flex:1, color: activeTab === 'ticket' ? '#fbbf24' : '#444', background:'none', border:'none', fontWeight:'900'}}>TICKET ({selections.length})</button>
      </div>
    </div>
  );
}

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
