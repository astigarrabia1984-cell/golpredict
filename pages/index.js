  import React, { useState, useEffect } from 'react';

export default function GpProNavigation() {
  const [liga, setLiga] = useState('UCL'); // Liga por defecto
  const [partidos, setPartidos] = useState([]);

  // --- DATOS EXTRAÍDOS DE TUS IMÁGENES ---
  const dataUCL = [
    { h: "Real Madrid", a: "Manchester City", t: "21:00", d: "11.03 MIÉ" },
    { h: "PSG", a: "Chelsea", t: "21:00", d: "11.03 MIÉ" },
    { h: "Newcastle", a: "Barcelona", t: "21:00", d: "10.03 MAR" }
  ];

  const dataLaliga = [
    { h: "Villarreal", a: "Elche", t: "14:00", d: "08.03 HOY" },
    { h: "Sevilla", a: "Rayo Vallecano", t: "18:30", d: "08.03 HOY" },
    { h: "Valencia", a: "Alavés", t: "21:00", d: "08.03 HOY" }
  ];

  const dataPremier = [
    { h: "Liverpool", a: "Tottenham", t: "17:30", d: "15.03 DOM" },
    { h: "Arsenal", a: "Everton", t: "18:30", d: "14.03 SÁB" }
  ];

  useEffect(() => {
    if (liga === 'UCL') setPartidos(dataUCL);
    else if (liga === 'LA LIGA') setPartidos(dataLaliga);
    else setPartidos(dataPremier);
  }, [liga]);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px', fontFamily:'Arial, sans-serif'}}>
      
      {/* CABECERA ESTILO GP PRO */}
      <div style={{textAlign:'center', marginTop:'30px'}}>
        <h1 style={{fontSize:'2.8rem', fontStyle:'italic', fontWeight:'900', margin:0}}>
          <span style={{color:'#fbbf24'}}>GP</span> PRO
        </h1>
        <div style={{
          display:'inline-block', 
          border:'1px solid #0f0', 
          color:'#0f0', 
          borderRadius:'20px', 
          padding:'4px 15px', 
          fontSize:'0.65rem', 
          fontWeight:'bold',
          marginTop:'10px',
          textTransform:'uppercase'
        }}>
          ENGINE: DIXON-COLES v7.0
        </div>
      </div>

      {/* --- EL SELECTOR QUE NO SE VEÍA --- */}
      <div style={{
        background:'#0f0f0f', 
        borderRadius:'40px', 
        display:'flex', 
        padding:'6px', 
        maxWidth:'420px', 
        margin:'40px auto',
        border:'1px solid #1a1a1a',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {['LA LIGA', 'PREMIER', 'UCL'].map((l) => (
          <button 
            key={l}
            onClick={() => setLiga(l)}
            style={{
              flex:1,
              padding:'14px 0',
              border:'none',
              borderRadius:'35px',
              fontWeight:'900',
              fontSize:'0.75rem',
              cursor:'pointer',
              transition:'all 0.2s ease',
              // Cambio de color dinámico
              background: liga === l ? '#fbbf24' : 'transparent',
              color: liga === l ? '#000' : '#666',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* LISTADO DE PARTIDOS CON ALTO CONTRASTE */}
      <div style={{maxWidth:'500px', margin:'0 auto'}}>
        {partidos.map((p, i) => (
          <div key={i} style={{
            background:'#050505', 
            borderBottom:'1px solid #151515', 
            padding:'25px 0',
            textAlign:'center'
          }}>
            <div style={{color:'#fff', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'12px', opacity:0.8}}>
              {p.d} — {p.t}
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 10px'}}>
              <span style={{fontSize:'1.1rem', fontWeight:'900', color:'#fff', width:'40%'}}>{p.h.toUpperCase()}</span>
              <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'0.8rem'}}>VS</span>
              <span style={{fontSize:'1.1rem', fontWeight:'900', color:'#fff', width:'40%'}}>{p.a.toUpperCase()}</span>
            </div>

            <button style={{
              marginTop:'20px',
              width:'100%',
              padding:'15px',
              background:'#111',
              border:'1px solid #222',
              color:'#fbbf24',
              borderRadius:'10px',
              fontWeight:'900',
              fontSize:'0.7rem'
            }}>
              DESBLOQUEAR PREDICCIÓN IA 5
            </button>
          </div>
        ))}
      </div>

      <footer style={{marginTop:'50px', textAlign:'center', fontSize:'0.5rem', color:'#333', letterSpacing:'2px'}}>
        GP-AI QUANTUM SYSTEMS - 2026
      </footer>
    </div>
  );
}
                  
            
                                
