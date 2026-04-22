import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React from "react";

const SUPA_URL = "https://kqpynncftodfulfjdgqv.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHlubmNmdG9kZnVsZmpkZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzAzMjUsImV4cCI6MjA5MjAwNjMyNX0.6ZlI5HpmRU4aBbUMvCG1qMy4zxCmHuChRgD4ba2CVYA";
const db = createClient(SUPA_URL, SUPA_KEY);
const LOGO_URL = "/logo.png";

const C = {
  sidebar:"#1A3A8F", nav1:"#142E72", nav2:"#0F2255",
  sky:"#0EA5E9", skyM:"#38BDF8", skyL:"#BAE6FD", skyLL:"#E0F2FE",
  magenta:"#D4148C", lime:"#28A745",
  bg:"#F0F9FF", white:"#FFFFFF", border:"#C7DCF7",
  text:"#0A1F5C", muted:"#1A3A8F", light:"#4A6DB5",
  success:"#059669", successL:"#ECFDF5",
  danger:"#DC2626", dangerL:"#FEF2F2",
  warn:"#D97706", warnL:"#FFFBEB",
  orange:"#EA580C",
};
const ROLE_COLOR = {directeur:C.nav2,superviseur:"#7C3AED",comptable:C.warn,delegue:C.sky};
const ROLE_LABEL = {directeur:"Directeur Commercial",superviseur:"Superviseur",comptable:"Comptable",delegue:"Délégué(e) Commercial(e)"};
const CHART_COLS = ["#0EA5E9","#28A745","#D97706","#DC2626","#7C3AED","#0891B2","#D4148C"];
const PLAINT_LEVELS = ["Normal","Moyen","Haute","Critique"];
const PLAINT_TYPES = ["Client difficile","Rupture de stock","Problème de livraison","Incident sur le terrain","Problème de paiement","Concurrence agressive","Autre"];
const URGENCE_COLOR = {Normal:C.success,Moyen:C.warn,Haute:C.orange,Critique:C.danger};

const PRODUITS = [
  {code:"Glu",item:"Glucomètre",prix:25},{code:"GluEx",item:"Glucomètre Ex",prix:25},
  {code:"TMPt",item:"Tensiomètre portable",prix:50},{code:"TMGd",item:"Tensiomètre grand brassard",prix:50},
  {code:"B30",item:"Bandelette 30 pcs",prix:10},{code:"B50",item:"Bandelette 50 pcs",prix:15},
  {code:"B60",item:"Bandelette 60 pcs",prix:20},{code:"B60Ex",item:"Bandelette 60 pcs Ex",prix:20},
  {code:"B120",item:"Bandelette 120 pcs",prix:36},{code:"B120x",item:"Bandelette 120 pcs X",prix:36},
  {code:"TDR HepB",item:"Test rapide Hépatite B",prix:20},{code:"TDR Typh",item:"Test rapide Typhoïde",prix:20},
  {code:"TDR Syph",item:"Test rapide Syphilis",prix:20},{code:"TDR Chla",item:"Test rapide Chlamydia",prix:25},
  {code:"TDR HP",item:"Test rapide Helicobacter Pylori",prix:18},
  {code:"HbA1C",item:"Analyseur HbA1C",prix:2000},{code:"HbA1C Rx",item:"Réactif HbA1C",prix:100},
  {code:"GtExam",item:"Gants d'examen nitrile",prix:3.5},{code:"Gtst",item:"Gants chirurgicaux stériles",prix:10.5},
  {code:"Cot50g",item:"Coton absorbant 50g",prix:3.04},{code:"Cot100g",item:"Coton absorbant 100g",prix:7.2},
  {code:"Cot250g",item:"Coton absorbant 250g",prix:2.72},{code:"Cot500g",item:"Coton absorbant 500g",prix:9.576},
  {code:"SyrU100",item:"Seringue insuline U-100",prix:6.0},{code:"SyrU40",item:"Seringue insuline U-40",prix:6.3},
  {code:"Syr2cc",item:"Seringue 2 ml",prix:2.5},{code:"Syr5cc",item:"Seringue 5 ml",prix:2.6},
  {code:"Syr10cc",item:"Seringue 10 ml",prix:4.0},
  {code:"Cat18",item:"Cathéter IV 18",prix:4.25},{code:"Cat20",item:"Cathéter IV 20",prix:4.25},
  {code:"Cat22",item:"Cathéter IV 22",prix:4.85},{code:"Cat24",item:"Cathéter IV 24",prix:5.1},
  {code:"EpiG21",item:"Epicrânien G21",prix:2.76},{code:"EpiG23",item:"Epicrânien G23",prix:2.76},
  {code:"PheUr",item:"Poche urine 2000 ml",prix:0.236},
  {code:"Snd16",item:"Sonde urinaire 16",prix:6.38},{code:"Snd18",item:"Sonde urinaire 18",prix:6.38},
  {code:"Snd22",item:"Sonde urinaire 22",prix:6.38},{code:"Snd24",item:"Sonde urinaire 24",prix:6.38},
  {code:"Snd26",item:"Sonde urinaire 26",prix:6.38},
  {code:"TssPerf",item:"Trousse de perfusion",prix:3.075},{code:"MskOx",item:"Masque à oxygène",prix:28.25},
];

const fmt = n => new Intl.NumberFormat("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0);
const todayISO = () => new Date().toISOString().split("T")[0];
const todayFR = () => new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const nowTS = () => new Date().toISOString();
const initials = u => u?((u.prenom||"?")[0]+(u.nom||"?")[0]).toUpperCase():"??";
const newRow = () => ({id:Date.now()+Math.random(),code:"",item:"",qte:1,prix:0,montant:0,client:"",adresse:"",tel:"",lat:"",lng:""});
const isMobileW = () => window.innerWidth < 768;

const loadReports = () => {try{return JSON.parse(localStorage.getItem("lp5_reports")||"[]");}catch{return[];}};
const saveReports = r => localStorage.setItem("lp5_reports",JSON.stringify(r));
const loadObjectifs = () => {try{return JSON.parse(localStorage.getItem("lp5_objectifs")||"{}");}catch{return{};}};
const saveObjectifs = o => localStorage.setItem("lp5_objectifs",JSON.stringify(o));
const saveDraft = d => {try{sessionStorage.setItem("lp5_draft",JSON.stringify(d));}catch{}};
const loadDraft = () => {try{return JSON.parse(sessionStorage.getItem("lp5_draft")||"null");}catch{return null;}};
const clearDraft = () => {try{sessionStorage.removeItem("lp5_draft");}catch{}};

const loadSheetJS = () => new Promise(resolve => {
  if(window.XLSX){resolve(window.XLSX);return;}
  const s=document.createElement("script");
  s.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  s.onload=()=>resolve(window.XLSX);
  document.head.appendChild(s);
});

const exportExcel = async (rapport) => {
  const XLSX = await loadSheetJS();
  const ws_data = [
    ["RAPPORT DES VENTES JOURNALIÈRES — LabPro Pharma, RDC Sarl"],[],
    ["Délégué(e) :",rapport.prenom+" "+rapport.nom,"","N° Agent :",rapport.num||"—","","Date :",rapport.date],
    ["Secteurs visités :",rapport.secteurs],[],
    ["N°","CODE","DÉSIGNATION","QTÉ","MONTANT (USD)","NOM CLIENT","ADRESSE","TÉLÉPHONE","GPS LAT","GPS LNG"],
    ...rapport.lignes.map((l,i)=>[i+1,l.code,l.item,l.qte,l.montant,l.client,l.adresse||"",l.tel||"",l.lat||"",l.lng||""]),
    [],
    ["","","","TOTAL CA (USD):",rapport.totalCA,rapport.nbClients+" client(s)","","","",""],
    [],
    ["Signature électronique:",rapport.signature?"Signée numériquement":"Non signée","","","Soumis le:",new Date(rapport.soumis||nowTS()).toLocaleString("fr-FR")],
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws["!merges"]=[{s:{r:0,c:0},e:{r:0,c:9}}];
  ws["!cols"]=[{wch:5},{wch:12},{wch:32},{wch:6},{wch:14},{wch:26},{wch:22},{wch:14},{wch:12},{wch:12}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Rapport");
  XLSX.writeFile(wb,`LabPro_${rapport.nom}_${rapport.date}.xlsx`);
};

const exportExcelCompil = async (reports,titre) => {
  const XLSX = await loadSheetJS();
  const rows = [
    [`COMPILATION — ${titre} — LabPro Pharma, RDC Sarl`],[],
    ["N°","DÉLÉGUÉ(E)","DATE","VENTES","CLIENTS","CA TOTAL (USD)"],
    ...reports.map(r=>[r.num||"—",`${r.prenom} ${r.nom}`,r.date,r.lignes?.length||0,r.nbClients||0,r.totalCA||0]),
    [],["","TOTAL GÉNÉRAL","",reports.reduce((s,r)=>s+(r.lignes?.length||0),0),reports.reduce((s,r)=>s+(r.nbClients||0),0),reports.reduce((s,r)=>s+(r.totalCA||0),0)],
  ];
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"]=[{wch:5},{wch:28},{wch:12},{wch:8},{wch:8},{wch:16}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Compilation");
  XLSX.writeFile(wb,`LabPro_Compil_${titre.replace(/[ /]/g,"_")}.xlsx`);
};

const getProfile = async uid => {const{data}=await db.from("profiles").select("*").eq("id",uid).single();return data;};
const getAllProfiles = async () => {const{data}=await db.from("profiles").select("*").eq("actif",true).order("nom");return data||[];};
const saveGPSPoint = async (p,pt) => {await db.from("gps_points").insert({delegue_id:p.id,nom:p.nom,prenom:p.prenom,num:p.num,lat:pt.lat,lng:pt.lng,accuracy:pt.accuracy,session_date:todayISO(),created_at:nowTS()});};
const loadGPSToday = async () => {const{data}=await db.from("gps_points").select("*").eq("session_date",todayISO()).order("created_at",{ascending:true});return data||[];};
const savePlainte = async (p,pl) => {
  const{data,error}=await db.from("plaintes").insert({delegue_id:p.id,nom:p.nom,prenom:p.prenom,num:p.num,type_plainte:pl.type,description:pl.description,urgence:pl.urgence,lat:pl.lat||null,lng:pl.lng||null,photo_base64:pl.photo||null,statut:"nouveau",created_at:nowTS(),session_date:todayISO()}).select().single();
  return{data,error};
};
const loadPlaintes = async () => {const{data}=await db.from("plaintes").select("*").order("created_at",{ascending:false});return data||[];};
const updatePlainteStatut = async (id,statut) => {await db.from("plaintes").update({statut}).eq("id",id);};

function StatCard({icon,label,value,sub,color,progress,progressMax}) {
  const pct=progress&&progressMax?Math.min(100,Math.round((progress/progressMax)*100)):null;
  return (
    <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"16px 18px",position:"relative",overflow:"hidden",transition:"box-shadow 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(14,165,233,0.15)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{position:"absolute",top:0,left:0,width:5,height:"100%",background:color||C.sky,borderRadius:"14px 0 0 14px"}}/>
      <div style={{marginLeft:10}}>
        <span style={{fontSize:22}}>{icon}</span>
        <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-0.5,marginTop:5,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,marginTop:4}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C.light,marginTop:2,fontWeight:600}}>{sub}</div>}
        {pct!==null&&<div style={{marginTop:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:C.muted,fontWeight:700}}>Objectif</span><span style={{fontSize:10,fontWeight:800,color:pct>=100?C.success:C.sky}}>{pct}%</span></div><div style={{background:C.skyLL,borderRadius:999,height:6}}><div style={{background:pct>=100?C.success:C.sky,borderRadius:999,height:6,width:`${pct}%`,transition:"width 0.5s"}}/></div></div>}
      </div>
    </div>
  );
}

function Badge({children,color="sky",size="sm"}) {
  const m={sky:{bg:C.skyLL,c:C.nav1},green:{bg:C.successL,c:C.success},warn:{bg:C.warnL,c:C.warn},red:{bg:C.dangerL,c:C.danger},navy:{bg:"#EEF2FF",c:C.nav2},purple:{bg:"#F5F3FF",c:"#7C3AED"},orange:{bg:"#FFF7ED",c:C.orange}};
  const s=m[color]||m.sky;
  return <span style={{background:s.bg,color:s.c,fontSize:size==="xs"?9:11,fontWeight:800,padding:size==="xs"?"2px 6px":"3px 10px",borderRadius:999,whiteSpace:"nowrap"}}>{children}</span>;
}

function Btn({children,onClick,disabled,variant="primary",icon,sm,full,type="button"}) {
  const vs={primary:{bg:disabled?"#93C5FD":C.sky,cl:"#FFF",br:"none",sh:disabled?"none":"0 2px 10px rgba(14,165,233,0.3)"},navy:{bg:C.nav1,cl:"#FFF",br:"none",sh:"0 2px 8px rgba(20,46,114,0.3)"},secondary:{bg:C.white,cl:C.muted,br:`1.5px solid ${C.border}`,sh:"none"},danger:{bg:C.dangerL,cl:C.danger,br:"1px solid #FCA5A5",sh:"none"},success:{bg:C.successL,cl:C.success,br:"1px solid #A7F3D0",sh:"none"},warn:{bg:C.warnL,cl:C.warn,br:"1px solid #FCD34D",sh:"none"}};
  const s=vs[variant]||vs.primary;
  return <button type={type} onClick={onClick} disabled={disabled} style={{background:s.bg,color:s.cl,border:s.br,borderRadius:9,padding:sm?"6px 12px":"10px 18px",fontSize:sm?11:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.15s",whiteSpace:"nowrap",boxShadow:s.sh,width:full?"100%":undefined,justifyContent:full?"center":undefined}}>{icon&&<span style={{fontSize:sm?12:14}}>{icon}</span>}{children}</button>;
}

function Card({children,p="18px",style={}}) {
  return <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:p,...style}}>{children}</div>;
}

function PageTitle({title,sub,action}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}><div><h1 style={{fontSize:18,fontWeight:800,color:C.text,margin:"0 0 2px",letterSpacing:-0.3}}>{title}</h1>{sub&&<p style={{color:C.muted,fontSize:12,margin:0,fontWeight:600}}>{sub}</p>}</div>{action}</div>;
}

function FL({children,required}) {
  return <label style={{display:"block",fontSize:11,fontWeight:800,color:C.text,marginBottom:5,textTransform:"uppercase",letterSpacing:0.6}}>{children}{required&&" *"}</label>;
}

function FInput({label,value,onChange,type="text",placeholder,required,readOnly,mb=14}) {
  const [foc,setFoc]=useState(false);
  return <div style={{marginBottom:mb}}>{label&&<FL required={required}>{label}</FL>}<input value={value} onChange={onChange} type={type} placeholder={placeholder} readOnly={readOnly} style={{width:"100%",border:`1.5px solid ${foc?C.sky:C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:readOnly?C.bg:"#FAFEFF",color:C.text,transition:"border 0.15s"}} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}/></div>;
}

function FSelect({label,value,onChange,children,required,mb=14}) {
  return <div style={{marginBottom:mb}}>{label&&<FL required={required}>{label}</FL>}<select value={value} onChange={onChange} style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text,cursor:"pointer"}}>{children}</select></div>;
}

function SignaturePad({onSave,onCancel,nom}) {
  const canvasRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [hasSig,setHasSig]=useState(false);
  const getPos=(e,c)=>{const r=c.getBoundingClientRect();const s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*(c.width/r.width),y:(s.clientY-r.top)*(c.height/r.height)};};
  const startDraw=e=>{e.preventDefault();const c=canvasRef.current;const p=getPos(e,c);c.getContext("2d").beginPath();c.getContext("2d").moveTo(p.x,p.y);setDrawing(true);};
  const draw=e=>{if(!drawing)return;e.preventDefault();const c=canvasRef.current;const p=getPos(e,c);const ctx=c.getContext("2d");ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle=C.nav1;ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);setHasSig(true);};
  const endDraw=e=>{e.preventDefault();setDrawing(false);};
  const clear=()=>{const c=canvasRef.current;c.getContext("2d").clearRect(0,0,c.width,c.height);setHasSig(false);};
  const save=()=>{if(!hasSig){alert("Veuillez signer avant de confirmer.");return;}onSave(canvasRef.current.toDataURL("image/png"));};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,31,92,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <Card style={{maxWidth:500,width:"100%",boxShadow:"0 24px 60px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img src={LOGO_URL} alt="Logo" style={{width:40,height:40,objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
          <div><div style={{fontSize:14,fontWeight:800,color:C.text}}>Signature électronique</div><div style={{fontSize:12,color:C.muted,fontWeight:600}}>{nom} — {new Date().toLocaleDateString("fr-FR")}</div></div>
        </div>
        <div style={{background:C.skyLL,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.nav1,fontWeight:700,marginBottom:14}}>En signant, je certifie que les informations de ce rapport sont exactes.</div>
        <div style={{border:`2px solid ${C.nav1}`,borderRadius:10,background:"#FAFEFF",marginBottom:12,cursor:"crosshair",touchAction:"none"}}>
          <canvas ref={canvasRef} width={460} height={150} style={{width:"100%",height:130,display:"block",borderRadius:8}} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:11,color:C.light,fontStyle:"italic",fontWeight:600}}>Signez dans le cadre</span><Btn onClick={clear} variant="secondary" sm icon="🗑">Effacer</Btn></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Btn onClick={save} icon="✅" variant="navy" full>Confirmer et soumettre</Btn><Btn onClick={onCancel} variant="secondary">Annuler</Btn></div>
      </Card>
    </div>
  );
}

function AuthPage({onLogin}) {
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);const [showPw,setShowPw]=useState(false);
  const handleLogin=async e=>{e?.preventDefault();setErr("");setLoading(true);const{data,error}=await db.auth.signInWithPassword({email:email.trim(),password:pw});if(error){setErr("Email ou mot de passe incorrect.");setLoading(false);return;}const profile=await getProfile(data.user.id);if(!profile){setErr("Compte non configuré.");setLoading(false);return;}if(!profile.actif){setErr("Compte désactivé.");setLoading(false);return;}onLogin({...profile,authId:data.user.id});setLoading(false);};
  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.nav2} 0%,${C.nav1} 40%,${C.sky} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={LOGO_URL} alt="Logo" style={{width:110,height:110,objectFit:"contain",marginBottom:10,filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.3))"}} onError={e=>e.target.style.display="none"}/>
          <h1 style={{color:"#FFF",fontSize:20,fontWeight:800,margin:"0 0 4px"}}>LabPro Pharma, RDC Sarl</h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,margin:0,fontWeight:600}}>Système de Rapport des Ventes Journalières</p>
        </div>
        <Card style={{boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}}>
          <h2 style={{fontSize:16,fontWeight:800,color:C.text,textAlign:"center",margin:"0 0 20px"}}>🔑 Connexion</h2>
          <form onSubmit={handleLogin}>
            <FInput label="Email professionnel" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="prenom.nom@labpropharma.cd" required/>
            <div style={{marginBottom:16}}>
              <FL required>Mot de passe</FL>
              <div style={{position:"relative"}}>
                <input value={pw} onChange={e=>setPw(e.target.value)} type={showPw?"text":"password"} placeholder="••••••••••" style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 42px 10px 13px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text}}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",fontSize:16,color:C.light}}>{showPw?"🙈":"👁"}</button>
              </div>
            </div>
            {err&&<div style={{background:C.dangerL,border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:13,fontWeight:700,color:C.danger,marginBottom:14}}>⚠️ {err}</div>}
            <Btn type="submit" disabled={loading} full onClick={handleLogin}>{loading?"⏳ Connexion...":"Se connecter →"}</Btn>
          </form>
          <p style={{textAlign:"center",fontSize:12,color:C.light,marginTop:14,fontWeight:600}}>Identifiants fournis par le Directeur Commercial.</p>
        </Card>
        <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:12}}>LabPro Pharma RDC · Sales System v5.0 · 2025</p>
      </div>
    </div>
  );
}

const NAV = {
  delegue:[{id:"rapport",icon:"📝",lbl:"Nouveau rapport"},{id:"historique",icon:"📋",lbl:"Mes rapports"},{id:"objectif",icon:"🎯",lbl:"Mon objectif"},{id:"gps",icon:"📍",lbl:"Mon GPS terrain"},{id:"plainte",icon:"⚠️",lbl:"Signaler un problème"}],
  superviseur:[{id:"localisation",icon:"🗺️",lbl:"Localisation terrain"},{id:"plaintes",icon:"⚠️",lbl:"Signalements"}],
  directeur:[{id:"dashboard",icon:"📊",lbl:"Tableau de bord"},{id:"rapports",icon:"📋",lbl:"Tous les rapports"},{id:"hebdo",icon:"📅",lbl:"Rapport hebdomadaire"},{id:"mensuel",icon:"🗓",lbl:"Rapport mensuel"},{id:"classement",icon:"🏆",lbl:"Classement"},{id:"objectifs_dir",icon:"🎯",lbl:"Objectifs délégués"},{id:"localisation",icon:"🗺️",lbl:"Localisation terrain"},{id:"plaintes",icon:"⚠️",lbl:"Signalements"},{id:"users",icon:"👥",lbl:"Utilisateurs"}],
  comptable:[{id:"dashboard_c",icon:"📊",lbl:"Tableau de bord"},{id:"rapports_c",icon:"📋",lbl:"Rapports reçus"}],
};

function Sidebar({user,view,setView,onLogout,mobile,open,onClose}) {
  const items=NAV[user.role]||NAV.delegue;
  return (
    <>
    {mobile&&open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:199}}/>}
    <div style={{width:mobile?280:238,background:C.nav1,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:200,boxShadow:"4px 0 24px rgba(0,0,0,0.25)",transform:mobile&&!open?"translateX(-100%)":"translateX(0)",transition:"transform 0.25s ease"}}>
      <div style={{padding:"16px 14px 12px",borderBottom:"1px solid rgba(255,255,255,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO_URL} alt="Logo" style={{width:42,height:42,objectFit:"contain",flexShrink:0,borderRadius:8,background:"rgba(255,255,255,0.95)",padding:3}} onError={e=>e.target.style.display="none"}/>
          <div style={{flex:1}}><div style={{color:"#FFF",fontSize:13,fontWeight:800,lineHeight:1.2}}>LabPro Pharma</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>RDC Sarl · Sales v5</div></div>
          {mobile&&<button onClick={onClose} style={{border:"none",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:20,padding:4}}>✕</button>}
        </div>
      </div>
      <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:ROLE_COLOR[user.role],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#FFF",flexShrink:0}}>{initials(user)}</div>
          <div style={{flex:1,minWidth:0}}><div style={{color:"#FFF",fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.prenom} {(user.nom||"").split(" ")[0]}</div><div style={{fontSize:9,padding:"1px 6px",borderRadius:999,background:ROLE_COLOR[user.role],color:"#FFF",display:"inline-block",marginTop:3,fontWeight:700,textTransform:"uppercase"}}>{user.role}</div></div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
        {items.map(item=>{const active=view===item.id;return <div key={item.id} onClick={()=>{setView(item.id);if(mobile)onClose();}} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,marginBottom:2,cursor:"pointer",background:active?"rgba(14,165,233,0.22)":"transparent",borderLeft:active?"3px solid #38BDF8":"3px solid transparent",color:active?"#BAE6FD":"rgba(255,255,255,0.7)",fontSize:13,fontWeight:active?700:500,transition:"all 0.12s"}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.07)";}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}><span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span><span>{item.lbl}</span></div>;})}
      </nav>
      <div style={{padding:"8px 6px 16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div onClick={onLogout} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,cursor:"pointer",color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:500,transition:"all 0.12s"}} onMouseEnter={e=>{e.currentTarget.style.color="#FCA5A5";e.currentTarget.style.background="rgba(220,38,38,0.1)";}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.45)";e.currentTarget.style.background="transparent";}}><span>🚪</span><span>Déconnexion</span></div>
      </div>
    </div>
    </>
  );
}

function MobileHeader({user,view,onMenuOpen}) {
  const items=NAV[user.role]||NAV.delegue;
  const current=items.find(i=>i.id===view)||items[0];
  return <div style={{position:"sticky",top:0,zIndex:100,background:C.nav1,padding:"11px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 2px 12px rgba(0,0,0,0.25)"}}><button onClick={onMenuOpen} style={{border:"none",background:"rgba(255,255,255,0.1)",borderRadius:8,width:36,height:36,cursor:"pointer",color:"#FFF",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>☰</button><img src={LOGO_URL} alt="Logo" style={{width:28,height:28,objectFit:"contain",borderRadius:4,background:"rgba(255,255,255,0.95)",padding:2,flexShrink:0}} onError={e=>e.target.style.display="none"}/><div style={{flex:1,minWidth:0}}><div style={{color:"#FFF",fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{current.icon} {current.lbl}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:10,fontWeight:600}}>{user.prenom} {user.nom}</div></div></div>;
}

function NouveauRapport({user}) {
  const draft=loadDraft();
  const [date,setDate]=useState(draft?.date||todayISO());
  const [secteurs,setSecteurs]=useState(draft?.secteurs||"");
  const [lignes,setLignes]=useState(draft?.lignes||[newRow()]);
  const [showSig,setShowSig]=useState(false);
  const [done,setDone]=useState(false);
  const [saving,setSaving]=useState(false);
  const [gpsId,setGpsId]=useState(null);
  const pendingRpt=useRef(null);

  useEffect(()=>{saveDraft({date,secteurs,lignes});},[date,secteurs,lignes]);

  const totalCA=lignes.reduce((s,l)=>s+(l.montant||0),0);
  const nbClients=lignes.filter(l=>l.client.trim()).length;

  const updRow=(id,f,v)=>setLignes(prev=>prev.map(r=>{
    if(r.id!==id)return r;
    const u={...r,[f]:v};
    if(f==="code"){const p=PRODUITS.find(p=>p.code===v);if(p){u.item=p.item;u.prix=p.prix;u.montant=p.prix*(u.qte||1);}}
    if(f==="qte"||f==="prix")u.montant=(parseFloat(u.prix)||0)*(parseFloat(u.qte)||0);
    return u;
  }));

  const captureGPS=id=>{setGpsId(id);if(!navigator.geolocation){alert("GPS non disponible.");setGpsId(null);return;}navigator.geolocation.getCurrentPosition(p=>{updRow(id,"lat",p.coords.latitude.toFixed(6));updRow(id,"lng",p.coords.longitude.toFixed(6));setGpsId(null);},()=>{alert("GPS impossible. Activez les permissions.");setGpsId(null);});};

  const handleSubmit=()=>{
    if(!secteurs.trim()){alert("⚠️ Indiquez les secteurs visités.");return;}
    const valid=lignes.filter(l=>l.code&&l.client);
    if(!valid.length){alert("⚠️ Au moins une vente avec produit et client.");return;}
    pendingRpt.current={id:Date.now().toString(),delegueId:user.id,num:user.num,nom:user.nom,prenom:user.prenom,date,secteurs,lignes:valid,totalCA,nbClients,soumis:nowTS()};
    setShowSig(true);
  };

  const handleSignatureSave=async sigData=>{
    setShowSig(false);setSaving(true);
    const rpt={...pendingRpt.current,signature:sigData};
    const all=loadReports();all.push(rpt);saveReports(all);
    await exportExcel(rpt);
    clearDraft();setSaving(false);setDone(true);
  };

  if(done)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh"}}><Card style={{textAlign:"center",maxWidth:480,padding:40}}><img src={LOGO_URL} alt="Logo" style={{width:60,height:60,objectFit:"contain",marginBottom:10}} onError={e=>e.target.style.display="none"}/><div style={{fontSize:48,marginBottom:10}}>✅</div><h2 style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:10}}>Rapport soumis avec succès !</h2><div style={{background:C.skyLL,borderRadius:12,padding:"12px 16px",marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>{[[lignes.filter(l=>l.code).length,"Ventes"],[nbClients,"Clients"],["$"+fmt(totalCA),"CA Total"]].map(([v,l])=>(<div key={l}><div style={{fontSize:18,fontWeight:800,color:C.sky}}>{v}</div><div style={{fontSize:11,color:C.muted,fontWeight:700}}>{l}</div></div>))}</div><p style={{color:C.muted,fontSize:13,marginBottom:18,fontWeight:600}}>📊 Fichier .xlsx téléchargé · ✍️ Rapport signé</p><Btn onClick={()=>{setDone(false);setLignes([newRow()]);setSecteurs("");setDate(todayISO());}} icon="📝" full>Nouveau rapport</Btn></Card></div>);

  const inp2={border:`1.5px solid ${C.border}`,borderRadius:7,padding:"7px 9px",fontSize:12,fontWeight:600,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box",background:"#FAFEFF",color:C.text};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {showSig&&<SignaturePad onSave={handleSignatureSave} onCancel={()=>setShowSig(false)} nom={`${user.prenom} ${user.nom}`}/>}
      <div style={{background:`linear-gradient(135deg,${C.nav2} 0%,${C.nav1} 55%,${C.sky} 100%)`,borderRadius:16,padding:"18px 22px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={LOGO_URL} alt="Logo" style={{width:44,height:44,objectFit:"contain",borderRadius:8,background:"rgba(255,255,255,0.92)",padding:3,flexShrink:0}} onError={e=>e.target.style.display="none"}/>
            <div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Rapport des Ventes Journalières</div>
              <h1 style={{color:"#FFF",fontSize:16,fontWeight:800,margin:"0 0 2px"}}>LabPro Pharma, RDC Sarl</h1>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:11,margin:0,fontWeight:600}}>{user.genre==="F"?"Déléguée":"Délégué"} N°{user.num||"—"} · {user.prenom} {user.nom}</p>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:10,fontWeight:700,marginBottom:3}}>Date du rapport</div>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"6px 10px",fontSize:13,fontWeight:700,background:"rgba(255,255,255,0.15)",color:"#FFF",outline:"none",cursor:"pointer"}}/>
          </div>
        </div>
      </div>

      <Card style={{marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,alignItems:"end"}}>
          <div><FL>Agent</FL><div style={{fontSize:13,fontWeight:700,color:C.text,background:C.bg,borderRadius:8,padding:"9px 12px",border:`1.5px solid ${C.border}`}}>N°{user.num||"—"} · {user.prenom} {user.nom}</div></div>
          <div><FL required>Secteurs / Zones visités</FL><input value={secteurs} onChange={e=>setSecteurs(e.target.value)} placeholder="Ex : Gombe, Lingwala, Barumbu..." style={{...inp2,padding:"9px 12px",fontSize:13}}/></div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:14}}>
        <StatCard icon="📦" label="Lignes de vente" value={lignes.filter(l=>l.code).length} color={C.sky}/>
        <StatCard icon="👥" label="Clients visités" value={nbClients} color={C.success}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.warn}/>
      </div>

      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"11px 14px",background:C.nav1,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <h3 style={{color:"#FFF",fontSize:14,fontWeight:800,margin:0}}>📊 Tableau des Ventes</h3>
          <Btn onClick={()=>setLignes(p=>[...p,newRow()])} icon="➕" sm>Ajouter une ligne</Btn>
        </div>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:960}}>
            <thead><tr style={{background:C.skyLL}}>{["#","CODE","DÉSIGNATION","QTÉ","MONTANT USD","NOM CLIENT","ADRESSE","TÉLÉPHONE","GPS",""].map((c,i)=><th key={i} style={{padding:"8px 7px",fontSize:10,fontWeight:800,color:C.text,textAlign:"left",borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
            <tbody>
              {lignes.map((row,idx)=>(
                <tr key={row.id} style={{borderBottom:`1px solid ${C.skyLL}`}} onMouseEnter={e=>e.currentTarget.style.background="#F0F9FF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"6px 7px",textAlign:"center",color:C.light,fontSize:11,fontWeight:700,width:26}}>{idx+1}</td>
                  <td style={{padding:"6px 5px",minWidth:105}}><select value={row.code} onChange={e=>updRow(row.id,"code",e.target.value)} style={{...inp2,cursor:"pointer",minWidth:100}}><option value="">-- Code --</option>{PRODUITS.map(p=><option key={p.code} value={p.code}>{p.code} · ${p.prix}</option>)}</select></td>
                  <td style={{padding:"6px 5px",minWidth:175}}><input value={row.item} readOnly style={{...inp2,background:C.bg,color:C.muted,cursor:"default",minWidth:165}}/></td>
                  <td style={{padding:"6px 5px",width:62}}><input type="number" min="1" value={row.qte} onChange={e=>updRow(row.id,"qte",parseFloat(e.target.value)||1)} style={{...inp2,width:55,textAlign:"center"}}/></td>
                  <td style={{padding:"6px 5px",width:110}}><div style={{fontSize:13,fontWeight:800,color:row.montant>0?C.success:C.light,background:row.montant>0?C.successL:C.bg,borderRadius:7,padding:"5px 8px",textAlign:"right"}}>{row.montant>0?`${fmt(row.montant)}$`:"—"}</div></td>
                  <td style={{padding:"6px 5px",minWidth:135}}><input value={row.client} onChange={e=>updRow(row.id,"client",e.target.value)} placeholder="Nom client *" style={inp2}/></td>
                  <td style={{padding:"6px 5px",minWidth:120}}><input value={row.adresse} onChange={e=>updRow(row.id,"adresse",e.target.value)} placeholder="Adresse" style={inp2}/></td>
                  <td style={{padding:"6px 5px",minWidth:110}}><input value={row.tel} onChange={e=>updRow(row.id,"tel",e.target.value)} placeholder="+243..." style={inp2}/></td>
                  <td style={{padding:"6px 5px",minWidth:105}}>{row.lat?<div style={{fontSize:10,color:C.success,fontWeight:700,lineHeight:1.5}}>📍{row.lat}<br/>{row.lng}</div>:<Btn onClick={()=>captureGPS(row.id)} variant="secondary" icon="📍" sm>{gpsId===row.id?"GPS...":"Capturer"}</Btn>}</td>
                  <td style={{padding:"6px 5px",width:30}}>{lignes.length>1&&<button onClick={()=>setLignes(p=>p.filter(r=>r.id!==row.id))} style={{background:C.dangerL,border:"none",color:C.danger,borderRadius:6,width:25,height:25,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}><td colSpan={4} style={{padding:"10px 8px",fontSize:13,fontWeight:800,color:C.text}}>TOTAL CA JOURNALIER</td><td style={{padding:"10px 8px",fontSize:16,fontWeight:800,color:C.success}}>{fmt(totalCA)} USD</td><td colSpan={5} style={{padding:"10px 8px",fontSize:11,color:C.muted,fontWeight:600}}>{nbClients} client(s) · {lignes.filter(l=>l.code).length} vente(s)</td></tr></tfoot>
          </table>
        </div>
      </div>
      <div style={{background:C.skyLL,border:`1.5px solid ${C.skyL}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.nav1,fontWeight:700}}>✍️ Une signature électronique sera requise avant la soumission finale.{(secteurs||lignes.some(l=>l.code))&&<span style={{marginLeft:8,color:C.success}}>• Brouillon sauvegardé</span>}</div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10,flexWrap:"wrap",paddingBottom:20}}>
        <Btn onClick={()=>{setLignes([newRow()]);setSecteurs("");clearDraft();}} variant="secondary" icon="🔄">Réinitialiser</Btn>
        <Btn onClick={handleSubmit} disabled={saving} icon={saving?"⏳":"✍️"} variant="navy">{saving?"Envoi...":"Signer et soumettre"}</Btn>
      </div>
    </div>
  );
}


function MonObjectif({user}) {
  const all=loadReports().filter(r=>r.delegueId===user.id);
  const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const key=`${user.id}_${year}_${month}`;
  const obj=parseFloat(loadObjectifs()[key])||0;
  const moisR=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===month&&d.getFullYear()===year;});
  const ca=moisR.reduce((s,r)=>s+(r.totalCA||0),0);
  const pct=obj>0?Math.min(100,Math.round((ca/obj)*100)):0;
  const monthLabel=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🎯 Mon Objectif Mensuel" sub={`${monthLabel} · ${user.prenom} ${user.nom}`}/>
      {obj===0?(
        <Card style={{textAlign:"center",padding:48}}><div style={{fontSize:48,marginBottom:12}}>🎯</div><h3 style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:8}}>Aucun objectif défini ce mois</h3><p style={{color:C.muted,fontSize:13,fontWeight:600}}>Le Directeur Commercial définira votre objectif mensuel prochainement.</p></Card>
      ):(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
            <StatCard icon="🎯" label="Objectif mensuel" value={`$${fmt(obj)}`} color={C.nav1}/>
            <StatCard icon="💰" label="CA réalisé" value={`$${fmt(ca)}`} color={C.success}/>
            <StatCard icon="⏳" label="Reste à atteindre" value={`$${fmt(Math.max(0,obj-ca))}`} color={ca>=obj?C.success:C.warn}/>
            <StatCard icon="📊" label="Progression" value={`${pct}%`} color={pct>=100?C.success:C.sky}/>
          </div>
          <Card style={{marginBottom:16}}>
            <h3 style={{fontSize:14,fontWeight:800,color:C.text,margin:"0 0 14px"}}>Progression vers l'objectif</h3>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:700,color:C.muted}}>$0</span>
              <span style={{fontSize:14,fontWeight:800,color:pct>=100?C.success:C.sky}}>{pct}%</span>
              <span style={{fontSize:13,fontWeight:700,color:C.muted}}>${fmt(obj)}</span>
            </div>
            <div style={{background:C.skyLL,borderRadius:999,height:20,overflow:"hidden",border:`1.5px solid ${C.border}`}}>
              <div style={{background:pct>=100?`linear-gradient(90deg,${C.success},#10B981)`:pct>=75?`linear-gradient(90deg,${C.warn},${C.sky})`:`linear-gradient(90deg,${C.sky},${C.nav1})`,height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 0.8s",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
                {pct>15&&<span style={{color:"#FFF",fontSize:11,fontWeight:800}}>{pct}%</span>}
              </div>
            </div>
            {pct>=100&&<div style={{marginTop:12,background:C.successL,border:"1.5px solid #A7F3D0",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:800,color:C.success,textAlign:"center"}}>🏆 Objectif atteint ! Félicitations {user.prenom} !</div>}
          </Card>
          <Card>
            <h3 style={{fontSize:14,fontWeight:800,color:C.text,margin:"0 0 12px"}}>📋 Rapports ce mois ({moisR.length})</h3>
            {!moisR.length?<div style={{textAlign:"center",padding:"20px",color:C.muted,fontWeight:600}}>Aucun rapport ce mois.</div>:
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
              <thead><tr style={{background:C.skyLL}}>{["Date","Secteurs","Ventes","CA"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
              <tbody>{moisR.sort((a,b)=>b.date.localeCompare(a.date)).map(r=>(<tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}}><td style={{padding:"8px 12px",fontSize:12,fontWeight:700,color:C.text}}>{r.date}</td><td style={{padding:"8px 12px",fontSize:11,color:C.muted,fontWeight:600,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td><td style={{padding:"8px 12px"}}><Badge size="xs">{r.lignes?.length||0}</Badge></td><td style={{padding:"8px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.totalCA)}$</td></tr>))}</tbody>
            </table></div>}
          </Card>
        </div>
      )}
    </div>
  );
}

function ObjectifsDirecteur() {
  const [profiles,setProfiles]=useState([]);
  const [objectifs,setObjectifs]=useState(loadObjectifs());
  const [saved,setSaved]=useState(false);
  const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const monthLabel=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
  useEffect(()=>{getAllProfiles().then(p=>setProfiles(p.filter(u=>u.role==="delegue")));},[]);
  const setObj=(uid,val)=>{const key=`${uid}_${year}_${month}`;setObjectifs(prev=>({...prev,[key]:val}));};
  const getObj=uid=>{const key=`${uid}_${year}_${month}`;return objectifs[key]||"";};
  const getCA=uid=>loadReports().filter(r=>{const d=new Date(r.date);return r.delegueId===uid&&d.getMonth()===month&&d.getFullYear()===year;}).reduce((s,r)=>s+(r.totalCA||0),0);
  const saveAll=()=>{saveObjectifs(objectifs);setSaved(true);setTimeout(()=>setSaved(false),3000);};
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🎯 Objectifs des Délégués" sub={`Objectifs mensuels — ${monthLabel}`} action={<Btn onClick={saveAll} icon="💾" variant="navy">Enregistrer</Btn>}/>
      {saved&&<div style={{background:C.successL,border:"1.5px solid #A7F3D0",borderRadius:10,padding:"11px 16px",fontSize:13,fontWeight:700,color:C.success,marginBottom:14}}>✅ Objectifs enregistrés et visibles par les délégués.</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {profiles.map(u=>{const ca=getCA(u.id);const obj=parseFloat(getObj(u.id))||0;const pct=obj>0?Math.min(100,Math.round((ca/obj)*100)):0;return(<Card key={u.id}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:36,height:36,borderRadius:"50%",background:C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:12,fontWeight:800,flexShrink:0}}>{initials(u)}</div><div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{u.prenom} {u.nom}</div><div style={{fontSize:10,color:C.muted,fontWeight:700}}>N°{u.num||"—"}</div></div></div><FInput label="Objectif CA mensuel (USD)" value={getObj(u.id)} onChange={e=>setObj(u.id,e.target.value)} type="number" placeholder="Ex: 5000" mb={10}/><div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:5}}><span style={{color:C.muted}}>CA réalisé : <strong style={{color:C.success}}>${fmt(ca)}</strong></span><span style={{fontWeight:800,color:pct>=100?C.success:C.sky}}>{pct}%</span></div><div style={{background:C.skyLL,borderRadius:999,height:8,border:`1px solid ${C.border}`}}><div style={{background:pct>=100?C.success:C.sky,borderRadius:999,height:"100%",width:`${pct}%`,transition:"width 0.5s"}}/></div></Card>);})}
        {!profiles.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:48,color:C.muted,fontWeight:600}}>⏳ Chargement des délégués...</div>}
      </div>
    </div>
  );
}

function HistoriqueDelegue({user}) {
  const all=loadReports().filter(r=>r.delegueId===user.id).sort((a,b)=>b.date.localeCompare(a.date));
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Mes Rapports soumis" sub={`${user.prenom} ${user.nom}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="📄" label="Total rapports" value={all.length} color={C.sky}/>
        <StatCard icon="🛍" label="Total ventes" value={all.reduce((s,r)=>s+(r.lignes?.length||0),0)} color={C.success}/>
        <StatCard icon="💰" label="CA cumulé" value={`$${fmt(all.reduce((s,r)=>s+(r.totalCA||0),0))}`} color={C.warn}/>
      </div>
      {!all.length?<Card style={{textAlign:"center",padding:48,color:C.muted,fontWeight:600}}>Aucun rapport soumis pour l'instant.</Card>:
      <Card p="0" style={{overflow:"hidden"}}><div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
        <thead><tr style={{background:C.skyLL}}>{["Date","Secteurs","Ventes","Clients","CA (USD)","Sig.","Actions"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>)}</tr></thead>
        <tbody>{all.map(r=>(<tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 12px",fontSize:12,fontWeight:800,color:C.text}}>{r.date}</td><td style={{padding:"10px 12px",fontSize:11,color:C.muted,fontWeight:600,maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td><td style={{padding:"10px 12px"}}><Badge size="xs">{r.lignes?.length||0}</Badge></td><td style={{padding:"10px 12px"}}><Badge color="green" size="xs">{r.nbClients}</Badge></td><td style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.totalCA)} $</td><td style={{padding:"10px 12px"}}>{r.signature?<Badge color="green" size="xs">✓ Signé</Badge>:<Badge color="warn" size="xs">—</Badge>}</td><td style={{padding:"10px 12px"}}><Btn onClick={()=>exportExcel(r)} variant="success" icon="⬇" sm>xlsx</Btn></td></tr>))}</tbody>
      </table></div></Card>}
    </div>
  );
}

function GPSTerrain({user}) {
  const [tracking,setTracking]=useState(false);const [trail,setTrail]=useState([]);const [status,setStatus]=useState("");const [seconds,setSeconds]=useState(0);
  const watchId=useRef(null);const timer=useRef(null);
  useEffect(()=>()=>{if(watchId.current)navigator.geolocation?.clearWatch(watchId.current);if(timer.current)clearInterval(timer.current);},[]);
  const start=()=>{if(!navigator.geolocation){setStatus("⚠️ GPS non disponible.");return;}setStatus("⏳ Acquisition GPS...");const t0=Date.now();timer.current=setInterval(()=>setSeconds(Math.floor((Date.now()-t0)/1000)),1000);watchId.current=navigator.geolocation.watchPosition(p=>{const pt={lat:p.coords.latitude,lng:p.coords.longitude,accuracy:Math.round(p.coords.accuracy),ts:nowTS()};setTrail(prev=>[...prev,pt]);setStatus(`✅ Signal actif · ±${pt.accuracy}m`);saveGPSPoint(user,pt);},err=>setStatus(`❌ ${err.message}`),{enableHighAccuracy:true,timeout:15000,maximumAge:0});setTracking(true);};
  const stop=()=>{if(watchId.current){navigator.geolocation.clearWatch(watchId.current);watchId.current=null;}if(timer.current){clearInterval(timer.current);timer.current=null;}setTracking(false);setStatus(`✅ Session terminée · ${trail.length} point(s)`);};
  const fmtDur=s=>`${Math.floor(s/60)}min ${s%60}s`;const last=trail[trail.length-1];
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📍 Mon GPS Terrain" sub="Visible en temps réel par le Superviseur et le Directeur"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:48,height:48,borderRadius:12,background:tracking?C.successL:C.skyLL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{tracking?"🟢":"⚪"}</div><div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{tracking?"Tracking ACTIF":"Tracking INACTIF"}</div><div style={{fontSize:12,color:C.muted,fontWeight:600}}>{tracking?`Durée : ${fmtDur(seconds)}`:"Appuyez pour démarrer"}</div></div></div>
            {status&&<div style={{background:C.skyLL,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,fontWeight:700,color:C.nav1,marginBottom:14}}>{status}</div>}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {!tracking?<Btn onClick={start} icon="▶️" full>Démarrer le suivi GPS</Btn>:<Btn onClick={stop} variant="danger" icon="⏹" full>Arrêter le suivi</Btn>}
            </div>
            {trail.length>0&&!tracking&&<div style={{marginTop:8}}><Btn onClick={()=>{setTrail([]);setSeconds(0);}} variant="secondary" icon="🗑" full>Effacer les données</Btn></div>}
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["📍","Points GPS",trail.length],["⏱","Durée",fmtDur(seconds)],["🎯","Précision",last?`±${last.accuracy}m`:"—"],["📅","Date",todayISO()]].map(([ic,l,v])=>(<div key={l} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:20}}>{ic}</div><div style={{fontSize:16,fontWeight:800,color:C.sky,marginTop:4}}>{v}</div><div style={{fontSize:11,color:C.muted,fontWeight:700,marginTop:2}}>{l}</div></div>))}
          </div>
        </div>
        <Card>
          <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>🗺️ Points enregistrés ({trail.length})</h3>
          {!trail.length?<div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,flexDirection:"column",gap:8}}><div style={{fontSize:36}}>📍</div><div style={{fontSize:13,fontWeight:700}}>Démarrez pour voir les points</div></div>:<div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>{[...trail].reverse().map((pt,i)=>(<div key={i} style={{padding:"8px 12px",background:i===0?C.skyLL:C.bg,borderRadius:8,border:`1.5px solid ${C.border}`}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>📍 {pt.lat}, {pt.lng}</div><div style={{fontSize:10,color:C.muted,fontWeight:600}}>±{pt.accuracy}m · {new Date(pt.ts).toLocaleTimeString("fr-FR")}</div></div>))}</div>}
          {last&&<a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:12,textAlign:"center",background:C.skyLL,color:C.nav1,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"9px",fontSize:12,fontWeight:800,textDecoration:"none"}}>🗺️ Voir ma position sur Google Maps</a>}
        </Card>
      </div>
    </div>
  );
}

function PlainteForm({user}) {
  const [form,setForm]=useState({type:PLAINT_TYPES[0],description:"",urgence:"Normal"});
  const [loc,setLoc]=useState({lat:"",lng:""});
  const [photo,setPhoto]=useState(null);
  const [saving,setSaving]=useState(false);
  const [done,setDone]=useState(false);
  const [gpsL,setGpsL]=useState(false);
  const photoRef=useRef(null);

  const capturePos=()=>{
    setGpsL(true);
    navigator.geolocation?.getCurrentPosition(
      p=>{setLoc({lat:p.coords.latitude.toFixed(6),lng:p.coords.longitude.toFixed(6)});setGpsL(false);},
      ()=>setGpsL(false)
    );
  };

  const handlePhoto=e=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>5*1024*1024){alert("Photo trop lourde (max 5MB).");return;}
    const reader=new FileReader();
    reader.onload=ev=>setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit=async()=>{
    if(!form.description.trim()){alert("⚠️ Décrivez le problème.");return;}
    setSaving(true);
    const{error}=await savePlainte(user,{...form,...loc,photo});
    setSaving(false);
    if(error){alert("Erreur lors de l'envoi. Réessayez.");return;}
    setDone(true);
  };

  if(done)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh"}}>
      <Card style={{textAlign:"center",maxWidth:420,padding:40}}>
        <div style={{fontSize:52,marginBottom:12}}>📨</div>
        <h2 style={{fontSize:17,fontWeight:800,color:C.text,marginBottom:10}}>Signalement envoyé !</h2>
        <p style={{color:C.muted,fontSize:13,fontWeight:600,marginBottom:18}}>Transmis au Superviseur et au Directeur Commercial.</p>
        <Btn onClick={()=>{setDone(false);setForm({type:PLAINT_TYPES[0],description:"",urgence:"Normal"});setLoc({lat:"",lng:""});setPhoto(null);}} icon="➕" full>Nouveau signalement</Btn>
      </Card>
    </div>
  );

  const urgColor2={
    Normal:{bg:C.successL,c:C.success,icon:"🟢"},
    Moyen:{bg:C.warnL,c:C.warn,icon:"🟡"},
    Haute:{bg:"#FFF7ED",c:C.orange,icon:"🟠"},
    Critique:{bg:C.dangerL,c:C.danger,icon:"🔴"}
  };

  return (
    <div style={{animation:"fadeIn 0.3s ease",maxWidth:680}}>
      <PageTitle title="⚠️ Signaler un problème" sub="Transmis au Superviseur et au Directeur Commercial"/>
      <Card>
        <FSelect label="Type de problème" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
          {PLAINT_TYPES.map(t=><option key={t}>{t}</option>)}
        </FSelect>

        <div style={{marginBottom:14}}>
          <FL>Niveau d'urgence</FL>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {PLAINT_LEVELS.map(v=>{
              const uc=urgColor2[v]||urgColor2.Normal;
              const active=form.urgence===v;
              return (
                <div key={v} onClick={()=>setForm(f=>({...f,urgence:v}))}
                  style={{textAlign:"center",padding:"10px 6px",borderRadius:9,cursor:"pointer",border:`2px solid ${active?uc.c:C.border}`,background:active?uc.bg:C.white,fontSize:12,fontWeight:active?800:600,color:active?uc.c:C.muted,transition:"all 0.15s"}}>
                  <div style={{fontSize:18,marginBottom:3}}>{uc.icon}</div>{v}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <FL required>Description du problème</FL>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            placeholder="Décrivez le problème en détail : quoi, où, avec qui, quand..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text,height:110,resize:"vertical"}}/>
        </div>

        {/* UPLOAD PHOTO */}
        <div style={{marginBottom:14}}>
          <FL>Photo / Document (optionnel)</FL>
          <input type="file" ref={photoRef} accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          {!photo?(
            <div onClick={()=>photoRef.current?.click()}
              style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:C.bg,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.sky;e.currentTarget.style.background=C.skyLL;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}>
              <div style={{fontSize:32,marginBottom:6}}>📸</div>
              <div style={{fontSize:13,fontWeight:700,color:C.muted}}>Cliquez pour téléverser une photo</div>
              <div style={{fontSize:11,color:C.light,marginTop:3,fontWeight:600}}>JPG, PNG, WEBP · Max 5 MB</div>
            </div>
          ):(
            <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:`1.5px solid ${C.border}`}}>
              <img src={photo} alt="Photo signalement" style={{width:"100%",maxHeight:200,objectFit:"contain",display:"block",background:C.bg}}/>
              <button onClick={()=>setPhoto(null)} style={{position:"absolute",top:8,right:8,background:C.danger,border:"none",color:"#FFF",borderRadius:999,width:28,height:28,cursor:"pointer",fontSize:14,fontWeight:700}}>✕</button>
              <div style={{padding:"6px 10px",background:C.successL,fontSize:11,fontWeight:700,color:C.success}}>✅ Photo ajoutée</div>
            </div>
          )}
        </div>

        <div style={{marginBottom:18}}>
          <FL>Position GPS (optionnel)</FL>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            {loc.lat
              ?<div style={{flex:1,background:C.successL,border:"1px solid #A7F3D0",borderRadius:9,padding:"9px 12px",fontSize:12,fontWeight:700,color:C.success}}>📍 {loc.lat}, {loc.lng}</div>
              :<Btn onClick={capturePos} variant="secondary" icon="📍">{gpsL?"Acquisition...":"Capturer ma position"}</Btn>
            }
            {loc.lat&&<Btn onClick={()=>setLoc({lat:"",lng:""})} variant="danger" sm icon="✕">Effacer</Btn>}
          </div>
        </div>

        <Btn onClick={submit} disabled={saving} icon={saving?"⏳":"📤"} full variant="navy">
          {saving?"Envoi en cours...":"Envoyer le signalement"}
        </Btn>
      </Card>
    </div>
  );
}

// ════════════ LOCALISATION CARTE ════════════
function LocalisationMap() {
  const [points,setPoints]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selId,setSelId]=useState(null);
  const mapRef=useRef(null);
  const mapInstRef=useRef(null);
  const timerRef=useRef(null);

  const loadData=useCallback(async()=>{
    const data=await loadGPSToday();
    setPoints(data);setLoading(false);
  },[]);

  useEffect(()=>{
    loadData();
    timerRef.current=setInterval(loadData,15000);
    return()=>clearInterval(timerRef.current);
  },[loadData]);

  const buildMap=useCallback((pts)=>{
    if(!mapRef.current)return;
    const initMap=()=>{
      if(mapInstRef.current){mapInstRef.current.remove();mapInstRef.current=null;}
      const L=window.L;
      const map=L.map(mapRef.current).setView([-4.3217,15.3222],12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      const byDel={};
      pts.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={info:p,pts:[]};byDel[p.delegue_id].pts.push([p.lat,p.lng]);});
      Object.values(byDel).forEach((d,i)=>{
        const col=CHART_COLS[i%CHART_COLS.length];
        if(d.pts.length>1)L.polyline(d.pts,{color:col,weight:3.5,opacity:0.85}).addTo(map);
        if(d.pts.length>0){
          L.circleMarker(d.pts[0],{radius:5,color:col,fillColor:"#FFF",fillOpacity:1,weight:2}).addTo(map);
          L.circleMarker(d.pts[d.pts.length-1],{radius:9,color:col,fillColor:col,fillOpacity:1}).addTo(map)
            .bindPopup(`<b>${d.info.prenom} ${d.info.nom}</b><br>N°${d.info.num||"—"}<br><small>Dernier point : ${new Date(d.info.created_at).toLocaleTimeString("fr-FR")}</small>`);
        }
      });
      if(pts.length>0)map.fitBounds(pts.map(p=>[p.lat,p.lng]),{padding:[30,30]});
      mapInstRef.current=map;
    };
    if(window.L){initMap();return;}
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}
    if(!document.getElementById("lf-js")){const s=document.createElement("script");s.id="lf-js";s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=initMap;document.head.appendChild(s);}
    else setTimeout(()=>{if(window.L)initMap();},500);
  },[]);

  useEffect(()=>{if(points.length>0&&mapRef.current)buildMap(points);},[points,buildMap]);

  const byDel={};
  points.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={id:p.delegue_id,nom:p.nom,prenom:p.prenom,num:p.num,pts:[]};byDel[p.delegue_id].pts.push(p);});
  const delList=Object.values(byDel);

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🗺️ Localisation en temps réel"
        sub="Actualisation automatique toutes les 15 secondes"
        action={<div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:11,fontWeight:800,color:C.success,background:C.successL,padding:"4px 10px",borderRadius:999,border:`1px solid #A7F3D0`}}>● LIVE</div>
          <Btn onClick={loadData} variant="secondary" icon="🔄" sm>Actualiser</Btn>
        </div>}/>

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14}}>
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:0.6,marginBottom:10}}>
              Délégués actifs — {delList.length}
            </div>
            {loading&&<div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:13,fontWeight:600}}>⏳ Chargement...</div>}
            {!loading&&!delList.length&&(
              <div style={{textAlign:"center",color:C.muted,padding:"20px 0"}}>
                <div style={{fontSize:30,marginBottom:6}}>📍</div>
                <div style={{fontSize:12,fontWeight:700}}>Aucun délégué actif aujourd'hui</div>
              </div>
            )}
            {delList.map((d,i)=>{
              const last=d.pts[d.pts.length-1];
              return (
                <div key={d.id} onClick={()=>setSelId(selId===d.id?null:d.id)}
                  style={{padding:"10px 12px",borderRadius:9,marginBottom:6,cursor:"pointer",border:`2px solid ${selId===d.id?CHART_COLS[i%CHART_COLS.length]:C.border}`,background:selId===d.id?C.skyLL:C.bg,transition:"all 0.12s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:CHART_COLS[i%CHART_COLS.length],flexShrink:0,boxShadow:`0 0 0 3px ${CHART_COLS[i%CHART_COLS.length]}33`}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:800,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.prenom} {d.nom}</div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600}}>N°{d.num||"—"} · {d.pts.length} point(s)</div>
                    </div>
                  </div>
                  {selId===d.id&&last&&(
                    <div style={{marginTop:8,fontSize:10,color:C.muted,lineHeight:1.8,background:C.white,borderRadius:6,padding:"7px 10px",border:`1px solid ${C.border}`}}>
                      <div style={{fontWeight:800,color:C.text}}>📍 {last.lat}, {last.lng}</div>
                      <div style={{fontWeight:600}}>🕐 {new Date(last.created_at).toLocaleTimeString("fr-FR")}</div>
                      <div style={{fontWeight:600}}>🎯 ±{last.accuracy}m précision</div>
                      <a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer"
                        style={{display:"block",marginTop:5,color:C.sky,fontWeight:800,textDecoration:"none",fontSize:11}}>
                        📌 Ouvrir dans Google Maps →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
          <Card>
            <div style={{fontSize:11,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>Légende des trajectoires</div>
            {delList.map((d,i)=>(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{width:20,height:3,background:CHART_COLS[i%CHART_COLS.length],borderRadius:2,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.muted,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.prenom} {d.nom}</span>
              </div>
            ))}
          </Card>
        </div>
        <div ref={mapRef} style={{height:"calc(100vh - 200px)",minHeight:440,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.bg,position:"relative",overflow:"hidden"}}>
          {!points.length&&!loading&&(
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:C.muted}}>
              <div style={{fontSize:48}}>🗺️</div>
              <div style={{fontSize:15,fontWeight:800,color:C.text}}>Aucune donnée GPS aujourd'hui</div>
              <div style={{fontSize:12,fontWeight:600,color:C.muted}}>Les délégués doivent activer leur GPS terrain</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════ PLAINTES VIEW ════════════
function PlaintesView() {
  const [plaintes,setPlaintes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [photoModal,setPhotoModal]=useState(null);

  useEffect(()=>{loadPlaintes().then(d=>{setPlaintes(d);setLoading(false);});},[]);

  const update=async(id,statut)=>{
    await updatePlainteStatut(id,statut);
    setPlaintes(prev=>prev.map(p=>p.id===id?{...p,statut}:p));
  };

  const filtered=filter==="all"?plaintes:plaintes.filter(p=>p.statut===filter);
  const statColor={nouveau:{bg:C.dangerL,c:C.danger},en_cours:{bg:C.warnL,c:C.warn},traite:{bg:C.successL,c:C.success}};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {photoModal&&(
        <div onClick={()=>setPhotoModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,cursor:"zoom-out"}}>
          <img src={photoModal} alt="Photo signalement" style={{maxWidth:"95vw",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}}/>
        </div>
      )}
      <PageTitle title="⚠️ Signalements & Plaintes" sub={`${plaintes.length} signalement(s) au total`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="🔴" label="Nouveaux" value={plaintes.filter(p=>p.statut==="nouveau").length} color={C.danger}/>
        <StatCard icon="🟡" label="En cours" value={plaintes.filter(p=>p.statut==="en_cours").length} color={C.warn}/>
        <StatCard icon="✅" label="Traités" value={plaintes.filter(p=>p.statut==="traite").length} color={C.success}/>
        <StatCard icon="🚨" label="Critiques" value={plaintes.filter(p=>p.urgence==="Critique").length} color={C.danger}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","Tous"],["nouveau","Nouveaux"],["en_cours","En cours"],["traite","Traités"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"7px 16px",borderRadius:999,border:`1.5px solid ${filter===v?C.sky:C.border}`,background:filter===v?C.sky:C.white,color:filter===v?"#FFF":C.muted,fontWeight:filter===v?800:600,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>
            {l}
          </button>
        ))}
      </div>
      {loading&&<div style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>⏳ Chargement...</div>}
      {!loading&&!filtered.length&&<Card style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>Aucun signalement trouvé.</Card>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(p=>{
          const uc=URGENCE_COLOR[p.urgence]||C.warn;
          const sc=statColor[p.statut]||statColor.nouveau;
          return (
            <Card key={p.id} style={{borderLeft:`5px solid ${uc}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.text}}>{p.prenom} {p.nom}</div>
                    <Badge color="navy" size="xs">N°{p.num||"—"}</Badge>
                    <span style={{background:uc+"22",color:uc,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999,border:`1px solid ${uc}44`}}>
                      {(p.urgence||"").toUpperCase()}
                    </span>
                    <span style={{background:sc.bg,color:sc.c,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999}}>
                      {(p.statut||"").replace("_"," ")}
                    </span>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,color:C.nav1,marginBottom:5}}>📋 {p.type_plainte}</div>
                  <div style={{fontSize:13,color:C.text,lineHeight:1.7,fontWeight:600}}>{p.description}</div>
                  <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.light,fontWeight:700}}>🕐 {new Date(p.created_at).toLocaleString("fr-FR")}</span>
                    {p.lat&&p.lng&&(
                      <a href={`https://maps.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                        style={{fontSize:11,color:C.sky,fontWeight:800,textDecoration:"none"}}>📍 Voir position</a>
                    )}
                    {p.photo_base64&&(
                      <button onClick={()=>setPhotoModal(p.photo_base64)}
                        style={{fontSize:11,color:C.magenta,fontWeight:800,background:"none",border:"none",cursor:"pointer",padding:0}}>
                        📸 Voir photo
                      </button>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",flexShrink:0}}>
                  {p.statut!=="en_cours"&&<Btn onClick={()=>update(p.id,"en_cours")} variant="warn" icon="🔄" sm>En cours</Btn>}
                  {p.statut!=="traite"&&<Btn onClick={()=>update(p.id,"traite")} variant="success" icon="✅" sm>Traité</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ════════════ DASHBOARD ════════════
function Dashboard({user}) {
  const all=loadReports();
  const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const todayR=all.filter(r=>r.date===todayISO());
  const monthR=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===month&&d.getFullYear()===year;});
  const totalCA=all.reduce((s,r)=>s+(r.totalCA||0),0);
  const monthCA=monthR.reduce((s,r)=>s+(r.totalCA||0),0);

  const byDel={};
  all.forEach(r=>{const k=`${r.prenom} ${(r.nom||"").split(" ")[0]}`;byDel[k]=(byDel[k]||0)+(r.totalCA||0);});
  const barData=Object.entries(byDel).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,ca])=>({name,ca:parseFloat(ca.toFixed(2))}));
  const trendData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-6+i);
    const iso=d.toISOString().split("T")[0];
    const ca=all.filter(r=>r.date===iso).reduce((s,r)=>s+(r.totalCA||0),0);
    return{jour:d.toLocaleDateString("fr-FR",{weekday:"short"}),ca:parseFloat(ca.toFixed(2))};
  });
  const pCount={};
  all.forEach(r=>r.lignes?.forEach(l=>{pCount[l.code]=(pCount[l.code]||0)+(l.qte||0);}));
  const pieData=Object.entries(pCount).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <img src={LOGO_URL} alt="Logo" style={{width:44,height:44,objectFit:"contain",borderRadius:8,border:`1.5px solid ${C.border}`,padding:3}} onError={e=>e.target.style.display="none"}/>
        <div>
          <h1 style={{fontSize:18,fontWeight:800,color:C.text,margin:"0 0 2px"}}>Tableau de bord commercial</h1>
          <p style={{color:C.muted,fontSize:12,margin:0,fontWeight:700}}>LabPro Pharma RDC · {todayFR()} · {ROLE_LABEL[user.role]}</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="📊" label="Rapports aujourd'hui" value={todayR.length} color={C.sky}/>
        <StatCard icon="📅" label="Rapports ce mois" value={monthR.length} color={C.nav1}/>
        <StatCard icon="💰" label="CA mensuel (USD)" value={`$${fmt(monthCA)}`} color={C.success}/>
        <StatCard icon="🏆" label="CA global (USD)" value={`$${fmt(totalCA)}`} color={C.warn}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
        <Card>
          <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>📈 Évolution CA — 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/>
              <XAxis dataKey="jour" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/>
              <Line type="monotone" dataKey="ca" stroke={C.sky} strokeWidth={2.5} dot={{r:4,fill:C.sky}} activeDot={{r:7}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>🧪 Top produits vendus</h3>
          {pieData.length
            ?<ResponsiveContainer width="100%" height={180}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={80} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={CHART_COLS[i%CHART_COLS.length]}/>)}</Pie><Tooltip contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Legend wrapperStyle={{fontSize:10,fontWeight:700}}/></PieChart></ResponsiveContainer>
            :<div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13,fontWeight:700}}>Aucune donnée</div>
          }
        </Card>
      </div>
      <Card>
        <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>👥 CA par délégué (total)</h3>
        {barData.length
          ?<ResponsiveContainer width="100%" height={190}><BarChart data={barData} barSize={32}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Bar dataKey="ca" fill={C.sky} radius={[6,6,0,0]} label={{position:"top",fontSize:10,fill:C.muted,fontWeight:700,formatter:v=>v>0?`$${v}`:""}} /></BarChart></ResponsiveContainer>
          :<div style={{height:190,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13,fontWeight:700}}>Aucun rapport enregistré.</div>
        }
      </Card>
    </div>
  );
}

// ════════════ TOUS LES RAPPORTS ════════════
function TousLesRapports() {
  const [search,setSearch]=useState("");const [dateF,setDateF]=useState("");const [exp,setExp]=useState(null);
  const all=loadReports();
  const filtered=all.filter(r=>{
    const q=search.toLowerCase();
    return(!search||`${r.prenom} ${r.nom} ${r.secteurs}`.toLowerCase().includes(q)||r.lignes?.some(l=>l.client.toLowerCase().includes(q)))&&(!dateF||r.date===dateF);
  }).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Tous les rapports" sub={`${filtered.length} rapport(s)`}
        action={<Btn onClick={()=>exportExcelCompil(filtered,"Tous Rapports")} icon="⬇" variant="navy">Exporter .xlsx</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.light,fontSize:14}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher délégué, secteur, client..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px 9px 34px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text}}/>
        </div>
        <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)}
          style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,fontWeight:700,outline:"none",fontFamily:"inherit",background:"#FAFEFF",color:C.text}}/>
        {(search||dateF)&&<Btn onClick={()=>{setSearch("");setDateF("");}} variant="danger" sm icon="✕">Effacer</Btn>}
      </div>
      {!filtered.length?<Card style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>Aucun rapport trouvé.</Card>:
      <Card p="0" style={{overflow:"hidden"}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
            <thead><tr style={{background:C.skyLL}}>
              {["Délégué","N°","Date","Secteurs","Ventes","CA (USD)","Sig.","Actions"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(r=>(
                <React.Fragment key={r.id}>
                  <tr style={{borderBottom:`1px solid ${C.skyLL}`,cursor:"pointer"}}
                    onClick={()=>setExp(exp===r.id?null:r.id)}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(r)}</div>
                        <span style={{fontSize:12,fontWeight:800,color:C.text}}>{r.prenom} {r.nom}</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.num||"—"}</Badge></td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:C.muted,whiteSpace:"nowrap"}}>{r.date}</td>
                    <td style={{padding:"10px 12px",fontSize:11,color:C.muted,fontWeight:600,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
                    <td style={{padding:"10px 12px"}}><Badge size="xs">{r.lignes?.length||0}</Badge></td>
                    <td style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.totalCA)} $</td>
                    <td style={{padding:"10px 12px"}}>{r.signature?<Badge color="green" size="xs">✓</Badge>:<Badge color="warn" size="xs">—</Badge>}</td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <Btn onClick={e=>{e.stopPropagation();exportExcel(r);}} variant="success" icon="⬇" sm>xlsx</Btn>
                        <span style={{color:C.light,fontSize:13,fontWeight:700}}>{exp===r.id?"▲":"▼"}</span>
                      </div>
                    </td>
                  </tr>
                  {exp===r.id&&(
                    <tr key={r.id+"_e"}><td colSpan={8} style={{padding:0}}>
                      <div style={{background:"#F8FCFF",padding:"12px 14px",borderBottom:`2px solid ${C.border}`}}>
                        <div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:480}}>
                            <thead><tr>{["Code","Item","Qté","Montant","Client","Adresse","Tél","GPS"].map(h=>(
                              <th key={h} style={{padding:"6px 9px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`1px solid ${C.border}`,textTransform:"uppercase"}}>{h}</th>
                            ))}</tr></thead>
                            <tbody>{(r.lignes||[]).map((l,i)=>(
                              <tr key={i} style={{borderBottom:`1px solid ${C.skyLL}`}}>
                                <td style={{padding:"5px 9px",fontFamily:"monospace",fontWeight:800,color:C.nav1,fontSize:11}}>{l.code}</td>
                                <td style={{padding:"5px 9px",fontWeight:700}}>{l.item}</td>
                                <td style={{padding:"5px 9px",textAlign:"center",fontWeight:800}}>{l.qte}</td>
                                <td style={{padding:"5px 9px",fontWeight:800,color:C.success}}>{fmt(l.montant)}$</td>
                                <td style={{padding:"5px 9px",fontWeight:700}}>{l.client}</td>
                                <td style={{padding:"5px 9px",color:C.muted,fontWeight:600}}>{l.adresse}</td>
                                <td style={{padding:"5px 9px",color:C.muted,fontWeight:600}}>{l.tel}</td>
                                <td style={{padding:"5px 9px",fontSize:10,color:C.sky,fontWeight:700}}>{l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
                              </tr>
                            ))}</tbody>
                          </table>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>}
    </div>
  );
}

// ════════════ CLASSEMENT ════════════
function Classement() {
  const all=loadReports();const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const mR=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===month&&d.getFullYear()===year;});
  const objectifs=loadObjectifs();
  const stats={};
  mR.forEach(r=>{
    if(!stats[r.delegueId])stats[r.delegueId]={id:r.delegueId,num:r.num,nom:r.nom,prenom:r.prenom,ca:0,ventes:0,clients:0,jours:new Set()};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].jours.add(r.date);
  });
  const ranking=Object.values(stats).map(s=>({...s,jours:s.jours.size})).sort((a,b)=>b.ca-a.ca);
  const medals=["🥇","🥈","🥉"];
  const mColors=[C.warn,"#94A3B8","#CD7F32"];

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🏆 Classement des Délégués" sub={now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}/>
      {!ranking.length?<Card style={{textAlign:"center",padding:56,color:C.muted,fontWeight:700}}>Aucune donnée ce mois.</Card>:<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:12,marginBottom:18}}>
          {ranking.slice(0,3).map((d,i)=>{
            const objKey=`${d.id}_${year}_${month}`;
            const obj=parseFloat(objectifs[objKey])||0;
            const pct=obj>0?Math.min(100,Math.round((d.ca/obj)*100)):null;
            return (
              <Card key={i} style={{textAlign:"center",border:`2px solid ${mColors[i]||C.border}`,boxShadow:i===0?"0 8px 28px rgba(217,119,6,0.18)":"none"}}>
                <div style={{fontSize:38,marginBottom:6}}>{medals[i]}</div>
                <div style={{width:46,height:46,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#FFF",margin:"0 auto 8px"}}>{initials(d)}</div>
                <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 3px"}}>{d.prenom} {(d.nom||"").split(" ")[0]}</h3>
                <div style={{fontSize:19,fontWeight:800,color:mColors[i],margin:"4px 0 8px"}}>${fmt(d.ca)}</div>
                {pct!==null&&<div style={{marginBottom:8}}>
                  <div style={{background:C.skyLL,borderRadius:999,height:6,border:`1px solid ${C.border}`}}>
                    <div style={{background:pct>=100?C.success:C.sky,borderRadius:999,height:"100%",width:`${pct}%`}}/>
                  </div>
                  <div style={{fontSize:10,fontWeight:800,color:C.muted,marginTop:3}}>Objectif : {pct}%</div>
                </div>}
                <div style={{display:"flex",justifyContent:"center",gap:5,flexWrap:"wrap"}}>
                  <Badge color={i===0?"warn":"sky"} size="xs">{d.ventes} ventes</Badge>
                  <Badge color="green" size="xs">{d.clients} clients</Badge>
                </div>
              </Card>
            );
          })}
        </div>
        <Card p="0" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:800,margin:0}}>Classement complet</h3></div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
              <thead><tr style={{background:C.skyLL}}>
                {["Rang","N°","Délégué(e)","CA (USD)","Ventes","Clients","Jours","Objectif"].map(h=>(
                  <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{ranking.map((d,i)=>{
                const objKey=`${d.id}_${year}_${month}`;
                const obj=parseFloat(objectifs[objKey])||0;
                const pct=obj>0?Math.min(100,Math.round((d.ca/obj)*100)):null;
                return (
                  <tr key={d.id} style={{borderBottom:`1px solid ${C.skyLL}`,background:i===0?"#FFFBEB":"transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background=i===0?"#FEF3C7":C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background=i===0?"#FFFBEB":"transparent"}>
                    <td style={{padding:"11px 12px",fontSize:20}}>{medals[i]||`#${i+1}`}</td>
                    <td style={{padding:"11px 12px"}}><Badge color="navy" size="xs">{d.num||"—"}</Badge></td>
                    <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(d)}</div>
                      <div><div style={{fontSize:12,fontWeight:800,color:C.text}}>{d.prenom} {d.nom}</div></div>
                    </div></td>
                    <td style={{padding:"11px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(d.ca)} $</td>
                    <td style={{padding:"11px 12px"}}><Badge size="xs">{d.ventes}</Badge></td>
                    <td style={{padding:"11px 12px"}}><Badge color="green" size="xs">{d.clients}</Badge></td>
                    <td style={{padding:"11px 12px"}}><Badge color="navy" size="xs">{d.jours} j</Badge></td>
                    <td style={{padding:"11px 12px",minWidth:100}}>
                      {pct!==null?<div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{background:C.bg,borderRadius:4,height:6,flex:1,border:`1px solid ${C.border}`}}><div style={{background:pct>=100?C.success:C.sky,borderRadius:4,height:"100%",width:`${pct}%`}}/></div>
                        <span style={{fontSize:10,fontWeight:800,color:pct>=100?C.success:C.muted,minWidth:28}}>{pct}%</span>
                      </div>:<span style={{fontSize:10,color:C.light,fontWeight:700}}>Non défini</span>}
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
      </>}
    </div>
  );
}

// ════════════ COMPILATION ════════════
function Compilation({type}) {
  const all=loadReports();const now=new Date();
  let filtered,titre;
  if(type==="hebdo"){const ws=new Date();ws.setDate(ws.getDate()-7);filtered=all.filter(r=>new Date(r.date)>=ws);titre=`Semaine du ${ws.toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;}
  else{filtered=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});titre=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});}
  const stats={};
  filtered.forEach(r=>{
    if(!stats[r.delegueId])stats[r.delegueId]={id:r.delegueId,num:r.num,prenom:r.prenom,nom:r.nom,ca:0,ventes:0,clients:0,rapports:0};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].rapports++;
  });
  const rows=Object.values(stats).sort((a,b)=>b.ca-a.ca);
  const totalCA=rows.reduce((s,r)=>s+r.ca,0);
  const chartData=rows.map(r=>({name:r.prenom,ca:parseFloat(r.ca.toFixed(2)),ventes:r.ventes}));
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title={type==="hebdo"?"📅 Rapport Hebdomadaire":"🗓 Rapport Mensuel"} sub={titre}
        action={<Btn onClick={()=>exportExcelCompil(filtered,titre)} icon="⬇" variant="navy">Exporter .xlsx</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="📊" label="Rapports" value={filtered.length} color={C.sky}/>
        <StatCard icon="👥" label="Délégués actifs" value={rows.length} color={C.nav1}/>
        <StatCard icon="🛍" label="Total ventes" value={rows.reduce((s,r)=>s+r.ventes,0)} color={C.success}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.warn}/>
      </div>
      {chartData.length>0&&<Card style={{marginBottom:14}}>
        <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>📊 Performance comparée</h3>
        <ResponsiveContainer width="100%" height={190}><BarChart data={chartData} barSize={32}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><Tooltip formatter={(v,n)=>[n==="ca"?`$${fmt(v)}`:v,n==="ca"?"CA":"Ventes"]} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Legend wrapperStyle={{fontSize:11,fontWeight:700}}/><Bar dataKey="ca" name="CA (USD)" fill={C.sky} radius={[5,5,0,0]}/><Bar dataKey="ventes" name="Ventes" fill={C.success} radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
      </Card>}
      <Card p="0" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:800,margin:0}}>Récapitulatif</h3></div>
        {!rows.length?<div style={{padding:40,textAlign:"center",color:C.muted,fontWeight:700}}>Aucune donnée.</div>:
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
            <thead><tr style={{background:C.skyLL}}>{["Rang","N°","Délégué(e)","Rapports","Ventes","CA (USD)","Part (%)"].map(h=>(
              <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}</tr></thead>
            <tbody>{rows.map((r,i)=>{const pct=totalCA>0?Math.round((r.ca/totalCA)*100):0;return(
              <tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px",fontWeight:800,fontSize:18}}>{"🥇🥈🥉".split("")[i]||`#${i+1}`}</td>
                <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.num||"—"}</Badge></td>
                <td style={{padding:"10px 12px",fontSize:12,fontWeight:800,color:C.text}}>{r.prenom} {r.nom}</td>
                <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.rapports}</Badge></td>
                <td style={{padding:"10px 12px"}}><Badge size="xs">{r.ventes}</Badge></td>
                <td style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.ca)} $</td>
                <td style={{padding:"10px 12px",minWidth:100}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{background:C.bg,borderRadius:4,height:6,flex:1,border:`1px solid ${C.border}`}}><div style={{background:C.sky,borderRadius:4,height:"100%",width:`${pct}%`}}/></div>
                    <span style={{fontSize:10,fontWeight:800,color:C.muted,minWidth:26}}>{pct}%</span>
                  </div>
                </td>
              </tr>
            );})}
            </tbody>
            <tfoot><tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
              <td colSpan={5} style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.text}}>TOTAL GÉNÉRAL</td>
              <td style={{padding:"10px 12px",fontSize:14,fontWeight:800,color:C.success}}>{fmt(totalCA)} USD</td>
              <td style={{padding:"10px 12px",fontSize:11,fontWeight:800,color:C.muted}}>100%</td>
            </tr></tfoot>
          </table>
        </div>}
      </Card>
    </div>
  );
}

// ════════════ GESTION UTILISATEURS ════════════
function GestionUtilisateurs() {
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
  const [saving,setSaving]=useState(false);const [msg,setMsg]=useState({text:"",type:""});const [tab,setTab]=useState("liste");
  const load=async()=>{setLoading(true);const{data}=await db.from("profiles").select("*").order("nom");setUsers(data||[]);setLoading(false);};
  useEffect(()=>{load();},[]);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const showMsg=(text,type="success")=>{setMsg({text,type});setTimeout(()=>setMsg({text:"",type:""}),4000);};
  const createUser=async()=>{
    if(!form.email||!form.nom||!form.prenom||!form.password)return showMsg("Tous les champs obligatoires sont requis.","error");
    if(form.password.length<6)return showMsg("Mot de passe : au moins 6 caractères.","error");
    setSaving(true);
    const{data:authData,error:authErr}=await db.auth.signUp({email:form.email.trim().toLowerCase(),password:form.password,options:{data:{nom:form.nom,prenom:form.prenom}}});
    if(authErr){showMsg(`Erreur : ${authErr.message}`,"error");setSaving(false);return;}
    const{error:profErr}=await db.from("profiles").insert({id:authData.user.id,email:form.email.trim().toLowerCase(),nom:form.nom.trim().toUpperCase(),prenom:form.prenom.trim(),role:form.role,num:form.num.trim()||null,genre:form.genre,actif:true,created_at:nowTS()});
    if(profErr){showMsg(`Profil non créé : ${profErr.message}`,"error");setSaving(false);return;}
    showMsg(`✅ Compte créé pour ${form.prenom} ${form.nom}.`);
    setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
    await load();setSaving(false);
  };
  const toggleActif=async u=>{
    await db.from("profiles").update({actif:!u.actif}).eq("id",u.id);
    showMsg(`${u.prenom} ${u.nom} : ${!u.actif?"activé":"désactivé"}.`);
    await load();
  };
  const roleGroups={directeur:"Direction",superviseur:"Superviseur",comptable:"Comptable",delegue:"Délégués Commerciaux"};
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="👥 Gestion des Utilisateurs"/>
      {msg.text&&<div style={{background:msg.type==="error"?C.dangerL:C.successL,border:`1.5px solid ${msg.type==="error"?"#FCA5A5":"#A7F3D0"}`,borderRadius:10,padding:"11px 16px",fontSize:13,fontWeight:700,color:msg.type==="error"?C.danger:C.success,marginBottom:14}}>{msg.text}</div>}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["liste","📋 Liste"],["ajouter","➕ Ajouter"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 18px",borderRadius:999,border:`1.5px solid ${tab===id?C.sky:C.border}`,background:tab===id?C.sky:C.white,color:tab===id?"#FFF":C.muted,fontWeight:tab===id?800:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{lbl}</button>
        ))}
      </div>
      {tab==="liste"&&(
        <div>
          {loading?<div style={{textAlign:"center",padding:40,color:C.muted,fontWeight:700}}>⏳ Chargement...</div>:
          Object.entries(roleGroups).map(([role,title])=>{
            const group=users.filter(u=>u.role===role);
            if(!group.length)return null;
            return (
              <div key={role} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:ROLE_COLOR[role]}}/>
                  <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:0}}>{title} ({group.length})</h3>
                </div>
                <Card p="0" style={{overflow:"hidden"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{background:C.skyLL}}>
                      {["N°","Nom complet","Email","Statut","Actions"].map(h=>(
                        <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{group.map(u=>(
                      <tr key={u.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"9px 13px"}}><Badge color="navy" size="xs">{u.num||"—"}</Badge></td>
                        <td style={{padding:"9px 13px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:28,height:28,borderRadius:"50%",background:ROLE_COLOR[u.role],display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(u)}</div>
                            <div>
                              <div style={{fontSize:12,fontWeight:800,color:C.text}}>{u.prenom} {u.nom}</div>
                              <div style={{fontSize:10,color:C.light,fontWeight:700}}>{ROLE_LABEL[u.role]}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:"9px 13px",fontSize:12,color:C.muted,fontWeight:600}}>{u.email}</td>
                        <td style={{padding:"9px 13px"}}><Badge color={u.actif?"green":"red"} size="xs">{u.actif?"Actif":"Désactivé"}</Badge></td>
                        <td style={{padding:"9px 13px"}}><Btn onClick={()=>toggleActif(u)} variant={u.actif?"danger":"success"} sm icon={u.actif?"🔒":"🔓"}>{u.actif?"Désactiver":"Activer"}</Btn></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      {tab==="ajouter"&&(
        <Card style={{maxWidth:520}}>
          <h3 style={{fontSize:14,fontWeight:800,color:C.text,margin:"0 0 18px"}}>➕ Créer un nouveau compte</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <FInput label="Prénom" value={form.prenom} onChange={e=>setF("prenom",e.target.value)} placeholder="Ex: Jacques" required/>
            <FInput label="Nom" value={form.nom} onChange={e=>setF("nom",e.target.value)} placeholder="Ex: BOZITO" required/>
          </div>
          <FInput label="Email professionnel" value={form.email} onChange={e=>setF("email",e.target.value)} type="email" placeholder="prenom.nom@labpropharma.cd" required/>
          <FInput label="Mot de passe initial" value={form.password} onChange={e=>setF("password",e.target.value)} type="password" placeholder="Min. 6 caractères" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px"}}>
            <FSelect label="Rôle" value={form.role} onChange={e=>setF("role",e.target.value)} required>
              <option value="delegue">Délégué(e)</option>
              <option value="superviseur">Superviseur</option>
              <option value="comptable">Comptable</option>
              <option value="directeur">Directeur</option>
            </FSelect>
            <FInput label="N° Agent" value={form.num} onChange={e=>setF("num",e.target.value)} placeholder="Ex: 02"/>
            <FSelect label="Genre" value={form.genre} onChange={e=>setF("genre",e.target.value)}>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </FSelect>
          </div>
          <div style={{background:C.skyLL,borderRadius:9,padding:"10px 13px",fontSize:12,fontWeight:700,color:C.nav1,marginBottom:16}}>
            ℹ️ Un email de confirmation sera envoyé. L'utilisateur doit cliquer sur le lien pour activer son compte.
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={createUser} disabled={saving} icon={saving?"⏳":"✅"} variant="navy">{saving?"Création...":"Créer le compte"}</Btn>
            <Btn onClick={()=>setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""})} variant="secondary" icon="🔄">Effacer</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ════════════ APP ROOT ════════════
const defaultView=role=>role==="delegue"?"rapport":role==="comptable"?"dashboard_c":role==="superviseur"?"localisation":"dashboard";

export default function App() {
  const [user,   setUser]   = useState(null);
  const [view,   setView]   = useState("");
  const [booted, setBooted] = useState(false);
  const [isMob,  setIsMob]  = useState(isMobileW());
  const [sideOpen,setSideOpen] = useState(false);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter',system-ui,sans-serif;background:#F0F9FF;-webkit-font-smoothing:antialiased;}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#F0F9FF}
      ::-webkit-scrollbar-thumb{background:#BAE6FD;border-radius:3px}
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    `;
    document.head.appendChild(style);
    db.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){
        const p=await getProfile(session.user.id);
        if(p&&p.actif){setUser({...p,authId:session.user.id});setView(defaultView(p.role));}
        else await db.auth.signOut();
      }
      setBooted(true);
    });
    const{data:{subscription}}=db.auth.onAuthStateChange(async(ev)=>{
      if(ev==="SIGNED_OUT"){setUser(null);setView("");}
    });
    const onResize=()=>setIsMob(isMobileW());
    window.addEventListener("resize",onResize);
    return()=>{document.head.removeChild(style);subscription.unsubscribe();window.removeEventListener("resize",onResize);};
  },[]);

  const onLogin =u=>{setUser(u);setView(defaultView(u.role));};
  const onLogout=async()=>{await db.auth.signOut();setUser(null);setView("");};
  const onNav   =v=>{setView(v);setSideOpen(false);};

  if(!booted)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.nav2},${C.sky})`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <img src={LOGO_URL} alt="Logo" style={{width:100,height:100,objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))"}} onError={e=>e.target.style.display="none"}/>
      <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,fontWeight:700}}>Chargement de LabPro Sales v5...</div>
    </div>
  );

  if(!user)return <AuthPage onLogin={onLogin}/>;

  const renderView=()=>{
    switch(view){
      case "rapport":       return <NouveauRapport user={user}/>;
      case "historique":    return <HistoriqueDelegue user={user}/>;
      case "objectif":      return <MonObjectif user={user}/>;
      case "gps":           return <GPSTerrain user={user}/>;
      case "plainte":       return <PlainteForm user={user}/>;
      case "localisation":  return <LocalisationMap/>;
      case "plaintes":      return <PlaintesView/>;
      case "dashboard":
      case "dashboard_c":   return <Dashboard user={user}/>;
      case "rapports":
      case "rapports_c":    return <TousLesRapports/>;
      case "hebdo":         return <Compilation type="hebdo"/>;
      case "mensuel":       return <Compilation type="mensuel"/>;
      case "classement":    return <Classement/>;
      case "objectifs_dir": return user.role==="directeur"?<ObjectifsDirecteur/>:<Dashboard user={user}/>;
      case "users":         return user.role==="directeur"?<GestionUtilisateurs/>:<Dashboard user={user}/>;
      default:              return <Dashboard user={user}/>;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"inherit"}}>
      <Sidebar user={user} view={view} setView={onNav} onLogout={onLogout} mobile={isMob} open={sideOpen} onClose={()=>setSideOpen(false)}/>
      <div style={{flex:1,marginLeft:isMob?0:238,display:"flex",flexDirection:"column",minHeight:"100vh",background:"#F0F9FF"}}>
        {isMob&&<MobileHeader user={user} view={view} onMenuOpen={()=>setSideOpen(true)}/>}
        <main style={{flex:1,padding:isMob?"14px 12px 80px":"24px 28px",overflowX:"hidden"}}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
