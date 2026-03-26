import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  "LALIGA (J30)": [
    { id: 1, date: "03.04 21:00", home: "Rayo Vallecano", away: "Elche", hE: 1.4, aE: 1.1 },
    { id: 2, date: "04.04 14:00", home: "Real Sociedad", away: "Levante", hE: 1.9, aE: 0.8 },
    { id: 3, date: "04.04 16:15", home: "Mallorca", away: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: 4, date: "04.04 18:30", home: "Real Betis", away: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: 5, date: "04.04 21:00", home: "Atleti", away: "Barça", hE: 1.8, aE: 1.8 },
    { id: 6, date: "05.04 14:00", home: "Getafe", away: "Athletic", hE: 1.1, aE: 1.5 },
    { id: 7, date: "05.04 16:15", home: "Valencia", away: "Celta", hE: 1.6, aE: 1.2 },
    { id: 8, date: "05.04 18:30", home: "Oviedo", away: "Sevilla", hE: 1.1, aE: 1.4 },
    { id: 9, date: "05.04 21:00", home: "Alavés", away: "Osasuna", hE: 1.2, aE: 1.2 },
    { id: 10, date: "06.04 21:00", home: "Girona", away: "Villarreal", hE: 2.1, aE: 1.6 }
  ],
  CHAMPIONS: [
    { id: 11, date: "07.04 21:00", home: "Real Madrid", away: "Man. City", hE: 1.9, aE: 2.1 },
    { id: 12, date: "08.04 21:00", home: "PSG", away: "Barcelona", hE: 2.1, aE: 1.8 }
  ],
  NBA: [
    { id: 20, date: "Hoy 02:00", home: "Boston Celtics", away: "NY Knicks", hE: 116, aE: 105 },
    { id: 21, date: "Hoy 04:30", home: "Denver Nuggets", away: "Phoenix Suns", hE: 112, aE: 118 }
  ],
  "NHL (HOCKEY)": [
    { id: 30, date: "Hoy 01:00", home: "Florida Panthers", away: "Boston Bruins", hE: 3.5, aE: 2.8 }
  ]
};

const calcProbs = (h, a, isNBA) => {
  const total = h + a;
  if (isNBA) {
    const p1 = Math.round((h / total) * 100);
    return { p1, p2: 100 - p1, pX: 0 };
  }
  const drawProb = 0.22; 
  const pX = Math.round(drawProb * 100);
  const p1 = Math.round((h / total) * (100 - pX));
  const p2 = 100 - p1 - pX;
  return { p1, pX, p2 };
};

const Bar = ({ value, color }) => (
  <div style={{ background: "#222", borderRadius: 4, overflow: "hidden", height: 8, marginTop: 4, marginBottom: 10 }}>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      style={{ background: color, height: "100%" }} 
    />
  </div>
);

const MatchCard = ({ match, open, toggle, isNBA }) => {
  const { p1, p2, pX } = calcProbs(match.hE, match.aE, isNBA);
  
  // Lógica de color y texto para la pantalla principal
  let mainTxt = "";
  let mainCol = "";

  if (p1 > p2 && p1 > pX) { mainTxt = `1: ${p1}%`; mainCol = "#00ff41"; }
  else if (p2 > p1 && p2 > pX) { mainTxt = `2: ${p2}%`; mainCol = "#ff4444"; }
  else { mainTxt = `X: ${pX}%`; mainCol = "#ffa500"; }

  return (
    <motion.div layout style={{ background: "#111", borderRadius: 12, marginBottom: 12, border: open ? `1px solid ${mainCol}` : "1px solid #222", overflow: "hidden" }}>
      <div onClick={toggle} style={{ padding: "15px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1, fontWeight: "bold", fontSize: "0.9rem" }}>{match.home}</div>
          <div style={{ textAlign: "center", minWidth: "80px" }}>
            <span style={{ color: mainCol, fontWeight: 900, fontSize: "1.1rem" }}>{mainTxt}</span>
          </div>
          <div style={{ flex: 1, textAlign: "right", fontWeight: "bold", fontSize: "0.9rem" }}>{match.away}</div>
        </div>
        <div style={{ fontSize: 10, textAlign: "center", opacity: 0.5, marginTop: 5 }}>{match.date}</div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: "0 15px 15px 15px", background: "#080808" }}
          >
            <div style={{ paddingTop: 10 }}>
              <div style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between" }}>
                <span>Local</span><span>{p1}%</span>
              </div>
              <Bar value={p1} color="#00ff41" />

              {!isNBA && (
                <>
                  <div style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between" }}>
                    <span>Empate</span><span>{pX}%</span>
                  </div>
                  <Bar value={pX} color="#ffa500" />
                </>
              )}

              <div style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between" }}>
                <span>Visitante</span><span>{p2}%</span>
              </div>
              <Bar value={p2} color="#ff4444" />
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <div style={{ background: "#1a1a1a", padding: 8, borderRadius: 6, textAlign: "center" }}>
                   <div style={{ fontSize: 9, color: "#666" }}>EST. GOLES/PTS</div>
                   <div style={{ fontWeight: "bold", color: "#00ff41" }}>{(match.hE + match.aE).toFixed(1)}</div>
                </div>
                <div style={{ background: "#1a1a1a", padding: 8, borderRadius: 6, textAlign: "center" }}>
                   <div style={{ fontSize: 9, color: "#666" }}>{isNBA ? "ASISTENCIAS" : "CORNERS"}</div>
                   <div style={{ fontWeight: "bold", color: "#00ff41" }}>{Math.round(match.hE + match.aE + 5)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function GolPredictPro() {
  const [tab, setTab] = useState("LALIGA (J30)");
  const [open, setOpen] = useState(null);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#00ff41", fontSize: "1.5rem", fontWeight: 900, marginBottom: 20 }}>GOLPREDICT <span style={{color:"#fff"}}>PRO</span></h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 10 }}>
        {Object.keys(DATA).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setOpen(null); }}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: tab === t ? "#00ff41" : "#1a1a1a",
              color: tab === t ? "#000" : "#fff",
              fontWeight: "bold",
              fontSize: "0.7rem",
              whiteSpace: "nowrap"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {DATA[tab].map(match => (
        <MatchCard
          key={match.id}
          match={match}
          isNBA={tab === "NBA"}
          open={open === match.id}
          toggle={() => setOpen(open === match.id ? null : match.id)}
        />
      ))}
    </div>
  );
  }
            

              

        
                                      

              

                          
                              
         
         
                                                  }
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
