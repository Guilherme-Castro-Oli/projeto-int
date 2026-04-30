//tirei muita coisa do admin depois coloco de volta esta salvo
// essa linha tem que ser a primeira, se não for buga o treinamentos
const validTrainingFilters = ["todos", "nao-iniciado", "em-andamento", "concluido"];

// codigo para mudar para claro e escuro 
const themeButtons = document.querySelectorAll(".mode-switch button");
const themeStatus = document.querySelector(".theme-status");

function getSavedTheme() {
  try { return localStorage.getItem("preferredTheme"); }
  catch { return null; }
}

function saveTheme(theme) {
  try { localStorage.setItem("preferredTheme", theme); }
  catch { }
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";

  document.body.classList.toggle("light-theme", nextTheme === "light");
  document.body.classList.toggle("dark-theme", nextTheme === "dark");

  themeButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.theme === nextTheme)
  );

  if (themeStatus) {
    themeStatus.textContent =
      nextTheme === "light" ? "Modo claro ativo" : "Modo escuro ativo";
  }

  saveTheme(nextTheme);
}

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
  });
});


// navegação lateral.
// o codigo serve para trocar as paginas dashboard Treinamentos Ranking Configurações e Administrador
// basicamente só serve para isso
// não sei se vão perguntar mais para deixar avisado esse codigo vem do meu prototipo do portifolio.
const menuItems = document.querySelectorAll(".menu li");
const pages = document.querySelectorAll(".page");

function activatePage(targetPage) {
  const targetItem = document.querySelector(`.menu li[data-page="${targetPage}"]`);
  const activePage = document.getElementById(targetPage);

  menuItems.forEach(i => i.classList.remove("active"));
  pages.forEach(p => p.classList.remove("active"));

  if (targetItem) targetItem.classList.add("active");
  if (activePage) {
    activePage.classList.add("active");
    window.scrollTo({ top: 0 });
  }
}

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;
    activatePage(page);
    if (page === "trainings") applyTrainingFilter("todos");
    updateRoute(page);
  });
});


// esse é um pouco mais complicado pois nem eu entendi de primeira basicamente
// ele serve para resolver o problema de url/link
// ele salva a ultima aba lateral aberta.
function getRouteFromHash() {
  const [page, filter] = window.location.hash.replace("#", "").split("/");

  return {
    page: page || "dashboard",
    filter: validTrainingFilters.includes(filter) ? filter : "todos",
  };
}

function updateRoute(page, filter = "todos") {
  const hash =
    page === "trainings" && filter !== "todos"
      ? `#trainings/${filter}`
      : `#${page}`;

  history.pushState(null, "", hash);
}


// filtro do treinamento
const filterButtons = document.querySelectorAll("[data-filter]");
const trainingCards = document.querySelectorAll("#trainings .card");
const categoryButton = document.querySelector(".chip.select");

function applyTrainingFilter(filter = "todos") {
  const next = validTrainingFilters.includes(filter) ? filter : "todos";

  filterButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === next)
  );

  trainingCards.forEach(card => {
    const show = next === "todos" || card.dataset.status === next;
    card.hidden = !show;
  });
}

const tabs = document.querySelectorAll(".tab");

function handleSelection(elements, className) {
  elements.forEach(el => {
    el.addEventListener("click", () => {
      elements.forEach(e => e.classList.remove(className));
      el.classList.add(className);
    });
  });
}

handleSelection(tabs, "active");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    activatePage("trainings");
    applyTrainingFilter(filter);
    updateRoute("trainings", filter);
  });
});

categoryButton?.addEventListener("click", () => {
  activatePage("trainings");
  applyTrainingFilter("todos");
  updateRoute("trainings");
});


// codigo novo
// o codigo abaixo tambem da url é para resover bug e força abrir no dashboard

const allowedPages = ["dashboard", "trainings", "admin", "leaderboard"];

applyTheme(getSavedTheme() || "dark");

const route = getRouteFromHash();

if (allowedPages.includes(route.page) && document.getElementById(route.page)) {
  activatePage(route.page);

  if (route.page === "trainings") {
    applyTrainingFilter(route.filter);
  }
} else {
  history.replaceState(null, "", "#dashboard");
  activatePage("dashboard");
}

window.addEventListener("popstate", () => {
  const r = getRouteFromHash();

  if (allowedPages.includes(r.page) && document.getElementById(r.page)) {
    activatePage(r.page);

    if (r.page === "trainings") {
      applyTrainingFilter(r.filter);
    }
  } else {
    activatePage("dashboard");
  }
});