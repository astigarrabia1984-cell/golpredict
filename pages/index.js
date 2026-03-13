import React, { useState, useEffect, useMemo } from "react";

/* ===========================
MATH FUNCTIONS
=========================== */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

/* ===========================
TEAM RATINGS & STATS
=========================== */
const teamRatings = {
  "Real Madrid": { a: 1.45, d: 0.7 }, "Elche": { a: 0.8, d: 1.2 },
  "Girona": { a: 1.2, d: 0.9 }, "Athletic Bilbao": { a: 1.1, d: 0.9 },
  "Atlético Madrid": { a: 1.3, d: 0.8 }, "Getafe": { a: 0.9, d: 1.1 },
  "Arsenal": { a: 1.4, d: 0.8 }, "Everton": { a: 0.9, d: 1.1 },
  "Chelsea": { a: 1.1, d: 1 }, "Newcastle": { a: 1.2, d: 0.95 },
  "Liverpool": { a: 1.45, d: 0.85 }, "Tottenham Hotspur": { a: 1.25, d: 1 },
  "Bayern Munich": { a: 1.55, d: 0.75 }, "Dortmund": { a: 1.3, d: 0.95 },
  "Leverkusen": { a: 1.35, d: 0.9 }, "Inter": { a: 1.35, d: 0.85 },
  "Roma": { a: 1.15, d: 0.95 }, "Milan": { a: 1.25, d: 0.9 },
  "Napoli": { a: 1.3, d: 0.95 }, "PSG": { a: 1.5, d: 0.9 },
  "Ajax": { a: 1.2, d: 1.05 }, "Betis": { a: 1.1, d: 1 },
  "Sporting": { a: 1.15, d: 1 },
};

/* ===========================
CORNERS & CARDS MODELS
=========================== */
const teamCorners = { "Real Madrid": 6.8, "Elche": 3.2, "Girona": 5.1, "Athletic Bilbao": 5.4, "Arsenal": 6.4, "Liverpool": 7.1, "Bayern Munich": 7.4, "Dortmund": 6.6 };
const teamCards = { "Real Madrid": 2.1, "Elche": 2.8, "Girona": 2.3, "Athletic Bilbao": 2.6, "Arsenal": 2.0, "Liverpool": 2.2, "Bayern Munich": 1.9, "Dortmund": 2.3 };

const predictCorners = (home, away) => {
  const hc = teamCorners[home] || 5; const ac = teamCorners[away] || 5;
  const total = hc + ac;
  return { avg: total.toFixed(1), over85: total > 8.5, over95: total > 9.5 };
};

const predictCards = (home, away) => {
  const h = teamCards[home] || 2.3; const a = teamCards[away] || 2.3;
  const total = h + a;
  return { avg: total.toFixed(1), over35: total > 3.5, over45: total > 4.5 };
};

/* ===========================
MATCH DATABASE
=========================== */
const matchesDB = {
  LALIGA: [
    { id: 1, home: "Alaves", away: "Villarreal", date: "13-03" },
    { id: 2, home: "Girona", away: "Athletic Bilbao", date: "14-03" },
    { id: 3, home: "Atlético Madrid", away: "Getafe", date: "14-03" },
    { id: 4, home: "Real Oviedo", away: "Valencia", date: "14-03" },
    { id: 5, home: "Real Madrid", away: "Elche", date: "14-03" },
    { id: 6, home: "Mallorca", away: "Espanyol", date: "15-03" },
    { id: 7, home: "Barcelona", away: "Sevilla", date: "15-03" },
    { id: 8, home: "Betis", away: "Celta Vigo", date: "15-03" },
    { id: 9, home: "Real Sociedad", away: "Osasuna", date: "15-03" },
    { id: 10, home: "Rayo Vallecano", away: "Levante", date: "16-03" },
    { id: 11, home: "Villarreal", away: "Real Sociedad", date: "20-03" },
    { id: 12, home: "Elche", away: "Mallorca", date: "21-03" },
    { id: 13, home: "Espanyol", away: "Getafe", date: "21-03" },
    { id: 14, home: "Levante", away: "Real Oviedo", date: "21-03" },
    { id: 15, home: "Osasuna", away: "Girona", date: "21-03" },
    { id: 16, home: "Sevilla", away: "Valencia", date: "21-03" },
    { id: 17, home: "Barcelona", away: "Rayo Vallecano", date: "22-03" },
    { id: 18, home: "Celta Vigo", away: "Alaves", date: "22-03" },
    { id: 19, home: "Athletic Bilbao", away: "Betis", date: "22-03" },
    { id: 20, home: "Real Madrid", away: "Atlético Madrid", date: "22-03" }
  ],
  PREMIER: [
    { id: 30, home: "Burnley", away: "Bournemouth", date: "14-03" },
    { id: 31, home: "Sunderland", away: "Brighton", date: "14-03" },
    { id: 32, home: "Arsenal", away: "Everton", date: "14-03" },
    { id: 33, home: "Chelsea", away: "Newcastle", date: "14-03" },
    { id: 34, home: "West Ham United", away: "Manchester City", date: "14-03" },
    { id: 35, home: "Crystal Palace", away: "Leeds United", date: "15-03" },
    { id: 36, home: "Manchester United", away: "Aston Villa", date: "15-03" },
    { id: 37, home: "Nottingham Forest", away: "Fulham", date: "15-03" },
    { id: 38, home: "Liverpool", away: "Tottenham Hotspur", date: "15-03" },
    { id: 39, home: "Brentford", away: "Wolves", date: "16-03" },
    { id: 40, home: "Bournemouth", away: "Manchester United", date: "20-03" },
    { id: 41, home: "Brighton", away: "Liverpool", date: "21-03" },
    { id: 42, home: "Aston Villa", away: "West Ham United", date: "21-03" },
    { id: 43, home: "Fulham", away: "Burnley", date: "21-03" },
    { id: 44, home: "Manchester City", away: "Crystal Palace", date: "21-03" },
    { id: 45, home: "Everton", away: "Chelsea", date: "21-03" },
    { id: 46, home: "Leeds United", away: "Brentford", date: "21-03" },
    { id: 47, home: "Newcastle United", away: "Sunderland", date: "22-03" },
    { id: 48, home: "Tottenham Hotspur", away: "Nottingham Forest", date: "22-03" }
  ],
  BUNDESLIGA: [
    { id: 60, home: "Monchengladbach", away: "St Pauli", date: "13-03" },
    { id: 61, home: "Borussia Dortmund", away: "Augsburg", date: "14-03" },
    { id: 62, home: "Eintracht Frankfurt", away: "Heidenheim", date: "14-03" },
    { id: 63, home: "Hoffenheim", away: "Wolfsburg", date: "14-03" },
    { id: 64, home: "Leverkusen", away: "Bayern Munich", date: "14-03" },
    { id: 65, home: "Hamburg", away: "Cologne", date: "14-03" },
    { id: 66, home: "Stuttgart", away: "Union Berlin", date: "15-03" },
    { id: 67, home: "RB Leipzig", away: "Mainz", date: "20-03" },
    { id: 68, home: "Bayern Munich", away: "Union Berlin", date: "21-03" },
    { id: 69, home: "Cologne", away: "Monchengladbach", date: "21-03" },
    { id: 70, home: "Heidenheim", away: "Leverkusen", date: "21-03" },
    { id: 71, home: "Wolfsburg", away: "Werder Bremen", date: "21-03" },
    { id: 72, home: "Dortmund", away: "Hamburg", date: "21-03" }
  ],
  SERIEA: [
    { id: 80, home: "Torino", away: "Parma", date: "13-03" },
    { id: 81, home: "Inter", away: "Atalanta", date: "14-03" },
    { id: 82, home: "Napoli", away: "Lecce", date: "14-03" },
    { id: 83, home: "Udinese", away: "Juventus", date: "14-03" },
    { id: 84, home: "Lazio", away: "Bologna", date: "15-03" },
    { id: 85, home: "Fiorentina", away: "Cagliari", date: "15-03" },
    { id: 86, home: "Roma", away: "Como", date: "21-03" },
    { id: 87, home: "Sassuolo", away: "Torino", date: "21-03" },
    { id: 88, home: "AC Milan", away: "Fiorentina", date: "22-03" },
    { id: 89, home: "Juventus", away: "Napoli", date: "22-03" }
  ],
  CHAMPIONS: [
    { id: 100, home: "Arsenal", away: "Porto", date: "18-03" },
    { id: 101, home: "Bayern Munich", away: "Inter", date: "18-03" },
    { id: 102, home: "Real Madrid", away: "Manchester City", date: "18-03" },
    { id: 103, home: "PSG", away: "Dortmund", date: "19-03" },
    { id: 104, home: "Barcelona", away: "Napoli", date: "19-03" },
    { id: 105, home: "Liverpool", away: "Juventus", date: "19-03" }
  ],
  EUROPA: [
    { id: 120, home: "Freiburg", away: "Genk", date: "19-03" },
    { id: 121, home: "Lyon", away: "Celta Vigo", date: "19-03" },
    { id: 122, home: "Midtjylland", away: "Nottingham Forest", date: "19-03" },
    { id: 123, home: "Aston Villa", away: "Lille", date: "19-03" },
    { id: 124, home: "Porto", away: "Stuttgart", date: "19-03" },
    { id: 125, home: "Real Betis", away: "Panathinaikos", date: "19-03" }
  ]
};

/* ===========================
PREDICTION ENGINE
=========================== */
function runModel(match) {
  const defaultRating = { a: 1.0, d: 1.0 };
  const home = teamRatings[match.home] || defaultRating;
  const away = teamRatings[match.away] || defaultRating;
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  let p1 = 0, pX = 0, p2 = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
    }
  }
  const prob1 = p1 * 100; const probX = pX * 100; const prob2 = p2 * 100;
  return {
    homeProb: prob1.toFixed(1), drawProb: probX.toFixed(1), awayProb: prob2.toFixed(1),
    odd1: prob1 > 0 ? (100 / prob1).toFixed(2) : "0.00",
    oddX: probX > 0 ? (100 / probX).toFixed(2) : "0.00",
    odd2: prob2 > 0 ? (100 / prob2).toFixed(2) : "0.00",
    hxg: hxg.toFixed(2), axg: axg.toFixed(2),
  };
}

/* ===========================
SUB-COMPONENTS
=========================== */
function ComboCardIA({ type, matches }) {
  let selection = matches.slice(0, type === "Básica" ? 2 : type === "Moderada" ? 3 : 4);
  return (
    <div style={{ border: `1px solid ${type === "Básica" ? "#00ff41" : type === "Moderada" ? "#ffaa00" : "#ff0044"}`, padding: 15, borderRadius: 10, marginBottom: 10, background: "#111" }}>
      <h4 style={{ margin: "0 0 10px 0", color: type === "Básica" ? "#00ff41" : type === "Moderada" ? "#ffaa00" : "#ff0044" }}>Combinada {type}</h4>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {selection.map((m) => {
          const data = runModel(m);
          const probs = [parseFloat(data.homeProb), parseFloat(data.drawProb), parseFloat(data.awayProb)];
          const maxP = Math.max(...probs);
          let pick = maxP === parseFloat(data.homeProb) ? "1" : maxP === parseFloat(data.drawProb) ? "X" : "2";
          return <li key={m.id} style={{ marginBottom: 5 }}>{m.home} vs {m.away} - Pick: <strong>{pick}</strong> ({maxP.toFixed(1)}%)</li>;
        })}
      </ul>
    </div>
  );
}

function Ticket({ selected, setSelected }) {
  if (selected.length === 0) return <div style={{textAlign:'center', color:'#666', marginTop:20}}>Selecciona una cuota para armar tu ticket</div>;
  const totalQuota = selected.reduce((acc, s) => acc * s.quota, 1).toFixed(2);
  return (
    <div style={{ border: "1px solid #555", padding: 15, borderRadius: 10, background: "#1a1a1a", marginTop: 20 }}>
      <h3 style={{ margin: "0 0 10px 0", color: "#00ff41" }}>🎫 Tu Ticket</h3>
      {selected.map((s) => (
        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.9em", borderBottom: "1px solid #333", paddingBottom: 5 }}>
          <span>{s.home} vs {s.away} ({s.pick})</span>
          <span><strong style={{ color: "#00ff41", marginRight: 10 }}>@{s.quota}</strong><button onClick={() => setSelected(selected.filter(x => x.id !== s.id))} style={{ background: "transparent", color: "#ff0044", border: "none", cursor: "pointer" }}>✖</button></span>
        </div>
      ))}
      <div style={{ marginTop: 10, textAlign: "right", fontSize: "1.1em" }}>Cuota Total: <strong style={{ color: "#00ff41" }}>@{totalQuota}</strong></div>
    </div>
  );
}

function MatchCard({ match, selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const corners = predictCorners(match.home, match.away);
  const cards = predictCards(match.home, match.away);
  const isS = (p) => selected.some(s => s.id === match.id && s.pick === p);
  const toggleS = (p, o) => {
    if (isS(p)) setSelected(selected.filter(s => !(s.id === match.id && s.pick === p)));
    else setSelected([...selected.filter(s => s.id !== match.id), { ...match, pick: p, quota: parseFloat(o) }]);
  };
  return (
    <div style={{ border: "1px solid #222", padding: "15px", borderRadius: "8px", background: "#111", marginBottom: "15px" }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "1.1em" }}><strong>{match.home}</strong> vs <strong>{match.away}</strong></div>
        <div style={{ color: "#666", fontSize: "0.85em" }}>📅 {match.date}</div>
      </div>
      <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
        {[["1", data.homeProb, data.odd1], ["X", data.drawProb, data.oddX], ["2", data.awayProb, data.odd2]].map(([p, pr, od]) => (
          <div key={p} onClick={() => toggleS(p, od)} style={{ background: isS(p) ? "#00ff41" : "#1a1a1a", color: isS(p) ? "#000" : "#fff", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>
            <div style={{ fontSize: "0.75em", marginBottom: "5px" }}>{p} ({pr}%)</div><div style={{ fontWeight: "bold" }}>@{od}</div>
          </div>
        ))}
      </div>
      {open && <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #333", fontSize: "0.9em", color: "#ccc", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>⚽ xG: {data.hxg}-{data.axg}</div><div>🚩 Córners: {corners.avg}</div><div>🟨 Tarjetas: {cards.avg}</div>
      </div>}
    </div>
  );
}

/* ===========================
MAIN APP
=========================== */
export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("partidos"); // partidos | combinadas | ticket

  const matches = matchesDB[league];

  // Estilos para el contenedor responsivo
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: window.innerWidth < 768 ? "column" : "row",
    gap: "20px"
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "15px", textAlign: 'center' }}>
        <h2 style={{ color: "#00ff41", margin: 0 }}>GOLPREDICT PRO</h2>
      </header>

      {/* Selector de Ligas (Siempre visible arriba) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px", justifyContent: 'center' }}>
        {Object.keys(matchesDB).map((l) => (
          <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 10px", background: league === l ? "#00ff41" : "#222", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: '0.8em' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Pestañas para Móvil */}
      <div style={{ display: "flex", marginBottom: "20px", borderBottom: "2px solid #222" }}>
        {["partidos", "combinadas", "ticket"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              flex: 1, padding: "12px", background: "none", border: "none", 
              color: activeTab === tab ? "#00ff41" : "#666",
              borderBottom: activeTab === tab ? "2px solid #00ff41" : "none",
              fontWeight: "bold", textTransform: 'capitalize', cursor: 'pointer'
            }}
          >
            {tab} {tab === "ticket" && selectedMatches.length > 0 && `(${selectedMatches.length})`}
          </button>
        ))}
      </div>

      <div style={containerStyle}>
        
        {/* Lógica de visualización por pestaña */}
        {(activeTab === "partidos" || window.innerWidth >= 768) && (
          <div style={{ flex: 2 }}>
            <h3 style={{ fontSize: '1.1em', marginBottom: 15 }}>Partidos {league}</h3>
            {matches.map((m) => <MatchCard key={m.id} match={m} selected={selectedMatches} setSelected={setSelectedMatches} />)}
          </div>
        )}

        {(activeTab === "combinadas" || window.innerWidth >= 768) && (
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1em', marginBottom: 15 }}>Combinadas IA</h3>
            <ComboCardIA type="Básica" matches={matches} />
            <ComboCardIA type="Moderada" matches={matches} />
            <ComboCardIA type="Arriesgada" matches={matches} />
          </div>
        )}

        {(activeTab === "ticket" || window.innerWidth >= 768) && (
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1em', marginBottom: 15 }}>Ticket de Apuesta</h3>
            <Ticket selected={selectedMatches} setSelected={setSelectedMatches} />
          </div>
        )}

      </div>
    </div>
  );
     }
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
