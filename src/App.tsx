import { useState, useMemo, useRef } from "react";

// ============================================================
// DADOS DOS ELEMENTOS
// ============================================================
const ELECTRONEGATIVITY = {
  1:2.20,3:0.98,4:1.57,5:2.04,6:2.55,7:3.04,8:3.44,9:3.98,
  11:0.93,12:1.31,13:1.61,14:1.90,15:2.19,16:2.58,17:3.16,
  19:0.82,20:1.00,21:1.36,22:1.54,23:1.63,24:1.66,25:1.55,26:1.83,
  27:1.88,28:1.91,29:1.90,30:1.65,31:1.81,32:2.01,33:2.18,34:2.55,35:2.96,
  37:0.82,38:0.95,39:1.22,40:1.33,41:1.6,42:2.16,43:1.9,44:2.2,45:2.28,
  46:2.20,47:1.93,48:1.69,49:1.78,50:1.96,51:2.05,52:2.1,53:2.66,
  55:0.79,56:0.89,72:1.3,73:1.5,74:2.36,75:1.9,76:2.2,77:2.2,78:2.28,
  79:2.54,80:2.00,81:1.62,82:2.33,83:2.02,84:2.0,85:2.2,87:0.7,88:0.9,92:1.38
};

const ELEMENT_INFO = {
  1:{s:"H",n:"Hidrogênio",m:1.008,cat:"ametal",c:"1s¹"},
  2:{s:"He",n:"Hélio",m:4.0026,cat:"gas-nobre",c:"1s²"},
  3:{s:"Li",n:"Lítio",m:6.94,cat:"metal-alcalino",c:"1s² 2s¹"},
  4:{s:"Be",n:"Berílio",m:9.0122,cat:"metal-alcalino-terroso",c:"1s² 2s²"},
  5:{s:"B",n:"Boro",m:10.81,cat:"semimetal",c:"1s² 2s² 2p¹"},
  6:{s:"C",n:"Carbono",m:12.011,cat:"ametal",c:"1s² 2s² 2p²"},
  7:{s:"N",n:"Nitrogênio",m:14.007,cat:"ametal",c:"1s² 2s² 2p³"},
  8:{s:"O",n:"Oxigênio",m:15.999,cat:"ametal",c:"1s² 2s² 2p⁴"},
  9:{s:"F",n:"Flúor",m:18.998,cat:"halogênio",c:"1s² 2s² 2p⁵"},
  10:{s:"Ne",n:"Neônio",m:20.180,cat:"gas-nobre",c:"1s² 2s² 2p⁶"},
  11:{s:"Na",n:"Sódio",m:22.990,cat:"metal-alcalino",c:"[Ne] 3s¹"},
  12:{s:"Mg",n:"Magnésio",m:24.305,cat:"metal-alcalino-terroso",c:"[Ne] 3s²"},
  13:{s:"Al",n:"Alumínio",m:26.982,cat:"metal-pos-transicao",c:"[Ne] 3s² 3p¹"},
  14:{s:"Si",n:"Silício",m:28.085,cat:"semimetal",c:"[Ne] 3s² 3p²"},
  15:{s:"P",n:"Fósforo",m:30.974,cat:"ametal",c:"[Ne] 3s² 3p³"},
  16:{s:"S",n:"Enxofre",m:32.06,cat:"ametal",c:"[Ne] 3s² 3p⁴"},
  17:{s:"Cl",n:"Cloro",m:35.45,cat:"halogênio",c:"[Ne] 3s² 3p⁵"},
  18:{s:"Ar",n:"Argônio",m:39.948,cat:"gas-nobre",c:"[Ne] 3s² 3p⁶"},
  19:{s:"K",n:"Potássio",m:39.098,cat:"metal-alcalino",c:"[Ar] 4s¹"},
  20:{s:"Ca",n:"Cálcio",m:40.078,cat:"metal-alcalino-terroso",c:"[Ar] 4s²"},
  21:{s:"Sc",n:"Escândio",m:44.956,cat:"metal-de-transicao"},
  22:{s:"Ti",n:"Titânio",m:47.867,cat:"metal-de-transicao"},
  23:{s:"V",n:"Vanádio",m:50.942,cat:"metal-de-transicao"},
  24:{s:"Cr",n:"Cromo",m:51.996,cat:"metal-de-transicao"},
  25:{s:"Mn",n:"Manganês",m:54.938,cat:"metal-de-transicao"},
  26:{s:"Fe",n:"Ferro",m:55.845,cat:"metal-de-transicao",c:"[Ar] 3d⁶ 4s²"},
  27:{s:"Co",n:"Cobalto",m:58.933,cat:"metal-de-transicao"},
  28:{s:"Ni",n:"Níquel",m:58.693,cat:"metal-de-transicao"},
  29:{s:"Cu",n:"Cobre",m:63.546,cat:"metal-de-transicao"},
  30:{s:"Zn",n:"Zinco",m:65.38,cat:"metal-de-transicao",c:"[Ar] 3d¹⁰ 4s²"},
  31:{s:"Ga",n:"Gálio",m:69.723,cat:"metal-pos-transicao"},
  32:{s:"Ge",n:"Germânio",m:72.63,cat:"semimetal"},
  33:{s:"As",n:"Arsênio",m:74.922,cat:"semimetal"},
  34:{s:"Se",n:"Selênio",m:78.971,cat:"ametal"},
  35:{s:"Br",n:"Bromo",m:79.904,cat:"halogênio"},
  36:{s:"Kr",n:"Criptônio",m:83.798,cat:"gas-nobre"},
  37:{s:"Rb",n:"Rubídio",m:85.468,cat:"metal-alcalino"},
  38:{s:"Sr",n:"Estrôncio",m:87.62,cat:"metal-alcalino-terroso"},
  39:{s:"Y",n:"Ítrio",m:88.906,cat:"metal-de-transicao"},
  40:{s:"Zr",n:"Zircônio",m:91.224,cat:"metal-de-transicao"},
  41:{s:"Nb",n:"Nióbio",m:92.906,cat:"metal-de-transicao"},
  42:{s:"Mo",n:"Molibdênio",m:95.95,cat:"metal-de-transicao"},
  43:{s:"Tc",n:"Tecnécio",m:98,cat:"metal-de-transicao"},
  44:{s:"Ru",n:"Rutênio",m:101.07,cat:"metal-de-transicao"},
  45:{s:"Rh",n:"Ródio",m:102.91,cat:"metal-de-transicao"},
  46:{s:"Pd",n:"Paládio",m:106.42,cat:"metal-de-transicao"},
  47:{s:"Ag",n:"Prata",m:107.87,cat:"metal-de-transicao",c:"[Kr] 4d¹⁰ 5s¹"},
  48:{s:"Cd",n:"Cádmio",m:112.41,cat:"metal-de-transicao"},
  49:{s:"In",n:"Índio",m:114.82,cat:"metal-pos-transicao"},
  50:{s:"Sn",n:"Estanho",m:118.71,cat:"metal-pos-transicao"},
  51:{s:"Sb",n:"Antimônio",m:121.76,cat:"semimetal"},
  52:{s:"Te",n:"Telúrio",m:127.6,cat:"semimetal"},
  53:{s:"I",n:"Iodo",m:126.9,cat:"halogênio"},
  54:{s:"Xe",n:"Xenônio",m:131.29,cat:"gas-nobre"},
  55:{s:"Cs",n:"Césio",m:132.91,cat:"metal-alcalino"},
  56:{s:"Ba",n:"Bário",m:137.33,cat:"metal-alcalino-terroso"},
  57:{s:"La",n:"Lantânio",m:138.91,cat:"lantanideo"},
  58:{s:"Ce",n:"Cério",m:140.12,cat:"lantanideo"},
  59:{s:"Pr",n:"Praseodímio",m:140.91,cat:"lantanideo"},
  60:{s:"Nd",n:"Neodímio",m:144.24,cat:"lantanideo"},
  61:{s:"Pm",n:"Promécio",m:145,cat:"lantanideo"},
  62:{s:"Sm",n:"Samário",m:150.36,cat:"lantanideo"},
  63:{s:"Eu",n:"Európio",m:151.96,cat:"lantanideo"},
  64:{s:"Gd",n:"Gadolínio",m:157.25,cat:"lantanideo"},
  65:{s:"Tb",n:"Térbio",m:158.93,cat:"lantanideo"},
  66:{s:"Dy",n:"Disprósio",m:162.5,cat:"lantanideo"},
  67:{s:"Ho",n:"Hólmio",m:164.93,cat:"lantanideo"},
  68:{s:"Er",n:"Érbio",m:167.26,cat:"lantanideo"},
  69:{s:"Tm",n:"Túlio",m:168.93,cat:"lantanideo"},
  70:{s:"Yb",n:"Itérbio",m:173.05,cat:"lantanideo"},
  71:{s:"Lu",n:"Lutécio",m:174.97,cat:"lantanideo"},
  72:{s:"Hf",n:"Háfnio",m:178.49,cat:"metal-de-transicao"},
  73:{s:"Ta",n:"Tântalo",m:180.95,cat:"metal-de-transicao"},
  74:{s:"W",n:"Tungstênio",m:183.84,cat:"metal-de-transicao"},
  75:{s:"Re",n:"Rênio",m:186.21,cat:"metal-de-transicao"},
  76:{s:"Os",n:"Ósmio",m:190.23,cat:"metal-de-transicao"},
  77:{s:"Ir",n:"Irídio",m:192.22,cat:"metal-de-transicao"},
  78:{s:"Pt",n:"Platina",m:195.08,cat:"metal-de-transicao"},
  79:{s:"Au",n:"Ouro",m:196.97,cat:"metal-de-transicao",c:"[Xe] 4f¹⁴ 5d¹⁰ 6s¹"},
  80:{s:"Hg",n:"Mercúrio",m:200.59,cat:"metal-de-transicao",c:"[Xe] 4f¹⁴ 5d¹⁰ 6s²"},
  81:{s:"Tl",n:"Tálio",m:204.38,cat:"metal-pos-transicao"},
  82:{s:"Pb",n:"Chumbo",m:207.2,cat:"metal-pos-transicao",c:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²"},
  83:{s:"Bi",n:"Bismuto",m:208.98,cat:"metal-pos-transicao"},
  84:{s:"Po",n:"Polônio",m:209,cat:"metal-pos-transicao"},
  85:{s:"At",n:"Astato",m:210,cat:"halogênio"},
  86:{s:"Rn",n:"Radônio",m:222,cat:"gas-nobre"},
  87:{s:"Fr",n:"Frâncio",m:223,cat:"metal-alcalino"},
  88:{s:"Ra",n:"Rádio",m:226,cat:"metal-alcalino-terroso"},
  89:{s:"Ac",n:"Actínio",m:227,cat:"actinideo"},
  90:{s:"Th",n:"Tório",m:232.04,cat:"actinideo"},
  91:{s:"Pa",n:"Protactínio",m:231.04,cat:"actinideo"},
  92:{s:"U",n:"Urânio",m:238.03,cat:"actinideo",c:"[Rn] 5f³ 6d¹ 7s²"},
  93:{s:"Np",n:"Netúnio",m:237,cat:"actinideo"},
  94:{s:"Pu",n:"Plutônio",m:244,cat:"actinideo"},
  95:{s:"Am",n:"Amerício",m:243,cat:"actinideo"},
  96:{s:"Cm",n:"Cúrio",m:247,cat:"actinideo"},
  97:{s:"Bk",n:"Berquélio",m:247,cat:"actinideo"},
  98:{s:"Cf",n:"Califórnio",m:251,cat:"actinideo"},
  99:{s:"Es",n:"Enstênio",m:252,cat:"actinideo"},
  100:{s:"Fm",n:"Férmio",m:257,cat:"actinideo"},
  101:{s:"Md",n:"Mendelévio",m:258,cat:"actinideo"},
  102:{s:"No",n:"Nobélio",m:259,cat:"actinideo"},
  103:{s:"Lr",n:"Laurêncio",m:262,cat:"actinideo"},
  104:{s:"Rf",n:"Rutherfórdio",m:267,cat:"metal-de-transicao"},
  105:{s:"Db",n:"Dúbnio",m:270,cat:"metal-de-transicao"},
  106:{s:"Sg",n:"Seabórgio",m:271,cat:"metal-de-transicao"},
  107:{s:"Bh",n:"Bóhrio",m:270,cat:"metal-de-transicao"},
  108:{s:"Hs",n:"Hássio",m:277,cat:"metal-de-transicao"},
  109:{s:"Mt",n:"Meitnério",m:276,cat:"metal-de-transicao"},
  110:{s:"Ds",n:"Darmstádio",m:281,cat:"metal-de-transicao"},
  111:{s:"Rg",n:"Roentgênio",m:280,cat:"metal-de-transicao"},
  112:{s:"Cn",n:"Copernício",m:285,cat:"metal-de-transicao"},
  113:{s:"Nh",n:"Nihônio",m:284,cat:"metal-pos-transicao"},
  114:{s:"Fl",n:"Fleróvio",m:289,cat:"metal-pos-transicao"},
  115:{s:"Mc",n:"Moscóvio",m:288,cat:"metal-pos-transicao"},
  116:{s:"Lv",n:"Livermório",m:293,cat:"metal-pos-transicao"},
  117:{s:"Ts",n:"Tennesso",m:294,cat:"halogênio"},
  118:{s:"Og",n:"Oganésson",m:294,cat:"gas-nobre"},
};

const DYNAMIC_INFO = {
  1:{occurrence:"Elemento mais abundante do universo, presente em estrelas e na água.",applications:["Combustível de foguetes","Produção de amônia","Células de hidrogênio"],biology:"Componente essencial do DNA, proteínas e água.",curiosities:["Único elemento sem nêutrons (Prótio)","Isótopos: Prótio, Deutério e Trítio","Não pertence oficialmente a nenhum grupo"]},
  6:{occurrence:"Base de toda vida orgânica; encontrado em grafite e diamante.",applications:["Combustíveis fósseis","Fibras de carbono","Nanotubos"],biology:"Espinha dorsal de todas as moléculas orgânicas.",curiosities:["Fenômeno da alotropia: grafite e diamante são o mesmo elemento","C-14 usado para datação radiométrica","Forma mais compostos que qualquer outro elemento"]},
  7:{occurrence:"Compõe 78% da atmosfera terrestre.",applications:["Fertilizantes (amônia)","Explosivos","Criogenia"],biology:"Componente de aminoácidos, DNA e clorofila.",curiosities:["N₂ é muito estável (tripla ligação)","Ciclo do nitrogênio é essencial à vida","Líquido a -196°C usado em criogenia"]},
  8:{occurrence:"21% da atmosfera; mais abundante na crosta terrestre (silicatos).",applications:["Respiração médica","Siderurgia","Soldagem"],biology:"Aceitante final de elétrons na respiração celular aeróbia.",curiosities:["O₃ (ozônio) protege contra UV","Oxigênio líquido é paramagnético","Descoberto por Priestley e Scheele independentemente"]},
  11:{occurrence:"Encontrado principalmente no sal de cozinha (NaCl).",applications:["Fabricação de sabão","Iluminação amarela de sódio","Indústria química"],biology:"Essencial para impulsos nervosos (Bomba Na⁺/K⁺).",curiosities:["Reage violentamente com água","Metal mole que pode ser cortado com faca","Flutua na água"]},
  26:{occurrence:"Hematita (Fe₂O₃) e Magnetita (Fe₃O₄) são seus minerais principais.",applications:["Produção de aço","Construção civil","Ímãs"],biology:"Transporta oxigênio na hemoglobina do sangue.",curiosities:["Elemento mais estável nuclearmente","Dá a cor vermelha ao solo de Marte","Brasil é um dos maiores produtores mundiais"]},
};

const CAT_COLORS = {
  'metal-alcalino':'#f43f5e','metal-alcalino-terroso':'#f59e0b',
  'metal-de-transicao':'#8b5cf6','metal-pos-transicao':'#10b981',
  'semimetal':'#06b6d4','ametal':'#3b82f6','halogênio':'#ec4899',
  'gas-nobre':'#a855f7','lantanideo':'#fbbf24','actinideo':'#fb7185',
};

const CAT_LABELS = {
  'metal-alcalino':'Metais Alcalinos','metal-alcalino-terroso':'Alcalinos-Terrosos',
  'metal-de-transicao':'Metais de Transição','metal-pos-transicao':'Metais Pós-Transição',
  'semimetal':'Semimetais','ametal':'Ametais','halogênio':'Halogênios',
  'gas-nobre':'Gases Nobres','lantanideo':'Lantanídeos','actinideo':'Actinídeos',
};

// CPK colors for molecule visualization
const CPK_COLORS = {
  1:"#FFFFFF",6:"#909090",7:"#3050F8",8:"#FF0D0D",9:"#90E050",
  11:"#AB5CF2",12:"#8AFF00",15:"#FF8000",16:"#FFFF30",17:"#1FF01F",
  19:"#8F40D4",20:"#3DFF00",26:"#E06633",29:"#C88033",30:"#7D80B0",
  35:"#A62929",47:"#C0C0C0",53:"#940094",79:"#FFD123",80:"#B8B8D0",
};
const getCPK = (atomicNum) => CPK_COLORS[atomicNum] || "#FF69B4";

const toSup = (n) => {
  const s=["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];
  return n.toString().split("").map(c=>s[parseInt(c)]).join("");
};

const getConfig = (n) => {
  const seq=[{n:"1s",m:2},{n:"2s",m:2},{n:"2p",m:6},{n:"3s",m:2},{n:"3p",m:6},
    {n:"4s",m:2},{n:"3d",m:10},{n:"4p",m:6},{n:"5s",m:2},{n:"4d",m:10},
    {n:"5p",m:6},{n:"6s",m:2},{n:"4f",m:14},{n:"5d",m:10},{n:"6p",m:6},
    {n:"7s",m:2},{n:"5f",m:14},{n:"6d",m:10},{n:"7p",m:6}];
  let rem=n; const cfg=[];
  for(const sub of seq){if(rem<=0)break;const e=Math.min(rem,sub.m);cfg.push(`${sub.n}${toSup(e)}`);rem-=e;}
  return cfg.join(" ");
};

const getPos=(n)=>{
  if(n===1)return{x:1,y:1};if(n===2)return{x:18,y:1};
  if(n>=3&&n<=4)return{x:n-2,y:2};if(n>=5&&n<=10)return{x:n+8,y:2};
  if(n>=11&&n<=12)return{x:n-10,y:3};if(n>=13&&n<=18)return{x:n,y:3};
  if(n>=19&&n<=36)return{x:n-18,y:4};if(n>=37&&n<=54)return{x:n-36,y:5};
  if(n>=55&&n<=56)return{x:n-54,y:6};if(n>=57&&n<=71)return{x:n-54,y:9};
  if(n>=72&&n<=86)return{x:n-68,y:6};if(n>=87&&n<=88)return{x:n-86,y:7};
  if(n>=89&&n<=103)return{x:n-86,y:10};if(n>=104&&n<=118)return{x:n-100,y:7};
  return{x:1,y:1};
};

const GAS_EL=new Set([1,2,7,8,9,10,17,18,36,54,86,118]);
const LIQ_EL=new Set([35,80]);

const buildElements=()=>{
  const list=[];
  for(let i=1;i<=118;i++){
    const info=ELEMENT_INFO[i]||{};const dyn=DYNAMIC_INFO[i]||{};const pos=getPos(i);
    list.push({number:i,symbol:info.s||"?",name:info.n||`Elemento ${i}`,mass:info.m||0,
      category:info.cat||"metal-pos-transicao",period:pos.y<8?pos.y:(pos.y===9?6:7),
      group:pos.y<9?pos.x:"L/A",phase:LIQ_EL.has(i)?'liquid':GAS_EL.has(i)?'gas':'solid',
      config:info.c||getConfig(i),electronegativity:ELECTRONEGATIVITY[i]||null,
      occurrence:dyn.occurrence||"Encontrado em minerais diversos.",
      applications:dyn.applications||["Indústria metalúrgica"],
      biology:dyn.biology||"Sem função biológica conhecida.",
      toxicity:i===80||i===82||i===92||i===81||i===33,
      curiosities:dyn.curiosities||["Elemento estudado em química geral.","Importante para vestibular."],
      x:pos.x,y:pos.y});
  }
  return list;
};

// ============================================================
// BOHR ATOM
// ============================================================
const BohrAtom=({electrons,color,size=180})=>{
  const getShells=(count)=>{const limits=[2,8,18,32,32,18,8];const shells=[];let rem=count;
    for(const lim of limits){if(rem<=0)break;shells.push(Math.min(rem,lim));rem-=Math.min(rem,lim);}return shells;};
  const shells=getShells(electrons);const center=size/2;const baseR=size*0.10;const stepR=size*0.085;
  return(
    <svg width={size} height={size} style={{overflow:'visible'}}>
      <defs><filter id="glow2"><feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle cx={center} cy={center} r={size*0.05} fill={color} filter="url(#glow2)" opacity={0.9}/>
      <circle cx={center} cy={center} r={size*0.03} fill="white" opacity={0.4}/>
      {shells.map((count,si)=>{const r=baseR+si*stepR;return(<g key={si}>
        <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeWidth={0.5} opacity={0.2}/>
        {Array.from({length:count}).map((_,ei)=>{const angle=(ei/count)*2*Math.PI-Math.PI/2;
          return(<circle key={ei} cx={center+Math.cos(angle)*r} cy={center+Math.sin(angle)*r}
            r={size*0.018} fill={color} filter="url(#glow2)" opacity={0.85}/>);})}</g>);})}
    </svg>);
};

// ============================================================
// MOLECULE VISUALIZER (ball-and-stick 2D)
// ============================================================
const MoleculeViewer=({atoms,bonds,title})=>{
  // atoms: [{id, symbol, atomicNum, x, y}]
  // bonds: [{from, to, order}]
  if(!atoms||atoms.length===0) return null;
  const W=280,H=180,pad=30;
  // normalize positions to fit
  if(atoms.length===1){
    const a=atoms[0];
    return(
      <svg width={W} height={H}>
        <circle cx={W/2} cy={H/2} r={22} fill={getCPK(a.atomicNum)} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
        <text x={W/2} y={H/2+1} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={13} fontWeight="bold" fontFamily="monospace">{a.symbol}</text>
      </svg>);
  }
  const xs=atoms.map(a=>a.x),ys=atoms.map(a=>a.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const rangeX=maxX-minX||1,rangeY=maxY-minY||1;
  const scale=Math.min((W-pad*2)/rangeX,(H-pad*2)/rangeY);
  const cx=(W-(rangeX*scale))/2,cy=(H-(rangeY*scale))/2;
  const tx=a=>(a.x-minX)*scale+cx;
  const ty=a=>(a.y-minY)*scale+cy;
  return(
    <svg width={W} height={H}>
      {bonds&&bonds.map((b,i)=>{
        const a1=atoms.find(a=>a.id===b.from),a2=atoms.find(a=>a.id===b.to);
        if(!a1||!a2)return null;
        const x1=tx(a1),y1=ty(a1),x2=tx(a2),y2=ty(a2);
        if(b.order===2){
          const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);
          const ox=-dy/len*3,oy=dx/len*3;
          return(<g key={i}>
            <line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
            <line x1={x1-ox} y1={y1-oy} x2={x2-ox} y2={y2-oy} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
          </g>);
        }
        if(b.order===3){
          const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);
          const ox=-dy/len*4,oy=dx/len*4;
          return(<g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
            <line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
            <line x1={x1-ox} y1={y1-oy} x2={x2-ox} y2={y2-oy} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
          </g>);
        }
        return(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth={2}/>);
      })}
      {atoms.map((a)=>{
        const r=a.symbol==="H"?10:16;
        return(<g key={a.id}>
          <circle cx={tx(a)} cy={ty(a)} r={r} fill={getCPK(a.atomicNum)} stroke="rgba(255,255,255,0.25)" strokeWidth={1}/>
          <text x={tx(a)} y={ty(a)+1} textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize={a.symbol.length>2?8:10} fontWeight="bold" fontFamily="monospace">{a.symbol}</text>
        </g>);
      })}
    </svg>);
};

// ============================================================
// GEMINI
// ============================================================
const callGemini=async(apiKey,prompt)=>{
  const res=await fetch(`/api/groq`,
    {method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({apiKey,prompt})});
  if(!res.ok)throw new Error(`Proxy error: ${res.status}`);
  const data=await res.json();
  return data.text||"";
};

// ============================================================
// MAIN APP
// ============================================================
export default function App(){
  const [tab,setTab]=useState("tabela");
  const [selectedEl,setSelectedEl]=useState(null);
  const [searchQ,setSearchQ]=useState("");
  const [apiKey,setApiKey]=useState("");
  const [apiKeyInput,setApiKeyInput]=useState("");
  const [apiKeySet,setApiKeySet]=useState(false);

  // Simulador — etapa 1: montar substância
  const [stage,setStage]=useState("build"); // "build" | "react"
  const [elQtys,setElQtys]=useState({}); // {atomicNum: qty}
  const [mixSearch,setMixSearch]=useState("");
  const [substances,setSubstances]=useState([]); // lista de substâncias criadas
  const [buildingSubst,setBuildingSubst]=useState(null); // substância sendo criada
  const [loadingSubst,setLoadingSubst]=useState(false);

  // Etapa 2: reagir substâncias
  const [selectedSubsts,setSelectedSubsts]=useState([]); // indices de substances selecionadas
  const [experiments,setExperiments]=useState([]); // lista de experimentos
  const [loadingReact,setLoadingReact]=useState(false);
  const [activeExp,setActiveExp]=useState(null);
  const [simError,setSimError]=useState("");

  const elements=useMemo(()=>buildElements(),[]);
  const filtered=useMemo(()=>{
    if(!searchQ)return elements;
    const q=searchQ.toLowerCase();
    return elements.filter(e=>e.name.toLowerCase().includes(q)||e.symbol.toLowerCase().includes(q)||e.number.toString()===q);
  },[elements,searchQ]);
  const mixFiltered=useMemo(()=>{
    if(!mixSearch)return elements;
    const q=mixSearch.toLowerCase();
    return elements.filter(e=>e.name.toLowerCase().includes(q)||e.symbol.toLowerCase().includes(q));
  },[elements,mixSearch]);

  const color=(el)=>CAT_COLORS[el.category]||"#888";

  // Quantidade de elementos na build atual
  const addEl=(el)=>{
    setElQtys(prev=>({...prev,[el.number]:(prev[el.number]||0)+1}));
    setBuildingSubst(null); setSimError("");
  };
  const removeEl=(num)=>{
    setElQtys(prev=>{const n={...prev};if(n[num]>1)n[num]--;else delete n[num];return n;});
    setBuildingSubst(null); setSimError("");
  };
  const clearBuild=()=>{setElQtys({});setBuildingSubst(null);setSimError("");};

  // Fórmula atual montada
  const currentFormula=useMemo(()=>{
    return Object.entries(elQtys).map(([num,qty])=>{
      const el=elements.find(e=>e.number===parseInt(num));
      return `${el?.symbol||"?"}${qty>1?qty:""}`;
    }).join("");
  },[elQtys,elements]);

  // Massa molar rápida (será corrigida pelo Gemini)
  const quickMolarMass=useMemo(()=>{
    return Object.entries(elQtys).reduce((acc,[num,qty])=>{
      const el=elements.find(e=>e.number===parseInt(num));
      return acc+(el?.mass||0)*qty;
    },0).toFixed(2);
  },[elQtys,elements]);

  // Criar substância via Gemini
  const handleCreateSubstance=async()=>{
    if(Object.keys(elQtys).length===0){setSimError("Adicione pelo menos um elemento.");return;}
    if(!apiKey){setSimError("Configure a API Key primeiro.");return;}
    setLoadingSubst(true);setSimError("");
    const elList=Object.entries(elQtys).map(([num,qty])=>{
      const el=elements.find(e=>e.number===parseInt(num));
      return `${el?.name}(${el?.symbol}) x${qty}`;
    }).join(", ");
    const prompt=`Você é um professor de química para vestibular brasileiro. O aluno combinou os seguintes átomos para formar uma substância: ${elList}.

Identifique a substância química mais provável formada com esses átomos e responda APENAS com JSON válido, sem markdown:

{
  "nome": "Água",
  "formula_molecular": "H₂O",
  "formula_bastao": "H-O-H",
  "classe": "Óxido Básico",
  "massa_molar": "18,02 g/mol",
  "estado_fisico": "Líquido",
  "solubilidade": "Miscível em água",
  "ph": "7 (neutro)",
  "nox": "H: +1, O: -2",
  "tipo_ligacao": "Covalente polar",
  "observacao_vestibular": "Solvente universal. Explorada em questões de ligações químicas e propriedades da água.",
  "valido": true,
  "atoms_visualization": [
    {"id":1,"symbol":"H","atomicNum":1,"x":0,"y":0},
    {"id":2,"symbol":"O","atomicNum":8,"x":1,"y":0.5},
    {"id":3,"symbol":"H","atomicNum":1,"x":2,"y":0}
  ],
  "bonds_visualization": [
    {"from":1,"to":2,"order":1},
    {"from":2,"to":3,"order":1}
  ]
}

Se a combinação de átomos não formar uma substância química real ou reconhecível, responda:
{"valido": false, "motivo": "Explique brevemente por que essa combinação não forma uma substância estável."}

Para atoms_visualization: forneça coordenadas 2D simples (x,y entre 0 e 5) que representem a geometria aproximada da molécula. Para moléculas com mais de 8 átomos ou muito complexas, ainda assim forneça uma representação simplificada.

Classes possíveis: Ácido, Base, Sal, Óxido Básico, Óxido Ácido, Óxido Anfótero, Óxido Neutro, Substância Simples, Composto Orgânico, Substância Molecular.`;

    try{
      const text=await callGemini(apiKey,prompt);
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      if(!parsed.valido){setSimError(parsed.motivo||"Combinação inválida.");setLoadingSubst(false);return;}
      const newSubst={
        id:Date.now(),
        formula:currentFormula,
        gemini:parsed,
        elQtys:{...elQtys},
      };
      setBuildingSubst(newSubst);
    }catch(e){setSimError("Erro ao processar resposta do Gemini. Verifique a API Key.");}
    setLoadingSubst(false);
  };

  const handleSaveSubstance=()=>{
    if(!buildingSubst)return;
    setSubstances(prev=>[...prev,buildingSubst]);
    clearBuild();
    setSimError("");
  };

  // Selecionar substâncias para reagir
  const toggleSubstSel=(id)=>{
    setSelectedSubsts(prev=>{
      if(prev.includes(id))return prev.filter(x=>x!==id);
      return [...prev,id];
    });
    setSimError("");
  };

  // Reagir substâncias selecionadas
  const handleReact=async()=>{
    if(selectedSubsts.length<2){setSimError("Selecione pelo menos 2 substâncias para reagir.");return;}
    if(!apiKey){setSimError("Configure a API Key primeiro.");return;}
    setLoadingReact(true);setSimError("");
    const substList=selectedSubsts.map(id=>{
      const s=substances.find(x=>x.id===id);
      return `${s.gemini.nome} (${s.gemini.formula_molecular})`;
    }).join(" + ");
    const expNum=experiments.length+1;
    const prompt=`Você é um professor de química para vestibular brasileiro. Analise a reação química entre: ${substList}.

Responda APENAS com JSON válido, sem markdown:

{
  "possivel": true,
  "equacao": "H₂O + CO₂ → H₂CO₃",
  "equacao_balanceada": "H₂O + CO₂ → H₂CO₃",
  "produto_nome": "Ácido Carbônico",
  "produto_formula": "H₂CO₃",
  "produto_formula_bastao": "HO-C(=O)-OH",
  "produto_classe": "Ácido",
  "produto_massa_molar": "62,03 g/mol",
  "tipo_reacao": "Síntese",
  "tipo_ligacao": "Covalente polar",
  "nox_reagentes": "H: +1, O: -2, C: +4",
  "nox_produtos": "H: +1, O: -2, C: +4",
  "delta_h": "-20,2 kJ/mol",
  "ph": "Ácido (pH < 7)",
  "eletronegatividade": "Produto polar",
  "estado_fisico_produto": "Aquoso (instável)",
  "observacao_vestibular": "Importante em questões de chuva ácida e equilíbrio químico.",
  "curiosidade": "H₂CO₃ é instável e se decompõe rapidamente em H₂O e CO₂.",
  "produto_atoms_visualization": [
    {"id":1,"symbol":"H","atomicNum":1,"x":0,"y":0},
    {"id":2,"symbol":"O","atomicNum":8,"x":1,"y":0},
    {"id":3,"symbol":"C","atomicNum":6,"x":2,"y":0},
    {"id":4,"symbol":"O","atomicNum":8,"x":3,"y":0},
    {"id":5,"symbol":"H","atomicNum":1,"x":4,"y":0},
    {"id":6,"symbol":"O","atomicNum":8,"x":2,"y":1}
  ],
  "produto_bonds_visualization": [
    {"from":1,"to":2,"order":1},{"from":2,"to":3,"order":1},
    {"from":3,"to":4,"order":1},{"from":4,"to":5,"order":1},
    {"from":3,"to":6,"order":2}
  ]
}

Se não reagir:
{"possivel": false, "motivo": "Explicação química do porquê não ocorre reação."}`;

    try{
      const text=await callGemini(apiKey,prompt);
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      const newExp={
        id:Date.now(),
        num:expNum,
        reagentes:selectedSubsts.map(id=>substances.find(x=>x.id===id)),
        resultado:parsed,
        timestamp:new Date().toLocaleTimeString("pt-BR"),
      };
      setExperiments(prev=>[newExp,...prev]);
      setActiveExp(newExp.id);
      setSelectedSubsts([]);
    }catch(e){setSimError("Erro ao processar resposta do Gemini.");}
    setLoadingReact(false);
  };

  const handleSetKey=()=>{if(apiKeyInput.trim().length>10){setApiKey(apiKeyInput.trim());setApiKeySet(true);}};

  // ============================================================
  // STYLES
  // ============================================================
  const S=`
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body,#root{background:#080c14;color:#e2e8f0;font-family:'Inter',sans-serif;min-height:100vh;}
    .app{min-height:100vh;background:#080c14;background-image:radial-gradient(ellipse at 20% 50%,rgba(99,102,241,0.04) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(6,182,212,0.03) 0%,transparent 50%);}
    .header{padding:16px 24px 0;border-bottom:1px solid rgba(255,255,255,0.05);position:sticky;top:0;background:rgba(8,12,20,0.95);backdrop-filter:blur(12px);z-index:100;}
    .header-top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px;}
    .logo{font-family:'Space Mono',monospace;font-size:17px;font-weight:700;color:#e2e8f0;letter-spacing:-0.5px;}
    .logo span{color:#06b6d4;}
    .inp{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 14px;color:#e2e8f0;font-size:13px;font-family:'Space Mono',monospace;outline:none;transition:border-color 0.2s;}
    .inp:focus{border-color:rgba(6,182,212,0.5);}
    .inp::placeholder{color:rgba(255,255,255,0.25);}
    .tabs{display:flex;}
    .tab-btn{padding:10px 20px;background:transparent;border:none;color:rgba(255,255,255,0.4);font-size:11px;font-family:'Space Mono',monospace;font-weight:700;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.05em;}
    .tab-btn:hover{color:rgba(255,255,255,0.7);}
    .tab-btn.active{color:#06b6d4;border-bottom-color:#06b6d4;}
    .content{padding:20px 24px;}
    .legend{display:flex;flex-wrap:wrap;gap:8px 18px;margin-bottom:18px;}
    .legend-item{display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(255,255,255,0.4);font-family:'Space Mono',monospace;}
    .legend-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0;}
    .table-wrapper{overflow-x:auto;padding-bottom:12px;}
    .pgrid{display:grid;grid-template-columns:repeat(19,56px);grid-template-rows:repeat(11,56px);gap:3px;min-width:1100px;}
    .glabel,.plabel{display:flex;align-items:center;justify-content:center;font-size:9px;color:rgba(255,255,255,0.2);font-family:'Space Mono',monospace;}
    .el-card{position:relative;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px 2px;transition:all 0.15s;overflow:hidden;}
    .el-card:hover{transform:scale(1.12);z-index:50;background:rgba(255,255,255,0.08);box-shadow:0 0 20px rgba(0,0,0,0.5);}
    .el-num{position:absolute;top:3px;left:4px;font-size:8px;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.3);}
    .el-sym{font-size:15px;font-weight:700;font-family:'Space Mono',monospace;line-height:1;}
    .el-name-s{font-size:6px;color:rgba(255,255,255,0.35);margin-top:2px;text-align:center;white-space:nowrap;overflow:hidden;width:100%;text-overflow:ellipsis;padding:0 2px;}
    .el-mass-s{font-size:7px;color:rgba(255,255,255,0.2);font-family:'Space Mono',monospace;margin-top:1px;}
    /* MODAL */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;}
    .modal{background:#0f1520;border:1px solid rgba(255,255,255,0.08);border-radius:20px;width:100%;max-width:880px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;position:relative;box-shadow:0 40px 80px rgba(0,0,0,0.7);}
    .modal-close{position:absolute;top:14px;right:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);font-size:16px;z-index:10;transition:all 0.2s;}
    .modal-close:hover{background:rgba(255,255,255,0.1);color:white;}
    .mbody{display:flex;overflow:hidden;flex:1;}
    .mleft{width:250px;flex-shrink:0;border-right:1px solid rgba(255,255,255,0.06);padding:28px 20px;display:flex;flex-direction:column;overflow-y:auto;}
    .mright{flex:1;padding:28px 24px;overflow-y:auto;}
    .el-big{border-radius:12px;padding:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:20px;position:relative;}
    .info-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;}
    .ilabel{color:rgba(255,255,255,0.3);font-family:'Space Mono',monospace;font-size:9px;text-transform:uppercase;}
    .ivalue{color:#e2e8f0;font-family:'Space Mono',monospace;font-size:11px;text-align:right;max-width:140px;word-break:break-all;}
    .stitle{font-size:9px;font-family:'Space Mono',monospace;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.3);border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:7px;margin-bottom:14px;margin-top:24px;}
    .stitle:first-child{margin-top:0;}
    .tag{display:inline-block;padding:3px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;font-size:11px;color:rgba(255,255,255,0.7);margin:2px;}
    .cur-item{display:flex;gap:8px;font-size:12px;color:rgba(255,255,255,0.65);line-height:1.5;margin-bottom:7px;}
    .tox-ban{display:flex;align-items:center;gap:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:12px 14px;margin-top:14px;font-size:12px;color:rgba(255,255,255,0.65);}
    .bohr-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;display:flex;flex-direction:column;align-items:center;}
    /* SIMULATOR */
    .sim-wrap{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:calc(100vh - 140px);}
    .sim-col{border-right:1px solid rgba(255,255,255,0.06);padding:20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
    .sim-col:last-child{border-right:none;}
    .sim-col3{display:flex;flex-direction:column;gap:14px;padding:20px;overflow-y:auto;}
    .sim-h{font-size:10px;font-family:'Space Mono',monospace;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);}
    .el-mini-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;overflow-y:auto;max-height:240px;}
    .el-mini-grid::-webkit-scrollbar{width:3px;}
    .el-mini-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
    .el-mini{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:7px 3px;cursor:pointer;display:flex;flex-direction:column;align-items:center;transition:all 0.12s;}
    .el-mini:hover{background:rgba(255,255,255,0.07);transform:scale(1.04);}
    .el-mini-sym{font-size:13px;font-weight:700;font-family:'Space Mono',monospace;}
    .el-mini-name{font-size:6px;color:rgba(255,255,255,0.3);margin-top:1px;text-align:center;overflow:hidden;white-space:nowrap;width:100%;text-overflow:ellipsis;padding:0 2px;}
    .formula-bar{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 16px;font-family:'Space Mono',monospace;font-size:18px;font-weight:700;color:#e2e8f0;min-height:50px;display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
    .el-qty-tag{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:8px;font-family:'Space Mono',monospace;font-size:13px;font-weight:700;border:1px solid currentColor;cursor:default;}
    .el-qty-btn{background:none;border:none;cursor:pointer;font-size:14px;color:inherit;opacity:0.6;padding:0 2px;line-height:1;}
    .el-qty-btn:hover{opacity:1;}
    .btn{padding:10px 16px;border-radius:9px;border:none;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;cursor:pointer;transition:opacity 0.2s;letter-spacing:0.03em;}
    .btn:disabled{opacity:0.35;cursor:not-allowed;}
    .btn-primary{background:linear-gradient(135deg,#06b6d4,#3b82f6);color:white;}
    .btn-primary:hover:not(:disabled){opacity:0.85;}
    .btn-success{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;}
    .btn-success:hover:not(:disabled){background:rgba(16,185,129,0.25);}
    .btn-ghost{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);}
    .btn-ghost:hover:not(:disabled){background:rgba(255,255,255,0.09);}
    .subst-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;cursor:pointer;transition:all 0.15s;}
    .subst-card:hover{border-color:rgba(255,255,255,0.18);}
    .subst-card.sel{border-color:#06b6d4;background:rgba(6,182,212,0.07);}
    .exp-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px;cursor:pointer;transition:all 0.15s;}
    .exp-card:hover{border-color:rgba(255,255,255,0.15);}
    .exp-card.active{border-color:rgba(168,85,247,0.4);background:rgba(168,85,247,0.05);}
    .result-box{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;}
    .rl{font-size:9px;font-family:'Space Mono',monospace;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;}
    .rv{font-size:13px;font-family:'Space Mono',monospace;color:#e2e8f0;}
    .rgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
    .rfull{grid-column:1/-1;}
    .eq-box{font-family:'Space Mono',monospace;font-size:16px;font-weight:700;color:#e2e8f0;padding:16px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.07);text-align:center;word-break:break-all;margin-bottom:16px;}
    .obs-box{background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);border-radius:10px;padding:14px;margin-top:10px;font-size:12px;color:rgba(255,255,255,0.75);line-height:1.6;}
    .obs-lbl{font-size:9px;font-family:'Space Mono',monospace;font-weight:700;text-transform:uppercase;color:#06b6d4;margin-bottom:5px;}
    .err{font-size:11px;color:#f87171;font-family:'Space Mono',monospace;padding:8px 12px;background:rgba(239,68,68,0.08);border-radius:8px;border:1px solid rgba(239,68,68,0.2);}
    .key-ok{display:flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;font-size:11px;font-family:'Space Mono',monospace;color:#10b981;}
    .spin{width:28px;height:28px;border:2px solid rgba(6,182,212,0.2);border-top-color:#06b6d4;border-radius:50%;animation:spin 0.8s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:10px;color:rgba(255,255,255,0.2);font-family:'Space Mono',monospace;font-size:11px;text-align:center;padding:40px;}
    .scrl::-webkit-scrollbar{width:3px;}
    .scrl::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
    .mol-viewer{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px;}
    .mol-toggle{display:flex;gap:6px;}
    .mol-btn{padding:4px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.5);font-size:10px;font-family:'Space Mono',monospace;cursor:pointer;transition:all 0.15s;}
    .mol-btn.active{background:rgba(6,182,212,0.15);border-color:rgba(6,182,212,0.4);color:#06b6d4;}
    .classe-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-family:'Space Mono',monospace;font-weight:700;}
    @media(max-width:900px){.sim-wrap{grid-template-columns:1fr;}.mbody{flex-direction:column;}.mleft{width:100%;border-right:none;border-bottom:1px solid rgba(255,255,255,0.06);}.pgrid{grid-template-columns:repeat(19,42px);grid-template-rows:repeat(11,42px);min-width:820px;}}
  `;

  // Render da substância criada/prévia
  const SubstCard=({s,selected,onClick,onDelete})=>{
    const [viewMode,setViewMode]=useState("bastao");
    return(
      <div className={`subst-card${selected?" sel":""}`} onClick={onClick}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:15,fontWeight:700,color:"#e2e8f0"}}>{s.gemini.formula_molecular}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{s.gemini.nome}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {selected&&<span style={{fontSize:10,color:"#06b6d4",fontFamily:"'Space Mono',monospace"}}>✓ selecionada</span>}
            {onDelete&&<button className="btn btn-ghost" style={{padding:"3px 8px",fontSize:10}} onClick={e=>{e.stopPropagation();onDelete();}}>✕</button>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          <span className="classe-badge" style={{background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",color:"#06b6d4"}}>{s.gemini.classe}</span>
          <span className="classe-badge" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)"}}>{s.gemini.massa_molar}</span>
          <span className="classe-badge" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)"}}>{s.gemini.estado_fisico}</span>
        </div>
        {/* Visualização molécula */}
        <div className="mol-viewer" onClick={e=>e.stopPropagation()}>
          <div className="mol-toggle">
            <button className={`mol-btn${viewMode==="bastao"?" active":""}`} onClick={()=>setViewMode("bastao")}>Bastão</button>
            <button className={`mol-btn${viewMode==="bolas"?" active":""}`} onClick={()=>setViewMode("bolas")}>Bolinhas</button>
          </div>
          {viewMode==="bastao"&&(
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:14,color:"#e2e8f0",padding:"8px 0"}}>{s.gemini.formula_bastao}</div>
          )}
          {viewMode==="bolas"&&(
            <MoleculeViewer atoms={s.gemini.atoms_visualization} bonds={s.gemini.bonds_visualization}/>
          )}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:6,display:"flex",gap:12,flexWrap:"wrap"}}>
          <span>NOX: {s.gemini.nox}</span>
          <span>pH: {s.gemini.ph}</span>
          <span>{s.gemini.tipo_ligacao}</span>
        </div>
      </div>);
  };

  return(
    <div className="app">
      <style>{S}</style>

      {/* HEADER */}
      <div className="header">
        <div className="header-top">
          <div className="logo">Tabela <span>Periódica</span> <span style={{color:"rgba(255,255,255,0.2)",fontWeight:300,fontSize:13}}>+ Simulador</span></div>
          {tab==="tabela"&&(
            <input className="inp" style={{width:200}} placeholder="Buscar elemento..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
          )}
        </div>
        <div className="tabs">
          <button className={`tab-btn${tab==="tabela"?" active":""}`} onClick={()=>setTab("tabela")}>Tabela Periódica</button>
          <button className={`tab-btn${tab==="simulador"?" active":""}`} onClick={()=>setTab("simulador")}>Simulador de Reações</button>
        </div>
      </div>

      <div className="content">

        {/* ===== TABELA ===== */}
        {tab==="tabela"&&(
          <>
            <div className="legend">
              {Object.entries(CAT_LABELS).map(([cat,label])=>(
                <div key={cat} className="legend-item"><div className="legend-dot" style={{background:CAT_COLORS[cat]}}/>{label}</div>
              ))}
            </div>
            <div className="table-wrapper">
              <div className="pgrid">
                {Array.from({length:18},(_,i)=>(
                  <div key={`g${i}`} className="glabel" style={{gridColumn:i+2,gridRow:1}}>{i+1}</div>
                ))}
                {Array.from({length:7},(_,i)=>(
                  <div key={`p${i}`} className="plabel" style={{gridColumn:1,gridRow:i+2}}>{i+1}</div>
                ))}
                <div style={{gridColumn:1,gridRow:9,fontSize:8,color:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace"}}>6*</div>
                <div style={{gridColumn:1,gridRow:10,fontSize:8,color:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace"}}>7*</div>
                {elements.map(el=>{
                  const isSrch=searchQ!=="";const isMatch=filtered.includes(el);const c=color(el);
                  return(
                    <div key={el.number} className="el-card"
                      style={{gridColumn:el.x+1,gridRow:el.y+1,opacity:isSrch&&!isMatch?0.08:1,borderColor:isMatch&&isSrch?c:"rgba(255,255,255,0.07)"}}
                      onClick={()=>setSelectedEl(el)}>
                      <span className="el-num">{el.number}</span>
                      <span className="el-sym" style={{color:c}}>{el.symbol}</span>
                      <span className="el-name-s">{el.name}</span>
                      <span className="el-mass-s">{el.mass.toFixed(2)}</span>
                    </div>);
                })}
              </div>
            </div>
          </>
        )}

        {/* ===== SIMULADOR ===== */}
        {tab==="simulador"&&(
          <div style={{marginTop:-8}}>
            {/* API KEY BAR */}
            <div style={{marginBottom:16}}>
              {!apiKeySet?(
                <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"'Space Mono',monospace",whiteSpace:"nowrap"}}>⚡ Gemini API Key:</span>
                  <input className="inp" style={{flex:1,maxWidth:340}} type="password" placeholder="AIza..." value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSetKey()}/>
                  <button className="btn btn-primary" onClick={handleSetKey}>Ativar</button>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'Space Mono',monospace"}}>aistudio.google.com</span>
                </div>
              ):(
                <div className="key-ok">
                  ✓ Gemini ativo
                  <button onClick={()=>{setApiKeySet(false);setApiKey("");setApiKeyInput("");}} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:11,fontFamily:"'Space Mono',monospace"}}>trocar chave</button>
                </div>
              )}
            </div>

            {/* 3 COLUNAS */}
            <div style={{display:"grid",gridTemplateColumns:"320px 280px 1fr",gap:0,border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden",minHeight:600}}>

              {/* COL 1: MONTAR SUBSTÂNCIA */}
              <div className="sim-col scrl" style={{borderRight:"1px solid rgba(255,255,255,0.07)"}}>
                <div className="sim-h">1. Monte a Substância</div>

                <input className="inp" style={{width:"100%"}} placeholder="Buscar elemento..." value={mixSearch} onChange={e=>setMixSearch(e.target.value)}/>

                <div className="el-mini-grid scrl">
                  {mixFiltered.map(el=>{
                    const qty=elQtys[el.number]||0;
                    const c=color(el);
                    const sel=qty>0;
                    return(
                      <div key={el.number} className="el-mini"
                        style={{borderColor:sel?c:"rgba(255,255,255,0.08)",background:sel?`${c}15`:"rgba(255,255,255,0.03)",minHeight:sel?64:48,transition:"all 0.15s"}}
                        onClick={()=>{if(!sel){addEl(el);}}}
                        title={el.name}>
                        <span className="el-mini-sym" style={{color:c}}>{el.symbol}</span>
                        <span className="el-mini-name">{el.name}</span>
                        {sel&&(
                          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:5}} onClick={e=>e.stopPropagation()}>
                            <button style={{background:"none",border:"none",cursor:"pointer",color:c,fontSize:15,lineHeight:1,padding:"0 3px",fontFamily:"monospace"}}
                              onClick={e=>{e.stopPropagation();removeEl(el.number);}}>−</button>
                            <span style={{fontSize:12,fontFamily:"monospace",color:"#e2e8f0",minWidth:12,textAlign:"center"}}>{qty}</span>
                            <button style={{background:"none",border:"none",cursor:"pointer",color:c,fontSize:15,lineHeight:1,padding:"0 3px",fontFamily:"monospace"}}
                              onClick={e=>{e.stopPropagation();setElQtys(prev=>({...prev,[el.number]:(prev[el.number]||0)+1}));setBuildingSubst(null);}}>+</button>
                          </div>
                        )}
                      </div>);
                  })}
                </div>

                {/* Formula atual */}
                <div>
                  <div className="sim-h" style={{marginBottom:8}}>Fórmula atual</div>
                  <div className="formula-bar">
                    {Object.keys(elQtys).length===0&&<span style={{fontSize:13,color:"rgba(255,255,255,0.2)"}}>clique nos elementos</span>}
                    {Object.entries(elQtys).map(([num,qty])=>{
                      const el=elements.find(e=>e.number===parseInt(num));
                      const c=color(el);
                      return(
                        <div key={num} className="el-qty-tag" style={{color:c,borderColor:`${c}40`}}>
                          <button className="el-qty-btn" style={{color:c}} onClick={(e)=>{e.stopPropagation();removeEl(parseInt(num));}}>−</button>
                          <span style={{minWidth:16,textAlign:"center"}}>{el?.symbol}{qty>1&&<sub style={{fontSize:10}}>{qty}</sub>}</span>
                          <button className="el-qty-btn" style={{color:c}} onClick={(e)=>{e.stopPropagation();setElQtys(prev=>({...prev,[num]:(prev[num]||0)+1}));setBuildingSubst(null);}}>+</button>
                        </div>);
                    })}
                  </div>
                  {Object.keys(elQtys).length>0&&(
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",marginTop:6}}>
                      Massa aprox.: {quickMolarMass} g/mol
                    </div>
                  )}
                </div>

                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-primary" style={{flex:1}} disabled={Object.keys(elQtys).length===0||loadingSubst} onClick={handleCreateSubstance}>
                    {loadingSubst?<span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span className="spin" style={{width:14,height:14,borderWidth:1.5}}/> Analisando...</span>:"⚗ Identificar"}
                  </button>
                  <button className="btn btn-ghost" disabled={Object.keys(elQtys).length===0} onClick={clearBuild}>Limpar</button>
                </div>

                {simError&&<div className="err">{simError}</div>}

                {/* Preview da substância identificada */}
                {buildingSubst&&(
                  <div style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,padding:14}}>
                    <div style={{fontSize:9,fontFamily:"'Space Mono',monospace",fontWeight:700,color:"#10b981",textTransform:"uppercase",marginBottom:8}}>Substância identificada</div>
                    <SubstCard s={buildingSubst} selected={false}/>
                    <button className="btn btn-success" style={{width:"100%",marginTop:10}} onClick={handleSaveSubstance}>
                      + Adicionar à lista
                    </button>
                  </div>
                )}
              </div>

              {/* COL 2: LISTA DE SUBSTÂNCIAS */}
              <div className="sim-col scrl" style={{borderRight:"1px solid rgba(255,255,255,0.07)"}}>
                <div className="sim-h">2. Substâncias ({substances.length})</div>

                {substances.length===0&&(
                  <div className="empty"><div style={{fontSize:32}}>🧪</div><div>Nenhuma substância ainda</div><div style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>Monte e identifique substâncias na coluna ao lado</div></div>
                )}

                {substances.map(s=>(
                  <SubstCard key={s.id} s={s}
                    selected={selectedSubsts.includes(s.id)}
                    onClick={()=>toggleSubstSel(s.id)}
                    onDelete={()=>{setSubstances(prev=>prev.filter(x=>x.id!==s.id));setSelectedSubsts(prev=>prev.filter(x=>x!==s.id));}}
                  />
                ))}

                {substances.length>=2&&(
                  <div style={{marginTop:"auto",paddingTop:12}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace",marginBottom:8}}>
                      {selectedSubsts.length} selecionada(s) para reagir
                    </div>
                    <button className="btn btn-primary" style={{width:"100%"}} disabled={selectedSubsts.length<2||loadingReact} onClick={handleReact}>
                      {loadingReact?<span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span className="spin" style={{width:14,height:14,borderWidth:1.5}}/> Simulando...</span>:"⚡ Reagir Selecionadas"}
                    </button>
                  </div>
                )}
              </div>

              {/* COL 3: EXPERIMENTOS */}
              <div style={{display:"grid",gridTemplateRows:"auto 1fr",overflow:"hidden"}}>
                {/* Lista experimentos */}
                <div style={{borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"16px 20px"}}>
                  <div className="sim-h" style={{marginBottom:10}}>Experimentos ({experiments.length})</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {experiments.length===0&&<span style={{fontSize:11,color:"rgba(255,255,255,0.2)",fontFamily:"'Space Mono',monospace"}}>Nenhum experimento ainda</span>}
                    {experiments.map(exp=>(
                      <button key={exp.id} className={`mol-btn${activeExp===exp.id?" active":""}`}
                        style={{padding:"5px 12px"}} onClick={()=>setActiveExp(exp.id)}>
                        Exp. {exp.num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resultado do experimento ativo */}
                <div className="scrl" style={{overflowY:"auto",padding:"20px"}}>
                  {!activeExp&&<div className="empty"><div style={{fontSize:32}}>⚡</div><div>Selecione substâncias e clique em Reagir</div></div>}
                  {activeExp&&(()=>{
                    const exp=experiments.find(e=>e.id===activeExp);
                    if(!exp)return null;
                    const r=exp.resultado;
                    return(
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Experimento {exp.num}</div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace"}}>{exp.timestamp}</div>
                          </div>
                          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                            {exp.reagentes.map(s=>s.gemini.formula_molecular).join(" + ")}
                          </div>
                        </div>

                        {!r.possivel?(
                          <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:12,padding:20,textAlign:"center"}}>
                            <div style={{fontSize:28,marginBottom:10}}>⚠️</div>
                            <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#fca5a5",fontWeight:700,marginBottom:8}}>Reação não ocorre</div>
                            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{r.motivo}</div>
                          </div>
                        ):(
                          <>
                            <div className="eq-box">{r.equacao_balanceada||r.equacao}</div>
                            <div className="rgrid">
                              <div className="result-box rfull">
                                <div className="rl">Produto</div>
                                <div className="rv" style={{fontSize:16}}>{r.produto_nome} — <span style={{color:"rgba(255,255,255,0.5)"}}>{r.produto_formula}</span></div>
                              </div>
                              <div className="result-box rfull">
                                <div className="rl">Classe do Produto</div>
                                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                                  <span className="classe-badge" style={{background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",color:"#06b6d4"}}>{r.produto_classe}</span>
                                  <span className="classe-badge" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)"}}>{r.produto_massa_molar}</span>
                                  <span className="classe-badge" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)"}}>{r.estado_fisico_produto}</span>
                                </div>
                              </div>
                              {/* Visualização produto */}
                              {r.produto_atoms_visualization&&r.produto_atoms_visualization.length>0&&(
                                <div className="result-box rfull">
                                  <div className="rl">Visualização Molecular</div>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:8}}>
                                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{r.produto_formula_bastao}</div>
                                  </div>
                                  <div style={{display:"flex",justifyContent:"center"}}>
                                    <MoleculeViewer atoms={r.produto_atoms_visualization} bonds={r.produto_bonds_visualization}/>
                                  </div>
                                </div>
                              )}
                              <div className="result-box">
                                <div className="rl">Tipo de Reação</div>
                                <div className="rv">{r.tipo_reacao}</div>
                              </div>
                              <div className="result-box">
                                <div className="rl">Tipo de Ligação</div>
                                <div className="rv">{r.tipo_ligacao}</div>
                              </div>
                              <div className="result-box">
                                <div className="rl">NOX Reagentes</div>
                                <div className="rv" style={{fontSize:11}}>{r.nox_reagentes}</div>
                              </div>
                              <div className="result-box">
                                <div className="rl">NOX Produtos</div>
                                <div className="rv" style={{fontSize:11}}>{r.nox_produtos}</div>
                              </div>
                              <div className="result-box">
                                <div className="rl">ΔH (Entalpia)</div>
                                <div className="rv" style={{color:r.delta_h?.includes("-")?"#34d399":"#f87171"}}>{r.delta_h}</div>
                              </div>
                              <div className="result-box">
                                <div className="rl">pH</div>
                                <div className="rv">{r.ph}</div>
                              </div>
                              <div className="result-box rfull">
                                <div className="rl">Eletronegatividade</div>
                                <div className="rv">{r.eletronegatividade}</div>
                              </div>
                            </div>
                            {r.observacao_vestibular&&(
                              <div className="obs-box">
                                <div className="obs-lbl">📚 Foco no Vestibular</div>
                                {r.observacao_vestibular}
                              </div>
                            )}
                            {r.curiosidade&&(
                              <div style={{marginTop:10,padding:"12px 14px",background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.6}}>
                                <div style={{fontSize:9,fontFamily:"'Space Mono',monospace",fontWeight:700,textTransform:"uppercase",color:"#a855f7",marginBottom:5}}>💡 Curiosidade</div>
                                {r.curiosidade}
                              </div>
                            )}
                          </>
                        )}
                      </div>);
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ELEMENTO */}
      {selectedEl&&(
        <div className="overlay" onClick={()=>setSelectedEl(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelectedEl(null)}>✕</button>
            <div className="mbody">
              <div className="mleft scrl">
                <div className="el-big" style={{background:`${color(selectedEl)}12`,border:`2px solid ${color(selectedEl)}30`}}>
                  <span style={{position:"absolute",top:10,left:14,fontSize:11,fontFamily:"'Space Mono',monospace",opacity:0.5,color:color(selectedEl)}}>{selectedEl.number}</span>
                  <span style={{fontSize:48,fontWeight:700,fontFamily:"'Space Mono',monospace",color:color(selectedEl),lineHeight:1}}>{selectedEl.symbol}</span>
                  <span style={{fontSize:13,fontWeight:600,marginTop:6,color:"#e2e8f0"}}>{selectedEl.name}</span>
                  <span style={{fontSize:9,fontFamily:"'Space Mono',monospace",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4,color:color(selectedEl)}}>{CAT_LABELS[selectedEl.category]}</span>
                  <span style={{position:"absolute",bottom:10,fontSize:10,fontFamily:"'Space Mono',monospace",opacity:0.4}}>{selectedEl.mass.toFixed(3)} u</span>
                </div>
                {[["Período",`${selectedEl.period}º`],["Grupo",selectedEl.group],["Config. Eletrônica",selectedEl.config],["Eletronegatividade",selectedEl.electronegativity?`${selectedEl.electronegativity} (Pauling)`:"N/A"],["Estado Físico",{solid:"Sólido",liquid:"Líquido",gas:"Gasoso"}[selectedEl.phase]],["Massa Atômica",`${selectedEl.mass} u`],["Prótons (Z)",selectedEl.number],["Nêutrons (≈)",Math.round(selectedEl.mass-selectedEl.number)]].map(([l,v])=>(
                  <div key={l} className="info-row"><span className="ilabel">{l}</span><span className="ivalue">{v}</span></div>
                ))}
                <div className="stitle">Camadas</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {(()=>{const lims=[2,8,18,32,32,18,8];const labs=["K","L","M","N","O","P","Q"];let rem=selectedEl.number;
                    return lims.map((lim,i)=>{if(rem<=0)return null;const take=Math.min(rem,lim);rem-=take;
                      return(<div key={labs[i]} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"3px 8px",textAlign:"center",fontFamily:"'Space Mono',monospace"}}>
                        <div style={{fontSize:8,color:"rgba(255,255,255,0.3)"}}>{labs[i]}</div>
                        <div style={{fontSize:12,color:"#e2e8f0"}}>{take}</div>
                      </div>);});})()}
                </div>
              </div>
              <div className="mright scrl">
                <div className="stitle" style={{marginTop:0}}>Modelo de Bohr</div>
                <div className="bohr-box">
                  <BohrAtom electrons={selectedEl.number} color={color(selectedEl)} size={170}/>
                  <div style={{marginTop:10,fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'Space Mono',monospace"}}>{selectedEl.number} elétrons</div>
                </div>
                <div className="stitle">Aplicações</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>{selectedEl.applications.map(a=><span key={a} className="tag">{a}</span>)}</div>
                <div className="stitle">Ocorrência</div>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.6}}>{selectedEl.occurrence}</p>
                <div className="stitle">Papel Biológico</div>
                <div style={{background:`${color(selectedEl)}08`,border:`1px solid ${color(selectedEl)}20`,borderRadius:10,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6}}>{selectedEl.biology}</div>
                <div className="stitle">Curiosidades de Prova</div>
                {selectedEl.curiosities.map((c,i)=>(
                  <div key={i} className="cur-item"><span style={{color:color(selectedEl),flexShrink:0}}>▸</span><span>{c}</span></div>
                ))}
                {selectedEl.toxicity&&(
                  <div className="tox-ban"><span style={{fontSize:18}}>⚠️</span>
                    <div><div style={{fontSize:9,fontFamily:"'Space Mono',monospace",fontWeight:700,color:"#f87171",marginBottom:3}}>ATENÇÃO — TOXICIDADE</div>
                    <div>Elemento tóxico, frequentemente explorado em questões de química ambiental.</div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>);
}
