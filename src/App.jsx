import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ════════════════════════════════════════════════════════
// ⚙️  SUPABASE CONFIG
// ════════════════════════════════════════════════════════
const SUPA_URL = "https://kqpynncftodfulfjdgqv.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHlubmNmdG9kZnVsZmpkZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzAzMjUsImV4cCI6MjA5MjAwNjMyNX0.6ZlI5HpmRU4aBbUMvCG1qMy4zxCmHuChRgD4ba2CVYA";
const db = createClient(SUPA_URL, SUPA_KEY);

// ════════════════════════════════════════════════════════
// 🧪  PRODUITS CATALOGUE
// ════════════════════════════════════════════════════════
const PRODUITS = [
  {code:"Glu",     item:"Glucomètre",                      prix:25},
  {code:"GluEx",   item:"Glucomètre Ex",                   prix:25},
  {code:"TMPt",    item:"Tensiomètre portable",            prix:50},
  {code:"TMGd",    item:"Tensiomètre grand brassard",      prix:50},
  {code:"B30",     item:"Bandelette 30 pcs",               prix:10},
  {code:"B50",     item:"Bandelette 50 pcs",               prix:15},
  {code:"B60",     item:"Bandelette 60 pcs",               prix:20},
  {code:"B60Ex",   item:"Bandelette 60 pcs Ex",            prix:20},
  {code:"B120",    item:"Bandelette 120 pcs",              prix:36},
  {code:"B120x",   item:"Bandelette 120 pcs X",            prix:36},
  {code:"TDR HepB",item:"Test rapide Hépatite B",          prix:20},
  {code:"TDR Typh",item:"Test rapide Typhoïde",            prix:20},
  {code:"TDR Syph",item:"Test rapide Syphilis",            prix:20},
  {code:"TDR Chla",item:"Test rapide Chlamydia",           prix:25},
  {code:"TDR HP",  item:"Test rapide Helicobacter Pylori", prix:18},
  {code:"HbA1C",   item:"Analyseur HbA1C",                 prix:2000},
  {code:"HbA1C Rx",item:"Réactif HbA1C",                  prix:100},
  {code:"GtExam",  item:"Gants d'examen nitrile",          prix:3.5},
  {code:"Gtst",    item:"Gants chirurgicaux stériles",     prix:10.5},
  {code:"Cot50g",  item:"Coton absorbant 50g",             prix:3.04},
  {code:"Cot100g", item:"Coton absorbant 100g",            prix:7.2},
  {code:"Cot250g", item:"Coton absorbant 250g",            prix:2.72},
  {code:"Cot500g", item:"Coton absorbant 500g",            prix:9.576},
  {code:"SyrU100", item:"Seringue insuline U-100",         prix:6.0},
  {code:"SyrU40",  item:"Seringue insuline U-40",          prix:6.3},
  {code:"Syr2cc",  item:"Seringue 2 ml",                   prix:2.5},
  {code:"Syr5cc",  item:"Seringue 5 ml",                   prix:2.6},
  {code:"Syr10cc", item:"Seringue 10 ml",                  prix:4.0},
  {code:"Cat18",   item:"Cathéter IV 18",                  prix:4.25},
  {code:"Cat20",   item:"Cathéter IV 20",                  prix:4.25},
  {code:"Cat22",   item:"Cathéter IV 22",                  prix:4.85},
  {code:"Cat24",   item:"Cathéter IV 24",                  prix:5.1},
  {code:"EpiG21",  item:"Epicrânien G21",                  prix:2.76},
  {code:"EpiG23",  item:"Epicrânien G23",                  prix:2.76},
  {code:"PheUr",   item:"Poche urine 2000 ml",             prix:0.236},
  {code:"Snd16",   item:"Sonde urinaire 16",               prix:6.38},
  {code:"Snd18",   item:"Sonde urinaire 18",               prix:6.38},
  {code:"Snd22",   item:"Sonde urinaire 22",               prix:6.38},
  {code:"Snd24",   item:"Sonde urinaire 24",               prix:6.38},
  {code:"Snd26",   item:"Sonde urinaire 26",               prix:6.38},
  {code:"TssPerf", item:"Trousse de perfusion",            prix:3.075},
  {code:"MskOx",   item:"Masque à oxygène",                prix:28.25},
];

const PLAINT_TYPES = ["Client difficile","Rupture de stock","Problème de livraison","Incident sur le terrain","Problème de paiement","Concurrence agressive","Autre"];

// ════════════════════════════════════════════════════════
// 🎨  DESIGN SYSTEM — BLEU CIEL
// ════════════════════════════════════════════════════════
const C = {
  sidebar:"#075985", nav1:"#0C4A6E", nav2:"#0369A1",
  sky:"#0EA5E9", skyM:"#38BDF8", skyL:"#BAE6FD", skyLL:"#E0F2FE",
  bg:"#F0F9FF", white:"#FFFFFF", border:"#BAE6FD",
  text:"#0C4A6E", muted:"#0369A1", light:"#7DD3FC",
  green:"#059669", greenL:"#ECFDF5",
  red:"#DC2626",   redL:"#FEF2F2",
  amber:"#D97706", amberL:"#FFFBEB",
  purple:"#7C3AED",purpleL:"#F5F3FF",
};
const ROLE_COLOR  = { directeur:C.nav1, superviseur:C.purple, comptable:C.amber, delegue:C.sky };
const ROLE_LABEL  = { directeur:"Directeur Commercial", superviseur:"Superviseur", comptable:"Comptable", delegue:"Délégué(e) Commercial(e)" };
const CHART_COLS  = ["#0EA5E9","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#BE185D"];

// ════════════════════════════════════════════════════════
// 🔧  HELPERS
// ════════════════════════════════════════════════════════
const fmt      = n  => new Intl.NumberFormat("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0);
const todayISO = () => new Date().toISOString().split("T")[0];
const todayFR  = () => new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const nowTS    = () => new Date().toISOString();
const newRow   = () => ({id:Date.now()+Math.random(),code:"",item:"",qte:1,prix:0,montant:0,client:"",adresse:"",tel:"",lat:"",lng:""});
const initials = u  => u ? ((u.prenom||"?")[0]+(u.nom||"?")[0]).toUpperCase() : "??";

const loadReports = () => { try{return JSON.parse(localStorage.getItem("lp4_reports")||"[]");}catch{return[];} };
const saveReports = r  => localStorage.setItem("lp4_reports",JSON.stringify(r));

// ════════════════════════════════════════════════════════
// 📊  EXPORT EXCEL — HTML bien mis en forme
// ════════════════════════════════════════════════════════
const exportExcel = (rapport) => {
  const alt = i => i%2===0 ? "#E0F2FE" : "#FFFFFF";
  const lignesHTML = rapport.lignes.map((l,i) => `
    <tr>
      <td style="text-align:center;padding:6px;border:1px solid #BAE6FD;background:${alt(i)};color:#0369A1;font-weight:bold">${i+1}</td>
      <td style="padding:6px 8px;border:1px solid #BAE6FD;background:${alt(i)};font-family:Courier New,monospace;font-weight:bold;color:#075985">${l.code}</td>
      <td style="padding:6px 8px;border:1px solid #BAE6FD;background:${alt(i)}">${l.item}</td>
      <td style="text-align:center;padding:6px;border:1px solid #BAE6FD;background:${alt(i)};font-weight:bold">${l.qte}</td>
      <td style="text-align:right;padding:6px 10px;border:1px solid #BAE6FD;background:${alt(i)};color:#059669;font-weight:bold">$ ${fmt(l.montant)}</td>
      <td style="padding:6px 8px;border:1px solid #BAE6FD;background:${alt(i)};font-weight:600">${l.client}</td>
      <td style="padding:6px 8px;border:1px solid #BAE6FD;background:${alt(i)};color:#475569">${l.adresse||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #BAE6FD;background:${alt(i)};color:#475569">${l.tel||"—"}</td>
      <td style="padding:6px;border:1px solid #BAE6FD;background:${alt(i)};font-size:9pt;color:#0369A1">${l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
    </tr>`).join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;}table{border-collapse:collapse;width:100%;}</style></head>
<body><table>
<tr><td colspan="9" style="background:#075985;color:#FFFFFF;font-size:17pt;font-weight:bold;text-align:center;padding:14px;border:2px solid #0369A1;letter-spacing:0.5px">RAPPORT DES VENTES JOURNALI&Egrave;RES &mdash; LabPro Pharma RDC Sarl</td></tr>
<tr><td colspan="9" style="height:8px;background:#0EA5E9"></td></tr>
<tr>
  <td colspan="3" style="background:#E0F2FE;padding:9px 12px;border:1px solid #BAE6FD"><b style="color:#075985">D&eacute;l&eacute;gu&eacute;(e) :</b> ${rapport.prenom} ${rapport.nom}</td>
  <td colspan="2" style="background:#E0F2FE;padding:9px 12px;border:1px solid #BAE6FD"><b style="color:#075985">N&deg; Agent :</b> ${rapport.num||"—"}</td>
  <td colspan="4" style="background:#E0F2FE;padding:9px 12px;border:1px solid #BAE6FD"><b style="color:#075985">Date :</b> ${rapport.date}</td>
</tr>
<tr><td colspan="9" style="background:#E0F2FE;padding:9px 12px;border:1px solid #BAE6FD"><b style="color:#075985">Secteurs visit&eacute;s :</b> ${rapport.secteurs}</td></tr>
<tr><td colspan="9" style="height:6px"></td></tr>
<tr style="background:#0369A1;color:#FFFFFF;font-size:10pt;font-weight:bold">
  <td style="padding:9px 6px;border:1px solid #0284C7;text-align:center">N&deg;</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">CODE</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">D&Eacute;SIGNATION DU PRODUIT</td>
  <td style="padding:9px 6px;border:1px solid #0284C7;text-align:center">QT&Eacute;</td>
  <td style="padding:9px 10px;border:1px solid #0284C7;text-align:right">MONTANT (USD)</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">NOM CLIENT</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">ADRESSE</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">T&Eacute;L&Eacute;PHONE</td>
  <td style="padding:9px 8px;border:1px solid #0284C7">GPS</td>
</tr>
${lignesHTML}
<tr style="background:#075985;color:#FFFFFF;font-size:12pt;font-weight:bold">
  <td colspan="4" style="padding:11px 12px;border:2px solid #0369A1;text-align:right">TOTAL CHIFFRE D'AFFAIRES :</td>
  <td style="padding:11px 12px;border:2px solid #0369A1;text-align:right;color:#BAE6FD;font-size:14pt">$ ${fmt(rapport.totalCA)}</td>
  <td colspan="4" style="padding:11px 12px;border:2px solid #0369A1;font-size:10pt">${rapport.nbClients} client(s) &nbsp;|&nbsp; ${rapport.lignes.length} vente(s)</td>
</tr>
<tr><td colspan="9" style="height:10px"></td></tr>
<tr>
  <td colspan="5" style="background:#F0F9FF;padding:8px 12px;border:1px solid #BAE6FD;font-size:9pt;color:#64748B;font-style:italic">G&eacute;n&eacute;r&eacute; automatiquement &mdash; LabPro Pharma RDC Sales System &mdash; ${new Date().toLocaleString("fr-FR")}</td>
  <td colspan="4" style="background:#F0F9FF;padding:8px 12px;border:1px solid #BAE6FD;text-align:right;font-size:10pt"><b>Signature :</b> &nbsp;&nbsp;_______________________</td>
</tr>
</table></body></html>`;

  const blob = new Blob(["\uFEFF"+html],{type:"application/vnd.ms-excel;charset=utf-8"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`LabPro_${rapport.nom}_${rapport.date}.xls`;
  a.click(); URL.revokeObjectURL(url);
};

const exportExcelCompil = (reports, titre) => {
  const rows = reports.map((r,i) => `
    <tr>
      <td style="padding:6px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"};text-align:center">${r.num||"—"}</td>
      <td style="padding:6px 10px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"};font-weight:bold">${r.prenom} ${r.nom}</td>
      <td style="padding:6px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"}">${r.date}</td>
      <td style="padding:6px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"};text-align:center">${r.lignes?.length||0}</td>
      <td style="padding:6px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"};text-align:center">${r.nbClients||0}</td>
      <td style="padding:6px 10px;border:1px solid #BAE6FD;background:${i%2===0?"#E0F2FE":"#FFF"};color:#059669;font-weight:bold;text-align:right">$ ${fmt(r.totalCA||0)}</td>
    </tr>`).join("");
  const totalCA = reports.reduce((s,r)=>s+(r.totalCA||0),0);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8"></head><body>
<table style="border-collapse:collapse;width:100%;font-family:Calibri,Arial,sans-serif;font-size:11pt">
<tr><td colspan="6" style="background:#075985;color:#FFF;font-size:16pt;font-weight:bold;text-align:center;padding:12px;border:2px solid #0369A1">COMPILATION &mdash; ${titre} &mdash; LabPro Pharma RDC Sarl</td></tr>
<tr style="background:#0369A1;color:#FFF;font-weight:bold">
  <td style="padding:8px;border:1px solid #0284C7;text-align:center">N&deg;</td>
  <td style="padding:8px;border:1px solid #0284C7">D&Eacute;L&Eacute;GU&Eacute;(E)</td>
  <td style="padding:8px;border:1px solid #0284C7">DATE</td>
  <td style="padding:8px;border:1px solid #0284C7;text-align:center">VENTES</td>
  <td style="padding:8px;border:1px solid #0284C7;text-align:center">CLIENTS</td>
  <td style="padding:8px;border:1px solid #0284C7;text-align:right">CA TOTAL (USD)</td>
</tr>
${rows}
<tr style="background:#075985;color:#FFF;font-weight:bold">
  <td colspan="5" style="padding:10px 12px;border:2px solid #0369A1;text-align:right">TOTAL G&Eacute;N&Eacute;RAL :</td>
  <td style="padding:10px 12px;border:2px solid #0369A1;text-align:right;font-size:14pt;color:#BAE6FD">$ ${fmt(totalCA)}</td>
</tr>
</table></body></html>`;
  const blob = new Blob(["\uFEFF"+html],{type:"application/vnd.ms-excel;charset=utf-8"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`LabPro_Compil_${titre.replace(/[ /]/g,"_")}.xls`;
  a.click(); URL.revokeObjectURL(url);
};

// ════════════════════════════════════════════════════════
// 🗄️  SUPABASE HELPERS
// ════════════════════════════════════════════════════════
const getProfile = async (userId) => {
  const {data} = await db.from("profiles").select("*").eq("id",userId).single();
  return data;
};
const getAllProfiles = async () => {
  const {data} = await db.from("profiles").select("*").eq("actif",true).order("nom");
  return data||[];
};
const saveGPSPoint = async (profile, point) => {
  await db.from("gps_points").insert({
    delegue_id:profile.id, nom:profile.nom, prenom:profile.prenom, num:profile.num,
    lat:point.lat, lng:point.lng, accuracy:point.accuracy,
    session_date:todayISO(), created_at:nowTS(),
  });
};
const loadGPSToday = async () => {
  const {data} = await db.from("gps_points").select("*").eq("session_date",todayISO()).order("created_at",{ascending:true});
  return data||[];
};
const savePlainte = async (profile, p) => {
  const {data,error} = await db.from("plaintes").insert({
    delegue_id:profile.id, nom:profile.nom, prenom:profile.prenom, num:profile.num,
    type_plainte:p.type, description:p.description, urgence:p.urgence,
    lat:p.lat||null, lng:p.lng||null, statut:"nouveau",
    created_at:nowTS(), session_date:todayISO(),
  }).select().single();
  return {data,error};
};
const loadPlaintes = async () => {
  const {data} = await db.from("plaintes").select("*").order("created_at",{ascending:false});
  return data||[];
};
const updatePlainteStatut = async (id,statut) => {
  await db.from("plaintes").update({statut}).eq("id",id);
};

// ════════════════════════════════════════════════════════
// 🧩  UI COMPONENTS
// ════════════════════════════════════════════════════════
function StatCard({icon,label,value,sub,color}) {
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 20px",position:"relative",overflow:"hidden",transition:"box-shadow 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(14,165,233,0.12)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:color||C.sky,borderRadius:"14px 0 0 14px"}}/>
      <div style={{marginLeft:8}}>
        <span style={{fontSize:22}}>{icon}</span>
        <div style={{fontSize:23,fontWeight:800,color:C.text,letterSpacing:-0.5,marginTop:6,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginTop:4}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C.light,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({children,color="sky"}) {
  const m={sky:{bg:C.skyLL,c:C.nav2},green:{bg:C.greenL,c:C.green},amber:{bg:C.amberL,c:C.amber},red:{bg:C.redL,c:C.red},navy:{bg:"#EFF6FF",c:C.nav1},purple:{bg:C.purpleL,c:C.purple}};
  const s=m[color]||m.sky;
  return <span style={{background:s.bg,color:s.c,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,whiteSpace:"nowrap"}}>{children}</span>;
}

function Btn({children,onClick,disabled,variant="primary",icon,sm,type="button"}) {
  const vs={
    primary:{bg:disabled?"#BAE6FD":C.sky,cl:"#FFF",br:"none",sh:disabled?"none":"0 2px 10px rgba(14,165,233,0.3)"},
    secondary:{bg:C.white,cl:C.muted,br:`1px solid ${C.border}`,sh:"none"},
    danger:{bg:C.redL,cl:C.red,br:"1px solid #FCA5A5",sh:"none"},
    success:{bg:C.greenL,cl:C.green,br:"1px solid #A7F3D0",sh:"none"},
    navy:{bg:C.nav1,cl:"#FFF",br:"none",sh:"0 2px 10px rgba(7,89,133,0.3)"},
  };
  const s=vs[variant]||vs.primary;
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{background:s.bg,color:s.cl,border:s.br,borderRadius:9,padding:sm?"6px 12px":"10px 18px",fontSize:sm?11:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.15s",whiteSpace:"nowrap",boxShadow:s.sh}}>
      {icon&&<span style={{fontSize:sm?12:14}}>{icon}</span>}{children}
    </button>
  );
}

function Card({children,p="20px",style={}}) {
  return <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:p,...style}}>{children}</div>;
}

function PageTitle({title,sub,action}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 style={{fontSize:19,fontWeight:800,color:C.text,margin:"0 0 3px",letterSpacing:-0.3}}>{title}</h1>
        {sub&&<p style={{color:C.muted,fontSize:12,margin:0}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Input({label,value,onChange,type="text",placeholder,required,readOnly,mono}) {
  const [focus,setFocus]=useState(false);
  return (
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{label}{required&&" *"}</label>}
      <input value={value} onChange={onChange} type={type} placeholder={placeholder} readOnly={readOnly}
        style={{width:"100%",border:`1.5px solid ${focus?C.sky:C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,outline:"none",fontFamily:mono?"monospace":"inherit",boxSizing:"border-box",background:readOnly?C.bg:"#F8FCFF",color:C.text,transition:"border 0.15s"}}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
    </div>
  );
}

function Select({label,value,onChange,children,required}) {
  return (
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{label}{required&&" *"}</label>}
      <select value={value} onChange={onChange} style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#F8FCFF",color:C.text,cursor:"pointer"}}>
        {children}
      </select>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🔐  AUTH PAGE — sécurisée, sans mots de passe visibles
// ════════════════════════════════════════════════════════
function AuthPage({onLogin}) {
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErr(""); setLoading(true);
    const {data,error} = await db.auth.signInWithPassword({email:email.trim(),password:pw});
    if(error){setErr("Email ou mot de passe incorrect.");setLoading(false);return;}
    const profile = await getProfile(data.user.id);
    if(!profile){setErr("Compte non configuré. Contactez l'administrateur.");setLoading(false);return;}
    if(!profile.actif){setErr("Compte désactivé. Contactez l'administrateur.");setLoading(false);return;}
    onLogin({...profile, authId:data.user.id});
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,#0C4A6E 0%,#0369A1 50%,#0EA5E9 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:70,height:70,borderRadius:20,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",marginBottom:14,border:"2px solid rgba(255,255,255,0.3)"}}>
            <span style={{fontSize:34}}>💊</span>
          </div>
          <h1 style={{color:"#FFF",fontSize:20,fontWeight:800,margin:"0 0 4px",textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>LabPro Pharma RDC Sarl</h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,margin:0}}>Système de Rapport des Ventes Journalières</p>
        </div>

        <Card style={{boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
          <h2 style={{fontSize:16,fontWeight:700,color:C.text,textAlign:"center",margin:"0 0 22px"}}>🔑 Connexion</h2>
          <form onSubmit={handleLogin}>
            <Input label="Email professionnel" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="prenom.nom@labpropharma.cd" required/>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Mot de passe *</label>
              <div style={{position:"relative"}}>
                <input value={pw} onChange={e=>setPw(e.target.value)} type={showPw?"text":"password"} placeholder="••••••••••"
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 42px 10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#F8FCFF",color:C.text}}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",fontSize:16,color:C.light}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
            </div>
            {err&&<div style={{background:C.redL,border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:14}}>⚠️ {err}</div>}
            <Btn type="submit" disabled={loading} style={{width:"100%"}} onClick={handleLogin}>
              {loading?"⏳ Connexion en cours...":"Se connecter →"}
            </Btn>
          </form>
          <p style={{textAlign:"center",fontSize:12,color:C.light,marginTop:16}}>
            Mot de passe oublié ? Contactez le Directeur Commercial.
          </p>
        </Card>
        <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:14}}>LabPro Pharma RDC · v4.0 · 2025</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 👥  GESTION UTILISATEURS — DIRECTEUR SEULEMENT
// ════════════════════════════════════════════════════════
function GestionUtilisateurs() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({text:"",type:""});
  const [tab,     setTab]     = useState("liste");

  const load = async () => {
    setLoading(true);
    const {data} = await db.from("profiles").select("*").order("nom");
    setUsers(data||[]);
    setLoading(false);
  };

  useEffect(()=>{load();},[]);

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));
  const showMsg = (text,type="success") => { setMsg({text,type}); setTimeout(()=>setMsg({text:"",type:""}),4000); };

  const createUser = async () => {
    if(!form.email||!form.nom||!form.prenom||!form.password) return showMsg("Tous les champs obligatoires sont requis.","error");
    if(form.password.length<6) return showMsg("Le mot de passe doit avoir au moins 6 caractères.","error");
    setSaving(true);
    const {data:authData, error:authErr} = await db.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: { data: { nom:form.nom, prenom:form.prenom } }
    });
    if(authErr){showMsg(`Erreur : ${authErr.message}`,"error");setSaving(false);return;}
    const {error:profErr} = await db.from("profiles").insert({
      id: authData.user.id,
      email: form.email.trim().toLowerCase(),
      nom: form.nom.trim().toUpperCase(),
      prenom: form.prenom.trim(),
      role: form.role,
      num: form.num.trim()||null,
      genre: form.genre,
      actif: true,
      created_at: nowTS(),
    });
    if(profErr){showMsg(`Profil non créé : ${profErr.message}`,"error");setSaving(false);return;}
    showMsg(`✅ Compte créé pour ${form.prenom} ${form.nom}. Un email de confirmation a été envoyé.`);
    setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
    await load();
    setSaving(false);
  };

  const toggleActif = async (user) => {
    await db.from("profiles").update({actif:!user.actif}).eq("id",user.id);
    showMsg(`${user.prenom} ${user.nom} : compte ${!user.actif?"activé":"désactivé"}.`);
    await load();
  };

  const resetPassword = async (user) => {
    const newPw = prompt(`Nouveau mot de passe pour ${user.prenom} ${user.nom} (min. 6 caractères) :`);
    if(!newPw||newPw.length<6){alert("Mot de passe trop court.");return;}
    const {error} = await db.auth.admin?.updateUserById(user.id,{password:newPw});
    if(error) showMsg("Impossible de réinitialiser via l'interface. Utilisez le tableau Supabase.","error");
    else showMsg(`Mot de passe de ${user.prenom} ${user.nom} réinitialisé.`);
  };

  const roleGroups = {directeur:"Directeur",superviseur:"Superviseur",comptable:"Comptable",delegue:"Délégués"};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="👥 Gestion des Utilisateurs" sub="Administration des accès — LabPro Pharma RDC"/>

      {msg.text&&(
        <div style={{background:msg.type==="error"?C.redL:C.greenL,border:`1px solid ${msg.type==="error"?"#FCA5A5":"#A7F3D0"}`,borderRadius:10,padding:"12px 16px",fontSize:13,color:msg.type==="error"?C.red:C.green,marginBottom:16}}>{msg.text}</div>
      )}

      <div style={{display:"flex",gap:10,marginBottom:18}}>
        {[["liste","📋 Liste des utilisateurs"],["ajouter","➕ Ajouter un utilisateur"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 18px",borderRadius:999,border:`1.5px solid ${tab===id?C.sky:C.border}`,background:tab===id?C.sky:C.white,color:tab===id?"#FFF":C.muted,fontWeight:tab===id?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{lbl}</button>
        ))}
      </div>

      {tab==="liste"&&(
        <div>
          {loading?<div style={{textAlign:"center",padding:40,color:C.muted}}>⏳ Chargement...</div>:
          Object.entries(roleGroups).map(([role,title])=>{
            const group=users.filter(u=>u.role===role);
            if(!group.length) return null;
            return (
              <div key={role} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:ROLE_COLOR[role]}}/>
                  <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>{title} ({group.length})</h3>
                </div>
                <Card p="0" style={{overflow:"hidden"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{background:C.bg}}>
                      {["N°","Nom complet","Email","Genre","Statut","Actions"].map(h=>(
                        <th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {group.map(u=>(
                        <tr key={u.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{padding:"10px 13px"}}><Badge color="navy">{u.num||"—"}</Badge></td>
                          <td style={{padding:"10px 13px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:30,height:30,borderRadius:"50%",background:ROLE_COLOR[u.role],display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:700,flexShrink:0}}>{initials(u)}</div>
                              <div>
                                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{u.prenom} {u.nom}</div>
                                <div style={{fontSize:10,color:C.light}}>{ROLE_LABEL[u.role]}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:"10px 13px",fontSize:12,color:C.muted}}>{u.email}</td>
                          <td style={{padding:"10px 13px",fontSize:12,color:C.muted}}>{u.genre==="F"?"Féminin":"Masculin"}</td>
                          <td style={{padding:"10px 13px"}}>
                            <Badge color={u.actif?"green":"red"}>{u.actif?"Actif":"Désactivé"}</Badge>
                          </td>
                          <td style={{padding:"10px 13px"}}>
                            <div style={{display:"flex",gap:6}}>
                              <Btn onClick={()=>toggleActif(u)} variant={u.actif?"danger":"success"} sm icon={u.actif?"🔒":"🔓"}>
                                {u.actif?"Désactiver":"Activer"}
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {tab==="ajouter"&&(
        <Card style={{maxWidth:560}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 20px"}}>➕ Créer un nouveau compte</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Prénom" value={form.prenom} onChange={e=>setF("prenom",e.target.value)} placeholder="Ex: Jacques" required/>
            <Input label="Nom" value={form.nom} onChange={e=>setF("nom",e.target.value)} placeholder="Ex: BOZITO" required/>
          </div>
          <Input label="Email professionnel" value={form.email} onChange={e=>setF("email",e.target.value)} type="email" placeholder="prenom.nom@labpropharma.cd" required/>
          <Input label="Mot de passe initial" value={form.password} onChange={e=>setF("password",e.target.value)} type="password" placeholder="Min. 6 caractères" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px"}}>
            <Select label="Rôle" value={form.role} onChange={e=>setF("role",e.target.value)} required>
              <option value="delegue">Délégué(e)</option>
              <option value="superviseur">Superviseur</option>
              <option value="comptable">Comptable</option>
              <option value="directeur">Directeur</option>
            </Select>
            <Input label="N° Agent" value={form.num} onChange={e=>setF("num",e.target.value)} placeholder="Ex: 02"/>
            <Select label="Genre" value={form.genre} onChange={e=>setF("genre",e.target.value)}>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </Select>
          </div>
          <div style={{background:C.skyLL,borderRadius:9,padding:"10px 13px",fontSize:12,color:C.nav1,marginBottom:18}}>
            ℹ️ Un email de confirmation sera envoyé à l'adresse indiquée. L'utilisateur devra cliquer sur le lien pour activer son compte.
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={createUser} disabled={saving} icon={saving?"⏳":"✅"} variant="navy">
              {saving?"Création en cours...":"Créer le compte"}
            </Btn>
            <Btn onClick={()=>setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""})} variant="secondary" icon="🔄">Effacer</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📐  SIDEBAR
// ════════════════════════════════════════════════════════
const NAV = {
  delegue:    [{id:"rapport",icon:"📝",lbl:"Nouveau rapport"},{id:"historique",icon:"📋",lbl:"Mes rapports"},{id:"gps",icon:"📍",lbl:"Mon GPS terrain"},{id:"plainte",icon:"⚠️",lbl:"Signaler un problème"}],
  superviseur:[{id:"localisation",icon:"🗺️",lbl:"Localisation terrain"},{id:"plaintes",icon:"⚠️",lbl:"Signalements & Plaintes"}],
  directeur:  [{id:"dashboard",icon:"📊",lbl:"Tableau de bord"},{id:"rapports",icon:"📋",lbl:"Tous les rapports"},{id:"hebdo",icon:"📅",lbl:"Rapport hebdomadaire"},{id:"mensuel",icon:"🗓",lbl:"Rapport mensuel"},{id:"classement",icon:"🏆",lbl:"Classement délégués"},{id:"localisation",icon:"🗺️",lbl:"Localisation terrain"},{id:"plaintes",icon:"⚠️",lbl:"Signalements & Plaintes"},{id:"users",icon:"👥",lbl:"Gestion utilisateurs"}],
  comptable:  [{id:"dashboard_c",icon:"📊",lbl:"Tableau de bord"},{id:"rapports_c",icon:"📋",lbl:"Rapports reçus"}],
};

function Sidebar({user,view,setView,onLogout}) {
  const items=NAV[user.role]||NAV.delegue;
  return (
    <div style={{width:238,background:C.sidebar,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:100,boxShadow:"3px 0 20px rgba(0,0,0,0.2)"}}>
      <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>💊</div>
          <div>
            <div style={{color:"#FFF",fontSize:13,fontWeight:800,lineHeight:1.2}}>LabPro Pharma</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,letterSpacing:0.5}}>RDC Sarl · Sales v4</div>
          </div>
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:ROLE_COLOR[user.role],display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#FFF",flexShrink:0}}>{initials(user)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:"#FFF",fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.prenom} {(user.nom||"").split(" ")[0]}</div>
            <div style={{fontSize:9,padding:"1px 7px",borderRadius:999,background:ROLE_COLOR[user.role],color:"#FFF",display:"inline-block",marginTop:3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{user.role}</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {items.map(item=>{
          const active=view===item.id;
          return (
            <div key={item.id} onClick={()=>setView(item.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:9,marginBottom:2,cursor:"pointer",background:active?"rgba(14,165,233,0.25)":"transparent",borderLeft:active?"3px solid #38BDF8":"3px solid transparent",color:active?"#BAE6FD":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:active?700:400,transition:"all 0.12s"}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>
              <span>{item.lbl}</span>
            </div>
          );
        })}
      </nav>
      <div style={{padding:"10px 8px 18px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div onClick={onLogout}
          style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:9,cursor:"pointer",color:"rgba(255,255,255,0.35)",fontSize:13,transition:"all 0.12s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#FCA5A5";e.currentTarget.style.background="rgba(220,38,38,0.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.35)";e.currentTarget.style.background="transparent";}}>
          <span>🚪</span><span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📝  NOUVEAU RAPPORT
// ════════════════════════════════════════════════════════
function NouveauRapport({user}) {
  const [secteurs,setSecteurs]=useState("");
  const [lignes,  setLignes]  =useState([newRow()]);
  const [done,    setDone]    =useState(false);
  const [saving,  setSaving]  =useState(false);
  const [gpsId,   setGpsId]   =useState(null);

  const totalCA   = lignes.reduce((s,l)=>s+(l.montant||0),0);
  const nbClients = lignes.filter(l=>l.client.trim()).length;

  const updRow=(id,f,v)=>setLignes(prev=>prev.map(r=>{
    if(r.id!==id) return r;
    const u={...r,[f]:v};
    if(f==="code"){const p=PRODUITS.find(p=>p.code===v);if(p){u.item=p.item;u.prix=p.prix;u.montant=p.prix*(u.qte||1);}}
    if(f==="qte"||f==="prix") u.montant=(parseFloat(u.prix)||0)*(parseFloat(u.qte)||0);
    return u;
  }));

  const captureGPS=(id)=>{
    setGpsId(id);
    if(!navigator.geolocation){alert("GPS non disponible.");setGpsId(null);return;}
    navigator.geolocation.getCurrentPosition(
      p=>{updRow(id,"lat",p.coords.latitude.toFixed(6));updRow(id,"lng",p.coords.longitude.toFixed(6));setGpsId(null);},
      ()=>{alert("Localisation impossible. Activez la permission GPS.");setGpsId(null);}
    );
  };

  const submit=async()=>{
    if(!secteurs.trim()){alert("⚠️ Indiquez les secteurs visités.");return;}
    const valid=lignes.filter(l=>l.code&&l.client);
    if(!valid.length){alert("⚠️ Au moins une vente avec produit et client.");return;}
    setSaving(true);
    await new Promise(r=>setTimeout(r,600));
    const rpt={id:Date.now().toString(),delegueId:user.id,num:user.num,nom:user.nom,prenom:user.prenom,date:todayISO(),secteurs,lignes:valid,totalCA,nbClients,soumis:nowTS()};
    const all=loadReports();all.push(rpt);saveReports(all);
    exportExcel(rpt);
    setSaving(false);setDone(true);
  };

  if(done) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <Card style={{textAlign:"center",maxWidth:480,padding:48}}>
        <div style={{fontSize:60,marginBottom:14}}>✅</div>
        <h2 style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:10}}>Rapport soumis !</h2>
        <div style={{background:C.skyLL,borderRadius:12,padding:"12px 18px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[[lignes.filter(l=>l.code).length,"Ventes"],[nbClients,"Clients"],["$"+fmt(totalCA),"CA Total"]].map(([v,l])=>(
            <div key={l}><div style={{fontSize:20,fontWeight:800,color:C.sky}}>{v}</div><div style={{fontSize:11,color:C.muted}}>{l}</div></div>
          ))}
        </div>
        <p style={{color:C.muted,fontSize:13,marginBottom:20}}>📊 Fichier Excel téléchargé automatiquement</p>
        <Btn onClick={()=>{setDone(false);setLignes([newRow()]);setSecteurs("");}} icon="📝">Nouveau rapport</Btn>
      </Card>
    </div>
  );

  const TH=({c})=><th style={{padding:"9px 8px",fontSize:10,fontWeight:700,color:C.muted,textAlign:"left",borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5,background:C.bg,whiteSpace:"nowrap"}}>{c}</th>;
  const inp2={border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 8px",fontSize:12,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box",background:"#FAFCFF"};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{background:`linear-gradient(135deg,${C.nav1} 0%,${C.sky} 100%)`,borderRadius:16,padding:"20px 26px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Rapport des Ventes Journalières</div>
            <h1 style={{color:"#FFF",fontSize:17,fontWeight:800,margin:"0 0 3px"}}>LabPro Pharma RDC Sarl</h1>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:12,margin:0}}>{user.genre==="F"?"Déléguée":"Délégué"} N°{user.num||"—"} · {user.prenom} {user.nom}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>Date du rapport</div>
            <div style={{color:"#FFF",fontSize:13,fontWeight:600,marginTop:2}}>{todayFR()}</div>
          </div>
        </div>
      </div>

      <Card style={{marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr",gap:18,alignItems:"end"}}>
          {[["Agent",`N°${user.num||"—"} · ${user.prenom} ${user.nom}`],["Date",new Date().toLocaleDateString("fr-FR")]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{l}</div>
            <div style={{fontSize:13,fontWeight:600,color:C.text,background:C.bg,borderRadius:8,padding:"9px 12px"}}>{v}</div></div>
          ))}
          <div>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>Secteurs / Zones visités *</div>
            <input value={secteurs} onChange={e=>setSecteurs(e.target.value)} placeholder="Ex : Gombe, Lingwala, Barumbu..."
              style={{...inp2,padding:"9px 12px",fontSize:13,border:`1px solid ${C.border}`}}/>
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
        <StatCard icon="📦" label="Lignes de vente" value={lignes.filter(l=>l.code).length} color={C.sky}/>
        <StatCard icon="👥" label="Clients visités" value={nbClients} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:16}}>
        <div style={{padding:"12px 16px",background:C.nav1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>📊 Tableau des Ventes</h3>
          <Btn onClick={()=>setLignes(p=>[...p,newRow()])} icon="➕" sm>Ajouter une ligne</Btn>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1060}}>
            <thead><tr>{["#","CODE","DÉSIGNATION","QTÉ","MONTANT USD","NOM CLIENT","ADRESSE","TÉLÉPHONE","GPS",""].map((c,i)=><TH key={i} c={c}/>)}</tr></thead>
            <tbody>
              {lignes.map((row,idx)=>(
                <tr key={row.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F0F9FF"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"7px 8px",textAlign:"center",color:C.light,fontSize:12,fontWeight:600,width:28}}>{idx+1}</td>
                  <td style={{padding:"7px 6px",minWidth:110}}>
                    <select value={row.code} onChange={e=>updRow(row.id,"code",e.target.value)} style={{...inp2,cursor:"pointer"}}>
                      <option value="">-- Code --</option>
                      {PRODUITS.map(p=><option key={p.code} value={p.code}>{p.code} · ${p.prix}</option>)}
                    </select>
                  </td>
                  <td style={{padding:"7px 6px",minWidth:190}}>
                    <input value={row.item} readOnly style={{...inp2,background:C.bg,color:C.muted,cursor:"default",minWidth:180}} placeholder="Auto-rempli"/>
                  </td>
                  <td style={{padding:"7px 6px",width:66}}>
                    <input type="number" min="1" value={row.qte} onChange={e=>updRow(row.id,"qte",parseFloat(e.target.value)||1)} style={{...inp2,width:58,textAlign:"center"}}/>
                  </td>
                  <td style={{padding:"7px 6px",width:115}}>
                    <div style={{fontSize:13,fontWeight:700,color:row.montant>0?C.green:C.light,background:row.montant>0?C.greenL:C.bg,borderRadius:7,padding:"6px 10px",textAlign:"right"}}>
                      {row.montant>0?`${fmt(row.montant)} $`:"—"}
                    </div>
                  </td>
                  <td style={{padding:"7px 6px",minWidth:145}}><input value={row.client} onChange={e=>updRow(row.id,"client",e.target.value)} placeholder="Nom client *" style={inp2}/></td>
                  <td style={{padding:"7px 6px",minWidth:130}}><input value={row.adresse} onChange={e=>updRow(row.id,"adresse",e.target.value)} placeholder="Adresse" style={inp2}/></td>
                  <td style={{padding:"7px 6px",minWidth:115}}><input value={row.tel} onChange={e=>updRow(row.id,"tel",e.target.value)} placeholder="+243..." style={inp2}/></td>
                  <td style={{padding:"7px 6px",minWidth:110}}>
                    {row.lat
                      ? <div style={{fontSize:10,color:C.green,fontWeight:600,lineHeight:1.5}}>📍{row.lat}<br/>{row.lng}</div>
                      : <Btn onClick={()=>captureGPS(row.id)} variant="secondary" icon="📍" sm>{gpsId===row.id?"GPS...":"Capturer"}</Btn>
                    }
                  </td>
                  <td style={{padding:"7px 6px",width:32}}>
                    {lignes.length>1&&<button onClick={()=>setLignes(p=>p.filter(r=>r.id!==row.id))} style={{background:C.redL,border:"none",color:C.red,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
                <td colSpan={4} style={{padding:"11px 10px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL CA JOURNALIER</td>
                <td style={{padding:"11px 10px",fontSize:16,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
                <td colSpan={5} style={{padding:"11px 10px",fontSize:11,color:C.muted}}>{nbClients} client(s) · {lignes.filter(l=>l.code).length} vente(s)</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingBottom:24}}>
        <Btn onClick={()=>setLignes([newRow()])} variant="secondary" icon="🔄">Réinitialiser</Btn>
        <Btn onClick={submit} disabled={saving} icon={saving?"⏳":"📤"}>{saving?"Envoi...":"Soumettre et envoyer"}</Btn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📋  HISTORIQUE DÉLÉGUÉ
// ════════════════════════════════════════════════════════
function HistoriqueDelegue({user}) {
  const all=loadReports().filter(r=>r.delegueId===user.id).sort((a,b)=>b.date.localeCompare(a.date));
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Mes Rapports" sub={`${user.prenom} ${user.nom}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📄" label="Rapports soumis" value={all.length} color={C.sky}/>
        <StatCard icon="🛍" label="Total ventes" value={all.reduce((s,r)=>s+(r.lignes?.length||0),0)} color={C.green}/>
        <StatCard icon="💰" label="CA cumulé (USD)" value={`$${fmt(all.reduce((s,r)=>s+(r.totalCA||0),0))}`} color={C.amber}/>
      </div>
      {!all.length?<Card style={{textAlign:"center",padding:56,color:C.muted}}>Aucun rapport soumis pour l'instant.</Card>:
      <Card p="0" style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>
            {["Date","Secteurs","Ventes","Clients","CA (USD)","Actions"].map(h=>(
              <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{all.map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"11px 14px",fontSize:13,fontWeight:600,color:C.text}}>{r.date}</td>
              <td style={{padding:"11px 14px",fontSize:12,color:C.muted,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
              <td style={{padding:"11px 14px"}}><Badge>{r.lignes?.length||0}</Badge></td>
              <td style={{padding:"11px 14px"}}><Badge color="green">{r.nbClients}</Badge></td>
              <td style={{padding:"11px 14px",fontSize:13,fontWeight:800,color:C.green}}>{fmt(r.totalCA)} $</td>
              <td style={{padding:"11px 14px"}}><Btn onClick={()=>exportExcel(r)} variant="success" icon="⬇" sm>Excel</Btn></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📍  GPS TERRAIN DÉLÉGUÉ
// ════════════════════════════════════════════════════════
function GPSTerrain({user}) {
  const [tracking,setTracking]=useState(false);
  const [trail,   setTrail]   =useState([]);
  const [status,  setStatus]  =useState("");
  const [seconds, setSeconds] =useState(0);
  const watchId=useRef(null); const timer=useRef(null);

  useEffect(()=>()=>{
    if(watchId.current) navigator.geolocation?.clearWatch(watchId.current);
    if(timer.current) clearInterval(timer.current);
  },[]);

  const start=()=>{
    if(!navigator.geolocation){setStatus("⚠️ GPS non disponible.");return;}
    setStatus("⏳ Acquisition du signal GPS...");
    const t0=Date.now();
    timer.current=setInterval(()=>setSeconds(Math.floor((Date.now()-t0)/1000)),1000);
    watchId.current=navigator.geolocation.watchPosition(
      pos=>{
        const pt={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:Math.round(pos.coords.accuracy),ts:nowTS()};
        setTrail(prev=>[...prev,pt]);
        setStatus(`✅ Signal actif · Précision : ±${pt.accuracy}m`);
        saveGPSPoint(user,pt);
      },
      err=>setStatus(`❌ Erreur : ${err.message}`),
      {enableHighAccuracy:true,timeout:15000,maximumAge:0}
    );
    setTracking(true);
  };

  const stop=()=>{
    if(watchId.current){navigator.geolocation.clearWatch(watchId.current);watchId.current=null;}
    if(timer.current){clearInterval(timer.current);timer.current=null;}
    setTracking(false);
    setStatus(`✅ Session terminée · ${trail.length} point(s) enregistré(s)`);
  };

  const fmtDur=s=>`${Math.floor(s/60)}min ${s%60}s`;
  const last=trail[trail.length-1];

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📍 Mon GPS Terrain" sub="Suivi de votre itinéraire · Données visibles par le Superviseur et le Directeur"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:48,height:48,borderRadius:12,background:tracking?C.greenL:C.skyLL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{tracking?"🟢":"⚪"}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.text}}>{tracking?"Tracking ACTIF":"Tracking INACTIF"}</div>
                <div style={{fontSize:12,color:C.muted}}>{tracking?`Durée : ${fmtDur(seconds)}`:"Appuyez pour démarrer"}</div>
              </div>
            </div>
            {status&&<div style={{background:C.skyLL,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:C.nav1,marginBottom:14}}>{status}</div>}
            <div style={{display:"flex",gap:10}}>
              {!tracking?<Btn onClick={start} icon="▶️">Démarrer le suivi GPS</Btn>:<Btn onClick={stop} variant="danger" icon="⏹">Arrêter</Btn>}
              {trail.length>0&&!tracking&&<Btn onClick={()=>{setTrail([]);setSeconds(0);}} variant="secondary" icon="🗑">Effacer</Btn>}
            </div>
          </Card>
          <Card>
            <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 12px"}}>📊 Statistiques</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["📍","Points enregistrés",trail.length],["⏱","Durée",fmtDur(seconds)],["🎯","Précision GPS",last?`±${last.accuracy}m`:"—"],["📅","Date",todayISO()]].map(([i,l,v])=>(
                <div key={l} style={{background:C.bg,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:18}}>{i}</div>
                  <div style={{fontSize:16,fontWeight:700,color:C.sky,marginTop:3}}>{v}</div>
                  <div style={{fontSize:11,color:C.muted}}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 12px"}}>🗺️ Points enregistrés ({trail.length})</h3>
          {!trail.length
            ? <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,flexDirection:"column",gap:8}}><div style={{fontSize:36}}>📍</div><div style={{fontSize:13}}>Démarrez le suivi pour voir les points</div></div>
            : <div style={{maxHeight:380,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                {[...trail].reverse().map((pt,i)=>(
                  <div key={i} style={{padding:"8px 12px",background:i===0?C.skyLL:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>📍 {pt.lat}, {pt.lng}</div>
                    <div style={{fontSize:10,color:C.muted}}>±{pt.accuracy}m · {new Date(pt.ts).toLocaleTimeString("fr-FR")}</div>
                  </div>
                ))}
              </div>
          }
          {last&&<a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:12,textAlign:"center",background:C.skyLL,color:C.nav2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px",fontSize:12,fontWeight:700,textDecoration:"none"}}>🗺️ Voir ma position sur Google Maps</a>}
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// ⚠️  FORMULAIRE PLAINTE
// ════════════════════════════════════════════════════════
function PlainteForm({user}) {
  const [form,setForm]=useState({type:PLAINT_TYPES[0],description:"",urgence:"normale"});
  const [loc, setLoc] =useState({lat:"",lng:""});
  const [saving,setSaving]=useState(false);
  const [done,  setDone]  =useState(false);
  const [gpsLoading,setGpsLoading]=useState(false);

  const capturePos=()=>{
    setGpsLoading(true);
    navigator.geolocation?.getCurrentPosition(
      p=>{setLoc({lat:p.coords.latitude.toFixed(6),lng:p.coords.longitude.toFixed(6)});setGpsLoading(false);},
      ()=>setGpsLoading(false)
    );
  };

  const submit=async()=>{
    if(!form.description.trim()){alert("⚠️ Décrivez le problème.");return;}
    setSaving(true);
    const {error}=await savePlainte(user,{...form,...loc});
    setSaving(false);
    if(error){alert("Erreur lors de l'envoi. Réessayez.");return;}
    setDone(true);
  };

  if(done) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh"}}>
      <Card style={{textAlign:"center",maxWidth:440,padding:48}}>
        <div style={{fontSize:56,marginBottom:14}}>📨</div>
        <h2 style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:10}}>Signalement envoyé !</h2>
        <p style={{color:C.muted,fontSize:13,marginBottom:20}}>Transmis au Superviseur et au Directeur Commercial.</p>
        <Btn onClick={()=>{setDone(false);setForm({type:PLAINT_TYPES[0],description:"",urgence:"normale"});setLoc({lat:"",lng:""}); }} icon="➕">Nouveau signalement</Btn>
      </Card>
    </div>
  );

  return (
    <div style={{animation:"fadeIn 0.3s ease",maxWidth:660}}>
      <PageTitle title="⚠️ Signaler un problème" sub="Transmis au Superviseur et au Directeur Commercial"/>
      <Card>
        <Select label="Type de problème" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
          {PLAINT_TYPES.map(t=><option key={t}>{t}</option>)}
        </Select>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Niveau d'urgence</label>
          <div style={{display:"flex",gap:10}}>
            {[["normale","🟡 Normale"],["haute","🟠 Haute"],["critique","🔴 Critique"]].map(([v,l])=>(
              <div key={v} onClick={()=>setForm(f=>({...f,urgence:v}))}
                style={{flex:1,textAlign:"center",padding:"10px 8px",borderRadius:9,cursor:"pointer",border:`2px solid ${form.urgence===v?C.sky:C.border}`,background:form.urgence===v?C.skyLL:C.white,fontSize:13,fontWeight:form.urgence===v?700:400,color:form.urgence===v?C.nav1:C.muted,transition:"all 0.15s"}}>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Description *</label>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Décrivez le problème en détail : quoi, où, avec qui..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#F8FCFF",height:110,resize:"vertical"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Position GPS (optionnel)</label>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {loc.lat?<div style={{flex:1,background:C.greenL,border:"1px solid #A7F3D0",borderRadius:9,padding:"9px 12px",fontSize:12,color:C.green,fontWeight:600}}>📍 {loc.lat}, {loc.lng}</div>
            :<Btn onClick={capturePos} variant="secondary" icon="📍">{gpsLoading?"Acquisition...":"Capturer ma position"}</Btn>}
            {loc.lat&&<Btn onClick={()=>setLoc({lat:"",lng:""})} variant="danger" sm icon="✕">Effacer</Btn>}
          </div>
        </div>
        <Btn onClick={submit} disabled={saving} icon={saving?"⏳":"📤"}>{saving?"Envoi...":"Envoyer le signalement"}</Btn>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🗺️  LOCALISATION — SUPERVISEUR & DIRECTEUR
// ════════════════════════════════════════════════════════
function LocalisationMap() {
  const [points,setPoints]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selId,setSelId]=useState(null);
  const mapRef=useRef(null); const mapInst=useRef(null); const timerRef=useRef(null);

  const load=useCallback(async()=>{
    const data=await loadGPSToday();
    setPoints(data); setLoading(false);
  },[]);

  useEffect(()=>{
    load();
    timerRef.current=setInterval(load,30000);
    return()=>clearInterval(timerRef.current);
  },[load]);

  useEffect(()=>{
    if(!points.length||!mapRef.current) return;
    const initMap=()=>{
      if(mapInst.current){mapInst.current.remove();mapInst.current=null;}
      const L=window.L;
      const map=L.map(mapRef.current).setView([-4.3217,15.3222],12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      const byDel={};
      points.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={info:p,pts:[]};byDel[p.delegue_id].pts.push([p.lat,p.lng]);});
      Object.values(byDel).forEach((d,i)=>{
        const col=CHART_COLS[i%CHART_COLS.length];
        if(d.pts.length>1) L.polyline(d.pts,{color:col,weight:3,opacity:0.8}).addTo(map);
        L.circleMarker(d.pts[d.pts.length-1],{radius:8,color:col,fillColor:col,fillOpacity:1}).addTo(map)
          .bindPopup(`<b>${d.info.prenom} ${d.info.nom}</b><br>N°${d.info.num||"—"}<br><small>${new Date(d.info.created_at).toLocaleTimeString("fr-FR")}</small>`);
      });
      if(points.length) map.fitBounds(points.map(p=>[p.lat,p.lng]),{padding:[20,20]});
      mapInst.current=map;
    };
    if(window.L){initMap();return;}
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}
    if(!document.getElementById("lf-js")){const s=document.createElement("script");s.id="lf-js";s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=initMap;document.head.appendChild(s);}
    else setTimeout(()=>{if(window.L)initMap();},500);
  },[points]);

  const byDel={};
  points.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={id:p.delegue_id,nom:p.nom,prenom:p.prenom,num:p.num,pts:[]};byDel[p.delegue_id].pts.push(p);});
  const delList=Object.values(byDel);

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🗺️ Localisation des Délégués" sub={`Terrain aujourd'hui · Actualisation auto toutes les 30s`} action={<Btn onClick={load} variant="secondary" icon="🔄">Actualiser</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:16}}>
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>Délégués actifs ({delList.length})</div>
            {loading&&<div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:13}}>⏳ Chargement...</div>}
            {!loading&&!delList.length&&<div style={{textAlign:"center",color:C.muted,padding:"24px 0"}}><div style={{fontSize:32,marginBottom:8}}>📍</div><div style={{fontSize:12}}>Aucun délégué actif aujourd'hui</div></div>}
            {delList.map((d,i)=>{
              const last=d.pts[d.pts.length-1];
              return (
                <div key={d.id} onClick={()=>setSelId(selId===d.id?null:d.id)}
                  style={{padding:"10px 12px",borderRadius:9,marginBottom:6,cursor:"pointer",border:`2px solid ${selId===d.id?CHART_COLS[i%CHART_COLS.length]:C.border}`,background:selId===d.id?C.skyLL:C.bg,transition:"all 0.12s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:CHART_COLS[i%CHART_COLS.length],flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.prenom} {d.nom}</div>
                      <div style={{fontSize:10,color:C.muted}}>N°{d.num||"—"} · {d.pts.length} point(s)</div>
                    </div>
                  </div>
                  {selId===d.id&&last&&(
                    <div style={{marginTop:8,fontSize:10,color:C.muted,lineHeight:1.7,background:C.white,borderRadius:6,padding:"6px 8px"}}>
                      <div>📍 {last.lat}, {last.lng}</div>
                      <div>🕐 {new Date(last.created_at).toLocaleTimeString("fr-FR")}</div>
                      <div>🎯 ±{last.accuracy}m</div>
                      <a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:4,color:C.sky,fontWeight:600,textDecoration:"none"}}>📌 Voir sur Maps →</a>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
        <div ref={mapRef} style={{height:"calc(100vh - 200px)",minHeight:440,borderRadius:14,border:`1px solid ${C.border}`,background:C.bg,position:"relative"}}>
          {!points.length&&!loading&&(
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:C.muted}}>
              <div style={{fontSize:40}}>🗺️</div>
              <div style={{fontSize:14,fontWeight:600}}>Aucune donnée GPS aujourd'hui</div>
              <div style={{fontSize:12}}>Les délégués doivent activer leur GPS terrain</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// ⚠️  PLAINTES — SUPERVISEUR & DIRECTEUR
// ════════════════════════════════════════════════════════
function PlaintesView() {
  const [plaintes,setPlaintes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");

  useEffect(()=>{loadPlaintes().then(d=>{setPlaintes(d);setLoading(false);});},[]);

  const update=async(id,statut)=>{
    await updatePlainteStatut(id,statut);
    setPlaintes(prev=>prev.map(p=>p.id===id?{...p,statut}:p));
  };

  const filtered=filter==="all"?plaintes:plaintes.filter(p=>p.statut===filter);
  const urgColor={normale:C.amber,haute:"#F97316",critique:C.red};
  const statColor={nouveau:{bg:C.redL,c:C.red},en_cours:{bg:C.amberL,c:C.amber},traite:{bg:C.greenL,c:C.green}};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="⚠️ Signalements & Plaintes" sub={`${plaintes.length} signalement(s) au total`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        <StatCard icon="🔴" label="Nouveaux" value={plaintes.filter(p=>p.statut==="nouveau").length} color={C.red}/>
        <StatCard icon="🟡" label="En cours" value={plaintes.filter(p=>p.statut==="en_cours").length} color={C.amber}/>
        <StatCard icon="✅" label="Traités" value={plaintes.filter(p=>p.statut==="traite").length} color={C.green}/>
        <StatCard icon="🚨" label="Critiques" value={plaintes.filter(p=>p.urgence==="critique").length} color={C.red}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["all","Tous"],["nouveau","Nouveaux"],["en_cours","En cours"],["traite","Traités"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:"7px 16px",borderRadius:999,border:`1.5px solid ${filter===v?C.sky:C.border}`,background:filter===v?C.sky:C.white,color:filter===v?"#FFF":C.muted,fontWeight:filter===v?700:500,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{l}</button>
        ))}
      </div>
      {loading&&<div style={{textAlign:"center",padding:48,color:C.muted}}>⏳ Chargement...</div>}
      {!loading&&!filtered.length&&<Card style={{textAlign:"center",padding:48,color:C.muted}}>Aucun signalement trouvé.</Card>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(p=>{
          const sc=statColor[p.statut]||statColor.nouveau;
          return (
            <Card key={p.id} style={{borderLeft:`4px solid ${urgColor[p.urgence]||C.amber}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.prenom} {p.nom}</div>
                    <Badge color="sky">N°{p.num||"—"}</Badge>
                    <span style={{background:urgColor[p.urgence]+"22",color:urgColor[p.urgence],fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999}}>{(p.urgence||"").toUpperCase()}</span>
                    <span style={{background:sc.bg,color:sc.c,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999}}>{(p.statut||"").replace("_"," ")}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:C.nav1,marginBottom:4}}>📋 {p.type_plainte}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{p.description}</div>
                  <div style={{display:"flex",gap:12,marginTop:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:C.light}}>🕐 {new Date(p.created_at).toLocaleString("fr-FR")}</span>
                    {p.lat&&p.lng&&<a href={`https://maps.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.sky,fontWeight:600,textDecoration:"none"}}>📍 Voir position</a>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {p.statut!=="en_cours"&&<Btn onClick={()=>update(p.id,"en_cours")} variant="secondary" icon="🔄" sm>En cours</Btn>}
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

// ════════════════════════════════════════════════════════
// 📊  DASHBOARD
// ════════════════════════════════════════════════════════
function Dashboard({user}) {
  const all=loadReports();
  const now=new Date(); const month=now.getMonth();
  const todayR=all.filter(r=>r.date===todayISO());
  const monthR=all.filter(r=>new Date(r.date).getMonth()===month);
  const totalCA=all.reduce((s,r)=>s+(r.totalCA||0),0);
  const monthCA=monthR.reduce((s,r)=>s+(r.totalCA||0),0);

  const byDel={};
  all.forEach(r=>{const k=`${r.prenom} ${(r.nom||"").split(" ")[0]}`;byDel[k]=(byDel[k]||0)+(r.totalCA||0);});
  const barData=Object.entries(byDel).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,ca])=>({name,ca:parseFloat(ca.toFixed(2))}));

  const trendData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-6+i);
    const iso=d.toISOString().split("T")[0];
    const ca=all.filter(r=>r.date===iso).reduce((s,r)=>s+(r.totalCA||0),0);
    return {jour:d.toLocaleDateString("fr-FR",{weekday:"short"}),ca:parseFloat(ca.toFixed(2))};
  });

  const pCount={};
  all.forEach(r=>r.lignes?.forEach(l=>{pCount[l.code]=(pCount[l.code]||0)+(l.qte||0);}));
  const pieData=Object.entries(pCount).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:19,fontWeight:800,color:C.text,margin:"0 0 3px"}}>Tableau de bord commercial</h1>
        <p style={{color:C.muted,fontSize:12,margin:0}}>LabPro Pharma RDC · {todayFR()} · {ROLE_LABEL[user.role]}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        <StatCard icon="📊" label="Rapports aujourd'hui" value={todayR.length} color={C.sky}/>
        <StatCard icon="📅" label="Rapports ce mois" value={monthR.length} color={C.nav2}/>
        <StatCard icon="💰" label="CA mensuel (USD)" value={`$${fmt(monthCA)}`} color={C.green}/>
        <StatCard icon="🏆" label="CA global (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,marginBottom:16}}>
        <Card>
          <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px"}}>📈 Évolution CA — 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/>
              <XAxis dataKey="jour" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:11}}/>
              <Line type="monotone" dataKey="ca" stroke={C.sky} strokeWidth={2.5} dot={{r:4,fill:C.sky}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px"}}>🧪 Top produits</h3>
          {pieData.length
            ? <ResponsiveContainer width="100%" height={190}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={82} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={CHART_COLS[i%CHART_COLS.length]}/>)}</Pie><Tooltip contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:11}}/><Legend wrapperStyle={{fontSize:10}}/></PieChart></ResponsiveContainer>
            : <div style={{height:190,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucune donnée</div>
          }
        </Card>
      </div>
      <Card>
        <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px"}}>👥 CA par délégué</h3>
        {barData.length
          ? <ResponsiveContainer width="100%" height={195}><BarChart data={barData} barSize={34}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:11}}/><Bar dataKey="ca" fill={C.sky} radius={[6,6,0,0]} label={{position:"top",fontSize:10,fill:C.muted,formatter:v=>v>0?`$${v}`:""}} /></BarChart></ResponsiveContainer>
          : <div style={{height:195,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucun rapport enregistré.</div>
        }
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📋  TOUS LES RAPPORTS
// ════════════════════════════════════════════════════════
function TousLesRapports() {
  const [search,setSearch]=useState(""); const [dateF,setDateF]=useState(""); const [exp,setExp]=useState(null);
  const all=loadReports();
  const filtered=all.filter(r=>{
    const q=search.toLowerCase();
    return(!search||`${r.prenom} ${r.nom} ${r.secteurs}`.toLowerCase().includes(q)||r.lignes?.some(l=>l.client.toLowerCase().includes(q)))&&(!dateF||r.date===dateF);
  }).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Tous les rapports" sub={`${filtered.length} rapport(s)`} action={<Btn onClick={()=>exportExcelCompil(filtered,"Tous Rapports")} icon="⬇">Exporter Excel</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,marginBottom:16,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.light}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher délégué, secteur, client..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px 9px 34px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#F8FCFF"}}/>
        </div>
        <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#F8FCFF"}}/>
        {(search||dateF)&&<Btn onClick={()=>{setSearch("");setDateF("");}} variant="danger" sm icon="✕">Effacer</Btn>}
      </div>
      {!filtered.length?<Card style={{textAlign:"center",padding:48,color:C.muted}}>Aucun rapport trouvé.</Card>:
      <Card p="0" style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>
            {["Délégué","N°","Date","Secteurs","Ventes","Clients","CA (USD)","Actions"].map(h=>(
              <th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(r=>(
              <>
              <tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`,cursor:"pointer"}}
                onClick={()=>setExp(exp===r.id?null:r.id)}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 13px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:700,flexShrink:0}}>{initials(r)}</div>
                    <span style={{fontSize:12,fontWeight:700,color:C.text}}>{r.prenom} {r.nom}</span>
                  </div>
                </td>
                <td style={{padding:"10px 13px"}}><Badge color="navy">{r.num||"—"}</Badge></td>
                <td style={{padding:"10px 13px",fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{r.date}</td>
                <td style={{padding:"10px 13px",fontSize:11,color:C.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
                <td style={{padding:"10px 13px"}}><Badge>{r.lignes?.length||0}</Badge></td>
                <td style={{padding:"10px 13px"}}><Badge color="green">{r.nbClients}</Badge></td>
                <td style={{padding:"10px 13px",fontSize:13,fontWeight:800,color:C.green}}>{fmt(r.totalCA)} $</td>
                <td style={{padding:"10px 13px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <Btn onClick={e=>{e.stopPropagation();exportExcel(r);}} variant="success" icon="⬇" sm>XLS</Btn>
                    <span style={{color:C.light,alignSelf:"center",fontSize:13}}>{exp===r.id?"▲":"▼"}</span>
                  </div>
                </td>
              </tr>
              {exp===r.id&&(
                <tr key={r.id+"_e"}><td colSpan={8} style={{padding:0}}>
                  <div style={{background:"#F8FCFF",padding:"12px 16px",borderBottom:`2px solid ${C.border}`}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead><tr>{["Code","Item","Qté","Montant","Client","Adresse","Tél","GPS"].map(h=>(
                        <th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`,textTransform:"uppercase"}}>{h}</th>
                      ))}</tr></thead>
                      <tbody>{(r.lignes||[]).map((l,i)=>(
                        <tr key={i} style={{borderBottom:`1px solid ${C.skyLL}`}}>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:700,color:C.nav1}}>{l.code}</td>
                          <td style={{padding:"6px 10px"}}>{l.item}</td>
                          <td style={{padding:"6px 10px",textAlign:"center",fontWeight:600}}>{l.qte}</td>
                          <td style={{padding:"6px 10px",fontWeight:700,color:C.green}}>{fmt(l.montant)}$</td>
                          <td style={{padding:"6px 10px",fontWeight:500}}>{l.client}</td>
                          <td style={{padding:"6px 10px",color:C.muted}}>{l.adresse}</td>
                          <td style={{padding:"6px 10px",color:C.muted}}>{l.tel}</td>
                          <td style={{padding:"6px 10px",fontSize:10,color:C.sky}}>{l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </td></tr>
              )}
              </>
            ))}
          </tbody>
        </table>
      </Card>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🏆  CLASSEMENT
// ════════════════════════════════════════════════════════
function Classement() {
  const all=loadReports();
  const month=new Date().getMonth();
  const mR=all.filter(r=>new Date(r.date).getMonth()===month);
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
  const mColors=[C.amber,"#94A3B8","#CD7F32"];
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🏆 Classement des Délégués" sub={new Date().toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}/>
      {!ranking.length?<Card style={{textAlign:"center",padding:56,color:C.muted}}>Aucune donnée ce mois.</Card>:<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
          {ranking.slice(0,3).map((d,i)=>(
            <Card key={i} style={{textAlign:"center",border:`2px solid ${mColors[i]||C.border}`,boxShadow:i===0?"0 8px 28px rgba(217,119,6,0.15)":"none"}}>
              <div style={{fontSize:40,marginBottom:8}}>{medals[i]}</div>
              <div style={{width:48,height:48,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,color:"#FFF",margin:"0 auto 10px"}}>{initials(d)}</div>
              <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 4px"}}>{d.prenom} {(d.nom||"").split(" ")[0]}</h3>
              <div style={{fontSize:20,fontWeight:800,color:mColors[i],margin:"5px 0 8px"}}>${fmt(d.ca)}</div>
              <div style={{display:"flex",justifyContent:"center",gap:5,flexWrap:"wrap"}}>
                <Badge color={i===0?"amber":"sky"}>{d.ventes} ventes</Badge>
                <Badge color="green">{d.clients} clients</Badge>
              </div>
            </Card>
          ))}
        </div>
        <Card p="0" style={{overflow:"hidden"}}>
          <div style={{padding:"12px 16px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:700,margin:0}}>Classement complet</h3></div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg}}>
              {["Rang","N°","Délégué(e)","CA Total (USD)","Ventes","Clients","Jours actifs","Performance"].map(h=>(
                <th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{ranking.map((d,i)=>(
              <tr key={d.id} style={{borderBottom:`1px solid ${C.skyLL}`,background:i===0?"#FFFBEB":"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background=i===0?"#FEF3C7":C.bg}
                onMouseLeave={e=>e.currentTarget.style.background=i===0?"#FFFBEB":"transparent"}>
                <td style={{padding:"12px 13px",fontSize:20}}>{medals[i]||`#${i+1}`}</td>
                <td style={{padding:"12px 13px"}}><Badge color="navy">{d.num||"—"}</Badge></td>
                <td style={{padding:"12px 13px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:32,height:32,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:11,fontWeight:700}}>{initials(d)}</div><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{d.prenom} {d.nom}</div><div style={{fontSize:10,color:C.light}}>Délégué(e)</div></div></div></td>
                <td style={{padding:"12px 13px",fontSize:14,fontWeight:800,color:C.green}}>{fmt(d.ca)} $</td>
                <td style={{padding:"12px 13px"}}><Badge>{d.ventes}</Badge></td>
                <td style={{padding:"12px 13px"}}><Badge color="green">{d.clients}</Badge></td>
                <td style={{padding:"12px 13px"}}><Badge color="navy">{d.jours} j</Badge></td>
                <td style={{padding:"12px 13px",minWidth:120}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{background:C.bg,borderRadius:4,height:6,flex:1}}><div style={{background:i===0?C.amber:C.sky,borderRadius:4,height:6,width:`${Math.min(100,Math.round((d.jours/22)*100))}%`}}/></div><span style={{fontSize:11,fontWeight:700,color:C.muted,minWidth:28}}>{Math.min(100,Math.round((d.jours/22)*100))}%</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      </>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📅  COMPILATION HEBDO / MENSUELLE
// ════════════════════════════════════════════════════════
function Compilation({type}) {
  const all=loadReports(); const now=new Date();
  let filtered,titre;
  if(type==="hebdo"){const ws=new Date();ws.setDate(ws.getDate()-7);filtered=all.filter(r=>new Date(r.date)>=ws);titre=`Semaine du ${ws.toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;}
  else{filtered=all.filter(r=>new Date(r.date).getMonth()===now.getMonth());titre=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});}
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
      <PageTitle title={type==="hebdo"?"📅 Rapport Hebdomadaire":"🗓 Rapport Mensuel"} sub={titre} action={<Btn onClick={()=>exportExcelCompil(filtered,titre)} icon="⬇">Exporter Excel</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        <StatCard icon="📊" label="Rapports" value={filtered.length} color={C.sky}/>
        <StatCard icon="👥" label="Délégués actifs" value={rows.length} color={C.nav2}/>
        <StatCard icon="🛍" label="Total ventes" value={rows.reduce((s,r)=>s+r.ventes,0)} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>
      {chartData.length>0&&<Card style={{marginBottom:16}}>
        <h3 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px"}}>📊 Performance comparée</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={36}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/><Tooltip formatter={(v,n)=>[n==="ca"?`$${fmt(v)}`:v,n==="ca"?"CA":"Ventes"]} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:11}}/><Legend wrapperStyle={{fontSize:11}}/><Bar dataKey="ca" name="CA (USD)" fill={C.sky} radius={[5,5,0,0]}/><Bar dataKey="ventes" name="Ventes" fill={C.green} radius={[5,5,0,0]}/></BarChart>
        </ResponsiveContainer>
      </Card>}
      <Card p="0" style={{overflow:"hidden"}}>
        <div style={{padding:"12px 16px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:700,margin:0}}>Récapitulatif</h3></div>
        {!rows.length?<div style={{padding:40,textAlign:"center",color:C.muted}}>Aucune donnée.</div>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>{["Rang","N°","Délégué(e)","Rapports","Ventes","Clients","CA (USD)","Part (%)"].map(h=>(
            <th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
          ))}</tr></thead>
          <tbody>{rows.map((r,i)=>{const pct=totalCA>0?Math.round((r.ca/totalCA)*100):0;return(
            <tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"11px 13px",fontWeight:700,color:C.muted}}>#{i+1}</td>
              <td style={{padding:"11px 13px"}}><Badge color="navy">{r.num||"—"}</Badge></td>
              <td style={{padding:"11px 13px",fontSize:12,fontWeight:700,color:C.text}}>{r.prenom} {r.nom}</td>
              <td style={{padding:"11px 13px"}}><Badge color="navy">{r.rapports}</Badge></td>
              <td style={{padding:"11px 13px"}}><Badge>{r.ventes}</Badge></td>
              <td style={{padding:"11px 13px"}}><Badge color="green">{r.clients}</Badge></td>
              <td style={{padding:"11px 13px",fontSize:13,fontWeight:800,color:C.green}}>{fmt(r.ca)} $</td>
              <td style={{padding:"11px 13px",minWidth:110}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{background:C.bg,borderRadius:4,height:6,flex:1}}><div style={{background:C.sky,borderRadius:4,height:6,width:`${pct}%`}}/></div><span style={{fontSize:11,fontWeight:700,color:C.muted,minWidth:26}}>{pct}%</span></div></td>
            </tr>
          );})}
          </tbody>
          <tfoot><tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
            <td colSpan={6} style={{padding:"11px 13px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL GÉNÉRAL</td>
            <td style={{padding:"11px 13px",fontSize:14,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
            <td style={{padding:"11px 13px",fontSize:12,fontWeight:700,color:C.muted}}>100%</td>
          </tr></tfoot>
        </table>}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🏠  APP ROOT
// ════════════════════════════════════════════════════════
const defaultView = role => role==="delegue"?"rapport":role==="comptable"?"dashboard_c":role==="superviseur"?"localisation":"dashboard";

export default function App() {
  const [user,   setUser]   = useState(null);
  const [view,   setView]   = useState("");
  const [booted, setBooted] = useState(false);

  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',system-ui,sans-serif;background:#F0F9FF;-webkit-font-smoothing:antialiased;}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#F0F9FF}::-webkit-scrollbar-thumb{background:#BAE6FD;border-radius:3px}@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}`;
    document.head.appendChild(s);

    db.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){
        const profile=await getProfile(session.user.id);
        if(profile&&profile.actif){setUser({...profile,authId:session.user.id});setView(defaultView(profile.role));}
        else await db.auth.signOut();
      }
      setBooted(true);
    });

    const {data:{subscription}}=db.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_OUT"){setUser(null);setView("");}
    });

    return()=>{document.head.removeChild(s);subscription.unsubscribe();};
  },[]);

  const onLogin =u=>{setUser(u);setView(defaultView(u.role));};
  const onLogout=async()=>{await db.auth.signOut();setUser(null);setView("");};

  if(!booted) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,#0C4A6E,#0EA5E9)`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{fontSize:52}}>💊</div>
      <div style={{color:"rgba(255,255,255,0.6)",fontSize:14}}>Chargement de LabPro Sales...</div>
    </div>
  );

  if(!user) return <AuthPage onLogin={onLogin}/>;

  const renderView=()=>{
    switch(view){
      case "rapport":      return <NouveauRapport user={user}/>;
      case "historique":   return <HistoriqueDelegue user={user}/>;
      case "gps":          return <GPSTerrain user={user}/>;
      case "plainte":      return <PlainteForm user={user}/>;
      case "localisation": return <LocalisationMap/>;
      case "plaintes":     return <PlaintesView/>;
      case "dashboard":
      case "dashboard_c":  return <Dashboard user={user}/>;
      case "rapports":
      case "rapports_c":   return <TousLesRapports/>;
      case "hebdo":        return <Compilation type="hebdo"/>;
      case "mensuel":      return <Compilation type="mensuel"/>;
      case "classement":   return <Classement/>;
      case "users":        return user.role==="directeur"?<GestionUtilisateurs/>:<Dashboard user={user}/>;
      default:             return <Dashboard user={user}/>;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <Sidebar user={user} view={view} setView={setView} onLogout={onLogout}/>
      <main style={{flex:1,marginLeft:238,padding:"26px 30px",minHeight:"100vh",overflowX:"hidden",background:"#F0F9FF"}}>
        {renderView()}
      </main>
    </div>
  );
}
