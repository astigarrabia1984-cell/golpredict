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
  const [stats, setStats] = useState({ win: 0, loss: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [betAmount, setBetAmount] = useState(10);

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // --- MOTOR ULTRA QUANTUM: 50,000 ITERACIONES MONTE CARLO ---
  const runUltraQuantumEngine = (oddL, oddE, oddV) => {
    const ITERATIONS = 50000; // Incrementado a 50,000
    const probL = 1 / oddL; 
    const probV = 1 / oddV;
    const totalExpGols = 2.85; 

    // Poisson Lambda
    const lambdaL = totalExpGols * (probL / (probL + probV + (1/oddE)));
    const lambdaV = totalExpGols * (probV / (probL + probV + (1/oddE)));

    const getPoisson = (l) => {
      let L = Math.exp(-l), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    // Simulación Monte Carlo de alta densidad
    let wL = 0, d = 0, wV = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      const gL = getPoisson(lambdaL);
      const gV = getPoisson(lambdaV);
      if (gL > gV) wL++; 
      else if (gL === gV) d++; 
      else wV++;
    }

    const pL = (wL / (ITERATIONS / 100)).toFixed(1);
    const pE = (d / (ITERATIONS / 100)).toFixed(1);
    const pV = (wV / (ITERATIONS / 100)).toFixed(1);

    return {
      pL, pE, pV,
      valL: (wL / ITERATIONS) * oddL > 1.12,
      valE: (d / ITERATIONS) * oddE > 1.12,
      valV: (wV / ITERATIONS) * oddV > 1.12,
      elo: (probL / probV).toFixed(2),
      pick: wL > wV && wL > d ? 'home' : wV > wL && wV > d ? 'away' : 'draw'
    };
  };

  // --- VALIDACIÓN AUTOMÁTICA DE RESULTADOS ---
  const checkResults = useCallback(async () => {
    if (!isVIP) return;
    try {
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/soccer/scores/?apiKey=${MY_API_KEY}&daysFrom=1`);
      const scores = await res.json();
      const processed = JSON.parse(localStorage.getItem('gp_proc_v29') || '[]');
      let w = 0, l = 0;

      scores.forEach(m => {
        if (m.completed && !processed.includes(m.id)) {
          const pred = localStorage.getItem(`pred_${m.id}`);
          if (pred) {
            const sH = parseInt(m.scores.find(s => s.name === m.home_team)?.score || 0);
            const sA = parseInt(m.scores.find(s => s.name === m.away_team)?.score || 0);
            const resReal = sH > sA ? 'home' : sA > sH ? 'away' : 'draw';
            if (pred === resReal) w++; else l++;
            processed.push(m.id);
          }
        }
      });

      if (w > 0 || l > 0) {
        const newStats = { win: stats.win + w, loss: stats.loss + l };
        setStats(newStats);
        localStorage.setItem('gp_stats_v29', JSON.stringify(newStats));
        localStorage.setItem('gp_proc_v29', JSON.stringify(processed));
      }
    } catch (e) { console.error(e); }
  }, [isVIP, stats]);

  const fetchOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    for (const lig of LIGAS_CONFIG) {
      try {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/${lig.id}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const results = data.map(m => {
            const b = m.bookmakers[0]; if (!b) return null;
            const o = b.markets[0].outcomes;
            const oL = o.find(x => x.name === m.home_team).price;
            const oV = o.find(x => x.name === m.away_team).price;
            const oE = o.find(x => x.name === 'Draw' || x.name === 'X').price;
            const analysis = runUltraQuantumEngine(oL, oE, oV);
            localStorage.setItem(`pred_${m.id}`, analysis.pick);
            return { id: m.id, home: m.home_team, away: m.away_team, oL, oE, oV, ...analysis };
          }).filter(x => x);
          setAnalysedDb(prev => ({ ...prev, [lig.id]: results }));
        }
      } catch (e) { console.error(e); }
    }
    setIsSimulating(false);
    checkResults();
  }, [isVIP, checkResults]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email.toLowerCase().trim())) setIsVIP(true);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isVIP) fetchOdds(); }, [isVIP, fetchOdds]);

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24'}}>MONTE CARLO 50K...</div>;

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'60px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <div>
            <h1 style={{color:'#fbbf24', fontSize:'0.9rem', margin:0}}>GOLPREDICT <span style={{color:'#4ade80'}}>50K</span></h1>
            <div style={{fontSize:'0.55rem', color:'#4ade80'}}>AUTO-WINS: {stats.win} | AUTO-LOSS: {stats.loss}</div>
          </div>
          <button onClick={() => signOut(auth)} style={{background:'#222', border:'1px solid #444', padding:'5px 10px', borderRadius:'5px', color:'#eee', fontSize:'0.5rem'}}>SALIR</button>
        </div>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {LIGAS_CONFIG.map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'8px 12px', borderRadius:'8px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#444', border:'none', fontSize:'0.5rem', fontWeight:'900', whiteSpace:'nowrap'}}>{l.n}</button>
          ))}
        </div>
      </div>

      <div style={{padding:'15px'}}>
        {analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'18px', borderRadius:'20px', marginBottom:'12px', border:'1px solid #1a1a1a'}}>
            <div style={{fontSize:'0.75rem', fontWeight:'900', marginBottom:'12px'}}>{p.home} vs {p.away}</div>
            <div style={{display:'flex', gap:'6px'}}>
              {[ {q:p.oL, p:p.pL, v:p.valL}, {q:p.oE, p:p.pE, v:p.valE}, {q:p.oV, p:p.pV, v:p.valV} ].map((o, i) => (
                <div key={i} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', padding:'10px 0', borderRadius:'12px', textAlign:'center'}}>
                  <div style={{fontSize:'0.9rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q}</div>
                  <div style={{fontSize:'0.5rem', color: o.v ? '#4ade80' : '#555'}}>{o.p}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
    }
    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
