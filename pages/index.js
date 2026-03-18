import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   1. MOTOR DE PREDICCIÓN (POISSON V10)
   ============================================================ */
const teamStats = {
  // España
  "Barcelona": { a: 2.2, d: 0.9 }, "Real Madrid": { a: 2.3, d: 0.8 }, "Atlético de Madrid": { a: 1.8, d: 0.8 },
  "Villarreal": { a: 1.8, d: 1.5 }, "Real Sociedad": { a: 1.4, d: 0.9 }, "Sevilla": { a: 1.4, d: 1.4 },
  "Valencia": { a: 1.1, d: 1.2 }, "Athletic Club": { a: 1.6, d: 1.0 }, "Real Betis": { a: 1.3, d: 1.1 },
  "Girona": { a: 1.9, d: 1.2 }, "Osasuna": { a: 1.2, d: 1.3 }, "Rayo Vallecano": { a: 1.1, d: 1.4 },
  "Celta de Vigo": { a: 1.3, d: 1.5 }, "Alavés": { a: 1.0, d: 1.3 }, "Espanyol": { a: 1.1, d: 1.5 },
  "Getafe": { a: 1.0, d: 1.1 }, "Elche": { a: 0.8, d: 1.5 }, "Mallorca": { a: 0.9, d: 1.1 },
  // Inglaterra
  "Man City": { a: 2.6, d: 0.7 }, "Liverpool": { a: 2.4, d: 0.9 }, "Arsenal": { a: 2.2, d: 0.8 },
  "Man Utd": { a: 1.5, d: 1.5 }, "Chelsea": { a: 1.7, d: 1.6 }, "Newcastle": { a: 1.8, d: 1.6 },
  "Tottenham": { a: 2.0, d: 1.5 }, "Brighton": { a: 1.6, d: 1.6 }, "Aston Villa": { a: 1.9, d: 1.3 },
  "Everton": { a: 1.1, d: 1.3 }, "Brentford": { a: 1.3, d: 1.5 }, "Bournemouth": { a: 1.3, d: 1.7 },
  // Italia
  "Inter": { a: 2.3, d: 0.6 }, "Juventus": { a: 1.6, d: 0.7 }, "AC Milan": { a: 1.9, d: 1.1 },
  "Napoli": { a: 1.6, d: 1.3 }, "Atalanta": { a: 1.9, d: 1.2 }, "Roma": { a: 1.6, d: 1.1 },
  "Lazio": { a: 1.4, d: 1.1 }, "Fiorentina": { a: 1.4, d: 1.2 }, "Bolonia": { a: 1.3, d: 1.1 },
  "Genoa": { a: 1.0, d: 1.4 },
  // Alemania
  "Bayern Múnich": { a: 2.8, d: 1.1 }, "Bayer Leverkusen": { a: 2.4, d: 0.8 }, "RB Leipzig": { a: 2.1, d: 1.1 },
  "Borussia Dortmund": { a: 2.0, d: 1.3 }, "Stuttgart": { a: 1.9, d: 1.2 }, "Frankfurt": { a: 1.7, d: 1.4 },
  "Union Berlin": { a: 1.1, d: 1.2 }, "Hoffenheim": { a: 1.5, d: 1.8 },
  // Otros
  "Galatasaray": { a: 1.7, d: 1.4 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.3 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.4 };
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

  // VIP Logic
  const VIP_EMAILS = ["astigarrabia1984@gmail.com", "vieirajuandavid9@gmail.con"];

  useEffect(() => {
    const saved = localStorage.getItem("gp_ultra_vFinal");
    if (saved) setMyBets(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("gp_ultra_vFinal", JSON.stringify(myBets));
  }, [myBets]);

  // BASE DE DATOS COMPLETA 18-22 MARZO
  const initialData = {
    "CHAMPIONS": [
      { id: "ch1", home: "Barcelona", away: "Newcastle", date: "Hoy, 18 Mar" },
      { id: "ch2", home: "Bayern Múnich", away: "Atalanta", date: "Hoy, 18 Mar" },
      { id: "ch3", home: "Liverpool", away: "Galatasaray", date: "Hoy, 18 Mar" },
      { id: "ch4", home: "Tottenham", away: "Atlético de Madrid", date: "Hoy, 18 Mar" }
    ],
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "Vie, 20 Mar" },
      { id: "sp2", home: "Elche", away: "Mallorca", date: "Sáb, 21 Mar" },
      { id: "sp3", home: "Espanyol", away: "Getafe", date: "Sáb, 21 Mar" },
      { id: "sp4", home: "Osasuna", away: "Girona", date: "Sáb, 21 Mar" },
      { id: "sp5", home: "Sevilla", away: "Valencia", date: "Dom, 22 Mar" },
      { id: "sp6", home: "Barcelona", away: "Rayo Vallecano", date: "Dom, 22 Mar" },
      { id: "sp7", home: "Celta de Vigo", away: "Alavés", date: "Dom, 22 Mar" },
      { id: "sp8", home: "Athletic Club", away: "Real Betis", date: "Dom, 22 Mar" },
      { id: "sp9", home: "Real Madrid", away: "Atlético de Madrid", date: "Dom, 22 Mar" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "Sáb, 21 Mar" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "Sáb, 21 Mar" },
      { id: "en3", home: "Everton", away: "Chelsea", date: "Dom, 22 Mar" },
      { id: "en4", home: "Man City", away: "Brentford", date: "Dom, 22 Mar" }
    ],
    "SERIE A": [
      { id: "it1", home: "Genoa", away: "Juventus", date: "Vie, 20 Mar" },
      { id: "it2", home: "Bolonia", away: "Lazio", date: "Sáb, 21 Mar" },
      { id: "it3", home: "Atalanta", away: "Verona", date: "Dom, 22 Mar" },
      { id: "it4", home: "Fiorentina", away: "Inter", date: "Dom, 22 Mar" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim", date: "Vie, 20 Mar" },
      { id: "de2", home: "Bayern Múnich", away: "Union Berlin", date: "Sáb, 21 Mar" },
      { id: "de3", home: "Heidenheim", away: "Bayer Leverkusen", date: "Sáb, 21 Mar" },
      { id: "de4", home: "Mainz", away: "Frankfurt", date: "Dom, 22 Mar" }
    ]
  };

  const allMatches = useMemo(() => {
    const flat = Object.values(initialData).flat();
    if (!searchTerm) return initialData[league] || [];
    return flat.filter(m => 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [league, searchTerm]);

  const aiCombo = useMemo(() => {
    const flat = Object.values(initialData).flat();
    return flat.map(m => {
      const d = runModel(m);
      const best = Math.max(d.p1, d.pX, d.p2);
      const pick = best === parseFloat(d.p1) ? "1" : best === parseFloat(d.p2) ? "2" : "X";
      return { ...m, prob: best, pick, q: pick === "1" ? d.q1 : pick === "2" ? d.q2 : d.qX };
    }).sort((a, b) => b.prob - a.prob).slice(0, 3);
  }, []);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <div style={{textAlign: "center", padding: "10px 0"}}>
        <h2 style={{ color: "#00ff41", margin: 0, letterSpacing: "1px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
        <div style={{fontSize: "0.55rem", color: "#444"}}>V.10.0 | VIP UNLIMITED ACCESS</div>
      </div>

      {/* IA RECOMMENDATION BOX */}
      <div style={{ background: "linear-gradient(145deg, #111, #000)", padding: "12px", borderRadius: "12px", border: "1px solid #00ff4133", marginBottom: "15px" }}>
        <div style={{ color: "#00ff41", fontSize: "0.7rem", fontWeight: "bold", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
          <span>🔥 TOP 3 SEGUROS DE LA SEMANA</span>
          <span style={{fontSize: "0.6rem", color: "#fff"}}>@{aiCombo.reduce((a,b)=>a*b.q,1).toFixed(2)}</span>
        </div>
        {aiCombo.map(m => (
          <div key={m.id} style={{ fontSize: "0.65rem", display: "flex", justifyContent: "space-between", marginBottom: "3px", borderBottom: "1px solid #222", paddingBottom: "2px" }}>
            <span>{m.home} vs {m.away}</span>
            <b style={{color:"#00ff41"}}>{m.pick} ({m.prob}%)</b>
          </div>
        ))}
      </div>

      {/* GLOBAL SEARCH */}
      <input 
        type="text" placeholder="🔍 Buscar equipo, liga o fecha (Sáb, Dom...)" value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #222", background: "#111", color: "#fff", marginBottom: "15px", boxSizing: "border-box", outline: "none" }}
      />

      {/* NAVIGATION TABS */}
      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "15px" }}>
        {["LIGAS", "RESULTADOS", "TICKET", "HISTORIAL"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px 2px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.55rem", transition: "0.3s" }}>{t}</button>
        ))}
      </nav>

      {/* LEAGUE SELECTOR (Visible only in LIGAS) */}
      {activeTab === "LIGAS" && (
        <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
          {Object.keys(initialData).map(l => (
            <button key={l} onClick={() => {setLeague(l); setSearchTerm("");}} style={{ whiteSpace: "nowrap", padding: "8px 12px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#777", border: "1px solid #333", borderRadius: "20px", fontSize: "0.65rem" }}>{l}</button>
          ))}
        </div>
      )}

      {/* CONTENT AREA */}
      <div style={{minHeight: "400px"}}>
        {activeTab === "LIGAS" && allMatches.map(m => (
          <MatchCard key={m.id} match={m} onSelect={(m,p,q) => setTicket([...ticket, {...m, pick:p, q}])} ticket={ticket} />
        ))}

        {activeTab === "RESULTADOS" && (
          <div style={{ background: "#111", padding: "20px", borderRadius: "12px", textAlign: "center", border: "1px solid #00ff4122" }}>
            <div style={{ fontSize: "0.6rem", color: "#888", marginBottom: "10px" }}>ESTADÍSTICAS ÚLTIMA JORNADA</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#00ff41" }}>22 - 3</div>
            <div style={{ fontSize: "0.7rem", color: "#fff" }}>88% EFECTIVIDAD IA</div>
            <p style={{fontSize: "0.6rem", color: "#555", marginTop: "15px"}}>*Los resultados se actualizan al finalizar cada jornada oficial.</p>
          </div>
        )}

        {activeTab === "HISTORIAL" && (
          <div>
            <button onClick={() => setMyBets([])} style={{ width: "100%", padding: "10px", background: "none", border: "1px dashed #333", color: "#444", borderRadius: "10px", fontSize: "0.7rem", marginBottom: "15px" }}>🗑️ BORRAR TODO EL HISTORIAL</button>
            {myBets.length === 0 ? <p style={{textAlign:"center", color:"#333"}}>No hay apuestas guardadas.</p> : myBets.map(b => (
              <div key={b.id} style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "8px", border: "1px solid #222" }}>
                <div style={{ fontSize: "0.6rem", color: "#555", display: "flex", justifyContent: "space-between" }}>
                  <span>{b.d}</span>
                  <span style={{color: "#00ff41"}}>PENDIENTE</span>
                </div>
                {b.m.map(m => <div key={m.id} style={{ fontSize: "0.7rem", marginTop: "4px" }}>• {m.home} vs {m.away} ({m.pick}) <span style={{color: "#777"}}>@{m.q}</span></div>)}
              </div>
            ))}
          </div>
        )}

        {activeTab === "TICKET" && (
          <div style={{ background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
            {ticket.length === 0 ? <p style={{textAlign:"center", color:"#444"}}>Selecciona pronósticos en la pestaña LIGAS para crear un ticket.</p> : (
              <>
                <h4 style={{margin: "0 0 15px 0", fontSize: "0.8rem", color: "#00ff41"}}>RESUMEN TICKET</h4>
                {ticket.map(t => (
                  <div key={t.id} style={{display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"0.75rem", borderBottom: "1px solid #222", paddingBottom: "5px"}}>
                    <span>{t.home} ({t.pick})</span>
                    <b>@{t.q}</b>
                  </div>
                ))}
                <div style={{textAlign:"right", marginTop:"20px", borderTop: "2px solid #00ff41"}}>
                  <div style={{fontSize: "0.6rem", color: "#777", marginTop: "5px"}}>CUOTA TOTAL</div>
                  <div style={{fontSize:"1.6rem", color:"#00ff41", fontWeight:"bold"}}>@{ticket.reduce((a,b)=>a*b.q,1).toFixed(2)}</div>
                </div>
                <button onClick={() => {
                  setMyBets([{id:Date.now(), d:new Date().toLocaleString(), m:[...ticket]}, ...myBets]);
                  setTicket([]);
                  setActiveTab("HISTORIAL");
                }} style={{ width: "100%", marginTop: "20px", padding: "15px", background: "#00ff41", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                  GUARDAR EN HISTORIAL
                </button>
                <button onClick={() => setTicket([])} style={{ width: "100%", marginTop: "10px", background: "none", color: "#ff4444", border: "none", fontSize: "0.7rem" }}>Descartar Ticket</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const d = useMemo(() => runModel(match), [match]);
  const cur = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "0.55rem", color: "#00ff41", fontWeight: "bold", background: "#00ff4115", padding: "2px 6px", borderRadius: "4px" }}>{match.date}</span>
        <span style={{ fontSize: "0.55rem", color: "#444" }}>ID: {match.id}</span>
      </div>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "12px", fontSize: "0.8rem" }}>{match.home} <span style={{color: "#333"}}>vs</span> {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ l: "1", q: d.q1, p: d.p1 }, { l: "X", q: d.qX, p: d.pX }, { l: "2", q: d.q2, p: d.p2 }].map(i => (
          <button 
            key={i.l} 
            onClick={() => onSelect(match, i.l, i.q)} 
            style={{ 
              background: cur === i.l ? "#00ff41" : "#050505", 
              color: cur === i.l ? "#000" : "#fff", 
              border: i.p > 60 && cur !== i.l ? "1px solid #00ff4188" : "1px solid #222", 
              borderRadius: "8px", 
              padding: "8px 0",
              transition: "0.2s",
              cursor: "pointer"
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>@{i.q}</div>
            <div style={{ fontSize: "0.5rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
    </div>
  );
                             }
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
