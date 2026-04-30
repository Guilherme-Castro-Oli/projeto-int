const menuItems = document.querySelectorAll(".menu li");
const pages = document.querySelectorAll(".page");
const tabs = document.querySelectorAll(".tab");
const filterButtons = document.querySelectorAll("[data-filter]");
const trainingCards = document.querySelectorAll("#trainings .card");
const categoryButton = document.querySelector(".chip.select");
const themeButtons = document.querySelectorAll(".mode-switch button");
const themeStatus = document.querySelector(".theme-status");
const adminDetailButtons = document.querySelectorAll("[data-admin-detail]");
const adminDetailPanel = document.querySelector(".admin-detail-panel");
const adminDetailTitle = document.querySelector("[data-admin-title]");
const adminDetailDescription = document.querySelector("[data-admin-description]");
const adminModal = document.querySelector(".admin-modal");
const adminModalTitle = document.querySelector("[data-admin-modal-title]");
const adminModalDescription = document.querySelector("[data-admin-modal-description]");
const adminCloseButtons = document.querySelectorAll("[data-admin-close]");
const validTrainingFilters = ["todos", "nao-iniciado", "em-andamento", "concluido"];
const adminDetails = {
  conclusao: {
    title: "Conclusão global",
    description: "84,2% dos treinamentos obrigatórios foram concluídos. O avanço mensal é de 3,1%, com maior adesão nas áreas de tecnologia e atendimento.",
  },
  desempenho: {
    title: "Desempenho médio",
    description: "A média atual é de 792 pontos por colaborador. Os módulos de Compliance e Boas Práticas Técnicas concentram os maiores ganhos de XP.",
  },
  colaboradores: {
    title: "Colaboradores ativos",
    description: "1.284 colaboradores acessaram a plataforma neste ciclo. Há 96 novos acessos e 42 usuários que precisam de acompanhamento do administrador.",
  },
  status: {
    title: "Status dos treinamentos",
    description: "Distribuição atual: 45% concluídos, 30% em progresso, 15% atrasados e 10% não iniciados. Recomenda-se priorizar lembretes para módulos atrasados.",
  },
  ranking: {
    title: "Ranking global de talentos",
    description: "O ranking completo permite acompanhar pontuação, progresso, trilhas concluídas e colaboradores com evolução acelerada nos últimos 30 dias.",
  },
  alex: {
    title: "Alex Mercer",
    description: "1º lugar no ranking, 98% de progresso e 12.450 pontos. Destaque em Segurança Digital, com todos os módulos críticos concluídos.",
  },
  sarah: {
    title: "Sarah Connor",
    description: "2º lugar no ranking, 85% de progresso e 10.120 pontos. Boa evolução em Otimização Operacional, com dois módulos em andamento.",
  },
  david: {
    title: "David Lightman",
    description: "3º lugar no ranking, 72% de progresso e 9.840 pontos. A área de Engenharia de IA está avançando, mas ainda há pendências de revisão.",
  },
};

function getSavedTheme() {
  try {
    return localStorage.getItem("preferredTheme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("preferredTheme", theme);
  } catch (error) {
    return;
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";

  document.body.classList.toggle("light-theme", nextTheme === "light");
  document.body.classList.toggle("dark-theme", nextTheme === "dark");

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === nextTheme);
  });

  if (themeStatus) {
    themeStatus.textContent = nextTheme === "light" ? "Modo claro ativo" : "Modo escuro ativo";
  }

  saveTheme(nextTheme);
}

function animateKpiText(node) {
  if (!node.dataset.targetText) {
    node.dataset.targetText = node.textContent.trim();
  }

  const raw = node.dataset.targetText;
  const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric)) return;

  const isRank = raw.includes("#");
  const hasK = raw.toLowerCase().includes("k");
  const hasPercent = raw.includes("%");
  const duration = 1000;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = numeric * eased;

    if (isRank) {
      node.textContent = `#${Math.max(1, Math.round(current)).toString().padStart(2, "0")}`;
    } else if (hasK) {
      node.textContent = `${current.toFixed(1)}k`;
    } else if (hasPercent) {
      node.textContent = `${Math.round(current)}%`;
    } else {
      node.textContent = Math.round(current).toString();
    }

    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function animateProgressBars(scope = document) {
  const bars = scope.querySelectorAll(".progress i");
  bars.forEach((bar, index) => {
    const target = bar.dataset.targetWidth || bar.style.width || "0%";
    bar.dataset.targetWidth = target;
    bar.style.width = "0%";
    bar.style.transition = "width 900ms ease";

    setTimeout(() => {
      bar.style.width = target;
    }, 120 + index * 80);
  });
}

function animateCards(scope = document) {
  const cards = scope.querySelectorAll(".card:not([hidden]), .panel, .list-row");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(18px) scale(0.985)";
    card.style.transition = "opacity 420ms ease, transform 420ms ease, box-shadow 280ms ease";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, 70 * index + 80);
  });
}

function applyCardTilt() {
  const cards = document.querySelectorAll(".card, .panel, .list-row");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * 5;
      const rotateY = (px - 0.5) * 6;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      card.style.boxShadow = "0 18px 28px rgba(2, 8, 25, 0.42)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      card.style.boxShadow = "";
    });
  });
}

function handleSelection(elements, className) {
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      elements.forEach((item) => item.classList.remove(className));
      element.classList.add(className);
    });
  });
}

function getRouteFromHash() {
  const [page, filter] = window.location.hash.replace("#", "").split("/");

  return {
    page: page || "dashboard",
    filter: validTrainingFilters.includes(filter) ? filter : "todos",
  };
}

function updateRoute(targetPage, filter = "todos") {
  const nextHash = targetPage === "trainings" && filter !== "todos"
    ? `#trainings/${filter}`
    : `#${targetPage}`;

  history.pushState(null, "", nextHash);
}

function applyTrainingFilter(filter = "todos") {
  const nextFilter = validTrainingFilters.includes(filter) ? filter : "todos";

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === nextFilter);
  });

  trainingCards.forEach((card) => {
    const shouldShow = nextFilter === "todos" || card.dataset.status === nextFilter;
    card.hidden = !shouldShow;
  });

  const trainingsPage = document.getElementById("trainings");
  if (trainingsPage?.classList.contains("active")) {
    animateCards(trainingsPage);
    animateProgressBars(trainingsPage);
  }
}

function showAdminDetail(detailKey) {
  const detail = adminDetails[detailKey];
  if (!detail || !adminDetailPanel || !adminDetailTitle || !adminDetailDescription) return;

  adminDetailTitle.textContent = detail.title;
  adminDetailDescription.textContent = detail.description;
  adminDetailPanel.classList.add("active");

  if (adminModal && adminModalTitle && adminModalDescription) {
    adminModalTitle.textContent = detail.title;
    adminModalDescription.textContent = detail.description;
    adminModal.hidden = false;
  }
}

function closeAdminDetail() {
  if (adminModal) adminModal.hidden = true;
}

function activatePage(targetPage) {
  const targetItem = document.querySelector(`.menu li[data-page="${targetPage}"]`);
  const activePage = document.getElementById(targetPage);

  menuItems.forEach((item) => item.classList.remove("active"));
  pages.forEach((page) => page.classList.remove("active"));

  if (targetItem) targetItem.classList.add("active");
  if (activePage) {
    activePage.classList.add("active");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    animateCards(activePage);
    animateProgressBars(activePage);
    activePage.querySelectorAll(".stats strong").forEach(animateKpiText);
  }
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetPage = item.getAttribute("data-page");
    activatePage(targetPage);
    if (targetPage === "trainings") applyTrainingFilter("todos");
    updateRoute(targetPage);
  });
});

handleSelection(tabs, "active");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
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

adminDetailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showAdminDetail(button.dataset.adminDetail);
  });
});

adminCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAdminDetail);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAdminDetail();
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
  });
});

applyCardTilt();

applyTheme(getSavedTheme() || "dark");

const initialRoute = getRouteFromHash();
if (initialRoute.page && document.getElementById(initialRoute.page)) {
  activatePage(initialRoute.page);
  if (initialRoute.page === "trainings") applyTrainingFilter(initialRoute.filter);
} else {
  activatePage("dashboard");
}

window.addEventListener("popstate", () => {
  const route = getRouteFromHash();
  activatePage(document.getElementById(route.page) ? route.page : "dashboard");
  if (route.page === "trainings") applyTrainingFilter(route.filter);
});
