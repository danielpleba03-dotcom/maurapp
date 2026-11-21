import {recipes} from './recipes.js?v=14';
import {identifyLunch,indexRecipe,normalize,catalogSize} from './lunch-catalog.js?v=14';
import {cycleStart,firstSchoolWeek,schoolWeeks,mauroLunches,previousMauroLunches,mauroDinners,previewRecipes} from './family-plan.js?v=14';
import {extraRecipes} from './more-recipes.js?v=14';
import {sourceRecipes} from './source-recipes.js?v=14';

Object.assign(recipes,previewRecipes,extraRecipes);
const now = () => new Date();


const family = ['Mauro','Cassandra','Lorenzo','Francesca'];
const days = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const dayIcons = ['🌿','☀️','🥕','🍋','⭐','🌼','🧡'];
const mains = ['pollo','riso','frittata','manzo','pesce','burger','pasta','piadina','ceci','farfalle','pesto','couscous','tacchino','salmone','piselli','zucca','limone','lentiche','cannellini','orata','uova','caprese','zucchina-pasta','tonno-limone','pizzaiola-pollo','merluzzo-padella','pasta-lenticchie','risotto-funghi','gnocchi-sorrentina','frittata-spinaci','pollo-cacciatora','salmone-aria','insalata-greca',...Object.keys(previewRecipes)];
const sides = ['verdure','insalata','fagiolini','broccoli','patate','carote','bruschetta','zucchine-trifolate','finocchi-gratinati','melanzane-funghetto','cavolfiore-aria','hummus','panzanella'];
const recipeGroups = [
  ['Primi',['pasta','farfalle','pesto','riso','couscous','piselli','zucca','lentiche','zucchina-pasta','tonno-limone','pasta-lenticchie','risotto-funghi','gnocchi-sorrentina','riso-verdure']],
  ['Secondi',['manzo','pollo','tacchino','pesce','salmone','frittata','burger','limone','cannellini','orata','uova','caprese','pizzaiola-pollo','merluzzo-padella','frittata-spinaci','pollo-cacciatora','salmone-aria','insalata-greca','vellutata-tonno','vellutata-sgombro']],
  ['Contorni ed altro',['verdure','insalata','fagiolini','broccoli','patate','piadina','ceci','carote','bruschetta','zucchine-trifolate','finocchi-gratinati','melanzane-funghetto','cavolfiore-aria','hummus','panzanella','pizza-margherita','pizza-marinara']]
];
const extraSides = Object.entries(extraRecipes).filter(([,recipe])=>recipe.group===2).map(([key])=>key);
for(const [key,recipe] of Object.entries(extraRecipes)){
  recipeGroups[recipe.group][1].push(key);
  (recipe.group===2 ? sides : mains).push(key);
}
const legacySplit = 'pesce-riso';
const proteinGroups = ['manzo','pollo','pesce','legumi','uova','latticini'];
const carbGroups = ['pasta','riso','pane','couscous','patate'];
const userRecipesKey = 'maurapp-ricette-v1';
function readUserRecipes() {
  try { return JSON.parse(localStorage.getItem(userRecipesKey)) ?? []; }
  catch { return []; }
}
let userRecipes = readUserRecipes();
const userGroups = {first:0,second:1,side:2,other:2};
function registerRecipe({id,type,name,ingredients,prep,source}) {
  if (Object.hasOwn(recipes,id)) return;
  const icon = ({first:'🍝',second:'🍽️',side:'🥗',other:'🍴'})[type];
  const categories = lunchTags(ingredients.map(([ingredient]) => ingredient).join(' '));
  const protein = ['manzo','pollo','pesce','legumi','uova','latticini'].find(key => categories.includes(key)) ?? '';
  const carb = ['pasta','riso','pane','couscous','patate'].find(key => categories.includes(key)) ?? '';
  recipes[id] = {name,icon,protein,carb,ingredients,prep,source:safeSource(source)};
  indexRecipe(name,categories);
  recipeGroups[userGroups[type]][1].push(id);
  (type === 'side' ? sides : mains).push(id);
}
const recipeEditor = document.querySelector('#recipeEditor');
const recipeForm = document.querySelector('#recipeForm');
const ingredientRows = document.querySelector('#ingredientRows');
const storageKey = 'maurapp-weeks-v2';
const legacyStorageKey = 'maurapp-menu-v1';
const historyDialog = document.querySelector('#weekHistory');
const dinnerEditor = document.querySelector('#dinnerEditor');
const dinnerPeople = document.querySelector('#dinnerPeople');
let dinnerDraft;
let dinnerIndex;
let dinnerTrigger;
const historyDate = document.querySelector('#historyDate');
const dateFormat = new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric'});
function dateKey(date) {
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
function fromKey(key) {
  const [year,month,day] = key.split('-').map(Number);
  return new Date(year,month-1,day,12);
}
function weekKey(date = now()) {
  const monday = new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
  monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
  return dateKey(monday);
}
function weekLabel(key) {
  const start = fromKey(key);
  const end = fromKey(key);
  end.setDate(end.getDate()+6);
  return dateFormat.formatRange(start,end);
}
function cycleIndex(key) {
  const utc = value => Date.parse(value+'T00:00:00Z');
  const elapsed = Math.floor((utc(key)-utc(cycleStart))/(7*86400000));
  return elapsed<0 ? -1 : (elapsed+firstSchoolWeek)%schoolWeeks.length;
}
function plannedLunches(key,index) {
  const cycle = cycleIndex(key);
  const school = cycle>=0 ? schoolWeeks[cycle][index] : null;
  return [mauroLunches[index],school ?? '',''];
}
function emptyWeek(key = weekKey()) {
  return Array.from({length:7},(_,index)=>({lunches:plannedLunches(key,index),turn:0,nextMenu:true}));
}
function readWeeks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.days) && saved.days.length===7 && typeof saved.active==='string') return saved;
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (Array.isArray(legacy) && legacy.length===7) return {active:weekKey(),days:legacy,archive:{}};
  } catch {}
  return {active:weekKey(),days:emptyWeek(),archive:{}};
}
const categoryNames = {
  pasta:'Pasta', riso:'Riso', pane:'Pane e pizza', couscous:'Altri cereali', patate:'Patate',
  manzo:'Carne', pollo:'Pollo e tacchino', pesce:'Pesce', legumi:'Legumi',
  uova:'Uova', latticini:'Latticini', verdure:'Verdure'
};
const main = document.querySelector('#main');
const book = document.querySelector('#book');
const dialog = document.querySelector('#editor');
const lunchRows = document.querySelector('#lunchRows');
const announce = document.querySelector('#announce');
let ledger = readWeeks();
let state = ledger.days;
let viewedWeek = null;
let visibleMenu;
let editing;
let lunchTrigger;
let weekScroll=0;
let recipeFilter = 'all';
let recipeQuery = '';
let recipeLimit = 18;
const save = () => {
  try { localStorage.setItem(storageKey,JSON.stringify(ledger)); return true; }
  catch { return false; }
};
function safeSource(value) {
  try {
    const url = new URL(value);
    return ['https:','http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
function lunchTags(value) {
  const recognized = identifyLunch(value).groups;
  const dish = Object.values(recipes).find(recipe => normalize(recipe.name) === normalize(value));
  return [...new Set([...recognized,dish?.protein,dish?.carb].filter(Boolean))];
}
const recipeDescriptions=new Map();
const knownRecipeNames=new Set(Object.values(recipes).map(recipe=>normalize(recipe.name)));
const importedSides=[];
function describeRecipe(recipe) {
  return normalize(recipe.name+' '+recipe.ingredients.map(([name])=>name).join(' '));
}
function registerSourceRecipe(record) {
  const {id,name,ingredients,group,source,minutes}=record;
  const canonicalName=normalize(name);
  if(knownRecipeNames.has(canonicalName)) return;
  knownRecipeNames.add(canonicalName);
  const titleTags=identifyLunch(name,false).groups;
  const fullTags=new Set(titleTags);
  const weighted=new Map();
  for(const [ingredient,amount,unit] of ingredients) {
    const tags=identifyLunch(ingredient,false).groups;
    indexRecipe(ingredient,tags);
    const weight=unit==='kg' ? (amount ?? 0)*1000 : unit==='g' ? amount ?? 0 :
      !unit && amount ? 100 : 10;
    for(const tag of tags) {
      fullTags.add(tag);
      weighted.set(tag,(weighted.get(tag) ?? 0)+weight);
    }
  }
  const highest = (groups,minimum) => [...weighted]
    .filter(([tag,weight])=>groups.includes(tag) && weight>=minimum)
    .sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '';
  const protein=titleTags.find(tag=>proteinGroups.includes(tag)) ?? highest(proteinGroups,120);
  const carb=titleTags.find(tag=>carbGroups.includes(tag)) ?? highest(carbGroups,100);
  const icon=['🍝','🍽️','🥗'][group];
  recipes[id]={name,icon,ingredients,group,source,minutes,protein,carb};
  recipeGroups[group][1].push(id);
  if(group!==2 && (protein || carb) && minutes<=40) mains.push(id);
  if(group===2 && !protein && !carb && fullTags.has('verdure') && minutes<=30) importedSides.push(id);
  const normalized=normalize(name);
  const staple=normalized.split(/ (?:al|alla|alle|allo|ai|agli|con|senza|in|e) /,1)[0];
  if(staple && ((protein || carb) || fullTags.has('verdure'))) {
    indexRecipe(name,[...fullTags]);
    const shortened=normalized.replace(/ (?:in padella|in friggitrice ad aria|al forno|fatti in casa|fatte in casa)$/,'');
    if(shortened!==normalized && shortened.includes(' ')) indexRecipe(shortened,[...fullTags]);
  }
  recipeDescriptions.set(id,describeRecipe(recipes[id]));
}
sourceRecipes.forEach(registerSourceRecipe);

for (const recipe of Object.values(recipes)) {
  if(recipe.minutes) continue;
  const ingredients = recipe.ingredients.flatMap(([name])=>identifyLunch(name,false).groups);
  indexRecipe(recipe.name,[recipe.protein,recipe.carb,...ingredients]);
}
userRecipes.forEach(registerRecipe);
document.documentElement.dataset.catalogSize=String(catalogSize());

const lunchItems = value => value.split(',').map(item=>item.trim()).filter(Boolean);
const specificIngredients = ['merluzz','salmone','tonno','sgombro','orata','branzino','sogliol','limanda','pollo','tacchin','manzo','vitell','maiale','lenticch','ceci','fagiol','pisell','mozzarell','ricotta'];
function lunchProfile(value) {
  const primary = new Set();
  const minor = new Set();
  const ingredients = new Set();
  const core = groups => groups.filter(tag=>proteinGroups.includes(tag) || carbGroups.includes(tag));
  for(const item of lunchItems(value)){
    const normalized=normalize(item);
    const head=normalized.split(/ (?:al|alla|alle|allo|ai|agli|con|senza|in|e) /,1)[0];
    const all=core(lunchTags(item));
    const keyGroups=head==='cereali' ? ['riso','couscous'] : core(lunchTags(head));
    // A topping contributes context, while a separate row counts as its own course.
    const leading=keyGroups.length ? keyGroups : all;
    leading.forEach(tag=>primary.add(tag));
    all.filter(tag=>!leading.includes(tag)).forEach(tag=>minor.add(tag));
    specificIngredients.filter(term=>normalized.includes(term)).forEach(term=>ingredients.add(term));
  }
  return {primary:[...primary],minor:[...minor].filter(tag=>!primary.has(tag)),ingredients:[...ingredients]};
}
function categoriesFor(index,person) {
  const value=state[index].lunches[person] ?? '';
  return lunchProfile(value);
}
function lunchEditorValue() {
  return [...lunchRows.querySelectorAll('input')].map(field=>field.value.trim()).filter(Boolean).join(', ');
}
function showMatch() {
  const value=lunchEditorValue();
  const {corrections}=identifyLunch(value);
  const {primary,minor}=lunchProfile(value);
  const label=document.querySelector('#lunchMatch');
  const name=tags=>tags.map(key=>categoryNames[key]).join(', ');
  label.textContent=!value ? '' : primary.length
    ? 'Fonti principali · '+name(primary)+(minor.length ? ' · Nel condimento o nel piatto: '+name(minor) : '')+
      (corrections.length ? ' · Possibile correzione: '+corrections.join(', ') : '')
    : lunchTags(value).length ? 'Riconosciuto · '+name(lunchTags(value)) : 'Piatto non riconosciuto. La cena userà il resto del menù.';
}
lunchRows.addEventListener('input',showMatch);
function addLunchRow(value = '') {
  const row = document.createElement('div');
  row.className = 'lunch-item-editor';
  const field = document.createElement('input');
  field.type = 'text';
  field.maxLength = 180;
  field.placeholder = 'Es. carote julienne';
  field.setAttribute('aria-label','Piatto o contorno');
  field.value = value;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'close';
  remove.textContent = '×';
  remove.setAttribute('aria-label','Togli questa riga');
  remove.onclick = () => {
    const focus = row.nextElementSibling?.querySelector('input') ?? row.previousElementSibling?.querySelector('input');
    row.remove();
    (focus ?? document.querySelector('#addLunchRow')).focus();
    showMatch();
  };
  row.append(field,remove);
  lunchRows.append(row);
  return field;
}
document.querySelector('#addLunchRow').onclick = () => addLunchRow().focus();
function dinnerParts(key) {
  return (key === legacySplit ? 'pesce+riso' : key).split('+');
}
function similarLunch(a,b) {
  return a.primary.some(tag=>b.primary.includes(tag));
}
const hadStarch = lunch => lunch.primary.some(tag=>carbGroups.includes(tag));
function mealScore(key,lunch) {
  const {protein,carb} = recipes[key];
  const recipeText=recipeDescriptions.get(key) ?? describeRecipe(recipes[key]);
  const repeatsIngredient=lunch.ingredients.some(term=>recipeText.includes(term));
  return -(carb && hadStarch(lunch) ? 5 : 0) - (lunch.primary.includes(protein) ? 6 : 0)
    - (repeatsIngredient ? 2 : 0) - (lunch.minor.includes(protein) ? .5 : 0);
}
function canShare(key,lunch) {
  const {protein,carb} = recipes[key];
  return !lunch.primary.includes(protein) && (Boolean(protein) || !lunch.primary.includes(carb));
}
const vegetableFamilies = [
  'insalat|lattug|valerian|radicch|rucol','carot','broccol','cavolfior','cavol','fagiolin',
  'zucchin','melanzan','finocch','peperon','pomodor|passat','spinac','bietol','cetriol','carciof','patat'
].map(pattern=>new RegExp('(?:^| )(?:'+pattern+')'));
const sharedSides = ['insalata','carote','broccoli','cavolfiore-aria','fagiolini','zucchine-trifolate','melanzane-funghetto','finocchi-gratinati','verdure',...extraSides,...importedSides];
function chooseSharedSide(index,main) {
  const day=state[index];
  const tasted=day.lunches.map(normalize).join(' ');
  const exclude=vegetableFamilies.filter(group=>group.test(tasted));
  const available=sharedSides.filter(id=>{
    if (['pesce','salmone-aria'].includes(main) && (id==='cavolfiore-aria' || normalize(recipes[id].name).includes('friggitrice'))) return false;
    return recipes[id].ingredients.every(([ingredient])=>exclude.every(group=>!group.test(normalize(ingredient))));
  });
  if(!available.length) return null;
  const offset=(index+(day.turn ?? 0))%available.length;
  return available.find((_,i)=>i===offset);
}
function choose(index,alternate = false) {
  const day = state[index];
  const lunches = [0,1,2].map(person=>categoriesFor(index,person));
  const [mauro,cassandra,lorenzo] = lunches;
  const first = [0,3];
  const previous = day.proposals ?? [];
  const nearby = state.flatMap((entry,i)=>i===index ? [] : entry.eaten
    ? [...new Set(entry.eaten.flat().map(dish=>dish.id).filter(Boolean))]
    : (entry.proposals ?? []).map(proposal=>proposal.id));
  day.triedRecipes ??= {};
  function pick(pool,people,previousId,bonus = ()=>0) {
    const slot=people.join('-');
    const avoid = new Set(day.triedRecipes[slot] ?? []);
    if(alternate && previousId) avoid.add(previousId);
    let available = alternate ? pool.filter(key=>!avoid.has(key)) : pool;
    if(!available.length) {
      avoid.clear();
      if(previousId) avoid.add(previousId);
      available=pool.length>1 ? pool.filter(key=>key!==previousId) : pool;
    }
    day.triedRecipes[slot]=[...avoid];
    const offset = ((day.turn ?? 0)+index)%available.length;
    const ordered = [...available.slice(offset),...available.slice(0,offset)];
    const score = key => people.reduce((total,person)=>total+(lunches[person] ? mealScore(key,lunches[person]) : 0),0)
      - nearby.filter(id=>id===key).length+bonus(key);
    return ordered.reduce((best,key)=>score(key)>score(best) ? key : best);
  }
  const canJoinMauro = (key,person) => {
    const lunch=lunches[person];
    return similarLunch(mauro,lunch) && canShare(key,lunch) && !(hadStarch(lunch) && recipes[key].carb);
  };
  const fixed = pick(mauroDinners[index].options,first,previous[0]?.id,
    key=>[1,2].filter(person=>canJoinMauro(key,person)).length*3);
  for(const person of [1,2]) if(canJoinMauro(fixed,person)) first.push(person);
  const remaining = [1,2].filter(person=>!first.includes(person));
  const groups = [];
  if(remaining.length===2 && (similarLunch(cassandra,lorenzo) || !cassandra.primary.length || !lorenzo.primary.length)) {
    groups.push(remaining);
  } else {
    for(const person of remaining) groups.push([person]);
  }
  const used = new Set([fixed]);
  day.proposals = [{id:fixed,people:first},...groups.map(people=>{
    const pool=mains.filter(key=>!used.has(key) && (groups.length<2 || (recipes[key].minutes ?? 0)<=30));
    const compatible=pool.filter(key=>people.every(person=>canShare(key,lunches[person])));
    const wantsProtein=people.some(person=>hadStarch(lunches[person]));
    // In a starch-heavy lunch, changing rice to pasta at dinner is still a repeat.
    // Rotate within the protein-led options before considering a different course type.
    const proteinOnly=wantsProtein ? pool.filter(key=>recipes[key].protein && !recipes[key].carb) : [];
    const preferred=proteinOnly.filter(key=>people.every(person=>canShare(key,lunches[person])));
    const options=[preferred,proteinOnly,compatible,pool].find(list=>list.length);
    const old=previous.find(proposal=>people.every(person=>proposal.people.includes(person)))?.id;
    const id=pick(options,people,old);
    used.add(id);
    return {id,people};
  })];
  day.side = mauroDinners[index].extras.startsWith('Contorno') ? chooseSharedSide(index,fixed) : null;
}
function initializeWeek() {
  state.forEach((day,index) => {
    if(!day.nextMenu) {
      const planned = plannedLunches(ledger.active,index);
      day.lunches = [day.lunches[0] || planned[0],day.lunches[1] || planned[1],day.lunches[2] ?? ''];
      day.nextMenu = true;
    }
    if(day.lunches[0]===previousMauroLunches[index]) day.lunches[0]=mauroLunches[index];
    if(day.planVersion!==1 || !day.proposals?.length || day.proposals.some(({id})=>!recipes[id])) {
      choose(index);
      day.planVersion=1;
    }
    day.turn ??= 0;
  });
}
function rollWeek() {
  const current = weekKey();
  if (current<=ledger.active) return false;
  const latest = readWeeks();
  if(latest.active>=current) {
    ledger=latest;
    state=ledger.days;
  } else {
    if(latest.active===ledger.active) ledger=latest;
    ledger.archive[ledger.active]=ledger.days;
    ledger.active=current;
    ledger.days=ledger.upcoming?.[current] ?? emptyWeek(current);
    for (const [date,menu] of Object.entries(ledger.upcoming ?? {})){
      if(date<current) ledger.archive[date]=menu;
      if(date<=current) delete ledger.upcoming[date];
    }
    state=ledger.days;
    initializeWeek();
    save();
  }
  return true;
}
if(!rollWeek()){initializeWeek();save();}

const escaped = value => value.replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const amount = new Intl.NumberFormat('it-IT',{maximumFractionDigits:2});
const portions = n => n === 1 ? '1 porzione' : n+' porzioni';
const href = (id,n) => '#ricetta/'+id+'/'+n;
function meal(id,n,who,side = false) {
  const {name,icon} = recipes[id];
  return `<div class="meal${side ? ' meal-side' : ''}"><a class="dish" href="${href(id,n)}"><span aria-hidden="true">${icon}</span> ${escaped(name)}</a><span class="portions">${who} · ${portions(n)}</span></div>`;
}
function recordedDinner(eaten) {
  const dishes=new Map();
  eaten.forEach((items,person)=>items.forEach(item=>{
    const key=item.id || normalize(item.name) || item.name;
    if(!dishes.has(key)) dishes.set(key,{...item,people:new Set()});
    dishes.get(key).people.add(person);
  }));
  const format=new Intl.ListFormat('it');
  const list=[...dishes.values()].sort((a,b)=>Number(Boolean(a.side))-Number(Boolean(b.side)));
  return '<p class="dinner-recorded">Cena registrata</p>'+ (list.length ? list.map(dish=>{
    const count=dish.people.size;
    const who=count===4 ? 'Tutti' : format.format([...dish.people].map(person=>family[person]));
    if(dish.id && recipes[dish.id]) return meal(dish.id,count,who,dish.side);
    return `<div class="meal"><strong class="dish">${escaped(dish.name)}</strong><span class="portions">${who} · ${portions(count)}</span></div>`;
  }).join('') : '<p>Nessun piatto registrato.</p>');
}
function dinnerMarkup({dinner,side,portionMix,proposals,eaten}) {
  if(eaten) return recordedDinner(eaten);
  if(proposals?.length){
    const list = new Intl.ListFormat('it');
    const titles = proposals.map(({id,people})=>meal(id,people.length,
      people.length===4 ? 'Tutti' : list.format(people.map(person=>family[person])))).join('');
    return `${titles}${recipes[side] ? meal(side,4,'Contorno condiviso',true) : ''}`;
  }
  if(!dinner) return '';
  const [a,b] = dinnerParts(dinner);
  const sharedSide = recipes[side] ? meal(side,4,'Tutti',true) : '';
  if (!recipes[a] || (b && !recipes[b])) return '<p>Proposta non disponibile</p>'+sharedSide;
  if (!b) return meal(a,4,'Tutti')+sharedSide;
  const teams = [
    [['Mauro','Francesca'],['Cassandra','Lorenzo']],
    [['Mauro','Francesca','Lorenzo'],['Cassandra']],
    [['Mauro'],['Cassandra','Francesca','Lorenzo']]
  ];
  const [first,second] = teams[dinner===legacySplit ? 1 : portionMix ?? 0];
  const format = names => new Intl.ListFormat('it').format(names);
  return meal(a,first.length,format(first))+meal(b,second.length,format(second))+sharedSide;
}
function lunchButton(index,person,day = state[index], archived = false, week = ledger.active) {
  const name = family[person];
  const summary = (day.categories?.[person] ?? []).map(key => categoryNames[key]).join(', ');
  const items=lunchItems(day.lunches[person] || summary);
  const icon=['🌞','🌸','🍴'][person];
  const cycle=cycleIndex(week);
  const badge=person===1 && index===0 && cycle>=0 ? `<span class="cycle-badge" aria-label="Settimana ${cycle+1} su 5">Set. ${cycle+1} su 5</span>` : '';
  const container=`data-lunch-card="${person}" data-card-day="${index}"`;
  const label=`${items.length ? 'Modifica' : 'Aggiungi'} pranzo di ${name}, ${days[index]}`;
  const open=`type="button" data-lunch="${person}" data-day="${index}" aria-label="${label}"`;
  if(!items.length){
    const caption=`<span class="person">${name}${badge}</span><span class="lunch-text">${archived ? '—' : 'Aggiungi pranzo <span class="missing-lunch" aria-hidden="true">!</span>'}</span>`;
    return archived ? `<div class="lunch archived-lunch" ${container}>${caption}</div>`
      : `<button class="lunch lunch-empty" ${container} ${open}><span aria-hidden="true">${icon}</span>${caption}<span class="edit" aria-hidden="true">✎</span></button>`;
  }
  const cssClass=['mauro-lunch','cassandra-lunch','lorenzo-lunch'][person];
  return `<div class="listed-lunch ${cssClass}" ${container}>
    <div class="listed-lunch-head"><span aria-hidden="true">${icon}</span>${badge}<strong>${name}</strong>${!archived ? `<button class="listed-lunch-edit" ${open}>✎</button>` : ''}</div>
    <ul>${items.map((item,itemIndex)=>`<li><span>${escaped(item)}</span>${archived ? '' : `<button type="button" class="remove-item" data-remove-lunch="${itemIndex}" data-day="${index}" data-person="${person}" aria-label="Togli ${escaped(item)} dal pranzo di ${name}">×</button>`}</li>`).join('')}</ul></div>`;
}
function focusLunchEditor(card) {
  return card.matches('button') ? card : card.querySelector('[data-lunch]');
}
function futureMenu(key) {
  const active=state;
  const upcoming=emptyWeek(key);
  try {
    state=upcoming;
    upcoming.forEach((day,index)=>{choose(index);day.planVersion=1;});
  } finally {
    state=active;
  }
  return upcoming;
}
function renderWeek() {
  const selected=viewedWeek ?? ledger.active;
  const current=selected===ledger.active;
  const upcoming=selected>ledger.active;
  const menu=current ? state : upcoming ? ledger.upcoming?.[selected] ?? futureMenu(selected) : ledger.archive[selected];
  visibleMenu=menu;
  const title=current ? 'Menù della settimana' : upcoming ? 'Menù previsto' : 'Menù archiviato';
  const today = (now().getDay()+6)%7;
  const calendar = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/></svg>';
  main.innerHTML = `<div class="section-head"><div><h1 class="section-title">${title}</h1><p class="week-dates">${weekLabel(selected)}</p></div><div class="history-actions">${!current ? '<button class="outline" data-current-week>Settimana attuale</button>' : ''}<div class="week-nav"><button class="outline calendar-button week-arrow" data-week-step="-1" aria-label="Settimana precedente" title="Settimana precedente">&lt;</button><button class="outline calendar-button" data-history aria-label="Settimane passate" title="Settimane passate">${calendar}</button><button class="outline calendar-button week-arrow" data-week-step="1" aria-label="Settimana successiva" title="Settimana successiva">&gt;</button></div></div></div>
  <div class="week">${menu ? days.map((day,i) => `<article class="day" id="day-${i}"><div class="day-head"><span class="day-mark" aria-hidden="true">${dayIcons[i]}</span><h3>${day}</h3>${current && today===i ? '<span class="current">Oggi</span>' : ''}</div><div class="lunches">${lunchButton(i,0,menu[i],false,selected)}${lunchButton(i,1,menu[i],false,selected)}${lunchButton(i,2,menu[i],false,selected)}</div><div class="dinner dinner-editable"><div class="dinner-content"><div class="meals">${dinnerMarkup(menu[i])}</div></div><div class="dinner-actions"><button class="change" ${menu[i].eaten ? 'hidden' : ''} data-change="${i}" aria-label="Altra proposta, ${day}"><span aria-hidden="true">⟳</span> Altra proposta</button></div><button type="button" class="dinner-edit outline" data-edit-dinner="${i}" aria-label="Modifica cena, ${day}" title="Modifica cena">✎</button></div></article>`) .join('') : '<div class="week-unavailable"><p>Nessun menù salvato per questa settimana.</p><button type="button" class="outline" data-create-past-week>Crea menù</button></div>'}</div>`;
}
function openHistory() {
  historyDate.value = viewedWeek ?? '';
  document.querySelector('#historyMessage').textContent = '';
  const monday = fromKey(ledger.active);
  const keys = [];
  for (let i=0;i<2;i++) {
    monday.setDate(monday.getDate()-7);
    const key = dateKey(monday);
    if (Object.hasOwn(ledger.archive,key)) keys.push(key);
  }
  document.querySelector('#recentWeeks').innerHTML = keys.length
    ? '<h3>Ultime due settimane</h3>'+keys.map(key=>`<button class="outline" type="button" data-open-week="${key}">${weekLabel(key)}</button>`).join('')
    : '<p>Nessun menù archiviato nelle ultime due settimane. Puoi cercare altre date qui sopra.</p>';
  historyDialog.showModal();
}
function openArchivedWeek(key) {
  if(key<ledger.active && !Object.hasOwn(ledger.archive,key)) {
    document.querySelector('#historyMessage').textContent = 'Nessun menù salvato per la settimana '+weekLabel(key)+'.';
    return;
  }
  viewedWeek = key===ledger.active ? null : key;
  weekScroll = 0;
  historyDialog.close();
  renderRoute();
  main.querySelector(viewedWeek ? '[data-current-week]' : '[data-history]').focus();
}
historyDialog.querySelector('.close').onclick = () => historyDialog.close();
document.querySelector('#historyForm').addEventListener('submit',event => {
  event.preventDefault();
  if(historyDate.value) openArchivedWeek(weekKey(fromKey(historyDate.value)));
});
document.querySelector('#recentWeeks').addEventListener('click',event => {
  const target = event.target.closest('[data-open-week]');
  if(target) openArchivedWeek(target.dataset.openWeek);
});
function ingredients(recipe,n) {
  return '<ul>'+recipe.ingredients.map(([name,quantity,unit]) => {
    const measure = quantity===null ? unit : amount.format(quantity*n/4)+(unit ? ' '+unit : '');
    return `<li>${escaped(name)}${measure ? ' · '+escaped(measure) : ''}</li>`;
  }).join('')+'</ul>';
}
function renderRecipeResults() {
  const terms=normalize(recipeQuery).split(' ').filter(Boolean);
  const filtered=recipeGroups.map(([name,keys],index)=>[name,recipeFilter==='all'||recipeFilter===String(index)
    ? keys.filter(key=>terms.every(term=>normalize(recipes[key].name).includes(term))) : []]);
  const total=filtered.reduce((sum,[,keys])=>sum+keys.length,0);
  const perGroup=recipeFilter==='all' ? recipeLimit : recipeLimit*2;
  const results=document.querySelector('#recipeResults');
  results.innerHTML=filtered.filter(([,keys])=>keys.length).map(([title,keys])=>`<section class="recipe-group"><h2>${title}</h2><div class="recipes">${keys.slice(0,perGroup).map(key=>{
    const recipe=recipes[key];
    return `<article class="recipe"><h3><span aria-hidden="true">${recipe.icon}</span> ${escaped(recipe.name)}</h3><p>4 persone${recipe.minutes ? ' · '+recipe.minutes+' min' : ''}</p>${ingredients(recipe,4)}<a href="${href(key,4)}">Leggi la preparazione</a></article>`;
  }).join('')}</div></section>`).join('');
  document.querySelector('#recipeCount').textContent=total===1 ? '1 ricetta' : total+' ricette';
  document.querySelector('#moreResults').hidden=!filtered.some(([,keys])=>keys.length>perGroup);
}
function renderRoute() {
  const [,id,p] = location.hash.slice(1).split('/');
  const n = /^[1-4]$/.test(p) ? Number(p) : 4;
  const inBook = location.hash === '#ricettario';
  const inRecipe = location.hash.startsWith('#ricetta/') && Object.hasOwn(recipes,id);
  book.dataset.view = inBook || inRecipe ? 'week' : 'book';
  book.querySelector('.nav-label').textContent = inBook || inRecipe ? 'Menù della settimana' : 'Ricettario';
  book.querySelector('[aria-hidden]').textContent = inBook || inRecipe ? '📅' : '📖';
  if (inBook) {
    main.innerHTML = `<div class="view-head"><div class="book-title"><h1>Ricettario</h1><button class="primary" data-new-recipe>＋ Nuova ricetta</button></div></div>
      <div class="recipe-filters" role="group" aria-label="Filtra per categoria">${['Tutte',...recipeGroups.map(([title])=>title)].map((title,index) => {
        const value = index===0 ? 'all' : String(index-1);
        return `<button class="outline" type="button" data-filter="${value}" aria-pressed="${recipeFilter===value}">${title}</button>`;
      }).join('')}</div><label for="recipeSearch">Cerca una ricetta</label><input id="recipeSearch" type="search" value="${escaped(recipeQuery)}" placeholder="Es. pasta al pomodoro"><p id="recipeCount" class="week-dates" role="status"></p><div id="recipeResults"></div><button id="moreResults" type="button" class="outline" hidden>Mostra altre ricette</button>`;
    document.querySelector('#recipeSearch').addEventListener('input',event=>{
      recipeQuery=event.target.value;
      recipeLimit=18;
      renderRecipeResults();
    });
    document.querySelector('#moreResults').onclick=()=>{
      recipeLimit+=18;
      renderRecipeResults();
    };
    renderRecipeResults();
    scrollTo(0,0);
  } else if (inRecipe) {
    const recipe = recipes[id];
    main.innerHTML = `<div class="view-head"> <a class="outline back" href="#ricettario">Ricettario</a><div class="recipe-title"><h1>${escaped(recipe.name)}</h1>${recipe.source ? `<a class="outline source" href="${escaped(recipe.source)}" target="_blank" rel="noopener noreferrer">Fonte <span aria-hidden="true">↗</span></a>` : ''}</div></div><article class="prep"><strong>${n} ${n === 1 ? 'persona' : 'persone'}</strong>${ingredients(recipe,n)}<h2>Preparazione</h2>${recipe.prep ? `<p>${escaped(recipe.prep)}</p>` : `<p><a href="${escaped(recipe.source)}" target="_blank" rel="noopener noreferrer">Apri la preparazione sul sito della fonte</a></p>`}<p class="plan-note">Per Mauro valgono le quantità indicate nel suo piano personale.</p></article>`;
    scrollTo(0,0);
  } else {
    renderWeek();
    scrollTo(0,weekScroll);
  }
}
function refreshDinner(index) {
  const meals = document.querySelector('#day-'+index+' .meals');
  meals.innerHTML = dinnerMarkup(visibleMenu[index]);
  document.querySelector(`[data-change="${index}"]`).hidden=Boolean(visibleMenu[index].eaten);
  meals.classList.remove('fresh');
  requestAnimationFrame(() => meals.classList.add('fresh'));
}
function keepVisibleMenu() {
  if (viewedWeek>ledger.active) {
    ledger.upcoming ??= {};
    ledger.upcoming[viewedWeek]=visibleMenu;
  }
}
function chooseForVisibleWeek(index,alternate = false) {
  const active=state;
  try {
    state=visibleMenu;
    choose(index,alternate);
  } finally {
    state=active;
  }
}
function report(message) {
  keepVisibleMenu();
  announce.textContent = save() ? message : message+' Il browser non ha consentito il salvataggio.';
}
book.addEventListener('click',() => {
  if (book.dataset.view === 'book') weekScroll=scrollY;
  location.hash = book.dataset.view === 'week' ? '' : 'ricettario';
});
main.addEventListener('click',event => {
  if(event.target.closest('[data-create-past-week]')){
    ledger.archive[viewedWeek]=futureMenu(viewedWeek);
    save();
    renderRoute();
    main.querySelector('[data-edit-dinner]')?.focus();
    return;
  }
  const step=event.target.closest('[data-week-step]');
  if(step){
    const date=fromKey(viewedWeek ?? ledger.active);
    date.setDate(date.getDate()+Number(step.dataset.weekStep)*7);
    const key=dateKey(date);
    viewedWeek=key===ledger.active ? null : key;
    weekScroll=0;
    renderRoute();
    main.querySelector(`[data-week-step="${step.dataset.weekStep}"]`).focus();
    return;
  }
  const dinnerEdit = event.target.closest('[data-edit-dinner]');
  if(dinnerEdit){
    dinnerTrigger=dinnerEdit;
    openDinnerEditor(Number(dinnerEdit.dataset.editDinner));
    return;
  }
  const remove = event.target.closest('[data-remove-lunch]');
  if(remove){
    const index=Number(remove.dataset.day);
    const person=Number(remove.dataset.person);
    const items=lunchItems(visibleMenu[index].lunches[person] ?? '');
    items.splice(Number(remove.dataset.removeLunch),1);
    focusLunchEditor(updateLunch(index,person,items.join(', '))).focus();
    return;
  }
  if (event.target.closest('[data-history]')) openHistory();
  if (event.target.closest('[data-current-week]')) {
    viewedWeek = null;
    weekScroll = 0;
    renderRoute();
    main.querySelector('[data-history]').focus();
  }
  if (event.target.closest('[data-new-recipe]')) openRecipeEditor();
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    recipeFilter = filter.dataset.filter;
    main.querySelectorAll('[data-filter]').forEach(button => {
      button.setAttribute('aria-pressed', String(button===filter));
    });
    recipeLimit=18;
    renderRecipeResults();
  }
  const dish = event.target.closest('.dish');
  if (dish) weekScroll=scrollY;
  const change = event.target.closest('[data-change]');
  if (change) {
    const index = Number(change.dataset.change);
    visibleMenu[index].turn=(visibleMenu[index].turn ?? 0)+1;
    chooseForVisibleWeek(index,true);
    refreshDinner(index);
    report('Nuova cena per '+days[index]+'.');
  }
  const lunch = event.target.closest('[data-lunch]');
  if (lunch) {
    lunchTrigger=lunch;
    editing = [Number(lunch.dataset.day),Number(lunch.dataset.lunch)];
    const [index,person] = editing;
    document.querySelector('#editTitle').textContent = 'Pranzo di '+family[person];
    document.querySelector('#editDay').textContent = days[index];
    const value = visibleMenu[index].lunches[person] ?? '';
    lunchRows.replaceChildren();
    const items=lunchItems(value);
    (items.length ? items : ['']).forEach(addLunchRow);
    const focus=lunchRows.querySelector('input');
    showMatch();
    dialog.showModal();
    focus.focus();
  }
});
dialog.querySelector('.close').onclick = () => dialog.close();
document.querySelector('#cancel').onclick = () => dialog.close();
dialog.addEventListener('close',() => lunchTrigger?.focus());
function updateLunch(index,person,value) {
  const day=visibleMenu[index];
  if (day.categories) day.categories[person]=null;
  day.lunches[person]=value;
  chooseForVisibleWeek(index);
  const template = document.createElement('template');
  template.innerHTML = lunchButton(index,person,day,false,viewedWeek ?? ledger.active);
  const updated = template.content.firstElementChild;
  const current = main.querySelector(`[data-card-day="${index}"][data-lunch-card="${person}"]`);
  current.replaceWith(updated);
  refreshDinner(index);
  report('Pranzo aggiornato per '+family[person]+'.');
  return updated;
}
document.querySelector('#lunchForm').addEventListener('submit',event => {
  event.preventDefault();
  const [index,person] = editing;
  const value = lunchEditorValue();
  if (value !== visibleMenu[index].lunches[person]) {
    const updated=updateLunch(index,person,value);
    lunchTrigger=focusLunchEditor(updated);
  }
  dialog.close();
});
function proposedDinners(day) {
  const initial=family.map(()=>[]);
  for(const {id,people} of day.proposals ?? []) {
    if(recipes[id]) for(const person of people) initial[person].push({id,name:recipes[id].name});
  }
  if(day.side && recipes[day.side]){
    for(const items of initial) items.push({id:day.side,name:recipes[day.side].name,side:true});
  }
  return initial;
}
function openDinnerEditor(index) {
  dinnerIndex=index;
  dinnerDraft=structuredClone(visibleMenu[index].eaten ?? proposedDinners(visibleMenu[index]));
  document.querySelector('#dinnerEditDay').textContent=days[index];
  renderDinnerEditor();
  dinnerEditor.showModal();
}
function renderDinnerEditor() {
  dinnerPeople.innerHTML=family.map((name,person)=>`<fieldset class="dinner-person" data-dinner-person="${person}">
    <legend>${name}</legend>
    <ul>${dinnerDraft[person].map((dish,i)=>`<li><span>${escaped(dish.name)}</span><button type="button" class="remove-item" data-dinner-remove="${i}" aria-label="Togli ${escaped(dish.name)} per ${name}">×</button></li>`).join('')}</ul>
    <button type="button" class="outline dinner-add" data-dinner-add aria-label="Aggiungi piatto per ${name}">＋</button>
    <div class="dinner-compose" hidden><label for="dinner-search-${person}">Cerca una ricetta o scrivi il piatto</label><div class="dinner-entry"><input type="search" id="dinner-search-${person}" maxlength="180" placeholder="Es. pasta al pomodoro"><button class="outline" type="button" data-add-written>Aggiungi</button></div><p class="plan-note" data-dinner-match aria-live="polite"></p><div class="dinner-search-results"></div></div>
  </fieldset>`).join('');
}
function renderDinnerSearch(input) {
  const group=input.closest('.dinner-compose');
  const value=input.value.trim();
  const query=normalize(value);
  const terms=query.split(' ').filter(Boolean);
  const hits=query.length<2 ? [] : Object.entries(recipes).filter(([,recipe])=>terms.every(term=>normalize(recipe.name).includes(term)))
    .sort((a,b)=>Number(normalize(b[1].name).startsWith(query))-Number(normalize(a[1].name).startsWith(query)))
    .slice(0,8);
  group.querySelector('.dinner-search-results').innerHTML=hits.map(([id,recipe])=>`<button type="button" class="outline" data-select-dinner="${id}">${escaped(recipe.name)}</button>`).join('');
  const {groups}=identifyLunch(value);
  group.querySelector('[data-dinner-match]').textContent=value && groups.length
    ? 'Riconosciuto: '+groups.map(key=>categoryNames[key]).filter(Boolean).join(', ') : '';
}
function catalogDinner(id) {
  return {id,name:recipes[id].name,side:sides.includes(id)};
}
function dinnerItem(value) {
  const name=value.trim();
  if(!name) return null;
  const hit=Object.entries(recipes).find(([,recipe])=>normalize(recipe.name)===normalize(name));
  return hit ? catalogDinner(hit[0]) : {name};
}
function addDinnerItem(person,item) {
  if(item && !dinnerDraft[person].some(old=>normalize(old.name)===normalize(item.name))) dinnerDraft[person].push(item);
}
function commitPendingDinnerInputs(skip = -1){
  dinnerPeople.querySelectorAll('[data-dinner-person]').forEach(field=>{
    const person=Number(field.dataset.dinnerPerson);
    if(person!==skip) addDinnerItem(person,dinnerItem(field.querySelector('input').value));
  });
}
dinnerPeople.addEventListener('input',event=>{if(event.target.matches('input')) renderDinnerSearch(event.target);});
dinnerPeople.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button) return;
  const field=button.closest('[data-dinner-person]');
  const person=Number(field.dataset.dinnerPerson);
  const composer=field.querySelector('.dinner-compose');
  if(button.hasAttribute('data-dinner-add')){
    composer.hidden=false;
    composer.querySelector('input').focus();
    return;
  }
  if(button.hasAttribute('data-dinner-remove')) dinnerDraft[person].splice(Number(button.dataset.dinnerRemove),1);
  if(button.hasAttribute('data-select-dinner')) addDinnerItem(person,catalogDinner(button.dataset.selectDinner));
  commitPendingDinnerInputs(button.hasAttribute('data-select-dinner') ? person : -1);
  renderDinnerEditor();
  dinnerPeople.querySelector(`[data-dinner-person="${person}"] [data-dinner-add]`).focus();
});
document.querySelector('#closeDinner').onclick=()=>dinnerEditor.close();
document.querySelector('#cancelDinner').onclick=()=>dinnerEditor.close();
dinnerEditor.addEventListener('close',()=>{dinnerTrigger?.focus();checkCalendar();});
document.querySelector('#dinnerForm').addEventListener('submit',event=>{
  event.preventDefault();
  commitPendingDinnerInputs();
  visibleMenu[dinnerIndex].eaten=dinnerDraft;
  refreshDinner(dinnerIndex);
  report('Cena salvata per '+days[dinnerIndex]+'.');
  dinnerEditor.close();
});
recipeEditor.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => recipeEditor.close(); });
const recipeType = document.querySelector('#recipeType');
const sideChoice = document.querySelector('#sideChoice');
recipeType.onchange = () => { sideChoice.hidden = recipeType.value !== 'other'; };
function addIngredient() {
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  row.innerHTML = `<label>Ingrediente<input name="ingredient" maxlength="100" required></label>
    <label>Quantità<input name="quantity" type="number" min="0.01" max="50000" step="0.01" inputmode="decimal" required></label>
    <label>Unità<input name="unit" maxlength="20" placeholder="g, ml…"></label>
    <button type="button" class="close" aria-label="Rimuovi ingrediente">×</button>`;
  row.querySelector('button').onclick = () => {
    if (ingredientRows.children.length > 1) row.remove();
    else row.querySelectorAll('input').forEach(field => { field.value = ''; });
  };
  ingredientRows.append(row);
  return row;
}
function openRecipeEditor() {
  recipeForm.reset();
  recipeType.onchange();
  document.querySelector('#recipeError').textContent = '';
  ingredientRows.replaceChildren();
  addIngredient();
  recipeEditor.showModal();
  document.querySelector('#recipeName').focus();
}
document.querySelector('#addIngredient').onclick = () => addIngredient().querySelector('input').focus();
recipeForm.addEventListener('submit',event => {
  event.preventDefault();
  const name = document.querySelector('#recipeName').value.trim();
  const type = recipeType.value === 'other' && document.querySelector('#recipeSide').checked ? 'side' : recipeType.value;
  const enteredSource = document.querySelector('#recipeSource').value.trim();
  const source = safeSource(enteredSource);
  const prep = document.querySelector('#recipePrep').value.trim();
  const ingredients = Array.from(ingredientRows.children,row => {
    const [ingredient,quantity,unit] = row.querySelectorAll('input');
    return [ingredient.value.trim(),Number(quantity.value),unit.value.trim()];
  });
  const error = document.querySelector('#recipeError');
  if (!name || !prep || ingredients.some(([ingredient]) => !ingredient)) {
    error.textContent = 'Compila nome, ingredienti e preparazione.';
    return;
  }
  if (enteredSource && !source) {
    error.textContent = 'Usa un link che inizi con https:// o http://.';
    return;
  }
  const recipe = {id:'custom-'+crypto.randomUUID(),type,name,ingredients,prep,source};
  const updated = [...readUserRecipes(),recipe];
  try { localStorage.setItem(userRecipesKey,JSON.stringify(updated)); }
  catch {
    error.textContent = 'Il browser non ha consentito il salvataggio.';
    return;
  }
  userRecipes = updated;
  userRecipes.forEach(registerRecipe);
  recipeEditor.close();
  location.hash = href(recipe.id,4);
});
window.addEventListener('hashchange',renderRoute);
window.addEventListener('storage',event => {
  if (event.key === userRecipesKey && event.newValue) {
    userRecipes = JSON.parse(event.newValue);
    userRecipes.forEach(registerRecipe);
    if (location.hash === '#ricettario') renderRoute();
    return;
  }
  if (event.key !== storageKey || !event.newValue || dialog.open || dinnerEditor.open) return;
  readUserRecipes().forEach(registerRecipe);
  ledger = JSON.parse(event.newValue);
  state = ledger.days;
  if (document.querySelector('.week')) { weekScroll=scrollY; renderRoute(); }
});
let visibleDate = dateKey(now());
function scrollToToday() {
  requestAnimationFrame(()=>{
    document.querySelector('.day:has(.current)')?.scrollIntoView({block:'start'});
  });
}
function checkCalendar() {
  if(dialog.open || historyDialog.open || dinnerEditor.open) return;
  const date = dateKey(now());
  const changed = date !== visibleDate;
  visibleDate = date;
  const rolled = rollWeek();
  if(viewedWeek===ledger.active) viewedWeek=null;
  if((rolled || changed) && document.querySelector('.week')){
    renderRoute();
    if(!viewedWeek) scrollToToday();
  }
}
window.addEventListener('focus',checkCalendar);
document.addEventListener('visibilitychange',() => { if (!document.hidden) checkCalendar(); });
setInterval(checkCalendar,15000);
dialog.addEventListener('close',checkCalendar);
historyDialog.addEventListener('close',checkCalendar);
renderRoute();
if(document.querySelector('.week')) scrollToToday();
const themeToggle = document.querySelector('#themeToggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const followsSystem = document.documentElement.dataset.themeSource==='system';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed',String(dark));
  themeToggle.title = dark ? 'Passa al tema chiaro' : 'Passa al tema scuro';
  themeColor.content = dark ? '#18181b' : '#fffaf2';
}
applyTheme(document.documentElement.dataset.theme==='dark');
themeToggle.addEventListener('click',() => {
  const dark = document.documentElement.dataset.theme!=='dark';
  applyTheme(dark);
  if(!followsSystem){
    try { localStorage.setItem('maurapp-theme',dark ? 'dark' : 'light'); } catch {}
  }
});
if(followsSystem) {
  systemTheme.addEventListener('change',event=>applyTheme(event.matches));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration => {
    document.addEventListener('visibilitychange',() => {
      if(!document.hidden && navigator.onLine) registration.update().catch(()=>{});
    });
  }).catch(()=>{});
}
