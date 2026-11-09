const CONFIG = window.CONFIG || {publicUrl:"",mapImage:"",idleSeconds:60,attractStepSeconds:6};
const OFFICIAL = loc => "https://www.gardensbythebay.com.sg/en/plan-your-visit/gardens-map.html?location=" + encodeURIComponent(loc);

/* ================= DATA ================= */
const CATS = {
  conservatory:{name:"Conservatories", color:"#2b8fd6"},
  views:{name:"Supertrees & views", color:"#c2387d"},
  gardens:{name:"Outdoor gardens", color:"#2f9a4a"},
  family:{name:"Family & play", color:"#e88b1a"},
  food:{name:"Dining", color:"#b8572d"},
  arrival:{name:"Getting here", color:"#5b6475"},
};
const HOURS = {
  ticketed:{label:"Daily 9am – 9pm", open:[[540,1260]], last:"Last admission 8.30pm"},
  cloud:{label:"Daily 9am – 9pm", open:[[540,1260]], last:"Last admission 8pm"},
  outdoor:{label:"Daily 5am – 2am", open:[[300,1440],[0,120]]},
  children:{label:"Thu – Sun & public holidays, 9am – 7pm", open:[[540,1140]], days:[4,5,6,0], last:"Last admission 6pm · water play until 6.30pm"},
  stalls:{label:"Stall hours vary", open:null},
};
const SPOTS = [
 {id:"flower-dome",name:"Flower Dome",cat:"conservatory",x:880,y:300,hours:"ticketed",ticket:"Ticketed",time:"60–90 min",loc:"flower dome",
  blurb:"The world's largest glass greenhouse: a cool, dry Mediterranean climate under one enormous column-free roof.",
  hi:["Ancient olive trees and giant baobabs","A central floral display that changes with the seasons","Gardens from the Mediterranean, South Africa, Australia and the Americas"],
  tip:"Pair it with the Cloud Forest on one ticket. Go in the afternoon for a break from the heat."},
 {id:"cloud-forest",name:"Cloud Forest",cat:"conservatory",x:1070,y:355,hours:"cloud",ticket:"Ticketed",time:"60–90 min",loc:"cloud forest",
  blurb:"A misty tropical highland: a plant-covered mountain wrapped by one of the world's tallest indoor waterfalls.",
  hi:["Walk the aerial walkways spiralling round Cloud Mountain","Orchids, ferns and carnivorous pitcher plants","Cool mist sprays through the day"],
  tip:"Take the lift to the top, then walk down along the Cloud Walk so you see everything."},
 {id:"supertree-grove",name:"Supertree Grove",cat:"views",x:700,y:430,hours:"outdoor",ticket:"Free",time:"30–45 min",loc:"supertree grove",
  blurb:"The famous Supertrees, 25 to 50 metres tall: vertical gardens covered in thousands of plants that glow after dark.",
  hi:["Garden Rhapsody light and music show, 7.45pm and 8.45pm nightly (15 min, free)","Climbing ferns, bromeliads and orchids on every trunk","Solar panels on top power the evening lights"],
  tip:"For the show, lie back on the lawn under the trees. Get there 15 minutes early.",show:true},
 {id:"ocbc-skyway",name:"OCBC Skyway",cat:"views",x:640,y:350,hours:"ticketed",ticket:"Ticketed",time:"15–20 min",loc:"ocbc skyway",
  blurb:"A curved aerial walkway strung between the Supertrees, with skyline views over Marina Bay.",
  hi:["Walk among the Supertree canopies","Views of Marina Bay Sands and the bay","Very popular around sunset"],
  tip:"Closed in bad weather and on one maintenance day a month."},
 {id:"observatory",name:"Supertree Observatory",cat:"views",x:985,y:455,hours:"ticketed",ticket:"Ticketed",time:"20–30 min",loc:"supertree observatory",
  blurb:"An indoor deck and open-air rooftop on top of the tallest Supertree, with 360° views over the Gardens.",
  hi:["Open-air rooftop at the top of the tallest Supertree","Digital displays on climate and conservation","Opposite the Flower Dome entrance"],
  tip:"Great alternative to the Skyway if you'd rather have a roof over your head."},
 {id:"floral-fantasy",name:"Floral Fantasy",cat:"conservatory",x:545,y:315,hours:"ticketed",ticket:"Ticketed",time:"30–45 min",loc:"floral fantasy",
  blurb:"A whimsical walk-through of hanging flowers and sculpted landscapes, set in four themed zones.",
  hi:["Dance, Float, Waltz and Drift landscapes","Short 4D ride as a dragonfly","Close to the Dragonfly Bridge"],
  tip:"Smaller and quieter than the domes; a good stop with young children."},
 {id:"childrens-garden",name:"Far East Organization Children's Garden",cat:"family",x:1185,y:520,hours:"children",ticket:"Free",time:"1–2 hrs",loc:"far east organization children's garden",
  blurb:"A nature playground with tree houses, rope bridges and a water play area for toddlers and older kids.",
  hi:["Water play with jets and fountains","Tree houses and suspension bridges","Separate zones by age group"],
  tip:"Bring a change of clothes. Water play is outdoors and closes at 6.30pm."},
 {id:"heritage",name:"Heritage Gardens",cat:"gardens",x:685,y:615,hours:"outdoor",ticket:"Free",time:"20–30 min",loc:"heritage gardens",
  blurb:"Four themed gardens tell the story of Singapore's main cultures and its colonial history through plants.",
  hi:["Indian Garden","Chinese Garden","Malay Garden","Colonial Garden"],
  tip:"Shady and quiet, a nice stroll between the Supertrees and the Meadow."},
 {id:"world-of-plants",name:"World of Plants",cat:"gardens",x:835,y:545,hours:"outdoor",ticket:"Free",time:"20–30 min",loc:"world of plants",
  blurb:"A cluster of themed gardens about plant life in the tropics, from forest floor to treetops.",
  hi:["Web of Life, with animal sculptures made from plants","Fruits and Flowers, Understorey and Secret Life of Trees","Discovery and World of Palms"],
  tip:"Look for the plant-covered orangutan and hornbill sculptures."},
 {id:"serene-garden",name:"Serene Garden",cat:"gardens",x:600,y:185,hours:"outdoor",ticket:"Free",time:"15 min",loc:"serene garden",
  blurb:"A calm, Japanese-inspired garden of bamboo, water and stone by the bay.",
  hi:["Bamboo groves and still pools","Views across to the bay","Few crowds"],
  tip:"Good for a quiet pause between the busy attractions."},
 {id:"sun-pavilion",name:"Sun Pavilion",cat:"gardens",x:550,y:640,hours:"outdoor",ticket:"Free",time:"15 min",loc:"sun pavilion",
  blurb:"A desert garden of cacti and succulents gathered from the world's dry regions.",
  hi:["Hundreds of cacti and succulents","Sculptural, spiky plant forms","Easy to combine with the Heritage Gardens"],
  tip:"Best in the softer morning light for photos."},
 {id:"dragonfly-lake",name:"Dragonfly Lake & Bridge",cat:"gardens",x:430,y:240,hours:"outdoor",ticket:"Free",time:"15–20 min",loc:"dragonfly lake",
  blurb:"A lakeside boardwalk and bridge linking Bayfront Plaza with the heart of the Gardens.",
  hi:["Dragonfly sculptures along the water","Boardwalk with views of Marina Bay Sands","Natural water filtration through aquatic plants"],
  tip:"The quickest walk in from Bayfront MRT and Marina Bay Sands."},
 {id:"kingfisher",name:"Kingfisher Lake & Wetlands",cat:"gardens",x:1430,y:545,hours:"outdoor",ticket:"Free",time:"20–30 min",loc:"kingfisher wetlands",
  blurb:"Wetlands and a lake that attract birds, otters and other wildlife at the quieter eastern end.",
  hi:["Watch for kingfishers and herons","Boardwalks over the wetlands","Close to Satay by the Bay"],
  tip:"Early morning is best for spotting wildlife."},
 {id:"canyon",name:"The Canyon",cat:"gardens",x:1245,y:420,hours:"outdoor",ticket:"Free",time:"10–15 min",loc:"the canyon",
  blurb:"A landscape of large sculpted rocks and boulders set among tropical planting.",
  hi:["Rock sculptures you can walk between","Shaded paths","Next to the Children's Garden"],
  tip:"A fun scramble for kids on the way to the Children's Garden."},
 {id:"planet",name:"Planet",cat:"gardens",x:495,y:505,hours:"outdoor",ticket:"Free",time:"10 min",loc:"planet",
  blurb:"A giant sculpture of a sleeping baby that seems to float above the lawn, by the artist Marc Quinn.",
  hi:["One of the Gardens' most photographed artworks","Near Bayfront Plaza","Looks especially striking at dusk"],
  tip:"Stand back on the path for a photo of the whole sculpture."},
 {id:"meadow",name:"The Meadow",cat:"family",x:290,y:690,hours:"outdoor",ticket:"Free",time:"Any time",loc:"the meadow",
  blurb:"A big open lawn used for concerts, festivals and picnics, with skyline views.",
  hi:["Hosts large outdoor events through the year","Lots of space for kids to run","Car park nearby"],
  tip:"Check the events calendar: festivals here sometimes close parts of the lawn."},
 {id:"active-garden",name:"Active Garden",cat:"family",x:1100,y:700,hours:"outdoor",ticket:"Free",time:"30 min+",loc:"active garden",
  blurb:"An outdoor play and fitness area for all ages.",
  hi:["Play equipment for kids","Fitness stations for adults","Open early until late"],
  tip:"Handy for a play break near the Main Entrance."},
 {id:"satay",name:"Satay by the Bay",cat:"food",x:1510,y:650,hours:"stalls",ticket:"Pay per dish",time:"45–60 min",loc:"satay by the bay",
  blurb:"An open-air hawker centre by the water serving satay and local favourites.",
  hi:["Satay grilled over charcoal","Local dishes from many stalls","Breezy seating by the bay"],
  tip:"Go for an early dinner, then walk back to the Supertrees for Garden Rhapsody."},
 {id:"bayfront-plaza",name:"Bayfront Plaza & MRT",cat:"arrival",x:245,y:330,hours:"outdoor",ticket:"Free",time:"Arrival",loc:"bayfront plaza",
  blurb:"The western gateway, connected to Bayfront MRT station and Marina Bay Sands.",
  hi:["Bayfront MRT, Exit B","Underpass to Marina Bay Sands","Shortest walk to Dragonfly Bridge"],
  tip:"Arriving by train? Follow signs from Bayfront MRT Exit B."},
 {id:"main-entrance",name:"Main Entrance",cat:"arrival",x:960,y:650,hours:"outdoor",ticket:"Free",time:"Arrival",loc:"main entrance",
  blurb:"The main arrival point by road, with taxi drop-off, ticketing and visitor information.",
  hi:["Ticketing and information counter","Taxi and car drop-off","Basement car park"],
  tip:"Buy timed tickets online beforehand to skip the queue."},
];
SPOTS.forEach((s,i)=>s.n=i+1);
const BYID = Object.fromEntries(SPOTS.map(s=>[s.id,s]));
const ROUTES = [
  {name:"First visit highlights",desc:"3–4 hours · domes, Supertrees and the evening show",stops:["main-entrance","flower-dome","cloud-forest","observatory","supertree-grove","ocbc-skyway"]},
  {name:"Free & easy",desc:"2 hours · no tickets needed",stops:["bayfront-plaza","dragonfly-lake","serene-garden","supertree-grove","world-of-plants","heritage","planet"]},
  {name:"Family day out",desc:"3 hours · play, water and flowers",stops:["main-entrance","childrens-garden","canyon","floral-fantasy","supertree-grove","active-garden"]},
  {name:"Sunset to showtime",desc:"From 5pm · dinner and lights",stops:["kingfisher","satay","supertree-grove","ocbc-skyway"]},
];

/* ================= HELPERS ================= */
const $ = s => document.querySelector(s);
const NS = "http://www.w3.org/2000/svg";
function el(tag, attrs={}, parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
const store = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function toast(msg,ms=3200){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),ms)}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

/* ================= TIME (Singapore) ================= */
function sgNow(){
  const p = new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Singapore",hour:"2-digit",minute:"2-digit",weekday:"short",hour12:false}).formatToParts(new Date());
  const g = t => p.find(x=>x.type===t).value;
  const days = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  const h = +g("hour")%24, m = +g("minute");
  return {min:h*60+m, day:days[g("weekday")], h, m};
}
function fmt(min){min=(min+1440)%1440;let h=Math.floor(min/60),m=min%60;const ap=h>=12?"pm":"am";h=h%12||12;return h+(m?"."+String(m).padStart(2,"0"):"")+ap}
function status(spot){
  const H = HOURS[spot.hours], now = sgNow();
  if(!H.open) return {cls:"", txt:H.label};
  if(H.days && !H.days.includes(now.day)) return {cls:"closed", txt:"Closed today"};
  for(const [a,b] of H.open){
    if(now.min>=a && now.min<b){
      const left=b-now.min;
      if(b===1440) return {cls:"open",txt:"Open now · until 2am"};
      return left<=60 ? {cls:"soon",txt:"Closing soon · "+fmt(b)} : {cls:"open",txt:"Open now · until "+fmt(b)};
    }
  }
  const nextOpen = H.open.map(o=>o[0]).filter(a=>a>now.min).sort((a,b)=>a-b)[0] ?? H.open[0][0];
  return {cls:"closed", txt:"Closed · opens "+fmt(nextOpen)};
}
function rhapsody(){
  const n=sgNow().min, shows=[19*60+45,20*60+45];
  for(const s of shows){ if(n>=s && n<s+15) return {live:true,txt:"Garden Rhapsody · live now!"}; }
  const next = shows.find(s=>s>n);
  if(next===undefined) return {live:false,txt:"Garden Rhapsody · tomorrow 7.45pm"};
  const d=next-n; const inTxt = d<60? d+" min" : Math.floor(d/60)+"h "+(d%60)+"m";
  return {live:false,txt:"Garden Rhapsody · "+fmt(next)+" (in "+inTxt+")"};
}
function tick(){
  const n=sgNow(); $("#clock").textContent = fmt(n.min)+" SGT";
  const r=rhapsody(); $("#rhapTxt").textContent=r.txt; $("#rhap").classList.toggle("live",r.live);
  if(!tick.manual){ const night = n.min>=19*60 || n.min<6*60+30; setNight(night,false); }
  if(state.sel) refreshBadges();
}

/* ================= ILLUSTRATION ================= */
const W=1600,H=1000;
let landPath, lakePath;
function drawMap(){
  const g=$("#illus");
  el("rect",{x:-3000,y:-3000,width:7600,height:7000,class:"city"},g);
  // city blocks
  const r=rng(7);
  for(let i=0;i<120;i++){const x=-900+r()*3400,y=-600+r()*2400;el("rect",{x,y,width:40+r()*80,height:30+r()*60,rx:6,class:"block"},g)}
  // sea follows coastline
  el("path",{d:"M -3000 -3000 L 4600 -3000 L 4600 1700 L 1600 480 Q 900 180 420 40 L 330 -3000 Z",class:"sea"},g);
  for(let i=0;i<40;i++){const x=500+r()*2600,y=-500+r()*900; if(y< (x-420)*0.4+20) el("path",{d:`M${x} ${y} q10 -6 20 0 t20 0`,fill:"none",stroke:"#fff","stroke-opacity":.35,"stroke-width":2},g)}
  // land
  landPath = el("path",{d:"M 110 160 L 300 40 L 420 40 Q 900 180 1600 480 L 1600 720 Q 1250 800 950 840 Q 600 885 300 905 L 110 905 Z",class:"land"},g);
  el("path",{d:"M 420 40 Q 900 180 1600 480 L 1600 500 Q 900 210 420 62 Z",class:"land2"},g);
  // roads
  el("path",{d:"M 1700 735 Q 1250 820 950 860 Q 600 905 260 930 L -200 960",class:"road","stroke-width":30},g);
  const rd=el("path",{id:"rd1",d:"M 1700 735 Q 1250 820 950 860 Q 600 905 260 930 L -200 960",class:"roadline"},g);
  const t1=el("text",{class:"roadtxt",dy:5},g); el("path",{id:"rd1t",d:"M -200 960 L 260 930 Q 600 905 950 860 Q 1250 820 1700 735",fill:"none"},g); const tp=el("textPath",{href:"#rd1t",startOffset:"45%"},t1); tp.textContent="MARINA GARDENS DRIVE";
  el("path",{id:"rd2",d:"M 60 1100 L 85 150 L 280 -100",class:"road","stroke-width":28},g);
  el("path",{d:"M 60 1100 L 85 150 L 280 -100",class:"roadline"},g);
  const t2=el("text",{class:"roadtxt",dy:5},g); const tp2=el("textPath",{href:"#rd2",startOffset:"18%"},t2); tp2.textContent="MARINA BOULEVARD";
  // lawns
  el("ellipse",{cx:290,cy:700,rx:160,ry:120,class:"lawn"},g);
  el("ellipse",{cx:700,cy:440,rx:170,ry:105,class:"lawn"},g);
  el("ellipse",{cx:1180,cy:540,rx:90,ry:60,class:"lawn"},g);
  el("ellipse",{cx:1100,cy:705,rx:80,ry:45,class:"lawn"},g);
  // Dragonfly lake
  lakePath = el("path",{d:"M 360 50 C 330 170, 470 250, 425 360 S 330 520, 380 640 S 450 760, 400 880",class:"waterS","stroke-width":48},g);
  el("path",{d:"M 360 50 C 330 170, 470 250, 425 360 S 330 520, 380 640 S 450 760, 400 880",fill:"none",stroke:"#fff","stroke-opacity":.25,"stroke-width":2,"stroke-dasharray":"10 18"},g);
  // Kingfisher lake + small ponds
  el("path",{d:"M 1360 520 C 1370 470, 1460 470, 1500 500 C 1540 530, 1520 590, 1460 590 C 1400 595, 1350 570, 1360 520 Z",class:"water"},g);
  el("ellipse",{cx:810,cy:360,rx:46,ry:20,class:"water"},g);
  el("ellipse",{cx:1240,cy:610,rx:40,ry:16,class:"water"},g);
  // paths
  const paths=["M 245 330 C 330 330, 380 300, 430 240 C 480 200, 540 200, 600 185","M 245 330 C 330 360, 420 330, 545 315 C 600 320, 640 340, 700 430",
    "M 700 430 C 760 500, 860 560, 960 650","M 700 430 C 800 380, 840 330, 880 300","M 880 300 C 960 320, 1010 340, 1070 355",
    "M 960 650 C 1040 600, 1120 560, 1185 520 C 1240 480, 1300 520, 1360 540 C 1420 600, 1480 640, 1510 650","M 1070 355 C 1150 380, 1200 400, 1245 420 C 1300 450, 1340 480, 1380 500",
    "M 700 430 C 640 500, 600 560, 550 640 C 470 690, 380 700, 290 690","M 495 505 C 560 560, 620 600, 685 615 C 760 620, 860 640, 960 650",
    "M 960 650 C 1030 680, 1080 700, 1100 700","M 430 70 Q 900 210 1590 505","M 985 455 C 940 420, 910 360, 880 300"];
  paths.forEach(d=>{el("path",{d,class:"path","stroke-width":13},g)});
  // Dragonfly bridge
  el("path",{d:"M 395 262 L 470 228",stroke:"#e9dcc0","stroke-width":14,"stroke-linecap":"round"},g);
  el("path",{d:"M 395 262 L 470 228",stroke:"#b59e74","stroke-width":2,"stroke-dasharray":"4 4"},g);
  // trees scattered
  const tr=rng(42), trees=el("g",{},g);
  let placed=0, tries=0;
  while(placed<380 && tries<6000){ tries++;
    const x=110+tr()*1490, y=40+tr()*870;
    if(!landPath.isPointInFill(new DOMPoint(x,y))) continue;
    if(lakePath.isPointInStroke && lakePath.isPointInStroke(new DOMPoint(x,y))) continue;
    if(SPOTS.some(s=>Math.hypot(s.x-x,s.y-y)<62)) continue;
    if(Math.hypot((x-290)/150,(y-700)/110)<1) continue;
    if(Math.hypot((x-700)/150,(y-440)/95)<1) continue;
    if(Math.hypot(x-1440,y-535)<90) continue;
    const s=6+tr()*9, c=["t1","t2","t3"][Math.floor(tr()*3)];
    el("ellipse",{cx:x+3,cy:y+s*.7,rx:s,ry:s*.45,class:"shadow"},trees);
    el("circle",{cx:x,cy:y,r:s,class:c},trees);
    el("circle",{cx:x-s*.3,cy:y-s*.3,r:s*.45,fill:"#fff","fill-opacity":.12},trees);
    placed++;
  }
  // features
  serene(g,600,185); heritage(g,685,615); worldOfPlants(g,835,545); sunPavilion(g,550,640);
  canyon(g,1245,420); childrens(g,1185,520); active(g,1100,700); satay(g,1510,650);
  meadow(g,290,690); planet(g,495,505); floralFantasy(g,545,315); bayfront(g,245,330); mainEntrance(g,960,650); reeds(g,1430,545);
  domes(g);
  grove(g);
  el("text",{x:1150,y:150,class:"sky-label","font-size":22,"letter-spacing":".3em"},g).textContent="MARINA BAY";
}
function bldg(g,x,y,w,h,roof){el("ellipse",{cx:x+w/2+4,cy:y+h+4,rx:w*.6,ry:6,class:"shadow"},g);el("rect",{x,y,width:w,height:h,rx:4,class:"bldg"},g);if(roof)el("path",{d:`M${x-4} ${y+2} L${x+w/2} ${y-14} L${x+w+4} ${y+2} Z`,class:"roof"},g)}
function serene(g,x,y){for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=26+(i%3)*8;el("path",{d:`M${x+Math.cos(a)*r} ${y+Math.sin(a)*r*0.6} l${(i%2?3:-3)} -26`,stroke:"#3f8f3a","stroke-width":4,"stroke-linecap":"round"},g)}el("ellipse",{cx:x,cy:y+4,rx:18,ry:9,class:"water"},g)}
function heritage(g,x,y){const cols=["#e7b65c","#d0614f","#4fa36b","#d8d0bd"];[[-70,-30],[0,-38],[-60,22],[12,18]].forEach((o,i)=>{el("rect",{x:x+o[0],y:y+o[1],width:58,height:40,rx:10,fill:cols[i],"fill-opacity":.55},g);bldg(g,x+o[0]+20,y+o[1]+14,18,14,true)})}
function worldOfPlants(g,x,y){const r=rng(3);for(let i=0;i<16;i++){const a=r()*6.28,d=r()*40;el("circle",{cx:x+Math.cos(a)*d,cy:y+Math.sin(a)*d*0.7,r:8+r()*8,class:["t1","t2","t3"][i%3]},g)}for(let i=0;i<10;i++){const a=r()*6.28,d=10+r()*40;el("circle",{cx:x+Math.cos(a)*d,cy:y+Math.sin(a)*d*.7,r:3,fill:["#ff6fa3","#ffd166","#fff"][i%3]},g)}}
function sunPavilion(g,x,y){el("circle",{cx:x,cy:y,r:34,fill:"#e8d7a8"},g);for(let i=0;i<9;i++){const a=i/9*6.28;const cx=x+Math.cos(a)*22,cy=y+Math.sin(a)*14;el("rect",{x:cx-3,y:cy-12,width:6,height:14,rx:3,fill:"#5e9b4a"},g);el("rect",{x:cx-8,y:cy-8,width:5,height:3,rx:1.5,fill:"#5e9b4a"},g)}}
function canyon(g,x,y){const r=rng(9);for(let i=0;i<9;i++){const cx=x-40+r()*80,cy=y-20+r()*40,s=8+r()*12;el("path",{d:`M${cx-s} ${cy+s*.5} L${cx-s*.5} ${cy-s} L${cx+s*.6} ${cy-s*.8} L${cx+s} ${cy+s*.5} Z`,fill:i%2?"#9b8f84":"#b6aa9d",stroke:"#7d7268","stroke-width":1},g)}}
function childrens(g,x,y){el("circle",{cx:x+28,cy:y+16,r:20,fill:"#7fd3f0"},g);[0,1,2].forEach(i=>el("circle",{cx:x+20+i*8,cy:y+12+(i%2)*8,r:3,fill:"#fff"},g));el("rect",{x:x-34,y:y-26,width:6,height:30,fill:"#8a6a4a"},g);bldg(g,x-44,y-40,26,16,true);el("path",{d:`M${x-18} ${y-30} Q ${x} ${y-18} ${x+16} ${y-30}`,stroke:"#8a6a4a","stroke-width":3,fill:"none"},g)}
function active(g,x,y){el("rect",{x:x-40,y:y-18,width:80,height:36,rx:8,fill:"#e38f5a","fill-opacity":.7},g);el("rect",{x:x-34,y:y-12,width:30,height:24,rx:4,fill:"none",stroke:"#fff","stroke-width":2},g);el("circle",{cx:x+18,cy:y,r:9,fill:"none",stroke:"#fff","stroke-width":2},g)}
function satay(g,x,y){el("rect",{x:x-46,y:y-26,width:92,height:52,rx:12,fill:"#e9dcc0"},g);for(let i=0;i<6;i++){const cx=x-30+(i%3)*30,cy=y-10+Math.floor(i/3)*22;el("circle",{cx,cy,r:10,fill:i%2?"#e2477f":"#f2a33a"},g);el("circle",{cx,cy,r:2,fill:"#fff"},g)}}
function meadow(g,x,y){el("ellipse",{cx:x,cy:y,rx:110,ry:78,fill:"none",stroke:"#fff","stroke-opacity":.35,"stroke-width":3,"stroke-dasharray":"8 10"},g);el("path",{d:`M${x-30} ${y-20} l60 0 l-8 -22 l-44 0 Z`,fill:"#fff","fill-opacity":.6},g)}
function planet(g,x,y){el("ellipse",{cx:x+6,cy:y+20,rx:38,ry:9,class:"shadow"},g);el("ellipse",{cx:x,cy:y,rx:36,ry:15,fill:"#f1ece2",stroke:"#cfc6b4"},g);el("circle",{cx:x-26,cy:y-4,r:13,fill:"#f1ece2",stroke:"#cfc6b4"},g)}
function floralFantasy(g,x,y){bldg(g,x-30,y-18,60,30,false);el("path",{d:`M${x-34} ${y-18} Q ${x} ${y-44} ${x+34} ${y-18} Z`,fill:"#f6c9dc",stroke:"#e58fb2"},g);[["#ff6fa3",-16],["#ffd166",0],["#b48cff",16]].forEach(([c,o])=>el("circle",{cx:x+o,cy:y-26,r:6,fill:c},g))}
function bayfront(g,x,y){el("circle",{cx:x,cy:y,r:40,fill:"#eadfc6"},g);bldg(g,x-22,y-12,44,22,false);el("circle",{cx:x+42,cy:y+30,r:13,fill:"#7a3fb8"},g);el("text",{x:x+42,y:y+35,"text-anchor":"middle","font-size":14,"font-weight":800,fill:"#fff","font-family":"Inter,sans-serif"},g).textContent="M"}
function mainEntrance(g,x,y){el("rect",{x:x-56,y:y-22,width:112,height:50,rx:10,fill:"#eadfc6"},g);bldg(g,x-40,y-14,80,24,false);el("path",{d:`M${x-46} ${y-14} Q ${x} ${y-36} ${x+46} ${y-14}`,fill:"none",stroke:"#c2387d","stroke-width":4},g)}
function reeds(g,x,y){const r=rng(5);for(let i=0;i<24;i++){const a=r()*6.28,d=65+r()*25;const cx=x+Math.cos(a)*d,cy=y+Math.sin(a)*d*.6;el("path",{d:`M${cx} ${cy} l${r()*4-2} -12`,stroke:"#4c8f3b","stroke-width":2},g)}}
function dome(g,cx,cy,rx,ry,rot,inner){
  const gg=el("g",{transform:`rotate(${rot} ${cx} ${cy})`},g);
  el("ellipse",{cx:cx+8,cy:cy+6,rx:rx*1.02,ry:ry*.28,class:"shadow"},gg);
  if(inner) inner(gg);
  el("path",{d:`M${cx-rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx+rx} ${cy} Z`,class:"glass",fill:"url(#glassGrad)"},gg);
  for(let i=1;i<8;i++){const k=-1+i/4;el("path",{d:`M${cx+k*rx*0.98} ${cy} Q ${cx+k*rx*0.55} ${cy-ry*1.25} ${cx} ${cy-ry}`,class:"rib"},gg);}
  for(let j=1;j<4;j++){const f=j/4;el("path",{d:`M${cx-rx*Math.sqrt(1-f*f)} ${cy-ry*f} A ${rx*Math.sqrt(1-f*f)} ${ry*0.18} 0 0 0 ${cx+rx*Math.sqrt(1-f*f)} ${cy-ry*f}`,class:"rib"},gg);}
}
function domes(){
  const g=$("#illus");
  dome(g,880,312,105,78,-12,gg=>{[-50,-15,25,55].forEach((o,i)=>el("circle",{cx:880+o,cy:300-(i%2)*10,r:14,fill:["#ff8fb8","#ffd166","#9fd27a","#ff8fb8"][i]},gg))});
  dome(g,1070,370,78,98,-8,gg=>{el("path",{d:"M 1035 370 L 1060 300 L 1080 296 L 1100 370 Z",fill:"#3f8f3a"},gg);el("path",{d:"M 1083 300 L 1086 368",stroke:"#bde9ff","stroke-width":5,opacity:.9},gg)});
}
function supertree(g,x,y,h,w){
  const t=el("g",{class:"supertree"},g);
  el("ellipse",{cx:x+5,cy:y+3,rx:w*.6,ry:5,class:"shadow"},t);
  el("path",{d:`M${x-6} ${y} L${x+6} ${y} L${x+3} ${y-h*.7} L${x-3} ${y-h*.7} Z`,class:"trunk"},t);
  for(let i=1;i<4;i++) el("path",{d:`M${x-5+i*.6} ${y-h*.18*i} l${10-i*1.2} 0`,stroke:"#5aa648","stroke-width":3},t);
  el("path",{d:`M${x-3} ${y-h*.7} L${x-w} ${y-h} L${x+w} ${y-h} L${x+3} ${y-h*.7} Z`,class:"canopy"},t);
  el("ellipse",{cx:x,cy:y-h,rx:w,ry:w*.32,class:"canopyTop"},t);
  return [x,y-h];
}
function grove(){
  const g=$("#illus");
  const trees=[[620,395,70,16],[660,370,95,20],[700,410,120,24],[745,385,100,20],[780,430,80,16],[640,470,75,16],[690,480,85,18],[740,470,95,20],[800,480,65,14]];
  const tops={}; trees.sort((a,b)=>a[1]-b[1]).forEach((t,i)=>tops[i]=supertree(g,...t));
  // Skyway between two trees
  const a=supertree(g,600,330,90,18), b=tops[1];
  el("path",{d:`M${a[0]} ${a[1]} Q ${(a[0]+b[0])/2} ${a[1]+18} ${b[0]} ${b[1]}`,class:"skyway"},g);
  // Observatory: tallest tree
  const o=supertree(g,985,440,150,30);
  el("ellipse",{cx:o[0],cy:o[1]-4,rx:18,ry:7,fill:"#fff",opacity:.9},g);
}

/* ================= PINS ================= */
function drawPins(){
  const g=$("#pins"); g.innerHTML="";
  SPOTS.forEach(s=>{
    const p=el("g",{class:"pin",tabindex:0,role:"button","aria-label":s.name,"data-id":s.id},g);
    const inner=el("g",{class:"pinInner"},p);
    el("circle",{class:"halo",cx:0,cy:-30,r:16},inner);
    const head=el("g",{class:"head"},inner);
    head.style.transformOrigin="0px 0px";
    el("path",{d:"M0 0 C -10 -12 -18 -20 -18 -32 A 18 18 0 1 1 18 -32 C 18 -20 10 -12 0 0 Z",fill:CATS[s.cat].color},head);
    const n=el("text",{class:"num",x:0,y:-27},head); n.textContent=s.n;
    const lbl=el("g",{class:"lbl"},inner);
    const tx=el("text",{x:26,y:-27},lbl); tx.textContent=s.name.replace("Far East Organization ","");
    s._p=p; s._inner=inner; s._lbl=lbl; s._tx=tx;
    p.addEventListener("click",e=>{ if(drag.moved) return; e.stopPropagation(); select(s.id,true)});
    p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(s.id,true)}});
  });
  // label backgrounds after text is measured
  requestAnimationFrame(()=>SPOTS.forEach(s=>{const b=s._tx.getBBox();const r=el("rect",{x:b.x-8,y:b.y-4,width:b.width+16,height:b.height+8,rx:8},s._lbl);s._lbl.insertBefore(r,s._tx)}));
}

/* ================= VIEWBOX / PAN / ZOOM ================= */
const svg=$("#map"), wrap=$("#mapWrap");
const vb={cx:800,cy:480,w:1600};
function aspect(){const r=wrap.getBoundingClientRect();return r.width/Math.max(1,r.height)}
function homeView(){const a=aspect(); if(a<1) return {cx:760,cy:480,w:820}; return {cx:830,cy:470,w:Math.max(1500, Math.min(1700, 940*a))}}
function clampVB(v){v.w=Math.max(380,Math.min(1800,v.w));const h=v.w/aspect();v.cx=Math.max(100,Math.min(1550,v.cx));v.cy=Math.max(60,Math.min(920,v.cy));return v}
function applyVB(){
  const h=vb.w/aspect();
  svg.setAttribute("viewBox",`${vb.cx-vb.w/2} ${vb.cy-h/2} ${vb.w} ${h}`);
  const pxPerUnit = wrap.clientWidth/vb.w;
  const isPhone = window.innerWidth<=860;
  const s = (isPhone?0.95:1.15)/pxPerUnit;
  SPOTS.forEach(sp=>sp._p.setAttribute("transform",`translate(${sp.x} ${sp.y}) scale(${s})`));
  $("#route").setAttribute("stroke-width",6/pxPerUnit); $("#route").setAttribute("stroke-dasharray",`${14/pxPerUnit} ${10/pxPerUnit}`);
  document.body.classList.toggle("hide-labels", isPhone ? vb.w>700 : vb.w>1750);
}
let anim;
function animateTo(t,ms=650){
  cancelAnimationFrame(anim); clampVB(t);
  const f={...vb}, t0=performance.now();
  const step=now=>{let k=Math.min(1,(now-t0)/ms);k=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    vb.cx=f.cx+(t.cx-f.cx)*k; vb.cy=f.cy+(t.cy-f.cy)*k; vb.w=f.w+(t.w-f.w)*k; applyVB(); if(k<1) anim=requestAnimationFrame(step)};
  anim=requestAnimationFrame(step);
}
function toSvg(clientX,clientY){const r=wrap.getBoundingClientRect();const h=vb.w/aspect();return {x:vb.cx-vb.w/2+(clientX-r.left)/r.width*vb.w, y:vb.cy-h/2+(clientY-r.top)/r.height*h}}
function zoomAt(f,clientX,clientY){
  const r=wrap.getBoundingClientRect(); if(clientX===undefined){clientX=r.left+r.width/2;clientY=r.top+r.height/2}
  const p=toSvg(clientX,clientY); const nw=Math.max(380,Math.min(1800,vb.w*f)); const k=nw/vb.w;
  vb.cx=p.x+(vb.cx-p.x)*k; vb.cy=p.y+(vb.cy-p.y)*k; vb.w=nw; clampVB(vb); applyVB();
}
const drag={pts:new Map(),moved:false,start:null};
wrap.addEventListener("pointerdown",e=>{ if(e.target.closest(".chip,.zoom")) return; drag.pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); drag.moved=false; drag.start={x:e.clientX,y:e.clientY,cx:vb.cx,cy:vb.cy}; drag.pinch=null; cancelAnimationFrame(anim)});
wrap.addEventListener("pointermove",e=>{
  if(!drag.pts.has(e.pointerId)) return;
  drag.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(drag.pts.size===2){const [a,b]=[...drag.pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    if(drag.pinch){zoomAt(drag.pinch/d,mx,my);} drag.pinch=d; drag.moved=true; return;}
  const dx=e.clientX-drag.start.x, dy=e.clientY-drag.start.y;
  if(Math.hypot(dx,dy)>6){ if(!drag.moved){ try{wrap.setPointerCapture(e.pointerId)}catch(_){} } drag.moved=true;}
  if(drag.moved && drag.pts.size===1){const u=vb.w/wrap.clientWidth; vb.cx=drag.start.cx-dx*u; vb.cy=drag.start.cy-dy*u; clampVB(vb); applyVB();}
});
function endPtr(e){drag.pts.delete(e.pointerId); if(drag.pts.size===0) setTimeout(()=>drag.moved=false,0); if(drag.pts.size<2) drag.pinch=null; if(drag.pts.size===1){const p=[...drag.pts.values()][0];drag.start={x:p.x,y:p.y,cx:vb.cx,cy:vb.cy}}}
wrap.addEventListener("pointerup",endPtr); wrap.addEventListener("pointercancel",endPtr);
wrap.addEventListener("wheel",e=>{e.preventDefault();zoomAt(Math.exp(e.deltaY*0.0015),e.clientX,e.clientY)},{passive:false});
svg.addEventListener("click",e=>{
  if(drag.moved) return;
  if(CAL){const p=toSvg(e.clientX,e.clientY);toast(`x: ${Math.round(p.x)}, y: ${Math.round(p.y)}`,6000);return}
  if(!e.target.closest(".pin") && window.innerWidth<=860) closePanel();
});
$("#zin").onclick=()=>{const t={...vb,w:vb.w/1.5};animateTo(t,300)};
$("#zout").onclick=()=>{const t={...vb,w:vb.w*1.5};animateTo(t,300)};
$("#zhome").onclick=()=>animateTo(homeView());
window.addEventListener("resize",()=>{clampVB(vb);applyVB()});

/* ================= STATE / UI ================= */
const params=new URLSearchParams(location.search);
// short links from the kiosk QR: /p/<plan numbers joined by dots>/<spot number>
(function(){const m=location.pathname.match(/^\/p\/([\d.]+)(?:\/(\d+))?\/?$/);
  if(m){ if(m[1]!=="0") params.set("plan",m[1]); if(m[2]) params.set("spotn",m[2]); params.set("from","kiosk"); }
  if(/^\/kiosk\/?$/.test(location.pathname)) params.set("mode","kiosk");})();
const CAL=params.has("calibrate");
const FROM_KIOSK=params.get("from")==="kiosk";
const KIOSK = params.get("mode")==="kiosk" || (!FROM_KIOSK && params.get("mode")!=="phone" && window.innerWidth>=1100 && matchMedia("(pointer:coarse)").matches) || params.get("mode")==="kiosk";
const state={sel:null, filter:null, plan:[]};

function setNight(on,manual){
  if(manual) tick.manual=true;
  document.body.classList.toggle("night",on);
  $("#dnIcon").textContent=on?"☀":"☾"; $("#dnTxt").textContent=on?"Day view":"Night view";
}
$("#dn").onclick=()=>setNight(!document.body.classList.contains("night"),true);
$("#rhap").onclick=()=>select("supertree-grove",true);

function drawFilters(){
  const f=$("#filters"); f.innerHTML="";
  const all=document.createElement("button"); all.className="chip"+(state.filter?"":" on"); all.textContent="All"; all.onclick=()=>setFilter(null); f.appendChild(all);
  for(const k in CATS){const b=document.createElement("button");b.className="chip"+(state.filter===k?" on":"");b.innerHTML=`<i style="background:${CATS[k].color}"></i>${CATS[k].name}`;b.onclick=()=>setFilter(state.filter===k?null:k);f.appendChild(b)}
}
function setFilter(k){state.filter=k;drawFilters();SPOTS.forEach(s=>s._p.classList.toggle("dim",!!k&&s.cat!==k));
  if(k){const pts=SPOTS.filter(s=>s.cat===k);fitTo(pts)} }
function fitTo(pts){const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  const a=aspect(); let w=Math.max(maxx-minx+300,(maxy-miny+300)*a,600); animateTo({cx:(minx+maxx)/2,cy:(miny+maxy)/2+(window.innerWidth<=860?120:0),w})}

function heroSVG(s){
  const c=CATS[s.cat].color;
  const bits={
    conservatory:`<path d="M60 150 A 140 120 0 0 1 340 150 Z" fill="#fff" fill-opacity=".55" stroke="#fff" stroke-width="3"/><path d="M110 150 Q 150 40 200 30 M290 150 Q 250 40 200 30 M200 30 L200 150" stroke="#fff" stroke-width="2" fill="none"/>`,
    views:`<g fill="#fff" fill-opacity=".85"><path d="M150 150 L156 70 L120 40 L192 40 L162 70 L168 150Z"/><path d="M240 150 L246 60 L205 25 L287 25 L252 60 L258 150Z"/></g><path d="M156 42 Q 200 70 246 28" stroke="#fff" stroke-width="3" fill="none"/>`,
    gardens:`<g fill="#fff" fill-opacity=".8"><circle cx="120" cy="110" r="40"/><circle cx="190" cy="90" r="52"/><circle cx="270" cy="115" r="36"/></g>`,
    family:`<g fill="#fff" fill-opacity=".85"><rect x="120" y="70" width="70" height="50" rx="6"/><path d="M110 72 L155 40 L200 72Z"/><circle cx="270" cy="110" r="30" fill-opacity=".5"/></g>`,
    food:`<g fill="#fff" fill-opacity=".85"><circle cx="140" cy="100" r="34"/><circle cx="210" cy="100" r="34"/><circle cx="280" cy="100" r="34"/></g>`,
    arrival:`<g fill="#fff" fill-opacity=".85"><rect x="110" y="70" width="180" height="60" rx="12"/><path d="M110 70 Q 200 20 290 70" fill="none" stroke="#fff" stroke-width="5"/></g>`,
  }[s.cat];
  return `<svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="hg${s.n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".55"/></linearGradient></defs><rect width="400" height="150" fill="url(#hg${s.n})"/>${bits}<text x="380" y="135" text-anchor="end" font-family="Fraunces,Georgia,serif" font-weight="800" font-size="64" fill="#fff" fill-opacity=".35">${s.n}</text></svg>`;
}
function badgesHTML(s){const st=status(s);const H=HOURS[s.hours];return `<span class="badge ${st.cls}">${esc(st.txt)}</span><span class="badge">${esc(s.ticket)}</span><span class="badge">⏱ ${esc(s.time)}</span>`}
function refreshBadges(){const b=$("#badges");if(b&&state.sel)b.innerHTML=badgesHTML(BYID[state.sel])}

function renderPanel(){
  const p=$("#pcontent");
  if(!state.sel){
    const r=rhapsody();
    p.innerHTML=`<div class="welcome">
      <div class="ptag" style="color:var(--accent)"><i style="background:var(--accent)"></i>${KIOSK?"Welcome":"Your pocket guide"}</div>
      <h2>Where would you like to go?</h2>
      <p>Tap any numbered spot on the map to see what's there, whether it's open, and how long to spend. Add stops to your plan, then take the plan with you on your phone.</p>
      <div class="shows"><b>Tonight: Garden Rhapsody</b><p>The Supertrees light up to music at 7.45pm and 8.45pm. Free, about 15 minutes.<br>${esc(r.txt.replace("Garden Rhapsody · ",""))}</p></div>
      <div class="ptag" style="color:var(--ink-soft);margin-bottom:10px">Ready-made routes</div>
      <div class="routes">${ROUTES.map((r,i)=>`<button class="route" data-r="${i}"><b>${esc(r.name)}</b><span>${esc(r.desc)}</span></button>`).join("")}</div>
    </div>`;
    p.querySelectorAll(".route").forEach(b=>b.onclick=()=>{const r=ROUTES[+b.dataset.r];state.plan=[...r.stops];savePlan();renderTray();fitTo(r.stops.map(id=>BYID[id]));toast(`“${r.name}” added to your plan`)});
    return;
  }
  const s=BYID[state.sel], c=CATS[s.cat], inPlan=state.plan.includes(s.id);
  p.innerHTML=`<button class="back" id="backBtn">← All attractions</button>
    <div class="hero">${heroSVG(s)}</div>
    <div class="ptag" style="color:${c.color}"><i style="background:${c.color}"></i>${esc(c.name)}</div>
    <div class="ptitle">${esc(s.name)}</div>
    <div class="badges" id="badges">${badgesHTML(s)}</div>
    <div class="pbody"><p>${esc(s.blurb)}</p><ul>${s.hi.map(h=>`<li>${esc(h)}</li>`).join("")}</ul></div>
    <div class="tip"><b>Insider tip</b>${esc(s.tip)}</div>
    <p class="meta">🕘 ${esc(HOURS[s.hours].label)}${HOURS[s.hours].last?" · "+esc(HOURS[s.hours].last):""}</p>
    <div class="actions">
      <button class="btn ${inPlan?"":"primary"}" id="addBtn">${inPlan?"✓ In your plan":"＋ Add to plan"}</button>
      ${KIOSK?`<button class="btn dark" id="phoneBtn">📱 On my phone</button>`:`<button class="btn dark" id="shareBtn">↗ Share</button>`}
      <a class="btn full" href="${OFFICIAL(s.loc)}" target="_blank" rel="noopener">Official info & tickets ↗</a>
    </div>`;
  $("#backBtn").onclick=()=>{state.sel=null;markSel();renderPanel();if(window.innerWidth<=860)closePanel()};
  $("#addBtn").onclick=()=>togglePlan(s.id);
  if($("#phoneBtn")) $("#phoneBtn").onclick=()=>openQR({spot:s.id});
  if($("#shareBtn")) $("#shareBtn").onclick=async()=>{const url=handoffURL({spot:s.id,plan:state.plan});try{if(navigator.share){await navigator.share({title:s.name,url});return}}catch(e){} try{await navigator.clipboard.writeText(url);toast("Link copied")}catch(e){toast(url,6000)}};
}
function markSel(){SPOTS.forEach(s=>s._p.classList.toggle("sel",s.id===state.sel))}
function openPanel(){$("#panel").classList.add("open")}
function closePanel(){$("#panel").classList.remove("open")}
$("#closeP").onclick=()=>{closePanel()};

function select(id,fly){
  const s=BYID[id]; if(!s) return;
  state.sel=id; markSel(); renderPanel(); openPanel(); $("#panel").scrollTop=0;
  if(fly){const phone=window.innerWidth<=860; const w=phone?700:900; const h=w/aspect(); animateTo({cx:s.x,cy:s.y+(phone?h*0.22:0),w})}
  if(!KIOSK){ const u=new URL(location.href); u.searchParams.set("spot",id); u.searchParams.delete("from"); u.searchParams.delete("spotn"); try{history.replaceState(null,"",u)}catch(e){} }
}

/* ---------- plan ---------- */
function savePlan(){ if(!KIOSK) store.set("gbtb-plan",state.plan); drawRoute(); SPOTS.forEach(s=>s._p.classList.toggle("inplan",state.plan.includes(s.id))) }
function togglePlan(id){const i=state.plan.indexOf(id); if(i>=0) state.plan.splice(i,1); else state.plan.push(id); savePlan(); renderTray(); renderPanel(); if(i<0) toast(`Added ${BYID[id].name} · stop ${state.plan.length}`)}
function drawRoute(){ $("#route").setAttribute("points", state.plan.length>1 ? state.plan.map(id=>BYID[id].x+","+(BYID[id].y-14)).join(" ") : "") }
function renderTray(){
  const st=$("#stops");
  if(!state.plan.length){st.innerHTML=`<span class="empty">${KIOSK?"Tap “Add to plan” on any spot, or pick a ready-made route.":"No stops yet. Tap a spot and “Add to plan”."}</span>`}
  else st.innerHTML=state.plan.map((id,i)=>`<button class="stop" data-id="${id}"><em>${i+1}</em>${esc(BYID[id].name.replace("Far East Organization ",""))}<span class="x" data-x="${id}" aria-label="Remove">✕</span></button>`).join("");
  st.querySelectorAll(".stop").forEach(b=>b.onclick=e=>{ if(e.target.dataset.x){togglePlan(e.target.dataset.x);return} select(b.dataset.id,true)});
  $("#sendPlan").style.display = state.plan.length ? "" : (KIOSK?"none":"none");
  $("#clearPlan").style.display = state.plan.length ? "" : "none";
  $("#sendPlan").textContent = KIOSK ? "📱 Send to my phone" : "↗ Share plan";
}
$("#clearPlan").onclick=()=>{state.plan=[];savePlan();renderTray();renderPanel()};
$("#sendPlan").onclick=async()=>{
  if(KIOSK) return openQR({plan:state.plan, spot:state.sel});
  const url=handoffURL({plan:state.plan}); try{if(navigator.share){await navigator.share({title:"My Gardens by the Bay plan",url});return}}catch(e){}
  try{await navigator.clipboard.writeText(url);toast("Plan link copied")}catch(e){toast(url,6000)}
};

/* ---------- QR handoff ---------- */
function baseURL(){ if(CONFIG.publicUrl) return CONFIG.publicUrl; if(/^https?:/.test(location.protocol)) return location.origin+location.pathname; return "https://your-host.example/gardens-explorer.html" }
function handoffURL({spot,plan}){
  if(CONFIG.shortLinks!==false && (CONFIG.publicUrl || /^https?:/.test(location.protocol))){
    const o=new URL(baseURL()).origin; const pl=(plan&&plan.length)?plan.map(id=>BYID[id].n).join("."):"0";
    return o+"/p/"+pl+(spot?"/"+BYID[spot].n:"");
  }const u=new URL(baseURL()); if(spot) u.searchParams.set("spot",spot); if(plan&&plan.length) u.searchParams.set("plan",plan.map(id=>BYID[id].n).join(".")); u.searchParams.set("from","kiosk"); return u.toString()}
function openQR(opts){
  const url=handoffURL(opts);
  const qr=qrcode(0,"M"); qr.addData(url); qr.make();
  $("#qrBox").innerHTML=qr.createSvgTag({cellSize:6,margin:2,scalable:true});
  $("#qrUrl").textContent=url.replace(/^https?:\/\//,"");
  const n=(opts.plan||[]).length;
  $("#qrTitle").textContent = n ? `Your ${n}-stop plan` : (opts.spot?BYID[opts.spot].name:"Take it with you");
  $("#qrSub").textContent = "Scan with your phone camera. The map opens on your phone with "+(n?"your stops and route":"this spot")+" ready. No app needed.";
  const w=$("#qrWarn"); if(!CONFIG.publicUrl && !/^https?:/.test(location.protocol)){w.style.display="";w.textContent="Preview mode: host this page (e.g. GitHub Pages or Netlify) or set CONFIG.publicUrl so the QR code points to a real address."} else w.style.display="none";
  $("#qrModal").classList.add("show");
}
$("#qrClose").onclick=()=>$("#qrModal").classList.remove("show");
$("#qrModal").onclick=e=>{if(e.target.id==="qrModal")$("#qrModal").classList.remove("show")};

/* ---------- kiosk attract mode ---------- */
let idleT, attractT, attractI=0;
const TOUR=["supertree-grove","flower-dome","cloud-forest","ocbc-skyway","floral-fantasy","childrens-garden","heritage","observatory","satay","planet"];
function resetIdle(){ if(!KIOSK) return; clearTimeout(idleT); if(document.body.classList.contains("attract")) stopAttract(); idleT=setTimeout(startAttract, CONFIG.idleSeconds*1000) }
function startAttract(){
  document.body.classList.add("attract"); $("#qrModal").classList.remove("show");
  state.plan=[]; savePlan(); renderTray(); setFilter(null);
  const step=()=>{ select(TOUR[attractI++%TOUR.length],true) }; step(); attractT=setInterval(step, CONFIG.attractStepSeconds*1000);
}
function stopAttract(){document.body.classList.remove("attract");clearInterval(attractT);state.sel=null;markSel();renderPanel();animateTo(homeView())}
["pointerdown","keydown","wheel"].forEach(ev=>window.addEventListener(ev,resetIdle,{capture:true,passive:true}));

/* ================= BOOT ================= */
function boot(){
  if(CONFIG.mapImage){const im=$("#customMap");im.setAttribute("href",CONFIG.mapImage);im.setAttribute("width",W);im.setAttribute("height",H);im.style.display="";$("#illus").style.display="none"}
  drawMap(); drawPins(); drawFilters();
  Object.assign(vb,homeView()); clampVB(vb); applyVB();
  // plan: from QR handoff, else saved on this phone
  const pp=params.get("plan");
  if(pp){ state.plan=pp.split(".").map(n=>SPOTS[+n-1]?.id).filter(Boolean) } else if(!KIOSK){ state.plan=store.get("gbtb-plan")||[] }
  savePlan(); renderTray();
  const sp=params.get("spot") || (params.get("spotn") && SPOTS[+params.get("spotn")-1]?.id);
  if(sp && BYID[sp]){ select(sp,true) } else { renderPanel(); if(window.innerWidth>860) openPanel(); else if(!FROM_KIOSK) setTimeout(()=>toast("Tap a numbered spot to explore",3500),600) }
  if(FROM_KIOSK){ toast(state.plan.length?`Picked up from the kiosk: ${state.plan.length} stops saved on this phone`:"Picked up from the kiosk", 4200);
    const u=new URL(location.origin+"/"); if(sp) u.searchParams.set("spot",sp); try{history.replaceState(null,"",u)}catch(e){} }
  tick(); setInterval(tick,30000);
  if(KIOSK) resetIdle();
  if(CAL) toast("Calibrate mode: click the map to read x/y coordinates",5000);
}
boot();
