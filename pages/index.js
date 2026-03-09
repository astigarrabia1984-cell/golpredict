 import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AlphaOmegaV3() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [activeTab, setActiveTab] = useState('analisis');
  const [liga, setLiga] = useState('PD');

  const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  const [partidos] = useState([
    { id: 1, liga: 'PD', local: "REAL MADRID", visitante: "FC BARCELONA", prob: 88, marketOdd: 2.10, stake: 9, ganador: "L", goles: "+2.5", heatmap: [40, 50, 60, 90, 80, 40, 70, 100, 95, 90] },
    { id: 2, liga: 'PL', local: "MAN. CITY", visitante: "ARSENAL", prob: 82, marketOdd: 1.85, stake: 7, ganador: "L", goles: "-3.5", heatmap: [30, 40, 50, 60, 60, 50, 50, 70, 80, 70] },
    { id: 3, liga: 'CL', local: "BAYERN", visitante: "PSG", prob: 85, marketOdd: 1.95, stake: 8, ganador: "L/E", goles: "+3.5", heatmap: [60, 70, 80, 90, 100, 100, 90, 80, 90, 100] }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && vips.includes(u.email.toLowerCase().trim())) setIsPremium(true);
    });
  }, []);

  const theme = '#00ff41'; // Verde Matrix de alta visibilidad

  return (
    <div style={{background: '#0a0a0a', color:'#ffffff', minHeight:'100vh', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      
      {/* HEADER DE ALTA VISIBILIDAD */}
      <div style={{background: theme, color:'#000', padding:'12px', textAlign:'center', fontSize:'0.75rem', fontWeight:'900', letterSpacing:'1px'}}>
        SOPORTE VIP: +34 680 85 20 29
      </div>

      {/* NAVEGACIÓN TABS */}
      <div style={{display:'flex', background:'#111', borderBottom:`1px solid #222`}}>
        <div onClick={()=>setActiveTab('analisis')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.8rem', fontWeight:'bold', color: activeTab === 'analisis' ? theme : '#888', borderBottom: activeTab === 'analisis' ? `3px solid ${theme}` : 'none'}}>PRONÓSTICOS</div>
        <div onClick={()=>setActiveTab('combinada')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.8rem', fontWeight:'bold', color: activeTab === 'combinada' ? theme : '#888', borderBottom: activeTab === 'combinada' ? `3px solid ${theme}` : 'none'}}>COMBINADA 🏆</div>
      </div>

      {isPremium ? (
        <div style={{padding:'20px'}}>
          
          {activeTab === 'analisis' ? (
            <>
              {/* SELECTOR DE LIGAS */}
              <div style={{display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'10px'}}>
                {['PD', 'PL', 'BL1', 'CL'].map(l => (
                  <button key={l} onClick={()=>setLiga(l)} style={{padding:'10px 15px', borderRadius:'8px', border:`1px solid ${liga===l?theme:'#333'}`, background:liga===l?`${theme}15`:'#1a1a1a', color:liga===l?theme:'#fff', fontSize:'0.7rem', fontWeight:'bold'}}>{l}</button>
                ))}
              </div>

              {/* UNIDAD DE STAKE */}
              <div style={{background:'#1a1a1a', padding:'15px', borderRadius:'15px', marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <span style={{fontSize:'0.7rem', color:'#aaa'}}>UNIDAD DE APUESTA:</span>
                  <span style={{color: theme, fontWeight:'900', fontSize:'1rem'}}>${betAmount}</span>
                </div>
                <input type="range" min="10" max="1000" step="10" value={betAmount} onChange={(e)=>setBetAmount(e.target.value)} style={{width:'100%', accentColor: theme}} />
              </div>

              {/* LISTA DE PARTIDOS */}
              {partidos.map(p => (
                <div key={p.id} style={{background:'#151515', border:'1px solid #222', padding:'18px', borderRadius:'20px', marginBottom:'15px'}}>
                  <div style={{textAlign:'center', fontWeight:'800', fontSize:'1.1rem', marginBottom:'15px', color:'#fff', letterSpacing:'0.5px'}}>
                    {p.local} <span style={{color:theme, opacity:0.5}}>VS</span> {p.visitante}
                  </div>
                  
                  {/* PREDICCIONES IA CLARAS */}
                  <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    <div style={{flex:1, background:'#000', padding:'12px', borderRadius:'12px', border:`1px solid ${theme}40`}}>
                      <div style={{fontSize:'0.6rem', color:'#888', marginBottom:'4px'}}>GANADOR</div>
                      <div style={{fontSize:'1rem', fontWeight:'bold', color:theme}}>{p.ganador}</div>
                    </div>
                    <div style={{flex:1, background:'#000', padding:'12px', borderRadius:'12px', border:`1px solid ${theme}40`}}>
                      <div style={{fontSize:'0.6rem', color:'#888', marginBottom:'4px'}}>GOLES</div>
                      <div style={{fontSize:'1rem', fontWeight:'bold', color:theme}}>{p.goles}</div>
                    </div>
                  </div>

                  {/* MAPA DE CALOR CON ETIQUETA */}
                  <div style={{fontSize:'0.6rem', color:'#555', marginBottom:'5px', fontWeight:'bold'}}>PRESIÓN OFENSIVA (IA MOMENTUM)</div>
                  <div style={{height:'40px', display:'flex', alignItems:'flex-end', gap:'3px', marginBottom:'20px', background:'#000', padding:'8px', borderRadius:'10px'}}>
                    {p.heatmap.map((h, i) => <div key={i} style={{flex:1, height:`${h}%`, background: h > 85 ? theme : '#222', borderRadius:'1px'}} />)}
                  </div>

                  {/* CALCULADORA */}
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <div style={{background:'#111', padding:'12px', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.6rem', color:'#666'}}>STAKE {p.stake}</div>
                      <div style={{fontSize:'1rem', fontWeight:'bold'}}>${(betAmount*(p.stake/10)).toFixed(0)}</div>
                    </div>
                    <div style={{background:'#111', padding:'12px', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.6rem', color:'#666'}}>GANANCIA</div>
                      <div style={{fontSize:'1rem', fontWeight:'bold', color:theme}}>+${((betAmount*(p.stake/10))*p.marketOdd - (betAmount*(p.stake/10))).toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* COMBINADA MAESTRA */
            <div style={{textAlign:'center', padding:'10px'}}>
              <h2 style={{fontSize:'1.3rem', color:'#fff', marginBottom:'5px'}}>COMBINADA DEL DÍA</h2>
              <div style={{fontSize:'0.7rem', color:theme, marginBottom:'25px', fontWeight:'bold'}}>FIABILIDAD: 94.2%</div>
              
              <div style={{background:'#151515', border:`2px solid ${theme}`, borderRadius:'25px', padding:'25px'}}>
                {partidos.map(p => (
                  <div key={p.id} style={{padding:'12px 0', borderBottom:'1px solid #222', textAlign:'left'}}>
                    <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>{p.local} - {p.visitante}</div>
                    <div style={{fontSize:'0.7rem', color:theme}}>Pick: {p.ganador} & {p.goles} goles</div>
                  </div>
                ))}
                <div style={{marginTop:'25px'}}>
                  <div style={{fontSize:'2rem', fontWeight:'900', color:theme}}>CUOTA @7.42</div>
                </div>
                <button style={{width:'100%', padding:'18px', background:theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900', marginTop:'20px', fontSize:'1rem'}}>COPIAR APUESTA</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PANTALLA DE LOGIN */
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontWeight:'900'}}>ALPHA OMEGA LOGIN</h2>
          <button onClick={()=>signInWithPopup(auth, provider)} style={{width:'100%', padding:'20px', background: theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900', marginTop:'20px'}}>ENTRAR CON GOOGLE</button>
        </div>
      )}
    </div>
  );
}    
            
                                           
            
                                
