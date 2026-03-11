import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);

const FULL_DB = {
  'ucl': [
    // RESULTADOS REALES DEL 10 DE MARZO
    { id: 'u1', d: '10.03. 18:45', h: 'Galatasaray', a: 'Liverpool', oL: 3.10, oE: 3.60, oV: 2.20, status: 'won', res: '1-2', pick: '2' },
    { id: 'u2', d: '10.03. 21:00', h: 'Atalanta', a: 'Bayern', oL: 3.40, oE: 3.80, oV: 2.00, status: 'won', res: '0-2', pick: '2' },
    { id: 'u3', d: '10.03. 21:00', h: 'AtlÃ©tico', a: 'Tottenham', oL: 2.10, oE: 3.40, oV: 3.50, status: 'lost', res: '0-0', pick: '1' },
    { id: 'u4', d: '10.03. 21:00', h: 'Newcastle', a: 'Barcelona', oL: 3.20, oE: 3.70, oV: 2.10, status: 'won', res: '1-3', pick: '2' },
    // PARTIDOS DE HOY 11 DE MARZO (PENDIENTES)
    { id: 'u5', d: '11.03. 18:45', h: 'Leverkusen', a: 'Arsenal', oL: 2.60, oE: 3.40, oV: 2.70, status: 'pending' },
    { id: 'u6', d: '11.03. 21:00', h: 'Bodo/Glimt', a: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.85, status: 'pending' },
    { id: 'u7', d: '11.03. 21:00', h: 'PSG', a: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60, status: 'pending' },
    { id: 'u8', d: '11.03. 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40, status: 'pending' }
  ],
  'laliga': [
    { id: 'l1', d: '13.03. 21:00', h: 'AlavÃ©s', a: 'Villarreal', oL: 2.85, oE: 3.30, oV: 2.55, status: 'pending' },
    { id: 'l2', d: '14.03. 14:00', h: 'Girona', a: 'Athletic', oL: 2.45, oE: 3.40, oV: 2.95, status: 'pending' },
    { id: 'l3', d: '14.03. 16:15', h: 'AtlÃ©tico', a: 'Getafe', oL: 1.57, oE: 4.00, oV: 6.25, status: 'pending' },
    { id: 'l4', d: '14.03. 18:30', h: 'Real Oviedo', a: 'Valencia', oL: 3.10, oE: 3.10, oV: 2.45, status: 'pending' },
    { id: 'l5', d: '14.03. 21:00', h: 'Real Madrid', a: 'Elche', oL: 1.18, oE: 7.50, oV: 15.0, status: 'pending' },
    { id: 'l6', d: '15.03. 14:00', h: 'Mallorca', a: 'Espanyol', oL: 2.05, oE: 3.20, oV: 4.10, status: 'pending' },
    { id: 'l7', d: '15.03. 16:15', h: 'Barcelona', a: 'Sevilla', oL: 1.38, oE: 5.25, oV: 8.00, status: 'pending' },
    { id: 'l14', d: '22.03. 21:00', h: 'Real Madrid', a: 'AtlÃ©tico', oL: 1.90, oE: 3.70, oV: 4.00, status: 'pending' }
  ],
  'epl': [
    { id: 'e1', d: '14.03. 13:30', h: 'Man. City', a: 'Brighton', oL: 1.30, oE: 5.80, oV: 9.50, status: 'pending' },
    { id: 'e3', d: '14.03. 16:00', h: 'Newcastle', a: 'Leicester', oL: 1.55, oE: 4.30, oV: 6.00, status: 'pending' },
    { id: 'e5', d: '14.03. 18:30', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.25, oV: 12.0, status: 'pending' },
    { id: 'e7', d: '15.03. 17:30', h: 'Liverpool', a: 'Tottenham', oL: 1.62, oE: 4.40, oV: 5.00, status: 'pending' },
    { id: 'e10', d: '16.03. 21:00', h: 'Fulham', a: 'Wolves', oL: 1.95, oE: 3.50, oV: 3.80, status: 'pending' }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('ucl');
  const [tab, setTab] = useState('p');
  const [db, setDb] = useState({});
  const [sel, setSel] = useState([]);
  const [bet, setBet] = useState(10);
  const [expanded, setExpanded] = useState(null);

  const runEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const tP = pL + pV + pE;
    const lA = 2.82 * (pL/tP), lB = 2.82 * (pV/tP);
    const poi = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= Math.random(); } while(p > L); return k - 1; };
    let s = { wL:0, d:0, wV:0, ov25:0, corn:0, scores:{} };
    for(let i=0; i<ITER; i++){
      const gA = poi(lA), gB = poi(lB);
      if(gA > gB) s.wL++; else if(gA === gB) s.d++; else s.wV++;
      if(gA+gB > 2.5) s.ov25++;
      s.corn += (lA + lB) * 2.4 + (Math.random() * 4);
      const res = `${gA}-${gB}`; s.scores[res] = (s.scores[res] || 0) + 1;
    }
    const exact = Object.entries(s.scores).sort((a,b) => b[1] - a[1]).slice(0,3).map(x => x[0]);
    const pick = s.wL > s.wV && s.wL > s.d ? '1' : s.wV > s.wL && s.wV > s.d ? '2' : 'X';
    return { 
      pL:(s.wL/500).toFixed(1), pE:(s.d/500).toFixed(1), pV:(s.wV/500).toFixed(1), 
      ov25:(s.ov25/500).toFixed(1), corners:(s.corn/ITER).toFixed(1), exact, pick, 
      probMax: Math.max(s.wL, s.d, s.wV)/500, pickOdd: pick==='1'?oL : pick==='2'?oV : oE,
      o1X: 1/((1/oL)+(1/oE)), oX2: 1/((1/oV)+(1/oE)), o12: 1/((1/oL)+(1/oV))
    };
  };

  useEffect(() => {
    const newDb = {};
    Object.keys(FULL_DB).forEach(k => {
      newDb[k] = FULL_DB[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setDb(newDb);
  }, []);

  const getIACombos = () => {
    const all = Object.values(db).flat().filter(m => m.status === 'pending');
    return [
      { t: 'SEGURA', c: '#4ade80', p: all.filter(m => m.probMax > 60).slice(0, 3) },
      { t: 'MODERADA', c: '#fbbf24', p: all.filter(m => m.probMax > 45 && m.probMax <= 60).slice(0, 3) },
      { t: 'BOMBA', c: '#ff4444', p: all.filter(m => m.probMax <= 45).slice(0, 3) }
    ];
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      {/* HEADER */}
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #333', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{color:'#fbbf24', fontSize:'1.1rem', margin:'0 0 15px 0', fontWeight:'900'}}>GOLPREDICT QUANTUM</h1>
        <div style={{display:'flex', gap:'6px', overflowX:'auto'}}>
          {['CHAMPIONS', 'LALIGA', 'PREMIER'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'12px', borderRadius:'10px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#1a1a1a', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#fff', border:'none', fontSize:'0.6rem', fontWeight:'900'}}>{n}</button>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #333'}}>
        {['p', 'ia', 'h', 'c'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1, padding:'14px 0', background:'none', border:'none', color: tab===t?'#fbbf24':'#888', borderBottom: tab===t?'3px solid #fbbf24':'none', fontSize:'0.65rem', fontWeight:'bold'}}>
            {t==='p'?'PARTIDOS' : t==='ia'?'COMBOS IA' : t==='h'?'HISTORIAL' : `TICKET (${sel.length})`}
          </button>
        ))}
      </div>

      <div style={{padding:'12px'}}>
        {tab === 'p' && db[liga]?.filter(m => m.status === 'pending').map(p => (
          <div key={p.id} style={{background:'#111', padding:'15px', borderRadius:'18px', marginBottom:'12px', border:'1px solid #222'}}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{cursor:'pointer', textAlign:'center', marginBottom:'12px'}}>
              <div style={{fontSize:'0.6rem', color:'#fbbf24', fontWeight:'bold', marginBottom:'5px'}}>{p.d} â€¢ ANALIZAR â–¾</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{flex:1}}><div style={{fontWeight:'900'}}>{p.h}</div><div style={{color:'#4ade80', fontSize:'0.75rem'}}>{p.pL}%</div></div>
                <div style={{fontSize:'0.6rem', color:'#666'}}>VS</div>
                <div style={{flex:1}}><div style={{fontWeight:'900'}}>{p.a}</div><div style={{color:'#4ade80', fontSize:'0.75rem'}}>{p.pV}%</div></div>
              </div>
            </div>

            {expanded === p.id && (
              <div style={{background:'#000', padding:'12px', borderRadius:'12px', marginBottom:'12px', border:'1px solid #fbbf24'}}>
                <div style={{fontSize:'0.7rem', color:'#fbbf24', marginBottom:'8px', fontWeight:'bold'}}>DOBLE OPORTUNIDAD:</div>
                <div style={{display:'flex', gap:'5px', marginBottom:'12px'}}>
                  {[{t:'1X', q:p.o1X}, {t:'X2', q:p.oX2}, {t:'12', q:p.o12}].map((dopp, i) => (
                    <button key={i} onClick={() => setSel([...sel, {name:`${p.h}-${p.a}`, p:dopp.t, o:dopp.q}])} style={{flex:1, background:'#222', border:'1px solid #444', color:'#fff', padding:'10px', borderRadius:'10px', fontSize:'0.7rem', fontWeight:'bold'}}>
                      {dopp.t} @{dopp.q.toFixed(2)}
                    </button>
                  ))}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'0.7rem'}}>
                  <span>Over 2.5: <b style={{color:'#fff'}}>{p.ov25}%</b></span>
                  <span>CÃ³rners: <b style={{color:'#fbbf24'}}>{p.corners}</b></span>
                </div>
              </div>
            )}

            <div style={{display:'flex', gap:'8px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => setSel([...sel, {name:`${p.h}-${p.a}`, p:o.t, o:o.q}])} style={{flex:1, padding:'12px', borderRadius:'10px', background:'#1a1a1a', color:'#fff', border:'1px solid #333', fontWeight:'900'}}>@{o.q.toFixed(2)}</button>
              ))}
            </div>
          </div>
        ))}

        {tab === 'ia' && getIACombos().map((c, i) => (
          <div key={i} style={{background:'#111', padding:'15px', borderRadius:'15px', marginBottom:'12px', borderLeft:`5px solid ${c.c}`}}>
            <h4 style={{color:c.c, margin:'0 0 10px 0', fontSize:'0.8rem', fontWeight:'900'}}>{c.t}</h4>
            {c.p.map((m, idx) => (
              <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', margin:'6px 0'}}>
                <span>{m.h}-{m.a}</span><b style={{color:'#fbbf24'}}>{m.pick} (@{m.pickOdd.toFixed(2)})</b>
              </div>
            ))}
            <div style={{textAlign:'right', fontWeight:'900', color:c.c, marginTop:'10px', fontSize:'1rem'}}>CUOTA: @{c.p.reduce((acc, x) => acc * x.pickOdd, 1).toFixed(2)}</div>
          </div>
        ))}

        {tab === 'h' && (
          <div>
            <div style={{display:'flex', gap:'8px', marginBottom:'15px'}}>
              <div style={{flex:1, background:'#111', padding:'15px', borderRadius:'12px', border:'1px solid #4ade80', textAlign:'center'}}>
                <div style={{fontSize:'0.6rem', color:'#aaa'}}>ACERTADOS</div>
                <div style={{color:'#4ade80', fontWeight:'900', fontSize:'1.2rem'}}>{Object.values(db).flat().filter(m=>m.status==='won').length}</div>
              </div>
              <div style={{flex:1, background:'#111', padding:'15px', borderRadius:'12px', border:'1px solid #ff4444', textAlign:'center'}}>
                <div style={{fontSize:'0.6rem', color:'#aaa'}}>FALLADOS</div>
                <div style={{color:'#ff4444', fontWeight:'900', fontSize:'1.2rem'}}>{Object.values(db).flat().filter(m=>m.status==='lost').length}</div>
              </div>
            </div>
            {Object.values(db).flat().filter(m => m.status !== 'pending').map(p => (
              <div key={p.id} style={{background:'#111', padding:'12px', borderRadius:'12px', marginBottom:'8px', border:'1px solid #222'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontSize:'0.75rem'}}>
                    <b>{p.h} {p.res} {p.a}</b>
                    <div style={{color:'#666', fontSize:'0.6rem'}}>PronÃ³stico: {p.pick} (@{p.pickOdd.toFixed(2)})</div>
                  </div>
                  <span style={{background: p.status==='won'?'#4ade80':'#ff4444', color:'#000', padding:'4px 8px', borderRadius:'6px', fontSize:'0.6rem', fontWeight:'900'}}>
                    {p.status==='won'?'ACERTADO':'FALLADO'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'c' && (
          <div style={{background:'#111', padding:'20px', borderRadius:'20px', border:'2px solid #fbbf24', textAlign:'center'}}>
            {sel.map((b,i) => <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222', fontSize:'0.85rem'}}><span>{b.name} ({b.p})</span><b>@{b.o.toFixed(2)}</b></div>)}
            <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'1.8rem', width:'100px', marginTop:'20px', borderRadius:'10px', textAlign:'center'}} />
            <div style={{background:'#fbbf24', color:'#000', padding:'15px', borderRadius:'14px', marginTop:'20px', fontWeight:'900', fontSize:'1.4rem'}}>GANANCIA: {(bet * sel.reduce((acc,b)=>acc*b.o,1)).toFixed(2)}â‚¬</div>
            <button onClick={()=>setSel([])} style={{marginTop:'20px', color:'#ff4444', background:'none', border:'none', fontSize:'0.75rem', fontWeight:'bold'}}>LIMPIAR</button>
          </div>
        )}
      </div>
    </div>
  );
                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
