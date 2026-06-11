const STORAGE_KEY = "gatherly.events.v1";

const accentColors = [
  "#d95d39",
  "#317a67",
  "#2f6fa7",
  "#8f5a39",
  "#6f5aa8",
  "#c29a2e"
];

const eventBlueprints = {
  BBQ: {
    main: "Burgers, hot dogs, or grilled mains",
    side: "Grilled vegetables or salad",
    extra: "Chips and dip",
    drink: "Lemonade or iced tea",
    backupDrink: "Water and ice",
    supply: "Plates, napkins, charcoal or propane"
  },
  Birthday: {
    main: "Pizza, sliders, or party sandwiches",
    side: "Fruit tray or snack board",
    extra: "Cake or cupcakes",
    drink: "Sparkling lemonade",
    backupDrink: "Water and juice boxes",
    supply: "Candles, plates, napkins, and forks"
  },
  Picnic: {
    main: "Sandwiches or wraps",
    side: "Fruit, salad, or chips",
    extra: "Cookies or brownies",
    drink: "Iced tea or lemonade",
    backupDrink: "Water bottles",
    supply: "Blankets, cups, napkins, and trash bags"
  },
  "Game night": {
    main: "Pizza or easy finger foods",
    side: "Popcorn, chips, or snack mix",
    extra: "Cookies or candy",
    drink: "Soda or seltzer",
    backupDrink: "Water",
    supply: "Napkins, plates, cups, and score pads"
  },
  Potluck: {
    main: "Shared main dish",
    side: "Salad or vegetable side",
    extra: "Dessert tray",
    drink: "Batch drink or punch",
    backupDrink: "Water and ice",
    supply: "Serving spoons, labels, plates, and napkins"
  },
  Fundraiser: {
    main: "Appetizer trays or easy entrees",
    side: "Snack table",
    extra: "Dessert donations",
    drink: "Coffee, tea, or lemonade",
    backupDrink: "Water station",
    supply: "Donation table supplies, cups, plates, and napkins"
  },
  Event: {
    main: "Main dish",
    side: "Side dish",
    extra: "Dessert or snacks",
    drink: "Signature drink",
    backupDrink: "Water and ice",
    supply: "Plates, cups, napkins, and serving utensils"
  }
};

const elements = {
  form: document.querySelector("#eventForm"),
  eventList: document.querySelector("#eventList"),
  eventCount: document.querySelector("#eventCount"),
  guestInput: document.querySelector("#guestInput"),
  guestList: document.querySelector("#guestList"),
  guestTotal: document.querySelector("#guestTotal"),
  foodPreferenceInput: document.querySelector("#foodPreferenceInput"),
  drinkPreferenceInput: document.querySelector("#drinkPreferenceInput"),
  foodPreferenceList: document.querySelector("#foodPreferenceList"),
  drinkPreferenceList: document.querySelector("#drinkPreferenceList"),
  preferenceTotal: document.querySelector("#preferenceTotal"),
  suggestionTotal: document.querySelector("#suggestionTotal"),
  suggestionNote: document.querySelector("#suggestionNote"),
  suggestionList: document.querySelector("#suggestionList"),
  budgetRemainingBadge: document.querySelector("#budgetRemainingBadge"),
  budgetSummary: document.querySelector("#budgetSummary"),
  budgetTotal: document.querySelector("#budgetTotal"),
  budgetSpent: document.querySelector("#budgetSpent"),
  budgetLeft: document.querySelector("#budgetLeft"),
  expenseNameInput: document.querySelector("#expenseNameInput"),
  expenseAmountInput: document.querySelector("#expenseAmountInput"),
  expenseList: document.querySelector("#expenseList"),
  accentChoices: document.querySelector("#accentChoices"),
  statusLine: document.querySelector("#statusLine"),
  newEventBtn: document.querySelector("#newEventBtn"),
  saveEventBtn: document.querySelector("#saveEventBtn"),
  copyInviteBtn: document.querySelector("#copyInviteBtn"),
  addGuestBtn: document.querySelector("#addGuestBtn"),
  addFoodPreferenceBtn: document.querySelector("#addFoodPreferenceBtn"),
  addDrinkPreferenceBtn: document.querySelector("#addDrinkPreferenceBtn"),
  addExpenseBtn: document.querySelector("#addExpenseBtn"),
  deleteEventBtn: document.querySelector("#deleteEventBtn"),
  downloadCalendarBtn: document.querySelector("#downloadCalendarBtn")
};

const preview = {
  type: document.querySelector("#previewType"),
  title: document.querySelector("#previewTitle"),
  date: document.querySelector("#previewDate"),
  fullDate: document.querySelector("#previewFullDate"),
  time: document.querySelector("#previewTime"),
  location: document.querySelector("#previewLocation"),
  host: document.querySelector("#previewHost"),
  description: document.querySelector("#previewDescription"),
  guestCount: document.querySelector("#previewGuestCount"),
  suggestionCount: document.querySelector("#previewSuggestionCount"),
  spotsLeft: document.querySelector("#previewSpotsLeft"),
  budgetSummary: document.querySelector("#previewBudgetSummary"),
  budgetRemaining: document.querySelector("#previewBudgetRemaining"),
  budgetBar: document.querySelector("#previewBudgetBar"),
  budgetSpent: document.querySelector("#previewBudgetSpent"),
  budgetTotal: document.querySelector("#previewBudgetTotal"),
  suggestions: document.querySelector("#previewSuggestions"),
  options: document.querySelector("#previewOptions")
};

const fieldInputs = Array.from(document.querySelectorAll("[data-field]"));
const settingInputs = Array.from(document.querySelectorAll("[data-setting]"));

let events = loadEvents();
let activeEventId = events[0].id;
let statusTimer = 0;

renderAccentChoices();
bindEvents();
renderAll();

function bindEvents() {
  fieldInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const event = getActiveEvent();
      const field = input.dataset.field;
      event[field] = field === "capacity" ? normalizeCapacity(input.value) : input.value;
      persistAndRender();
    });
  });

  settingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const event = getActiveEvent();
      event.settings[input.dataset.setting] = input.checked;
      persistAndRender();
    });
  });

  elements.newEventBtn.addEventListener("click", () => {
    const event = createEvent({
      title: "Untitled BBQ",
      budget: "",
      expenses: [],
      guests: [],
      preferences: {
        food: [],
        drinks: []
      }
    });
    events.unshift(event);
    activeEventId = event.id;
    persistAndRender();
    elements.statusLine.textContent = "";
    document.querySelector("#eventTitle").focus();
  });

  elements.saveEventBtn.addEventListener("click", () => {
    if (!getActiveEvent().title.trim() || !getActiveEvent().date) {
      setStatus("Add an event name and date.");
      return;
    }
    saveEvents();
    setStatus("Event saved.");
  });

  elements.copyInviteBtn.addEventListener("click", copyInvite);
  elements.addGuestBtn.addEventListener("click", addGuest);
  elements.addFoodPreferenceBtn.addEventListener("click", () => addPreference("food"));
  elements.addDrinkPreferenceBtn.addEventListener("click", () => addPreference("drinks"));
  elements.addExpenseBtn.addEventListener("click", addExpense);
  elements.deleteEventBtn.addEventListener("click", deleteActiveEvent);
  elements.downloadCalendarBtn.addEventListener("click", downloadCalendar);

  elements.guestInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addGuest();
    }
  });

  elements.foodPreferenceInput.addEventListener("keydown", (event) => handlePreferenceEnter(event, "food"));
  elements.drinkPreferenceInput.addEventListener("keydown", (event) => handlePreferenceEnter(event, "drinks"));
  elements.expenseNameInput.addEventListener("keydown", handleExpenseEnter);
  elements.expenseAmountInput.addEventListener("keydown", handleExpenseEnter);
}

function loadEvents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) {
      return saved.map(hydrateEvent);
    }
  } catch (error) {
    console.warn("Could not load events", error);
  }

  return [createEvent()];
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function persistAndRender() {
  saveEvents();
  renderAll();
}

function hydrateEvent(event) {
  const fallback = createEvent();
  return {
    ...fallback,
    ...event,
    budget: event.budget ?? "",
    settings: {
      ...fallback.settings,
      ...(event.settings || {})
    },
    guests: Array.isArray(event.guests) ? event.guests : [],
    preferences: hydratePreferences(event),
    expenses: Array.isArray(event.expenses) ? event.expenses : []
  };
}

function hydratePreferences(event) {
  const preferences = event.preferences || {};
  const food = Array.isArray(preferences.food) ? [...preferences.food] : [];
  const drinks = Array.isArray(preferences.drinks) ? [...preferences.drinks] : [];
  const migratedItems = Array.isArray(event.items) ? event.items : [];

  migratedItems.forEach((item) => {
    const name = item.name || item;
    if (!name) return;
    if (isDrinkPreference(name)) {
      drinks.push(name);
    } else {
      food.push(name);
    }
  });

  return {
    food: dedupe(food.map(String).map((item) => item.trim()).filter(Boolean)),
    drinks: dedupe(drinks.map(String).map((item) => item.trim()).filter(Boolean))
  };
}

function createEvent(overrides = {}) {
  return {
    id: makeId(),
    title: "Backyard BBQ",
    type: "BBQ",
    host: "Your host",
    capacity: 24,
    date: getNextSaturday(),
    startTime: "16:00",
    endTime: "20:00",
    location: "Backyard or park",
    vibe: "Casual drop-in",
    description: "Come by for grilled food, cold drinks, and a relaxed summer hang. Bring yourself, bring a friend, and we will plan the food and drinks around everyone coming.",
    budget: 250,
    accent: "#d95d39",
    settings: {
      rsvp: true,
      plusOnes: true,
      kids: true,
      potluck: true
    },
    guests: ["Alex", "Jamie", "Taylor"],
    preferences: {
      food: ["Burgers", "Veggie skewers", "Chips"],
      drinks: ["Lemonade", "Sparkling water"]
    },
    expenses: [
      { id: makeId(), name: "Grill food", amount: 95 },
      { id: makeId(), name: "Drinks", amount: 42 },
      { id: makeId(), name: "Plates and supplies", amount: 28 }
    ],
    ...overrides
  };
}

function renderAll() {
  const event = getActiveEvent();
  document.documentElement.style.setProperty("--event-accent", event.accent);
  renderForm(event);
  renderEventList();
  renderAccentChoices();
  renderGuests(event);
  renderPreferences(event);
  renderSuggestions(event);
  renderBudget(event);
  renderPreview(event);
}

function renderForm(event) {
  fieldInputs.forEach((input) => {
    const value = event[input.dataset.field] ?? "";
    if (input.value !== String(value)) {
      input.value = value;
    }
  });

  settingInputs.forEach((input) => {
    input.checked = Boolean(event.settings[input.dataset.setting]);
  });
}

function renderEventList() {
  elements.eventList.replaceChildren();
  elements.eventCount.textContent = String(events.length);

  events.forEach((event) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-card";
    button.dataset.id = event.id;
    button.setAttribute("aria-current", event.id === activeEventId ? "true" : "false");

    const title = document.createElement("strong");
    title.textContent = event.title || "Untitled event";

    const meta = document.createElement("span");
    meta.textContent = `${event.type || "Event"} · ${formatDate(event.date)}`;

    button.append(title, meta);
    button.addEventListener("click", () => {
      activeEventId = event.id;
      renderAll();
    });
    elements.eventList.append(button);
  });
}

function renderAccentChoices() {
  elements.accentChoices.replaceChildren();
  const event = getActiveEvent();

  accentColors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "accent-choice";
    button.style.setProperty("--accent-color", color);
    button.dataset.accent = color;
    button.setAttribute("aria-label", `Use ${color} accent`);
    button.setAttribute("aria-pressed", event.accent === color ? "true" : "false");
    button.addEventListener("click", () => {
      getActiveEvent().accent = color;
      persistAndRender();
    });
    elements.accentChoices.append(button);
  });
}

function renderGuests(event) {
  elements.guestList.replaceChildren();
  elements.guestTotal.textContent = String(event.guests.length);

  event.guests.forEach((guest, index) => {
    const chip = document.createElement("span");
    chip.className = "chip";

    const name = document.createElement("span");
    name.textContent = guest;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.setAttribute("aria-label", `Remove ${guest}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      event.guests.splice(index, 1);
      persistAndRender();
    });

    chip.append(name, remove);
    elements.guestList.append(chip);
  });
}

function renderPreferences(event) {
  renderPreferenceList("food", event.preferences.food, elements.foodPreferenceList);
  renderPreferenceList("drinks", event.preferences.drinks, elements.drinkPreferenceList);
  elements.preferenceTotal.textContent = String(event.preferences.food.length + event.preferences.drinks.length);
}

function renderPreferenceList(type, preferences, list) {
  list.replaceChildren();

  preferences.forEach((preference, index) => {
    const chip = document.createElement("span");
    chip.className = "chip";

    const label = document.createElement("span");
    label.textContent = preference;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.setAttribute("aria-label", `Remove ${preference}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      getActiveEvent().preferences[type].splice(index, 1);
      persistAndRender();
    });

    chip.append(label, remove);
    list.append(chip);
  });
}

function renderSuggestions(event) {
  const suggestions = generatePartySuggestions(event);
  const headcount = getPlanningHeadcount(event);
  const budget = normalizeMoney(event.budget);

  elements.suggestionList.replaceChildren();
  elements.suggestionTotal.textContent = String(suggestions.length);
  elements.suggestionNote.textContent = `${event.type || "Event"} plan for ${headcount} ${headcount === 1 ? "person" : "people"}${budget ? ` around ${formatMoney(budget)}` : ""}.`;

  suggestions.forEach((suggestion) => {
    elements.suggestionList.append(createSuggestionItem(suggestion));
  });
}

function createSuggestionItem(suggestion) {
  const item = document.createElement("div");
  item.className = "suggestion-item";

  const content = document.createElement("div");
  const category = document.createElement("span");
  const name = document.createElement("strong");
  const quantity = document.createElement("small");
  const estimate = document.createElement("span");

  category.className = "suggestion-category";
  category.textContent = suggestion.category;
  name.textContent = suggestion.name;
  quantity.textContent = suggestion.quantity;
  estimate.className = "suggestion-estimate";
  estimate.textContent = formatMoney(suggestion.estimate);

  content.append(category, name, quantity);
  item.append(content, estimate);
  return item;
}

function generatePartySuggestions(event) {
  const headcount = getPlanningHeadcount(event);
  const budget = getSuggestionBudget(event, headcount);
  const blueprint = getEventBlueprint(event.type);
  const foodPrefs = event.preferences.food;
  const drinkPrefs = event.preferences.drinks;
  const generous = budget / headcount >= 16;

  const picks = {
    main: foodPrefs[0] || blueprint.main,
    side: foodPrefs[1] || blueprint.side,
    extra: foodPrefs[2] || blueprint.extra,
    drink: drinkPrefs[0] || blueprint.drink,
    backupDrink: drinkPrefs[1] || blueprint.backupDrink,
    supply: blueprint.supply
  };

  const shares = generous
    ? [0.38, 0.17, 0.12, 0.17, 0.08, 0.08]
    : [0.34, 0.16, 0.12, 0.18, 0.10, 0.10];

  return [
    makeSuggestion("Food", picks.main, `${Math.ceil(headcount * (generous ? 1.35 : 1.15))} servings`, budget, shares[0]),
    makeSuggestion("Food", picks.side, `${getTrayCount(headcount)} trays`, budget, shares[1]),
    makeSuggestion("Food", picks.extra, `${getTrayCount(Math.max(headcount - 4, 1))} trays`, budget, shares[2]),
    makeSuggestion("Drinks", picks.drink, `${Math.ceil(headcount * (generous ? 2 : 1.5))} servings`, budget, shares[3]),
    makeSuggestion("Drinks", picks.backupDrink, `${Math.max(1, Math.ceil(headcount / 10))} packs or pitchers`, budget, shares[4]),
    makeSuggestion("Supplies", picks.supply, `${headcount} place settings`, budget, shares[5])
  ];
}

function makeSuggestion(category, name, quantity, budget, share) {
  return {
    category,
    name,
    quantity,
    estimate: Math.max(1, Math.round(budget * share))
  };
}

function getEventBlueprint(type) {
  return eventBlueprints[type] || eventBlueprints.Event;
}

function getPlanningHeadcount(event) {
  return Math.max(normalizeCapacity(event.capacity), event.guests.length, 1);
}

function getSuggestionBudget(event, headcount) {
  return normalizeMoney(event.budget) || headcount * 12;
}

function getTrayCount(headcount) {
  return Math.max(1, Math.ceil(headcount / 8));
}

function renderBudget(event) {
  const total = normalizeMoney(event.budget);
  const spent = getBudgetSpent(event);
  const remaining = total - spent;
  const isOverBudget = total > 0 && spent > total;

  elements.budgetTotal.textContent = formatMoney(total);
  elements.budgetSpent.textContent = formatMoney(spent);
  elements.budgetLeft.textContent = formatMoney(remaining);
  elements.budgetRemainingBadge.textContent = total ? `${formatMoney(remaining)} left` : "No budget";
  elements.budgetSummary.classList.toggle("over-budget", isOverBudget);
  elements.budgetRemainingBadge.classList.toggle("over-budget", isOverBudget);

  elements.expenseList.replaceChildren();
  event.expenses.forEach((expense) => {
    const row = document.createElement("div");
    row.className = "expense-item";

    const name = document.createElement("strong");
    name.textContent = expense.name;

    const amount = document.createElement("span");
    amount.textContent = formatMoney(expense.amount);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.setAttribute("aria-label", `Remove ${expense.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      getActiveEvent().expenses = getActiveEvent().expenses.filter((item) => item.id !== expense.id);
      persistAndRender();
    });

    row.append(name, amount, remove);
    elements.expenseList.append(row);
  });
}

function renderPreview(event) {
  const totalBudget = normalizeMoney(event.budget);
  const spent = getBudgetSpent(event);
  const remaining = totalBudget - spent;
  const isOverBudget = totalBudget > 0 && spent > totalBudget;
  const suggestions = event.settings.potluck ? generatePartySuggestions(event) : [];

  preview.type.textContent = event.type || "Event";
  preview.title.textContent = event.title || "Untitled event";
  preview.date.textContent = formatDate(event.date);
  preview.fullDate.textContent = formatDate(event.date);
  preview.time.textContent = formatTimeRange(event.startTime, event.endTime);
  preview.location.textContent = event.location || "Location TBD";
  preview.host.textContent = event.host || "Host TBD";
  preview.description.textContent = event.description || `${event.vibe || "Casual"} gathering.`;
  preview.guestCount.textContent = String(event.guests.length);
  preview.suggestionCount.textContent = String(suggestions.length);
  preview.spotsLeft.textContent = String(Math.max(normalizeCapacity(event.capacity) - event.guests.length, 0));
  preview.budgetTotal.textContent = totalBudget ? `${formatMoney(totalBudget)} budget` : "No budget set";
  preview.budgetSpent.textContent = `${formatMoney(spent)} spent`;
  preview.budgetRemaining.textContent = totalBudget ? `${formatMoney(remaining)} left` : "Set budget";
  preview.budgetBar.style.width = `${getBudgetProgress(totalBudget, spent)}%`;
  preview.budgetSummary.classList.toggle("over-budget", isOverBudget);
  preview.budgetRemaining.classList.toggle("over-budget", isOverBudget);

  preview.suggestions.replaceChildren();
  if (suggestions.length) {
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      const name = document.createElement("span");
      const qty = document.createElement("strong");
      name.textContent = suggestion.name;
      qty.textContent = suggestion.quantity;
      li.append(name, qty);
      preview.suggestions.append(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Party list hidden";
    preview.suggestions.append(li);
  }

  preview.options.replaceChildren();
  getOptionLabels(event).forEach((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    preview.options.append(span);
  });
}

function getOptionLabels(event) {
  const labels = [];
  if (event.settings.rsvp) labels.push("RSVP requested");
  if (event.settings.plusOnes) labels.push("Plus ones welcome");
  if (event.settings.kids) labels.push("Kids welcome");
  if (event.settings.potluck) labels.push("Party list included");
  return labels.length ? labels : ["Details only"];
}

function addGuest() {
  const name = elements.guestInput.value.trim();
  if (!name) return;

  getActiveEvent().guests.push(name);
  elements.guestInput.value = "";
  persistAndRender();
}

function addPreference(type) {
  const input = type === "food" ? elements.foodPreferenceInput : elements.drinkPreferenceInput;
  const preference = input.value.trim();
  if (!preference) return;

  const preferences = getActiveEvent().preferences[type];
  if (!preferences.some((item) => item.toLowerCase() === preference.toLowerCase())) {
    preferences.push(preference);
  }
  input.value = "";
  persistAndRender();
}

function addExpense() {
  const name = elements.expenseNameInput.value.trim();
  const amount = normalizeMoney(elements.expenseAmountInput.value);
  if (!name || !amount) {
    setStatus("Add an expense name and amount.");
    return;
  }

  getActiveEvent().expenses.push({
    id: makeId(),
    name,
    amount
  });
  elements.expenseNameInput.value = "";
  elements.expenseAmountInput.value = "";
  persistAndRender();
}

function handlePreferenceEnter(event, type) {
  if (event.key === "Enter") {
    event.preventDefault();
    addPreference(type);
  }
}

function handleExpenseEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addExpense();
  }
}

function deleteActiveEvent() {
  const event = getActiveEvent();
  const confirmed = window.confirm(`Delete "${event.title || "this event"}"?`);
  if (!confirmed) return;

  events = events.filter((savedEvent) => savedEvent.id !== activeEventId);
  if (!events.length) {
    events = [createEvent()];
  }
  activeEventId = events[0].id;
  persistAndRender();
  setStatus("Event deleted.");
}

async function copyInvite() {
  const text = buildInviteText(getActiveEvent());

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Invite copied.");
  } catch (error) {
    fallbackCopy(text);
    setStatus("Invite copied.");
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function buildInviteText(event) {
  const suggestions = event.settings.potluck ? generatePartySuggestions(event) : [];
  const foodPrefs = event.preferences.food.length ? `Food preferences: ${event.preferences.food.join(", ")}` : "";
  const drinkPrefs = event.preferences.drinks.length ? `Drink preferences: ${event.preferences.drinks.join(", ")}` : "";
  const suggestionLines = suggestions.map((item) => `- ${item.name}: ${item.quantity} (${formatMoney(item.estimate)})`);
  const lines = [
    `${event.title || "Untitled event"}`,
    `${formatDate(event.date)} · ${formatTimeRange(event.startTime, event.endTime)}`,
    event.location ? `Location: ${event.location}` : "",
    event.host ? `Host: ${event.host}` : "",
    "",
    event.description || "",
    "",
    foodPrefs,
    drinkPrefs,
    "",
    suggestionLines.length ? "What to bring:" : "",
    ...suggestionLines,
    "",
    getOptionLabels(event).join(" · ")
  ];

  return lines.filter((line, index, allLines) => line || allLines[index - 1]).join("\n").trim();
}

function downloadCalendar() {
  const event = getActiveEvent();
  if (!event.date) {
    setStatus("Add a date before downloading.");
    return;
  }

  const startDate = toLocalDate(event.date, event.startTime || "09:00");
  let endDate = toLocalDate(event.date, event.endTime || event.startTime || "10:00");
  if (endDate <= startDate) {
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gatherly//Event Builder//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@gatherly.local`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(startDate)}`,
    `DTEND:${toIcsStamp(endDate)}`,
    `SUMMARY:${escapeIcs(event.title || "Untitled event")}`,
    `LOCATION:${escapeIcs(event.location || "")}`,
    `DESCRIPTION:${escapeIcs(buildInviteText(event))}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(event.title || "event")}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Calendar file downloaded.");
}

function getActiveEvent() {
  return events.find((event) => event.id === activeEventId) || events[0];
}

function setStatus(message) {
  elements.statusLine.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    elements.statusLine.textContent = "";
  }, 2600);
}

function getNextSaturday() {
  const date = new Date();
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  return date.toISOString().slice(0, 10);
}

function formatDate(dateValue) {
  if (!dateValue) return "Date TBD";
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatTimeRange(start, end) {
  const startLabel = formatTime(start);
  const endLabel = formatTime(end);
  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  if (startLabel) return startLabel;
  return "Time TBD";
}

function formatTime(timeValue) {
  if (!timeValue) return "";
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function normalizeCapacity(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeMoney(value) {
  const parsed = Number.parseFloat(String(value).replace(/[$,]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getBudgetSpent(event) {
  return event.expenses.reduce((total, expense) => total + normalizeMoney(expense.amount), 0);
}

function getBudgetProgress(total, spent) {
  if (!total) return spent ? 100 : 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}

function isDrinkPreference(value) {
  return /water|drink|lemonade|tea|coffee|soda|juice|beer|wine|seltzer|punch|cocktail|mocktail/i.test(value);
}

function dedupe(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value);
}

function toLocalDate(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours = 0, minutes = 0] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function toIcsStamp(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "event";
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
