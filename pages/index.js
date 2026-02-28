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

  const basePartidos = {
    LALIGA: [
      { m: 'R. Sociedad', v: 'Real Madrid', f: '28 Feb - 21:00', p: '94%', r: 'Gana Real Madrid', s: '1-2', d: 'Madrid invicto fuera; Real Sociedad baja eficacia en casa.' },
      { m: 'Barcelona', v: 'Villarreal', f: '01 Mar - 18:30', p: '91%', r: 'Gana Barcelona', s: '3-1', d: 'Barca domina posesion; Villarreal sufre en transiciones.' },
      { m: 'Valencia', v: 'At. Madrid', f: '01 Mar - 21:00', p: '89%', r: 'Empate', s: '1-1', d: 'Valencia fuerte en Mestalla; Atletico solido en defensa.' }
    ],
    LALIGA2: [
      { m: 'Sporting', v: 'Zaragoza', f: '28 Feb - 18:30', p: '88%', r: 'Gana Sporting', s: '1-0', d: 'El Molinon es un fortin; Zaragoza con bajas en ataque.' },
      { m: 'Levante', v: 'Almeria', f: '01 Mar - 16:15', p: '87%', r: 'Empate', s: '2-2', d: 'Duelo directo por el ascenso; alta media de goles.' },
      { m: 'Racing', v: 'Eibar', f: '01 Mar - 21:00', p: '92%', r: 'Gana Racing', s: '2-1', d: 'Racing lider de local; Eibar irregular como visitante.' }
    ],
    PREMIER: [
      { m: 'Liverpool', v: 'Newcastle', f: '28 Feb - 16:00', p: '95%', r: 'Gana Liverpool', s: '3-0', d: 'Anfield es inexpugnable; Newcastle sufre defensivamente.' },
      { m: 'Man. City', v: 'Brighton', f: '01 Mar - 17:30', p: '93%', r: 'Gana Man. City', s: '4-1', d: 'City en racha goleadora; Brighton deja muchos espacios.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(basePartidos.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(basePartidos[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>ANALIZANDO ESTADISTICAS...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'3px'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'15px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'10px',fontWeight:'bold',cursor:'pointer'}}>ACCEDER CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <h2 style={{color:'#fbbf24',margin:0,fontSize:'1.6rem'}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.75rem',color:'#888',marginTop:'5px'}}>Analisis de Probabilidad VIP</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'20px'}}>
            {Object.keys(basePartidos).map(id => (
              <button key={id} onClick={() => changeL(id)} style={{padding:'12px 5px',background:liga===id?'#fbbf24':'#1a1a1a',color:liga===id?'#000':'#fff',border:'1px solid #333',borderRadius:'8px',fontWeight:'bold',fontSize:'0.65rem',cursor:'pointer'}}>{id.replace('LALIGA2','2a ESPAÑA')}</button>
            ))}
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #333',padding:'18px',marginBottom:'15px',borderRadius:'18px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <div>
                  <p style={{fontSize:'0.7rem',color:'#fbbf24',margin:'0 0 5px 0',fontWeight:'bold'}}>{p.f}</p>
                  <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>{p.m} vs {p.v}</span>
                </div>
                <div style={{background:'#0f0',color:'#000',padding:'5px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.8rem'}}>{p.p} ACIERTO</div>
              </div>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'12px',borderRadius:'12px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:'0 0 4px 0'}}>RESULTADO FINAL</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.9rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'12px',borderRadius:'12px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:'0 0 4px 0'}}>MARCADOR EXACTO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>

              <div style={{background:'#1a1a1a',padding:'10px',borderRadius:'8px',fontSize:'0.75rem',color:'#aaa',lineHeight:'1.4'}}>
                <span style={{color:'#fbbf24',fontWeight:'bold'}}>Analisis IA: </span>{p.d}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'80px',padding:'20px'}}>
          <div style={{fontSize:'40px',marginBottom:'15px'}}>🔒</div>
          <p style={{color:'#ccc',lineHeight:'1.6'}}>Esta cuenta no tiene activado el algoritmo de probabilidad para la Segunda Division y Ligas Europeas.</p>
          <button style={{width:'100%',padding:'18px',background:'#25D366',color:'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',marginTop:'20px',fontSize:'1.1rem'}}>SOLICITAR ACCESO VIP</button>
        </div>
      )}
    </div>
  );
}
