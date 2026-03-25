import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   1. BASE DE DATOS MAESTRA (TODOS LOS PARTIDOS DE TUS CAPTURAS)
   ============================================================ */
const DB_RESULTS = {
  "CHAMPIONS LEAGUE": [
    { id: "ch1", home: "Bayern Múnich", away: "Atalanta", score: "4 - 1", pred: "1", date: "18.03" },
    { id: "ch2", home: "Liverpool", away: "Galatasaray", score: "4 - 0", pred: "1", date: "18.03" },
    { id: "ch3", home: "Tottenham", away: "Atlético Madrid", score: "3 - 2", pred: "1", date: "18.03" },
    { id: "ch4", home: "Barcelona", away: "Newcastle", score: "7 - 2", pred: "1", date: "18.03" },
    { id: "ch5", home: "Arsenal", away: "Leverkusen", score: "2 - 0", pred: "1", date: "17.03" },
    { id: "ch6", home: "Chelsea", away: "PSG", score: "0 - 3", pred: "2", date: "17.03" },
    { id: "ch7", home: "Man. City", away: "Real Madrid", score: "1 - 2", pred: "2", date: "17.03" },
    { id: "ch8", home: "Sporting CP", away: "Bodo/Glimt", score: "5 - 0", pred: "1", date: "17.03" }
  ],
  "LALIGA - ESPAÑA": [
    { id: "es1", home: "Real Madrid", away: "Atlético Madrid", score: "3 - 2", pred: "1", date: "22.03" },
    { id: "es2", home: "Athletic Club", away: "Real Betis", score: "2 - 1", pred: "1", date: "22.03" },
    { id: "es3", home: "Celta de Vigo", away: "Alavés", score: "3 - 4", pred: "2", date: "22.03" },
    { id: "es4", home: "Barcelona", away: "Rayo Vallecano", score: "1 - 0", pred: "1", date: "22.03" },
    { id: "es5", home: "Sevilla", away: "Valencia", score: "0 - 2", pred: "2", date: "21.03" },
    { id: "es6", home: "Levante", away: "Real Oviedo", score: "4 - 2", pred: "1", date: "21.03" },
    { id: "es7", home: "Osasuna", away: "Girona", score: "1 - 0", pred: "1", date: "21.03" },
    { id: "es8", home: "Espanyol", away: "Getafe", score: "1 - 2", pred: "2", date: "21.03" },
    { id: "es9", home: "Elche", away: "Mallorca", score: "2 - 1", pred: "1", date: "21.03" },
    { id: "es10", home: "Villarreal", away: "Real Sociedad", score: "3 - 1", pred: "1", date: "20.03" }
  ],
  "PREMIER LEAGUE": [
    { id: "en1", home: "Aston Villa", away: "West Ham", score: "2 - 0", pred: "1", date: "22.03" },
    { id: "en2", home: "Tottenham", away: "Nottingham", score: "0 - 3", pred: "2", date: "22.03" },
    { id: "en3", home: "Newcastle", away: "Sunderland", score: "1 - 2", pred: "2", date: "22.03" },
    { id: "en4", home: "Leeds Utd", away: "Brentford", score: "0 - 0", pred: "X", date: "21.03" },
    { id: "en5", home: "Everton", away: "Chelsea", score: "3 - 0", pred: "1", date: "21.03" },
    { id: "en6", home: "Fulham", away: "Burnley", score: "3 - 1", pred: "1", date: "21.03" },
    { id: "en7", home: "Brighton", away: "Liverpool", score: "2 - 1", pred: "1", date: "21.03" },
    { id: "en8", home: "Bournemouth", away: "Man. Utd", score: "2 - 2", pred: "X", date: "20.03" }
  ],
  "SERIE A - ITALIA": [
    { id: "it1", home: "Fiorentina", away: "Inter", score: "1 - 1", pred: "X", date: "22.03" },
    { id: "it2", home: "Roma", away: "Lecce", score: "1 - 0", pred: "1", date: "22.03" },
    { id: "it3", home: "Atalanta", away: "Verona", score: "1 - 0", pred: "1", date: "22.03" },
    { id: "it4", home: "Bolonia", away: "Lazio", score: "0 - 2", pred: "2", date: "22.03" },
    { id: "it5", home: "Como", away: "Pisa", score: "5 - 0", pred: "1", date: "22.03" },
    { id: "it6", home: "Juventus", away: "Sassuolo", score: "1 - 1", pred: "X", date: "21.03" },
    { id: "it7", home: "AC Milan", away: "Torino", score: "3 - 2", pred: "1", date: "21.03" },
    { id: "it8", home: "Parma", away: "Cremonese", score: "0 - 2", pred: "2", date: "21.03" },
    { id: "it9", home: "Genoa", away: "Udinese", score: "0 - 2", pred: "2", date: "20.03" },
    { id: "it10", home: "Cagliari", away: "Nápoles", score: "0 - 1", pred: "2", date: "20.03" }
  ],
  "BUNDESLIGA": [
    { id: "de1", home: "Augsburgo", away: "Stuttgart", score: "2 - 5", pred: "2", date: "22.03" },
    { id: "de2", home: "St. Pauli", away: "Friburgo", score: "1 - 2", pred: "2", date: "22.03" },
    { id: "de3", home: "Mainz", away: "Eintracht", score: "2 - 1", pred: "1", date: "22.03" },
    { id: "de4", home: "B. Dortmund", away: "Hamburgo", score: "3 - 2", pred: "1", date: "21.03" },
    { id: "de5", home: "Bayern Múnich", away: "Union Berlin", score: "4 - 0", pred: "1", date: "21.03" },
    { id: "de6", home: "Colonia", away: "M'gladbach", score: "3 - 3", pred: "X", date: "21.03" },
    { id: "de7", home: "Heidenheim", away: "Leverkusen", score: "3 - 3", pred: "2", date: "21.03" }, // Fallo ejemplo
    { id: "de8", home: "Wolfsburgo", away: "Werder Bremen", score: "0 - 1", pred: "2", date: "21.03" },
    { id: "de9", home: "RB Leipzig", away: "Hoffenheim", score: "5 - 0", pred: "1", date: "20.03" }
  ]
};

export default function GolPredictUltra() {
  const [activeTab, setActiveTab] = useState("RESULTADOS");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const checkHit = (score, pred) => {
    const [h, a] = score.split("-").map(n => parseInt(n.trim()));
    const real = h > a ? "1" : a > h ? "2" : "X";
    return real === pred;
  };

  // Cálculo de estadísticas
  const stats = useMemo(() => {
    let total = 0, hits = 0;
    Object.values(DB_RESULTS).flat().forEach(p => {
      total++;
      if (checkHit(p.score, p.pred)) hits++;
    });
    return { total, hits, pct: Math.round((hits / total) * 100) };
  }, []);

  if (!isClient) return <div style={{background: "#000", minHeight: "100vh"}} />;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif", padding: "10px" }}>
      
      {/* HEADER VIP */}
      <header style={{ textAlign: "center", padding: "15px 0", borderBottom: "1px solid #111", position: "sticky", top: 0, background: "#000", zIndex: 100 }}>
        <h1 style={{ color: "#00ff41", margin: 0, fontSize: "1.1rem", letterSpacing: "2px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h1>
        
        {/* BARRA DE ÉXITO DEL MOTOR */}
        <div style={{ marginTop: "10px", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5rem", color: "#666", marginBottom: "4px" }}>
            <span>MOTOR ENGINE V3.0</span>
            <span>EFECTIVIDAD: {stats.pct}%</span>
          </div>
          <div style={{ height: "4px", background: "#111", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: `${stats.pct}%`, height: "100%", background: "#00ff41", boxShadow: "0 0 10px #00ff41" }}></div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", margin: "15px 0" }}>
        {["LIGAS", "RESULTADOS", "TICKET", "HISTORIAL"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px 0", background: activeTab === t ? "#00ff41" : "#0d0d0d", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "0.55rem" }}>{t}</button>
        ))}
      </nav>

      {/* LISTADO TOTAL */}
      {activeTab === "RESULTADOS" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          {Object.keys(DB_RESULTS).map(liga => (
            <div key={liga} style={{ marginBottom: "25px" }}>
              <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "#00ff41", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                {liga} <div style={{ flex: 1, height: "1px", background: "#111" }}></div>
              </div>
              
              {DB_RESULTS[liga].map(partido => {
                const isHit = checkHit(partido.score, partido.pred);
                return (
                  <div key={partido.id} style={{ background: "#080808", padding: "14px", borderRadius: "14px", marginBottom: "8px", border: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1.2, fontSize: "0.75rem", fontWeight: "500" }}>{partido.home}</div>
                    
                    <div style={{ textAlign: "center", minWidth: "90px" }}>
                      <div style={{ fontSize: "1rem", fontWeight: "900", color: "#fff" }}>{partido.score}</div>
                      <div style={{ fontSize: "0.45rem", color: "#333", marginTop: "4px" }}>PRED: {partido.pred}</div>
                    </div>

                    <div style={{ flex: 1.2, textAlign: "right", fontSize: "0.75rem", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      {partido.away}
                      <span style={{ filter: isHit ? "none" : "grayscale(1)", opacity: isHit ? 1 : 0.3 }}>{isHit ? "✅" : "❌"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        body { background: #000; overflow-x: hidden; }
      `}</style>
    </div>
  );
     }
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
