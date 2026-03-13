import React, { useState, useEffect, useMemo } from "react";

/* ===========================
LÓGICA MATEMÁTICA (POISSON)
=========================== */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

const teamRatings = {
  "Real Madrid": { a: 1.45, d: 0.7 }, "Barcelona": { a: 1.4, d: 0.85 },
  "Girona": { a: 1.25, d: 0.9 }, "Athletic Bilbao": { a: 1.15, d: 0.85 },
  "Atlético Madrid": { a: 1.3, d: 0.8 }, "Real Sociedad": { a: 1.1, d: 0.85 },
  "Betis": { a: 1.1, d: 0.95 }, "Valencia": { a: 1.0, d: 0.95 },
  "Villarreal": { a: 1.2, d: 1.1 }, "Getafe": { a: 0.9, d: 1.0 },
  "Osasuna": { a: 0.95, d: 1.0 }, "Sevilla": { a: 1.1, d: 1.1 },
  "Las Palmas": { a: 0.85, d: 1.0 }, "Alaves": { a: 0.9, d: 1.1 },
  "Mallorca": { a: 0.8, d: 0.95 }, "Rayo Vallecano": { a: 0.85, d: 1.1 },
  "Celta Vigo": { a: 1.0, d: 1.1 }, "Cadiz": { a: 0.7, d: 1.1 },
  "Granada": { a: 0.8, d: 1.3 }, "Almeria": { a: 0.8, d: 1.4 },
  "Manchester City": { a: 1.6, d: 0.75 }, "Liverpool": { a: 1.5, d: 0.8 },
  "Arsenal": { a: 1.5, d: 0.75 }, "Aston Villa": { a: 1.3, d: 1.0 },
  "Tottenham": { a: 1.35, d: 1.1 }, "Man United": { a: 1.2, d: 1.1 },
  "Newcastle": { a: 1.3, d: 1.2 }, "Chelsea": { a: 1.25, d: 1.1 },
  "West Ham": { a: 1.15, d: 1.2 }, "Brighton": { a: 1.2, d: 1.2 },
  "Bayern Munich": { a: 1.6, d: 0.8 }, "Leverkusen": { a: 1.5, d: 0.7 },
  "Dortmund": { a: 1.35, d: 1.0 }, "Leipzig": { a: 1.4, d: 1.0 },
  "Inter": { a: 1.4, d: 0.7 }, "Milan": { a: 1.3, d: 0.95 },
  "Juventus": { a: 1.15, d: 0.8 }, "Napoli": { a: 1.2, d: 1.0 }
};

function runModel(match) {
  const defaultRating = { a: 1.0, d: 1.0 };
  const home = teamRatings[match.home] || defaultRating;
  const away = teamRatings[match.away] || defaultRating;
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  let p1 = 0, pX = 0, p2 = 0;
  let maxExactProb = 0; let exactScore = "0-0";

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxExactProb) { maxExactProb = pr; exactScore = `${i}-${j}`; }
    }
  }

  const prob1 = (p1 * 100).toFixed(1);
  const probX = (pX * 100).toFixed(1);
  const prob2 = (p2 * 100).toFixed(1);

  return {
    homeProb: prob1, drawProb: probX, awayProb: prob2,
    odd1: (100/prob1).toFixed(2), oddX: (100/probX).toFixed(2), odd2: (100/prob2).toFixed(2),
    bestProb: Math.max(prob1, probX, prob2),
    bestPick: prob1 > Math.max(probX, prob2) ? "1" : (probX > prob2 ? "X" : "2"),
    exactScore,
    predictGoals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5",
    predictCorners: (7.5 + home.a + away.a) > 9.5 ? "+9.5" : "-9.5"
  };
}

/* ===========================
BASE DE DATOS ACTUALIZADA
=========================== */
const matchesDB = {
  LALIGA: [
    // Jornada 28
    { id: 1, home: "Barcelona", away: "Mallorca", date: "08-03" },
    { id: 2, home: "Valencia", away: "Getafe", date: "09-03" },
    { id: 3, home: "Cadiz", away: "Atlético Madrid", date: "09-03" },
    { id: 4, home: "Granada", away: "Real Sociedad", date: "09-03" },
    { id: 5, home: "Girona", away: "Osasuna", date: "09-03" },
    { id: 6, home: "Alaves", away: "Rayo Vallecano", date: "10-03" },
    { id: 7, home: "Real Madrid", away: "Celta Vigo", date: "10-03" },
    { id: 8, home: "Betis", away: "Villarreal", date: "10-03" },
    { id: 9, home: "Las Palmas", away: "Athletic Bilbao", date: "10-03" },
    { id: 10, home: "Almeria", away: "Sevilla", date: "11-03" },
    // Jornada 29
    { id: 11, home: "Real Sociedad", away: "Cadiz", date: "15-03" },
    { id: 12, home: "Mallorca", away: "Granada", date: "16-03" },
    { id: 13, home: "Osasuna", away: "Real Madrid", date: "16-03" },
    { id: 14, home: "Getafe", away: "Girona", date: "16-03" },
    { id: 15, home: "Athletic Bilbao", away: "Alaves", date: "16-03" },
    { id: 16, home: "Sevilla", away: "Celta Vigo", date: "17-03" },
    { id: 17, home: "Villarreal", away: "Valencia", date: "17-03" },
    { id: 18, home: "Rayo Vallecano", away: "Betis", date: "17-03" },
    { id: 19, home: "Las Palmas", away: "Almeria", date: "17-03" },
    { id: 20, home: "Atlético Madrid", away: "Barcelona", date: "17-03" }
  ],
  PREMIER: [
    // Jornada 30
    { id: 30, home: "Newcastle", away: "West Ham", date: "30-03" },
    { id: 31, home: "Chelsea", away: "Burnley", date: "30-03" },
    { id: 32, home: "Tottenham", away: "Luton", date: "30-03" },
    { id: 33, home: "Aston Villa", away: "Wolves", date: "30-03" },
    { id: 34, home: "Brentford", away: "Man United", date: "30-03" },
    { id: 35, home: "Liverpool", away: "Brighton", date: "31-03" },
    { id: 36, home: "Man City", away: "Arsenal", date: "31-03" },
    // Jornada 31
    { id: 40, home: "Newcastle", away: "Everton", date: "02-04" },
    { id: 41, home: "Arsenal", away: "Luton", date: "03-04" },
    { id: 42, home: "Man City", away: "Aston Villa", date: "03-04" },
    { id: 43, home: "Liverpool", away: "Sheffield Utd", date: "04-04" },
    { id: 44, home: "Chelsea", away: "Man United", date: "04-04" }
  ],
  BUNDESLIGA: [
    // Jornada 26
    { id: 60, home: "Darmstadt", away: "Bayern Munich", date: "16-03" },
    { id: 61, home: "Mainz", away: "Bochum", date: "16-03" },
    { id: 62, home: "Heidenheim", away: "Monchengladbach", date: "16-03" },
    { id: 63, home: "Hoffenheim", away: "Stuttgart", date: "16-03" },
    { id: 64, home: "Freiburg", away: "Leverkusen", date: "17-03" },
    { id: 65, home: "Dortmund", away: "Frankfurt", date: "17-03" },
    // Jornada 27
    { id: 70, home: "Leverkusen", away: "Hoffenheim", date: "30-03" },
    { id: 71, home: "Bayern Munich", away: "Dortmund", date: "30-03" },
    { id: 72, home: "Leipzig", away: "Mainz", date: "30-03" }
  ],
  SERIEA: [
    // Jornada 29
    { id: 80, home: "Empoli", away: "Bologna", date: "15-03" },
    { id: 81, home: "Monza", away: "Cagliari", date: "16-03" },
    { id: 82, home: "Juventus", away: "Genoa", date: "17-03" },
    { id: 83, home: "Inter", away: "Napoli", date: "17-03" },
    { id: 84, home: "Roma", away: "Sassuolo", date: "17-03" },
    // Jornada 30
    { id: 90, home: "Napoli", away: "Atalanta", date: "30-03" },
    { id: 91, home: "Lazio", away: "Juventus", date: "30-03" },
    { id: 92, home: "Fiorentina", away: "Milan", date: "30-03" },
    { id: 93, home: "Inter", away: "Empoli", date: "01-04" }
  ],
  CHAMPIONS: [
    { id: 100, home: "Arsenal", away: "Bayern Munich", date: "09-04" },
    { id: 101, home: "Real Madrid", away: "Man City", date: "09-04" },
    { id: 102, home: "Atlético Madrid", away: "Dortmund", date: "10-04" },
    { id: 103, home: "PSG", away: "Barcelona", date: "10-04" }
  ]
};

function MatchCard({ match, selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const isS = (p) => selected.some(s => s.id === match.id && s.pick === p);
  const toggleS = (p, o) => {
    if (isS(p)) setSelected(selected.filter(s => !(s.id === match.id && s.pick === p)));
    else setSelected([...selected.filter(s => s.id !== match.id), { ...match, pick: p, quota: parseFloat(o) }]);
  };

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #222" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.9em", fontWeight: "bold" }}>{match.home} vs {match.away}</span>
        <span style={{ color: "#00ff41", fontSize: "0.8em" }}>{match.date} ▼</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {[["1", data.homeProb, data.odd1], ["X", data.drawProb, data.oddX], ["2", data.awayProb, data.odd2]].map(([p, pr, od]) => (
          <div key={p} onClick={() => toggleS(p, od)} style={{ background: isS(p) ? "#00ff41" : "#1a1a1a", color: isS(p) ? "#000" : "#fff", padding: "8px 2px", borderRadius: "4px", textAlign: "center", cursor: "pointer", fontSize: "0.75em" }}>
            <div>{p} ({pr}%)</div>
            <div style={{ fontWeight: "bold" }}>@{od}</div>
          </div>
        ))}
      </div>

      {open && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#050505", borderRadius: "5px", fontSize: "0.8em", borderTop: "1px solid #222" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Exacto:</span> <b>{data.exactScore}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Goles:</span> <b style={{color: "#00ff41"}}>{data.predictGoals}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Córners:</span> <b style={{color: "#ffaa00"}}>{data.predictCorners}</b></div>
        </div>
      )}
    </div>
  );
}

export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [activeTab, setActiveTab] = useState("partidos");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const top5Global = useMemo(() => {
    return Object.values(matchesDB).flat().map(m => ({ ...m, res: runModel(m) }))
      .sort((a, b) => b.res.bestProb - a.res.bestProb).slice(0, 5);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: 'center', marginBottom: "15px", fontSize: "1.2em" }}>GOLPREDICT PRO</h2>

      <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
        {Object.keys(matchesDB).map(l => (
          <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 15px", background: league === l ? "#00ff41" : "#222", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: '0.65em', whiteSpace: 'nowrap' }}>{l}</button>
        ))}
      </div>

      <nav style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "15px" }}>
        {[{id:'partidos',l:'Partidos'},{id:'top5',l:'Top 5 IA'},{id:'tk',l:`Ticket (${selectedMatches.length})`}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "10px", background: "none", border: "none", color: activeTab === t.id ? "#00ff41" : "#555", borderBottom: activeTab === t.id ? "2px solid #00ff41" : "none", fontWeight: "bold", fontSize: '0.75em' }}>{t.l}</button>
        ))}
      </nav>

      <main style={{ maxWidth: "500px", margin: "0 auto" }}>
        {activeTab === "partidos" && (matchesDB[league] || []).map(m => <MatchCard key={m.id} match={m} selected={selectedMatches} setSelected={setSelectedMatches} />)}

        {activeTab === "top5" && top5Global.map((m, i) => (
          <div key={i} style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", borderLeft: "4px solid #ffaa00" }}>
            <div style={{fontSize: "0.7em", color: "#666"}}>{m.date} - {m.home} vs {m.away}</div>
            <div style={{color: "#00ff41", fontWeight: "bold", fontSize: "0.9em"}}>Gana: {m.res.bestPick} ({m.res.bestProb}%) | {m.res.exactScore}</div>
          </div>
        ))}

        {activeTab === "tk" && (
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px" }}>
            {selectedMatches.length === 0 ? "Selecciona partidos" : (
              <>
                {selectedMatches.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #222", fontSize: "0.8em" }}>
                    <span>{s.home} ({s.pick})</span> <span style={{color: "#00ff41"}}>@{s.quota}</span>
                  </div>
                ))}
                <div style={{ marginTop: "15px", textAlign: "right", fontWeight: "bold", color: "#00ff41" }}>
                  Cuota Total: @{selectedMatches.reduce((acc, curr) => acc * curr.quota, 1).toFixed(2)}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
     }
     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
