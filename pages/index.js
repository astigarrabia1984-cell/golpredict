import React, { useState, useMemo } from "react";

/* ===========================
LÓGICA IA Y ESTADÍSTICAS
=========================== */
const teamStats = {
  "Real Madrid": { a: 1.5, d: 0.7, cuota: 1.45 }, "Barcelona": { a: 1.4, d: 0.8, cuota: 1.50 },
  "Manchester City": { a: 1.6, d: 0.7, cuota: 1.35 }, "Arsenal": { a: 1.4, d: 0.8, cuota: 1.55 },
  "Inter": { a: 1.3, d: 0.7, cuota: 1.70 }, "Juventus": { a: 1.2, d: 0.8, cuota: 1.80 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.0, cuota: 2.10 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.1, cuota: 2.30 };
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  
  let p1 = 0, pX = 0, p2 = 0;
  let maxP = 0; let exact = "0-0";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; exact = `${i}-${j}`; }
    }
  }

  const bestPick = p1 > pX && p1 > p2 ? "1" : (p2 > p1 && p2 > pX ? "2" : "X");
  const cuotaFinal = bestPick === "1" ? home.cuota : (bestPick === "2" ? away.cuota : 3.20);

  let status = "pending"; 
  if (match.ftScore) {
    const [hG, aG] = match.ftScore.split("-").map(Number);
    const actual = hG > aG ? "1" : (hG === aG ? "X" : "2");
    status = actual === bestPick ? "hit" : "miss";
  }

  return {
    homeProb: (p1 * 100).toFixed(1), drawProb: (pX * 100).toFixed(1), awayProb: (p2 * 100).toFixed(1),
    bestPick, exact, cuotaFinal, status,
    corners: (home.a + away.a) * 4.2 > 8.5 ? "+8.5" : "-8.5",
    goals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5"
  };
}

/* ===========================
BASE DE DATOS INTEGRAL (ACTUALIZADA)
=========================== */
const matchesDB = {
  LALIGA: [
    { id: 1, home: "Girona", away: "Athletic Club", ftScore: "2-1" },
    { id: 2, home: "Alavés", away: "Barcelona", ftScore: "0-3" },
    { id: 3, home: "Sevilla", away: "Real Betis", ftScore: "1-0" },
    { id: 4, home: "Real Sociedad", away: "Atlético Madrid", ftScore: "1-1" }
  ],
  PREMIER: [
    { id: 10, home: "Aston Villa", away: "Man Utd", ftScore: "0-0" },
    { id: 11, home: "Chelsea", away: "Nottingham", ftScore: "1-1" },
    { id: 12, home: "Brighton", away: "Tottenham", ftScore: "3-2" }
  ],
  SERIEA: [
    { id: 20, home: "Juventus", away: "Cagliari", ftScore: "1-1" },
    { id: 21, home: "Lazio", away: "Empoli", ftScore: "2-1" },
    { id: 22, home: "Monza", away: "Roma", ftScore: "1-1" },
    { id: 23, home: "Fiorentina", away: "Milan", ftScore: "2-1" }
  ],
  BUNDESLIGA: [
    { id: 30, home: "Heidenheim", away: "RB Leipzig", ftScore: "0-1" },
    { id: 31, home: "Stuttgart", away: "Hoffenheim", ftScore: "1-1" },
    { id: 32, home: "Eintracht", away: "Bayern", ftScore: "3-3" }
  ]
};

/* ===========================
COMPONENTES UI
=========================== */
function MatchCard({ match, onAddToTicket }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const borderColor = data.status === "hit" ? "#00ff41" : (data.status === "miss" ? "#ff3333" : "#333");

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "10px", border: `2px solid ${borderColor}`, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7em", color: "#888" }} onClick={() => setOpen(!open)}>
        <span>ID #{match.id} (Detalles)</span>
        <span style={{ color: borderColor, fontWeight: "bold" }}>{data.status === "hit" ? "✓ ACIERTO" : "✗ FALLO"}</span>
      </div>
      <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "bold" }} onClick={() => setOpen(!open)}>
        {match.home} <span style={{color: "#00ff41"}}>{match.ftScore}</span> {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {["1", "X", "2"].map(pick => (
          <button 
            key={pick}
            onClick={(e) => { e.stopPropagation(); onAddToTicket(match, pick, data.cuotaFinal); }}
            style={{ background: data.bestPick === pick ? "#222" : "#050505", border: data.bestPick === pick ? `1px solid ${borderColor}` : "1px solid #222", color: "#fff", padding: "8px", borderRadius: "5px", fontSize: "0.75em" }}
          >
            {pick} ({pick === "1" ? data.homeProb : pick === "X" ? data.drawProb : data.awayProb}%)
          </button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#050505", borderRadius: "8px", fontSize: "0.75em", borderLeft: "3px solid #00ff41" }}>
          <div style={{color: "#00ff41"}}>🎯 Pronóstico IA: <b>{data.exact}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
            <span>🚩 Córners: <b>{data.corners}</b></span>
            <span>⚽ Goles: <b>{data.goals}</b></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("LALIGA");
  const [ticket, setTicket] = useState([]);

  const addToTicket = (match, pick, cuota) => {
    if (!ticket.find(t => t.id === match.id)) {
      setTicket([...ticket, { id: match.id, desc: `${match.home} (${pick})`, cuota }]);
    }
  };

  const totalCuota = ticket.reduce((acc, curr) => acc * curr.cuota, 1).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#00ff41", textAlign: "center", fontSize: "1.4rem", marginBottom: "20px" }}>GOLPREDICT PRO</h1>

      <nav style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
        {["LIGAS", "COMBINADAS", "TICKET"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "12px 5px", background: activeTab === tab ? "#00ff41" : "#1a1a1a", color: activeTab === tab ? "#000" : "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "0.7em" }}>
            {tab} {tab === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
            {Object.keys(matchesDB).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 12px", background: league === l ? "#333" : "#111", color: league === l ? "#00ff41" : "#fff", border: "1px solid #333", borderRadius: "20px", fontSize: "0.65em", whiteSpace: "nowrap" }}>{l}</button>
            ))}
          </div>
          {matchesDB[league].map(m => <MatchCard key={m.id} match={m} onAddToTicket={addToTicket} />)}
        </>
      )}

      {activeTab === "COMBINADAS" && (
        <div style={{ padding: "10px" }}>
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "2px solid #ffaa00", marginBottom: "15px" }}>
            <h3 style={{ color: "#ffaa00", margin: "0 0 10px 0", fontSize: "0.9em" }}>🔥 COMBO ESPAÑA (TOP 3 IA)</h3>
            <p style={{ fontSize: "0.8em", color: "#ccc" }}>Girona (1) + Barcelona (2) + Sevilla (1)</p>
          </div>
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "2px solid #00e5ff" }}>
            <h3 style={{ color: "#00e5ff", margin: "0 0 10px 0", fontSize: "0.9em" }}>🌍 COMBO MULTI-LIGA GLOBAL</h3>
            <p style={{ fontSize: "0.8em", color: "#ccc" }}>Barcelona (2) + RB Leipzig (2) + Lazio (1)</p>
          </div>
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "15px", borderRadius: "10px" }}>
          <h3 style={{ textAlign: "center", color: "#00ff41", marginTop: "0" }}>CALCULADORA DE TICKET</h3>
          {ticket.length === 0 ? <p style={{ textAlign: "center", color: "#666" }}>Selecciona pronósticos en la pestaña LIGAS para sumarlos aquí.</p> : (
            <>
              {ticket.map((t, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", padding: "10px 0", fontSize: "0.85em" }}>
                  <span>{t.desc}</span>
                  <span style={{ color: "#ffaa00" }}>@{t.cuota}</span>
                </div>
              ))}
              <div style={{ marginTop: "20px", padding: "15px", background: "#000", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.1em" }}>CUOTA TOTAL: <span style={{ color: "#00ff41", fontWeight: "bold" }}>{totalCuota}</span></div>
                <button onClick={() => setTicket([])} style={{ marginTop: "15px", background: "#ff3333", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", width: "100%", fontWeight: "bold" }}>LIMPIAR TICKET</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

        
      
        
  
        
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
