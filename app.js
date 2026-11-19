import {recipes} from './recipes.js';
import {identifyLunch,indexRecipe,normalize} from './lunch-catalog.js';

const family = ['Mauro','Cassandra','Francesca','Lorenzo'];
const days = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const dayIcons = ['🌿','☀️','🥕','🍋','⭐','🌼','🧡'];
const mains = ['pollo','riso','frittata','manzo','pesce','burger','pasta','piadina','ceci','farfalle','pesto','couscous','tacchino','salmone','piselli','zucca','limone','lentiche','cannellini','orata','uova','caprese'];
const sides = ['verdure','insalata','fagiolini','broccoli','patate','carote','bruschetta'];
const recipeGroups = [
  ['Primi',['pasta','farfalle','pesto','riso','couscous','piselli','zucca','lentiche']],
  ['Secondi',['manzo','pollo','tacchino','pesce','salmone','frittata','burger','limone','cannellini','orata','uova','caprese']],
  ['Contorni ed altro',['verdure','insalata','fagiolini','broccoli','patate','piadina','ceci','carote','bruschetta']]
];
const legacySplit = 'pesce-riso';
const splitWork = {
  rapido:['manzo','tacchino','burger','limone','caprese','piadina'],
  fornello:['riso','pasta','farfalle','pesto','piselli','zucca','uova','cannellini','frittata','couscous'],
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
const storageKey = 'maurapp-menu-v1';
const categoryNames = {
  pasta:'Pasta', riso:'Riso', pane:'Pane e pizza', couscous:'Altri cereali', patate:'Patate',
  manzo:'Carne', pollo:'Pollo e tacchino', pesce:'Pesce', legumi:'Legumi',
  uova:'Uova', latticini:'Latticini', verdure:'Verdure'
};
const today = (new Date().getDay()+6)%7;
const main = document.querySelector('#main');
const dialog = document.querySelector('#editor');
const input = document.querySelector('#lunchInput');
const announce = document.querySelector('#announce');
let state = Array.from({length:7}, () => ({lunches:['',''], dinner:null, side:null}));
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved) && saved.length === 7) state = saved;
} catch {}
let editing;
let lunchTrigger;
let weekScroll=0;
const save = () => {
  try { localStorage.setItem(storageKey,JSON.stringify(state)); return true; }
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
function choose(index, exclude = null) {
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
  const offset = (index+turn)%selection.length;
  const ordered = [...selection.slice(offset),...selection.slice(0,offset)];
  let available = ordered.filter(key=>key!==exclude && !history.has(key));
  if (!available.length) {
    selection.forEach(key=>history.delete(key));
    available = ordered.filter(key=>key!==exclude);
  }
  const neighbors = state.flatMap(({dinner},other)=>other!==index && dinner ?
    dinnerParts(dinner).map(key=>[key,Math.abs(other-index)===1 ? 2 : 1]) : []);
  const freshness = key => neighbors.reduce((score,[other,weight]) => score -
    (other===key ? 3*weight : (recipes[key].protein && recipes[key].protein===recipes[other]?.protein ? weight : 0)),0);
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
    !(id==='verdure' && usesOven) && !(id==='patate' && usesAir) &&
    !(recipes[id].carb && mainsTonight.some(main=>recipes[main].carb)));
  const lunchText = state[index].lunches.map(normalize).join(' ');
  const prefer = id => count(id) + recipes[id].ingredients.filter(([name])=>lunchText.includes(normalize(name))).length
    + (recipes[id].carb && [0,1].some(person=>categoriesFor(index,person).includes(recipes[id].carb)) ? 3 : 0);
  state[index].side = rankedSides.reduce((best,id)=>prefer(id)<prefer(best) ? id : best);
}
state.forEach((day,i) => {
  const valid = typeof day.dinner==='string' && dinnerParts(day.dinner).every(key=>mains.includes(key));
  if (!valid || !sides.includes(day.side) || (day.turn===undefined && [1,5].includes(i) && !day.lunches.some(Boolean) && dinnerParts(day.dinner).length===1)) choose(i);
  day.turn ??= 0;
});
save();

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
  if (!b) return meal(a,4,'Tutti')+meal(side,4,'Tutti');
  const teams = [
    [['Mauro','Francesca'],['Cassandra','Lorenzo']],
    [['Mauro','Francesca','Lorenzo'],['Cassandra']],
    [['Mauro'],['Cassandra','Francesca','Lorenzo']]
  ];
  const [first,second] = teams[dinner===legacySplit ? 1 : portionMix ?? 0];
  const format = names => new Intl.ListFormat('it').format(names);
  return meal(a,first.length,format(first))+meal(b,second.length,format(second))+meal(side,4,'Tutti');
}
function lunchButton(index,person) {
  const value = state[index].lunches[person];
  const name = family[person];
  const summary = (state[index].categories?.[person] ?? []).map(key => categoryNames[key]).join(', ');
  const lunchText = value || summary;
  return `<button class="lunch" data-lunch="${person}" data-day="${index}" aria-label="${lunchText ? 'Modifica' : 'Aggiungi'} pranzo di ${name}, ${days[index]}"><span aria-hidden="true">${person ? '🌸' : '🌞'}</span><span class="person">${name}</span><span class="lunch-text">${lunchText ? escaped(lunchText) : 'Aggiungi pranzo'}</span><span class="edit" aria-hidden="true">✎</span></button>`;
}
function renderWeek() {
  main.innerHTML = `<div class="section-head"><h1 class="section-title">Menù della settimana</h1></div>
  <div class="week">${days.map((day,i) => `<article class="day" id="day-${i}"><div class="day-head"><span class="day-mark" aria-hidden="true">${dayIcons[i]}</span><h3>${day}</h3>${today===i ? '<span class="current">Oggi</span>' : ''}</div><div class="lunches">${lunchButton(i,0)}${lunchButton(i,1)}</div><div class="dinner"><div class="dinner-content"><div class="dinner-label">Cena proposta</div><div class="meals">${dinnerMarkup(state[i])}</div></div><div class="dinner-actions"><button class="change" data-change="${i}" aria-label="Altra proposta, ${day}"><span aria-hidden="true">⟳</span> Altra proposta</button></div></div></article>`).join('')}</div>`;
}
function ingredients(recipe,n) {
  return '<ul>'+recipe.ingredients.map(([name,quantity,unit]) => `<li>${escaped(name)} · ${amount.format(quantity*n/4)}${unit ? ' '+escaped(unit) : ''}</li>`).join('')+'</ul>';
}
function renderRoute() {
  const [,id,p] = location.hash.slice(1).split('/');
  const n = /^[1-4]$/.test(p) ? Number(p) : 4;
  if (location.hash === '#ricettario') {
    main.innerHTML = `<div class="view-head"><a class="outline back" href="#">Menù della settimana</a><div class="book-title"><h1>Ricettario</h1><button class="primary" data-new-recipe>＋ Nuova ricetta</button></div></div>${recipeGroups.map(([title,keys]) => `<section class="recipe-group"><h2>${title}</h2><div class="recipes">${keys.map(key => {
      const recipe = recipes[key];
      return `<article class="recipe"><h3><span aria-hidden="true">${recipe.icon}</span> ${escaped(recipe.name)}</h3><p>4 persone</p>${ingredients(recipe,4)}<a href="${href(key,4)}">Leggi la preparazione</a></article>`;
    }).join('')}</div></section>`).join('')}`;
    scrollTo(0,0);
  } else if (location.hash.startsWith('#ricetta/') && Object.hasOwn(recipes,id)) {
    const recipe = recipes[id];
    main.innerHTML = `<div class="view-head"><a class="outline back" href="#">Menù della settimana</a> <a class="outline back" href="#ricettario">Ricettario</a><div class="recipe-title"><h1>${escaped(recipe.name)}</h1>${recipe.source ? `<a class="outline source" href="${escaped(recipe.source)}" target="_blank" rel="noopener noreferrer">Fonte <span aria-hidden="true">↗</span></a>` : ''}</div></div><article class="prep"><strong>${n} ${n === 1 ? 'persona' : 'persone'}</strong>${ingredients(recipe,n)}<h2>Preparazione</h2><p>${escaped(recipe.prep)}</p></article>`;
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
document.querySelector('#book').addEventListener('click',() => {
  if (document.querySelector('.week')) weekScroll=scrollY;
  location.hash = 'ricettario';
});
main.addEventListener('click',event => {
  if (event.target.closest('[data-new-recipe]')) openRecipeEditor();
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
  state = JSON.parse(event.newValue);
  if (document.querySelector('.week')) { weekScroll=scrollY; renderRoute(); }
});
renderRoute();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
