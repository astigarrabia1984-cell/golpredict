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
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('LALIGA');

  const jornadaFlashscore = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: '06.03. 21:00', p: '92%', r: 'Gana Real Madrid', s: '0-2', d: 'El Madrid lidera la tabla; Getafe con racha negativa.' },
      { m: 'Girona', v: 'Sevilla', f: '07.03. 14:00', p: '88%', r: 'Gana Girona', s: '2-1', d: 'Montilivi es clave para el exito del Girona.' },
      { m: 'Alaves', v: 'Las Palmas', f: '07.03. 16:15', p: '54%', r: 'Empate', s: '1-1', d: 'Duelo de media tabla con mucha igualdad tactica.' },
      { m: 'Valencia', v: 'Valladolid', f: '07.03. 18:30', p: '85%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla empuja en momentos criticos.' },
      { m: 'Espanyol', v: 'Mallorca', f: '07.03. 21:00', p: '79%', r: 'Gana Espanyol', s: '1-0', d: 'Fortaleza local ante un Mallorca defensivo.' },
      { m: 'Celta', v: 'Leganes', f: '08.03. 14:00', p: '81%', r: 'Gana Celta', s: '2-0', d: 'Balaidos sera un factor determinante.' },
      { m: 'Atletico', v: 'Athletic', f: '08.03. 16:15', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'Duelo directo por la cuarta plaza.' },
      { m: 'Osasuna', v: 'Real Sociedad', f: '08.03. 18:30', p: '58%', r: 'Empate', s: '1-1', d: 'Derbi regional con defensas muy cerradas.' },
      { m: 'Barcelona', v: 'Betis', f: '08.03. 21:00', p: '94%', r: 'Gana Barcelona', s: '3-1', d: 'El Barca domina la clasificacion general.' },
      { m: 'Villarreal', v: 'Rayo', f: '09.03. 21:00', p: '83%', r: 'Gana Villarreal', s: '2-1', d: 'Cierre de jornada con ventaja para el Submarino.' }
    ],
    LALIGA2: [
      { m: 'Zaragoza', v: 'Levante', f: '06.03. 20:30', p: '61%', r: 'Empate', s: '0-0', d: 'Partido de pocos goles segun estadistica.' },
      { m: 'Burgos', v: 'Sporting', f: '07.03. 16:15', p: '82%', r: 'Gana Burgos', s: '1-0', d: 'El Plantio sigue siendo un fortin inexpugnable.' },
      { m: 'Eibar', v: 'Castellon', f: '07.03. 18:30', p: '89%', r: 'Gana Eibar', s: '2-1', d: 'Presion alta del Eibar en Ipurua.' },
      { m: 'Racing', v: 'Cordoba', f: '08.03. 21:00', p: '95%', r: 'Gana Racing', s: '3-0', d: 'El lider de segunda no perdona en casa.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(jornadaFlashscore.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(jornadaFlashscore[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>SINCRONIZANDO CON FLASHSCORE...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{color:'#fbbf24'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <h2 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem'}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.7rem',color:'#888'}}>DATOS OFICIALES JORNADA 27</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'flex',gap:'10px',marginBottom:'25px'}}>
            <button onClick={() => changeL('LALIGA')} style={{flex:1,padding:'15px',background:liga==='LALIGA'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>1a DIVISION</button>
            <button onClick={() => changeL('LALIGA2')} style={{flex:1,padding:'15px',background:liga==='LALIGA2'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA2'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>2a DIVISION</button>
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{background:'#0a0a0a',border:'1px solid #333',padding:'18px',borderRadius:'20px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                <span style={{fontSize:'0.7rem',color:'#fbbf24',fontWeight:'bold'}}>{p.f}</span>
                <div style={{background:'#0f0',color:'#000',padding:'3px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.p} ACIERTO</div>
              </div>
              
              <div style={{textAlign:'center',fontSize:'1.2rem',fontWeight:'bold',marginBottom:'15px'}}>{p.m} vs {p.v}</div>
              
              <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>PRONOSTICO GANADOR</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>MARCADOR DIRECTO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0,lineHeight:'1.3'}}><b style={{color:'#fbbf24'}}>Analisis:</b> {p.d}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <p>Se requiere Pase VIP para ver los horarios y predicciones de Flashscore.</p>
        </div>
      )}
    </div>
  );
}
