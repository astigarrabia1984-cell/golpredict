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

  const carteleraSemanal = {
    LALIGA: [
      { m: 'R. Vallecano', v: 'Las Palmas', f: 'Lun 02 Mar', p: '88%', r: 'Gana Rayo', s: '1-0', d: 'Rayo muy solido en Vallecas contra rivales directos.' },
      { m: 'Real Madrid', v: 'Getafe', f: 'Sab 07 Mar', p: '96%', r: 'Gana Madrid', s: '3-0', d: 'El Madrid en el Bernabeu no perdona; Getafe con bajas.' },
      { m: 'Barcelona', v: 'Osasuna', f: 'Dom 08 Mar', p: '93%', r: 'Gana Barca', s: '2-0', d: 'Posesion total del Barca; Osasuna sufre fuera de casa.' }
    ],
    LALIGA2: [
      { m: 'Cordoba', v: 'Granada', f: 'Vie 06 Mar', p: '85%', r: 'Empate', s: '1-1', d: 'Derbi andaluz muy igualado; ambos fuertes en defensa.' },
      { m: 'Almeria', v: 'Tenerife', f: 'Sab 07 Mar', p: '91%', r: 'Gana Almeria', s: '2-1', d: 'Almeria con mayor pegada arriba que el colista.' },
      { m: 'Cadiz', v: 'Castellon', f: 'Dom 08 Mar', p: '89%', r: 'Gana Cadiz', s: '1-0', d: 'El Nuevo Mirandilla es clave para el ascenso del Cadiz.' }
    ],
    EUROPA: [
      { m: 'Real Madrid', v: 'Man. City', f: 'Mar 03 Mar', p: '95%', r: 'Gana Madrid', s: '2-1', d: 'Noche de Champions en el Bernabeu; factor campo decisivo.' },
      { m: 'Bayern M.', v: 'Arsenal', f: 'Mie 04 Mar', p: '92%', r: 'Empate', s: '2-2', d: 'Duelo de maximo nivel; ambos equipos con gol facil.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(carteleraSemanal.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(carteleraSemanal[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>ANALIZANDO SEMANA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'2px'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'18px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>ACCEDER CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'20px'}}>
        <h2 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem'}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.8rem',color:'#888',marginTop:'5px'}}>Suscripcion VIP: {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'5px',marginBottom:'25px'}}>
            {Object.keys(carteleraSemanal).map(id => (
              <button key={id} onClick={() => changeL(id)} style={{padding:'12px 2px',background:liga===id?'#fbbf24':'#1a1a1a',color:liga===id?'#000':'#fff',border:'1px solid #333',borderRadius:'8px',fontWeight:'bold',fontSize:'0.65rem',cursor:'pointer'}}>{id.replace('LALIGA2','2a DIVISION')}</button>
            ))}
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #333',padding:'18px',marginBottom:'15px',borderRadius:'15px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <div>
                  <p style={{fontSize:'0.7rem',color:'#fbbf24',margin:0,fontWeight:'bold'}}>{p.f}</p>
                  <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>{p.m} vs {p.v}</span>
                </div>
                <div style={{background:'#0f0',color:'#000',padding:'5px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.8rem'}}>{p.p} ACIERTO</div>
              </div>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'12px',borderRadius:'10px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>PRONOSTICO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'12px',borderRadius:'10px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>MARCADOR</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0,lineHeight:'1.3'}}><b style={{color:'#fbbf24'}}>Analisis IA:</b> {p.d}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <p style={{fontSize:'1.1rem',lineHeight:'1.6',color:'#ccc'}}>No tienes acceso a los pronosticos de la semana. Contacta con soporte para activar tu suscripcion VIP.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',marginTop:'20px',fontSize:'1.2rem'}}>SOLICITAR ACCESO VIP</button>
        </div>
      )}
    </div>
  );
}
