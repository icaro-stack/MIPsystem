// ==========================================
// DADOS INICIAIS (LOCALSTORAGE)
// ==========================================
const monitoramentosIniciais = [
    {
        id: 1,
        praga: "Lagarta-do-cartucho (Spodoptera frugiperda)",
        talhao: "Talhão 03 - Milho",
        prioridade: "alta",
        status: "pendente",
        dataCriacao: "2026-09-15",
        observacao: "Incidência acima do nível de dano econômico."
    },
    {
        id: 2,
        praga: "Percevejo-marrom",
        talhao: "Talhão 01 - Soja",
        prioridade: "media",
        status: "em_andamento",
        dataCriacao: "2026-09-16",
        observacao: "Amostragem indicando início de infestação."
    },
    {
        id: 3,
        praga: "Mosca-branca",
        talhao: "Talhão 05 - Feijão",
        prioridade: "baixa",
        status: "concluido",
        dataCriacao: "2026-09-10",
        observacao: "Aplicação biológica realizada com sucesso."
    }
];

// Obtém registros do localStorage
function obterDados() {
    const dados = localStorage.getItem("mip_monitoramentos");
    if (!dados) {
        localStorage.setItem("mip_monitoramentos", JSON.stringify(monitoramentosIniciais));
        return monitoramentosIniciais;
    }
    return JSON.parse(dados);
}

// Salva registros no localStorage
function salvarDados(lista) {
    localStorage.setItem("mip_monitoramentos", JSON.stringify(lista));
}

// ==========================================
// MÓDULO 1 & 4: DASHBOARD, FILTRAGEM E ORDENAÇÃO
// ==========================================
function renderizarLista() {
    const grid = document.getElementById("agronomosGrid");
    const noResults = document.getElementById("noResults");
    if (!grid) return;

    let lista = obterDados();

    // Módulo 4: Captura dos Filtros
    const filtroStatus = document.getElementById("filtroStatus")?.value || "todos";
    const filtroPrioridade = document.getElementById("filtroPrioridade")?.value || "todas";
    const ordemData = document.getElementById("ordemData")?.value || "recentes";

    // Módulo 4: Filtragem com array.filter()
    lista = lista.filter(item => {
        const matchStatus = (filtroStatus === "todos") || (item.status === filtroStatus);
        const matchPrioridade = (filtroPrioridade === "todas") || (item.prioridade === filtroPrioridade);
        return matchStatus && matchPrioridade;
    });

    // Módulo 4: Ordenação por Data com array.sort()
    lista.sort((a, b) => {
        const dataA = new Date(a.dataCriacao);
        const dataB = new Date(b.dataCriacao);
        return ordemData === "recentes" ? dataB - dataA : dataA - dataB;
    });

    // Módulo 1: Renderização no Grid
    grid.innerHTML = "";

    if (lista.length === 0) {
        noResults.classList.remove("hidden");
    } else {
        noResults.classList.add("hidden");
        // Módulo 4: Mapeamento com array.map() / forEach
        lista.forEach(item => {
            const card = document.createElement("div");
            card.className = `agronomo-card priority-${item.prioridade}`;
            
            const dataFormatada = new Date(item.dataCriacao + 'T00:00:00').toLocaleDateString('pt-BR');
            
            card.innerHTML = `
                <div class="card-top">
                    <div class="card-avatar priority-badge-${item.prioridade}">
                        ${item.prioridade.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h3 class="card-name">${item.praga}</h3>
                        <span class="card-specialty">${item.talhao}</span>
                    </div>
                </div>
                <div class="card-info">
                    <p><strong>Prioridade:</strong> <span class="badge-priority ${item.prioridade}">${item.prioridade.toUpperCase()}</span></p>
                    <p><strong>Status:</strong> ${formatarStatus(item.status)}</p>
                    <p><strong>Data de Registro:</strong> ${dataFormatada}</p>
                    <p>${item.observacao}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-view" onclick="prepararEdicao(${item.id})">✏️ Editar</button>
                    <button class="btn-plan" style="background:#c0392b" onclick="deletarRegistro(${item.id})">🗑️ Excluir</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

function formatarStatus(status) {
    const mapa = {
        'pendente': '⏳ Pendente',
        'em_andamento': '🔄 Em Andamento',
        'concluido': '✅ Concluído'
    };
    return mapa[status] || status;
}

// ==========================================
// MÓDULO 2 & 3: FORMULÁRIO, SALVAR E EDITAR
// ==========================================
function salvarRegistro(event) {
    event.preventDefault();

    const id = document.getElementById("regId").value;
    const praga = document.getElementById("regPraga").value.trim();
    const talhao = document.getElementById("regTalhao").value.trim();
    const prioridade = document.getElementById("regPrioridade").value;
    const status = document.getElementById("regStatus").value;
    const dataCriacao = document.getElementById("regData").value;
    const observacao = document.getElementById("regObs").value.trim();

    // Módulo 2: Validação via JS
    if (!praga || !talhao || !dataCriacao) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    let lista = obterDados();

    if (id) {
        // Módulo 3: Edição (Update)
        lista = lista.map(item => {
            if (item.id == id) {
                return { id: Number(id), praga, talhao, prioridade, status, dataCriacao, observacao };
            }
            return item;
        });
    } else {
        // Módulo 2: Adicionar (Create)
        const novoRegistro = {
            id: Date.now(),
            praga,
            talhao,
            prioridade,
            status,
            dataCriacao,
            observacao
        };
        lista.push(novoRegistro);
    }

    // Módulo 3: Atualizar localStorage e re-renderizar
    salvarDados(lista);
    fecharModal();
    renderizarLista();
}

function prepararNovoRegistro() {
    const form = document.getElementById("crudForm");
    if (form) form.reset();
    document.getElementById("regId").value = "";
    document.getElementById("modalTitle").innerText = "Novo Monitoramento de Praga";
    document.getElementById("regData").value = new Date().toISOString().split('T')[0];
    abrirModal();
}

function prepararEdicao(id) {
    const lista = obterDados();
    const item = lista.find(i => i.id === id);
    if (!item) return;

    document.getElementById("regId").value = item.id;
    document.getElementById("regPraga").value = item.praga;
    document.getElementById("regTalhao").value = item.talhao;
    document.getElementById("regPrioridade").value = item.prioridade;
    document.getElementById("regStatus").value = item.status;
    document.getElementById("regData").value = item.dataCriacao;
    document.getElementById("regObs").value = item.observacao;

    document.getElementById("modalTitle").innerText = "Editar Monitoramento";
    abrirModal();
}

// ==========================================
// MÓDULO 3: EXCLUSÃO
// ==========================================
function deletarRegistro(id) {
    // Módulo 3: Confirmação via confirm()
    if (confirm("Tem certeza de que deseja excluir este registro de monitoramento?")) {
        let lista = obterDados();
        lista = lista.filter(item => item.id !== id);
        salvarDados(lista);
        renderizarLista();
    }
}

// ==========================================
// UTILS E EVENT LISTENERS (MÓDULO 2)
// ==========================================
function abrirModal() {
    document.getElementById("planModal")?.classList.add("show");
}

function fecharModal(event) {
    if (!event || event.target.id === "planModal" || event.target.classList.contains("modal-close")) {
        document.getElementById("planModal")?.classList.remove("show");
    }
}

function showSection(sectionId) {
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId)?.classList.add("active");
}

// Módulo 2: Atribuição de ouvintes via addEventListener ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    // Renderiza a lista do localStorage
    renderizarLista();

    // Event listeners dos Filtros e Ordenação (Módulo 4)
    document.getElementById("filtroStatus")?.addEventListener("change", renderizarLista);
    document.getElementById("filtroPrioridade")?.addEventListener("change", renderizarLista);
    document.getElementById("ordemData")?.addEventListener("change", renderizarLista);

    // Event listener do Formulário (Módulo 2)
    document.getElementById("crudForm")?.addEventListener("submit", salvarRegistro);
});