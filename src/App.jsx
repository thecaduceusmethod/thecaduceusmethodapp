import { useState, useEffect, useRef, useCallback } from "react";

import heroImg from "./assets/landing-hero.png";
import freqImg from "./assets/freq.png";
import vibroImg from "./assets/vibroacoustic.png";
import heartImg from "./assets/heart-brain.jpeg";
import templesImg from "./assets/temples.png";

// ── Images ─────────────────────────────────────────────────────────────
const IMG = {
  hero: heroImg,
  method1: freqImg,
  method2: vibroImg,
  method3: heartImg,
  temples: templesImg,
};

// ── Design tokens ──────────────────────────────────────────────────────
const PINK   = "#f48fb1";
const PURPLE = "#ce93d8";
const GOLD   = "#ffd700";
const BG     = "#080c18";
const GOLD_GLOW = "0 0 18px rgba(255,195,60,0.75), 0 0 38px rgba(255,140,20,0.4)";
const GOLD_SOFT = "0 0 12px rgba(255,195,60,0.5), 0 0 24px rgba(255,140,20,0.25)";

// ── Frequency data ─────────────────────────────────────────────────────
const FREQ_CATEGORIES = [
  {
    id:"organ", label:"Body & Organ",
    note:"Frequencies sourced from Rife research and tuning fork therapy traditions. List of Resources available in The Caduceus Method book.",
    freqs:[
      {hz:110,   label:"Stomach",       desc:"Nourishment, worry, digestion."},
      {hz:117.3, label:"Pancreas",      desc:"Sweetness in life, balance."},
      {hz:164.3, label:"Gall Bladder",  desc:"Decision making, assertiveness."},
      {hz:176,   label:"Colon",         desc:"Release, elimination, stored trauma."},
      {hz:200,   label:"Collagen",      desc:"Skin rejuvenation and tissue repair."},
      {hz:220,   label:"Lungs",         desc:"Grief, sadness, breathing life fully."},
      {hz:281,   label:"Intestines",    desc:"Gut instincts, digestion, assimilation."},
      {hz:295.8, label:"Fat Cells",     desc:"Storage, protection, metabolism."},
      {hz:315.8, label:"Brain",         desc:"Cognitive function, clarity, mental processing."},
      {hz:317.83,label:"Liver",         desc:"Anger, frustration, detoxification."},
      {hz:319.88,label:"Kidneys",       desc:"Fear, survival, cleansing."},
      {hz:321.9, label:"Blood",         desc:"Vitality, circulation, life force."},
      {hz:324,   label:"Muscles",       desc:"Strength, movement, resilience."},
      {hz:352,   label:"Bladder",       desc:"Holding on, letting go, fluid balance."},
      {hz:418.3, label:"Bone",          desc:"Foundation, support, stability."},
      {hz:492.8, label:"Adrenals",      desc:"Stress, fear, fight-or-flight response."},
      {hz:528,   label:"528 — Nervous/Endocrine", desc:"Increasing oxytocin. Supports cellular health and transition from survival to relaxed state."},
      {hz:537.8, label:"537.8 — Cytosine", desc:"Influences emotional and ancestral memory retention."},
      {hz:543.4, label:"543.4 — Thymine",  desc:"Supports cellular stability and deep-rooted energy patterns."},
      {hz:545.6, label:"545.6 — Adenine",  desc:"Aids in genetic reprogramming and releasing inherited blocks."},
      {hz:550,   label:"550 — Guanine",    desc:"Supports transformation and cellular resilience."},
    ]
  },
  {
    id:"temple", label:"Sacred Spaces",
    note:"Archaeoacoustic frequencies of ancient sites currently being researched and mapped. More will be added as they are documented.",
    img: IMG.temples,
    freqs:[
      {hz:111, label:"Newgrange",             sub:"3200 BCE — Ireland",  desc:"Standing wave resonance of the Newgrange passage tomb. Shown to stimulate endorphin release and suppress the prefrontal cortex, inducing trance-like states.", breathing:{inhale:8,hold1:2,hum:15}},
      {hz:114, label:"Hal Saflieni Hypogeum", sub:"3600 BCE — Malta",    desc:"Resonant frequency of the Hypogeum burial chamber. Associated with deep trance states, theta entrainment, and altered consciousness.", breathing:{inhale:8,hold1:2,hum:12}},
      {hz:250, label:"Hagia Sophia",          sub:"532 AD — Istanbul",   desc:"Primary resonant frequency of the Hagia Sophia grand nave. Produces rich, enveloping sound fields associated with spiritual transcendence.", breathing:{inhale:8,hold1:2,hum:12}},
    ]
  },
  {
    id:"brainwave", label:"Brainwave",
    note:"If these frequencies are below your audible range, please refer to Method II for Vibroacoustic Therapy.",
    freqs:[
      {hz:10, label:"Alpha", note:"α", desc:"Calm focus, relaxation, and light meditation."},
      {hz:18, label:"Beta",  note:"β", desc:"Alert, focused, active thinking. Optimal for concentration, cognitive performance, and mental clarity."},
      {hz:40, label:"Gamma", note:"γ", desc:"High-level cognitive function, working memory, and focus. The key frequency for brain 'humming' — per ScienceDirect and the Hearing Health Foundation."},
    ]
  },
];

// ── Method configs ─────────────────────────────────────────────────────
const METHOD_CONFIGS = [
  {
    id:"method1", num:"I",
    title:"Belly Breathing with Hum",
    img:IMG.method1, imgPos:"center center",
    accent:PURPLE, glow:"rgba(206,147,216,0.5)",
    dest:"practice",
    destLabel:"Open Practice",
    steps:[
      "Inhale for a count of 6 using your diaphragm (belly breathing), pull in breath through your nose.",
      "Hold for a count of 2.",
      "Hum to exhale for a count of 8 using your diaphragm.",
      "Hold for a count of 2.",
      "Repeat for no less than 3 minutes.",
    ],
  },
  {
    id:"method2", num:"II",
    title:"Vibroacoustic Therapy",
    sub:"Same as Method I · Vibroacoustic Added",
    img:IMG.method2, imgPos:"center top",
    accent:GOLD, glow:"rgba(255,215,0,0.5)",
    dest:"practice",
    destLabel:"Open Practice",
    steps:[
      "Vibroacoustic Thereapy, also known as \"Bone Conduction\", utilizes your skeletal system to carry the frequency.  Explained in detail page 14 of The Caduceus Method Book.  After choosing a frequency, place a small speaker or your phone speaker against your sternum, chin, jaw, elbow, knee, or other areas with thin skin and easy skeletal access.",
      "You may also use your finger to place pressure on the tragus (the small flap in front of the ear hole) to better feel sound vibrations and match your hum.",
      "Follow the same inhale · hold · hum · hold cycle as Method I.",
    ],
  },
  {
    id:"method3", num:"III",
    title:"Heart-Brain Coherence",
    img:IMG.method3, imgPos:"center top",
    accent:PINK, glow:"rgba(244,143,177,0.5)",
    dest:"heartbrain",
    destLabel:"Open Heart-Brain Tool",
    steps:[
      "Begin in whatever posture feels natural — stand, sit, or lie back. Just be present.",
      "Default Count is 4, 2, 6. Adjust if you know your hum count, or adjust as you go.",
      "Place your hand or a couple fingers on your sternum, over your heart, and find your heartbeat. Begin your hum and adjust the frequency slider until the vibration resonates in your sternum.",
      "Once you've dropped into your sternum. Imagine your breath moving through your heart and filter that breath with feeling of Love or Gratitude. To evoke this feeling, or emotion, think of something or someone that makes you genuinely smile — someone you Love, a Fur Person, a warm hug, the 'squishy feels' and now breath through that feeling.",
      "Press Play. When you return, write down your experience in a notbook, or in The Caduceus Method Journal.",
    ],
  },
];

const INFO = [
  {title:"Nitric Oxide",   c:"#00e5ff",s:"rgba(0,229,255,0.6)",  text:"Humming increases nasal nitric oxide production up to 15×, supporting vascular health and immune signaling."},
  {title:"Immune Defense", c:"#ffd700",s:"rgba(255,215,0,0.6)",  text:"Vibration activates the lymphatic system, moving immune cells and clearing cellular waste."},
  {title:"Clear Breathing",c:"#69f0ae",s:"rgba(105,240,174,0.6)",text:"Oscillating airflow ventilates the sinuses, reducing stagnation and supporting open nasal passages."},
  {title:"Vagus Nerve",    c:"#ce93d8",s:"rgba(206,147,216,0.6)",text:"The hum vibrates the vagus nerve, activating the parasympathetic nervous system — rest, digest, repair."},
];

// ── Hooks ──────────────────────────────────────────────────────────────
function useAudio() {
  const r = useRef({});
  const start = useCallback((freq) => {
    try {
      if (r.current.ctx) { try { r.current.ctx.close(); } catch(e){} r.current = {}; }
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type="sine"; osc.frequency.value=freq;
      gain.gain.setValueAtTime(0.001,ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22,ctx.currentTime+0.5);
      osc.connect(gain); gain.connect(ctx.destination); osc.start();
      r.current={ctx,osc,gain};
    } catch(e){}
  },[]);
  const stop = useCallback(()=>{
    try {
      const {gain,ctx}=r.current;
      if(gain&&ctx){ gain.gain.linearRampToValueAtTime(0.001,ctx.currentTime+0.4); setTimeout(()=>{try{ctx.close();}catch(e){}r.current={};},500); }
    } catch(e){}
  },[]);
  useEffect(()=>()=>stop(),[stop]);
  return {start,stop};
}

function useBreathTimer({inhale,hold1,hum,hold2=0,onPhase}){
  const [phase,setPhase]=useState("Inhale");
  const [count,setCount]=useState(inhale);
  const [running,setRunning]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const cb=useRef(onPhase);
  useEffect(()=>{cb.current=onPhase;},[onPhase]);
  useEffect(()=>{
    if(!running)return;
    const phases=[["Inhale",inhale],["Hold",hold1],["Hum",hum],...(hold2>0?[["Hold",hold2]]:[])];
    let idx=0,cnt=phases[0][1];
    setPhase(phases[0][0]); setCount(cnt); cb.current?.(phases[0][0]);
    const id=setInterval(()=>{
      cnt--;
      if(cnt<=0){idx=(idx+1)%phases.length;cnt=phases[idx][1];setPhase(phases[idx][0]);cb.current?.(phases[idx][0]);}
      setCount(cnt); setElapsed(e=>e+1);
    },1000);
    return ()=>clearInterval(id);
  },[running]); // eslint-disable-line
  const toggle=()=>{
    if(running){cb.current?.(null);setRunning(false);setPhase("Inhale");setCount(inhale);setElapsed(0);}
    else{setElapsed(0);setRunning(true);}
  };
  return {phase,count,running,elapsed,toggle};
}

// ── Shared UI ──────────────────────────────────────────────────────────
function Circle({phase,count,hint,accent}){
  const glow=phase==="Hum";
  return(
    <div style={{width:250,height:250,borderRadius:"50%",
      border:`2px solid ${glow?accent:"rgba(255,255,255,0.12)"}`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      margin:"1.5rem auto",
      background:"radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%)",
      boxShadow:glow?`0 0 45px ${accent}70,0 0 90px ${accent}35`:"none",
      transition:"all 0.6s ease",position:"relative"}}>
      {phase==="Inhale"&&<div style={{position:"absolute",inset:-14,borderRadius:"50%",
        border:"1px solid rgba(200,220,255,0.1)",animation:"breathe 3s ease-in-out infinite"}}/>}
      <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.2rem",letterSpacing:"0.22em",
        textTransform:"uppercase",marginBottom:"0.2rem",
        color:glow?accent:"rgba(232,224,208,0.9)",
        textShadow:glow?`0 0 18px ${accent},0 0 36px ${accent}70`:GOLD_SOFT}}>{phase}</div>
      <div style={{fontSize:"4.5rem",fontWeight:300,lineHeight:1,
        color:glow?accent:"#fff",textShadow:glow?`0 0 22px ${accent}`:GOLD_SOFT}}>{count}</div>
      {hint&&<div style={{fontSize:"0.72rem",letterSpacing:"0.08em",textTransform:"uppercase",
        color:"rgba(255,255,255,0.5)",marginTop:"0.75rem",textAlign:"center",
        padding:"0 1.5rem",maxWidth:190,lineHeight:1.6}}>{hint}</div>}
    </div>
  );
}

function PlayBtn({running,onToggle,accent}){
  const [h,setH]=useState(false);
  return(
    <button onClick={onToggle} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:62,height:62,borderRadius:"50%",
        background:running?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.04)",
        border:`2px solid ${h||running?accent:"rgba(255,255,255,0.25)"}`,
        color:"#fff",fontSize:"1.25rem",cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:h||running?`0 0 22px ${accent}80,0 0 44px ${accent}40`:"none",
        transition:"all 0.25s ease",margin:"0 auto"}}>{running?"⏸":"▶"}</button>
  );
}

function Adj({onClick,label}){
  return(
    <button onClick={onClick} style={{width:30,height:30,borderRadius:"50%",
      background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.22)",
      color:"#fff",cursor:"pointer",fontSize:"1.2rem",lineHeight:1,
      display:"flex",alignItems:"center",justifyContent:"center"}}>{label}</button>
  );
}

function Accordion({open,onToggle,header,children}){
  return(
    <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",
      borderRadius:13,marginBottom:"0.8rem",overflow:"hidden"}}>
      <button onClick={onToggle} style={{width:"100%",padding:"0.95rem 1.15rem",background:"transparent",
        border:"none",color:"#e8e0d0",cursor:"pointer",display:"flex",justifyContent:"space-between",
        alignItems:"center",fontFamily:"'Cinzel',serif"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.9rem"}}>{header}</div>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.9rem"}}>{open?"∧":"∨"}</span>
      </button>
      {open&&<div style={{padding:"0 1.15rem 1rem"}}>{children}</div>}
    </div>
  );
}

function GlowBtn({onClick,label,accent,full}){
  const [h,setH]=useState(false);
  const ac=accent||PURPLE;
  return(
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        width:full?"100%":"auto",
        padding:"0.55rem 1.5rem",borderRadius:"2rem",cursor:"pointer",
        background:h?`rgba(255,255,255,0.08)`:"rgba(255,255,255,0.03)",
        border:`1px solid ${h?ac:`${ac}60`}`,
        color:h?"#fff":ac,
        fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.14em",
        textTransform:"uppercase",
        boxShadow:h?`0 0 16px ${ac}70,0 0 32px ${ac}35`:"none",
        textShadow:h?`0 0 10px ${ac}`:"none",
        transition:"all 0.22s ease",
      }}>{label}</button>
  );
}

// ── Ghost background ───────────────────────────────────────────────────
function GhostBg({src,opacity=0.08}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
      backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center",
      opacity,filter:"blur(2px)",transition:"opacity 0.6s ease"}}/>
  );
}

// ── Room hero banner ───────────────────────────────────────────────────
function RoomHero({img,imgPos,num,title,accent,glow}){
  return(
    <div style={{position:"relative",borderRadius:16,overflow:"hidden",height:240,
      marginBottom:"2rem",
      boxShadow:`0 0 40px ${glow}, 0 4px 0 ${accent}30`}}>
      <img src={img} alt={title}
        style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:imgPos||"center",display:"block"}}/>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:"linear-gradient(to bottom,rgba(8,12,24,0.1) 0%,rgba(8,12,24,0) 30%,rgba(8,12,24,0.78) 85%,rgba(8,12,24,0.95) 100%)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1rem 1.35rem"}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.22em",
          color:accent,textShadow:`0 0 12px ${accent}`,textTransform:"uppercase",
          display:"block",marginBottom:"0.3rem"}}>METHOD {num}</span>
        <span style={{fontFamily:"'Cinzel Decorative','Cinzel',serif",
          fontSize:"clamp(1.1rem,3.5vw,1.5rem)",color:"#f5e6c0",fontWeight:400,
          textShadow:`0 0 20px ${glow},0 0 40px ${glow}`}}>{title}</span>
      </div>
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────
function Divider(){
  return <div style={{width:60,height:1,background:"rgba(255,195,60,0.45)",margin:"0 auto",
    boxShadow:"0 0 8px rgba(255,195,60,0.45)"}}/>;
}

// ── Nav ─────────────────────────────────────────────────────────────────
const NAVITEMS=[["home","Home"],["practice","Practice"],["heartbrain","Heart-Brain"],["tracker","Tracker"]];

function Nav({page,setPage}){
  const [hov,setHov]=useState(null);
  return(
    <nav style={{padding:"1.35rem 1rem 0.85rem",textAlign:"center",
      borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      {[NAVITEMS.slice(0,2),NAVITEMS.slice(2,4)].map((row,ri)=>(
        <div key={ri} style={{display:"flex",justifyContent:"center",gap:"0.6rem",
          marginBottom:"0.45rem",marginLeft:ri===1?"1.8rem":"0"}}>
          {row.map(([id,label])=>{
            const active=page===id||page.startsWith("method")&&id==="home",h=hov===id;
            return(
              <button key={id} onClick={()=>setPage(id)}
                onMouseEnter={()=>setHov(id)} onMouseLeave={()=>setHov(null)}
                style={{background:active?"rgba(200,160,255,0.1)":"transparent",
                  border:`1px solid ${h?"rgba(200,160,255,0.95)":active?"rgba(200,160,255,0.5)":"rgba(255,255,255,0.22)"}`,
                  color:h||active?"#fff":"rgba(255,255,255,0.68)",
                  padding:"0.4rem 1.15rem",borderRadius:"2rem",
                  fontFamily:"'Cinzel',serif",fontSize:"0.67rem",letterSpacing:"0.15em",
                  cursor:"pointer",textTransform:"uppercase",
                  boxShadow:h?"0 0 16px rgba(200,160,255,0.95),0 0 32px rgba(200,160,255,0.45)":active?"0 0 8px rgba(200,160,255,0.3)":"none",
                  textShadow:h?"0 0 10px rgba(200,160,255,1)":"none",
                  transition:"all 0.22s ease"}}>{label}</button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// ── Home page ───────────────────────────────────────────────────────────
function InfoBox({title,c,s,text}){
  const [h,setH]=useState(false);
  return(
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${h?c:"rgba(255,255,255,0.07)"}`,
        borderRadius:13,padding:"1.25rem",transition:"all 0.3s ease",
        boxShadow:h?`0 0 22px ${s},inset 0 0 20px ${c}08`:"none"}}>
      <div style={{fontSize:"1.7rem",color:c,filter:`drop-shadow(0 0 10px ${s})`,marginBottom:"0.5rem",textAlign:"center"}}>◈</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.14em",
        textTransform:"uppercase",color:h?c:"#f0ead8",marginBottom:"0.55rem",textAlign:"center",
        textShadow:h?`0 0 12px ${c}`:GOLD_SOFT}}>{title}</div>
      <p style={{fontSize:"0.85rem",lineHeight:1.8,color:"rgba(232,224,208,0.75)",margin:0}}>{text}</p>
    </div>
  );
}

function MethodDoor({config, navigate}){
  const [h,setH]=useState(false);
  return(
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      onClick={()=>navigate(config.id)}
      style={{
        position:"relative",borderRadius:14,overflow:"hidden",
        cursor:"pointer",marginBottom:"1rem",
        border:`1px solid ${h?config.accent:`${config.accent}30`}`,
        boxShadow:h?`0 0 28px ${config.glow},0 0 56px ${config.glow.replace("0.5","0.2")}`:"none",
        transition:"all 0.3s ease",
      }}>
      {/* Background image at low opacity */}
      <div style={{position:"absolute",inset:0,
        backgroundImage:`url(${config.img})`,backgroundSize:"cover",
        backgroundPosition:config.imgPos||"center",
        opacity:h?0.35:0.18,transition:"opacity 0.3s ease"}}/>
      {/* Dark overlay */}
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(135deg,rgba(8,12,24,0.7) 0%,rgba(8,12,24,0.4) 100%)"}}/>
      {/* Content */}
      <div style={{position:"relative",zIndex:1,padding:"1.35rem 1.5rem",
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.22em",
            color:config.accent,textShadow:`0 0 10px ${config.accent}80`,
            textTransform:"uppercase",marginBottom:"0.3rem"}}>METHOD {config.num}</div>
          <div style={{fontFamily:"'Cinzel Decorative','Cinzel',serif",
            fontSize:"clamp(0.95rem,3vw,1.15rem)",color:"#f5e6c0",
            textShadow:h?`0 0 16px ${config.glow}`:GOLD_SOFT}}>{config.title}</div>
          {config.sub&&<div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",
            fontStyle:"italic",marginTop:"0.2rem"}}>{config.sub}</div>}
        </div>
        <div style={{
          width:36,height:36,borderRadius:"50%",flexShrink:0,
          border:`1px solid ${h?config.accent:`${config.accent}50`}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          color:config.accent,fontSize:"1rem",
          boxShadow:h?`0 0 14px ${config.glow}`:"none",
          transition:"all 0.3s ease",
        }}>→</div>
      </div>
    </div>
  );
}

function Home({navigate}){
  return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"1.5rem 1.25rem 5rem"}}>
      {/* Hero */}
      <div style={{marginBottom:"2rem"}}>
        <div style={{position:"relative",borderRadius:18,overflow:"hidden",
          boxShadow:"0 0 60px rgba(200,150,255,0.25),0 0 120px rgba(255,195,60,0.12)"}}>
          <img src={IMG.hero} alt="The Caduceus Method hero illustration" style={{width:"100%",display:"block"}}/>
          <div style={{position:"absolute",inset:0,pointerEvents:"none",
            background:"linear-gradient(to bottom,rgba(8,12,24,0.25) 0%,transparent 20%,transparent 55%,rgba(8,12,24,0.75) 85%,rgba(8,12,24,0.95) 100%)"}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem 1.25rem 1.75rem",textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(0.6rem,1.6vw,0.72rem)",
              letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(255,220,160,0.55)",
              margin:"0 0 0.5rem",textShadow:GOLD_SOFT}}>WELCOME TO</p>
            <h1 style={{fontFamily:"'Cinzel Decorative','Cinzel',serif",
              fontSize:"clamp(1.65rem,5.5vw,3rem)",letterSpacing:"0.06em",
              color:"#f5e6c0",margin:0,textShadow:GOLD_GLOW,lineHeight:1.15,fontWeight:400}}>
              The Caduceus Method</h1>
          </div>
        </div>
        <div style={{textAlign:"center",padding:"1.35rem 0.5rem 0"}}>
          <Divider/>
          <div style={{marginTop:"1.25rem"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(0.95rem,2.8vw,1.15rem)",
              letterSpacing:"0.07em",color:"rgba(255,220,160,0.95)",lineHeight:2,
              textShadow:GOLD_SOFT,margin:"0 0 0.3rem"}}>
              This is Not Meditation, This is a Workout
            </p>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(0.8rem,2.2vw,0.93rem)",
              color:"rgba(255,255,255,0.58)",lineHeight:2,margin:0}}>
              For once it's ok to FAFO.&nbsp;·&nbsp;Humming. Sounds dumb, right?<br/>
              Hit Practice. Feel it. Find out.
            </p>
          </div>
        </div>
      </div>

      {/* Info boxes */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2.75rem"}}>
        {INFO.map(b=><InfoBox key={b.title} {...b}/>)}
      </div>

      {/* Intro text */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",
        borderRadius:15,padding:"1.85rem",marginBottom:"2.5rem"}}>
        <p style={{fontSize:"clamp(0.9rem,2.5vw,1.05rem)",lineHeight:2,color:"#f0ead8",
          marginBottom:"1.1rem",textShadow:GOLD_SOFT}}>
          <strong>Everything is Vibration. Humming is Human Vibration.</strong>
        </p>
        <p style={{fontSize:"clamp(0.88rem,2.5vw,1rem)",lineHeight:2,color:"rgba(232,224,208,0.85)",marginBottom:"1rem"}}>
          Reminder: This is not a trip to the beach, or be a flower, or even focus on some random word that you paid for to focus on. Can it be considered "meditation"? To be honest, fishing can be "meditative". Whatever brings your focus to where you are right here, right now.
        </p>
        <p style={{fontSize:"clamp(0.88rem,2.5vw,1rem)",lineHeight:2,color:"rgba(232,224,208,0.85)",margin:0}}>
          This is a workout. It will take effort, but only at first. You may be surprised how quickly your inhale and hum time expand and lengthen.
        </p>
      </div>

      {/* Method doors */}
      <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
        <Divider/>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.8rem",letterSpacing:"0.22em",
          color:"rgba(255,220,160,0.55)",textTransform:"uppercase",
          textShadow:GOLD_SOFT,marginTop:"1.5rem"}}>
          You have read the book. You know why you are here.
        </p>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.15em",
          color:"rgba(255,255,255,0.4)",marginTop:"0.4rem",marginBottom:"1.5rem"}}>
          Choose your method to begin.
        </p>
      </div>
      {METHOD_CONFIGS.map(m=><MethodDoor key={m.id} config={m} navigate={navigate}/>)}

      <div style={{textAlign:"center",marginTop:"2.5rem",padding:"1.35rem",
        background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:13}}>
        <p style={{fontSize:"0.88rem",lineHeight:1.9,color:"rgba(232,224,208,0.45)",fontStyle:"italic",margin:0}}>
          Your Progress is Your Business.<br/>
          <span style={{fontSize:"0.82rem"}}>You Will Not Get Obnoxious Emails — Info and Updates are Done In the App.</span>
        </p>
      </div>
    </div>
  );
}

// ── Method Room page ────────────────────────────────────────────────────
function MethodRoom({config, navigate, onSessionLog}){
  return(
    <div style={{position:"relative"}}>
      <GhostBg src={config.img} opacity={0.07}/>
      <div style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto",padding:"1.5rem 1.25rem 5rem"}}>

        <RoomHero img={config.img} imgPos={config.imgPos} num={config.num}
          title={config.title} accent={config.accent} glow={config.glow}/>

        {/* Steps */}
        <div style={{background:"rgba(8,12,24,0.7)",border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:14,padding:"1.75rem",marginBottom:"1.5rem",backdropFilter:"blur(8px)"}}>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.2em",
            textTransform:"uppercase",color:config.accent,textShadow:`0 0 10px ${config.accent}80`,
            marginBottom:"1.25rem"}}>The Method — Refresher</p>
          <ol style={{paddingLeft:"1.2rem",margin:0}}>
            {config.steps.map((s,i)=>(
              <li key={i} style={{fontSize:"clamp(0.88rem,2.5vw,1rem)",lineHeight:1.95,
                color:"rgba(232,224,208,0.88)",marginBottom:"0.5rem"}}>{s}</li>
            ))}
          </ol>
        </div>

        {/* Book note */}
        <div style={{background:`rgba(${config.accent===PINK?"244,143,177":config.accent===GOLD?"255,215,0":"206,147,216"},0.06)`,
          border:`1px solid ${config.accent}25`,borderRadius:12,
          padding:"1.1rem 1.35rem",marginBottom:"2rem",
          display:"flex",gap:"0.85rem",alignItems:"flex-start"}}>
          <span style={{fontSize:"1.1rem",flexShrink:0,marginTop:"0.1rem"}}>📖</span>
          <p style={{fontSize:"0.85rem",lineHeight:1.8,color:"rgba(232,224,208,0.65)",
            fontStyle:"italic",margin:0}}>
            For complete detail, the science, and the deeper 'why' behind this method —
            see <span style={{color:config.accent,textShadow:`0 0 8px ${config.accent}80`}}>The Caduceus Method</span>.
            This is just your refresher.
          </p>
        </div>

        {/* Nav buttons */}
        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",justifyContent:"center"}}>
          <GlowBtn onClick={()=>navigate("home")} label="← Home" accent="rgba(255,255,255,0.5)"/>
          <GlowBtn onClick={()=>navigate(config.dest)} label={`${config.destLabel} →`} accent={config.accent}/>
        </div>
      </div>
    </div>
  );
}

// ── Frequency Library ──────────────────────────────────────────────────
function FreqLibrary({freq,setFreq,onBreathingChange}){
  const [cat,setCat]=useState("organ");
  const [hovered,setHovered]=useState(null);
  const current=FREQ_CATEGORIES.find(c=>c.id===cat);
  return(
    <div style={{marginTop:"2.75rem"}}>
      <p style={{textAlign:"center",fontSize:"0.67rem",letterSpacing:"0.2em",textTransform:"uppercase",
        color:"rgba(255,255,255,0.3)",marginBottom:"1rem"}}>Frequency Library</p>

      <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
        {FREQ_CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)}
            style={{background:cat===c.id?"rgba(200,160,255,0.13)":"rgba(255,255,255,0.02)",
              border:`1px solid ${cat===c.id?"rgba(200,160,255,0.55)":"rgba(255,255,255,0.08)"}`,
              color:cat===c.id?PURPLE:"rgba(255,255,255,0.55)",
              padding:"0.35rem 1rem",borderRadius:"2rem",fontFamily:"'Cinzel',serif",
              fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
              boxShadow:cat===c.id?`0 0 10px ${PURPLE}40`:"none",transition:"all 0.2s"}}>{c.label}</button>
        ))}
      </div>

      {/* Category note */}
      <p style={{fontSize:"0.78rem",color:"rgba(255,220,160,0.6)",textAlign:"center",
        marginBottom:"1rem",lineHeight:1.7,fontStyle:"italic",padding:"0 0.5rem"}}>
        {current.note}</p>

      {/* Temple image */}
      {cat==="temple"&&(
        <div style={{textAlign:"center",marginBottom:"1.25rem"}}>
          <img src={IMG.temples} alt="Sacred Spaces"
            style={{maxWidth:280,width:"100%",borderRadius:14,
              filter:"drop-shadow(0 0 24px rgba(255,195,60,0.45))",opacity:0.9}}/>
        </div>
      )}

      {/* Brainwave image */}
      {cat==="brainwave"&&(
        <div style={{textAlign:"center",marginBottom:"1rem"}}>
          <img src={IMG.method1} alt="Frequency"
            style={{maxWidth:180,width:"100%",borderRadius:"50%",
              filter:"drop-shadow(0 0 24px rgba(255,215,0,0.5))",opacity:0.88}}/>
        </div>
      )}

      <div style={{display:"grid",
        gridTemplateColumns:cat==="organ"?"repeat(3,1fr)":"1fr",
        gap:"0.55rem"}}>
        {current.freqs.map(f=>(
          <button key={f.hz}
            onClick={()=>{ setFreq(f.hz); onBreathingChange?.(f.breathing||null); }}
            onMouseEnter={()=>setHovered(f.hz)}
            onMouseLeave={()=>setHovered(null)}
            style={{
              background:freq===f.hz?"rgba(206,147,216,0.15)":hovered===f.hz?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.02)",
              border:`1px solid ${freq===f.hz?"rgba(206,147,216,0.6)":hovered===f.hz?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)"}`,
              borderRadius:10,
              padding:cat==="organ"?"0.6rem 0.35rem":"0.8rem 1rem",
              cursor:"pointer",
              textAlign:cat==="organ"?"center":"left",
              boxShadow:freq===f.hz?`0 0 12px ${PURPLE}40`:"none",
              transition:"all 0.2s",
            }}>
            <div style={{fontSize:cat==="organ"?"0.85rem":"0.95rem",
              color:freq===f.hz?PURPLE:hovered===f.hz?"#fff":"rgba(255,255,255,0.65)",
              textShadow:freq===f.hz?`0 0 8px ${PURPLE}`:"none",
              marginBottom:cat==="organ"?2:4}}>
              {f.note&&cat==="brainwave"?`${f.note} · `:""}{f.hz}Hz</div>
            <div style={{fontSize:cat==="organ"?"0.62rem":"0.8rem",
              color:freq===f.hz?"rgba(206,147,216,0.8)":"rgba(255,255,255,0.5)",
              marginBottom:f.sub?2:0}}>{f.label}</div>
            {f.sub&&<div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.35)",marginBottom:4}}>{f.sub}</div>}
            {(hovered===f.hz||freq===f.hz)&&(
              <div style={{fontSize:"0.72rem",color:"rgba(232,224,208,0.7)",marginTop:"0.4rem",
                lineHeight:1.65,textAlign:"left"}}>{f.desc}</div>
            )}
            {f.breathing&&(freq===f.hz||hovered===f.hz)&&(
              <div style={{fontSize:"0.65rem",color:PINK,marginTop:"0.35rem",
                textShadow:`0 0 6px ${PINK}70`}}>
                ↺ Suggested: {f.breathing.inhale}s · {f.breathing.hold1}s · {f.breathing.hum}s</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Practice page ───────────────────────────────────────────────────────
function Practice({onSessionLog}){
  const [mode,setMode]=useState("classic");
  const [cust,setCust]=useState({inhale:6,hold1:2,hum:8,hold2:2});
  const [freq,setFreq]=useState(110);
  const [bc,setBc]=useState(null);
  const {start,stop}=useAudio();

  const presets={classic:{inhale:6,hold1:2,hum:8,hold2:2},extended:{inhale:8,hold1:2,hum:12,hold2:2},custom:cust};
  const t=bc||presets[mode];

  const {phase,count,running,elapsed,toggle}=useBreathTimer({
    ...t,onPhase:p=>{if(p==="Hum")start(freq);else stop();}
  });

  const handleToggle=()=>{
    if(running&&elapsed>5) onSessionLog?.({type:"Practice",hz:freq,method:"Practice",durationSec:elapsed});
    toggle();
  };

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const hint=running?(phase==="Inhale"?"Breathe in through your nose using your diaphragm":phase==="Hum"?"Hum steadily — feel the vibration":"Hold"):"Breathe in through your nose using your diaphragm";

  return(
    <div style={{maxWidth:560,margin:"0 auto",padding:"2rem 1.25rem 5rem"}}>
      <h1 style={{fontFamily:"'Cinzel Decorative','Cinzel',serif",fontSize:"clamp(1.5rem,5vw,2.1rem)",
        letterSpacing:"0.2em",textAlign:"center",marginBottom:"0.5rem",color:"#f0ead8",textShadow:GOLD_GLOW}}>Practice</h1>
      <div style={{margin:"0 auto 0.75rem"}}><Divider/></div>
      <p style={{textAlign:"center",fontSize:"0.82rem",letterSpacing:"0.14em",textTransform:"uppercase",
        color:PINK,marginBottom:"1.85rem",textShadow:`0 0 12px ${PINK}80`}}>
        Tone plays automatically during Hum phase</p>

      <div style={{display:"flex",justifyContent:"center",gap:"0.6rem",marginBottom:"0.9rem"}}>
        {["classic","extended","custom"].map(m=>{
          const [h,setH]=useState(false);
          return(
            <button key={m} onClick={()=>{setMode(m);setBc(null);}}
              onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
              style={{background:mode===m&&!bc?"rgba(255,255,255,0.1)":"transparent",
                border:`1px solid ${h||mode===m&&!bc?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)"}`,
                color:mode===m&&!bc||h?"#fff":"rgba(255,255,255,0.65)",
                padding:"0.4rem 1.15rem",borderRadius:"2rem",fontFamily:"'Cinzel',serif",
                fontSize:"0.7rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
                boxShadow:h?"0 0 14px rgba(200,160,255,0.8)":"none",transition:"all 0.2s"}}>{m}</button>
          );
        })}
      </div>

      {mode==="custom"&&!bc&&(
        <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",
          borderRadius:13,padding:"1.15rem",marginBottom:"1rem",display:"flex",justifyContent:"center",gap:"2.5rem"}}>
          {[["inhale","Inhale"],["hum","Hum"]].map(([k,l])=>(
            <div key={k} style={{textAlign:"center"}}>
              <div style={{fontSize:"0.72rem",letterSpacing:"0.06em",color:"rgba(255,255,255,0.65)",
                textTransform:"none",marginBottom:"0.35rem"}}>{l}</div>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <Adj onClick={()=>setCust(c=>({...c,[k]:Math.max(2,c[k]-1)}))} label="−"/>
                <span style={{fontSize:"1.15rem",minWidth:32,textAlign:"center"}}>{cust[k]}s</span>
                <Adj onClick={()=>setCust(c=>({...c,[k]:Math.min(30,c[k]+1)}))} label="+"/>
              </div>
            </div>
          ))}
        </div>
      )}

      {bc&&(
        <div style={{textAlign:"center",marginBottom:"0.75rem"}}>
          <span style={{fontSize:"0.72rem",color:PINK,letterSpacing:"0.1em",
            textShadow:`0 0 8px ${PINK}70`}}>
            ↺ Temple timing: {bc.inhale}s · {bc.hold1}s · {bc.hum}s &nbsp;
          </span>
          <button onClick={()=>setBc(null)} style={{background:"none",border:"none",
            color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:"0.7rem"}}>✕ clear</button>
        </div>
      )}

      <Circle phase={running?phase:"Inhale"} count={running?count:t.inhale} hint={hint} accent={PURPLE}/>

      <div style={{textAlign:"center",fontSize:"1rem",letterSpacing:"0.12em",
        color:"rgba(255,255,255,0.4)",marginBottom:"0.5rem"}}>{fmt(elapsed)}</div>
      <div style={{textAlign:"center",fontSize:"0.9rem",letterSpacing:"0.1em",
        color:PINK,marginBottom:"1.35rem",textShadow:`0 0 10px ${PINK}70`}}>
        {freq} Hz — {FREQ_CATEGORIES.flatMap(c=>c.freqs).find(f=>f.hz===freq)?.label||"Custom"}</div>
      <PlayBtn running={running} onToggle={handleToggle} accent={PURPLE}/>

      <FreqLibrary freq={freq} setFreq={setFreq} onBreathingChange={setBc}/>
    </div>
  );
}

// ── Heart-Brain page ────────────────────────────────────────────────────
function HeartBrain({onSessionLog}){
  const [gender,setGender]=useState("women");
  const [freq,setFreq]=useState(130);
  const [t,setT]=useState({inhale:7,hold1:2,hum:12,hold2:0});
  const [fOpen,setFOpen]=useState(false);
  const [iOpen,setIOpen]=useState(false);
  const {start,stop}=useAudio();

  useEffect(()=>{
    if(gender==="women"){setFreq(130);setT({inhale:7,hold1:2,hum:12,hold2:0});}
    else{setFreq(136);setT({inhale:7,hold1:2,hum:12,hold2:0});}
  },[gender]);

  const {phase,count,running,elapsed,toggle}=useBreathTimer({
    ...t,onPhase:p=>{if(p==="Hum")start(freq);else stop();}
  });

  const handleToggle=()=>{
    if(running&&elapsed>5) onSessionLog?.({type:"Heart-Brain",hz:freq,method:"Method III",durationSec:elapsed});
    toggle();
  };

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const remaining=Math.max(0,180-elapsed);
  const hint=running?(phase==="Inhale"?"Breathe love into your heart":phase==="Hum"?"Feel the vibration in your sternum":"Hold"):"Breathe love into your heart";

  return(
    <div style={{position:"relative"}}>
      <GhostBg src={IMG.method3} opacity={0.07}/>
      <div style={{position:"relative",zIndex:1,maxWidth:600,margin:"0 auto",padding:"1.5rem 1.25rem 5rem"}}>

        {/* Hero banner */}
        <div style={{position:"relative",borderRadius:16,overflow:"hidden",height:260,
          marginBottom:"2rem",
          boxShadow:`0 0 40px rgba(244,143,177,0.4),0 4px 0 rgba(244,143,177,0.2)`}}>
          <img src={IMG.method3} alt="Heart-Brain Coherence"
            style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
          <div style={{position:"absolute",inset:0,pointerEvents:"none",
            background:"linear-gradient(to bottom,rgba(8,12,24,0.1) 0%,rgba(8,12,24,0) 30%,rgba(8,12,24,0.78) 85%,rgba(8,12,24,0.95) 100%)"}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1rem 1.35rem"}}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.22em",
              color:PINK,textShadow:`0 0 12px ${PINK}`,textTransform:"uppercase",
              display:"block",marginBottom:"0.3rem"}}>METHOD III</span>
            <span style={{fontFamily:"'Cinzel Decorative','Cinzel',serif",
              fontSize:"clamp(1.1rem,3.5vw,1.5rem)",color:"#f5e6c0",
              textShadow:`0 0 20px rgba(244,143,177,0.5),0 0 40px rgba(244,143,177,0.3)`}}>
              Heart-Brain Coherence</span>
          </div>
        </div>

        <p style={{textAlign:"center",fontSize:"0.8rem",letterSpacing:"0.12em",textTransform:"uppercase",
          color:"rgba(255,255,255,0.45)",marginBottom:"1.6rem"}}>Potential effects within minutes — results may vary</p>

        <div style={{display:"flex",justifyContent:"center",gap:"0.55rem",marginBottom:"1.35rem"}}>
          {["women","men"].map(g=>(
            <button key={g} onClick={()=>setGender(g)} style={{
              background:gender===g?"rgba(244,143,177,0.15)":"transparent",
              border:`1px solid ${gender===g?PINK:"rgba(255,255,255,0.2)"}`,
              color:gender===g?PINK:"rgba(255,255,255,0.65)",
              padding:"0.45rem 1.6rem",borderRadius:"0.35rem",fontFamily:"'Cinzel',serif",
              fontSize:"0.75rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
              boxShadow:gender===g?`0 0 14px ${PINK}50`:"none",transition:"all 0.2s"}}>{g}</button>
          ))}
        </div>

        <Accordion open={fOpen} onToggle={()=>setFOpen(o=>!o)} header={
          <><span style={{color:"rgba(200,160,255,0.8)",fontSize:"0.7rem",letterSpacing:"0.12em",textTransform:"uppercase"}}>Frequency & Timing</span>
            <span style={{color:PINK,fontSize:"0.88rem",textShadow:`0 0 8px ${PINK}70`}}>{freq} Hz · {t.inhale}s / {t.hold1}s / {t.hum}s</span></>
        }>
          <div style={{paddingTop:"0.5rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",
              color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>
              <span>Frequency</span>
              <span style={{color:PINK,textShadow:`0 0 8px ${PINK}80`}}>{freq} Hz</span>
            </div>
            <input type="range" min={115} max={150} value={freq} onChange={e=>setFreq(+e.target.value)} style={{width:"100%",marginBottom:"0.4rem"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",marginBottom:"1.1rem"}}>
              <span>115 Hz</span><span>150 Hz</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
              {[["Inhale","inhale"],["Hum","hum"]].map(([l,k])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.65)",width:54}}>{l}</span>
                  <Adj onClick={()=>setT(p=>({...p,[k]:Math.max(2,p[k]-1)}))} label="−"/>
                  <span style={{fontSize:"1.05rem",minWidth:30,textAlign:"center"}}>{t[k]}s</span>
                  <Adj onClick={()=>setT(p=>({...p,[k]:Math.min(30,p[k]+1)}))} label="+"/>
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.65)",width:54}}>Hold</span>
                <span style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.35)"}}>2s (fixed)</span>
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion open={iOpen} onToggle={()=>setIOpen(o=>!o)} header={
          <span style={{color:"rgba(200,160,255,0.8)",fontSize:"0.7rem",letterSpacing:"0.12em",textTransform:"uppercase"}}>Instructions</span>
        }>
          <div style={{paddingTop:"0.5rem"}}>
            <p style={{fontSize:"0.9rem",lineHeight:1.9,color:PINK,fontStyle:"italic",marginBottom:"0.85rem",
              textShadow:`0 0 10px ${PINK}60`}}>
              Even three minutes may produce noticeable effects that some report linger ~3 hours.
            </p>
            {METHOD_CONFIGS[2].steps.map((s,i)=>(
              <p key={i} style={{fontSize:"0.9rem",lineHeight:1.9,color:"rgba(232,224,208,0.85)",marginBottom:"0.55rem"}}>{s}</p>
            ))}
          </div>
        </Accordion>

        <Circle phase={running?phase:"Inhale"} count={running?count:t.inhale} hint={hint} accent={PINK}/>

        <div style={{display:"flex",justifyContent:"center",gap:"3rem",marginBottom:"1.35rem"}}>
          {[["Elapsed",fmt(elapsed)],["Until 3 min",fmt(remaining)]].map(([l,v])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"0.67rem",letterSpacing:"0.1em",textTransform:"uppercase",
                color:"rgba(255,255,255,0.35)",marginBottom:"0.2rem"}}>{l}</div>
              <div style={{fontSize:"1.25rem",letterSpacing:"0.1em",color:"#fff"}}>{v}</div>
            </div>
          ))}
        </div>
        <PlayBtn running={running} onToggle={handleToggle} accent={PINK}/>
        <p style={{textAlign:"center",fontSize:"0.72rem",color:"rgba(255,255,255,0.28)",
          marginTop:"2rem",letterSpacing:"0.07em"}}>Selected frequency plays during Hum phases to support heart coherence.</p>
      </div>
    </div>
  );
}

// ── Tracker ─────────────────────────────────────────────────────────────
function fmtDur(sec){if(!sec||sec<1)return"0s";if(sec<60)return`${sec}s`;const m=Math.floor(sec/60),s=sec%60;return s>0?`${m}m ${s}s`:`${m}m`;}

function Tracker({sessions,onLog}){
  const [showForm,setShowForm]=useState(false);
  const [note,setNote]=useState("");
  const [type,setType]=useState("Practice");
  const [dur,setDur]=useState(3);

  const totalSec=sessions.reduce((a,s)=>a+(s.durationSec||0),0);
  const h=Math.floor(totalSec/3600),m=Math.floor((totalSec%3600)/60);
  const uniqueDays=[...new Set(sessions.map(s=>new Date(s.date).toDateString()))].length;

  const log=()=>{
    onLog?.({id:Date.now(),date:new Date().toISOString(),type,durationSec:dur*60,hz:null,method:type,note});
    setNote(""); setShowForm(false);
  };

  return(
    <div style={{maxWidth:560,margin:"0 auto",padding:"2rem 1.25rem 5rem"}}>
      <h1 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1.4rem,5vw,2rem)",letterSpacing:"0.15em",
        textAlign:"center",marginBottom:"0.5rem",color:"#f0ead8",textShadow:GOLD_GLOW}}>Practice Tracker</h1>
      <div style={{margin:"0 auto 1.85rem"}}><Divider/></div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.8rem",marginBottom:"1.5rem"}}>
        {[
          {icon:"⏱",val:`${h}h ${m}m`,label:"Total Time"},
          {icon:"🔥",val:String(uniqueDays),label:"Day Streak"},
          {icon:"↗",val:String(sessions.length),label:"Sessions"},
        ].map(({icon,val,label})=>(
          <div key={label} style={{background:"rgba(255,255,255,0.025)",
            border:"1px solid rgba(255,255,255,0.05)",borderRadius:13,
            padding:"1.1rem 0.5rem",textAlign:"center"}}>
            <div style={{fontSize:"1.4rem",marginBottom:"0.4rem"}}>{icon}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1rem,3vw,1.4rem)",
              color:"#f0ead8",textShadow:GOLD_SOFT,marginBottom:"0.2rem"}}>{val}</div>
            <div style={{fontSize:"0.65rem",letterSpacing:"0.04em",textTransform:"none",
              color:"rgba(255,255,255,0.72)"}}>{label}</div>
          </div>
        ))}
      </div>

      <button onClick={()=>setShowForm(o=>!o)}
        style={{width:"100%",padding:"0.95rem",marginBottom:"1.5rem",
          background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:13,color:"rgba(255,255,255,0.9)",fontFamily:"'Cinzel',serif",
          fontSize:"0.82rem",letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer"}}>
        + Log a Session</button>

      {showForm&&(
        <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",
          borderRadius:14,padding:"1.35rem",marginBottom:"1.5rem"}}>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.8rem"}}>
            {["Practice","Heart-Brain","Both"].map(tt=>(
              <button key={tt} onClick={()=>setType(tt)} style={{flex:1,padding:"0.4rem 0",
                background:type===tt?"rgba(200,160,255,0.12)":"transparent",
                border:`1px solid ${type===tt?"rgba(200,160,255,0.5)":"rgba(255,255,255,0.12)"}`,
                color:type===tt?PURPLE:"rgba(255,255,255,0.5)",borderRadius:8,
                fontFamily:"'Cinzel',serif",fontSize:"0.67rem",letterSpacing:"0.1em",
                cursor:"pointer",transition:"all 0.2s"}}>{tt}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.8rem",
            fontSize:"0.82rem",color:"rgba(255,255,255,0.55)"}}>
            <span>Duration</span>
            <Adj onClick={()=>setDur(d=>Math.max(1,d-1))} label="−"/>
            <span style={{minWidth:36,textAlign:"center"}}>{dur} min</span>
            <Adj onClick={()=>setDur(d=>Math.min(60,d+1))} label="+"/>
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)}
            placeholder="How do you feel? What did you notice?" rows={3}
            style={{width:"100%",background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,color:"#e8e0d0",
              padding:"0.7rem",fontSize:"0.9rem",lineHeight:1.75,resize:"vertical",
              outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box"}}/>
          <button onClick={log} style={{width:"100%",marginTop:"0.75rem",padding:"0.6rem",
            background:"rgba(200,160,255,0.1)",border:"1px solid rgba(200,160,255,0.4)",
            borderRadius:10,color:PURPLE,fontFamily:"'Cinzel',serif",fontSize:"0.75rem",
            letterSpacing:"0.12em",cursor:"pointer"}}>Log Session</button>
        </div>
      )}

      <p style={{fontSize:"0.67rem",letterSpacing:"0.18em",textTransform:"uppercase",
        color:"rgba(255,255,255,0.3)",marginBottom:"0.9rem"}}>Recent Sessions</p>
      {sessions.length===0
        ?<p style={{textAlign:"center",fontSize:"0.95rem",color:"rgba(255,255,255,0.25)",marginTop:"1.5rem"}}>No sessions yet. Start practicing.</p>
        :[...sessions].reverse().map(s=>(
          <div key={s.id} style={{background:"rgba(255,255,255,0.025)",
            border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,
            padding:"1rem 1.15rem",marginBottom:"0.65rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.2rem"}}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:"1.05rem",color:"#f0ead8",
                textShadow:GOLD_SOFT}}>{fmtDur(s.durationSec)}</span>
              <span style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.35)"}}>
                {new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
            </div>
            <div style={{display:"flex",gap:"0.75rem"}}>
              {s.hz&&<span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>{s.hz} Hz</span>}
              <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.4)"}}>{s.method||s.type}</span>
            </div>
            {s.note&&<p style={{fontSize:"0.88rem",color:"rgba(232,224,208,0.6)",margin:"0.4rem 0 0",lineHeight:1.7}}>{s.note}</p>}
          </div>
        ))
      }
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [sessions,setSessions]=useState([]);
  useEffect(() => {
  const saved = localStorage.getItem("caduceus_sessions");

  if (saved) {
    setSessions(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "caduceus_sessions",
    JSON.stringify(sessions)
  );
}, [sessions]);
  const handleLog=s=>setSessions(p=>[...p,{...s,id:s.id||Date.now(),date:s.date||new Date().toISOString()}]);
  const navigate=pg=>setPage(pg);

  const methodConfig=METHOD_CONFIGS.find(m=>m.id===page);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500&family=Cinzel+Decorative:wght@400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes breathe{0%,100%{transform:scale(1);opacity:0.12}50%{transform:scale(1.07);opacity:0.28}}
        input[type=range]{-webkit-appearance:none;height:3px;border-radius:3px;outline:none;
          background:linear-gradient(to right,${PINK},rgba(255,255,255,0.12));}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;
          border-radius:50%;background:${PINK};cursor:pointer;box-shadow:0 0 10px rgba(244,143,177,0.7);}
        textarea::placeholder{color:rgba(232,224,208,0.3);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:2px;}
        button{font-family:'Cinzel',serif;}
      `}</style>
      <div style={{background:BG,minHeight:"100vh",color:"#f0ead8",fontFamily:"'Cinzel',serif"}}>
        <Nav page={page} setPage={setPage}/>
        {page==="home"       &&<Home navigate={navigate}/>}
        {methodConfig        &&<MethodRoom config={methodConfig} navigate={navigate} onSessionLog={handleLog}/>}
        {page==="practice"   &&<Practice onSessionLog={handleLog}/>}
        {page==="heartbrain" &&<HeartBrain onSessionLog={handleLog}/>}
        {page==="tracker"    &&<Tracker sessions={sessions} onLog={handleLog}/>}
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            opacity: 0.7,
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
        >
          The Caduceus Method is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment.
        </div>
      </div>
    </>
  );
}
