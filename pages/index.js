import React, { useState } from "react";

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
    const pX = Math.round(20 + (1 / total) * 15);
    const p2 = Math.round((a / total) * 75);

    let mainProb = "";
    let mainColor = "";
    if (p1 > p2 && p1 > pX) { mainProb = `1: ${p1}%`; mainColor = "#00ff41"; }
    else if (p2 > p1 && p2 > pX) { mainProb = `2: ${p2}%`; mainColor = "#ff4444"; }
    else { mainProb = `X: ${pX}%`; mainColor = "#ffa500"; }

    return { win: p1, draw: pX, loss: p2, goles: total.toFixed(1), corners: Math.round(total + 6.5), mainProb, mainColor };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", padding: "15px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #00ff41", paddingBottom: "10px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "1.5rem", margin: 0 }}>GOLPREDICT <span style={{ color: "#FFF" }}>ULTRA</span></h1>
      </header>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {Object.keys(DATA_FINAL).map(l => (
          <button key={l} onClick={() => { setLiga(l); setOpen(null); }} style={{ flex: 1, padding: "12px", borderRadius: "8px", background: liga === l ? "#00ff41" : "#222", color: liga === l ? "#000" : "#FFF", border: "none", fontWeight: "bold", fontSize: "0.7rem" }}>{l}</button>
        ))}
      </div>

      {DATA_FINAL[liga].map(m => {
        const s = getStats(m.hE, m.aE);
        const isEx = open === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "12px", marginBottom: "10px", border: isEx ? `1px solid ${s.mainColor}` : "1px solid #333", overflow: "hidden" }}>
            <div onClick={() => setOpen(isEx ? null : m.id)} style={{ padding: "15px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, fontSize: "0.9rem", fontWeight: "bold" }}>{m.h}</div>
                <div style={{ textAlign: "center", flex: 0.8 }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "900", color: s.mainColor }}>{s.mainProb}</div>
                  <div style={{ fontSize: "0.5rem", color: "#666" }}>{m.d}</div>
                </div>
                <div style={{ flex: 1, textAlign: "right", fontSize: "0.9rem", fontWeight: "bold" }}>{m.a}</div>
              </div>
            </div>

            {isEx && (
              <div style={{ padding: "15px", background: "#050505", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "15px" }}>
                  <div style={{ textAlign: "center", background: "#1a1a1a", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.5rem", color: "#888" }}>L: {s.win}%</div>
                  </div>
                  <div style={{ textAlign: "center", background: "#1a1a1a", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.5rem", color: "#888" }}>X: {s.draw}%</div>
                  </div>
                  <div style={{ textAlign: "center", background: "#1a1a1a", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.5rem", color: "#888" }}>V: {s.loss}%</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", color: "#00ff41" }}>GOLES: {s.goles}</div>
                  </div>
                  <div style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", color: "#00ff41" }}>CORNERS: {s.corners}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
                          }
                              
         
         
                                                  }
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
