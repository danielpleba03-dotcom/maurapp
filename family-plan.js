export const cycleStart = '2026-11-16';
export const firstSchoolWeek = 4;

// The school menu covers weekdays. Keep only mains and sides in the planner.
export const schoolWeeks = [
 [
  'Risotto alla zucca, Asiago, fagiolini all’olio, finocchi julienne',
  'Pasta al ragù di verdure, filetto di limanda gratinata, bietole all’olio, carote julienne',
  'Riso al pomodoro, arrosto di maiale al timo, finocchi gratinati, insalata verde',
  'Passato di verdure e legumi con orzo, frittata al formaggio, patate arrosto, cavolo cappuccio julienne',
  'Pizza margherita, prosciutto cotto, cavolfiore all’olio, insalata verde'
 ],
 [
  'Pasta all’olio, frittata alle verdure, fagiolini all’olio, insalata verde',
  'Pasta integrale al pomodoro, fagioli all’uccelletto, spinaci alla parmigiana, finocchi julienne',
  'Riso all’olio, filetto di merluzzo con pomodoro e olive, carote e piselli agli aromi, insalata verde',
  'Polenta, bocconcini di manzo in umido, broccoli all’olio, carote julienne',
  'Crema di carote e lenticchie con riso, Edamer, patate al prezzemolo, cavolo cappuccio julienne'
 ],
 [
  'Pasta integrale al pesto, frittata ai porri, bietole all’olio, carote julienne',
  'Pizza margherita, prosciutto cotto, spinaci alla parmigiana, insalata verde',
  'Riso al pomodoro, polpette di ceci e zucca, finocchi julienne',
  'Pasta all’olio, filetto di limanda gratinato alle verdure, carote al rosmarino, cavolo cappuccio julienne',
  'Vellutata di patate e porri con farro, robiola bresciana, finocchi gratinati, insalata verde'
 ],
 [
  'Pizza margherita, mozzarelline, fagiolini all’olio, cavolo cappuccio julienne',
  'Riso e piselli, ceci e olive nere in umido, cavolfiori all’olio, finocchi julienne',
  'Crema di zucca con crostini, arrosto di tacchino al forno, patate al vapore, insalata verde',
  'Pasta all’olio, filetto di merluzzo al timo, broccoli all’olio, carote julienne',
  'Pasta integrale al pomodoro e origano, frittata al formaggio, carote e piselli agli aromi, insalata verde'
 ],
 [
  'Pasta al pesto rosso, primo sale, cavolfiori all’olio, finocchi julienne',
  'Pasta integrale alla pizzaiola, bocconcini di pollo e piselli, carote prezzemolate, insalata verde',
  'Riso all’olio, macedonia di legumi in umido, finocchi gratinati, carote julienne',
  'Passato di verdure con crostini, frittata alle verdure, patate al rosmarino, insalata verde',
  'Pasta al pomodoro e olive, filetto di merluzzo al forno, spinaci alla parmigiana, cavolo cappuccio julienne'
 ]
];

export const previousMauroLunches = [
 'Pasta con condimento leggero e contorno',
 'Cereali, legumi e verdure',
 'Carne conservata, contorno e pane',
 'Formaggi o latticini, contorno e pane',
 'Pasta e legumi',
 'Pesce fresco, contorno e pane',
 'Carne fresca, contorno e pane'
];
export const mauroLunches = ['Pasta','Cereali, Legumi','Carne conservata','Formaggio','Pasta, Legumi','Pesce','Carne'];

export const mauroDinners = [
 {label:'Uova',extras:'Contorno e pane',options:['frittata','frittata-spinaci','uova','uova-strapazzate']},
 {label:'Carne fresca',extras:'Contorno e pane',options:['manzo','limone','tacchino','scaloppine-vitello']},
 {label:'Cereali',extras:'Contorno',options:['zucca','risotto-funghi','riso-verdure','risotto-zafferano']},
 {label:'Pesce fresco',extras:'Contorno e pane',options:['pesce','orata','salmone','merluzzo-padella','salmone-aria','orata-acqua-pazza']},
 {label:'Carne fresca',extras:'Contorno e pane',options:['tacchino','manzo','limone','scaloppine-vitello']},
 {label:'Pizza al piatto',extras:'',options:['pizza-margherita','pizza-marinara']},
 {label:'Vellutata e pesce conservato',extras:'Pane o crostini',options:['vellutata-tonno','vellutata-sgombro']}
];

export const previewRecipes = {
 'riso-verdure':{name:'Riso con zucchine e carote',icon:'🍚',protein:'',carb:'riso',ingredients:[['Riso',320,'g'],['Zucchine',320,'g'],['Carote',240,'g'],['Olio d’oliva',24,'ml']],prep:'Lessa il riso. Salta le verdure a cubetti nell’olio finché sono tenere. Uniscile al riso e mescola.'},
 'pizza-margherita':{name:'Pizza margherita',icon:'🍕',protein:'latticini',carb:'pane',ingredients:[['Impasto per pizza',1000,'g'],['Passata',400,'g'],['Mozzarella',320,'g'],['Basilico',8,'foglie']],prep:'Stendi quattro pizze, distribuisci la passata e cuoci in forno ben caldo. Aggiungi la mozzarella negli ultimi minuti e completa con basilico.'},
 'pizza-marinara':{name:'Pizza marinara',icon:'🍕',protein:'',carb:'pane',ingredients:[['Impasto per pizza',1000,'g'],['Passata',420,'g'],['Aglio',2,'spicchi'],['Origano',4,'g'],['Olio d’oliva',24,'ml']],prep:'Stendi quattro pizze. Distribuisci passata, aglio sottile, origano e olio. Cuoci in forno ben caldo finché il bordo è dorato.'},
 'vellutata-tonno':{name:'Vellutata di zucca con tonno a parte',icon:'🥣',protein:'pesce',carb:'',ingredients:[['Zucca',800,'g'],['Porro',100,'g'],['Acqua',500,'ml'],['Tonno al naturale sgocciolato',360,'g']],prep:'Fai sobbollire la zucca e il porro a cubetti finché sono morbidi, poi frulla. Scola il tonno e servilo a parte, con pane o crostini.'},
 'vellutata-sgombro':{name:'Vellutata di zucchine con sgombro a parte',icon:'🥣',protein:'pesce',carb:'',ingredients:[['Zucchine',800,'g'],['Porro',100,'g'],['Acqua',500,'ml'],['Sgombro al naturale sgocciolato',320,'g']],prep:'Fai sobbollire le verdure a pezzi finché sono tenere, poi frulla. Scola lo sgombro e servilo a parte, con pane o crostini.'}
};
