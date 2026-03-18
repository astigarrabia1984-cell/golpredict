import React, { useState, useMemo } from "react";

/* ============================================================
   1. ESTADÍSTICAS DE EQUIPOS (Optimizado)
   ============================================================ */
const teamStats = {
  "Barcelona": { a: 2.1, d: 0.9, c: 5.8 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0 },
  "Bayern Múnich": { a: 2.7, d: 1.1, c: 7.3 }, "Atalanta": { a: 1.8, d: 1.2, c: 5.5 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2 }, "Galatasaray": { a: 1.6, d: 1.4, c: 5.2 },
  "Tottenham": { a: 2.0, d: 1.5, c: 6.4 }, "Atlético de Madrid": { a: 1.7, d: 0.8, c: 4.8 },
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9 }, "Real Sociedad": { a: 1.3, d: 0.9, c: 5.6 },
  "Sevilla": { a: 1.4, d: 1.4, c: 5.5 }, "Valencia": { a: 1.1, d: 1.2, c: 4.2 },
  "Athletic Club": { a: 1.5, d: 1.0, c: 5.4 }, "Real Betis": { a: 1.3, d: 1.1, c: 5.1 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5 }, "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2 },
  "Mallorca": { a: 0.9, d: 1.1, c: 4.1 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Rayo Vallecano": { a: 1.0, d: 1.4, c: 4.7 }, "Alavés": { a: 1.0, d: 1.3, c: 4.4 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Elche": { a: 0.8, d: 1.6, c: 3.9 },
  "Levante": { a: 1.2, d: 1.3, c: 4.8 }, "Real Oviedo": { a: 1.0, d: 1.1, c: 4.2 },
  "Man City": { a: 2.5, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8 },
  "Man Utd": { a: 1.5, d: 1.5, c: 5.4 }, "Chelsea": { a: 1.7, d: 1.6, c: 5.8 },
  "Aston Villa": { a: 1.9, d: 1.3, c: 5.6 }, "Brighton": { a: 1.6, d: 1.6, c: 5.7 },
  "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 }, "Everton": { a: 1.1, d: 1.3, c: 5.0 },
  "West Ham": { a: 1.4, d: 1.5, c: 4.9 }, "Fulham": { a: 1.3, d: 1.4, c: 5.1 },
  "Burnley": { a: 0.9, d: 1.8, c: 4.3 }, "Leeds Utd": { a: 1.4, d: 1.7, c: 5.5 },
  "Brentford": { a: 1.3, d: 1.5, c: 4.9 }, "Nottingham Forest": { a: 1.1, d: 1.6, c: 4.6 },
  "Sunderland": { a: 1.1, d: 1.4, c: 4.5 }, "Wolves": { a: 1.1, d: 1.4, c: 4.7 },
  "Crystal Palace": { a: 1.2, d: 1.4, c: 4.8 },
  "Inter": { a: 2.2, d: 0.6, c: 6.1 }, "AC Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9 }, "Nápoles": { a: 1.5, d: 1.3, c: 5.9 },
  "Roma": { a: 1.6, d: 1.1, c: 4.6 }, "Lazio": { a: 1.3, d: 1.1, c: 4.8 },
  "Torino": { a: 1.0, d: 1.0, c: 4.4 }, "Sassuolo": { a: 1.2, d: 1.6, c: 4.2 },
  "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 }, "Bolonia": { a: 1.3, d: 1.1, c: 5.0 },
  "Genoa": { a: 1.1, d: 1.3, c: 4.5 }, "Cagliari": { a: 1.0, d: 1.5, c: 4.4 },
  "Udinese": { a: 1.0, d: 1.2, c: 4.6 }, "Verona": { a: 1.0, d: 1.4, c: 4.2 },
  "Lecce": { a: 0.8, d: 1.4, c: 3.9 }, "Parma": { a: 1.1, d: 1.4, c: 4.3 },
  "Pisa": { a: 0.9, d: 1.2, c: 4.1 }, "Cremonese": { a: 0.9, d: 1.7, c: 4.1 },
  "Como": { a: 1.0, d: 1.3, c: 4.0 },
  "Bayer Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "Borussia Dortmund": { a: 1.9, d: 1.3, c: 5.6 },
  "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 }, "Stuttgart": { a: 2.0, d: 1.2, c: 5.8 },
  "Eintracht Fráncfort": { a: 1.5, d: 1.4, c: 5.2 }, "Hoffenheim": { a: 1.5, d: 1.8, c: 4.7 },
  "Friburgo": { a: 1.3, d: 1.4, c: 4.9 }, "Augsburgo": { a: 1.2, d: 1.6, c: 4.6 },
  "Werder Bremen": { a: 1.2, d: 1.5, c: 4.8 }, "Wolfsburgo": { a: 1.2, d: 1.4, c: 4.7 },
  "Borussia M'gladbach": { a: 1.3, d: 1.6, c: 5.0 }, "Mainz": { a: 1.1, d: 1.4, c: 4.5 },
  "Hamburgo": { a: 1.2, d: 1.4, c: 4.5 }, "Union Berlin": { a: 1.0, d: 1.2, c: 4.1 },
  "Colonia": { a: 1.0, d: 1.5, c: 4.2 }, "Heidenheim": { a: 1.1, d: 1.4, c: 4.0 },
  "St. Pauli": { a: 1.0, d: 1.3, c: 4.3 }
};

/* ============================================================
   2. MOTOR POISSON
   ============================================================ */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.2, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.3, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  
  let p1 = 0, pX = 0, p2 = 0, maxP = 0, bestI = 0, bestJ = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; bestI = i; bestJ = j; }
    }
  }

  const q1 = (1 / (p1 + 0.05)).toFixed(2);
  const qX = (1 / (pX + 0.05)).toFixed(2);
  const q2 = (1 / (p2 + 0.05)).toFixed(2);

  return { 
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1, qX, q2,
    exact: `${bestI}-${bestJ}`,
    goals: (bestI + bestJ) > 2.5 ? "+2.5 Goles" : "-2.5 Goles",
    corners: (home.c + away.c) * 0.9 > 9.5 ? "+9.5 Córners" : "-9.5 Córners",
    bestPick: p1 > p2 && p1 > pX ? "1" : (p2 > pX ? "2" : "X"),
    bestQuota: p1 > p2 && p1 > pX ? q1 : (p2 > pX ? q2 : qX),
    prob: Math.max(p1, pX, p2)
  };
}

/* ============================================================
   3. APP PRINCIPAL (TODOS LOS PARTIDOS)
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("CHAMPIONS");
  const [ticket, setTicket] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [stake, setStake] = useState(10);
  const [msg, setMsg] = useState("");

  const initialData = {
    "CHAMPIONS": [
      { id: "u1", home: "Barcelona", away: "Newcastle", date: "18.03" },
      { id: "u2", home: "Bayern Múnich", away: "Atalanta", date: "18.03" },
      { id: "u3", home: "Liverpool", away: "Galatasaray", date: "18.03" },
      { id: "u4", home: "Tottenham", away: "Atlético de Madrid", date: "18.03" }
    ],
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "sp2", home: "Elche", away: "Mallorca", date: "21.03" },
      { id: "sp3", home: "Espanyol", away: "Getafe", date: "21.03" },
      { id: "sp4", home: "Levante", away: "Real Oviedo", date: "21.03" },
      { id: "sp5", home: "Osasuna", away: "Girona", date: "21.03" },
      { id: "sp6", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "sp7", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "sp8", home: "Celta de Vigo", away: "Alavés", date: "22.03" },
      { id: "sp9", home: "Athletic Club", away: "Real Betis", date: "22.03" },
      { id: "sp10", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "en3", home: "Fulham", away: "Burnley", date: "21.03" },
      { id: "en4", home: "Everton", away: "Chelsea", date: "21.03" },
      { id: "en5", home: "Leeds Utd", away: "Brentford", date: "21.03" },
      { id: "en6", home: "Newcastle", away: "Sunderland", date: "22.03" },
      { id: "en7", home: "Aston Villa", away: "West Ham", date: "22.03" },
      { id: "en8", home: "Tottenham", away: "Nottingham Forest", date: "22.03" }
    ],
    "SERIE A": [
      { id: "it1", home: "Cagliari", away: "Nápoles", date: "20.03" },
      { id: "it2", home: "Genoa", away: "Udinese", date: "20.03" },
      { id: "it3", home: "Parma", away: "Cremonese", date: "21.03" },
      { id: "it4", home: "AC Milan", away: "Torino", date: "21.03" },
      { id: "it5", home: "Juventus", away: "Sassuolo", date: "21.03" },
      { id: "it6", home: "Como", away: "Pisa", date: "22.03" },
      { id: "it7", home: "Atalanta", away: "Verona", date: "22.03" },
      { id: "it8", home: "Bolonia", away: "Lazio", date: "22.03" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim", date: "20.03" },
      { id: "de2", home: "Bayern Múnich", away: "Union Berlin", date: "21.03" },
      { id: "de3", home: "Colonia", away: "Borussia M'gladbach", date: "21.03" },
      { id: "de4", home: "Heidenheim", away: "Bayer Leverkusen", date: "21.03" },
      { id: "de5", home: "Wolfsburgo", away: "Werder Bremen", date: "21.03" },
      { id: "de6", home: "Borussia Dortmund", away: "Hamburgo", date: "21.03" }
    ]
  };

  const aiCombos = useMemo(() => {
    const all = Object.values(initialData).flat().map(m => ({ ...m, res: runModel(m) }));
    all.sort((a, b) => b.res.prob - a.res.prob);
    return { b: all.slice(0, 2), m: all.slice(0, 3), a: all.slice(0, 4) };
  }, [initialData]);

  const addToTicket = (match, pick, q) => {
    setMsg("");
    setTicket(prev => {
      const exists = prev.find(t => t.id === match.id);
      if (exists) return prev.filter(t => t.id !== match.id);
      return [...prev, { ...match, pick, q: parseFloat(q) }];
    });
  };

  const handleSaveBet = () => {
    const newBet = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      matches: [...ticket],
      totalCuota: totalCuota,
      stake: stake,
      prize: (totalCuota * stake).toFixed(2),
      status: "PENDIENTE"
    };
    setMyBets([newBet, ...myBets]);
    setMsg("✅ GUARDADA");
    setTimeout(() => { setTicket([]); setMsg(""); setActiveTab("MIS APUESTAS"); }, 1200);
  };

  const totalCuota = ticket.reduce((acc, curr) => acc * curr.q, 1).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", marginBottom: "15px", fontSize:"1.3rem" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>

      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "20px" }}>
        {["LIGAS", "COMBOS", "TICKET", "MIS APUESTAS"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px 2px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.6rem", cursor: "pointer" }}>
            {t} {t === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "6px", marginBottom: "15px", paddingBottom:"5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace: "nowrap", padding: "8px 12px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#888", border: "1px solid #333", borderRadius: "20px", fontSize: "0.65rem", fontWeight:"bold", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
          {initialData[league]?.map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "COMBOS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ComboView title="COMBO SEGURO" color="#00ff41" matches={aiCombos.b} onAdd={addToTicket} />
          <ComboView title="COMBO MODERADO" color="#ffaa00" matches={aiCombos.m} onAdd={addToTicket} />
          <ComboView title="COMBO ARRIESGADO" color="#ff3333" matches={aiCombos.a} onAdd={addToTicket} />
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "15px", borderRadius: "12px", border:"1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0, fontSize: "1rem" }}>TICKET ACTUAL</h3>
          {ticket.length === 0 ? <p style={{color:"#666", textAlign:"center", padding:"20px"}}>Añade selecciones...</p> : (
            <>
              {ticket.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #222", fontSize: "0.8rem" }}>
                  <span>{t.home} ({t.pick})</span> <b style={{color:"#00ff41"}}>@{t.q}</b>
                </div>
              ))}
              <div style={{ marginTop: "15px", padding: "12px", background: "#050505", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Cuota:</span> <b style={{ color: "#00ff41" }}>@{totalCuota}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <span>Stake:</span>
                  <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: "60px", background: "#111", border: "1px solid #00ff41", color: "#fff", textAlign: "center" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", borderTop:"1px solid #222", paddingTop:"10px" }}>
                  <b>PREMIO:</b> <b style={{ color: "#00ff41", fontSize: "1.2rem" }}>{(totalCuota * stake).toFixed(2)}€</b>
                </div>
              </div>
              <button onClick={handleSaveBet} style={{ width: "100%", marginTop: "15px", padding: "14px", background: "#00ff41", color: "#000", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
                {msg || "GUARDAR Y CERRAR"}
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === "MIS APUESTAS" && (
        <div>
          <h3 style={{ color: "#00ff41", fontSize: "1rem" }}>HISTORIAL</h3>
          {myBets.map(bet => (
            <div key={bet.id} style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#555", marginBottom: "8px" }}>
                <span>{bet.timestamp}</span> <span style={{ color: "#ffaa00" }}>{bet.status}</span>
              </div>
              {bet.matches.map(m => <div key={m.id} style={{ fontSize: "0.75rem" }}>• {m.home}-{m.away} ({m.pick}) @{m.q}</div>)}
              <div style={{ marginTop: "10px", textAlign: "right", color: "#00ff41", fontWeight: "bold" }}>{bet.prize}€</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const currentPick = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ fontSize:"0.6rem", color:"#555", marginBottom:"6px" }}>📅 {match.date}</div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "0.95rem", marginBottom: "12px" }}>{match.home} vs {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
        {[
          { l: "1", q: data.q1, p: data.p1 }, 
          { l: "X", q: data.qX, p: data.pX }, 
          { l: "2", q: data.q2, p: data.p2 }
        ].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: currentPick === i.l ? "#00ff41" : "#050505", color: currentPick === i.l ? "#000" : "#fff", border: "1px solid #333", borderRadius: "8px", padding: "8px 0", cursor: "pointer" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>@{i.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>{i.p}%</div>
          </button>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} style={{width:"100%", background:"none", border:"none", color:"#444", fontSize:"0.6rem", marginTop:"10px", cursor:"pointer", textDecoration:"underline"}}>VER ANÁLISIS IA</button>
      {open && (
        <div style={{ marginTop: "10px", fontSize: "0.75rem", background: "#050505", padding: "10px", borderRadius: "8px", border:"1px solid #222" }}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>Marcador:</span> <b style={{color:"#00ff41"}}>{data.exact}</b></div>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>Total Goles:</span> <b style={{color:"#00ff41"}}>{data.goals}</b></div>
          <div style={{display:"flex", justifyContent:"space-between"}}><span>Córners:</span> <b>{data.corners}</b></div>
        </div>
      )}
    </div>
  );
}

function ComboView({ title, color, matches, onAdd }) {
  const comboCuota = matches.reduce((acc, curr) => acc * parseFloat(curr.res.bestQuota), 1).toFixed(2);
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", borderLeft: `5px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <b style={{ color, fontSize: "0.85rem" }}>{title}</b>
        <b style={{ color: "#fff" }}>@{comboCuota}</b>
      </div>
      {matches.map(m => (
        <div key={m.id} style={{ fontSize: "0.75rem", color: "#aaa", margin: "4px 0" }}>• {m.home}-{m.away} ({m.res.bestPick})</div>
      ))}
      <button onClick={() => matches.forEach(m => onAdd(m, m.res.bestPick, m.res.bestQuota))} style={{width:"100%", marginTop:"10px", padding:"8px", background:"#222", color:"#fff", border:"1px solid #333", borderRadius:"8px", fontSize:"0.65rem", fontWeight:"bold"}}>AÑADIR AL TICKET</button>
    </div>
  );
       }
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
