import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

const LIGAS_CONFIG = [
  { id: 'soccer_uefa_champions_league', n: '🏆 CHAMPIONS' },
  { id: 'soccer_spain_la_liga', n: '🇪🇸 LALIGA' },
  { id: 'soccer_spain_la_liga_2', n: '🇪🇸 SEGUNDA' },
  { id: 'soccer_epl', n: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER' }
];

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [stats, setStats] = useState({ win: 0, loss: 0 });

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  useEffect(() => {
    const saved = localStorage.getItem('gp_stats_v26');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const updateStats = (type) => {
    const newStats = { ...stats, [type]: stats[type] + 1 };
    setStats(newStats);
    localStorage.setItem('gp_stats_v26', JSON.stringify(newStats));
  };

  // --- MOTOR MATEMÁTICO INTACTO (POISSON + MONTE CARLO) ---
  const runQuantumEngine = (oddL, oddE, oddV) => {
    const ITERATIONS = 10000;
    const probL = 1 / oddL;
    const probV = 1 / oddV;
    const totalExpGols = 2.8; 
    const lambdaL = totalExpGols * (probL / (probL + probV + (1/oddE)));
    const lambdaV = totalExpGols * (probV / (probL + probV + (1/oddE)));

    const getPoisson = (lambda) => {
      let L = Math.exp(-lambda), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    let winL = 0, draw = 0, winV = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      const golesL = getPoisson(lambdaL);
      const golesV = getPoisson(lambdaV);
      if (golesL > golesV) winL++;
      else if (golesL === golesV) draw++;
      else winV++;
    }

    return {
      pL: (winL / 100).toFixed(1), pE: (draw / 100).toFixed(1), pV: (winV / 100).toFixed(1),
      valL: (winL / 10000) * oddL > 1.15, valE: (draw / 10000) * oddE > 1.15, valV: (winV / 10000) * oddV > 1.15,
      elo: (probL / probV).toFixed(2)
    };
  };

  const fetchAllOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    
    // Mapeamos todas las ligas para traer los partidos de todas a la vez
    for (const l of LIGAS_CONFIG) {
      try {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/${l.id}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const results = data.map(m => {
            const b = m.bookmakers[0]; if (!b) return null;
            const out = b.markets[0].outcomes;
            const oL = out.find(o => o.name === m.home_team)?.price;
            const oV = out.find(o => o.name === m.away_team)?.price;
            const oE = out.find(o => o.name === 'Draw' || o.name === 'Draws' || o.name === 'X')?.price;
            if (!oL || !oV || !oE) return null;
            return { 
              id: m.id, home: m.home_team, away: m.away_team, 
              time: new Date(m.commence_time).toLocaleString('es-ES', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}),
              oL, oE, oV, ...runQuantumEngine(oL, oE, oV) 
            };
          }).filter(x => x);
          setAnalysedDb(prev => ({ ...prev, [l.id]: results }));
        }
      } catch (e) { console.error(`Error en ${l.n}:`, e); }
    }
    setIsSimulating(false);
  }, [isVIP]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email.toLowerCase().trim())) { setIsVIP(true); setUser(u); }
      else { setIsVIP(false); setUser(u); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isVIP) fetchAllOdds(); }, [isVIP, fetchAllOdds]);

  const generateAICombo = (risk) => {
    // Busca en todas las ligas cargadas para armar el mejor combo
    const allMatches = Object.values(analysedDb).flat();
    if (allMatches.length < 2) return null;
    let selected = [];
    if (risk === 'Sencilla') selected = allMatches.filter(x => x.oL < 1.7 || x.oV < 1.7).slice(0, 2);
    if (risk === 'Moderada') selected = allMatches.filter(x => x.valL || x.valV).slice(0, 3);
    if (risk === 'Arriesgada') selected = allMatches.filter(x => x.valE || (x.elo < 1.3 && x.valL)).slice(0, 3);
    if (selected.length === 0) selected = allMatches.slice(0, 2);
    
    const odd = selected.reduce((acc, x) => acc * (x.valL ? x.oL : x.valV ? x.oV : x.oE), 1);
    return { selected, odd };
  };

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24', fontFamily:'monospace'}}>GOLPREDICT V26...</div>;

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'80px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <div>
            <h1 style={{color:'#fbbf24', fontSize:'0.9rem', margin:0}}>GOLPREDICT <span style={{color:'#4ade80'}}>QUANTUM</span></h1>
            <div style={{fontSize:'0.5rem', color:'#4ade80'}}>✅ {stats.win} | ❌ {stats.loss}</div>
          </div>
          <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', padding:'6px 12px', borderRadius:'8px', color:'#fff', fontSize:'0.6rem', fontWeight:'bold'}}>CERRAR SESIÓN</button>
        </div>
        
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {LIGAS_CONFIG.map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'8px 15px', borderRadius:'8px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#444', border:'none', fontSize:'0.55rem', fontWeight:'900', whiteSpace:'nowrap'}}>{l.n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos', 'historial'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#444', fontSize:'0.65rem', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {isSimulating && !analysedDb[liga] ? (
          <div style={{color:'#fbbf24', textAlign:'center', padding:'40px'}}>SINCRONIZANDO TODAS LAS LIGAS...</div>
        ) : (
          activeTab === 'partidos' && (
            analysedDb[liga]?.map(p => (
              <div key={p.id} style={{background:'#0c0c0c', padding:'18px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'0.55rem', color:'#444'}}>
                  <span>{p.time}</span>
                  <span style={{color:'#fbbf24'}}>ELO: {p.elo}</span>
                </div>
                <div style={{fontSize:'0.8rem', fontWeight:'900', marginBottom:'15px'}}>{p.home} vs {p.away}</div>
                <div style={{display:'flex', gap:'6px'}}>
                  {[{q:p.oL, p:p.pL, v:p.valL, n:'1'}, {q:p.oE, p:p.pE, v:p.valE, n:'X'}, {q:p.oV, p:p.pV, v:p.valV, n:'2'}].map((o, i) => (
                    <div key={i} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', padding:'12px 0', borderRadius:'15px', textAlign:'center'}}>
                      <div style={{fontSize:'1rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q}</div>
                      <div style={{fontSize:'0.5rem', color:'#555'}}>{o.p}% IA</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        )}
        {/* Secciones de IA Combos e Historial se mantienen igual que la V26 */}
        {activeTab === 'ia combos' && ['Sencilla', 'Moderada', 'Arriesgada'].map(r => {
            const c = generateAICombo(r); if (!c) return null;
            return (
              <div key={r} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #333'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                  <span style={{color: r === 'Arriesgada' ? '#ff4444' : r === 'Moderada' ? '#fbbf24' : '#4ade80', fontWeight:'900', fontSize:'0.8rem'}}>{r.toUpperCase()}</span>
                  <span style={{fontSize:'1.1rem', fontWeight:'bold'}}>@{c.odd.toFixed(2)}</span>
                </div>
                {c.selected.map((s, i) => <div key={i} style={{fontSize:'0.65rem', color:'#888', marginBottom:'5px'}}>• {s.home} vs {s.away}</div>)}
                <div style={{marginTop:'15px', borderTop:'1px solid #222', paddingTop:'15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{fontSize:'0.6rem', color:'#444'}}>STAKE:</span>
                      <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{background:'#111', border:'1px solid #333', color:'#fbbf24', width:'55px', borderRadius:'8px', padding:'5px', textAlign:'center'}} />
                   </div>
                   <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'0.5rem', color:'#444'}}>POTENCIAL</div>
                      <div style={{color:'#4ade80', fontSize:'1.2rem', fontWeight:'bold'}}>{(betAmount * c.odd).toFixed(2)}€</div>
                   </div>
                </div>
              </div>
            );
        })}
        {activeTab === 'historial' && (
          <div style={{textAlign:'center', padding:'30px'}}>
            <div style={{display:'flex', gap:'15px'}}>
               <button onClick={() => updateStats('win')} style={{flex:1, background:'#4ade80', color:'#000', padding:'20px', borderRadius:'15px', border:'none', fontWeight:'900'}}>ACERTADA</button>
               <button onClick={() => updateStats('loss')} style={{flex:1, background:'#ff4444', color:'#fff', padding:'20px', borderRadius:'15px', border:'none', fontWeight:'900'}}>FALLADA</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
