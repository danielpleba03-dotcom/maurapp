import {recipes} from './recipes.js?v=9';
import {identifyLunch,indexRecipe,normalize} from './lunch-catalog.js?v=9';

const family = ['Mauro','Cassandra','Francesca','Lorenzo'];
const days = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const dayIcons = ['🌿','☀️','🥕','🍋','⭐','🌼','🧡'];
const mains = ['pollo','riso','frittata','manzo','pesce','burger','pasta','piadina','ceci','farfalle','pesto','couscous','tacchino','salmone','piselli','zucca','limone','lentiche','cannellini','orata','uova','caprese','zucchina-pasta','tonno-limone','pizzaiola-pollo','merluzzo-padella'];
const sides = ['verdure','insalata','fagiolini','broccoli','patate','carote','bruschetta','zucchine-trifolate','finocchi-gratinati'];
const recipeGroups = [
  ['Primi',['pasta','farfalle','pesto','riso','couscous','piselli','zucca','lentiche','zucchina-pasta','tonno-limone']],
  ['Secondi',['manzo','pollo','tacchino','pesce','salmone','frittata','burger','limone','cannellini','orata','uova','caprese','pizzaiola-pollo','merluzzo-padella']],
  ['Contorni ed altro',['verdure','insalata','fagiolini','broccoli','patate','piadina','ceci','carote','bruschetta','zucchine-trifolate','finocchi-gratinati']]
];
const legacySplit = 'pesce-riso';
const splitWork = {
  rapido:['manzo','tacchino','burger','limone','caprese','piadina'],
  fornello:['riso','pasta','farfalle','pesto','piselli','zucca','uova','cannellini','frittata','couscous','zucchina-pasta','tonno-limone','pizzaiola-pollo','merluzzo-padella'],
  forno:['salmone','orata','ceci'],
  aria:['pesce','pollo']
};
const methods = Object.fromEntries(Object.entries(splitWork).flatMap(([method,keys])=>keys.map(key=>[key,method])));
const pairs = Object.keys(methods).flatMap(a=>Object.keys(methods).filter(b =>
  methods[a]!==methods[b] && recipes[a].protein!==recipes[b].protein &&
  !(recipes[a].carb && recipes[a].carb===recipes[b].carb)
).map(b=>a+'+'+b));
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
const historyDate = document.querySelector('#historyDate');
const dateFormat = new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric'});
function dateKey(date) {
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
function fromKey(key) {
  const [year,month,day] = key.split('-').map(Number);
  return new Date(year,month-1,day,12);
}
function weekKey(date = new Date()) {
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
function emptyWeek() {
  return Array.from({length:7},()=>({lunches:['',''],dinner:null,side:null,turn:0}));
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
const input = document.querySelector('#lunchInput');
const announce = document.querySelector('#announce');
let ledger = readWeeks();
let state = ledger.days;
let viewedWeek = null;
let editing;
let lunchTrigger;
let weekScroll=0;
let recipeFilter = "all";
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
for (const recipe of Object.values(recipes)) {
  const ingredients = recipe.ingredients.flatMap(([name])=>identifyLunch(name).groups);
  indexRecipe(recipe.name,[recipe.protein,recipe.carb,...ingredients]);
}
userRecipes.forEach(registerRecipe);

function categoriesFor(index,person) {
  const value = state[index].lunches[person];
  return value ? lunchTags(value) : state[index].categories?.[person] ?? [];
}
function showMatch() {
  const {corrections} = identifyLunch(input.value);
  const categories = lunchTags(input.value);
  const label = document.querySelector('#lunchMatch');
  label.textContent = !input.value.trim() ? '' : categories.length
    ? (corrections.length ? 'Possibile correzione · '+corrections.join(', ')+' · ' : 'Riconosciuto · ')+categories.map(key=>categoryNames[key]).join(', ')
    : 'Piatto non riconosciuto. La cena userà il resto del menù.';
}
input.addEventListener('input',showMatch);
function dinnerParts(key) {
  return (key === legacySplit ? 'pesce+riso' : key).split('+');
}
function mealScore(key,lunch) {
  const {protein,carb} = recipes[key];
  return -(lunch.includes(carb) ? 3 : 0) - (lunch.includes(protein) ? 4 : 0);
}
function choose(index, exclude = null, randomize = false) {
  const day = state[index];
  const lunches = day.lunches.map((_,person) => categoriesFor(index,person));
  const turn = day.turn ?? 0;
  // Two split dinners on a fresh week, then one per four alternatives per day.
  const wantsSplit = (turn + (index%2 ? 0 : 1))%4===0 && (turn>0 || index===1 || index===5);
  const exactManzo = lunches[0].includes('pasta') && lunches[1].includes('riso') && lunches[1].includes('pollo');
  const exactPesce = lunches[0].includes('pasta') && lunches[1].includes('manzo');
  const split = exclude ? wantsSplit : exactPesce || (wantsSplit && !exactManzo);
  const history = new Set(day.tried ?? []);
  if(exclude) history.add(exclude);
  const selection = split ? pairs : mains;
  const offset = randomize ? Math.floor(Math.random()*selection.length) : (index+turn)%selection.length;
  const ordered = [...selection.slice(offset),...selection.slice(0,offset)];
  let available = ordered.filter(key=>key!==exclude && !history.has(key));
  if (!available.length) {
    selection.forEach(key=>history.delete(key));
    available = ordered.filter(key=>key!==exclude);
  }
  const neighbors = state.flatMap(({dinner},other)=>other!==index && dinner ?
    dinnerParts(dinner).map(key=>[key,Math.abs(other-index)===1 ? 2 : 1]) : []);
  const previousMonday = fromKey(ledger.active);
  previousMonday.setDate(previousMonday.getDate()-7);
  const priorDinners = ledger.archive[dateKey(previousMonday)] ?? [];
  const sameDayLastWeek = priorDinners[index]?.dinner;
  const freshness = key => {
    const {protein,carb} = recipes[key];
    return neighbors.reduce((score,[other,weight]) => {
      if (other===key) return score-3*weight;
      const previous = recipes[other];
      return score - (protein && protein===previous?.protein ? weight : 0)
        - (carb && carb===previous?.carb ? weight/2 : 0);
    },sameDayLastWeek && dinnerParts(sameDayLastWeek).includes(key) ? -1.5 : 0);
  };
  const score = key => {
    const [a,b] = dinnerParts(key);
    let points = 2*(mealScore(a,lunches[0])+mealScore(b ?? a,lunches[1]))+freshness(a);
    if(b) points += freshness(b) + (recipes[a].carb!==recipes[b].carb ? 1 : 0);
    if(exactManzo && key==='manzo') points += 22;
    if(exactPesce && key==='pesce+riso') points += 26;
    return points;
  };
  let best = available[0];
  let bestScore = score(best);
  for (const key of available.slice(1)) {
    const points = score(key);
    if(points>bestScore){best=key;bestScore=points;}
  }
  day.tried = [...history];
  day.portionMix = (index+turn)%3;
  setDinner(index,best);
}
function setDinner(index,key) {
  state[index].dinner = key;
  const count = key => state.reduce((n,day,i) => n + (i !== index && day.side === key ? 1 + (Math.abs(i-index) === 1 ? 1 : 0) : 0), 0);
  const offset = index % sides.length;
  const mainsTonight = dinnerParts(key);
  const usesOven = mainsTonight.some(id=>methods[id]==='forno');
  const usesAir = mainsTonight.some(id=>methods[id]==='aria');
  const rankedSides = [...sides.slice(offset),...sides.slice(0,offset)].filter(id =>
    !(['verdure','finocchi-gratinati'].includes(id) && usesOven) && !(id==='patate' && usesAir) &&
    !(recipes[id].carb && mainsTonight.some(main=>recipes[main].carb)));
  const lunchText = state[index].lunches.map(normalize).join(' ');
  const prefer = id => count(id) + recipes[id].ingredients.filter(([name])=>lunchText.includes(normalize(name))).length
    + (recipes[id].carb && [0,1].some(person=>categoriesFor(index,person).includes(recipes[id].carb)) ? 3 : 0);
  state[index].side = rankedSides.reduce((best,id)=>prefer(id)<prefer(best) ? id : best);
}
function initializeWeek() {
  state.forEach((day,i) => {
    const valid = typeof day.dinner==='string' && dinnerParts(day.dinner).every(key=>mains.includes(key));
    if (!valid || !sides.includes(day.side) || (day.turn===undefined && [1,5].includes(i) && !day.lunches.some(Boolean) && dinnerParts(day.dinner).length===1)) choose(i,null,true);
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
    ledger.days=emptyWeek();
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
function meal(id,n,who) {
  const {name,icon} = recipes[id];
  return `<div class="meal"><a class="dish" href="${href(id,n)}"><span aria-hidden="true">${icon}</span> ${escaped(name)}</a><span class="portions">${who} · ${portions(n)}</span></div>`;
}
function dinnerMarkup({dinner,side,portionMix}) {
  const [a,b] = dinnerParts(dinner);
  const sharedSide = recipes[side] ? meal(side,4,'Tutti') : '';
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
function lunchButton(index,person,day = state[index], archived = false) {
  const value = day.lunches[person];
  const name = family[person];
  const summary = (day.categories?.[person] ?? []).map(key => categoryNames[key]).join(', ');
  const lunchText = value || summary;
  if(archived) return `<div class="lunch archived-lunch"><span class="person">${name}</span><span class="lunch-text">${lunchText ? escaped(lunchText) : '—'}</span></div>`;
  return `<button class="lunch" data-lunch="${person}" data-day="${index}" aria-label="${lunchText ? 'Modifica' : 'Aggiungi'} pranzo di ${name}, ${days[index]}"><span aria-hidden="true">${person ? '🌸' : '🌞'}</span><span class="person">${name}</span><span class="lunch-text">${lunchText ? escaped(lunchText) : 'Aggiungi pranzo'}</span><span class="edit" aria-hidden="true">✎</span></button>`;
}
function renderWeek() {
  const archived = Boolean(viewedWeek && ledger.archive[viewedWeek]);
  const menu = archived ? ledger.archive[viewedWeek] : state;
  const selected = archived ? viewedWeek : ledger.active;
  const today = (new Date().getDay()+6)%7;
  const calendar = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/></svg>';
  main.innerHTML = `<div class="section-head"><div><h1 class="section-title">${archived ? 'Menù archiviato' : 'Menù della settimana'}</h1><p class="week-dates">${weekLabel(selected)}</p></div><div class="history-actions">${archived ? '<button class="outline" data-current-week>Settimana attuale</button>' : ''}<button class="outline calendar-button" data-history aria-label="Settimane passate" title="Settimane passate">${calendar}</button></div></div>
  <div class="week">${days.map((day,i) => `<article class="day" id="day-${i}"><div class="day-head"><span class="day-mark" aria-hidden="true">${dayIcons[i]}</span><h3>${day}</h3>${!archived && today===i ? '<span class="current">Oggi</span>' : ''}</div><div class="lunches">${lunchButton(i,0,menu[i],archived)}${lunchButton(i,1,menu[i],archived)}</div><div class="dinner"><div class="dinner-content"><div class="dinner-label">${archived ? 'Cena' : 'Cena proposta'}</div><div class="meals">${dinnerMarkup(menu[i])}</div></div>${archived ? '' : `<div class="dinner-actions"><button class="change" data-change="${i}" aria-label="Altra proposta, ${day}"><span aria-hidden="true">⟳</span> Altra proposta</button></div>`}</div></article>`).join('')}</div>`;
}
function openHistory() {
  const previous = fromKey(ledger.active);
  previous.setDate(previous.getDate()-1);
  historyDate.max = dateKey(previous);
  historyDate.value = viewedWeek ?? '';
  document.querySelector('#historyMessage').textContent = '';
  const keys = Object.keys(ledger.archive).sort().reverse().slice(0,6);
  document.querySelector('#recentWeeks').innerHTML = keys.length
    ? '<h3>Settimane recenti</h3>'+keys.map(key=>`<button class="outline" type="button" data-open-week="${key}">${weekLabel(key)}</button>`).join('')
    : '<p>Le settimane appariranno qui dopo il cambio del lunedì.</p>';
  historyDialog.showModal();
}
function openArchivedWeek(key) {
  if(!Object.hasOwn(ledger.archive,key)) {
    document.querySelector('#historyMessage').textContent = 'Nessun menù salvato per questa settimana.';
    return;
  }
  viewedWeek = key;
  weekScroll = 0;
  historyDialog.close();
  renderRoute();
  main.querySelector('[data-current-week]').focus();
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
  return '<ul>'+recipe.ingredients.map(([name,quantity,unit]) => `<li>${escaped(name)} · ${amount.format(quantity*n/4)}${unit ? ' '+escaped(unit) : ''}</li>`).join('')+'</ul>';
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
      }).join('')}</div>${recipeGroups.map(([title,keys],index) => `<section class="recipe-group" data-recipe-group="${index}" ${recipeFilter==='all' || recipeFilter===String(index) ? '' : 'hidden'}><h2>${title}</h2><div class="recipes">${keys.map(key => {
      const recipe = recipes[key];
      return `<article class="recipe"><h3><span aria-hidden="true">${recipe.icon}</span> ${escaped(recipe.name)}</h3><p>4 persone</p>${ingredients(recipe,4)}<a href="${href(key,4)}">Leggi la preparazione</a></article>`;
    }).join('')}</div></section>`).join('')}`;
    scrollTo(0,0);
  } else if (inRecipe) {
    const recipe = recipes[id];
    main.innerHTML = `<div class="view-head"> <a class="outline back" href="#ricettario">Ricettario</a><div class="recipe-title"><h1>${escaped(recipe.name)}</h1>${recipe.source ? `<a class="outline source" href="${escaped(recipe.source)}" target="_blank" rel="noopener noreferrer">Fonte <span aria-hidden="true">↗</span></a>` : ''}</div></div><article class="prep"><strong>${n} ${n === 1 ? 'persona' : 'persone'}</strong>${ingredients(recipe,n)}<h2>Preparazione</h2><p>${escaped(recipe.prep)}</p></article>`;
    scrollTo(0,0);
  } else {
    renderWeek();
    scrollTo(0,weekScroll);
  }
}
function refreshDinner(index) {
  const meals = document.querySelector('#day-'+index+' .meals');
  meals.innerHTML = dinnerMarkup(state[index]);
  meals.classList.remove('fresh');
  requestAnimationFrame(() => meals.classList.add('fresh'));
}
function report(message) {
  announce.textContent = save() ? message : message+' Il browser non ha consentito il salvataggio.';
}
book.addEventListener('click',() => {
  if (book.dataset.view === 'book') weekScroll=scrollY;
  location.hash = book.dataset.view === 'week' ? '' : 'ricettario';
});
main.addEventListener('click',event => {
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
    main.querySelectorAll('[data-recipe-group]').forEach(group => {
      group.hidden = recipeFilter!=='all' && group.dataset.recipeGroup!==recipeFilter;
    });
  }
  const dish = event.target.closest('.dish');
  if (dish) weekScroll=scrollY;
  const change = event.target.closest('[data-change]');
  if (change) {
    const index = Number(change.dataset.change);
    state[index].turn = (state[index].turn ?? 0)+1;
    choose(index,state[index].dinner);
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
    input.value = state[index].lunches[person];
    showMatch();
    dialog.showModal();
    input.focus();
  }
});
dialog.querySelector('.close').onclick = () => dialog.close();
document.querySelector('#cancel').onclick = () => dialog.close();
dialog.addEventListener('close',() => lunchTrigger?.focus());
document.querySelector('#lunchForm').addEventListener('submit',event => {
  event.preventDefault();
  const [index,person] = editing;
  const value = input.value.trim();
  if (value !== state[index].lunches[person]) {
    if (state[index].categories) state[index].categories[person] = null;
    state[index].lunches[person] = value;
    choose(index);
    const template = document.createElement('template');
    template.innerHTML = lunchButton(index,person);
    const updated = template.content.firstElementChild;
    lunchTrigger.replaceWith(updated);
    lunchTrigger=updated;
    refreshDinner(index);
    report('Pranzo aggiornato per '+family[person]+'.');
  }
  dialog.close();
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
  if (event.key !== storageKey || !event.newValue || dialog.open) return;
  readUserRecipes().forEach(registerRecipe);
  ledger = JSON.parse(event.newValue);
  state = ledger.days;
  if (document.querySelector('.week')) { weekScroll=scrollY; renderRoute(); }
});
function checkCalendar() {
  if(dialog.open || historyDialog.open) return;
  if(rollWeek() && document.querySelector('.week')) renderRoute();
}
window.addEventListener('focus',checkCalendar);
document.addEventListener('visibilitychange',() => { if (!document.hidden) checkCalendar(); });
setInterval(checkCalendar,15000);
dialog.addEventListener('close',checkCalendar);
historyDialog.addEventListener('close',checkCalendar);
renderRoute();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
