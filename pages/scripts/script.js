// Variáveis globais
let currentMood = null;
let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Configurar navegação mobile
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Fechar menu mobile ao clicar em link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    });
  });

  // Carregar dados salvos
  loadSavedData();
}

// Funções de humor
function selectMood(mood) {
  currentMood = mood;

  // Remover seleção anterior
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Adicionar seleção atual
  document.querySelector(`.mood-btn.${mood}`).classList.add("selected");

  // Salvar humor
  saveMood(mood);

  // Mostrar feedback
  showMoodFeedback(mood);
}

function saveMood(mood) {
  const moodEntry = {
    mood: mood,
    date: new Date().toISOString(),
    timestamp: Date.now(),
  };

  moodHistory.unshift(moodEntry);

  // Manter apenas os últimos 30 registros
  if (moodHistory.length > 30) {
    moodHistory = moodHistory.slice(0, 30);
  }

  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
}

function showMoodFeedback(mood) {
  const messages = {
    happy: "Que bom que você está se sentindo bem! Continue assim! 😊",
    neutral: "Está tudo bem ter dias normais. Como posso ajudar? 😌",
    sad: "Sinto muito que você esteja triste. Lembre-se que isso vai passar. 💙",
    anxious: "Respire fundo. Você não está sozinho nessa. 🌸",
  };

  // Criar notificação temporária
  const notification = document.createElement("div");
  notification.className = "mood-notification";
  notification.textContent = messages[mood];
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;

  document.body.appendChild(notification);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Navegação
function navigateTo(page) {
  window.location.href = page;
}

// Funções de formulário
function submitMoodForm() {
  const form = document.getElementById("moodForm");
  if (!form) return;

  const formData = new FormData(form);
  const moodData = {
    date: formData.get("date"),
    positiveEmotions: formData.get("positiveEmotions"),
    negativeEmotions: formData.get("negativeEmotions"),
    situation: formData.get("situation"),
    thoughts: formData.get("thoughts"),
    reaction: formData.get("reaction"),
    timestamp: Date.now(),
  };

  // Salvar dados
  let moodRecords = JSON.parse(localStorage.getItem("moodRecords")) || [];
  moodRecords.unshift(moodData);
  localStorage.setItem("moodRecords", JSON.stringify(moodRecords));

  // Mostrar sucesso
  showSuccessMessage("Registro de humor salvo com sucesso!");

  // Limpar formulário
  form.reset();
}

function submitSafetyPlan() {
  const form = document.getElementById("safetyPlanForm");
  if (!form) return;

  const formData = new FormData(form);
  const safetyPlan = {
    warningSignals: formData.get("warningSignals"),
    copingStrategies: formData.get("copingStrategies"),
    socialSupport: formData.get("socialSupport"),
    professionalContacts: formData.get("professionalContacts"),
    safeEnvironment: formData.get("safeEnvironment"),
    reasonsToLive: formData.get("reasonsToLive"),
    timestamp: Date.now(),
  };

  // Salvar plano
  localStorage.setItem("safetyPlan", JSON.stringify(safetyPlan));

  // Mostrar sucesso
  showSuccessMessage("Plano de segurança salvo com sucesso!");
}

function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;

  const container = document.querySelector(".main-content");
  container.insertBefore(successDiv, container.firstChild);

  // Remover após 3 segundos
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Carregar dados salvos
function loadSavedData() {
  // Carregar último humor
  if (moodHistory.length > 0) {
    const lastMood = moodHistory[0];
    const timeDiff = Date.now() - lastMood.timestamp;

    // Se foi registrado nas últimas 6 horas, mostrar
    if (timeDiff < 6 * 60 * 60 * 1000) {
      const moodBtn = document.querySelector(`.mood-btn.${lastMood.mood}`);
      if (moodBtn) {
        moodBtn.classList.add("selected");
        currentMood = lastMood.mood;
      }
    }
  }

  // Carregar plano de segurança se estiver na página
  const safetyForm = document.getElementById("safetyPlanForm");
  if (safetyForm) {
    const savedPlan = JSON.parse(localStorage.getItem("safetyPlan"));
    if (savedPlan) {
      Object.keys(savedPlan).forEach((key) => {
        const input = safetyForm.querySelector(`[name="${key}"]`);
        if (input && savedPlan[key]) {
          input.value = savedPlan[key];
        }
      });
    }
  }
}

function clearInput(input){
  input.value = '';
  input.focus();
}

function renderList(container, dataItems) {
  // Clear existing content to prevent duplicates on re-render
  container.innerHTML = '';

  // Loop through the data array
  dataItems.forEach(item => {
      // Create the main item div with class 'item-list'
      const itemDiv = document.createElement('div');
      itemDiv.className = 'list-item';

      // Create the pfp-div
      const pfpDiv = document.createElement('div');
      pfpDiv.className = 'pfp-div';
      const pfpIcon = document.createElement('i');
      pfpIcon.className = 'fa-solid fa-circle-user';
      pfpDiv.appendChild(pfpIcon);
      itemDiv.appendChild(pfpDiv);

      // Create the content div
      const contentDiv = document.createElement('div');
      contentDiv.className = 'item-content';
      // contentDiv.style.display = 'flex'; // Already handled by CSS class
      // contentDiv.style.flexDirection = 'column'; // Already handled by CSS class

      const nameSpan = document.createElement('span');
      nameSpan.className = 'item-name';
      nameSpan.textContent = item.name;
      contentDiv.appendChild(nameSpan);

      const ageSpan = document.createElement('span');
      ageSpan.className = 'age';
      ageSpan.textContent = `Idade: ${item.age}`; // Display age
      contentDiv.appendChild(ageSpan);
      itemDiv.appendChild(contentDiv);

      // Create the buttons div
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'buttons';
      const planButton = document.createElement('button');
      planButton.className = 'ver-plano';
      planButton.textContent = 'Ver Plano';
      planButton.onclick= () => navigateTo('./plano.html');
      const fileButton = document.createElement('button');
      fileButton.className = 'ver-plano';
      fileButton.textContent = 'Ver Registro';
      fileButton.onclick= () => navigateTo('./registro.html');
      
      const buttonIcon = document.createElement('i');
      buttonIcon.className = 'fa-solid fa-arrow-right button-arrow';
      const buttonIcon2 = document.createElement('i');
      buttonIcon2.className = 'fa-solid fa-arrow-right button-arrow';
      
      buttonsDiv.appendChild(fileButton);
      buttonsDiv.appendChild(planButton);
      planButton.appendChild(buttonIcon);
      fileButton.appendChild(buttonIcon2);
      itemDiv.appendChild(buttonsDiv);

      // Append the complete item div to the main container
      container.appendChild(itemDiv);
  });
}

function search(list, items, searchTerm){
  console.log(searchTerm)
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    );
    renderList(list, filteredItems); // Re-render with filtered items
};

// Carregar dados do histórico
function loadHistoryData() {
  const historyContainer = document.getElementById("historyContainer");
  if (!historyContainer) return;

  const moodRecords = JSON.parse(localStorage.getItem("moodRecords")) || [];

  if (moodRecords.length === 0) {
    historyContainer.innerHTML =
      "<p>Nenhum registro encontrado. Comece registrando seu humor!</p>";
    return;
  }

  let historyHTML = "";
  moodRecords.forEach((record, index) => {
    const date = new Date(record.timestamp).toLocaleDateString("pt-BR");
    historyHTML += `
            <div class="history-item">
                <div class="history-date">${date}</div>
                <div class="history-content">
                    ${
                      record.positiveEmotions
                        ? `<p><strong>Emoções Positivas:</strong> ${record.positiveEmotions}</p>`
                        : ""
                    }
                    ${
                      record.negativeEmotions
                        ? `<p><strong>Emoções Negativas:</strong> ${record.negativeEmotions}</p>`
                        : ""
                    }
                    ${
                      record.situation
                        ? `<p><strong>Situação:</strong> ${record.situation}</p>`
                        : ""
                    }
                    ${
                      record.thoughts
                        ? `<p><strong>Pensamentos:</strong> ${record.thoughts}</p>`
                        : ""
                    }
                    ${
                      record.reaction
                        ? `<p><strong>Reação:</strong> ${record.reaction}</p>`
                        : ""
                    }
                </div>
            </div>
        `;
  });

  historyContainer.innerHTML = historyHTML;
}

// Funções de emergência
function callEmergency() {
  if (
    confirm(
      "Você será redirecionado para o CVV (Centro de Valorização da Vida). Deseja continuar?"
    )
  ) {
    window.open("https://www.cvv.org.br/", "_blank");
  }
}

function findNearbyHelp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://www.google.com/maps/search/psicólogo+próximo/@${lat},${lng},15z`;
        window.open(url, "_blank");
      },
      function () {
        alert(
          'Não foi possível obter sua localização. Tente buscar manualmente por "psicólogo próximo" no Google Maps.'
        );
      }
    );
  } else {
    alert(
      'Geolocalização não é suportada neste navegador. Tente buscar manualmente por "psicólogo próximo" no Google Maps.'
    );
  }
}

// Adicionar estilos para animações
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .history-item {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        box-shadow: var(--shadow);
        border-left: 4px solid var(--primary-color);
    }
    
    .history-date {
        font-weight: bold;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    
    .history-content p {
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }
    
    .history-content strong {
        color: var(--dark-color);
    }
`;
document.head.appendChild(style);
