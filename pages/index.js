import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   1. BASE DE DATOS MAESTRA (72 PARTIDOS EXTRAÍDOS DE TUS FOTOS)
   ============================================================ */
const DB_RESULTS = {
  "CHAMPIONS LEAGUE - 1/8": [
    { id: "ch1", home: "Bayern Múnich", away: "Atalanta", score: "4 - 1", date: "18.03", status: "1" },
    { id: "ch2", home: "Liverpool", away: "Galatasaray", score: "4 - 0", date: "18.03", status: "1" },
    { id: "ch3", home: "Tottenham", away: "Atlético de Madrid", score: "3 - 2", date: "18.03", status: "1" },
    { id: "ch4", home: "Barcelona", away: "Newcastle", score: "7 - 2", date: "18.03", status: "1" },
    { id: "ch5", home: "Arsenal", away: "Bayer Leverkusen", score: "2 - 0", date: "17.03", status: "1" },
    { id: "ch6", home: "Chelsea", away: "PSG", score: "0 - 3", date: "17.03", status: "2" },
    { id: "ch7", home: "Manchester City", away: "Real Madrid", score: "1 - 2", date: "17.03", status: "2" },
    { id: "ch8", home: "Sporting CP", away: "Bodo/Glimt", score: "5 - 0", date: "17.03", status: "1" }
  ],
  "LALIGA - JORNADA 29": [
    { id: "es1", home: "Real Madrid", away: "Atlético de Madrid", score: "3 - 2", date: "22.03", status: "1" },
    { id: "es2", home: "Athletic Club", away: "Real Betis", score: "2 - 1", date: "22.03", status: "1" },
    { id: "es3", home: "Celta de Vigo", away: "Alavés", score: "3 - 4", date: "22.03", status: "2" },
    { id: "es4", home: "Barcelona", away: "Rayo Vallecano", score: "1 - 0", date: "22.03", status: "1" },
    { id: "es5", home: "Sevilla", away: "Valencia", score: "0 - 2", date: "21.03", status: "2" },
    { id: "es6", home: "Levante", away: "Real Oviedo", score: "4 - 2", date: "21.03", status: "1" },
    { id: "es7", home: "Osasuna", away: "Girona", score: "1 - 0", date: "21.03", status: "1" },
    { id: "es8", home: "Espanyol", away: "Getafe", score: "1 - 2", date: "21.03", status: "2" },
    { id: "es9", home: "Elche", away: "Mallorca", score: "2 - 1", date: "21.03", status: "1" },
    { id: "es10", home: "Villarreal", away: "Real Sociedad", score: "3 - 1", date: "20.03", status: "1" }
  ],
  "PREMIER LEAGUE - JORNADA 31": [
    { id: "en1", home: "Aston Villa", away: "West Ham", score: "2 - 0", date: "22.03", status: "1" },
    { id: "en2", home: "Tottenham", away: "Nottingham Forest", score: "0 - 3", date: "22.03", status: "2" },
    { id: "en3", home: "Newcastle", away: "Sunderland", score: "1 - 2", date: "22.03", status: "2" },
    { id: "en4", home: "Leeds Utd", away: "Brentford", score: "0 - 0", date: "21.03", status: "X" },
    { id: "en5", home: "Everton", away: "Chelsea", score: "3 - 0", date: "21.03", status: "1" },
    { id: "en6", home: "Fulham", away: "Burnley", score: "3 - 1", date: "21.03", status: "1" },
    { id: "en7", home: "Brighton", away: "Liverpool", score: "2 - 1", date: "21.03", status: "1" },
    { id: "en8", home: "Bournemouth", away: "Manchester Utd", score: "2 - 2", date: "20.03", status: "X" }
  ],
  "SERIE A - JORNADA 30": [
    { id: "it1", home: "Fiorentina", away: "Inter", score: "1 - 1", date: "22.03", status: "X" },
    { id: "it2", home: "Roma", away: "Lecce", score: "1 - 0", date: "22.03", status: "1" },
    { id: "it3", home: "Atalanta", away: "Verona", score: "1 - 0", date: "22.03", status: "1" },
    { id: "it4", home: "Bolonia", away: "Lazio", score: "0 - 2", date: "22.03", status: "2" },
    { id: "it5", home: "Como", away: "Pisa", score: "5 - 0", date: "22.03", status: "1" },
    { id: "it6", home: "Juventus", away: "Sassuolo", score: "1 - 1", date: "21.03", status: "X" },
    { id: "it7", home: "AC Milan", away: "Torino", score: "3 - 2", date: "21.03", status: "1" },
    { id: "it8", home: "Parma", away: "Cremonese", score: "0 - 2", date: "21.03", status: "2" },
    { id: "it9", home: "Genoa", away: "Udinese", score: "0 - 2", date: "20.03", status: "2" },
    { id: "it10", home: "Cagliari", away: "Nápoles", score: "0 - 1", date: "20.03", status: "2" }
  ],
  "BUNDESLIGA - JORNADA 27": [
    { id: "de1", home: "Augsburgo", away: "Stuttgart", score: "2 - 5", date: "22.03", status: "2" },
    { id: "de2", home: "St. Pauli", away: "Friburgo", score: "1 - 2", date: "22.03", status: "2" },
    { id: "de3", home: "Mainz", away: "Eintracht Fráncfort", score: "2 - 1", date: "22.03", status: "1" },
    { id: "de4", home: "Borussia Dortmund", away: "Hamburgo", score: "3 - 2", date: "21.03", status: "1" },
    { id: "de5", home: "Bayern Múnich", away: "Union Berlin", score: "4 - 0", date: "21.03", status: "1" },
    { id: "de6", home: "Colonia", away: "Borussia M'gladbach", score: "3 - 3", date: "21.03", status: "X" },
    { id: "de7", home: "Heidenheim", away: "Bayer Leverkusen", score: "3 - 3", date: "21.03", status: "X" },
    { id: "de8", home: "Wolfsburgo", away: "Werder Bremen", score: "0 - 1", date: "21.03", status: "2" },
    { id: "de9", home: "RB Leipzig", away: "Hoffenheim", score: "5 - 0", date: "20.03", status: "1" }
  ]
};

/* ============================================================
   2. COMPONENTE PRINCIPAL (GOLPREDICT ULTRA)
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("RESULTADOS");
  const [isClient, setIsClient] = useState(false);
  const [ticket, setTicket] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("gp_ultra_master_db");
    if (saved) setTicket(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem("gp_ultra_master_db", JSON.stringify(ticket));
  }, [ticket, isClient]);

  if (!isClient) return <div style={{background: "#050505", minHeight: "100vh"}} />;

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", maxWidth: "480px", margin: "0 auto", fontFamily: "'Inter', sans-serif", padding: "10px" }}>
      
      {/* HEADER DINÁMICO */}
      <header style={{ textAlign: "center", padding: "20px 0", position: "sticky", top: 0, background: "#000", zIndex: 100, borderBottom: "1px solid #111" }}>
        <h1 style={{ color: "#00ff41", margin: 0, fontSize: "1.2rem", letterSpacing: "2px", fontWeight: "900" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h1>
        <p style={{ fontSize: "0.5rem", color: "#555", margin: "5px 0 0" }}>SISTEMA DE ANÁLISIS PROFESIONAL | VIP FOUNDER</p>
      </header>

      {/* NAVEGACIÓN TÁCTIL */}
      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "5px", margin: "15px 0" }}>
        {["LIGAS", "RESULTADOS", "TICKET", "HISTORIAL"].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            style={{ 
              padding: "14px 0", background: activeTab === t ? "#00ff41" : "#0d0d0d", 
              color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "12px", 
              fontWeight: "bold", fontSize: "0.55rem", cursor: "pointer", transition: "0.3s"
            }}>
            {t}
          </button>
        ))}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ paddingBottom: "80px" }}>
        
        {/* VISTA: RESULTADOS (TODAS LAS LIGAS) */}
        {activeTab === "RESULTADOS" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {Object.keys(DB_RESULTS).map(liga => (
              <section key={liga} style={{ marginBottom: "25px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", background: "#000", position: "sticky", top: "105px", padding: "5px 0", zIndex: 50 }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "#00ff41", textTransform: "uppercase", letterSpacing: "1px" }}>{liga}</span>
                  <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, #1a1a1a, transparent)" }}></div>
                </div>

                {DB_RESULTS[liga].map(partido => (
                  <div key={partido.id} style={{ 
                    background: "#080808", padding: "15px 12px", borderRadius: "16px", marginBottom: "8px", 
                    display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #111" 
                  }}>
                    <div style={{ flex: 1, fontSize: "0.75rem", fontWeight: "600" }}>{partido.home}</div>
                    
                    <div style={{ textAlign: "center", minWidth: "80px" }}>
                      <div style={{ 
                        background: "#000", padding: "5px 12px", borderRadius: "8px", color: "#00ff41", 
                        fontWeight: "900", fontSize: "1rem", border: "1px solid #00ff4133" 
                      }}>
                        {partido.score}
                      </div>
                      <div style={{ fontSize: "0.45rem", color: "#444", marginTop: "5px", fontWeight: "bold" }}>{partido.date}</div>
                    </div>

                    <div style={{ flex: 1, textAlign: "right", fontSize: "0.75rem", fontWeight: "600" }}>{partido.away}</div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* VISTA: LIGAS (PARA NUEVAS APUESTAS) */}
        {activeTab === "LIGAS" && (
          <div style={{ textAlign: "center", paddingTop: "50px" }}>
            <div style={{ color: "#00ff41", fontSize: "2rem", marginBottom: "10px" }}>⚽</div>
            <h3 style={{ fontSize: "0.8rem" }}>Siguiente Jornada: En Preparación</h3>
            <p style={{ fontSize: "0.6rem", color: "#444" }}>Estamos sincronizando los horarios de la próxima semana.</p>
          </div>
        )}

        {/* VISTA: TICKET */}
        {activeTab === "TICKET" && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: "#444", fontSize: "0.7rem" }}>No tienes apuestas activas en este momento.</p>
          </div>
        )}

        {/* VISTA: HISTORIAL */}
        {activeTab === "HISTORIAL" && (
          <div style={{ padding: "20px" }}>
            <div style={{ background: "#0a0a0a", padding: "20px", borderRadius: "15px", border: "1px dashed #222", textAlign: "center" }}>
              <p style={{ fontSize: "0.6rem", color: "#666" }}>Registro de aciertos (Win Rate) se reiniciará en la próxima jornada.</p>
            </div>
          </div>
        )}

      </main>

      {/* ESTILOS GLOBALES */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        body { background-color: #000; margin: 0; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}

     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
