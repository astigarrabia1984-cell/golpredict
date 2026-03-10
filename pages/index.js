import React, { useState, useEffect } from 'react';
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

const FULL_DATABASE = {
  'soccer_uefa_champions_league': [
    { id: 'u1', date: '10.03. 21:00', home: 'Milan', away: 'Benfica', oL: 2.15, oE: 3.40, oV: 3.40 },
    { id: 'u2', date: '10.03. 21:00', home: 'Monaco', away: 'Arsenal', oL: 4.20, oE: 3.75, oV: 1.85 },
    { id: 'u3', date: '11.03. 18:45', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'u4', date: '11.03. 21:00', home: 'Bodo/Glimt', away: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.90 },
    { id: 'u5', date: '11.03. 21:00', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u6', date: '11.03. 21:00', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u7', date: '17.03. 18:45', home: 'Sporting CP', away: 'Bodo/Glimt', oL: 1.45, oE: 4.75, oV: 6.50 },
    { id: 'u10', date: '17.03. 21:00', home: 'Manchester City', away: 'Real Madrid', oL: 1.75, oE: 4.00, oV: 4.50 },
    { id: 'u11', date: '18.03. 18:45', home: 'Barcelona', away: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 }
  ],
  'soccer_spain_la_liga': [
    { id: 'l1', date: '13.03. 21:00', home: 'Alavés', away: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', date: '14.03. 14:00', home: 'Girona', away: 'Athletic Club', oL: 2.40, oE: 3.40, oV: 3.00 },
    { id: 'l3', date: '14.03. 16:15', home: 'Atlético de Madrid', away: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', date: '14.03. 18:30', home: 'Real Oviedo', away: 'Valencia', oL: 3.10, oE: 3.20, oV: 2.45 },
    { id: 'l5', date: '14.03. 21:00', home: 'Real Madrid', away: 'Elche', oL: 1.15, oE: 8.00, oV: 17.00 },
    { id: 'l7', date: '15.03. 16:15', home: 'Barcelona', away: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l11', date: '22.03. 21:00', home: 'Real Madrid', away: 'Atlético de Madrid', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'soccer_epl': [
    { id: 'e1', date: '14.03. 16:00', home: 'Burnley', away: 'Bournemouth', oL: 2.80, oE: 3.40, oV: 2.50 },
    { id: 'e2', date: '14.03. 16:00', home: 'Sunderland', away: 'Brighton', oL: 4.00, oE: 3.75, oV: 1.85 },
    { id: 'e3', date: '14.03. 18:30', home: 'Arsenal', away: 'Everton', oL: 1.25, oE: 6.00, oV: 11.00 },
    { id: 'e4', date: '14.03. 18:30', home: 'Chelsea', away: 'Newcastle', oL: 2.10, oE: 3.60, oV: 3.40 },
    { id: 'e5', date: '14.03. 21:00', home: 'West Ham', away: 'Manchester City', oL: 9.00, oE: 5.50, oV: 1.30 },
    { id: 'e6', date: '15.03. 15:00', home: 'Manchester Utd', away: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e7', date: '15.03. 17:30', home: 'Liverpool', away: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'e8', date: '30.03. 16:00', home: 'Newcastle', away: 'West Ham', oL: 1.85, oE: 4.00, oV: 3.80 },
    { id: 'e9', date: '31.03. 15:00', home: 'Liverpool', away: 'Brighton', oL: 1.36, oE: 5.50, oV: 8.00 },
    { id: 'e10', date: '31.03. 17:30', home: 'Manchester City', away: 'Arsenal', oL: 1.95, oE: 3.70, oV: 3.80 },
    { id: 'e11', date: '04.04. 21:15', home: 'Chelsea', away: 'Manchester Utd', oL: 2.10, oE: 3.80, oV: 3.10 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState([]);

  // --- MOTOR MONTECARLO + POISSON (SIN TOCAR) ---
  const runEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const lA = 2.85 * (pL/(pL+pV+pE)), lB = 2.85 * (pV/(pL+pV+pE));
    const poi = (l) => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while(p>L); return k-1; };
    let wL=0, d=0, wV=0;
    for(let i=0; i<ITER; i++){
      const gA=poi(lA), gB=poi(lB);
      if(gA>gB) wL++; else if(gA===gB) d++; else wV++;
    }
    return {
      pL:(wL/500).toFixed(1), pE:(d/500).toFixed(1), pV:(wV/500).toFixed(1),
      vL:(wL/50000)*oL>1.12, vE:(d/50000)*oE>1.12, vV:(wV/50000)*oV>1.12,
      aiPick: wL>wV && wL>d ? '1' : wV>wL && wV>d ? '2' : 'X'
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_DATABASE).forEach(k => {
      db[k] = FULL_DATABASE[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setAnalysedDb(db);
  }, []);

  const toggleBet = (match, pick, odd) => {
    const betId = `${match.id}-${pick}`;
    if (selectedBets.find(b => b.id === betId)) {
      setSelectedBets(selectedBets.filter(b => b.id !== betId));
    } else {
      const filtered = selectedBets.filter(b => !b.id.startsWith(match.id));
      setSelectedBets([...filtered, { id: betId, match: `${match.home} vs ${match.away}`, pick, odd }]);
    }
  };

  const totalOdd = selectedBets.reduce((acc, b) => acc * b.odd, 1);

  const getComboIA = (risk) => {
    const all = Object.values(analysedDb).flat();
    if(!all.length) return { sel: [], totalOdd: 1 };
    let sel = [];
    if(risk==='Sencilla') sel = all.filter(x => x.oL < 1.6).slice(0,2);
    else if(risk==='Moderada') sel = all.filter(x => x.vL || x.vV).slice(0,3);
    else sel = all.filter(x => x.vE || (x.oL > 2.2 && x.vL)).slice(0,3);
    return { sel, totalOdd: sel.reduce((acc, x) => acc * (x.aiPick==='1'?x.oL:x.aiPick==='2'?x.oV:x.oE), 1) };
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1rem', margin:0}}>GOLPREDICT V43</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.6rem', padding:'5px 10px', borderRadius:'5px', fontWeight:'bold'}}>CERRAR SESIÓN</button>
        </div>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {['🏆 CHAMPIONS', '🇪🇸 LALIGA', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'].map((n, i) => {
            const ids = ['soccer_uefa_champions_league', 'soccer_spain_la_liga', 'soccer_epl'];
            return <button key={i} onClick={() => setLiga(ids[i])} style={{padding:'10px 15px', borderRadius:'10px', background: liga === ids[i] ? '#fbbf24' : '#111', color: liga === ids[i] ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'900', whiteSpace:'nowrap'}}>{n}</button>
          })}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos', 'calculadora'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#555', fontSize:'0.7rem', fontWeight:'bold'}}>{t.toUpperCase()} {t==='calculadora' && `(${selectedBets.length})`}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {activeTab === 'partidos' && analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'20px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'0.7rem'}}>
              <span style={{color:'#fbbf24'}}>{p.date}</span>
              <span style={{color:'#4ade80', fontWeight:'bold'}}>50.000 SIMS OK</span>
            </div>
            <div style={{fontSize:'0.9rem', fontWeight:'900', marginBottom:'15px', textAlign:'center'}}>{p.home} VS {p.away}</div>
            <div style={{display:'flex', gap:'8px'}}>
              {[ {q:p.oL, t:'1'}, {q:p.oE, t:'X'}, {q:p.oV, t:'2'} ].map((o, i) => {
                const isSel = selectedBets.find(b => b.id === `${p.id}-${o.t}`);
                return (
                  <button key={i} onClick={() => toggleBet(p, o.t, o.q)} style={{flex:1, background: isSel ? '#fbbf24' : '#151515', border: '1px solid #333', padding:'12px 0', borderRadius:'15px', textAlign:'center', color: isSel ? '#000' : '#fff', cursor:'pointer'}}>
                    <div style={{fontSize:'1rem', fontWeight:'900'}}>@{o.q.toFixed(2)}</div>
                    <div style={{fontSize:'0.6rem', opacity:0.6}}>{o.t}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {activeTab === 'ia combos' && ['Sencilla', 'Moderada', 'Arriesgada'].map(r => {
          const c = getComboIA(r);
          return (
            <div key={r} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'15px', border:'1px solid #222'}}>
              <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222', paddingBottom:'10px', marginBottom:'10px'}}>
                <span style={{color: r==='Arriesgada'?'#ff4444':r==='Moderada'?'#fbbf24':'#4ade80', fontWeight:'bold'}}>{r.toUpperCase()}</span>
                <span style={{fontWeight:'bold', color:'#4ade80'}}>@{c.totalOdd.toFixed(2)}</span>
              </div>
              {c.sel.map((s,i) => <div key={i} style={{fontSize:'0.75rem', color:'#fff', margin:'8px 0'}}>• {s.home} - {s.away} (Pick: {s.aiPick})</div>)}
            </div>
          );
        })}

        {activeTab === 'calculadora' && (
          <div>
            {selectedBets.length === 0 ? (
              <div style={{textAlign:'center', padding:'40px', color:'#444'}}>SELECCIONA CUOTAS EN LA PESTAÑA PARTIDOS</div>
            ) : (
              <>
                <div style={{marginBottom:'20px'}}>
                  {selectedBets.map(b => (
                    <div key={b.id} style={{background:'#111', padding:'15px', borderRadius:'10px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft:'4px solid #fbbf24'}}>
                      <div><div style={{fontSize:'0.7rem', color:'#fbbf24'}}>{b.match}</div><div style={{fontSize:'0.8rem', fontWeight:'bold'}}>Pick: {b.pick}</div></div>
                      <div style={{fontWeight:'bold'}}>@{b.odd.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'#0c0c0c', padding:'30px', borderRadius:'25px', textAlign:'center', border:'1px solid #fbbf24'}}>
                  <div style={{fontSize:'0.7rem', color:'#666', marginBottom:'10px'}}>DINERO APOSTADO (€)</div>
                  <input type="number" value={betAmount} onChange={(e)=>setBetAmount(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'2rem', width:'120px', textAlign:'center', borderRadius:'15px', padding:'10px', marginBottom:'20px'}} />
                  <div style={{fontSize:'0.7rem', color:'#666'}}>CUOTA TOTAL</div>
                  <div style={{fontSize:'1.5rem', fontWeight:'bold', margin:'10px 0', color:'#4ade80'}}>@{ totalOdd.toFixed(2) }</div>
                  <div style={{background:'#fbbf24', color:'#000', padding:'20px', borderRadius:'15px', marginTop:'20px'}}>
                    <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>GANANCIA POTENCIAL</div>
                    <div style={{fontSize:'2.2rem', fontWeight:'900'}}>{ (betAmount * totalOdd).toFixed(2) }€</div>
                  </div>
                  <button onClick={() => setSelectedBets([])} style={{marginTop:'20px', background:'none', border:'none', color:'#ff4444', textDecoration:'underline', fontSize:'0.7rem', cursor:'pointer'}}>LIMPIAR BOLETO</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
  }
}




                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
