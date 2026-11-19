const catalog = {
  pasta: 'pasta,spaghetti,spaghettini,bucatini,linguine,tagliatelle,tagliolini,pappardelle,fettuccine,penne,pennette,mezze penne,rigatoni,maccheroni,sedanini,mezze maniche,paccheri,tortiglioni,ditalini,stelline,fusilli,fusilloni,farfalle,conchiglie,conchiglioni,orecchiette,trofie,trenette,pici,strozzapreti,casarecce,cavatelli,scialatielli,malloreddus,gramigna,busiate,spatzle,gnocchi,gnocchetti,ramen,udon,soba,noodles,vermicelli,lasagne,lasagna,cannelloni,ravioli,tortelli,tortellini,tortelloni,agnolotti,cappelletti,mezzelune,linguine al limone,aglio olio e peperoncino,arrabbiata,puttanesca,scarpariello',
  riso: 'riso,risotto,risotti,basmati,arborio,carnaroli,vialone nano,roma,originario,jasmine,venere,nerone,integrale di riso,riso rosso,pilaf,riso al salto,riso cantonese,onigiri,arancini,arancine,suppli',
  pane: 'pane,panino,panini,rosetta,ciabatta,baguette,filone,schiacciata,focaccia,piadina,piadine,pizza,pizze,pizzetta,margherita,marinara,toast,tramezzino,tramezzini,bruschetta,crostini,grissini,taralli,cracker,wrap,tortilla,pita,naan,bagel,tacos,burrito,club sandwich,panzerotto,calzone',
  couscous: 'cous cous,couscous,farro,orzo,orzo perlato,quinoa,bulgur,miglio,grano saraceno,amaranto,avena,porridge,polenta,mais,farinata di mais,tabbouleh,freekeh,frumento,grano,fiocchi di avena',
  patate: 'patata,patate,patatina,patatine,pure,purea di patate,patate dolci,batata,rostì,crocchette di patate,patate duchessa',
  manzo: 'carne,manzo,bovino,vitello,vitella,maiale,suino,agnello,capretto,coniglio,cervo,cinghiale,bistecca,bistecche,entrecote,costata,tagliata,straccetti,controfiletto,filetto di manzo,macinato,carpaccio,tartare,brasato,arrosto di manzo,lesso,bollito,ossobuco,spezzatino,polpettone,roast beef,salsiccia,salsicce,salamella,prosciutto,prosciutto cotto,prosciutto crudo,mortadella,soppressata,salame,spianata,bresaola,speck,pancetta,guanciale,bacon,cotechino,wurstel,hamburger,coppa,lonza,arista,costine,scaloppine di vitello,porchetta',
  pollo: 'pollo,pollame,tacchino,gallina,faraona,anatra,cappone,galletto,petto di pollo,fusi di pollo,alette,ali di pollo,sovracosce,cosce di pollo,bocconcini di pollo,nuggets,pollo al curry,pollo tandoori,pollo tikka,pollo arrosto,pollo al limone,cotoletta di pollo,pollo alla cacciatora,petto di tacchino,fesa di tacchino,scaloppine di tacchino',
  pesce: 'pesce,merluzzo,nasello,baccala,stoccafisso,salmone,tonno,palamita,sgombro,orata,branzino,spigola,sogliola,platessa,rombo,trota,ricciola,ombrina,dentice,cefalo,cernia,scorfano,acciuga,acciughe,alici,sardina,sardine,sarde,pesce spada,persico,pangasio,aringa,granchio,gambero,gamberi,gamberetti,mazzancolle,scampi,aragosta,astice,cozze,vongole,ostriche,cape sante,capasanta,capesante,calamari,totani,polpo,polpi,seppie,moscardini,surimi,bastoncini di pesce,frutti di mare,ceviche,sashimi',
  legumi: 'legume,legumi,cece,ceci,fagiolo,fagioli,borlotti,cannellini,azuki,edamame,soia,tofu,tempeh,lenticchia,lenticchie,pisello,piselli,fave,cicerchie,lupini,fagioli neri,fagioli rossi,hummus,farinata,cecina,falafel,panelle,dahl,dal,mujadara',
  uova: 'uovo,uova,frittata,frittatine,omelette,omelet,uova strapazzate,uova sode,uovo sodo,uova al tegamino,uovo in camicia,shakshuka,tortilla di patate',
  latticini: 'latte,yogurt,kefir,skyr,formaggio,formaggi,mozzarella,mozzarelline,burrata,stracciatella,ricotta,stracchino,crescenza,robiola,caprino,mascarpone,fiocchi di latte,parmigiano,grana,pecorino,provola,provolone,scamorza,asiago,fontina,taleggio,gorgonzola,feta,cheddar,emmental,emmentaler,edam,gouda,brie,camembert,besciamella,quartirolo,primo sale,caciocavallo,squacquerone',
  verdure: 'verdura,verdure,ortaggi,insalata,lattuga,valeriana,rucola,radicchio,soncino,indivia,cicoria,scarola,bietole,bieta,spinaci,catalogna,cime di rapa,pomodoro,pomodori,pomodorino,pomodorini,passata,melanzana,melanzane,zucchina,zucchine,zucchino,zucca,carota,carote,peperone,peperoni,cetriolo,cetrioli,ravanello,ravanelli,broccoli,broccolo,cavolfiore,cavolfiori,cavolo,cavoli,verza,cavolini,finocchio,finocchi,sedano,sedano rapa,porro,porri,cipolla,cipolle,scalogno,asparago,asparagi,carciofo,carciofi,fagiolini,taccole,okra,barbabietola,rapa,rape,germogli,funghi,champignon,porcini,pleurotus,topinambur,avocado,minestrone,ratatouille,caponata,peperonata,giardiniera'
};

const dishes = [
 ['carbonara,spaghetti alla carbonara,rigatoni alla carbonara','pasta uova manzo latticini'],
 ['amatriciana,gricia,bucatini all amatriciana','pasta manzo latticini'],
 ['cacio e pepe,quattro formaggi,trofie al pesto,pasta al pesto','pasta latticini'],
 ['bolognese,lasagne al ragu,tagliatelle al ragu,pasta al ragu,cannelloni di carne','pasta manzo'],
 ['alla norma,orecchiette alle cime di rapa,pasta e zucchine,pasta al pomodoro,spaghetti al pomodoro','pasta verdure'],
 ['ravioli ricotta e spinaci,cannelloni ricotta e spinaci,tortelli di zucca','pasta latticini verdure'],
 ['pasta e ceci,pasta e fagioli,pasta e lenticchie,pasta e piselli','pasta legumi'],
 ['pasta e patate,gnocchi di patate','pasta patate'],
 ['spaghetti alle vongole,linguine allo scoglio,spaghetti ai frutti di mare,spaghetti al tonno','pasta pesce'],
 ['sushi,maki,nigiri,uramaki,poke di salmone,paella di pesce','riso pesce'],
 ['risi e bisi,riso con piselli,riso e lenticchie','riso legumi'],
 ['risotto alla zucca,risotto ai funghi,risotto al radicchio,risotto agli asparagi','riso verdure'],
 ['risotto alla milanese,risotto allo zafferano,risotto al parmigiano','riso latticini'],
 ['riso alla cantonese,riso cantonese','riso manzo uova legumi'],
 ['ragù,chili con carne,stufato di manzo','manzo'],
 ['caprese,parmigiana di melanzane,parmigiana,insalata greca','latticini verdure'],
 ['panzanella,bruschetta al pomodoro','pane verdure'],
 ['pizza margherita,pizza quattro formaggi,focaccia al formaggio','pane latticini'],
 ['pizza diavola,panino col prosciutto,piadina al prosciutto,hamburger nel panino','pane manzo'],
 ['panino col tonno,fish burger','pane pesce'],
 ['fish and chips,pesce e patatine','pesce patate'],
 ['frittata di zucchine,frittata di cipolle,frittata agli spinaci,shakshuka','uova verdure'],
 ['tortilla spagnola','uova patate'],
 ['vellutata di ceci,zuppa di lenticchie,zuppa di fagioli','legumi'],
 ['vellutata di zucca,vellutata di carote,crema di broccoli','verdure'],
 ['insalata capricciosa,insalata russa','patate verdure legumi'],
 ['tabbouleh con verdure,cous cous alle verdure,insalata di farro,insalata di quinoa','couscous verdure'],
 ['ceasar salad,caesar salad','pollo pane verdure latticini'],
 ['ribollita','pane legumi verdure'],
 ['polenta e funghi','couscous verdure'],
 ['pollo con patate','pollo patate']
];

export const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]+/g,' ').trim();
const entries = new Map();
const byLength = new Map();
function add(aliases, groups) {
  if (!groups.length) return;
  aliases.split(',').forEach(alias => {
    const key = normalize(alias);
    if (!key) return;
    const count = key.split(' ').length;
    const combined = [...new Set([...(entries.get(key) ?? []),...groups])];
    entries.set(key,combined);
    if (!byLength.has(count)) byLength.set(count,new Map());
    byLength.get(count).set(key,combined);
  });
}
Object.entries(catalog).forEach(([group,aliases]) => add(aliases,[group]));
dishes.forEach(([aliases,groups]) => add(aliases,groups.split(' ')));

export function indexRecipe(name, categories) {
  add(name,[...new Set(categories.filter(Boolean))]);
}
const ignored = new Set('al alla alle allo ai agli di con e o un uno una del dei delle per su nel nella ho mangiato mezza mezzo porzione pezzetto poco poca due tre senza'.split(' '));

function distance(a,b) {
  let prev = Array.from({length:b.length+1},(_,i)=>i);
  let older;
  for (let i=1;i<=a.length;i++) {
    const row = [i];
    for (let j=1;j<=b.length;j++) {
      row[j] = Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+Number(a[i-1]!==b[j-1]));
      if(i>1 && j>1 && a[i-1]===b[j-2] && a[i-2]===b[j-1]) row[j]=Math.min(row[j],older[j-2]+1);
    }
    older=prev;
    prev=row;
  }
  return prev[b.length];
}
function fuzzy(phrase,count) {
  const letters = phrase.replaceAll(' ','').length;
  const limit = letters>=11 ? 3 : letters>=7 ? 2 : letters>=3 ? 1 : 0;
  if (!limit) return;
  let best;
  let bestDistance=limit+1;
  let ambiguous=false;
  for (const [alias,groups] of byLength.get(count) ?? []) {
    if(Math.abs(alias.length-phrase.length)>limit || (letters===3 && alias[0]!==phrase[0])) continue;
    if(count>1 && alias[0]!==phrase[0]) continue;
    const d=distance(phrase,alias);
    if(d<bestDistance){best={alias,groups};bestDistance=d;ambiguous=false;}
    else if(d===bestDistance && best && groups.some(group=>!best.groups.includes(group))) ambiguous=true;
  }
  return bestDistance<=limit && !ambiguous ? best : undefined;
}

export function identifyLunch(value) {
  const tokens=normalize(value).split(' ').filter(Boolean);
  const groups=new Set();
  const corrections=new Set();
  for (let i=0;i<tokens.length;i++) {
    if(tokens[i]==='senza') break;
    if(ignored.has(tokens[i]) || /^\d+$/.test(tokens[i])) continue;
    let match;
    let consumed=1;
    for(let count=Math.min(6,tokens.length-i);count>0;count--) {
      const chunk=tokens.slice(i,i+count);
      if(chunk.includes('senza')) continue;
      const phrase=chunk.join(' ');
      const result=entries.get(phrase);
      if(result){match={groups:result};consumed=count;break;}
    }
    if(!match) {
      for(let count=Math.min(5,tokens.length-i);count>0;count--) {
        const chunk=tokens.slice(i,i+count);
        if(chunk.includes('senza') || ignored.has(chunk.at(-1))) continue;
        if(count>1 && chunk.some((word,j)=>j>0 && entries.has(word))) continue;
        match=fuzzy(chunk.join(' '),count);
        if(match){consumed=count;corrections.add(match.alias);break;}
      }
    }
    if(match) match.groups.forEach(group=>groups.add(group));
    i+=consumed-1;
  }
  return {groups:[...groups],corrections:[...corrections]};
}
