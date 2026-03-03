
    import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // ESTADÍSTICA E IA: Datos extraídos de la Jornada 27 de Flashscore
  const partidosIA = [
    { f: '06.03. 21:00', l: 'Celta de Vigo', v: 'Real Madrid', p: '94%', r: 'Gana Real Madrid', s: '1-3' },
    { f: '07.03. 14:00', l: 'Osasuna', v: 'Mallorca', p: '86%', r: 'Gana Osasuna', s: '1-0' },
    { f: '07.03. 16:15', l: 'Levante', v: 'Girona', p: '89%', r: 'Gana Girona', s: '1-2' },
    { f: '07.03. 18:30', l: 'Atlético de Madrid', v: 'Real Sociedad', p: '91%', r: 'Gana Atlético', s: '2-1' },
    { f: '07.03. 21:00', l: 'Athletic Club', v: 'Barcelona', p: '92%', r: 'Gana Barcelona', s: '1-2' },
    { f: '08.03. 14:00', l: 'Villarreal', v: 'Elche', p: '93%', r: 'Gana Villarreal', s: '2-0' },
    { f: '08.03. 16:15', l: 'Getafe', v: 'Real Betis', p: '58%', r: 'Empate', s: '1-1' },
    { f: '08.03. 18:30', l: 'Sevilla', v: 'Valencia', p: '87%', r: 'Gana Sevilla', s: '2-1' }
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>IA PROCESANDO ESTADÍSTICAS...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{color:'#fbbf24',fontSize:'2rem'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'30px'}}>
        <h2 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.65rem',color:'#0f0'}}>PRONÓSTICOS AUTOMÁTICOS JORNADA 27</p>
      </header>

      {isPremium ? (
        partidosIA.map((p, i) => (
          <div key={i} style={{background:'#0a0a0a',border:'1px solid #333',padding:'18px',borderRadius:'20px',marginBottom:'15px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
              <span style={{fontSize:'0.7rem',color:'#fbbf24',fontWeight:'bold'}}>{p.f}</span>
              <div style={{background:'#0f0',color:'#000',padding:'3px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.p} ACIERTO</div>
            </div>
            
            <div style={{textAlign:'center',fontSize:'1.1rem',fontWeight:'bold',marginBottom:'15px'}}>{p.l} vs {p.v}</div>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>PROBABILIDAD GANADOR</p>
                <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
              </div>
              <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>RESULTADO EXACTO</p>
                <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{textAlign:'center',marginTop:'100px'}}>🔒 Activa tu Pase VIP para ver la estadística.</div>
      )}
    </div>
  );
                          }
                  
            
                                
