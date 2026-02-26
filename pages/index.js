import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const db = getFirestore(app);
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        setUser(userSnap.exists() && userSnap.data().esPremium ? { ...u, esPremium: true } : u);
      } else { setUser(null); }
    });

    const fetchAllMatches = async () => {
      const leagues = ['CL', 'PL']; // Champions y Premier
      let allMatches = [];
      
      for (const league of leagues) {
        try {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const data = await res.json();
          if (data.matches) allMatches = [...allMatches, ...data.matches.slice(0, 5)];
        } catch (e) { console.error("Error en liga " + league, e); }
      }
      setMatches(allMatches);
      setLoading(false);
    };

    fetchAllMatches();
  }, []);

  // Simulación de IA para elegir ganador automáticamente
  const getAIResult = (id) => {
    const results = ['1', 'X', '2'];
    return results[id % 3]; 
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      
      {!user ? (
        <p>Por favor, inicia sesión para ver los pronósticos.</p>
      ) : (
        <div>
          <p>Usuario: <b>{user.email}</b> | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Salir</span></p>
          
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '15px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '20px' }}>
            {user.esPremium ? "✨ SISTEMA IA DE PREDICCIÓN ACTIVO ✨" : "💎 HAZTE PREMIUM PARA DESBLOQUEAR"}
          </div>

          {loading ? <p>Cargando ligas europeas...</p> : (
            matches.map(m => (
              <div key={m.id} style={{ background: '#222', margin: '10px auto', padding: '15px', borderRadius: '10px', maxWidth: '450px', border: '1px solid #333' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{m.competition.name}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                  {['1', 'X', '2'].map((op) => (
                    <button 
                      key={op}
                      style={{ 
                        background: user.esPremium && getAIResult(m.id) === op ? '#00ff00' : '#444', 
                        color: user.esPremium && getAIResult(m.id) === op ? '#000' : '#fff',
                        border: 'none', padding: '10px 25px', borderRadius: '5px', fontWeight: 'bold'
                      }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
                
                <div style={{ color: '#ffd700', fontSize: '13px', fontWeight: 'bold' }}>
                  {user.esPremium ? `⭐ IA RECOMIENDA: ${getAIResult(m.id) === '1' ? 'Local' : getAIResult(m.id) === '2' ? 'Visitante' : 'Empate'}` : "🌟 Pronóstico bloqueado 🔒"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
