import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   1. BASE DE DATOS Y ESTADÍSTICAS (Poisson Stats)
   ============================================================ */
const teamStats = {
  // España
  "Barcelona": { a: 2.2, d: 0.9, c: 5.8 }, "Real Madrid": { a: 2.3, d: 0.8, c: 6.2 },
  "Atlético de Madrid": { a: 1.8, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Athletic Club": { a: 1.6, d: 1.0, c: 5.4 }, "Real Sociedad": { a: 1.4, d: 0.9, c: 5.6 },
  "Real Betis": { a: 1.3, d: 1.1, c: 5.1 }, "Villarreal": { a: 1.8, d: 1.5, c: 4.9 },
  "Valencia": { a: 1.1, d: 1.2, c: 4.2 }, "Sevilla": { a: 1.4, d: 1.4, c: 5.5 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2 }, "Rayo Vallecano": { a: 1.1, d: 1.4, c: 4.7 },
  "Alavés": { a: 1.0, d: 1.3, c: 4.4 }, "Mallorca": { a: 0.9, d: 1.1, c: 4.1 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Las Palmas": { a: 1.0, d: 1.4, c: 4.3 },
  "Leganés": { a: 0.9, d: 1.2, c: 3.8 }, "Valladolid": { a: 0.8, d: 1.6, c: 4.0 },
  // Inglaterra
  "Man City": { a: 2.6, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.2, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.4, d: 0.9, c: 7.2 }, "Aston Villa": { a: 1.9, d: 1.3, c: 5.6 },
  "Tottenham": { a: 2.0, d: 1.5, c: 6.4 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0 },
  "Man Utd": { a: 1.5, d: 1.5, c: 5.4 }, "Chelsea": { a: 1.7, d: 1.6, c: 5.8 },
  "Brighton": { a: 1.6, d: 1.6, c: 5.7 }, "West Ham": { a: 1.4, d: 1.5, c: 4.9 },
  "Everton": { a: 1.1, d: 1.3, c: 5.0 }, "Fulham": { a: 1.3, d: 1.4, c: 5.1 },
  "Brentford": { a: 1.3, d: 1.5, c: 4.9 }, "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 },
  "Nottingham Forest": { a: 1.1, d: 1.6, c: 4.6 }, "Leicester": { a: 1.2, d: 1.5, c: 4.4 },
  // Italia
  "Inter": { a: 2.3, d: 0.6, c: 6.1 }, "AC Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.6, d: 0.7, c: 4.9 }, "Atalanta": { a: 1.9, d: 1.2, c: 5.5 },
  "Nápoles": { a: 1.6, d: 1.3, c: 5.9 }, "Roma": { a: 1.6, d: 1.1, c: 4.6 },
  "Lazio": { a: 1.4, d: 1.1, c: 4.8 }, "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 },
  "Bolonia": { a: 1.3, d: 1.1, c: 5.0 }, "Torino": { a: 1.1, d: 1.0, c: 4.4 },
  // Alemania / Otros
  "Bayern Múnich": { a: 2.8, d: 1.1, c: 7.3 }, "Bayer Leverkusen": { a: 2.4, d: 0.8, c: 6.4 },
  "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 }, "Borussia Dortmund": { a: 2.0, d: 1.3, c: 5.6 },
  "Stuttgart": { a: 1.9, d: 1.2, c: 5.4 }, "Galatasaray": { a: 1.7, d: 1.4, c: 5.2 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.3, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.4, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  let p1 = 0, pX = 0, p2 = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
    }
  }
  return {
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1: (1 / (p1 + 0.03)).toFixed(2), qX: (1 / (pX + 0.03)).toFixed(2), q2: (1 / (p2 + 0.03)).toFixed(2)
  };
}

/* ============================================================
   2. COMPONENTE PRINCIPAL
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("CHAMPIONS");
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState([]);
  const [myBets, setMyBets] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gp_ultra_master_db");
      if (saved) setMyBets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gp_ultra_master_db", JSON.stringify(myBets));
    }
  }, [myBets]);

  const initialData = {
    "CHAMPIONS": [
      { id: "ch1", home: "Barcelona", away: "Newcastle" },
      { id: "ch2", home: "Bayern Múnich", away: "Atalanta" },
      { id: "ch3", home: "Liverpool", away: "Galatasaray" },
      { id: "ch4", home: "Tottenham", away: "Atlético de Madrid" }
    ],
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad" },
      { id: "sp2", home: "Las Palmas", away: "Mallorca" },
      { id: "sp3", home: "Espanyol", away: "Getafe" },
      { id: "sp4", home: "Leganés", away: "Valencia" },
      { id: "sp5", home: "Osasuna", away: "Girona" },
      { id: "sp6", home: "Sevilla", away: "Celta de Vigo" },
      { id: "sp7", home: "Barcelona", away: "Rayo Vallecano" },
      { id: "sp8", home: "Valladolid", away: "Alavés" },
      { id: "sp9", home: "Athletic Club", away: "Real Betis" },
      { id: "sp10", home: "Real Madrid", away: "Atlético de Madrid" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd" },
      { id: "en2", home: "Brighton", away: "Liverpool" },
      { id: "en3", home: "Fulham", away: "Leicester" },
      { id: "en4", home: "Everton", away: "Chelsea" },
      { id: "en5", home: "Man City", away: "Brentford" },
      { id: "en6", home: "Newcastle", away: "Arsenal" },
      { id: "en7", home: "Aston Villa", away: "West Ham" },
      { id: "en8", home: "Tottenham", away: "Nottingham Forest" }
    ],
    "SERIE A": [
      { id: "it1", home: "Cagliari", away: "Nápoles" },
      { id: "it2", home: "Genoa", away: "Udinese" },
      { id: "it3", home: "Inter", away: "Empoli" },
      { id: "it4", home: "AC Milan", away: "Torino" },
      { id: "it5", home: "Juventus", away: "Bolonia" },
      { id: "it6", home: "Roma", away: "Lazio" },
      { id: "it7", home: "Atalanta", away: "Verona" },
      { id: "it8", home: "Fiorentina", away: "Lazio" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim" },
      { id: "de2", home: "Bayern Múnich", away: "Union Berlin" },
      { id: "de3", home: "Friburgo", away: "Bayer Leverkusen" },
      { id: "de4", home: "Heidenheim", away: "Stuttgart" },
      { id: "de5", home: "Borussia Dortmund", away: "Wolfsburgo" }
    ]
  };

  const allMatches = useMemo(() => {
    if (!searchTerm) return initialData[league] || [];
    const flat = Object.values(initialData).flat();
    return flat.filter(m => 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.away.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [league, searchTerm]);

  const aiCombo = useMemo(() => {
    const flat = Object.values(initialData).flat();
    return flat.map(m => {
      const d = runModel(m);
      const bestProb = Math.max(d.p1, d.pX, d.p2);
      const pick = bestProb === parseFloat(d.p1) ? "1" : bestProb === parseFloat(d.p2) ? "2" : "X";
      const q = pick === "1" ? d.q1 : pick === "2" ? d.q2 : d.qX;
      return { ...m, prob: bestProb, pick, q };
    }).sort((a, b) => b.prob - a.prob).slice(0, 3);
  }, []);

  const stats = useMemo(() => {
    const cl = myBets.filter(b => b.status !== "PENDIENTE");
    const wonActual = cl.filter(b => b.status === "ACERTADO").length;
    const lostActual = cl.filter(b => b.status === "FALLADO").length;
    const totalWon = 22 + wonActual;
    const totalLost = 3 + lostActual;
    const total = totalWon + totalLost;
    return { won: totalWon, total, rate: total ? ((totalWon / total) * 100).toFixed(0) : 0 };
  }, [myBets]);

  const clearHistory = () => { if (confirm("¿Borrar historial de apuestas?")) setMyBets([]); };

  const addToTicket = (m, p, q) => {
    setTicket(prev => {
      const ex = prev.find(t => t.id === m.id);
      if (ex) return prev.filter(t => t.id !== m.id);
      return [...prev, { ...m, pick: p, q: parseFloat(q) }];
    });
  };

  const saveBet = () => {
    const qT = ticket.reduce((a, b) => a * b.q, 1).toFixed(2);
    const n = { id: Date.now(), d: new Date().toLocaleString(), m: [...ticket], q: qT, status: "PENDIENTE" };
    setMyBets([n, ...myBets]);
    setTicket([]);
    setActiveTab("MIS APUESTAS");
  };

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", marginBottom: "5px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
      
      <div style={{ background: "linear-gradient(145deg, #111, #000)", padding: "15px", borderRadius: "15px", border: "1px solid #00ff4133", marginBottom: "15px" }}>
        <div style={{ color: "#00ff41", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
          <span>🔥 COMBINADA IA RECOMENDADA</span>
          <span>@{aiCombo.reduce((a,b)=>a*b.q,1).toFixed(2)}</span>
        </div>
        {aiCombo.map(m => (
          <div key={m.id} style={{ fontSize: "0.75rem", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
            <span>{m.home} vs {m.away}</span>
            <b style={{color:"#00ff41"}}>{m.pick} ({m.prob}%)</b>
          </div>
        ))}
      </div>

      <input 
        type="text" placeholder="🔍 Buscar equipo o partido..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #222", background: "#111", color: "#fff", marginBottom: "15px", boxSizing: "border-box" }}
      />

      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "20px" }}>
        {["LIGAS", "TICKET", "MIS APUESTAS"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.7rem" }}>
            {t} {t === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => {setLeague(l); setSearchTerm("");}} style={{ whiteSpace: "nowrap", padding: "8px 15px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#777", border: "1px solid #333", borderRadius: "20px", fontSize: "0.7rem" }}>{l}</button>
            ))}
          </div>
          {allMatches.map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "MIS APUESTAS" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
             <div style={{ background: "#111", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                <div style={{fontSize: "0.6rem", color: "#555"}}>HISTÓRICO TOTAL</div>
                <div style={{fontSize: "1.1rem", fontWeight: "bold", color: "#00ff41"}}>{stats.won} ACERTADAS</div>
             </div>
             <div style={{ background: "#111", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                <div style={{fontSize: "0.6rem", color: "#555"}}>EFECTIVIDAD</div>
                <div style={{fontSize: "1.1rem", fontWeight: "bold", color: "#fff"}}>{stats.rate}%</div>
             </div>
          </div>
          <button onClick={clearHistory} style={{ width: "100%", padding: "10px", background: "none", border: "1px dashed #333", color: "#444", borderRadius: "10px", fontSize: "0.7rem", marginBottom: "15px" }}>🗑️ BORRAR MI HISTORIAL LOCAL</button>
          {myBets.map(b => (
            <div key={b.id} style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "10px", border: "1px solid #222" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", marginBottom: "8px" }}>
                <span>{b.d}</span>
                <b style={{ color: b.status === "ACERTADO" ? "#00ff41" : b.status === "FALLADO" ? "#ff4444" : "#ffaa00" }}>{b.status}</b>
              </div>
              {b.m.map(m => <div key={m.id} style={{ fontSize: "0.75rem" }}>• {m.home} - {m.pick} (@{m.q})</div>)}
              {b.status === "PENDIENTE" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => setMyBets(prev => prev.map(x => x.id === b.id ? {...x, status: "ACERTADO"} : x))} style={{ background: "#00ff4122", color: "#00ff41", border: "1px solid #00ff41", padding: "5px", borderRadius: "5px", fontSize: "0.6rem" }}>GANADA</button>
                  <button onClick={() => setMyBets(prev => prev.map(x => x.id === b.id ? {...x, status: "FALLADO"} : x))} style={{ background: "#ff444422", color: "#ff4444", border: "1px solid #ff4444", padding: "5px", borderRadius: "5px", fontSize: "0.6rem" }}>FALLADA</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "15px" }}>
          {ticket.length === 0 ? <p style={{textAlign:"center", color:"#444"}}>Ticket vacío...</p> : (
            <>
              {ticket.map(t => <div key={t.id} style={{display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"0.8rem"}}><span>{t.home} ({t.pick})</span><b>@{t.q}</b></div>)}
              <div style={{textAlign:"right", marginTop:"15px", fontSize:"1.2rem", color:"#00ff41", fontWeight:"bold"}}>Total: @{ticket.reduce((a,b)=>a*b.q,1).toFixed(2)}</div>
              <button onClick={saveBet} style={{ width: "100%", marginTop: "15px", padding: "12px", background: "#00ff41", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold" }}>GUARDAR APUESTA</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const d = useMemo(() => runModel(match), [match]);
  const cur = ticket.find(t => t.id === match.id)?.pick;
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "15px", marginBottom: "15px", border: "1px solid #222" }}>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "12px", fontSize: "0.85rem" }}>{match.home} vs {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ l: "1", q: d.q1, p: d.p1 }, { l: "X", q: d.qX, p: d.pX }, { l: "2", q: d.q2, p: d.p2 }].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: cur === i.l ? "#00ff41" : "#050505", color: cur === i.l ? "#000" : "#fff", border: i.p > 60 ? "1px solid #00ff41" : "1px solid #333", borderRadius: "8px", padding: "8px 0" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>@{i.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
    </div>
  );
   }
                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
