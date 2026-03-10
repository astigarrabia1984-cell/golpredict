import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

// --- BASE DE DATOS INTEGRAL DESDE TUS CAPTURAS ---
const FULL_CAPTURE_DATA = {
  'soccer_uefa_champions_league': [
    { id: 'ucl_1', home: 'Galatasaray', away: 'Liverpool', oL: 3.40, oE: 3.80, oV: 2.10 },
    { id: 'ucl_2', home: 'Atalanta', away: 'Bayern München', oL: 2.80, oE: 3.50, oV: 2.45 },
    { id: 'ucl_3', home: 'Atlético de Madrid', away: 'Tottenham', oL: 2.15, oE: 3.40, oV: 3.30 },
    { id: 'ucl_4', home: 'Newcastle', away: 'Barcelona', oL: 2.60, oE: 3.60, oV: 2.50 },
    { id: 'ucl_5', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'ucl_6', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'ucl_7', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 }
  ],
  'soccer_spain_la_liga': [
    { id: 'll_28_1', home: 'Alavés', away: 'Villarreal', oL: 2.50, oE: 3.30, oV: 2.80 },
    { id: 'll_28_2', home: 'Girona', away: 'Athletic Club', oL: 2.30, oE: 3.40, oV: 3.10 },
    { id: 'll_28_3', home: 'Atlético de Madrid', away: 'Getafe', oL: 1.45, oE: 4.33, oV: 7.50 },
    { id: 'll_28_4', home: 'Real Madrid', away: 'Elche', oL: 1.18, oE: 7.00, oV: 15.00 },
    { id: 'll_28_5', home: 'Barcelona', away: 'Sevilla', oL: 1.55, oE: 4.20, oV: 5.75 },
    { id: 'll_29_1', home: 'Villarreal', away: 'Real Sociedad', oL: 2.40, oE: 3.25, oV: 3.00 },
    { id: 'll_29_2', home: 'Real Madrid', away: 'Atlético de Madrid', oL: 2.05, oE: 3.50, oV: 3.50 },
    { id: 'll_29_3', home: 'Espanyol', away: 'Getafe', oL: 2.20, oE: 3.10, oV: 3.60 },
    { id: 'll_29_4', home: 'Girona', away: 'Elche', oL: 1.50, oE: 4.20, oV: 6.50 }
  ],
  'soccer_epl': [
    { id: 'epl_1', home: 'Arsenal', away: 'Everton', oL: 1.25, oE: 6.00, oV: 11.00 },
    { id: 'epl_2', home: 'Chelsea', away: 'Newcastle', oL: 1.90, oE: 3.80, oV: 3.70 },
    { id: 'epl_3', home: 'Manchester Utd', away: 'Aston Villa', oL: 2.10, oE: 3.70, oV: 3.20 },
    { id: 'epl_4', home: 'Liverpool', away: 'Tottenham', oL: 1.85, oE: 4.00, oV: 3.80 },
    { id: 'epl_5', home: 'Manchester City', away: 'Arsenal', oL: 2.00, oE: 3.60, oV: 3.60 },
    { id: 'epl_6', home: 'Leicester', away: 'Manchester Utd', oL: 3.20, oE: 3.50, oV: 2.20 },
    { id: 'epl_7', home: 'West Ham', away: 'Arsenal', oL: 5.50, oE: 4.20, oV: 1.57 },
    { id: 'epl_8', home: 'Brighton', away: 'Manchester City', oL: 6.00, oE: 4.50, oV: 1.50 }
  ]
};

export default function GolpredictPro() {
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [stats, setStats] = useState({ win: 0, loss: 0 });
  const [betAmount, setBetAmount] = useState(10);

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // --- MOTOR MATEMÁTICO 50.000 ITERACIONES (ESTRICTAMENTE IGUAL) ---
  const runUltraQuantumEngine = (oddL, oddE, oddV) => {
    const ITERATIONS = 50000;
    const probL = 1 / oddL; const probV = 1 / oddV;
    const lambdaL = 2.85 * (probL / (probL + probV + (1/oddE)));
    const lambdaV = 2.85 * (probV / (probL + probV + (1/oddE)));
    const getPoisson = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; };
    let wL = 0, d = 0, wV = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      const gL = getPoisson(lambdaL); const gV = getPoisson(lambdaV);
      if (gL > gV) wL++; else if (gL === gV) d++; else wV++;
    }
    return {
      pL: (wL / 500).toFixed(1), pE: (d / 500).toFixed(1), pV: (wV / 500).toFixed(1),
      valL: (wL / 50000) * oddL > 1.12, valE: (d / 50000) * oddE > 1.12, valV: (wV / 50000) * oddV > 1.12,
      elo: (probL / probV).toFixed(2),
      pick: wL > wV && wL > d ? 'home' : wV > wL && wV > d ? 'away' : 'draw'
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_CAPTURE_DATA).forEach(lId => {
      db[lId] = FULL_CAPTURE_DATA[lId].map(m => ({
        ...m,
        ...runUltraQuantumEngine(m.oL, m.oE, m.oV)
      }));
    });
    setAnalysedDb(db);
    
    const savedStats = localStorage.getItem('gp_stats_v33');
    if (savedStats) setStats(JSON.parse(savedStats));
    
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email?.toLowerCase().trim())) setIsVIP(true);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const generateAICombo = (risk) => {
    const all = Object.values(analysedDb).flat();
    if (all.length < 2) return null;
    let sel = [];
    if (risk === 'Sencilla') sel = all.filter(x => x.oL < 1.6).slice(0, 2);
    if (risk === 'Moderada') sel = all.filter(x => x.valL || x.valV).slice(0, 3);
    if (risk === 'Arriesgada') sel = all.filter(x => x.valE || x.elo < 1.3).slice(0, 3);
    if (sel.length < 2) sel = all.slice(0, 2);
    const odd = sel.reduce((acc, x) => acc * (x.pick === 'home' ? x.oL : x.pick === 'away' ? x.oV : x.oE), 1);
    return { sel, odd };
  };

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24'}}>FINAL CHECK V33...</div>;

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'60px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <div>
            <h1 style={{color:'#fbbf24', fontSize:'0.9rem', margin:0}}>GOLPREDICT <span style={{color:'#4ade80'}}>QUANTUM</span></h1>
            <div style={{fontSize:'0.55rem', color:'#4ade80'}}>STABLE MODE: {stats.win}W - {stats.loss}L</div>
          </div>
          <button onClick={() => signOut(auth)} style={{background:'#222', border:'1px solid #444', padding:'5px 10px', borderRadius:'5px', color:'#eee', fontSize:'0.5rem'}}>SALIR</button>
        </div>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {[{id:'soccer_uefa_champions_league', n:'🏆 CHAMPIONS'}, {id:'soccer_spain_la_liga', n:'🇪🇸 LALIGA'}, {id:'soccer_epl', n:'🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'}].map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'10px 15px', borderRadius:'10px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#444', border:'none', fontSize:'0.55rem', fontWeight:'900', whiteSpace:'nowrap'}}>{l.n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#444', fontSize:'0.6rem', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {activeTab === 'partidos' && analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'18px', borderRadius:'20px', marginBottom:'12px', border:'1px solid #1a1a1a'}}>
            <div style={{fontSize:'0.75rem', fontWeight:'900', marginBottom:'12px'}}>{p.home} vs {p.away}</div>
            <div style={{display:'flex', gap:'6px'}}>
              {[ {q:p.oL, p:p.pL, v:p.valL}, {q:p.oE, p:p.pE, v:p.valE}, {q:p.oV, p:p.pV, v:p.valV} ].map((o, i) => (
                <div key={i} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', padding:'10px 0', borderRadius:'12px', textAlign:'center'}}>
                  <div style={{fontSize:'0.85rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.5rem'}}>{o.p}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {activeTab === 'ia combos' && ['Sencilla', 'Moderada', 'Arriesgada'].map(r => {
          const c = generateAICombo(r); if (!c) return null;
          return (
            <div key={r} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #333'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{color: r === 'Arriesgada' ? '#ff4444' : r === 'Moderada' ? '#fbbf24' : '#4ade80', fontWeight:'900', fontSize:'0.8rem'}}>{r.toUpperCase()}</span>
                <span style={{fontSize:'1.1rem', fontWeight:'bold'}}>@{c.odd.toFixed(2)}</span>
              </div>
              {c.sel.map((s, i) => <div key={i} style={{fontSize:'0.65rem', color:'#aaa', marginBottom:'5px'}}>• {s.home} - {s.pick.toUpperCase()} (@{s.pick==='home'?s.oL:s.pick==='away'?s.oV:s.oE})</div>)}
              <div style={{marginTop:'15px', borderTop:'1px solid #222', paddingTop:'15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{background:'#111', border:'1px solid #333', color:'#fbbf24', width:'55px', borderRadius:'8px', padding:'5px', textAlign:'center'}} />
                 <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.5rem', color:'#444'}}>PROYECCIÓN</div>
                    <div style={{color:'#4ade80', fontSize:'1.2rem', fontWeight:'bold'}}>{(betAmount * c.odd).toFixed(2)}€</div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
