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

  const jornadaReal = {
    LALIGA: [
      { m: 'Atlético de Madrid', v: 'Athletic Club', f: '06.03. 21:00', p: '88%', r: 'Gana Atlético', s: '2-1', d: 'Duelo directo por Champions en el Metropolitano.' },
      { m: 'Villarreal', v: 'Espanyol', f: '07.03. 14:00', p: '92%', r: 'Gana Villarreal', s: '3-1', d: 'La racha goleadora del Villarreal es imparable en casa.' },
      { m: 'Real Madrid', v: 'Rayo Vallecano', f: '07.03. 16:15', p: '96%', r: 'Gana Real Madrid', s: '4-0', d: 'Derbi madrileño donde el líder no dará tregua.' },
      { m: 'Leganés', v: 'Valencia', f: '07.03. 18:30', p: '52%', r: 'Empate', s: '0-0', d: 'Partido muy cerrado con defensas muy ordenadas.' },
      { m: 'Real Sociedad', v: 'Sevilla', f: '07.03. 21:00', p: '85%', r: 'Gana Real Sociedad', s: '2-0', d: 'El Sevilla sufre mucho en sus salidas esta temporada.' },
      { m: 'Osasuna', v: 'Girona', f: '08.03. 14:00', p: '81%', r: 'Gana Girona', s: '1-2', d: 'Girona mantiene su estilo ofensivo fuera de casa.' },
      { m: 'Barcelona', v: 'Mallorca', f: '08.03. 16:15', p: '94%', r: 'Gana Barcelona', s: '3-0', d: 'El Barça domina la posesión absoluta en Montjuïc.' },
      { m: 'Valladolid', v: 'Getafe', f: '08.03. 18:30', p: '76%', r: 'Gana Valladolid', s: '1-0', d: 'Duelo por la permanencia decidido por el factor campo.' },
      { m: 'Real Betis', v: 'Las Palmas', f: '08.03. 21:00', p: '90%', r: 'Gana Betis', s: '2-0', d: 'El Benito Villamarín será una caldera para asegurar Europa.' },
      { m: 'Alavés', v: 'Celta de Vigo', f: '09.03. 21:00', p: '83%', r: 'Gana Celta', s: '1-2', d: 'Cierre de jornada con victoria visitante por pegada.' }
    ],
    LALIGA2: [
      { m: 'Racing Santander', v: 'Cádiz', f: '07.03. 21:00', p: '94%', r: 'Gana Racing', s: '3-1', d: 'El líder de Segunda sigue imparable en El Sardinero.' },
      { m: 'Sporting Gijón', v: 'Burgos', f: '08.03. 16:15', p: '88%', r: 'Gana Sporting', s: '2-0', d: 'El Molinón decidirá este duelo del norte.' },
      { m: 'Levante', v: 'Granada', f: '08.03. 18:30', p: '55%', r: 'Empate', s: '1-1', d: 'Duelo de aspirantes al ascenso muy igualado.' },
      { m: 'Oviedo', v: 'Eibar', f: '09.03. 20:30', p: '82%', r: 'Gana Oviedo', s: '1-0', d: 'Victoria mínima pero vital para el conjunto azul.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(jornadaReal.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(jornadaReal[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>SINCRONIZANDO JORNADA 27...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'2px'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ACCESO VIP</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <h2 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.7rem',color:'#0f0'}}>DATOS REALES FLASHSCORE</p>
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
              <div style={{textAlign:'center',fontSize:'1.1rem',fontWeight:'bold',marginBottom:'15px'}}>{p.m} vs {p.v}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>GANADOR/EMPATE</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>MARCADOR DIRECTO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0,lineHeight:'1.3'}}><b style={{color:'#fbbf24'}}>Análisis:</b> {p.d}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <p>Tu cuenta no tiene acceso a la Jornada 27 de Flashscore.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',marginTop:'20px'}}>ACTIVAR PASE VIP</button>
        </div>
      )}
    </div>
  );
                        }
            
                                
