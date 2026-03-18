   import React, { useState, useMemo } from "react";

/* ============================================================
   1. CEREBRO ESTADÍSTICO (DATOS DE EQUIPOS)
   ============================================================ */
const teamStats = {
  // ESPAÑA
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2 }, "Barcelona": { a: 2.1, d: 0.9, c: 5.8 },
  "Atlético de Madrid": { a: 1.7, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9 }, "Real Sociedad": { a: 1.3, d: 0.9, c: 5.6 },
  "Sevilla": { a: 1.4, d: 1.4, c: 5.5 }, "Valencia": { a: 1.1, d: 1.2, c: 4.2 },
  "Athletic Club": { a: 1.5, d: 1.0, c: 5.4 }, "Real Betis": { a: 1.3, d: 1.1, c: 5.1 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5 }, "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2 },
  "Mallorca": { a: 0.9, d: 1.1, c: 4.1 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Rayo Vallecano": { a: 1.0, d: 1.4, c: 4.7 }, "Alavés": { a: 1.0, d: 1.3, c: 4.4 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Elche": { a: 0.8, d: 1.6, c: 3.9 },
  "Levante": { a: 1.2, d: 1.4, c: 4.5 }, "Real Oviedo": { a: 1.0, d: 1.1, c: 4.0 },
  // INGLATERRA
  "Man City": { a: 2.5, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2 }, "Man Utd": { a: 1.5, d: 1.5, c: 5.4 },
  "Chelsea": { a: 1.7, d: 1.6, c: 5.8 }, "Tottenham": { a: 2.0, d: 1.5, c: 6.4 },
  "Aston Villa": { a: 1.9, d: 1.3, c: 5.6 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0 },
  "Brighton": { a: 1.6, d: 1.6, c: 5.7 }, "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 },
  "West Ham": { a: 1.4, d: 1.5, c: 4.9 }, "Fulham": { a: 1.3, d: 1.4, c: 4.6 },
  "Everton": { a: 1.1, d: 1.3, c: 5.0 }, "Leeds Utd": { a: 1.2, d: 1.7, c: 4.8 },
  "Sunderland": { a: 1.1, d: 1.4, c: 4.5 }, "Brentford": { a: 1.4, d: 1.5, c: 5.1 },
  // ITALIA
  "Inter": { a: 2.2, d: 0.6, c: 6.1 }, "Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9 }, "Napoli": { a: 1.5, d: 1.3, c: 5.9 },
  "Atalanta": { a: 1.8, d: 1.2, c: 5.5 }, "Roma": { a: 1.6, d: 1.1, c: 4.6 },
  "Lazio": { a: 1.3, d: 1.1, c: 4.8 }, "Bologna": { a: 1.4, d: 1.0, c: 4.5 },
  "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 }, "Torino": { a: 1.0, d: 1.0, c: 4.4 },
  // ALEMANIA
  "Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "Bayern": { a: 2.7, d: 1.1, c: 7.3 },
  "Dortmund": { a: 1.9, d: 1.3, c: 5.6 }, "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 },
  "Stuttgart": { a: 2.1, d: 1.2, c: 5.4 }, "Hoffenheim": { a: 1.5, d: 1.8, c: 4.7 }
};

/* ============================================================
   2. MOTOR DE POISSON & CÁLCULOS
   ============================================================ */
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
  // Cuotas generadas matemáticamente (Probabilidad + Margen 5%)
  return { 
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1: (1 / (p1 + 0.05)).toFixed(2), qX: (1 / (pX + 0.05)).toFixed(2), q2: (1 / (p2 + 0.05)).toFixed(2),
    exact, goals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5", corners: (home.c + away.c) * 0.9 > 9.5 ? "+9.5" : "-9.5" 
  };
}

/* ============================================================
   3. COMPONENTE PRINCIPAL (INTERFAZ)
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("LALIGA");
  const [ticket, setTicket] = useState([]);
  const [stake, setStake] = useState(10);

  const initialData = {
    "LALIGA": [
      { id: "j29_1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "j29_2", home: "Elche", away: "Mallorca", date: "21.03" },
      { id: "j29_3", home: "Espanyol", away: "Getafe", date: "21.03" },
      { id: "j29_6", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "j29_7", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "j29_10", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" }
    ],
    "PREMIER": [
      { id: "p31_1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "p31_2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "p31_4", home: "Everton", away: "Chelsea", date: "21.03" },
      { id: "p31_6", home: "Newcastle", away: "Sunderland", date: "22.03" },
      { id: "p32_9", home: "Chelsea", away: "Man City", date: "12.04" }
    ],
    "SERIE A": [
      { id: "it30_4", home: "Milan", away: "Torino", date: "21.03" },
      { id: "it30_5", home: "Juventus", away: "Sassuolo", date: "21.03" },
      { id: "it30_10", home: "Fiorentina", away: "Inter", date: "22.03" },
      { id: "it31_10", home: "Napoli", away: "Milan", date: "05.04" }
    ],
    "BUNDESLIGA": [
      { id: "de27_1", home: "RB Leipzig", away: "Hoffenheim", date: "20.03" },
      { id: "de27_2", home: "Bayern", away: "Union Berlin", date: "21.03" },
      { id: "de27_6", home: "Dortmund", away: "Hamburgo", date: "21.03" },
      { id: "de28_1", home: "Leverkusen", away: "Wolfsburgo", date: "04.04" }
    ]
  };

  const addToTicket = (match, pick, cuota) => {
    const newEntry = { id: match.id, home: match.home, away: match.away, pick, cuota: parseFloat(cuota) };
    setTicket(prev => {
      const filtered = prev.filter(item => item.id !== match.id);
      return [...filtered, newEntry];
    });
  };

  const totalCuota = ticket.reduce((acc, item) => acc * item.cuota, 1).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#00ff41", letterSpacing: "2px", margin:0 }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
      </header>

      <nav style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
        {["LIGAS", "TICKET"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "12px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", position:"relative", cursor:"pointer" }}>
            {t} {t === "TICKET" && ticket.length > 0 && <span style={{position:"absolute", top:"-5px", right:"-5px", background:"#ff3333", color:"#fff", borderRadius:"50%", padding:"2px 6px", fontSize:"0.6rem"}}>{ticket.length}</span>}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom:"5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace: "nowrap", padding: "8px 15px", background: league === l ? "#00ff41" : "#111", color: league === l ? "#000" : "#888", border: "none", borderRadius: "20px", fontSize: "0.7rem", fontWeight:"bold" }}>{l}</button>
            ))}
          </div>
          {initialData[league].map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0, fontSize: "1rem" }}>MI TICKET IA</h3>
          {ticket.length === 0 ? (
            <p style={{color:"#666", textAlign:"center", fontSize:"0.8rem"}}>Selecciona pronósticos en la pestaña LIGAS.</p>
          ) : (
            <>
              {ticket.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #222", fontSize: "0.8rem" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{item.home} vs {item.away}</div>
                    <div style={{ color: "#00ff41" }}>Pronóstico: {item.pick}</div>
                  </div>
                  <div style={{ fontWeight: "bold", alignSelf:"center" }}>@{item.cuota}</div>
                </div>
              ))}
              <div style={{ marginTop: "20px", background: "#050505", padding: "15px", borderRadius: "10px", border:"1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>Cuota Total:</span> <b style={{ color: "#00ff41", fontSize: "1.3rem" }}>@{totalCuota}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Inversión (€):</span>
                  <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: "70px", background: "#111", border: "1px solid #00ff41", color: "#fff", padding: "8px", borderRadius: "6px", textAlign:"center" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", borderTop: "1px solid #222", paddingTop: "15px" }}>
                  <span style={{fontWeight:"bold"}}>GANANCIA:</span> <b style={{ color: "#00ff41", fontSize: "1.3rem" }}>{(totalCuota * stake).toFixed(2)}€</b>
                </div>
              </div>
              <button onClick={() => setTicket([])} style={{ width: "100%", marginTop: "15px", padding: "12px", background: "transparent", color: "#ff3333", border: "1px solid #ff3333", borderRadius: "8px", cursor: "pointer", fontSize:"0.7rem", fontWeight:"bold" }}>BORRAR TODO</button>
            </>
          )}
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
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ color: "#00ff41", fontSize: "0.7rem", fontWeight: "bold" }}>📅 {match.date}</span>
        <span style={{ color: "#444", fontSize: "0.6rem" }}>ID: {match.id}</span>
      </div>

      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1rem", marginBottom: "15px" }}>
        {match.home} <span style={{color: "#444", margin:"0 5px"}}>vs</span> {match.away}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[
          { label: "1", prob: data.p1, q: data.q1 },
          { label: "X", prob: data.pX, q: data.qX },
          { label: "2", prob: data.p2, q: data.q2 }
        ].map(item => (
          <button 
            key={item.label} 
            onClick={() => onSelect(match, item.label, item.q)}
            style={{ 
              background: currentPick === item.label ? "#00ff41" : "#050505", 
              border: currentPick === item.label ? "1px solid #00ff41" : "1px solid #333",
              padding: "10px 5px", borderRadius: "8px", textAlign: "center", cursor: "pointer", color: currentPick === item.label ? "#000" : "#fff", transition: "0.2s"
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: "bold", marginBottom:"2px" }}>{item.label}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "900" }}>@{item.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{item.prob}%</div>
          </button>
        ))}
      </div>
      
      <button onClick={() => setOpen(!open)} style={{width:"100%", background:"none", border:"none", color:"#555", fontSize:"0.6rem", marginTop:"12px", cursor:"pointer", textDecoration:"underline"}}>
        {open ? "OCULTAR ANALÍTICA" : "VER MARCADOR IA & CÓRNERS"}
      </button>

      {open && (
        <div style={{ marginTop: "12px", fontSize: "0.75rem", color: "#eee", background: "#050505", padding: "12px", borderRadius: "8px", border: "1px dashed #333" }}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}><span>🎯 Marcador:</span> <b style={{color:"#00ff41"}}>{data.exact}</b></div>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}><span>⚽ Goles:</span> <b>{data.goals}</b></div>
          <div style={{display:"flex", justifyContent:"space-between"}}><span>🚩 Córners:</span> <b>{data.corners}</b></div>
        </div>
      )}
    </div>
  );
                                   }
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
