const sourceLibrary = [
  {
    id: "myplate",
    title: "Protein Foods",
    organization: "MyPlate · U.S. Department of Agriculture",
    url: "https://www.myplate.gov/eat-healthy/protein-foods",
    detail: "An overview of protein food choices, including beans, peas, lentils, nuts, seeds, soy products, eggs, and dairy."
  },
  {
    id: "fdc",
    title: "FoodData Central",
    organization: "U.S. Department of Agriculture",
    url: "https://fdc.nal.usda.gov/",
    detail: "A public database for looking up food composition and nutrient information by food and serving."
  },
  {
    id: "protein",
    title: "Protein: Fact Sheet for Health Professionals",
    organization: "NIH · Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/Protein-HealthProfessional/",
    detail: "Evidence-based background on protein, dietary sources, and the role of protein in the body."
  },
  {
    id: "fiber",
    title: "Dietary Fiber",
    organization: "MedlinePlus · U.S. National Library of Medicine",
    url: "https://medlineplus.gov/dietaryfiber.html",
    detail: "An accessible guide to dietary fiber, common food sources, and ways to include more fiber-rich foods."
  },
  {
    id: "myplate-healthy",
    title: "Healthy Eating for Adults",
    organization: "MyPlate · U.S. Department of Agriculture",
    url: "https://www.myplate.gov/myplate-plan",
    detail: "General information and tools for exploring a varied eating pattern across food groups."
  },
  {
    id: "medline-water",
    title: "Dehydration",
    organization: "MedlinePlus · U.S. National Library of Medicine",
    url: "https://medlineplus.gov/dehydration.html",
    detail: "Health information about dehydration, common signs, and when to seek medical advice."
  }
];

const knowledge = [
  {
    keys: ["protein", "vegetarian", "breakfast", "egg", "tofu", "bean", "lentil"],
    text: "For a protein-containing vegetarian meal, consider eggs, Greek yogurt, tofu, beans, lentils, nuts, seeds, or soy foods. Mix and match foods you enjoy; protein amounts vary with the food and portion. USDA FoodData Central can help compare specific foods.",
    refs: ["myplate", "fdc", "protein"]
  },
  {
    keys: ["fiber", "fibre", "constipation", "whole grain", "gut"],
    text: "Beans, lentils, vegetables, fruit, nuts, seeds, and whole grains are examples of fiber-containing foods. If you’re adding more fiber, do so gradually and drink fluids as appropriate. For persistent symptoms or a condition affecting digestion, ask a healthcare professional.",
    refs: ["fiber", "myplate-healthy", "fdc"]
  },
  {
    keys: ["water", "hydration", "drink", "thirst", "fluid"],
    text: "Fluid needs can vary with activity, climate, health, and other personal factors; foods and beverages both contribute to fluid intake. Rather than relying on a universal target, use thirst and your clinician’s guidance. Seek medical care for concerning symptoms of dehydration.",
    refs: ["medline-water", "myplate-healthy"]
  },
  {
    keys: ["snack", "balanced", "meal", "healthy", "lunch", "dinner", "vegetable", "fruit"],
    text: "A flexible meal or snack can pair foods you enjoy from different groups—for example, fruit with yogurt, vegetables with hummus, or whole-grain toast with nut butter. There is no single required combination, and individual needs differ.",
    refs: ["myplate-healthy", "fdc", "myplate"]
  }
];

const foods = [
  { id: "greek-yogurt", name: "Greek yogurt & berries", meal: "Breakfast", icon: "🥣", tags: ["Protein"], description: "Creamy yogurt, bright berries, crunchy seeds.", protein: 17, calories: 210, category: "Protein", group: "Breakfast" },
  { id: "egg-toast", name: "Eggs & whole-grain toast", meal: "Breakfast", icon: "🍳", tags: ["Protein", "Fiber"], description: "A cozy classic with spinach on the side.", protein: 14, calories: 320, category: "Protein", group: "Breakfast" },
  { id: "tofu-scramble", name: "Tofu scramble", meal: "Breakfast", icon: "🥑", tags: ["Protein", "Plant-based"], description: "Tofu, peppers, greens, and warm spices.", protein: 18, calories: 340, category: "Plant-based", group: "Breakfast" },
  { id: "lentil-bowl", name: "Lentil & grain bowl", meal: "Lunch", icon: "🥗", tags: ["Protein", "Fiber", "Plant-based"], description: "Savory lentils with brown rice and herbs.", protein: 16, calories: 390, category: "Plant-based", group: "Lunch" },
  { id: "hummus-plate", name: "Hummus & veggie plate", meal: "Snack", icon: "🥕", tags: ["Fiber", "Plant-based"], description: "Hummus, crisp vegetables, and pita.", protein: 8, calories: 240, category: "Fiber", group: "Snack" },
  { id: "bean-tacos", name: "Black bean tacos", meal: "Dinner", icon: "🌮", tags: ["Protein", "Fiber", "Plant-based"], description: "Black beans, cabbage, salsa, and lime.", protein: 15, calories: 420, category: "Plant-based", group: "Dinner" },
  { id: "oatmeal", name: "Overnight oats", meal: "Breakfast", icon: "🍓", tags: ["Fiber"], description: "Oats, milk of choice, fruit, and cinnamon.", protein: 9, calories: 290, category: "Fiber", group: "Breakfast" },
  { id: "edamame", name: "Edamame & citrus", meal: "Snack", icon: "🫛", tags: ["Protein", "Plant-based"], description: "A simple snack with a squeeze of lemon.", protein: 11, calories: 180, category: "Plant-based", group: "Snack" },
  { id: "salmon-rice", name: "Salmon & brown rice", meal: "Dinner", icon: "🍚", tags: ["Protein"], description: "Salmon with greens and a whole grain.", protein: 25, calories: 460, category: "Protein", group: "Dinner" }
];

const initialPlan = ["greek-yogurt", "lentil-bowl", "bean-tacos"];
const defaults = { water: 5, preferences: [], plan: initialPlan, consumedCalories: 1280, consumedProtein: 48 };
const state = readState();
let activeFilter = "All";
let toastTimeout;

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem("nutrirag-state") || "null");
    if (!saved || typeof saved !== "object") return structuredClone(defaults);
    return {
      water: Number.isFinite(saved.water) ? saved.water : defaults.water,
      preferences: Array.isArray(saved.preferences) ? saved.preferences.filter(item => typeof item === "string") : [],
      plan: Array.isArray(saved.plan) ? saved.plan.filter(id => foods.some(food => food.id === id)) : [...initialPlan],
      consumedCalories: Number.isFinite(saved.consumedCalories) ? saved.consumedCalories : defaults.consumedCalories,
      consumedProtein: Number.isFinite(saved.consumedProtein) ? saved.consumedProtein : defaults.consumedProtein
    };
  } catch (error) {
    console.error("Could not read NutriRAG data from browser storage.", error);
    return structuredClone(defaults);
  }
}

function saveState() {
  try {
    localStorage.setItem("nutrirag-state", JSON.stringify(state));
  } catch (error) {
    console.error("Could not save NutriRAG data to browser storage.", error);
    showToast("Your browser couldn’t save this update.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2300);
}

function navigate(view) {
  const knownViews = ["overview", "library", "plan", "sources"];
  const target = knownViews.includes(view) ? view : "overview";
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.toggle("active", panel.id === `${target}-view`));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === target));
  document.querySelector("#breadcrumb-current").textContent = ({ overview: "Overview", library: "Food library", plan: "My meal plan", sources: "Our sources" })[target];
  if (target === "plan") renderPlan();
  if (target === "library") renderFoods();
  if (target === "sources") renderSources();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function foodById(id) {
  return foods.find(food => food.id === id);
}

function updateStats() {
  const calories = Math.max(0, Math.round(state.consumedCalories));
  const protein = Math.max(0, Math.round(state.consumedProtein));
  const water = Math.max(0, Math.round(state.water));
  document.querySelector("#calories-value").textContent = calories.toLocaleString();
  document.querySelector("#protein-value").textContent = protein;
  document.querySelector("#water-value").textContent = water;
  document.querySelector("#calories-progress").style.width = `${Math.min(calories / 2000 * 100, 100)}%`;
  document.querySelector("#protein-progress").style.width = `${Math.min(protein / 90 * 100, 100)}%`;
  document.querySelector("#water-progress").style.width = `${Math.min(water / 8 * 100, 100)}%`;
  document.querySelector("#calories-left").textContent = `${Math.max(2000 - calories, 0)} to go`;
  document.querySelector("#protein-left").textContent = `${Math.max(90 - protein, 0)} g to go`;
}

function renderMealSuggestions() {
  const suggestions = foods.filter(food => !state.preferences.includes("Vegan") || !["Greek yogurt & berries", "Eggs & whole-grain toast", "Salmon & brown rice"].includes(food.name));
  const slots = ["Breakfast", "Lunch", "Dinner"];
  const selected = slots.map(slot => suggestions.find(food => food.group === slot)).filter(Boolean);
  document.querySelector("#meal-suggestions").innerHTML = selected.map(food => {
    const isAdded = state.plan.includes(food.id);
    return `<div class="meal-item"><span class="meal-icon" aria-hidden="true">${food.icon}</span><span class="meal-copy"><strong>${food.name}</strong><small>${food.meal} · ${food.protein}g protein</small></span>${isAdded ? '<span class="added-check" aria-label="Added to plan">✓</span>' : `<button class="meal-add" data-add="${food.id}" aria-label="Add ${escapeHtml(food.name)} to your plan">＋</button>`}</div>`;
  }).join("");
}

function addFood(id) {
  const food = foodById(id);
  if (!food) return;
  if (state.plan.includes(id)) {
    showToast(`${food.name} is already in your plan.`);
    return;
  }
  state.plan.push(id);
  saveState();
  renderMealSuggestions();
  renderFoods();
  renderPlan();
  showToast(`${food.name} added to your plan.`);
}

function removeFood(id) {
  const index = state.plan.indexOf(id);
  if (index < 0) return;
  const food = foodById(id);
  state.plan.splice(index, 1);
  saveState();
  renderPlan();
  renderFoods();
  renderMealSuggestions();
  showToast(`${food ? food.name : "Meal"} removed from your plan.`);
}

function renderFoods() {
  const search = (document.querySelector("#food-search")?.value || "").trim().toLowerCase();
  const items = foods.filter(food => {
    const matchesSearch = `${food.name} ${food.meal} ${food.description} ${food.tags.join(" ")}`.toLowerCase().includes(search);
    const matchesFilter = activeFilter === "All" || food.tags.includes(activeFilter);
    const vegan = state.preferences.includes("Vegan") && ["Greek yogurt & berries", "Eggs & whole-grain toast", "Salmon & brown rice"].includes(food.name);
    const dairyFree = state.preferences.includes("Dairy-free") && food.name === "Greek yogurt & berries";
    const vegetarian = state.preferences.includes("Vegetarian") && food.name === "Salmon & brown rice";
    return matchesSearch && matchesFilter && !vegan && !dairyFree && !vegetarian;
  });
  const container = document.querySelector("#food-grid");
  if (!container) return;
  container.innerHTML = items.length ? items.map(food => {
    const isAdded = state.plan.includes(food.id);
    return `<article class="food-card"><div class="food-card-top"><span class="food-illustration" aria-hidden="true">${food.icon}</span><span class="food-tag">${food.tags.join(" · ")}</span></div><h3>${food.name}</h3><p>${food.description}</p><div class="food-card-footer"><span class="food-macros">~${food.calories} kcal · ${food.protein}g protein</span><button class="food-add" data-add="${food.id}">${isAdded ? "Added ✓" : "+ Add to plan"}</button></div></article>`;
  }).join("") : '<div class="empty-state">No foods match that search. Try another ingredient or category.</div>';
}

function renderPlan() {
  const grouped = ["Breakfast", "Lunch", "Dinner", "Snack"].map(group => ({
    group,
    items: state.plan.map(foodById).filter(food => food && food.group === group)
  }));
  const planned = state.plan.map(foodById).filter(Boolean);
  const calories = planned.reduce((total, food) => total + food.calories, 0);
  const protein = planned.reduce((total, food) => total + food.protein, 0);
  const summary = document.querySelector("#plan-summary");
  const content = document.querySelector("#plan-content");
  if (!summary || !content) return;
  summary.innerHTML = `<strong>${planned.length} ${planned.length === 1 ? "idea" : "ideas"}</strong><span>in your flexible plan</span><span class="summary-detail">About ${calories.toLocaleString()} kcal · ${protein}g protein</span>`;
  content.innerHTML = grouped.map(({ group, items }) => `<section class="plan-meal-group"><h2>${group}<span>${items.length} ${items.length === 1 ? "item" : "items"}</span></h2>${items.length ? items.map(food => `<div class="planned-item"><span class="meal-icon" aria-hidden="true">${food.icon}</span><span><strong>${food.name}</strong><small>~${food.calories} kcal · ${food.protein}g protein</small></span><button class="remove-item" data-remove="${food.id}" aria-label="Remove ${escapeHtml(food.name)} from plan">×</button></div>`).join("") : '<p class="plan-empty">Nothing here yet. Add an idea when you find one.</p>'}</section>`).join("");
}

function renderSources() {
  const container = document.querySelector("#sources-grid");
  if (!container) return;
  container.innerHTML = sourceLibrary.map((source, index) => `<a class="source-card" href="${source.url}" target="_blank" rel="noreferrer"><span class="citation-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${source.title}</strong><small>${source.organization} <span aria-hidden="true">↗</span></small><p>${source.detail}</p></span></a>`).join("");
}

function retrieve(query) {
  const normalized = query.toLowerCase();
  const matches = knowledge.map(note => ({
    note,
    score: note.keys.reduce((score, keyword) => score + (normalized.includes(keyword) ? (keyword.includes(" ") ? 2 : 1) : 0), 0)
  })).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
  return matches;
}

function appendAnswer(query) {
  const chat = document.querySelector("#chat-body");
  const greeting = document.querySelector("#welcome-answer");
  if (greeting) greeting.remove();
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.innerHTML = `<span class="message-avatar">A</span><div class="message-content"><span class="message-label">YOU · JUST NOW</span><p>${escapeHtml(query)}</p></div>`;
  chat.appendChild(userMessage);

  const matches = retrieve(query);
  const matchedIds = [...new Set(matches.flatMap(match => match.note.refs))];
  const matchedSources = matchedIds.map(id => sourceLibrary.find(source => source.id === id)).filter(Boolean);
  const answer = matches.length
    ? matches.map(match => match.note.text).join(" ")
    : "I don’t have a specific note for that yet. Try asking about protein, vegetarian meals, fiber, hydration, or snack ideas. For personal medical or nutrition questions, a qualified healthcare professional is the right person to ask.";
  const citations = matchedSources.length ? `<div class="citations">${matchedSources.map((source, index) => `<a class="citation" href="${source.url}" target="_blank" rel="noreferrer"><span class="citation-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${source.title}</strong><small>${source.organization}</small></span><span class="external-mark">↗</span></a>`).join("")}</div>` : "";
  const assistantMessage = document.createElement("div");
  assistantMessage.className = "message assistant-message";
  assistantMessage.innerHTML = `<span class="message-avatar bot-avatar">✳</span><div class="message-content"><span class="message-label">NUTRIRAG · JUST NOW</span><p>${escapeHtml(answer)}</p>${citations}<div class="answer-disclaimer"><span aria-hidden="true">ⓘ</span> General educational information only—not a diagnosis or personalized treatment.</div></div>`;
  chat.appendChild(assistantMessage);
  chat.scrollTop = chat.scrollHeight;
}

function openPreferences() {
  const dialog = document.querySelector("#preferences-dialog");
  document.querySelectorAll('input[name="pref"]').forEach(input => { input.checked = state.preferences.includes(input.value); });
  dialog.showModal();
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.view);
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) addFood(addButton.dataset.add);
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeFood(removeButton.dataset.remove);
  const suggestion = event.target.closest(".suggestion");
  if (suggestion) {
    const query = suggestion.dataset.query;
    appendAnswer(query);
  }
  const filter = event.target.closest(".filter-chip");
  if (filter) {
    activeFilter = filter.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip === filter));
    renderFoods();
  }
});

document.querySelector("#chat-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const query = input.value.trim();
  if (!query) {
    showToast("Type a question to get started.");
    input.focus();
    return;
  }
  appendAnswer(query);
  input.value = "";
});

document.querySelector("#food-search").addEventListener("input", renderFoods);
document.querySelector("#add-water").addEventListener("click", () => {
  state.water += 1;
  saveState();
  updateStats();
  showToast("Hydration note updated.");
});
["#preferences-open", "#preferences-open-top", "#preferences-open-main"].forEach(selector => {
  document.querySelector(selector).addEventListener("click", openPreferences);
});
document.querySelector("#save-preferences").addEventListener("click", () => {
  state.preferences = [...document.querySelectorAll('input[name="pref"]:checked')].map(input => input.value);
  saveState();
  renderFoods();
  renderMealSuggestions();
  document.querySelector("#preferences-dialog").close();
  showToast("Your preferences have been saved.");
});

updateStats();
renderMealSuggestions();
renderFoods();
renderPlan();
renderSources();
document.querySelector("#current-date").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "long", month: "long", day: "numeric"
}).format(new Date()).toUpperCase();
