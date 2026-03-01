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

  const baseDatos = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: '06 Mar - 21:00', p: '96%', r: 'Gana Real Madrid', s: '0-2', d: 'El Madrid es superior en todas las lineas; Getafe sufre ante grandes.' },
      { m: 'Girona', v: 'Sevilla', f: '07 Mar - 14:00', p: '91%', r: 'Gana Girona', s: '2-1', d: 'Montilivi empuja al Girona; Sevilla muy irregular este 2026.' },
      { m: 'Alaves', v: 'Las Palmas', f: '07 Mar - 16:15', p: '88%', r: 'Empate', s: '1-1', d: 'Duelo muy igualado en Mendizorroza; ambos priorizan la defensa.' },
      { m: 'Espanyol', v: 'Mallorca', f: '07 Mar - 21:00', p: '87%', r: 'Gana Espanyol', s: '1-0', d: 'Los pericos necesitan puntuar; Mallorca baja nivel fuera de la isla.' },
      { m: 'Valencia', v: 'Valladolid', f: '07 Mar - 18:30', p: '93%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla es un fortin contra rivales de la zona baja.' },
      { m: 'Atletico', v: 'Athletic', f: '08 Mar - 16:15', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'Duelo Champions; el Metropolitano marcara la diferencia fisica.' },
      { m: 'Osasuna', v: 'Real Sociedad', f: '08 Mar - 18:30', p: '86%', r: 'Empate', s: '1-1', d: 'Derbi muy tactico; pocos espacios y mucha intensidad defensiva.' },
      { m: 'Barcelona', v: 'Betis', f: '08 Mar - 21:00', p: '94%', r: 'Gana Barcelona', s: '3-1', d: 'El Barca domina la posesion; Betis sufre mucho en transiciones.' },
      { m: 'Celta', v: 'Leganes', f: '08 Mar - 14:00', p: '88%', r: 'Gana Celta', s: '2-0', d: 'Balaidos es clave para la salvacion; Celta con mas pegada.' },
      { m: 'Villarreal', v: 'Rayo', f: '09 Mar - 21:00', p: '92%', r: 'Gana Villarreal', s: '2-1', d: 'El Villarreal llega en racha goleadora; Rayo con dudas atras.' }
    ],
    LALIGA2: [
      { m: 'Zaragoza', v: 'Levante', f: '06 Mar - 20:30', p: '85%', r: 'Empate', s: '0-0', d: 'Dos de las mejores defensas de 2a; partido de mucho respeto.' },
      { m: 'Burgos', v: 'Sporting', f: '07 Mar - 16:15', p: '88%', r: 'Gana Burgos', s: '1-0', d: 'El Plantio sigue invicto; Burgos muy solido como local.' },
      { m: 'Eibar', v: 'Castellon', f: '07 Mar - 18:30', p: '91%', r: 'Gana Eibar', s: '2-1', d: 'Ipurua es un campo pequeño donde el Eibar presiona mejor.' },
      { m: 'Malaga', v: 'Oviedo', f: '07 Mar - 21:00', p: '87%', r: 'Empate', s: '1-1', d: 'Duelo historico muy nivelado; ambos equipos se vigilaran mucho.' },
      { m: 'Tenerife', v: 'Mirandes', f: '08 Mar - 14:00', p: '86%', r: 'Gana Tenerife', s: '1-0', d: 'El factor insular y el calor seran claves ante un Mirandes joven.' },
      { m: 'Castellon', v: 'Almeria', f: '07 Mar - 14:00', p: '89%', r: 'Gana Almeria', s: '1-2', d: 'La delantera del Almeria tiene calidad de 1a Division.' },
      { m: 'Granada', v: 'Cadiz', f: '08 Mar - 18:30', p: '90%', r: 'Gana Granada', s: '2-1', d: 'Derbi andaluz caliente; Granada llega con mas moral.' },
      { m: 'Huesca', v: 'Elche', f: '08 Mar - 16:15', p: '88%', r: 'Empate', s: '0-0', d: 'Huesca cierra muy bien los espacios en el Alcoraz.' },
      { m: 'Racing', v: 'Cordoba', f: '08 Mar - 21:00', p: '95%', r: 'Gana Racing', s: '3-0', d: 'El Sardinero disfruta del lider; Racing esta en modo rodillo.' },
      { m: 'Cartagena', v: 'Depor', f: '09 Mar - 20:30', p: '87%', r: 'Gana Depor', s: '0-2', d: 'El Depor en racha ascendente contra un colista muy tocado.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDatos.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const cambiarLiga = (id) => {
    setLiga(id);
    setPartidos(baseDatos[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>PREPARANDO JORNADA SEMANAL...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h1>
      <p style={{color:'#888',marginBottom:'20px'}}>Accede para ver los pronosticos</p>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'0 40px',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <div style={{fontSize:'1.8rem',fontWeight:'900',color:'#fbbf24'}}>GOL PREDICT PRO</div>
        <div style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold'}}>ALGORITMO ACTUALIZADO MARZO 2026</div>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'25px'}}>
            <button onClick={() => cambiarLiga('LALIGA')} style={{padding:'15px',background:liga==='LALIGA'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>1a DIVISION</button>
            <button onClick={() => cambiarLiga('LALIGA2')} style={{padding:'15px',background:liga==='LALIGA2'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA2'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>2a DIVISION</button>
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #222',padding:'18px',marginBottom:'15px',borderRadius:'18px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                <span style={{fontSize:'0.7rem',color:'#fbbf24',fontWeight:'bold'}}>{p.f}</span>
                <div style={{background:'#0f0',color:'#000',padding:'4px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.p} ACIERTO</div>
              </div>

              <div style={{textAlign:'center',marginBottom:'15px'}}>
                <div style={{fontSize:'1.1rem',fontWeight:'bold'}}>{p.m} vs {p.v}</div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 3px 0'}}>RESULTADO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px',textAlign:'center'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 3px 0'}}>MARCADOR</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>

              <div style={{fontSize:'0.75rem',color:'#aaa',lineHeight:'1.3',padding:'10px',background:'#111',borderRadius:'10px'}}>
                <span style={{color:'#fbbf24',fontWeight:'bold'}}>ANALISIS IA:</span> {p.d}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <div style={{fontSize:'3rem',marginBottom:'15px'}}>🔒</div>
          <p style={{color:'#ccc',lineHeight:'1.5'}}>Tu cuenta no tiene activado el acceso a la jornada completa de Marzo.</p>
          <button style={{width:'100%',padding:'18px',background:'#25D366',color:'#fff',border:'none',borderRadius:'12px',fontWeight:'bold',marginTop:'20px',fontSize:'1.1rem',cursor:'pointer'}}>SOLICITAR ACCESO VIP</button>
        </div>
      )}
    </div>
  );
}
