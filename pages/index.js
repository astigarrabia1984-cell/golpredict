import React, { useState } from "react";

// 1. Base de datos verificada (Flashscore)
const DATA_FLASHSCORE = {
  "LALIGA (J30)": [
    { id: "es1", d: "03.04. 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1 },
    { id: "es2", d: "04.04. 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8 },
    { id: "es3", d: "04.04. 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: "es4", d: "04.04. 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: "es5", d: "04.04. 21:00", h: "Atlético de Madrid", a: "Barcelona", hE: 1.8, aE: 1.8 },
    { id: "es6", d: "05.04. 14:00", h: "Getafe", a: "Athletic Club", hE: 1.1, aE: 1.5 },
    { id: "es7", d: "05.04. 16:15", h: "Valencia", a: "Celta de Vigo", hE: 1.6, aE: 1.2 },
    { id: "es8", d: "05.04. 18:30", h: "Real Oviedo", a: "Sevilla", hE: 1.1, aE: 1.4 },
    { id: "es9", d: "05.04. 21:00", h: "Alavés", a: "Osasuna", hE: 1.2, aE: 1.2 },
    { id: "es10", d: "06.04. 21:00", h: "Girona", a: "Villarreal", hE: 2.1, aE: 1.6 }
  ],
  "CHAMPIONS (CUARTOS)": [
    { id: "ch1", d: "07.04. 21:00", h: "Real Madrid", a: "Man. City", hE: 1.9, aE: 2.1 },
    { id: "ch2", d: "07.04. 21:00", h: "Arsenal", a: "Bayern Múnich", hE: 2.0, aE: 1.7 },
    { id: "ch3", d: "08.04. 21:00", h: "PSG", a: "Barcelona", hE: 2.1, aE: 1.8 },
    { id: "ch4", d: "08.04. 21:00", h: "Atlético de Madrid", a: "Dortmund", hE: 1.6, aE: 1.1 }
  ]
};

// 2. Componente Principal
export default function GolPredictApp() {
  const [liga, setLiga] = useState("LALIGA (J30)");
  const [openId, setOpenId] = useState(null);

  // Lógica de cálculo
  const getCalc = (h, a) => {
    const total = h + a;
    const p1 = Math.round((h / total) * 85);
    const pX = Math.round(20 + (1 / total) * 15);
    const p2 = Math.round((a / total) * 75);

    let info = { prob: "", color: "" };
    if (p1 > p2 && p1 > pX) { info.prob = `1: ${p1}%`; info.color = "#00ff41"; }
    else if (p2 > p1 && p2 > pX) { info.prob = `2: ${p2}%`; info.color = "#ff4444"; }
    else { info.prob = `X: ${pX}%`; info.color = "#ffa500"; }

    return { ...info, p1, pX, p2, g: total.toFixed(1), c: Math.round(total + 6.5) };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "1.5rem", fontWeight: "900" }}>GOLPREDICT ULTRA</h1>
      </header>

      {/* Selector de Ligas */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {Object.keys(DATA_FLASHSCORE).map((l) => (
          <button 
            key={l} 
            onClick={() => { setLiga(l); setOpenId(null); }}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", background: liga === l ? "#00ff41" : "#222", color: liga === l ? "#000" : "#FFF" }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Lista de Partidos */}
      {DATA_FLASHSCORE[liga].map((m) => {
        const s = getCalc(m.hE, m.aE);
        const isOpen = openId === m.id;

        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "12px", marginBottom: "10px", border: isOpen ? `1px solid ${s.color}` : "1px solid #333", overflow: "hidden" }}>
            <div onClick={() => setOpenId(isOpen ? null : m.id)} style={{ padding: "15px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, fontSize: "0.9rem", fontWeight: "bold" }}>{m.h}</div>
                <div style={{ textAlign: "center", width: "100px" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: "900", color: s.color }}>{s.prob}</div>
                  <div style={{ fontSize: "0.5rem", color: "#666" }}>{m.d}</div>
                </div>
                <div style={{ flex: 1, textAlign: "right", fontSize: "0.9rem", fontWeight: "bold" }}>{m.a}</div>
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "15px", background: "#080808", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "15px", textAlign: "center" }}>
                  <div style={{ padding: "8px", borderRadius: "8px", background: "#1a1a1a", fontSize: "0.6rem" }}>L: {s.p1}%</div>
                  <div style={{ padding: "8px", borderRadius: "8px", background: "#1a1a1a", fontSize: "0.6rem" }}>X: {s.pX}%</div>
                  <div style={{ padding: "8px", borderRadius: "8px", background: "#1a1a1a", fontSize: "0.6rem" }}>V: {s.p2}%</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", textAlign: "center" }}>
                  <div style={{ padding: "10px", background: "#1a1a1a", borderRadius: "8px", color: "#00ff41", fontSize: "0.7rem", fontWeight: "bold" }}>GOLES: {s.g}</div>
                  <div style={{ padding: "10px", background: "#1a1a1a", borderRadius: "8px", color: "#00ff41", fontSize: "0.7rem", fontWeight: "bold" }}>CORNERS: {s.c}</div>
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
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
