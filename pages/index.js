import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWayEedL9BAbFsOlZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:101840838997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

export default function GolpredictUltimate() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('PD'); 
  const [loading, setLoading] = useState(true);

  // BASE DE DATOS MASIVA (Extraída de todas tus capturas al 100%)
  const matchesData = {
    'PD': [
      { id: 1, home: 'Alavés', away: 'Villarreal', date: '13.03 - 21:00' },
      { id: 2, home: 'Girona', away: 'Athletic Club', date: '14.03 - 14:00' },
      { id: 3, home: 'Atlético de Madrid', away: 'Getafe', date: '14.03 - 16:15' },
      { id: 4, home: 'Real Oviedo', away: 'Valencia', date: '14.03 - 18:30' },
      { id: 5, home: 'Real Madrid', away: 'Elche', date: '14.03 - 21:00' },
      { id: 6, home: 'Mallorca', away: 'Espanyol', date: '15.03 - 14:00' },
      { id: 7, home: 'Barcelona', away: 'Sevilla', date: '15.03 - 16:15' },
      { id: 8, home: 'Real Betis', away: 'Celta de Vigo', date: '15.03 - 18:30' },
      { id: 9, home: 'Real Sociedad', away: 'Osasuna', date: '15.03 - 21:00' },
      { id: 10, home: 'Rayo Vallecano', away: 'Levante', date: '16.03 - 21:00' },
      { id: 11, home: 'Villarreal', away: 'Real Sociedad', date: '20.03 - 21:00' },
      { id: 12, home: 'Elche', away: 'Mallorca', date: '21.03 - 14:00' },
      { id: 13, home: 'Espanyol', away: 'Getafe', date: '21.03 - 16:15' },
      { id: 14, home: 'Levante', away: 'Real Oviedo', date: '21.03 - 18:30' },
      { id: 15, home: 'Osasuna', away: 'Girona', date: '21.03 - 18:30' },
      { id: 16, home: 'Sevilla', away: 'Valencia', date: '21.03 - 21:00' },
      { id: 17, home: 'Barcelona', away: 'Rayo Vallecano', date: '22.03 - 14:00' },
      { id: 18, home: 'Celta de Vigo', away: 'Alavés', date: '22.03 - 16:15' },
      { id: 19, home: 'Athletic Club', away: 'Real Betis', date: '22.03 - 18:30' },
      { id: 20, home: 'Real Madrid', away: 'Atlético de Madrid', date: '22.03 - 21:00' },
      { id: 21, home: 'Alavés', away: 'Osasuna', date: '05.04 - 18:00' }
    ],
    'PL': [
      { id: 22, home: 'Burnley', away: 'Bournemouth', date: '14.03 - 16:00' },
      { id: 23, home: 'Sunderland', away: 'Brighton', date: '14.03 - 16:00' },
      { id: 24, home: 'Arsenal', away: 'Everton', date: '14.03 - 18:30' },
      { id: 25, home: 'Chelsea', away: 'Newcastle', date: '14.03 - 18:30' },
      { id: 26, home: 'West Ham', away: 'Manchester City', date: '14.03 - 21:00' },
      { id: 27, home: 'Crystal Palace', away: 'Leeds Utd', date: '15.03 - 15:00' },
      { id: 28, home: 'Manchester Utd', away: 'Aston Villa', date: '15.03 - 15:00' },
      { id: 29, home: 'Nottingham Forest', away: 'Fulham', date: '15.03 - 15:00' },
      { id: 30, home: 'Liverpool', away: 'Tottenham', date: '15.03 - 17:30' },
      { id: 31, home: 'Brentford', away: 'Wolves', date: '16.03 - 21:00' },
      { id: 32, home: 'Bournemouth', away: 'Manchester Utd', date: '20.03 - 21:00' },
      { id: 33, home: 'Brighton', away: 'Liverpool', date: '21.03 - 13:30' },
      { id: 34, home: 'Fulham', away: 'Burnley', date: '21.03 - 16:00' },
      { id: 35, home: 'Everton', away: 'Chelsea', date: '21.03 - 18:30' },
      { id: 36, home: 'Leeds Utd', away: 'Brentford', date: '21.03 - 21:00' },
      { id: 37, home: 'Newcastle', away: 'Sunderland', date: '22.03 - 13:00' },
      { id: 38, home: 'Aston Villa', away: 'West Ham', date: '22.03 - 15:15' },
      { id: 39, home: 'Tottenham', away: 'Nottingham Forest', date: '22.03 - 15:15' },
      { id: 40, home: 'West Ham', away: 'Wolves', date: '10.04 - 21:00' }
    ],
    'ELI': [
      { id: 41, home: 'Bolonia', away: 'Roma', date: '12.03 - 18:45' },
      { id: 42, home: 'Lille', away: 'Aston Villa', date: '12.03 - 18:45' },
      { id: 43, home: 'Panathinaikos', away: 'Real Betis', date: '12.03 - 18:45' },
      { id: 44, home: 'Stuttgart', away: 'Oporto', date: '12.03 - 18:45' },
      { id: 45, home: 'Celta de Vigo', away: 'Lyon', date: '12.03 - 21:00' },
      { id: 46, home: 'Ferencvaros', away: 'SC Braga', date: '12.03 - 21:00' },
      { id: 47, home: 'Genk', away: 'Friburgo', date: '12.03 - 21:00' },
      { id: 48, home: 'Nottingham Forest', away: 'Midtjylland', date: '12.03 - 21:00' },
      { id: 49, home: 'AZ Alkmaar', away: 'Sparta Praga', date: '12.03 - 18:45' }
    ]
  };

  // Correos VIP actualizados para garantizar el acceso
  const vipFounders = ['astigarrabia1984@gmail.com', 'astigarravia1984@gmail.com', 'vieirajuandavid9@gmail.con'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    setTimeout(() => setLoading(false), 1200);
    return () => unsub();
  }, []);

  const isVip = user && vipFounders.includes(user.email);
  const currentMatches = matchesData[activeTab] || [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>GOLPREDICT <span style={styles.accent}>QUANTUM V55.0</span></h1>
        {user && <button onClick={() => signOut(auth)} style={styles.logout}>SALIR</button>}
      </header>

      <nav style={styles.nav}>
        {['PD', 'PL', 'ELI', 'COMBOS'].map(id => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{
              ...styles.tab, 
              backgroundColor: activeTab === id ? '#00ff41' : '#111', 
              color: activeTab === id ? '#000' : '#f0f0f0',
              border: activeTab === id ? 'none' : '1px solid #333'
            }}>
            {id === 'PD' ? 'LALIGA' : id === 'PL' ? 'PREMIER' : id === 'ELI' ? 'EUROPA L.' : '🎯 COMBOS'}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loader}>CALIBRANDO RED NEURONAL...</div>
        ) : activeTab === 'COMBOS' ? (
          <AiCombos matchesData={matchesData} isVip={isVip} />
        ) : (
          currentMatches.map(m => <PredictionCard key={m.id} match={m} isVip={isVip} />)
        )}
      </main>
    </div>
  );
}

// --- COMPONENTE TARJETA DE PREDICCIÓN CON MOTOR DETERMINISTA ---
function PredictionCard({ match, isVip }) {
  const [open, setOpen] = useState(false);
  
  // Motor Matemático: Genera siempre el mismo resultado para el mismo partido
  const analysis = useMemo(() => {
    const seed = match.home.length + match.away.length + match.id;
    const rng = (min, max) => min + (seed % (max - min + 1));
    
    // Probabilidades base fijadas por el algoritmo
    const h = (rng(350, 600) / 10).toFixed(1);
    const d = (rng(150, 300) / 10).toFixed(1);
    const a = (100 - parseFloat(h) - parseFloat(d)).toFixed(1);
    
    const exactScores = ['2-1', '1-0', '1-1', '2-0', '0-1', '2-2', '3-1'];

    return {
      prob: { h, d, a },
      exact: exactScores[seed % exactScores.length],
      corners: rng(7, 12),
      goals: (rng(15, 35) / 10).toFixed(1),
      dc: parseFloat(h) > parseFloat(a) ? '1X' : 'X2'
    };
  }, [match]);

  return (
    <div style={styles.card} onClick={() => setOpen(!open)}>
      <div style={styles.matchDate}>{match.date} | PROCESADO</div>
      <div style={styles.teams}>{match.home} <span style={{color: '#666'}}>vs</span> {match.away}</div>
      
      <div style={styles.statsBar}>
        <div style={{color: '#00ff41', fontWeight: 'bold'}}>1: {analysis.prob.h}%</div>
        <div style={{color: '#aaa', fontWeight: 'bold'}}>X: {analysis.prob.d}%</div>
        <div style={{color: '#ff3b3b', fontWeight: 'bold'}}>2: {analysis.prob.a}%</div>
      </div>
      
      {open && (
        <div style={styles.drawer}>
          <div style={styles.drawerGrid}>
            <div style={styles.drawerItem}><span style={styles.icon}>🎯</span> <strong>Res. Exacto:</strong> <br/><span style={styles.highlight}>{analysis.exact}</span></div>
            <div style={styles.drawerItem}><span style={styles.icon}>🛡️</span> <strong>Doble Op:</strong> <br/><span style={styles.highlight}>{analysis.dc}</span></div>
            <div style={styles.drawerItem}><span style={styles.icon}>🚩</span> <strong>Córners:</strong> <br/><span style={styles.highlight}>Más de {analysis.corners}.5</span></div>
            <div style={styles.drawerItem}><span style={styles.icon}>⚽</span> <strong>Goles (Avg):</strong> <br/><span style={styles.highlight}>{analysis.goals} goles</span></div>
          </div>
          {isVip && <div style={styles.vipBadge}>SELLO VIP QUANTUM CONFIRMADO ✅</div>}
        </div>
      )}
    </div>
  );
}

// --- GENERADOR DE COMBINADAS AUTOMÁTICO ---
function AiCombos({ matchesData, isVip }) {
  if (!isVip) return <div style={styles.info}>🔒 Acceso de combinadas exclusivo para Founders.</div>;
  
  // Extraemos partidos dinámicamente de la base de datos local
  const pd = matchesData['PD'];
  const pl = matchesData['PL'];
  const eli = matchesData['ELI'];

  return (
    <div style={styles.comboWrapper}>
      <div style={{...styles.comboCard, borderLeft: '4px solid #00ff41'}}>
        <h3 style={styles.comboTitle}>🟢 BÁSICA (Riesgo Bajo) - Cuota ~2.20</h3>
        <ul style={styles.comboList}>
          <li>{pd[4].home} vs {pd[4].away} 👉 <strong>Gana {pd[4].home}</strong></li>
          <li>{pl[8].home} vs {pl[8].away} 👉 <strong>Gana o Empata {pl[8].home} (1X)</strong></li>
        </ul>
      </div>
      
      <div style={{...styles.comboCard, borderLeft: '4px solid #ffcc00'}}>
        <h3 style={styles.comboTitle}>🟡 MODERADA (Riesgo Medio) - Cuota ~5.10</h3>
        <ul style={styles.comboList}>
          <li>{pd[6].home} vs {pd[6].away} 👉 <strong>+1.5 Goles</strong></li>
          <li>{pl[4].home} vs {pl[4].away} 👉 <strong>Gana {pl[4].away}</strong></li>
          <li>{eli[0].home} vs {eli[0].away} 👉 <strong>Gana {eli[0].home}</strong></li>
        </ul>
      </div>
      
      <div style={{...styles.comboCard, borderLeft: '4px solid #ff3b3b'}}>
        <h3 style={styles.comboTitle}>🔴 ARRIESGADA (Quantum) - Cuota ~14.50</h3>
        <ul style={styles.comboList}>
          <li>{pd[19].home} vs {pd[19].away} 👉 <strong>Ambos Marcan</strong></li>
          <li>{pl[2].home} vs {pl[2].away} 👉 <strong>Gana {pl[2].home}</strong></li>
          <li>{eli[1].home} vs {eli[1].away} 👉 <strong>+9.5 Córners</strong></li>
          <li>{pd[2].home} vs {pd[2].away} 👉 <strong>Gana {pd[2].home}</strong></li>
        </ul>
      </div>
    </div>
  );
}

// --- ESTILOS MEJORADOS (Alto Contraste) ---
const styles = {
  container: { background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#111', borderBottom: '1px solid #222' },
  logo: { fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px' },
  accent: { color: '#00ff41', textShadow: '0 0 5px rgba(0,255,65,0.4)' },
  logout: { background: 'transparent', color: '#ff3b3b', border: '1px solid #ff3b3b', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' },
  nav: { display: 'flex', gap: '8px', padding: '15px', overflowX: 'auto', background: '#050505' },
  tab: { flex: 'none', minWidth: '85px', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', transition: 'all 0.2s', cursor: 'pointer' },
  main: { padding: '15px', paddingBottom: '50px' },
  loader: { textAlign: 'center', color: '#00ff41', marginTop: '60px', fontWeight: '900', letterSpacing: '2px', fontSize: '13px' },
  
  card: { background: '#121212', padding: '16px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #2a2a2a', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  matchDate: { fontSize: '10px', color: '#888', marginBottom: '8px', fontWeight: 'bold' },
  teams: { fontSize: '1.15rem', fontWeight: '800', marginBottom: '12px', color: '#ffffff' },
  statsBar: { display: 'flex', justifyContent: 'space-between', background: '#000', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid #1f1f1f' },
  
  drawer: { marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #333' },
  drawerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  drawerItem: { background: '#1a1a1a', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#ccc', lineHeight: '1.4' },
  icon: { fontSize: '14px' },
  highlight: { color: '#00ff41', fontWeight: 'bold', fontSize: '12px' },
  vipBadge: { marginTop: '12px', color: '#00ff41', fontSize: '10px', fontWeight: '900', textAlign: 'center', letterSpacing: '1px' },
  
  comboWrapper: { display: 'flex', flexDirection: 'column', gap: '15px' },
  comboCard: { background: '#121212', padding: '15px', borderRadius: '10px', borderRight: '1px solid #222', borderTop: '1px solid #222', borderBottom: '1px solid #222' },
  comboTitle: { margin: '0 0 10px 0', fontSize: '13px', color: '#fff' },
  comboList: { margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '12px', lineHeight: '1.8' },
  info: { textAlign: 'center', color: '#888', marginTop: '60px', padding: '20px', border: '1px dashed #333', borderRadius: '10px' }
};
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
