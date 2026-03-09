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

export default function AlphaOmegaV4() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [betAmount, setBetAmount] = useState(20);
  const [activeTab, setActiveTab] = useState('analisis');
  const [liga, setLiga] = useState('PD');
  const [userCombo, setUserCombo] = useState([]);

  const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  const [partidos] = useState([
    { id: 1, liga: 'PD', local: "REAL MADRID", visitante: "FC BARCELONA", prob: 88, marketOdd: 2.15, stake: 9, ganador: "REAL MADRID", goles: "+2.5", heatmap: [40, 50, 60, 90, 80, 40, 70, 100, 95, 90] },
    { id: 2, liga: 'PL', local: "MAN. CITY", visitante: "ARSENAL", prob: 82, marketOdd: 1.80, stake: 7, ganador: "MAN. CITY", goles: "-3.5", heatmap: [30, 40, 50, 60, 60, 50, 50, 70, 80, 70] },
    { id: 3, liga: 'CL', local: "BAYERN", visitante: "PSG", prob: 85, marketOdd: 1.95, stake: 8, ganador: "BAYERN", goles: "+3.5", heatmap: [60, 70, 80, 90, 100, 100, 90, 80, 90, 100] },
    { id: 4, liga: 'BL1', local: "DORTMUND", visitante: "LEIPZIG", prob: 79, marketOdd: 2.40, stake: 6, ganador: "EMPATE", goles: "+2.5", heatmap: [20, 30, 50, 70, 80, 60, 40, 50, 70, 80] }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && vips.includes(u.email.toLowerCase().trim())) setIsPremium(true);
    });
  }, []);

  const toggleCombo = (p) => {
    if (userCombo.find(item => item.id === p.id)) {
      setUserCombo(userCombo.filter(item => item.id !== p.id));
    } else {
      setUserCombo([...userCombo, p]);
    }
  };

  const cuotaTotal = userCombo.reduce((acc, p) => acc * p.marketOdd, 1).toFixed(2);
  const gananciaCombo = (betAmount * cuotaTotal).toFixed(2);

  const theme = '#00ff41';

  return (
    <div style={{background: '#0a0a0a', color:'#ffffff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      
      {/* BANNER VIP */}
      <div style={{background: theme, color:'#000', padding:'10px', textAlign:'center', fontSize:'0.7rem', fontWeight:'900'}}>
        SOPORTE VIP: +34 680 85 20 29
      </div>

      {/* TABS NAVEGACIÓN */}
      <div style={{display:'flex', background:'#111', borderBottom:`1px solid #222`}}>
        <div onClick={()=>setActiveTab('analisis')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.7rem', fontWeight:'bold', color: activeTab === 'analisis' ? theme : '#666', borderBottom: activeTab === 'analisis' ? `3px solid ${theme}` : 'none'}}>IA PRONÓSTICOS</div>
        <div onClick={()=>setActiveTab('combinada')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.7rem', fontWeight:'bold', color: activeTab === 'combinada' ? theme : '#666', borderBottom: activeTab === 'combinada' ? `3px solid ${theme}` : 'none'}}>COMBINADA IA</div>
        <div onClick={()=>setActiveTab('builder')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.7rem', fontWeight:'bold', color: activeTab === 'builder' ? theme : '#666', borderBottom: activeTab === 'builder' ? `3px solid ${theme}` : 'none'}}>MI TICKET 📝</div>
      </div>

      {isPremium ? (
        <div style={{padding:'20px'}}>
          
          {activeTab === 'analisis' && (
            <>
              {/* SELECTOR LIGAS */}
              <div style={{display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'10px'}}>
                {['PD', 'PL', 'BL1', 'CL'].map(l => (
                  <button key={l} onClick={()=>setLiga(l)} style={{padding:'10px 15px', borderRadius:'8px', border:`1px solid ${liga===l?theme:'#333'}`, background:liga===l?`${theme}15`:'#1a1a1a', color:liga===l?theme:'#fff', fontSize:'0.65rem', fontWeight:'bold'}}>{l}</button>
                ))}
              </div>

              {/* UNIDAD DE STAKE */}
              <div style={{background:'#1a1a1a', padding:'15px', borderRadius:'15px', marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <span style={{fontSize:'0.65rem', color:'#888'}}>UNIDAD DE APUESTA:</span>
                  <span style={{color: theme, fontWeight:'900'}}>{betAmount} €</span>
                </div>
                <input type="range" min="5" max="500" step="5" value={betAmount} onChange={(e)=>setBetAmount(e.target.value)} style={{width:'100%', accentColor: theme}} />
              </div>

              {partidos.map(p => (
                <div key={p.id} style={{background:'#151515', border:'1px solid #222', padding:'18px', borderRadius:'20px', marginBottom:'15px'}}>
                  <div style={{textAlign:'center', fontWeight:'800', fontSize:'1rem', marginBottom:'15px'}}>{p.local} v {p.visitante}</div>
                  <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                    <div style={{flex:1, background:'#000', padding:'10px', borderRadius:'12px', border:`1px solid ${theme}30`, textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem', color:'#666'}}>GANADOR</div>
                      <div style={{fontSize:'0.8rem', fontWeight:'bold', color:theme}}>{p.ganador}</div>
                    </div>
                    <div style={{flex:1, background:'#000', padding:'10px', borderRadius:'12px', border:`1px solid ${theme}30`, textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem', color:'#666'}}>TOTAL GOLES</div>
                      <div style={{fontSize:'0.8rem', fontWeight:'bold', color:theme}}>{p.goles}</div>
                    </div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <div style={{background:'#111', padding:'10px', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem', color:'#666'}}>STAKE {p.stake}</div>
                      <div style={{fontSize:'0.9rem', fontWeight:'bold'}}>{(betAmount*(p.stake/10)).toFixed(0)} €</div>
                    </div>
                    <button onClick={()=>toggleCombo(p)} style={{background: userCombo.find(x=>x.id===p.id)?theme:'#222', color: userCombo.find(x=>x.id===p.id)?'#000':'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', fontSize:'0.6rem'}}>
                      {userCombo.find(x=>x.id===p.id)? 'AÑADIDO ✓' : '+ AÑADIR A TICKET'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'combinada' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontSize:'1.1rem', marginBottom:'20px'}}>COMBINADA ALPHA OMEGA</h2>
              <div style={{background:'#151515', border:`2px solid ${theme}`, borderRadius:'20px', padding:'20px'}}>
                {partidos.slice(0,3).map(p => (
                  <div key={p.id} style={{padding:'10px 0', borderBottom:'1px solid #222', textAlign:'left'}}>
                    <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>{p.local} - {p.visitante}</div>
                    <div style={{fontSize:'0.65rem', color:theme}}>Pick: Ganador {p.ganador}</div>
                  </div>
                ))}
                <div style={{marginTop:'20px'}}>
                  <div style={{fontSize:'1.8rem', fontWeight:'900', color:theme}}>CUOTA @7.42</div>
                  <div style={{fontSize:'0.7rem', marginTop:'10px'}}>Probabilidad: 94.2%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <div style={{textAlign:'center'}}>
              <h2 style={{fontSize:'1.1rem', marginBottom:'20px'}}>MI TICKET PERSONALIZADO</h2>
              {userCombo.length === 0 ? (
                <p style={{color:'#444', fontSize:'0.8rem'}}>No has añadido partidos aún. Pulsa "+ AÑADIR" en los pronósticos.</p>
              ) : (
                <div style={{background:'#151515', border:`1px solid ${theme}`, borderRadius:'20px', padding:'20px'}}>
                  {userCombo.map(p => (
                    <div key={p.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222'}}>
                      <span style={{fontSize:'0.7rem', textAlign:'left'}}>{p.local} v {p.visitante}</span>
                      <span style={{color:theme, fontWeight:'bold'}}>@{p.marketOdd}</span>
                    </div>
                  ))}
                  <div style={{marginTop:'20px', padding:'15px', background:'#000', borderRadius:'15px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <span style={{fontSize:'0.7rem'}}>CUOTA TOTAL:</span>
                      <span style={{color:theme, fontWeight:'900'}}>@{cuotaTotal}</span>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <span style={{fontSize:'0.7rem'}}>TU APUESTA:</span>
                      <span style={{fontWeight:'bold'}}>{betAmount} €</span>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', borderTop:`1px solid ${theme}40`, paddingTop:'10px'}}>
                      <span style={{fontSize:'0.8rem', fontWeight:'bold'}}>GANANCIA:</span>
                      <span style={{color:theme, fontWeight:'900', fontSize:'1.2rem'}}>{gananciaCombo} €</span>
                    </div>
                  </div>
                  <button onClick={()=>setUserCombo([])} style={{marginTop:'15px', background:'transparent', color:'#ff4444', border:'none', fontSize:'0.6rem', fontWeight:'bold'}}>BORRAR TICKET</button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontWeight:'900'}}>ALPHA OMEGA LOGIN</h2>
          <button onClick={()=>signInWithPopup(auth, provider)} style={{width:'100%', padding:'20px', background: theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900', marginTop:'20px'}}>ENTRAR CON GOOGLE</button>
        </div>
      )}
    </div>
  );
}
            
                                           
            
                                
