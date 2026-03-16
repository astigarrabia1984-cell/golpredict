import React, { useState, useMemo } from "react";

/* ===========================
LÓGICA IA Y ESTADÍSTICAS
=========================== */
const teamStats = {
  "Real Madrid": { a: 1.5, d: 0.7, cuota: 1.45 }, "Barcelona": { a: 1.4, d: 0.8, cuota: 1.60 },
  "Manchester City": { a: 1.6, d: 0.7, cuota: 1.35 }, "Arsenal": { a: 1.4, d: 0.8, cuota: 1.55 },
  "Inter": { a: 1.3, d: 0.7, cuota: 1.70 }, "Juventus": { a: 1.2, d: 0.8, cuota: 1.85 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.0, cuota: 2.10 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.1, cuota: 2.20 };
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

  return {
    homeProb: (p1 * 100).toFixed(1), drawProb: (pX * 100).toFixed(1), awayProb: (p2 * 100).toFixed(1),
    bestPick, exact, cuotaFinal,
    corners: (home.a + away.a) * 4.2 > 8.5 ? "+8.5" : "-8.5",
    goals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5"
  };
}

const matchesDB = {
  LALIGA: [
    { id: 1, home: "Real Sociedad", away: "Osasuna", ftScore: "3-1" },
    { id: 3, home: "Barcelona", away: "Sevilla", ftScore: "5-2" },
    { id: 5, home: "Real Madrid", away: "Elche", ftScore: "4-1" },
    { id: 7, home: "Atlético Madrid", away: "Getafe", ftScore: "1-0" },
    { id: 8, home: "Girona", away: "Athletic Club", ftScore: "3-0" }
  ],
  PREMIER: [
    { id: 12, home: "Manchester Utd", away: "Aston Villa", ftScore: "3-1" },
    { id: 15, home: "Arsenal", away: "Everton", ftScore: "2-0" }
  ],
  SERIEA: [
    { id: 25, home: "Udinese", away: "Juventus", ftScore: "0-1" },
    { id: 26, home: "Nápoles", away: "Lecce", ftScore: "2-1" }
  ]
};

/* ===========================
COMPONENTES UI
=========================== */
function MatchCard({ match, onAddToTicket }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "10px", border: "1px solid #333" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7em", color: "#666" }} onClick={() => setOpen(!open)}>
        <span>#{match.id} (Tap para info)</span>
        <span style={{ color: "#00ff41" }}>{match.ftScore}</span>
      </div>
      <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "bold" }}>
        {match.home} vs {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {["1", "X", "2"].map(pick => (
          <button 
            key={pick}
            onClick={() => onAddToTicket(match, pick, data.cuotaFinal)}
            style={{ background: data.bestPick === pick ? "#00ff41" : "#222", color: data.bestPick === pick ? "#000" : "#fff", border: "none", padding: "8px", borderRadius: "5px", fontSize: "0.8em", fontWeight: "bold" }}
          >
            {pick} ({pick === "1" ? data.homeProb : pick === "X" ? data.drawProb : data.awayProb}%)
          </button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#050505", borderRadius: "8px", fontSize: "0.75em", borderLeft: "3px solid #00ff41" }}>
          <div>🎯 Marcador IA: <b>{data.exact}</b></div>
          <div style={{ marginTop: "5px" }}>🚩 Córners: <b>{data.corners}</b> | ⚽ Goles: <b>{data.goals}</b></div>
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
      setTicket([...ticket, { id: match.id, desc: `${match.home} - ${pick}`, cuota }]);
    }
  };

  const totalCuota = ticket.reduce((acc, curr) => acc * curr.cuota, 1).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", letterSpacing: "2px" }}>GOLPREDICT PRO</h2>

      <nav style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
        {["LIGAS", "COMBINADAS", "TICKET"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "12px", background: activeTab === tab ? "#00ff41" : "#222", color: activeTab === tab ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.7em" }}>
            {tab} {tab === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
            {Object.keys(matchesDB).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 15px", background: league === l ? "#00ff41" : "#111", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "20px", fontSize: "0.7em", fontWeight: "bold" }}>{l}</button>
            ))}
          </div>
          {matchesDB[league].map(m => <MatchCard key={m.id} match={m} onAddToTicket={addToTicket} />)}
        </>
      )}

      {activeTab === "COMBINADAS" && (
        <div style={{ padding: "10px" }}>
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "2px solid #ffaa00", marginBottom: "15px" }}>
            <h3 style={{ color: "#ffaa00", margin: "0 0 10px 0" }}>🔥 COMBO LIGA ESPAÑOLA</h3>
            <p style={{ fontSize: "0.9em" }}>Sociedad (1) + Barcelona (1) + Madrid (1)</p>
            <div style={{ color: "#00ff41", fontWeight: "bold" }}>Cuota Total: 3.45</div>
          </div>
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "2px solid #00e5ff" }}>
            <h3 style={{ color: "#00e5ff", margin: "0 0 10px 0" }}>🌍 COMBO MULTI-LIGA</h3>
            <p style={{ fontSize: "0.9em" }}>Barça (1) + Arsenal (1) + Juventus (2)</p>
            <div style={{ color: "#00ff41", fontWeight: "bold" }}>Cuota Total: 4.10</div>
          </div>
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ textAlign: "center", color: "#00ff41" }}>MI CALCULADORA DE CUOTAS</h3>
          {ticket.length === 0 ? <p style={{ textAlign: "center", color: "#666" }}>Selecciona partidos en la pestaña LIGAS</p> : (
            <>
              {ticket.map((t, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", padding: "10px 0" }}>
                  <span>{t.desc}</span>
                  <span style={{ color: "#ffaa00" }}>@{t.cuota}</span>
                </div>
              ))}
              <div style={{ marginTop: "20px", padding: "15px", background: "#000", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>Cuota Total: <span style={{ color: "#00ff41" }}>{totalCuota}</span></div>
                <button onClick={() => setTicket([])} style={{ marginTop: "15px", background: "#ff3333", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px" }}>Limpiar Ticket</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
        }
  
        
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
