import React, { useState } from "react";

const MASTER_DATA = {
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
  "CHAMPIONS": [
    { id: "u1", d: "07.04. 21:00", h: "Real Madrid", a: "Man. City", hE: 1.9, aE: 2.1 },
    { id: "u2", d: "07.04. 21:00", h: "Arsenal", a: "Bayern", hE: 2.0, aE: 1.7 },
    { id: "u3", d: "08.04. 21:00", h: "PSG", a: "Barcelona", hE: 2.1, aE: 1.8 },
    { id: "u4", d: "08.04. 21:00", h: "Atlético", a: "Dortmund", hE: 1.6, aE: 1.1 }
  ],
  "NBA": [
    { id: "nba1", d: "26.03. 01:30", h: "Boston Celtics", a: "NY Knicks", hE: 118, aE: 105 },
    { id: "nba2", d: "26.03. 03:00", h: "Denver Nuggets", a: "Phoenix Suns", hE: 112, aE: 114 },
    { id: "nba3", d: "27.03. 02:00", h: "Lakers", a: "GS Warriors", hE: 121, aE: 118 }
  ],
  "NHL (HOCKEY)": [
    { id: "nhl1", d: "26.03. 01:00", h: "Florida Panthers", a: "Boston Bruins", hE: 3.2, aE: 2.8 },
    { id: "nhl2", d: "26.03. 02:30", h: "Colorado Avalanche", a: "Dallas Stars", hE: 4.1, aE: 3.5 }
  ]
};

export default function GolPredictElite() {
  const [tab, setTab] = useState("LALIGA (J30)");
  const [open, setOpen] = useState(null);

  const getStats = (h, a, type) => {
    const isBasket = type === "NBA";
    const total = h + a;
    
    // Probabilidades 1X2 o 12 (NBA)
    let p1 = isBasket ? Math.round((h/(h+a))*100) : Math.round((h/total)*85);
    let p2 = isBasket ? (100 - p1) : Math.round((a/total)*75);
    let pX = isBasket ? 0 : Math.round(20 + (1/total)*15);

    let res = { txt: "", col: "" };
    if (p1 > p2 && p1 > pX) { res = { txt: `1: ${p1}%`, col: "#00ff41" }; }
    else if (p2 > p1 && p2 > pX) { res = { txt: `2: ${p2}%`, col: "#ff4444" }; }
    else { res = { txt: `X: ${pX}%`, col: "#ffa500" }; }

    return { ...res, p1, pX, p2, 
      val1: isBasket ? h : total.toFixed(1), 
      val2: isBasket ? "PUNTOS" : "GOLES",
      corn: isBasket ? "ASIST" : "CORNERS",
      cVal: isBasket ? Math.round(h/4) : Math.round(total + 6) 
    };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", padding: "15px", fontFamily: "sans-serif" }}>
      
      <header style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #00ff41", paddingBottom: "10px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "1.4rem", margin: 0, fontWeight: "900" }}>GOLPREDICT <span style={{color:"#FFF"}}>OMNI</span></h1>
      </header>

      {/* TABS NAVEGACIÓN */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
        {Object.keys(MASTER_DATA).map(l => (
          <button key={l} onClick={() => {setTab(l); setOpen(null);}} style={{ flexShrink: 0, padding: "10px 15px", borderRadius: "8px", background: tab === l ? "#00ff41" : "#1a1a1a", color: tab === l ? "#000" : "#777", border: "none", fontWeight: "bold", fontSize: "0.65rem" }}>{l}</button>
        ))}
      </div>

      {/* LISTA DINÁMICA */}
      {MASTER_DATA[tab].map(m => {
        const s = getStats(m.hE, m.aE, tab);
        const isOpen = open === m.id;
        return (
          <div key={m.id} style={{ background: "#0d0d0d", borderRadius: "12px", marginBottom: "10px", border: isOpen ? `1px solid ${s.col}` : "1px solid #222", overflow: "hidden" }}>
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "15px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, fontSize: "0.85rem", fontWeight: "bold" }}>{m.h}</div>
                <div style={{ textAlign: "center", width: "90px" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "900", color: s.col }}>{s.txt}</div>
                  <div style={{ fontSize: "0.5rem", color: "#555" }}>{m.d}</div>
                </div>
                <div style={{ flex: 1, textAlign: "right", fontSize: "0.85rem", fontWeight: "bold" }}>{m.a}</div>
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "15px", background: "#050505", borderTop: "1px solid #222", animation: "fadeIn 0.3s" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  <MiniBox lab="L/H" val={s.p1+"%"} />
                  <MiniBox lab="X" val={tab === "NBA" ? "-" : s.pX+"%"} />
                  <MiniBox lab="V/A" val={s.p2+"%"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <DetailBox lab={s.val2} val={s.val1} />
                  <DetailBox lab={s.corn} val={s.cVal} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes fadeIn { from {opacity: 0} to {opacity: 1} }`}</style>
    </div>
  );
}

function MiniBox({ lab, val }) {
  return (
    <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
      <div style={{ fontSize: "0.45rem", color: "#666" }}>{lab}</div>
      <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{val}</div>
    </div>
  );
}

function DetailBox({ lab, val }) {
  return (
    <div style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", textAlign: "center", border: "1px solid #222" }}>
      <div style={{ fontSize: "0.55rem", color: "#00ff41", marginBottom: "2px" }}>{lab}</div>
      <div style={{ fontSize: "1rem", fontWeight: "bold" }}>{val}</div>
    </div>
  );
        }
                                      

              

                          
                              
         
         
                                                  }
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
