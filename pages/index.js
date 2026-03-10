
  
import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

const FULL_DB = {
  'ucl': [
    { id: 'u1', d: '10.03. 18:45', h: 'Galatasaray', a: 'Liverpool', oL: 3.10, oE: 3.60, oV: 2.20 },
    { id: 'u2', d: '10.03. 21:00', h: 'Atalanta', a: 'Bayern', oL: 3.40, oE: 3.80, oV: 2.00 },
    { id: 'u3', d: '10.03. 21:00', h: 'Atlético', a: 'Tottenham', oL: 2.10, oE: 3.40, oV: 3.50 },
    { id: 'u4', d: '10.03. 21:00', h: 'Newcastle', a: 'Barcelona', oL: 3.20, oE: 3.70, oV: 2.10 },
    { id: 'u5', d: '11.03. 18:45', h: 'Leverkusen', a: 'Arsenal', oL: 2.60, oE: 3.40, oV: 2.70 },
    { id: 'u6', d: '11.03. 21:00', h: 'Bodo/Glimt', a: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.85 },
    { id: 'u7', d: '11.03. 21:00', h: 'PSG', a: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u8', d: '11.03. 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u9', d: '17.03. 18:45', h: 'Sporting CP', a: 'Bodo/Glimt', oL: 1.40, oE: 4.80, oV: 7.50 },
    { id: 'u10', d: '17.03. 21:00', h: 'Arsenal', a: 'Leverkusen', oL: 1.70, oE: 4.00, oV: 4.50 },
    { id: 'u11', d: '17.03. 21:00', h: 'Chelsea', a: 'PSG', oL: 2.50, oE: 3.50, oV: 2.70 },
    { id: 'u12', d: '17.03. 21:00', h: 'Man. City', a: 'Real Madrid', oL: 1.75, oE: 4.10, oV: 4.40 },
    { id: 'u13', d: '18.03. 18:45', h: 'Barcelona', a: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 },
    { id: 'u14', d: '18.03. 21:00', h: 'Bayern', a: 'Atalanta', oL: 1.45, oE: 4.75, oV: 6.00 },
    { id: 'u15', d: '18.03. 21:00', h: 'Liverpool', a: 'Galatasaray', oL: 1.30, oE: 5.50, oV: 9.00 },
    { id: 'u16', d: '18.03. 21:00', h: 'Tottenham', a: 'Atlético', oL: 2.25, oE: 3.40, oV: 3.10 }
  ],
  'laliga': [
    { id: 'l1', d: '13.03. 21:00', h: 'Alavés', a: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', d: '14.03. 14:00', h: 'Girona', a: 'Athletic', oL: 2.40, oE: 3.40, oV: 2.90 },
    { id: 'l3', d: '14.03. 16:15', h: 'Atlético', a: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', d: '14.03. 18:30', h: 'Real Oviedo', a: 'Valencia', oL: 3.20, oE: 3.10, oV: 2.40 },
    { id: 'l5', d: '14.03. 21:00', h: 'Real Madrid', a: 'Elche', oL: 1.15, oE: 8.00, oV: 17.0 },
    { id: 'l6', d: '15.03. 14:00', h: 'Mallorca', a: 'Espanyol', oL: 2.10, oE: 3.10, oV: 3.80 },
    { id: 'l7', d: '15.03. 16:15', h: 'Barcelona', a: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l8', d: '15.03. 18:30', h: 'Betis', a: 'Celta', oL: 2.00, oE: 3.50, oV: 3.70 },
    { id: 'l9', d: '15.03. 21:00', h: 'Real Sociedad', a: 'Osasuna', oL: 1.80, oE: 3.40, oV: 5.00 },
    { id: 'l10', d: '16.03. 21:00', h: 'Rayo', a: 'Levante', oL: 2.20, oE: 3.20, oV: 3.40 },
    { id: 'l11', d: '20.03. 21:00', h: 'Villarreal', a: 'Real Sociedad', oL: 2.45, oE: 3.30, oV: 2.90 },
    { id: 'l12', d: '21.03. 14:00', h: 'Elche', a: 'Mallorca', oL: 2.70, oE: 3.10, oV: 2.80 },
    { id: 'l13', d: '21.03. 16:15', h: 'Espanyol', a: 'Getafe', oL: 2.50, oE: 3.00, oV: 3.10 },
    { id: 'l14', d: '22.03. 21:00', h: 'Real Madrid', a: 'Atlético', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'epl': [
    { id: 'e1', d: '14.03. 16:00', h: 'Burnley', a: 'Bournemouth', oL: 2.60, oE: 3.40, oV: 2.70 },
    { id: 'e2', d: '14.03. 16:00', h: 'Sunderland', a: 'Brighton', oL: 4.50, oE: 3.80, oV: 1.75 },
    { id: 'e3', d: '14.03. 18:30', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.00, oV: 11.0 },
    { id: 'e4', d: '14.03. 21:00', h: 'West Ham', a: 'Man. City', oL: 9.00, oE: 5.50, oV: 1.30 },
    { id: 'e5', d: '15.03. 15:00', h: 'Man. Utd', a: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e6', d: '15.03. 17:30', h: 'Liverpool', a: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'e7', d: '21.03. 13:30', h: 'Brighton', a: 'Liverpool', oL: 4.20, oE: 4.00, oV: 1.75 },
    { id: 'e8', d: '11.04. 13:30', h: 'Arsenal', a: 'Bournemouth', oL: 1.20, oE: 6.50, oV: 13.0 },
    { id: 'e9', d: '12.04. 17:30', h: 'Chelsea', a: 'Man. City', oL: 4.00, oE: 3.80, oV: 1.85 },
    { id: 'e10', d: '19.04. 17:30', h: 'Man. City', a: 'Arsenal', oL: 1.90, oE: 3.75, oV: 3.80 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('ucl');
  const [tab, setTab] = useState('p');
  const [db, setDb] = useState({});
  const [bet, setBet] = useState(10);
  const [sel, setSel] = useState([]);

  const runEngine = (oL, oE, oV) => {
    const ITER = 20000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const totalP = pL + pV + pE;
    const lA = 2.8 * (pL/totalP), lB = 2.8 * (pV/totalP);
    const poi = (l) => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while(p>L); return k-1; };
    let wL=0, d=0, wV=0;
    for(let i=0; i<ITER; i++){
      const gA=poi(lA), gB=poi(lB);
      if(gA>gB) wL++; else if(gA===gB) d++; else wV++;
    }
    return { 
      pL:(wL/(ITER/100)).toFixed(1), 
      pE:(d/(ITER/100)).toFixed(1), 
      pV:(wV/(ITER/100)).toFixed(1), 
      pick: wL>wV && wL>d ? '1' : wV>wL && wV>d ? '2' : 'X' 
    };
  };

  useEffect(() => {
    const newDb = {};
    Object.keys(FULL_DB).forEach(k => {
      newDb[k] = FULL_DB[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setDb(newDb);
  }, []);

  const handleBet = (m, p, o) => {
    const sid = `${m.id}-${p}`;
    if (sel.find(b => b.id === sid)) {
      setSel(sel.filter(b => b.id !== sid));
    } else {
      setSel([...sel.filter(b => !b.id.startsWith(m.id)), { id: sid, name: `${m.h}-${m.a}`, p, o }]);
    }
  };

  const totalOdd = sel.reduce((acc, b) => acc * b.o, 1);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1rem', margin:0}}>GOLPREDICT QUANTUM</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.6rem', padding:'5px 10px', borderRadius:'5px'}}>SALIR</button>
        </div>
        <div style={{display:'flex', gap:'5px'}}>
          {['CHAMPIONS', 'LALIGA', 'PREMIER'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'10px', borderRadius:'8px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#111', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#888', border:'none', fontSize:'0.55rem', fontWeight:'bold'}}>{n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        <button onClick={() => setTab('p')} style={{flex:1, padding:'15px', background:'none', border:'none', color: tab==='p'?'#fbbf24':'#555', borderBottom: tab==='p'?'2px solid #fbbf24':'none'}}>PARTIDOS</button>
        <button onClick={() => setTab('c')} style={{flex:1, padding:'15px', background:'none', border:'none', color: tab==='c'?'#fbbf24':'#555', borderBottom: tab==='c'?'2px solid #fbbf24':'none'}}>TICKET ({sel.length})</button>
      </div>

      <div style={{padding:'10px'}}>
        {tab === 'p' ? db[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'12px', borderRadius:'12px', marginBottom:'10px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'#fbbf24', marginBottom:'8px'}}>
              <span>{p.d}</span><span>IA: {p.pick} ({p.pick==='1'?p.pL:p.pick==='X'?p.pE:p.pV}%)</span>
            </div>
            <div style={{textAlign:'center', fontWeight:'bold', marginBottom:'10px', fontSize:'0.9rem'}}>{p.h} vs {p.a}</div>
            <div style={{display:'flex', gap:'5px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => handleBet(p, o.t, o.q)} style={{flex:1, padding:'8px', borderRadius:'8px', background: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#fbbf24' : '#151515', color: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#000' : '#fff', border:'1px solid #333'}}>
                  <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.5rem'}}>{o.t}</div>
                </button>
              ))}
            </div>
          </div>
        )) : (
          <div style={{padding:'10px'}}>
            {sel.length === 0 ? <p style={{textAlign:'center', color:'#555'}}>No hay apuestas</p> : 
              <div style={{background:'#0c0c0c', padding:'15px', borderRadius:'15px', border:'1px solid #fbbf24'}}>
                {sel.map(b => (
                  <div key={b.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #222', fontSize:'0.75rem'}}>
                    <span>{b.name} <b>({b.p})</b></span><b>@{b.o.toFixed(2)}</b>
                  </div>
                ))}
                <div style={{marginTop:'20px', textAlign:'center'}}>
                  <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'1px solid #fbbf24', color:'#fbbf24', fontSize:'1.2rem', width:'70px', textAlign:'center', marginBottom:'10px'}} />
                  <div style={{color:'#4ade80', fontWeight:'bold'}}>CUOTA: {totalOdd.toFixed(2)}</div>
                  <div style={{background:'#fbbf24', color:'#000', padding:'10px', borderRadius:'8px', marginTop:'10px', fontWeight:'bold'}}>GANANCIA: {(bet * totalOdd).toFixed(2)}€</div>
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
