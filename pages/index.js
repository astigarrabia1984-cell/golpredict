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
      { m: 'R. Sociedad', v: 'Real Madrid' },
      { m: 'Barcelona', v: 'Villarreal' },
      { m: 'Valencia', v: 'Atletico' }
    ],
    PREMIER: [
      { m: 'Liverpool', v: 'Newcastle' },
      { m: 'Man. City', v: 'Brighton' },
      { m: 'Arsenal', v: 'Chelsea' }
    ],
    CHAMPIONS: [
      { m: 'Real Madrid', v: 'Man. City' },
      { m: 'Bayern M.', v: 'Arsenal' },
      { m: 'Barcelona', v: 'Liverpool' }
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

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CARGANDO JORNADA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'15px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',borderBottom:'1px solid #333',paddingBottom:'10px',marginBottom:'20px'}}>
        <h2 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.8rem',color:'#888'}}>VIP: {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'20px'}}>
            {Object.keys(basePartidos).map(id => (
              <button key={id} onClick={() => changeL(id)} style={{padding:'10px',background:liga===id?'#fbbf24':'#1a1a1a',color:liga===id?'#000':'#fff',border:'1px solid #333',borderRadius:'8px',fontWeight:'bold',fontSize:'0.7rem'}}>{id}</button>
            ))}
          </div>
          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #333',padding:'15px',marginBottom:'15px',borderRadius:'15px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                <span style={{fontWeight:'bold'}}>{p.m} vs {p.v}</span>
                <div style={{background:'#0f0',color:'#000',padding:'4px 10px',borderRadius:'6px',fontWeight:'900',fontSize:'0.8rem'}}>95% GOL</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:0}}>PREDICCIÓN</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>Victoria</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:0}}>MARCADOR</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>2-1</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px'}}>
          <p style={{color:'#aaa'}}>Acceso VIP requerido para la jornada de Febrero/Marzo.</p>
          <button style={{width:'100%',padding:'18px',background:'#25D366',color:'#fff',border:'none',borderRadius:'12px',fontWeight:'bold'}}>COMPRAR ACCESO VIP</button>
        </div>
      )}
    </div>
  );
}
