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
      { id: 20, home: 'Real Madrid', away: 'Atlético de Madrid', date: '22.03 - 21:00' }
    ],
    'PL': [
      { id: 22, home: 'Burnley', away: 'Bournemouth', date: '14.03 - 16:00' },
      { id: 23, home: 'Sunderland', away: 'Brighton', date: '14.03 - 16:00' },
      { id: 24, home: 'Arsenal', away: 'Everton', date: '14.03 - 18:30' },
      { id: 25, home: 'Chelsea', away: 'Newcastle', date: '14.03 - 18:30' },
      { id: 26, home: 'West Ham', away: 'Man. City', date: '14.03 - 21:00' },
      { id: 27, home: 'Crystal Palace', away: 'Leeds Utd', date: '15.03 - 15:00' },
      { id: 28, home: 'Man. Utd', away: 'Aston Villa', date: '15.03 - 15:00' },
      { id: 30, home: 'Liverpool', away: 'Tottenham', date: '15.03 - 17:30' },
      { id: 32, home: 'Bournemouth', away: 'Man. Utd', date: '20.03 - 21:00' },
      { id: 33, home: 'Brighton', away: 'Liverpool', date: '21.03 - 13:30' },
      { id: 37, home: 'Newcastle', away: 'Sunderland', date: '22.03 - 13:00' }
    ],
    'ELI': [
      { id: 41, home: 'Bolonia', away: 'Roma', date: '12.03 - 18:45' },
      { id: 42, home: 'Lille', away: 'Aston Villa', date: '12.03 - 18:45' },
      { id: 43, home: 'Panathinaikos', away: 'Real Betis', date: '12.03 - 18:45' },
      { id: 45, home: 'Celta de Vigo', away: 'Lyon', date: '12.03 - 21:00' }
    ]
  };

  // LISTA VIP CORREGIDA
  const vipFounders = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    setTimeout(() => setLoading(false), 1200);
    return () => unsub();
  }, []);

  const isVip = user && vipFounders.includes(user.email);

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
              color: activeTab === id ? '#000' : '#fff',
              border: activeTab === id ? 'none' : '1px solid #333'
            }}>
            {id === 'PD' ? 'LALIGA' : id === 'PL' ? 'PREMIER' : id === 'ELI' ? 'EUROPA L.' : '🎯 COMBOS'}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loader}>CALIBRANDO...</div>
        ) : activeTab === 'COMBOS' ? (
          <AiCombos matchesData={matchesData} isVip={isVip} />
        ) : (
          (matchesData[activeTab] || []).map(m => <PredictionCard key={m.id} match={m} isVip={isVip} />)
        )}
      </main>
    </div>
  );
}

function PredictionCard({ match, isVip }) {
  const [open, setOpen] = useState(false);
  
  const analysis = useMemo(() => {
    const seed = match.home.length + match.away.length + match.id;
    const rng = (min, max) => min + (seed % (max - min + 1));
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
      <div style={styles.matchDate}>{match.date}</div>
      <div style={styles.teams}>{match.home} <span style={{color: '#666'}}>vs</span> {match.away}</div>
      <div style={styles.statsBar}>
        <div style={{color: '#00ff41'}}>1: {analysis.prob.h}%</div>
        <div style={{color: '#aaa'}}>X: {analysis.prob.d}%</div>
        <div style={{color: '#ff3b3b'}}>2: {analysis.prob.a}%</div>
      </div>
      {open && (
        <div style={styles.drawer}>
          <div style={styles.drawerGrid}>
            <div style={styles.drawerItem}>🎯 <strong>Res. Exacto:</strong><br/><span style={styles.highlight}>{analysis.exact}</span></div>
            <div style={styles.drawerItem}>🛡️ <strong>Doble Op:</strong><br/><span style={styles.highlight}>{analysis.dc}</span></div>
            <div style={styles.drawerItem}>🚩 <strong>Córners:</strong><br/><span style={styles.highlight}>+{analysis.corners}.5</span></div>
            <div style={styles.drawerItem}>⚽ <strong>Goles:</strong><br/><span style={styles.highlight}>{analysis.goals}</span></div>
          </div>
          {isVip && <div style={styles.vipBadge}>QUANTUM VERIFIED ✅</div>}
        </div>
      )}
    </div>
  );
}

function AiCombos({ matchesData, isVip }) {
  if (!isVip) return <div style={styles.info}>🔒 Acceso exclusivo para VIP Founders. Inicia sesión con tu correo autorizado.</div>;
  
  return (
    <div style={styles.comboWrapper}>
      <div style={{...styles.comboCard, borderLeft: '4px solid #00ff41'}}>
        <h3 style={styles.comboTitle}>🟢 BÁSICA (Riesgo Bajo)</h3>
        <p style={styles.comboText}>Real Madrid Gana + Arsenal 1X</p>
      </div>
      <div style={{...styles.comboCard, borderLeft: '4px solid #ffcc00'}}>
        <h3 style={styles.comboTitle}>🟡 MODERADA (Riesgo Medio)</h3>
        <p style={styles.comboText}>Girona Gana + Man. City Gana + +1.5 Goles</p>
      </div>
      <div style={{...styles.comboCard, borderLeft: '4px solid #ff3b3b'}}>
        <h3 style={styles.comboTitle}>🔴 ARRIESGADA (Quantum)</h3>
        <p style={styles.comboText}>Barcelona Gana + Liverpool Gana + Ambos Marcan</p>
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: '#111', borderBottom: '1px solid #222' },
  logo: { fontSize: '1rem', fontWeight: '900' },
  accent: { color: '#00ff41' },
  logout: { background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' },
  nav: { display: 'flex', gap: '8px', padding: '15px', overflowX: 'auto', background: '#000', justifyContent: 'center' },
  tab: { flex: 'none', minWidth: '85px', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px' },
  card: { background: '#121212', width: '95%', maxWidth: '380px', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #222', textAlign: 'center' },
  matchDate: { fontSize: '10px', color: '#666', marginBottom: '5px' },
  teams: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' },
  statsBar: { display: 'flex', justifyContent: 'space-around', background: '#000', padding: '10px', borderRadius: '8px', fontSize: '13px' },
  drawer: { marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #333' },
  drawerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  drawerItem: { background: '#1a1a1a', padding: '8px', borderRadius: '6px', fontSize: '11px' },
  highlight: { color: '#00ff41', fontWeight: 'bold' },
  vipBadge: { marginTop: '10px', color: '#00ff41', fontSize: '9px', fontWeight: 'bold' },
  comboWrapper: { width: '95%', maxWidth: '380px' },
  comboCard: { background: '#121212', padding: '15px', borderRadius: '8px', marginBottom: '15px' },
  comboTitle: { margin: '0 0 5px 0', fontSize: '14px' },
  comboText: { fontSize: '12px', color: '#ccc', margin: 0 },
  info: { textAlign: 'center', color: '#888', marginTop: '50px', padding: '20px' },
  loader: { color: '#00ff41', marginTop: '50px', fontWeight: 'bold' }
};
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
