import React, { useState, useMemo } from "react";

/* ============================================================
   1. MOTOR ESTADÍSTICO (POISSON)
   ============================================================ */
const teamStats = {
  // ESPAÑA
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2 }, "Barcelona": { a: 2.1, d: 0.9, c: 5.8 },
  "Atlético de Madrid": { a: 1.7, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9 }, "Sevilla": { a: 1.4, d: 1.4, c: 5.5 },
  // INGLATERRA
  "Man City": { a: 2.5, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2 }, "Man Utd": { a: 1.5, d: 1.5, c: 5.4 },
  // ITALIA
  "Inter": { a: 2.2, d: 0.6, c: 6.1 }, "Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9 }, "Napoli": { a: 1.5, d: 1.3, c: 5.9 },
  // ALEMANIA
  "Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "Bayern": { a: 2.7, d: 1.1, c: 7.3 },
  "Dortmund": { a: 1.9, d: 1.3, c: 5.6 }, "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.2, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.3, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  
  let p1 = 0, pX = 0, p2 = 0, maxP = 0, exact = "0-0";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; exact = `${i}-${j}`; }
    }
  }
  const q1 = (1 / (p1 + 0.05)).toFixed(2);
  const qX = (1 / (pX + 0.05)).toFixed(2);
  const q2 = (1 / (p2 + 0.05)).toFixed(2);
  const bestPick = p1 > p2 && p1 > pX ? "1" : (p2 > pX ? "2" : "X");

  return { 
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1, qX, q2, exact, bestPick, prob: Math.max(p1, pX, p2)
  };
}

/* ============================================================
   2. COMPONENTE PRINCIPAL
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("LALIGA");
  const [ticket, setTicket] = useState([]);

  const initialData = {
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "sp2", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "sp3", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "sp4", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "en3", home: "Chelsea", away: "Man City", date: "12.04" }
    ],
    "CHAMPIONS": [
      { id: "ucl1", home: "Arsenal", away: "Bayern", date: "07.04" },
      { id: "ucl2", home: "Real Madrid", away: "Man City", date: "07.04" }
    ],
    "EUROPA LEAGUE": [
      { id: "uel1", home: "Leverkusen", away: "West Ham", date: "09.04" },
      { id: "uel2", home: "Milan", away: "Roma", date: "09.04" }
    ]
  };

  const addToTicket = (match, pick, q) => {
    setTicket(prev => {
      const exists = prev.find(t => t.id === match.id);
      if (exists) return prev.filter(t => t.id !== match.id);
      return [...prev, { ...match, pick, q }];
    });
  };

  // Generador de Combinadas IA (Mejores 3 del total de partidos)
  const aiCombos = useMemo(() => {
    const all = Object.values(initialData).flat().map(m => ({ ...m, result: runModel(m) }));
    all.sort((a, b) => b.result.prob - a.result.prob);
    return {
      basica: all.slice(0, 2),
      moderada: all.slice(0, 3),
      arriesgada: all.slice(0, 4)
    };
  }, []);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center" }}>GOLPREDICT ULTRA</h2>

      <nav style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
        {["LIGAS", "COMBINADAS", "TICKET"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "10px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
            {t} {t === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace:"nowrap", padding: "8px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#888", border: "1px solid #333", borderRadius: "10px", fontSize: "0.7rem" }}>{l}</button>
            ))}
          </div>
          {initialData[league].map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "COMBINADAS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ComboView title="IA BÁSICA" color="#00ff41" matches={aiCombos.basica} />
          <ComboView title="IA MODERADA" color="#ffaa00" matches={aiCombos.moderada} />
          <ComboView title="IA ARRIESGADA" color="#ff3333" matches={aiCombos.arriesgada} />
        </div>
      )}

      {activeTab === "TICKET" && <TicketView ticket={ticket} setTicket={setTicket} />}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const data = useMemo(() => runModel(match), [match]);
  const currentPick = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "10px", border: "1px solid #222" }}>
      <div style={{ fontSize: "0.7rem", color: "#00ff41", marginBottom: "5px" }}>📅 {match.date}</div>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}>{match.home} vs {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {[
          { l: "1", q: data.q1, p: data.p1 },
          { l: "X", q: data.qX, p: data.pX },
          { l: "2", q: data.q2, p: data.p2 }
        ].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: currentPick === i.l ? "#00ff41" : "#050505", color: currentPick === i.l ? "#000" : "#fff", border: "1px solid #333", borderRadius: "6px", padding: "8px" }}>
            <div style={{fontSize:"0.8rem"}}>@{i.q}</div>
            <div style={{fontSize:"0.6rem", opacity:0.7}}>{i.p}%</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComboView({ title, color, matches }) {
  const cuotaTotal = matches.reduce((acc, curr) => acc * parseFloat(curr.result.q1), 1).toFixed(2);
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "10px", borderLeft: `5px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <b style={{ color }}>{title}</b>
        <b style={{ color: "#fff" }}>@{cuotaTotal}</b>
      </div>
      {matches.map(m => (
        <div key={m.id} style={{ fontSize: "0.75rem", color: "#ccc", margin: "3px 0" }}>• {m.home} vs {m.away} ({m.result.bestPick})</div>
      ))}
    </div>
  );
}

function TicketView({ ticket, setTicket }) {
  const cuota = ticket.reduce((acc, curr) => acc * curr.q, 1).toFixed(2);
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "10px" }}>
      <h3 style={{color:"#00ff41", marginTop:0}}>TU TICKET</h3>
      {ticket.map(t => (
        <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #222", fontSize: "0.8rem" }}>
          <span>{t.home} ({t.pick})</span>
          <b>@{t.q}</b>
        </div>
      ))}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <span>CUOTA TOTAL: </span>
        <b style={{ color: "#00ff41", fontSize: "1.2rem" }}>@{cuota}</b>
      </div>
      <button onClick={() => setTicket([])} style={{ width: "100%", marginTop: "15px", padding: "10px", background: "#ff3333", border: "none", borderRadius: "8px", fontWeight: "bold" }}>LIMPIAR</button>
    </div>
  );
                                          }
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
