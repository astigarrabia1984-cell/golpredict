import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    { id: 'u1', date: '11.03. 18:45', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'u2', date: '11.03. 21:00', home: 'Bodo/Glimt', away: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.90 },
    { id: 'u3', date: '11.03. 21:00', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u4', date: '11.03. 21:00', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u5', date: '17.03. 18:45', home: 'Sporting CP', away: 'Bodo/Glimt', oL: 1.45, oE: 4.75, oV: 6.50 },
    { id: 'u6', date: '17.03. 21:00', home: 'Arsenal', away: 'Bayer Leverkusen', oL: 1.80, oE: 3.90, oV: 4.20 },
    { id: 'u7', date: '17.03. 21:00', home: 'Chelsea', away: 'PSG', oL: 2.60, oE: 3.50, oV: 2.60 },
    { id: 'u8', date: '17.03. 21:00', home: 'Manchester City', away: 'Real Madrid', oL: 1.75, oE: 4.00, oV: 4.50 },
    { id: 'u9', date: '18.03. 18:45', home: 'Barcelona', away: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 },
    { id: 'u10', date: '18.03. 21:00', home: 'Bayern München', away: 'Atalanta', oL: 1.40, oE: 5.25, oV: 7.00 },
    { id: 'u11', date: '18.03. 21:00', home: 'Liverpool', away: 'Galatasaray', oL: 1.25, oE: 6.50, oV: 10.00 },
    { id: 'u12', date: '18.03. 21:00', home: 'Tottenham', away: 'Atlético de Madrid', oL: 2.30, oE: 3.50, oV: 3.10 }
  ],
  'soccer_spain_la_liga': [
    { id: 'l1', date: '13.03. 21:00', home: 'Alavés', away: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', date: '14.03. 14:00', home: 'Girona', away: 'Athletic Club', oL: 2.40, oE: 3.40, oV: 3.00 },
    { id: 'l3', date: '14.03. 16:15', home: 'Atlético de Madrid', away: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', date: '14.03. 18:30', home: 'Real Oviedo', away: 'Valencia', oL: 3.10, oE: 3.20, oV: 2.45 },
    { id: 'l5', date: '14.03. 21:00', home: 'Real Madrid', away: 'Elche', oL: 1.15, oE: 8.00, oV: 17.00 },
    { id: 'l6', date: '15.03. 14:00', home: 'Mallorca', away: 'Espanyol', oL: 2.10, oE: 3.20, oV: 3.80 },
    { id: 'l7', date: '15.03. 16:15', home: 'Barcelona', away: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l8', date: '15.03. 18:30', home: 'Real Betis', away: 'Celta de Vigo', oL: 2.00, oE: 3.50, oV: 3.75 },
    { id: 'l9', date: '15.03. 21:00', home: 'Real Sociedad', away: 'Osasuna', oL: 1.85, oE: 3.40, oV: 4.50 },
    { id: 'l10', date: '16.03. 21:00', home: 'Rayo Vallecano', away: 'Levante', oL: 2.20, oE: 3.30, oV: 3.40 },
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
    { id: 'e8', date: '31.03. 21:00', home: 'Manchester City', away: 'Arsenal', oL: 1.95, oE: 3.70, oV: 3.80 },
    { id: 'e9', date: '04.04. 21:15', home: 'Chelsea', away: 'Manchester Utd', oL: 2.10, oE: 3.80, oV: 3.10 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [betAmount, setBetAmount] = useState(10);

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
      pick: wL>wV && wL>d ? '1' : wV>wL && wV>d ? '2' : 'X'
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_DATABASE).forEach(k => {
      db[k] = FULL_DATABASE[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setAnalysedDb(db);
  }, []);

  const getCombo = (risk) => {
    const all = Object.values(analysedDb).flat();
    if(!all.length) return null;
    let sel = [];
    if(risk==='Sencilla') sel = all.filter(x => x.oL < 1.6).slice(0,2);
    else if(risk==='Moderada') sel = all.filter(x => x.vL || x.vV).slice(0,3);
    else sel = all.filter(x => x.vE || (x.oL > 2.2 && x.vL)).slice(0,3);
    if(!sel.length) sel = all.slice(0,2);
    const totalOdd = sel.reduce((acc, x) => acc * (x.pick==='1'?x.oL:x.pick==='2'?x.oV:x.oE), 1);
    return { sel, totalOdd };
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'80px'}}>
      
      {/* HEADER */}
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{color:'#fbbf24', fontSize:'1.1rem', textAlign:'center', marginBottom:'15px'}}>GOLPREDICT QUANTUM</h1>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {['🏆 CHAMPIONS', '🇪🇸 LALIGA', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'].map((n, i) => {
            const ids = ['soccer_uefa_champions_league', 'soccer_spain_la_liga', 'soccer_epl'];
            return <button key={i} onClick={() => setLiga(ids[i])} style={{padding:'10px 15px', borderRadius:'10px', background: liga === ids[i] ? '#fbbf24' : '#111', color: liga === ids[i] ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'900', whiteSpace:'nowrap'}}>{n}</button>
          })}
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos', 'calculadora'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#555', fontSize:'0.7rem', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {/* LISTA PARTIDOS */}
        {activeTab === 'partidos' && analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'20px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'0.7rem'}}>
              <span style={{color:'#666'}}>{p.date}</span>
              <span style={{color:'#4ade80', fontWeight:'bold'}}>50K SIMS OK</span>
            </div>
            <div style={{fontSize:'0.95rem', fontWeight:'900', marginBottom:'15px', color:'#fbbf24', textAlign:'center'}}>
              {p.home} <span style={{color:'#fff', opacity:0.3}}>VS</span> {p.away}
            </div>
            <div style={{display:'flex', gap:'8px'}}>
              {[ {q:p.oL, p:p.pL, v:p.vL}, {q:p.oE, p:p.pE, v:p.vE}, {q:p.oV, p:p.pV, v:p.vV} ].map((o, i) => (
                <div key={i} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#151515', border: o.v ? '2px solid #4ade80' : '1px solid #333', padding:'12px 0', borderRadius:'15px', textAlign:'center'}}>
                  <div style={{fontSize:'1.1rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.6rem', color: o.v ? '#4ade80' : '#666'}}>{o.p}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* IA COMBOS */}
        {activeTab === 'ia combos' && ['Sencilla', 'Moderada', 'Arriesgada'].map(r => {
          const c = getCombo(r);
          return (
            <div key={r} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'15px', border:'1px solid #222'}}>
              <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222', paddingBottom:'10px', marginBottom:'10px'}}>
                <span style={{color: r==='Arriesgada'?'#ff4444':r==='Moderada'?'#fbbf24':'#4ade80', fontWeight:'bold'}}>{r.toUpperCase()}</span>
                <span style={{fontWeight:'bold'}}>@{c.totalOdd.toFixed(2)}</span>
              </div>
              {c.sel.map((s,i) => <div key={i} style={{fontSize:'0.7rem', color:'#888', margin:'5px 0'}}>• {s.home} - Pick: {s.pick}</div>)}
            </div>
          );
        })}

        {/* CALCULADORA */}
        {activeTab === 'calculadora' && (
          <div style={{background:'#0c0c0c', padding:'30px', borderRadius:'25px', textAlign:'center', border:'1px solid #fbbf24'}}>
            <div style={{fontSize:'0.7rem', color:'#666', marginBottom:'10px'}}>DINERO APOSTADO</div>
            <input type="number" value={betAmount} onChange={(e)=>setBetAmount(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'2rem', width:'120px', textAlign:'center', borderRadius:'15px', padding:'10px', marginBottom:'20px'}} />
            <div style={{fontSize:'0.7rem', color:'#666'}}>CUOTA TOTAL</div>
            <div style={{fontSize:'1.5rem', fontWeight:'bold', margin:'10px 0'}}>@{ (getCombo('Moderada')?.totalOdd || 0).toFixed(2) }</div>
            <div style={{background:'#fbbf24', color:'#000', padding:'20px', borderRadius:'15px', marginTop:'20px'}}>
              <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>GANANCIA POTENCIAL</div>
              <div style={{fontSize:'2rem', fontWeight:'900'}}>{ (betAmount * (getCombo('Moderada')?.totalOdd || 0)).toFixed(2) }€</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          }



                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
