import React, { useState } from "react";

/* ============================================================
   BASE DE DATOS MAESTRA: LALIGA J30 + CHAMPIONS CUARTOS
   ============================================================ */
const DATA_FINAL = {
  "LALIGA (J30)": [
    { id: "e1", d: "03.04. 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1 },
    { id: "e2", d: "04.04. 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8 },
    { id: "e3", d: "04.04. 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: "e4", d: "04.04. 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: "e5", d: "04.04. 21:00", h: "Atlético de Madrid", a: "Barcelona", hE: 1.8, aE: 1.8 },
    { id: "e6", d: "05.04. 14:00", h: "Getafe", a: "Athletic Club", hE: 1.1, aE: 1.5 },
    { id: "e7", d: "05.04. 16:15", h: "Valencia", a: "Celta de Vigo", hE: 1.6, aE: 1.2 },
    { id: "e8", d: "05.04. 18:30", h: "Real Oviedo", a: "Sevilla", hE: 1.1, aE: 1.4 },
    { id: "e9", d: "05.04. 21:00", h: "Alavés", a: "Osasuna", hE: 1.2, aE: 1.2 },
    { id: "e10", d: "06.04. 21:00", h: "Girona", a: "Villarreal", hE: 2.1, aE: 1.6 }
  ],
  "CHAMPIONS (CUARTOS)": [
    { id: "u1", d: "07.04. 21:00", h: "Real Madrid", a: "Man. City", hE: 1.9, aE: 2.1 },
    { id: "u2", d: "07.04. 21:00", h: "Arsenal", a: "Bayern Múnich", hE: 2.0, aE: 1.7 },
    { id: "u3", d: "08.04. 21:00", h: "PSG", a: "Barcelona", hE: 2.1, aE: 1.8 },
    { id: "u4", d: "08.04. 21:00", h: "Atlético de Madrid", a: "Dortmund", hE: 1.6, aE: 1.1 }
  ]
};

export default function GolPredictPro() {
  const [liga, setLiga] = useState("LALIGA (J30)");
  const [open, setOpen] = useState(null);

  const getStats = (h, a) => {
    const total = h + a;
    const p1 = Math.round((h / total) * 85);
    const pX = Math.round(20 + (1/total)*15);
    const p2 = Math.round((a / total) * 75);
    
    // Lógica de colores para la pantalla principal
    let mainProb = "";
    let mainColor = "";
    if (p1 > p2 && p1 > pX) { mainProb = `1: ${p1}%`; mainColor = "#00ff41"; }
    else if (p2 > p1 && p2 > pX) { mainProb = `2: ${p2}%`; mainColor = "#ff4444"; }
    else { mainProb = `X: ${pX}%`; mainColor = "#ffa500"; }

    return {
      win: p1, draw: pX, loss: p2,
      goles: total.toFixed(1),
      corners: Math.round(total + 6.5),
      mainProb, mainColor
    };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", padding: "15px", fontFamily: "Arial, sans-serif" }}>
      
      <header style={{ textAlign: "center", marginBottom: "25px", borderBottom: "2px solid #00ff41", paddingBottom: "15px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "1.8rem", margin: 0, fontWeight: "900" }}>GOLPREDICT <span style={{color:"#FFF"}}>ULTRA</span></h1>
      </header>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {Object.keys(DATA_FINAL).map(l => (
          <button key={l} onClick={() => {setLiga(l); setOpen(null);}} style={{ flex: 1, padding: "15px", borderRadius: "10px", background: liga === l ? "#00ff41" : "#333", color: liga === l ? "#000" : "#FFF", border: "none", fontWeight: "900", fontSize: "0.8rem" }}>{l}</button>
        ))}
      </div>

      {DATA_FINAL[liga].map(m => {
        const s = getStats(m.hE, m.aE);
        const isEx = open === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "14px", marginBottom: "12px", border: isEx ? `2px solid ${s.mainColor}` : "1px solid #444", overflow: "hidden" }}>
            <div onClick={() => setOpen(isEx ? null : m.id)} style={{ padding: "15px 20px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1.2, fontSize: "1rem", fontWeight: "bold" }}>{m.h}</div>
                <div style={{ textAlign: "center", flex: 0.6 }}>
                   <div style={{ fontSize: "1.1rem", fontWeight: "900", color: s.mainColor }}>{s.mainProb}</div>
                   <div style={{ fontSize: "0.55rem", color: "#777", fontWeight: "bold" }}>{m.d}</div>
                </div>
                <div style={{ flex: 1.2, textAlign: "right", fontSize: "1rem", fontWeight: "bold" }}>{m.a}</div>
              </div>
            </div>

            {isEx && (
              <div style={{ padding: "20px", background: "#050505", borderTop: "1px solid #333" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <StatBox label="PROB. 1" val={s.win+"%"} color="#00ff41" />
                  <StatBox label="PROB. X" val={s.draw+"%"} color="#ffa500" />
                  <StatBox label="PROB. 2" val={s.loss+"%"} color="#ff4444" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <InfoCard label="EST. GOLES" val={s.goles} />
                  <InfoCard label="CORNERS" val={`${s.corners}-${s.corners+2}`} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatBox({ label, val, color }) {
  return (
    <div style={{ background: "#1a1a1a", padding: "12px", borderRadius: "10px", textAlign: "center", border: `1px solid ${color}44` }}>
      <div style={{ fontSize: "0.6rem", color: "#888", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: "900", color: color }}>{val}</div>
    </div>
  );
}

function InfoCard({ label, val }) {
  return (
    <div style={{ background: "#1a1a1a", padding: "15px", borderRadius: "10px", textAlign: "center", border: "1px solid #333" }}>
      <div style={{ fontSize: "0.65rem", color: "#888", marginBottom: "5px" }}>{label}</div>
      <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#FFF" }}>{val}</div>
    </div>
  );
         }
         
                                                  }
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
