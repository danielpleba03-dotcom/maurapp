import {recipes} from './recipes.js';

const family = ['Mauro','Cassandra','Francesca','Lorenzo'];
const days = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
const dayIcons = ['🌿','☀️','🥕','🍋','⭐','🌼','🧡'];
const mains = ['pollo','riso','frittata','manzo','pesce','burger','pasta','piadina','ceci','farfalle','pesto','couscous','tacchino','salmone'];
const sides = ['verdure','insalata','fagiolini','broccoli','patate'];
const recipeGroups = [
  ['Primi',['pasta','farfalle','pesto','riso','couscous']],
  ['Secondi',['manzo','pollo','tacchino','pesce','salmone','frittata','burger']],
  ['Contorni ed altro',['verdure','insalata','fagiolini','broccoli','patate','piadina','ceci']]
];
const split = 'pesce-riso';
const userRecipesKey = 'maurapp-ricette-v1';
function readUserRecipes() {
  try { return JSON.parse(localStorage.getItem(userRecipesKey)) ?? []; }
  catch { return []; }
}
let userRecipes = readUserRecipes();
const userGroups = {first:0,second:1,side:2,other:2};
function registerRecipe({id,type,name,ingredients,prep}) {
  if (Object.hasOwn(recipes,id)) return;
  const icon = ({first:'🍝',second:'🍽️',side:'🥗',other:'🍴'})[type];
  const categories = lunchTags(ingredients.map(([ingredient]) => ingredient).join(' '));
  const protein = ['manzo','pollo','pesce','legumi','uova','latticini'].find(key => categories.includes(key)) ?? '';
  const carb = ['pasta','riso','pane','couscous','patate'].find(key => categories.includes(key)) ?? '';
  recipes[id] = {name,icon,protein,carb,ingredients,prep};
  recipeGroups[userGroups[type]][1].push(id);
  (type === 'side' ? sides : mains).push(id);
}
const dinnerPicker = document.querySelector('#dinnerPicker');
const recipeEditor = document.querySelector('#recipeEditor');
const recipeForm = document.querySelector('#recipeForm');
const ingredientRows = document.querySelector('#ingredientRows');
let pickingDay;
const storageKey = 'maurapp-menu-v1';
const categoryNames = {
  pasta:'Pasta', riso:'Riso', pane:'Pane e pizza', couscous:'Altri cereali', patate:'Patate',
  manzo:'Carne', pollo:'Pollo e tacchino', pesce:'Pesce', legumi:'Legumi',
  uova:'Uova', latticini:'Latticini', verdure:'Verdure'
};
const choices = document.querySelector('#categoryChoices');
const resetCategories = document.querySelector('#autoCategories');
let manualCategories = null;
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
const tags = {
  pasta:/pasta|spaghett|penne|fusill|rigaton|lasagn|farfall|tagliatell|gnocch/,
  riso:/riso|risott|basmati/,
  couscous:/cous ?cous|farro|orzo|quinoa/,
  patate:/patat/,
  pane:/pane|panin|piadin|pizza|focacc/,
  manzo:/carne|manzo|bistecc|vitell|hamburger|maiale|salsicc/,
  pollo:/pollo|tacchin/,
  pesce:/pesce|tonno|salmone|merluzz|orata|gamber/,
  legumi:/ceci|fagiol|pisell|lenticch/,
  uova:/uov|frittat/,
  latticini:/mozzarell|formagg|ricotta|stracchino/,
  verdure:/verdur|zucchin|insalat|carot|peperon|fagiolin|broccol|spinac/
};
const familiarDishes = [
  [/carbonara/,['pasta','uova','manzo','latticini']],
  [/amatriciana|gricia/,['pasta','manzo','latticini']],
  [/cacio e pepe/,['pasta','latticini']],
  [/lasagn[ae] al ragu|bolognese/,['pasta','manzo']],
  [/caprese/,['latticini','verdure']],
  [/parmigiana/,['latticini','verdure']],
  [/minestrone/,['verdure']],
  [/margherita|marinara/,['pane']],
  [/ossobuco|arrosto/,['manzo']],
  [/hummus/,['legumi']],
  [/fish and chips/,['pesce','patate']]
];
function lunchTags(value) {
  const text = value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').trim();
  const known = familiarDishes.flatMap(([pattern,categories]) => pattern.test(text) ? categories : []);
  const recipe = Object.values(recipes).find(recipe => recipe.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'') === text);
  return [...new Set([...known,...Object.keys(tags).filter(tag => tags[tag].test(text)),recipe?.protein,recipe?.carb].filter(Boolean))];
}
userRecipes.forEach(registerRecipe);

function categoriesFor(index,person) {
  return state[index].categories?.[person] ?? lunchTags(state[index].lunches[person]);
}
function showCategories() {
  const selected = manualCategories ?? lunchTags(input.value);
  choices.querySelectorAll('input').forEach(box => { box.checked = selected.includes(box.value); });
  resetCategories.disabled = manualCategories === null;
}
choices.innerHTML = Object.entries(categoryNames).map(([key,name]) =>
  `<label class="category"><input value="${key}" type="checkbox"><span>${name}</span></label>`
).join('');
choices.addEventListener('change',() => {
  manualCategories = Array.from(choices.querySelectorAll(':checked'),box => box.value);
  resetCategories.disabled = false;
});
input.addEventListener('input',showCategories);
resetCategories.addEventListener('click',() => {
  manualCategories = null;
  showCategories();
});
function mainFor(key, person) {
  if (key !== split) return key;
  return person === 1 ? 'riso' : 'pesce';
}
function scoreDinner(key, index) {
  const lunches = state[index].lunches.map((_,person) => categoriesFor(index,person));
  let score = key === split ? -3 : 0;
  lunches.forEach((meal, person) => {
    const recipe = recipes[mainFor(key,person)];
    if (meal.includes(recipe.carb)) score -= 3;
    if (meal.includes(recipe.protein)) score -= 4;
  });
  if (lunches[0].includes('pasta') && lunches[1].includes('manzo')) {
    if (key === split) score += 9;
  }
  if (lunches[0].includes('pasta') && lunches[1].includes('riso') && lunches[1].includes('pollo')) {
    if (key === 'manzo') score += 8;
  }
  state.forEach(({dinner}, other) => {
    if (other === index || !dinner) return;
    if (dinner === key) score -= Math.abs(other-index) === 1 ? 7 : 4;
    else {
      const a = recipes[mainFor(key,0)].protein;
      const b = recipes[mainFor(dinner,0)].protein;
      if (a && a === b) score -= Math.abs(other-index) === 1 ? 2 : .5;
    }
  });
  return score;
}
function choose(index, exclude = null) {
  const varieties = state[index].lunches.some((_,person) => categoriesFor(index,person).length) ? [...mains,split] : mains;
  const ordered = [...varieties.slice(index),...varieties.slice(0,index)];
  let available = ordered;
  if (exclude) {
    const tried = new Set([...(state[index].tried ?? []),exclude]);
    available = ordered.filter(key => !tried.has(key));
    if (!available.length) {
      tried.clear();
      tried.add(exclude);
      available = ordered.filter(key => key !== exclude);
    }
    state[index].tried = [...tried];
  }
  setDinner(index,available.reduce((best,key) => scoreDinner(key,index)>scoreDinner(best,index) ? key : best));
}
function setDinner(index,key) {
  state[index].dinner = key;
  const count = key => state.reduce((n,day,i) => n + (i !== index && day.side === key ? 1 + (Math.abs(i-index) === 1 ? 1 : 0) : 0), 0);
  const offset = index % sides.length;
  const rankedSides = [...sides.slice(offset),...sides.slice(0,offset)].filter(key => key !== 'patate' || !recipes[mainFor(state[index].dinner,0)].carb && state[index].dinner !== split);
  if (state[index].lunches.some((_,person) => categoriesFor(index,person).includes('verdure'))) {
    rankedSides.sort((a,b) => Number(state[index].lunches.some(lunch => lunch.toLowerCase().includes(a === 'insalata' ? 'insalat' : a === 'fagiolini' ? 'fagiolin' : 'verdur'))) - Number(state[index].lunches.some(lunch => lunch.toLowerCase().includes(b === 'insalata' ? 'insalat' : b === 'fagiolini' ? 'fagiolin' : 'verdur'))));
  }
  const sideScore = key => count(key) + (key === 'patate' && [0,1].some(person => categoriesFor(index,person).includes('patate')) ? 3 : 0);
  state[index].side = rankedSides.reduce((best,key) => sideScore(key)<sideScore(best) ? key : best);
}
state.forEach((day,i) => { if (!(mains.includes(day.dinner) || day.dinner === split) || !sides.includes(day.side)) choose(i); });
save();

const escaped = value => value.replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const amount = new Intl.NumberFormat('it-IT',{maximumFractionDigits:2});
const portions = n => n === 1 ? '1 porzione' : n+' porzioni';
const href = (id,n) => '#ricetta/'+id+'/'+n;
function meal(id,n,who) {
  const {name,icon} = recipes[id];
  return `<div class="meal"><a class="dish" href="${href(id,n)}"><span aria-hidden="true">${icon}</span> ${escaped(name)}</a><span class="portions">${who} · ${portions(n)}</span></div>`;
}
function dinnerMarkup({dinner,side}) {
  const everyone = 'Tutti';
  return dinner === split
    ? meal('pesce',3,'Mauro, Francesca e Lorenzo')+meal('riso',1,'Cassandra')+meal(side,4,everyone)
    : meal(dinner,4,everyone)+meal(side,4,everyone);
}
function lunchButton(index,person) {
  const value = state[index].lunches[person];
  const name = family[person];
  const summary = (state[index].categories?.[person] ?? []).map(key => categoryNames[key]).join(', ');
  const lunchText = value || summary;
  return `<button class="lunch" data-lunch="${person}" data-day="${index}" aria-label="${lunchText ? 'Modifica' : 'Aggiungi'} pranzo di ${name}, ${days[index]}"><span aria-hidden="true">${person ? '🌸' : '🌞'}</span><span class="person">${name}</span><span class="lunch-text">${lunchText ? escaped(lunchText) : 'Aggiungi pranzo'}</span><span class="edit" aria-hidden="true">✎</span></button>`;
}
function renderWeek() {
  main.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">A TAVOLA IN QUATTRO</div><h1>Cosa c’è per cena?</h1><p>Organizza le cene di famiglia, un giorno alla volta.</p></div><div class="hero-art" aria-hidden="true">🍲</div></section>
  <div class="section-head"><h2 class="section-title">Menù della settimana</h2></div>
  <div class="week">${days.map((day,i) => `<article class="day" id="day-${i}"><div class="day-head"><span class="day-mark" aria-hidden="true">${dayIcons[i]}</span><h3>${day}</h3>${today===i ? '<span class="current">Oggi</span>' : ''}</div><div class="lunches">${lunchButton(i,0)}${lunchButton(i,1)}</div><div class="dinner"><div class="dinner-content"><div class="dinner-label">Cena proposta</div><div class="meals">${dinnerMarkup(state[i])}</div></div><div class="dinner-actions"><button class="change" data-change="${i}" aria-label="Altra proposta, ${day}"><span aria-hidden="true">⟳</span> Altra proposta</button><button class="change pick" data-pick="${i}" aria-label="Scegli primo o secondo, ${day}">Scegli piatto</button></div></div></article>`).join('')}</div>`;
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
      return `<article class="recipe"><h3>${recipe.icon} ${escaped(recipe.name)}</h3><p>4 persone</p>${ingredients(recipe,4)}<a href="${href(key,4)}">Leggi la preparazione</a></article>`;
    }).join('')}</div></section>`).join('')}`;
    scrollTo(0,0);
  } else if (location.hash.startsWith('#ricetta/') && Object.hasOwn(recipes,id)) {
    const recipe = recipes[id];
    main.innerHTML = `<div class="view-head"><a class="outline back" href="#">Menù della settimana</a> <a class="outline back" href="#ricettario">Ricettario</a><h1>${recipe.icon} ${escaped(recipe.name)}</h1></div><article class="prep"><strong>${n} ${n === 1 ? 'persona' : 'persone'}</strong>${ingredients(recipe,n)}<h2>Preparazione</h2><p>${escaped(recipe.prep)}</p></article>`;
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
  const pick = event.target.closest('[data-pick]');
  if (pick) openDinnerPicker(Number(pick.dataset.pick));
  const dish = event.target.closest('.dish');
  if (dish) weekScroll=scrollY;
  const change = event.target.closest('[data-change]');
  if (change) {
    const index = Number(change.dataset.change);
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
    manualCategories = state[index].categories?.[person] ?? null;
    showCategories();
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
  const previous = state[index].categories?.[person] ?? null;
  const selected = value || manualCategories?.length ? manualCategories : null;
  if (value !== state[index].lunches[person] || JSON.stringify(selected) !== JSON.stringify(previous)) {
    state[index].categories ??= [null,null];
    state[index].categories[person] = selected;
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
function openDinnerPicker(index) {
  pickingDay = index;
  document.querySelector('#pickerDay').textContent = days[index];
  document.querySelector('#dinnerChoices').innerHTML = recipeGroups.map(([title,keys]) => {
    const dishes = keys.filter(key => mains.includes(key));
    return dishes.length ? `<section><h3>${title}</h3><div class="pick-options">${dishes.map(key => {
      const {icon,name} = recipes[key];
      return `<button type="button" class="outline" data-dinner="${key}">${icon} ${escaped(name)}</button>`;
    }).join('')}</div></section>` : '';
  }).join('');
  dinnerPicker.showModal();
}
dinnerPicker.addEventListener('click',event => {
  const button = event.target.closest('[data-dinner]');
  if (!button) return;
  const index = pickingDay;
  state[index].tried = [];
  setDinner(index,button.dataset.dinner);
  refreshDinner(index);
  report('Cena scelta per '+days[index]+'.');
  dinnerPicker.close();
});
for (const modal of [dinnerPicker,recipeEditor]) {
  modal.querySelectorAll('[data-close]').forEach(button => {
    button.onclick = () => modal.close();
  });
}
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
  const type = document.querySelector('#recipeType').value;
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
  const recipe = {id:'custom-'+crypto.randomUUID(),type,name,ingredients,prep};
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
