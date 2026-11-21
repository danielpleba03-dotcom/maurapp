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

const extraIngredients = {
  pasta:'pennoni,mafalde,reginette,scialatielli,elicoidali,calamarata,anellini,mezzi rigatoni,ruote,corzetti,trenette,bigoli,cingoli,sagne,strascinati,cicatelli,garganelli,quadrucci,maltagliati,tacconi,maritati,culurgiones,pisarei,gnudi,spaghetti di soia',
  riso:'riso parboiled,riso thai,riso nero,riso integrale,riso soffiato,riso glutinoso,riso violone,riso jasmine,riso originario,calasparra,riso baldo,riso sant andrea,hosomaki,futomaki',
  pane:'michette,michetta,puccia,pucce,tigelle,crescentine,gnocco fritto,schiacciatina,pinsa,pinse,focaccina,focaccine,piadina sfogliata,piada,pane carasau,pane guttiau,pane integrale,pane di segale,pane azzimo,crostone,crostoni,pretzel,muffin salato,crumpet,arepa,chapati,paratha',
  couscous:'grano bulgur,semolino,semola,gofio,teff,granoturco,fiocchi di mais,riso di farro,grano cotto,grano duro,segale,frik,granella di orzo,freekeh,amaranto soffiato',
  patate:'patata americana,patata viola,patate novelle,patate americane,patate al forno,patate lesse,patate in padella,wedge di patate,jacket potato,pommes frites',
  manzo:'lombata,scamone,cappello del prete,reale di manzo,fesone,magatello,girello,sottofesa,braciola,braciole,bistecchina,bistecchine,chianina,fassona,puntine,guancia di manzo,guance di manzo,trippa,lingua di manzo,nervetti,cotechini,finocchiona,culatello,culaccia,nduja,nduja calabrese,carne secca,costoletta,spalla di maiale,filetto di maiale,prosciutto arrosto',
  pollo:'pollo ruspante,pollo alla piastra,pollo grigliato,pollo al forno,pollo alla diavola,pollo allo spiedo,pollo in umido,pollastrino,gallinella di pollo,piccione,quaglia,quaglie,tacchina,fesa arrosto,tacchino arrosto,coscia di tacchino,spezzatino di tacchino',
  pesce:'cernie,halibut,mormora,pagello,palombo,verdesca,razza,luccio,lavarello,salmerino,storione,muggine,anguilla,capitone,triglia,triglie,boga,aguglia,occhiata,sugarello,merluzzetti,sgombri,pesce azzurro,pesce sciabola,lanzardo,tombarello,canocchia,canocchie,cannolicchi,fasolari,telline,lupini di mare,granseola,percebes,ricci di mare,pesce in carpione',
  legumi:'fagioli di spagna,fagioli dell occhio,fagioli corona,fagioli lamon,fagioli zolfini,borlotti freschi,ceci neri,piselli spezzati,lenticchie rosse,lenticchie beluga,lenticchie verdi,fave secche,proteine di soia,granulare di soia,injera di lenticchie,crema di fave,macco di fave',
  uova:'uova alla coque,uovo alla coque,occhio di bue,uova al forno,tuorlo,tuorli,albume,albumi,uova di quaglia,uovo barzotto,omelette francese',
  latticini:'grana padano,parmigiano reggiano,pecorino romano,pecorino sardo,caciotta,caciotte,primosale,roncal,montasio,bitto,formaggella,casera,branzi,raspadura,robiolina,caprini,formaggio spalmabile,quark,labneh,yogurt greco,panna,panna acida,latte di capra,toma,scamorza affumicata,treccia di mozzarella',
  verdure:'pak choi,bok choy,cavolo nero,cavolo rapa,cavolo cappuccio,cavolo rosso,cavolo cinese,cime di broccolo,broccoletti,broccolo romano,broccolo romanesco,bietola,coste,cicorino,puntarelle,agretti,barba di frate,ortiche,tarassaco,scarole,friarelli,friarielli,friggitelli,peperoni cruschi,peperone giallo,pomodori secchi,cuore di bue,pomodori datterini,pomodorini datterini,datterini,bietoline,cetriolini,carciofini,cardi,finocchietto,zucca delica,zucca mantovana,zucchine trombetta,zucchine tonde,fiori di zucca,funghi misti,finferli,chiodini,shiitake,maitake,pioppini,portobello,melanzana perlina,songino,lollo,iceberg,romana,belga,julienne di verdure'
};

const moreIngredients = {
  pasta:'troccoli,trofiette,tagliolini all uovo,linguine di grano duro,pennette integrali,spaghetti integrali,spaghetti di riso,lasagne verdi,lasagnette,testaroli,panigacci,fregula,fregola,fregola sarda,lorighittas,su filindeu,frascarelli,manfrigoli,passatelli,spoia lorda,marubini,anolini,tordelli,pansoti,pansotti,tortelli maremmani,mezzelune ripiene,gnocchi alla romana,canederli,knodel,culurgionis',
  riso:'riso vialone,riso nero venere,riso rosso ermes,riso carnaroli integrale,riso vialone nano,riso bomba,riso bomba per paella,riso balilla,riso padano,riso carolina,riso per sushi,riso profumato,riso lungo,riso indiano,riso per risotto,gohan,omurice',
  pane:'pizza in teglia,pizza in pala,pizza fritta,pizza rossa,pizza bianca,pizza al taglio,montanara,pita greca,lavash,piadina integrale,filoncino,francesino,pane toscano,pane siciliano,pane ai cereali,pan brioche,pan bauletto,semelle,muffuletta,schiacciata toscana,croissant salato,bretzel,piadina di farro',
  couscous:'fiocchi di farro,fiocchi d avena,fiocchi di orzo,orzo mondo,orzo decorticato,farro perlato,farro monococco,farro dicocco,cous cous integrale,cous cous di mais,cous cous di farro,polenta taragna,polenta bianca,polenta di mais,polenta gialla,granturco,polenta grigliata,burgul,grano spezzato',
  patate:'patate a pasta gialla,patate rosse,patate ratte,patate americane,patate schiacciate,patate sabbiose,patate hasselback,patate alla lionese,patate al vapore,patate ripiene',
  manzo:'coppa di maiale,petto di vitello,guanciale di maiale,collo di maiale,spalla di cervo,spiedini di maiale,bresaola della valtellina,lonzino,prosciutto di parma,san daniele,prosciutto di norcia,salame felino,salame napoli,salame ungherese,salsiccia luganega,luganega,salsiccia di bra,pancetta tesa,pancetta arrotolata,zampone,svizzera di manzo,polpettine di carne,rognone,fegato,animelle,frattaglie',
  pollo:'straccetti di pollo,straccetti di tacchino,suprema di pollo,pollo disossato,cotoletta di tacchino,bocconcini di tacchino,rollata di pollo,confit di anatra,petto di anatra,coscia d anatra,galletti,capponi,gallina lessa,faraona arrosto,petto di quaglia',
  pesce:'serra,pesce serra,lampuga,suro,merlano,molva,limanda,gallinella di mare,mazzola,mazzoni,coda di rospo,rana pescatrice,pescatrice,grongo,boga,alalunga,tonnetto,ventresca,bottarga,neonata,calamaretti,branzini,orate,merluzzi,occhiate,rombetto,murena,corvina,spatola,alaccia,calamaro ripieno',
  legumi:'lenticchie corallo,lenticchie decorticate,lenticchie di castelluccio,lenticchie di ustica,ceci di cicerale,ceci di navelli,ceci decorticati,ceci in scatola,borlotti secchi,fagioli toscanelli,fagioli mung,mungo,aduki,soia nera,farina di ceci,farina di lenticchie,farina di piselli,tofu affumicato,tofu vellutato,tofu marinato,tempeh di ceci',
  uova:'uova di anatra,uova di gallina,uova di oca,omelette al formaggio,omelette alle erbe,frittata al forno,frittata in padella,frittata arrotolata,souffle di uova',
  latticini:'raspa,pecorino toscano,pecorino fresco,pecorino di fossa,provola affumicata,provola dolce,ricotta di pecora,ricotta vaccina,ricotta salata,tuma,toma piemontese,puzzone di moena,formai de mut,bagoss,gruviera,raclette,stilton,mimolette,munster,edamer,mozzarella di bufala,fiordilatte,fior di latte,primosale vaccino,caprino fresco,robiola di roccaverano,formaggetta,yogurt bianco,crema di latte',
  verdure:'catalogna spigata,cicoria belga,indivia riccia,radicchio tardivo,radicchio di chioggia,radicchio di treviso,radicchio variegato,radicchio di castelfranco,scarola liscia,scarola riccia,lattuga cappuccina,scarola stufata,cavoletti di bruxelles,cavolo verza,verza viola,cavolo toscano,bietola da costa,bieta rossa,carciofo romanesco,carciofi violetti,carciofo spinoso,asparagi bianchi,asparagi verdi,asparagi selvatici,sedano verde,sedano bianco,cetriolo carosello,barattiere,caroselli,pomodori san marzano,pomodori piccadilly,pomodori ciliegino,ciliegini,pomodorini gialli,zucca butternut,zucca violina,zucca hokkaido,melanzana tonda,melanzana bianca,peperoni corno,peperone crusco,ravanelli bianchi,daikon,rafano,patisson,chayote,funghi finferli,prataioli,ovoli,orecchioni,funghi cardoncelli,cardoncelli'
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
 ['pollo con patate','pollo patate'],
 ['pasta tonno e limone,pasta con tonno,penne al tonno','pasta pesce'],
 ['pasta e zucchine,pasta alle zucchine,pasta alla nerano,spaghetti alla nerano','pasta verdure'],
 ['pollo alla pizzaiola,petto di pollo alla pizzaiola','pollo verdure latticini'],
 ['merluzzo alla mediterranea,merluzzo con pomodorini,merluzzo alla pizzaiola','pesce verdure'],
 ['zucchine trifolate,finocchi gratinati,carciofi alla romana,melanzane a funghetto,verdure ripassate','verdure'],
 ['polpettone al sugo,polpette al sugo,vitello tonnato','manzo'],
 ['vitello tonnato','pesce uova'],
 ['baccala mantecato,baccala alla vicentina,stoccafisso alla genovese,pesce all acqua pazza,sarde in saor','pesce'],
 ['seppie e piselli,seppie con piselli','pesce legumi'],
 ['pisarei e faso,pisarei e fasoi,sagne e fagioli,lagane e ceci','pasta legumi'],
 ['chili sin carne,zuppa di fagioli neri,dahl di lenticchie','legumi'],
 ['risotto alla pescatora,risotto al nero di seppia,riso e gamberetti','riso pesce'],
 ['risotto al pollo,riso al curry con pollo,riso pollo e verdure','riso pollo'],
 ['cous cous al pollo,tabbouleh di pollo','couscous pollo'],
 ['poke al tonno,poke di tonno,poke al salmone','riso pesce'],
 ['poke al pollo,poke di pollo','riso pollo'],
 ['gnocchi alla sorrentina','pasta latticini verdure'],
 ['pasta alla zozzona,tagliatelle alla boscaiola,pasta salsiccia e funghi','pasta manzo verdure'],
 ['pasta alla vodka,mac and cheese','pasta latticini'],
 ['parmigiana di zucchine,finocchi al latte','verdure latticini'],
 ['crespelle ricotta e spinaci,crepes ricotta e spinaci','latticini uova verdure'],
 ['frittata di pasta,frittata di maccheroni','pasta uova'],
 ['cotoletta di pollo,pollo alla milanese','pollo pane'],
 ['cotoletta alla milanese,cotoletta di vitello','manzo pane'],
 ['schnitzel,wiener schnitzel,cordon bleu','manzo pane'],
 ['pasta con ricotta,pasta e ricotta,pasta con feta','pasta latticini'],
 ['insalata di pollo,pollo e insalata','pollo verdure'],
 ['insalata nizzarda,nizzarda','verdure pesce uova patate'],
 ['insalata di patate,patate prezzemolate','patate'],
 ['baba ganoush,babaganoush,melitzanosalata','verdure'],
 ['chana masala','legumi'],
 ['palak paneer','latticini verdure'],
 ['pasta alla genovese','pasta manzo verdure'],
 ['pasta al forno,lasagne al forno','pasta latticini'],
 ['sformato di patate,gatto di patate,gatteau di patate','patate latticini'],
 ['uova in purgatorio,uova alla contadina','uova verdure'],
 ['pasta e lenticchie,pasta con lenticchie,ditalini con lenticchie','pasta legumi'],
 ['risotto ai funghi,risotto con funghi,risotto ai porcini,risotto con champignon','riso verdure latticini'],
 ['pollo alla romana,pollo ai peperoni,pollo alla cacciatora,pollo in umido con verdure','pollo verdure'],
 ['salmone al limone,salmone alla piastra,salmone in friggitrice ad aria','pesce'],
 ['frittata di spinaci,frittata di bietole,frittata di asparagi','uova verdure'],
 ['hummus di ceci,hummus di piselli,hummus di fagioli,hummus di lenticchie','legumi'],
 ['panzanella toscana,panzanella romana,acquasale,frisella al pomodoro','pane verdure'],
 ['insalata greca,horiatiki','verdure latticini'],
 ['riso alla pilota,risotto alla salsiccia','riso manzo'],
 ['risotto agli spinaci,riso e zucca,risotto ai carciofi,risotto alle zucchine','riso verdure latticini'],
 ['riso alla cubana','riso uova'],
 ['fregola con arselle,fregula con arselle,fregola alle vongole','pasta pesce'],
 ['pasta ai broccoli,orecchiette e broccoli,pasta con i broccoli','pasta verdure'],
 ['culurgiones di patate,culurgionis di patate','pasta patate latticini'],
 ['pansoti in salsa di noci,pansotti al sugo di noci','pasta verdure latticini'],
 ['passatelli in brodo,passatelli asciutti','pasta uova latticini'],
 ['canederli allo speck','pane uova manzo'],
 ['canederli agli spinaci','pane uova verdure'],
 ['lasagne verdi alla bolognese,lasagne alla bolognese','pasta manzo latticini'],
 ['tagliatelle funghi e speck','pasta verdure manzo'],
 ['linguine al cartoccio,pasta al pesce spada,paccheri con lo scorfano','pasta pesce'],
 ['spaghetti con le cozze,fettuccine ai gamberi,linguine ai gamberi','pasta pesce'],
 ['tramezzino tonno e uova','pane pesce uova'],
 ['pulled pork,pulled pork sandwich','manzo pane'],
 ['burrito di fagioli,burrito vegetariano con fagioli','pane legumi'],
 ['gyros di pollo,kebab di pollo,piadina kebab di pollo','pane pollo'],
 ['pizza tonno e cipolla,pinsa tonno e cipolla','pane pesce verdure'],
 ['piadina squacquerone e rucola,piadina stracchino e rucola','pane latticini verdure'],
 ['salade lyonnaise','verdure uova manzo pane'],
 ['trota alla mugnaia,sogliola alla mugnaia,orata all acqua pazza','pesce'],
 ['polpo e patate,insalata di polpo e patate','pesce patate'],
 ['pasta sarde e finocchietto,pasta con le sarde','pasta pesce verdure'],
 ['zuppa di cicerchie,zuppa di fave,zuppa di ceci','legumi'],
 ['fagioli all uccelletto,fagioli alla messicana','legumi verdure'],
 ['farro con fagioli,insalata di farro e ceci,orzo e ceci','couscous legumi'],
 ['cavolfiore gratinato,cavolfiore gratinato in friggitrice ad aria','verdure latticini'],
 ['zucchine ripiene di tonno','verdure pesce'],
 ['melanzane ripiene di carne,zucchine ripiene di carne','verdure manzo'],
 ['polenta e baccala,polenta con baccala','couscous pesce'],
 ['polenta e spezzatino,polenta con salsiccia','couscous manzo']
];

const familyLunchAliases = [
 ['pennette al gorgonzola,mezze maniche al gorgonzola,pasta alla crema di gorgonzola,gnocchi ai quattro formaggi,pasta burro e parmigiano,spaghetti con robiola','pasta latticini'],
 ['pasta con borlotti,pasta con cannellini,ditalini e cannellini,minestra di pasta e fagioli,ditalini ai ceci,tagliatelle e ceci','pasta legumi'],
 ['mezze penne al tonno,bucatini con tonno e olive,pasta con sgombro,spaghetti con acciughe,pasta con salmone affumicato,farfalle al salmone,pasta con la bottarga','pasta pesce'],
 ['pasta mista con patate,ditalini con patate,pasta con patate e provola','pasta patate'],
 ['pasta e patate con provola','pasta patate latticini'],
 ['penne alla vodka,pasta panna e prosciutto,tortellini panna e prosciutto','pasta latticini manzo'],
 ['pappardelle al cinghiale,pappardelle al ragu di lepre','pasta manzo'],
 ['bigoli con l anatra,bigoli all anatra,bigoli al ragu d anatra','pasta pollo'],
 ['bigoli in salsa,bucatini alle acciughe','pasta pesce'],
 ['spaghetti all assassina,penne alla puttanesca,sugo alla marinara','pasta verdure'],
 ['pizzoccheri della valtellina,pizzoccheri con verza','pasta patate verdure latticini'],
 ['gnocchi alla bava,gnocchetti al taleggio,gnocchi con fonduta','pasta latticini'],
 ['polenta con formaggio,polenta e gorgonzola,polenta e taleggio,polenta e latte','couscous latticini'],
 ['polenta con funghi,polenta e porcini,polenta ai funghi','couscous verdure'],
 ['risotto provola e radicchio,risotto alla crema di parmigiano,riso al grana,risotto allo zafferano e parmigiano','riso latticini'],
 ['riso nero con gamberi,risotto alle vongole,risotto con capesante,risotto agli scampi','riso pesce'],
 ['riso e fagioli,riso con fagioli neri,frijoles con arroz','riso legumi'],
 ['uova strapazzate al pomodoro,occhio di bue con spinaci,uovo al tegamino con spinaci,shakshuka con pomodori','uova verdure'],
 ['uova strapazzate al formaggio,uova strapazzate con ricotta','uova latticini'],
 ['frittata ai funghi,omelette agli champignon,omelette ai funghi,frittatina agli asparagi','uova verdure'],
 ['frittata con patate,frittata di patate senza forno','uova patate'],
 ['scaloppine di vitello al limone,scaloppine di vitello ai funghi,scaloppine di maiale,saltimbocca alla romana,involtini di vitello,ragù di vitello,tagliata di fassona','manzo'],
 ['pollo al marsala,pollo ai funghi,pollo alla senape,pollo alla paprika,pollo in tegame,pollo alla birra,involtini di pollo,straccetti di tacchino al limone,tacchino alla piastra','pollo'],
 ['spezzatino di pollo con patate,tacchino con patate','pollo patate'],
 ['straccetti di manzo alla rucola,bistecca con rucola,tagliata con rucola e pomodorini,polpette di manzo al pomodoro','manzo verdure'],
 ['orata all acqua pazza,spigola all acqua pazza,branzino all acqua pazza,ombrina all acqua pazza','pesce verdure'],
 ['orata al cartoccio,branzino al cartoccio,trota al cartoccio,cartoccio di salmone,merluzzo al cartoccio,trancio di tonno alla griglia','pesce'],
 ['acciughe marinate,sarde grigliate,sgombro sott olio,merluzzo al vapore,merluzzo gratinato,limanda panata,spigola alla mediterranea,orata alla griglia,branzino al sale','pesce'],
 ['sogliola con patate,merluzzo e patate,baccala e patate,baccala con patate','pesce patate'],
 ['tonno e ceci,insalata di fagioli e tonno,insalata di cannellini e tonno','pesce legumi'],
 ['cavolo nero stufato,spinaci saltati,spinaci all aglio,bietole ripassate,bietole saltate,erbette in padella,carciofi trifolati,puntarelle all aglio,finocchi a fettine,peperoni stufati,peperoni in agrodolce,peperoni grigliati,cipolle gratinate,cipolle in agrodolce,carote alla julienne,fagiolini lessi,broccoli al vapore','verdure'],
 ['vellutata di zucchine,vellutata di porri e patate,vellutata di zucchine e patate','verdure patate'],
 ['crema di finocchi,crema di carciofi,vellutata di sedano rapa,vellutata di cavolo nero,vellutata di funghi','verdure'],
 ['baba ganoush con crostini,hummus e pane,pane e hummus,cecina nel panino','pane legumi'],
 ['puccia con prosciutto,tigelle con salame,crescentina con prosciutto,sandwich al roast beef','pane manzo'],
 ['toast al formaggio,toast alla mozzarella,crostini alla ricotta,crostini al gorgonzola,focaccia di recco','pane latticini'],
 ['toast prosciutto e formaggio,toast con prosciutto e mozzarella,panino prosciutto e mozzarella','pane manzo latticini'],
 ['toast al salmone,crostini con salmone,crostini di sgombro','pane pesce'],
 ['piadina con frittata,sandwich alle uova','pane uova'],
 ['insalata di farro col tonno,farro al tonno,farro con salmone','couscous pesce'],
 ['farro con ceci e verdure,orzo con lenticchie,farro e lenticchie,cous cous con lenticchie','couscous legumi'],
 ['minestra di farro e verdure,orzo con verdure,cous cous con melanzane','couscous verdure'],
 ['insalata di ceci e verdure,ceci in insalata,lenticchie in umido,piselli stufati,cannellini alla salvia,zuppa di borlotti e verdure','legumi']
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
Object.entries(extraIngredients).forEach(([group,aliases]) => add(aliases,[group]));
Object.entries(moreIngredients).forEach(([group,aliases]) => add(aliases,[group]));
dishes.forEach(([aliases,groups]) => add(aliases,groups.split(' ')));
familyLunchAliases.forEach(([aliases,groups]) => add(aliases,groups.split(' ')));

export function indexRecipe(name, categories) {
  add(name,[...new Set(categories.filter(Boolean))]);
}
const ignored = new Set('al alla alle allo ai agli di con e o un uno una del dei delle per su nel nella ho mangiato mezza mezzo porzione pezzetto poco poca due tre senza olio sale pepe aceto prezzemolo basilico origano tahina cumino paprika curcuma cannella'.split(' '));

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

export function catalogSize() { return entries.size; }

export function identifyLunch(value,allowFuzzy = true) {
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
    if(!match && allowFuzzy) {
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
