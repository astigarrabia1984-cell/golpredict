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

  // BASE DE DATOS ACTUALIZADA CON TODOS LOS PARTIDOS DE LAS CAPTURAS
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
      { id: 20, home: 'Real Madrid', away: 'Atlético de Madrid', date: '22.03 - 21:00' }
    ],
    'PL': [
      { id: 22, home: 'Burnley', away: 'Bournemouth', date: '14.03 - 16:00' },
      { id: 24, home: 'Arsenal', away: 'Everton', date: '14.03 - 18:30' },
      { id: 26, home: 'West Ham', away: 'Manchester City', date: '14.03 - 21:00' },
      { id: 30, home: 'Liverpool', away: 'Tottenham', date: '15.03 - 17:30' },
      { id: 31, home: 'Brentford', away: 'Wolves', date: '16.03 - 21:00' }
    ],
    'ELI': [
      // Añadidos todos los de la captura de Europa/Conference
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

  const vipEmails = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    setTimeout(() => setLoading(false), 1000);
    return () => unsub();
  }, []);

  // Acceso VIP mejorado
  const isVip = user && vipEmails.includes(user.email.toLowerCase().trim());

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
          <div style={styles.loader}>CARGANDO DATOS...</div>
        ) : activeTab === 'COMBOS' ? (
          <AiCombos isVip={isVip} userEmail={user?.email} />
        ) : (
          <div style={styles.list}>
            {(matchesData[activeTab] || []).map(m => <PredictionCard key={m.id} match={m} isVip={isVip} />)}
          </div>
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
    return {
      prob: { h: (rng(400, 600)/10).toFixed(1), d: '25.0', a: '20.0' },
      exact: ['2-1', '1-0', '2-0', '1-1'][seed % 4],
      corners: rng(8, 11),
      goals: (rng(20, 30)/10).toFixed(1),
      dc: '1X'
    };
  }, [match]);

  return (
    <div style={styles.card} onClick={() => setOpen(!open)}>
      <div style={styles.matchDate}>{match.date}</div>
      <div style={styles.teams}>{match.home} vs {match.away}</div>
      <div style={styles.statsBar}>
        <div style={{color: '#00ff41'}}>1: {analysis.prob.h}%</div>
        <div style={{color: '#aaa'}}>X: {analysis.prob.d}%</div>
        <div style={{color: '#ff3b3b'}}>2: {analysis.prob.a}%</div>
      </div>
      {open && (
        <div style={styles.drawer}>
          <div style={styles.drawerGrid}>
            <div style={styles.drawerItem}>🎯 Res: {analysis.exact}</div>
            <div style={styles.drawerItem}>🛡️ Doble: {analysis.dc}</div>
            <div style={styles.drawerItem}>🚩 Córners: +{analysis.corners}.5</div>
            <div style={styles.drawerItem}>⚽ Goles: {analysis.goals}</div>
          </div>
          {isVip && <div style={styles.vipBadge}>DATOS VIP DESBLOQUEADOS ✅</div>}
        </div>
      )}
    </div>
  );
}

function AiCombos({ isVip, userEmail }) {
  if (!isVip) {
    return (
      <div style={styles.info}>
        <h2 style={{color: '#ff3b3b'}}>ACCESO RESTRINGIDO</h2>
        <p>Esta sección es solo para VIP Founders.</p>
        <p style={{fontSize: '10px', color: '#666'}}>Detectado: {userEmail || 'No logueado'}</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      <div style={{...styles.comboCard, borderLeft: '4px solid #00ff41'}}>
        <h4 style={{margin: '0 0 5px 0'}}>BÁSICA (Bajo Riesgo)</h4>
        <p style={{fontSize: '12px', color: '#ccc'}}>R. Madrid (1X) + Arsenal Gana</p>
      </div>
      <div style={{...styles.comboCard, borderLeft: '4px solid #ffcc00'}}>
        <h4 style={{margin: '0 0 5px 0'}}>MODERADA (Medio)</h4>
        <p style={{fontSize: '12px', color: '#ccc'}}>Barcelona Gana + Liverpool Gana</p>
      </div>
      <div style={{...styles.comboCard, borderLeft: '4px solid #ff3b3b'}}>
        <h4 style={{margin: '0 0 5px 0'}}>ARRIESGADA (Quantum)</h4>
        <p style={{fontSize: '12px', color: '#ccc'}}>Girona Gana + Betis Empata + Roma Gana</p>
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#111', borderBottom: '1px solid #222' },
  logo: { fontSize: '0.9rem', fontWeight: 'bold' },
  accent: { color: '#00ff41' },
  logout: { background: '#222', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '10px' },
  nav: { display: 'flex', gap: '5px', padding: '10px', overflowX: 'auto', justifyContent: 'center', background: '#000' },
  tab: { flex: 'none', padding: '10px 15px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px' },
  list: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  card: { background: '#121212', width: '100%', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #222', textAlign: 'center' },
  matchDate: { fontSize: '9px', color: '#666', marginBottom: '5px' },
  teams: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' },
  statsBar: { display: 'flex', justifyContent: 'space-around', background: '#000', padding: '10px', borderRadius: '8px', fontSize: '12px' },
  drawer: { marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333' },
  drawerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' },
  drawerItem: { background: '#1a1a1a', padding: '8px', borderRadius: '5px', fontSize: '11px', color: '#ddd' },
  highlight: { color: '#00ff41' },
  vipBadge: { marginTop: '10px', color: '#00ff41', fontSize: '9px', fontWeight: 'bold' },
  comboCard: { background: '#121212', width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
  info: { textAlign: 'center', marginTop: '100px' },
  loader: { marginTop: '100px', color: '#00ff41' }
};
                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
