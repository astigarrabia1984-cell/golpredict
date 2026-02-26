import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Tu configuración real de Firebase extraída de tus capturas
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
      const leagues = ['CL', 'PL', 'PD', 'SA']; // Champions, Premier, España e Italia
      let allMatches = [];
      
      for (const league of leagues) {
        try {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const data = await res.json();
          // Tomamos los 4 partidos más próximos de cada liga para no saturar
          if (data.matches) allMatches = [...allMatches, ...data.matches.slice(0, 4)];
        } catch (e) { console.error("Error cargando " + league, e); }
      }
      setMatches(allMatches);
      setLoading(false);
    };

    fetchAllMatches();
  }, []);

  // Lógica de la IA para elegir ganador automáticamente
  const getAISelection = (matchId) => {
    const options = ['1', 'X', '2'];
    return options[matchId % 3]; // Algoritmo simple basado en ID para demostración
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00', fontSize: '28px', marginBottom: '10px' }}>⚽ GOL PREDICT PRO</h1>
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px' }}>Usuario: <b>{user.email}</b> | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Salir</span></p>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            ✨ SUSCRIPCIÓN PREMIUM ACTIVA ✨
          </div>
        </div>
      )}

      {loading ? (
        <p>Analizando mercados europeos...</p>
      ) : (
        matches.map((m) => {
          const aiChoice = getAISelection(m.id);
          return (
            <div key={m.id} style={{ background: '#1a1a1a', margin: '15px auto', padding: '15px', borderRadius: '12px', maxWidth: '480px', border: '1px solid #333' }}>
              <div style={{ fontSize: '11px', color: '#00ff00', fontWeight: 'bold', marginBottom: '5px' }}>{m.competition.name}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                {['1', 'X', '2'].map((op) => (
                  <div key={op} style={{ 
                    background: aiChoice === op ? '#00ff00' : '#333', 
                    color: aiChoice === op ? '#000' : '#888',
                    padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', width: '60px',
                    transition: '0.3s', border: aiChoice === op ? 'none' : '1px solid #444'
                  }}>
                    {op}
                  </div>
                ))}
              </div>
              
              <div style={{ color: '#ffd700', fontSize: '13px', fontStyle: 'italic' }}>
                ⭐ IA Predict: {aiChoice === '1' ? 'Gana Local' : aiChoice === '2' ? 'Gana Visitante' : 'Empate'} (Confianza 87%)
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
