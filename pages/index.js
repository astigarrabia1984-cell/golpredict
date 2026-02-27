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
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4",
  measurementId: "G-0291GDRK66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [liga, setLiga] = useState('LALIGA');
  const [loading, setLoading] = useState(true);

  const dbPartidos = {
    LALIGA: [{ m: 'Real Madrid', v: 'Barcelona' }, { m: 'At. Madrid', v: 'Sevilla' }],
    LALIGA2: [{ m: 'Almeria', v: 'Cadiz' }, { m: 'Granada', v: 'Malaga' }],
    PREMIER: [{ m: 'Man. City', v: 'Liverpool' }, { m: 'Arsenal', v: 'Chelsea' }],
    SERIEA: [{ m: 'Inter', v: 'Juventus' }, { m: 'Milan', v: 'Napoli' }],
    BUNDES: [{ m: 'Bayern', v: 'Dortmund' }, { m: 'Leverkusen', v: 'Leipzig' }]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(dbPartidos.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(dbPartidos[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>Cargando...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'15px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'5px',fontWeight:'bold'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <h2 style={{color:'#fbbf24',textAlign:'center'}}>GOL PREDICT PRO</h2>
      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'5px',marginBottom:'20px'}}>
            {Object.keys(dbPartidos).map(id => (
              <button key={id} onClick={() => changeL(id)} style={{padding:'10px 2px',background:liga===id?'#fbbf24':'#1a1a1a',color:liga===id?'#000':'#fff',border:'none',borderRadius:'5px',fontSize:'10px',fontWeight:'bold'}}>{id}</button>
            ))}
          </div>
          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #333',padding:'15px',marginBottom:'10px',borderRadius:'10px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                <span style={{fontWeight:'bold',fontSize:'14px'}}>{p.m} vs {p.v}</span>
                <div style={{background:'#0f0',color:'#000',padding:'4px 8px',borderRadius:'5px',fontWeight:'900'}}>90%</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'5px'}}>
                  <p style={{fontSize:'10px',color:'#666',margin:0}}>PREDICCIÓN</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>Victoria Local</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'5px'}}>
                  <p style={{fontSize:'10px',color:'#666',
