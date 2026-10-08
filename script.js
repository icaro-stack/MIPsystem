/* =====================================================
   MIPSYSTEM - JAVASCRIPT COMPLETO COM AUTENTICAÇÃO E PERSISTÊNCIA
===================================================== */

/* =====================================================
   DADOS DEMONSTRATIVOS (AGRÔNOMOS)
===================================================== */
const agronomos = [
    { id: 1, nome: "Carlos Henrique", estado: "SP", estadoNome: "São Paulo", crea: "CREA-SP 123456", especialidade: "Soja e Milho", descricao: "Engenheiro agrônomo especializado em produção de soja e milho, com atuação em manejo de culturas." },
    { id: 2, nome: "Mariana Oliveira", estado: "MG", estadoNome: "Minas Gerais", crea: "CREA-MG 234567", especialidade: "Café", descricao: "Profissional especializada em cafeicultura, com experiência em manejo de lavouras e produtividade." },
    { id: 3, nome: "Rafael Santos", estado: "PR", estadoNome: "Paraná", crea: "CREA-PR 345678", especialidade: "Soja e Trigo", descricao: "Engenheiro agrônomo com atuação em soja e trigo, realizando acompanhamento técnico e orientação." },
    { id: 4, nome: "Juliana Costa", estado: "MT", estadoNome: "Mato Grosso", crea: "CREA-MT 456789", especialidade: "Algodão", descricao: "Especialista em produção de algodão, com foco em manejo agrícola e acompanhamento de lavouras." },
    { id: 5, nome: "Lucas Ferreira", estado: "GO", estadoNome: "Goiás", crea: "CREA-GO 567890", especialidade: "Milho", descricao: "Engenheiro agrônomo especializado na cultura do milho, oferecendo acompanhamento técnico." },
    { id: 6, nome: "Ana Beatriz", estado: "BA", estadoNome: "Bahia", crea: "CREA-BA 678901", especialidade: "Fruticultura", descricao: "Profissional especializada em fruticultura, com atuação em planejamento e manejo." }
];

/* =====================================================
   VARIÁVEIS DE ESTADO
===================================================== */
let tipoUsuario = "produtor";
let modoAuth = "login";
let agronomoSelecionado = null;
let usuarioAtual = null;

/* =====================================================
   CONTROLE DE ACESSO E NAVEGAÇÃO
===================================================== */
function showSection(sectionId) {
    // Bloqueia o acesso a qualquer seção que não seja a tela de login se o usuário não estiver autenticado
    if (!usuarioAtual && sectionId !== "view-auth") {
        alert("Acesso restrito! Por favor, faça login ou crie uma conta para utilizar a plataforma.");
        sectionId = "view-auth";
    }

    document.body.classList.remove("show-all-sections");
    const sections = document.querySelectorAll(".view-section");
    sections.forEach(section => section.classList.remove("active"));

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add("active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function atualizarInterfaceAutenticada(autenticado) {
    const navLinks = document.querySelectorAll(".navbar nav a");
    
    navLinks.forEach(link => {
        const isAuthBtn = link.classList.contains("btn-profile");
        if (!isAuthBtn) {
            if (autenticado) {
                link.classList.remove("disabled");
            } else {
                link.classList.add("disabled");
            }
        }
    });

    const btnProfile = document.querySelector(".btn-profile");
    if (btnProfile) {
        if (autenticado && usuarioAtual) {
            const primeiroNome = usuarioAtual.nome ? usuarioAtual.nome.split(" ")[0] : "Perfil";
            btnProfile.textContent = `👤 ${primeiroNome}`;
            btnProfile.setAttribute("onclick", "showSection('view-user-profile'); return false;");
        } else {
            btnProfile.textContent = "Perfil / Entrar";
            btnProfile.setAttribute("onclick", "showSection('view-auth'); return false;");
        }
    }
}

/* =====================================================
   VITRINE DE AGRÔNOMOS E FILTROS
===================================================== */
function obterIniciais(nome) {
    if (!nome) return "US";
    return nome.split(" ").slice(0, 2).map(n => n.charAt(0)).join("").toUpperCase();
}

function renderAgronomos(lista = agronomos) {
    const grid = document.getElementById("agronomosGrid");
    const noResults = document.getElementById("noResults");
    if (!grid) return;

    grid.innerHTML = "";
    if (lista.length === 0) {
        noResults.classList.remove("hidden");
        return;
    }
    noResults.classList.add("hidden");

    lista.forEach(agronomo => {
        const card = document.createElement("div");
        card.className = "agronomo-card";
        card.innerHTML = `
            <div class="card-top">
                <div class="card-avatar">${obterIniciais(agronomo.nome)}</div>
                <div>
                    <h3 class="card-name">${agronomo.nome}</h3>
                    <p class="card-specialty">${agronomo.especialidade}</p>
                </div>
            </div>
            <div class="card-info">
                <p>📍 ${agronomo.estadoNome} - ${agronomo.estado}</p>
                <p>📋 ${agronomo.crea}</p>
            </div>
            <div class="card-actions">
                <button class="btn-view" onclick="verPerfil(${agronomo.id})">Ver Perfil</button>
                <button class="btn-plan" onclick="abrirPlano(${agronomo.id})">Solicitar Plano</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrarAgronomos() {
    const busca = document.getElementById("searchInput").value.toLowerCase().trim();
    const estado = document.getElementById("stateFilter").value;
    const especialidade = document.getElementById("specialtyFilter").value;

    const resultado = agronomos.filter(a => {
        const correspondeBusca = a.nome.toLowerCase().includes(busca) || a.especialidade.toLowerCase().includes(busca);
        const correspondeEstado = !estado || a.estado === estado;
        const correspondeEspecialidade = !especialidade || a.especialidade === especialidade;
        return correspondeBusca && correspondeEstado && correspondeEspecialidade;
    });

    renderAgronomos(resultado);
}

function verPerfil(id) {
    const agronomo = agronomos.find(item => item.id === id);
    if (!agronomo) return;

    agronomoSelecionado = agronomo;
    document.getElementById("profileName").textContent = agronomo.nome;
    document.getElementById("profileSpecialty").textContent = agronomo.especialidade;
    document.getElementById("profileSpecialtyDetail").textContent = agronomo.especialidade;
    document.getElementById("profileCrea").textContent = agronomo.crea;
    document.getElementById("profileCreaDetail").textContent = agronomo.crea;
    document.getElementById("profileState").textContent = `${agronomo.estadoNome} - ${agronomo.estado}`;
    document.getElementById("profileDescription").textContent = agronomo.descricao;
    document.getElementById("profileAvatar").textContent = obterIniciais(agronomo.nome);

    showSection("view-profile");
}

/* =====================================================
   CHAT
===================================================== */
function abrirChatDoAgronomo() {
    if (!agronomoSelecionado) return;
    const titulo = document.getElementById("chatAgronomoNome");
    if (titulo) titulo.textContent = agronomoSelecionado.nome;
    showSection("view-chat");
}

function enviarMensagem() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");
    if (!input || !messages) return;

    const texto = input.value.trim();
    if (!texto) return;

    const mensagem = document.createElement("div");
    mensagem.className = "message sent";
    mensagem.textContent = texto;
    messages.appendChild(mensagem);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        const resposta = document.createElement("div");
        resposta.className = "message received";
        resposta.textContent = "Obrigado pela mensagem! O engenheiro agrônomo responderá em breve.";
        messages.appendChild(resposta);
        messages.scrollTop = messages.scrollHeight;
    }, 800);
}

/* =====================================================
   MODAL SOLICITAÇÃO RÁPIDA DE PLANO
===================================================== */
function abrirPlano(id) {
    const agronomo = agronomos.find(item => item.id === id);
    if (!agronomo) return;
    agronomoSelecionado = agronomo;
    document.getElementById("modalAgronomoNome").textContent = agronomo.nome;
    document.getElementById("planModal").classList.add("show");
}

function abrirPlanoDoAgronomo() {
    if (agronomoSelecionado) abrirPlano(agronomoSelecionado.id);
}

function fecharModal(event) {
    if (event && event.target !== document.getElementById("planModal")) return;
    document.getElementById("planModal").classList.remove("show");
}

function enviarSolicitacaoPlano(event) {
    event.preventDefault();
    const fazenda = document.getElementById("planoFazenda").value;
    alert(`Solicitação enviada com sucesso!\n\nAgrônomo: ${agronomoSelecionado.nome}\nFazenda: ${fazenda}`);
    fecharModal();
    event.target.reset();
}

/* =====================================================
   AUTENTICAÇÃO & PERSISTÊNCIA NO LOCALSTORAGE
===================================================== */
function mudarModoAuth(modo) {
    modoAuth = modo;
    const loginForm = document.getElementById("loginForm");
    const cadastroForm = document.getElementById("cadastroForm");
    const btnLogin = document.getElementById("btnLoginMode");
    const btnCadastro = document.getElementById("btnCadastroMode");

    if (modo === "login") {
        loginForm.classList.remove("hidden");
        cadastroForm.classList.add("hidden");
        btnLogin.classList.add("active");
        btnCadastro.classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        cadastroForm.classList.remove("hidden");
        btnLogin.classList.remove("active");
        btnCadastro.classList.add("active");
    }
}

function selecionarTipo(tipo) {
    tipoUsuario = tipo;
    document.querySelectorAll(".btn-type").forEach(btn => btn.classList.remove("active"));
    const sel = document.querySelector(`[data-type="${tipo}"]`);
    if (sel) sel.classList.add("active");
    
    const agronomoFields = document.getElementById("agronomoFields");
    if (agronomoFields) {
        if (tipo === "agronomo") agronomoFields.classList.remove("hidden");
        else agronomoFields.classList.add("hidden");
    }
}

function realizarLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const nomePadrao = email.split("@")[0];

    usuarioAtual = {
        nome: nomePadrao.charAt(0).toUpperCase() + nomePadrao.slice(1),
        email: email,
        tipo: tipoUsuario
    };

    // Grava perfil no localStorage
    localStorage.setItem("mipsystem_user", JSON.stringify(usuarioAtual));

    atualizarPerfilUsuario();
    atualizarInterfaceAutenticada(true);
    alert("Login realizado com sucesso!");
    showSection("view-agronomos");
}

function realizarCadastro(event) {
    event.preventDefault();
    const nome = document.getElementById("cadNome").value;
    const email = document.getElementById("cadEmail").value;

    usuarioAtual = {
        nome: nome,
        email: email,
        tipo: tipoUsuario
    };

    // Grava perfil no localStorage
    localStorage.setItem("mipsystem_user", JSON.stringify(usuarioAtual));

    atualizarPerfilUsuario();
    atualizarInterfaceAutenticada(true);
    alert("Cadastro realizado com sucesso!");
    showSection("view-agronomos");
}

function atualizarPerfilUsuario() {
    if (!usuarioAtual) return;
    const tipoTexto = usuarioAtual.tipo === "agronomo" ? "Engenheiro Agrônomo" : "Produtor Rural";
    
    const userProfileName = document.getElementById("userProfileName");
    const userProfileType = document.getElementById("userProfileType");
    const userInfoName = document.getElementById("userInfoName");
    const userInfoEmail = document.getElementById("userInfoEmail");
    const userInfoType = document.getElementById("userInfoType");
    const userAvatar = document.getElementById("userAvatar");

    if (userProfileName) userProfileName.textContent = usuarioAtual.nome;
    if (userProfileType) userProfileType.textContent = tipoTexto;
    if (userInfoName) userInfoName.textContent = usuarioAtual.nome;
    if (userInfoEmail) userInfoEmail.textContent = usuarioAtual.email;
    if (userInfoType) userInfoType.textContent = tipoTexto;
    if (userAvatar) userAvatar.textContent = obterIniciais(usuarioAtual.nome);
}

function logout() {
    usuarioAtual = null;
    localStorage.removeItem("mipsystem_user");
    atualizarInterfaceAutenticada(false);
    alert("Você saiu da sua conta.");
    showSection("view-auth");
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
    button.textContent = input.type === "password" ? "👁" : "🙈";
}

function mascaraCPF(input) {
    let v = input.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
}

function mascaraTelefone(input) {
    let v = input.value.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 10) v = v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    else v = v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    input.value = v;
}

/* =====================================================
   1. CRUD FAZENDAS
===================================================== */
let fazendas = [
    { id: 1, nome: "Fazenda Santa Cruz", municipio: "Ribeirão Preto", uf: "SP", area: 250.50, status: "ATIVA" },
    { id: 2, nome: "Sítio das Águas", municipio: "Uberlândia", uf: "MG", area: 85.00, status: "ATIVA" }
];
let fazendaEditandoId = null;

function renderFazendas() {
    const tbody = document.getElementById("tabelaFazendasBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    if (fazendas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">Nenhuma fazenda cadastrada.</td></tr>`;
        return;
    }

    fazendas.forEach(f => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${f.id}</td>
            <td><strong>${f.nome}</strong></td>
            <td>${f.municipio} - ${f.uf}</td>
            <td>${f.area} ha</td>
            <td><span class="status-badge status-${f.status.toLowerCase()}">${f.status}</span></td>
            <td class="crud-actions">
                <button class="btn-edit" onclick="editarFazenda(${f.id})">Editar</button>
                <button class="btn-delete" onclick="excluirFazenda(${f.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalFazenda() {
    fazendaEditandoId = null;
    document.getElementById("tituloModalFazenda").textContent = "Nova Fazenda";
    document.getElementById("fazendaId").value = "";
    document.getElementById("fazendaNome").value = "";
    document.getElementById("fazendaMunicipio").value = "";
    document.getElementById("fazendaUf").value = "";
    document.getElementById("fazendaArea").value = "";
    document.getElementById("fazendaStatus").value = "ATIVA";
    document.getElementById("modalCrudFazenda").classList.add("show");
}

function fecharModalFazenda(e) {
    if (e && e.target !== document.getElementById("modalCrudFazenda")) return;
    document.getElementById("modalCrudFazenda").classList.remove("show");
}

function salvarFazenda(e) {
    e.preventDefault();
    const nome = document.getElementById("fazendaNome").value;
    const municipio = document.getElementById("fazendaMunicipio").value;
    const uf = document.getElementById("fazendaUf").value.toUpperCase();
    const area = parseFloat(document.getElementById("fazendaArea").value);
    const status = document.getElementById("fazendaStatus").value;

    if (fazendaEditandoId) {
        const index = fazendas.findIndex(f => f.id === fazendaEditandoId);
        fazendas[index] = { id: fazendaEditandoId, nome, municipio, uf, area, status };
        alert("Fazenda atualizada!");
    } else {
        const novoId = fazendas.length > 0 ? Math.max(...fazendas.map(f => f.id)) + 1 : 1;
        fazendas.push({ id: novoId, nome, municipio, uf, area, status });
        alert("Fazenda cadastrada!");
    }
    fecharModalFazenda();
    renderFazendas();
}

function editarFazenda(id) {
    const f = fazendas.find(item => item.id === id);
    if (!f) return;
    fazendaEditandoId = f.id;
    document.getElementById("tituloModalFazenda").textContent = "Editar Fazenda";
    document.getElementById("fazendaNome").value = f.nome;
    document.getElementById("fazendaMunicipio").value = f.municipio;
    document.getElementById("fazendaUf").value = f.uf;
    document.getElementById("fazendaArea").value = f.area;
    document.getElementById("fazendaStatus").value = f.status;
    document.getElementById("modalCrudFazenda").classList.add("show");
}

function excluirFazenda(id) {
    if (confirm("Deseja excluir esta fazenda?")) {
        fazendas = fazendas.filter(f => f.id !== id);
        renderFazendas();
    }
}

/* =====================================================
   2. CRUD PLANOS DE MANEJO
===================================================== */
let planos = [
    { id: 1, fazenda: "Fazenda Santa Cruz", agronomo: "Carlos Henrique", valor: 4500.00, visitas: 6, status: "ATIVO" },
    { id: 2, fazenda: "Sítio das Águas", agronomo: "Mariana Oliveira", valor: 2800.00, visitas: 4, status: "NEGOCIACAO" }
];
let planoEditandoId = null;

function renderPlanos() {
    const tbody = document.getElementById("tabelaPlanosBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (planos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">Nenhum plano cadastrado.</td></tr>`;
        return;
    }

    planos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${p.id}</td>
            <td><strong>${p.fazenda}</strong></td>
            <td>${p.agronomo}</td>
            <td>R$ ${p.valor.toFixed(2)}</td>
            <td>${p.visitas} visitas</td>
            <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
            <td class="crud-actions">
                <button class="btn-edit" onclick="editarPlano(${p.id})">Editar</button>
                <button class="btn-delete" onclick="excluirPlano(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalPlano() {
    planoEditandoId = null;
    document.getElementById("tituloModalPlano").textContent = "Novo Plano de Manejo";
    document.getElementById("planoNomeFazenda").value = "";
    document.getElementById("planoNomeAgronomo").value = "";
    document.getElementById("planoValor").value = "";
    document.getElementById("planoQtdVisitas").value = "";
    document.getElementById("planoStatus").value = "NEGOCIACAO";
    document.getElementById("modalCrudPlano").classList.add("show");
}

function fecharModalPlano(e) {
    if (e && e.target !== document.getElementById("modalCrudPlano")) return;
    document.getElementById("modalCrudPlano").classList.remove("show");
}

function salvarPlano(e) {
    e.preventDefault();
    const fazenda = document.getElementById("planoNomeFazenda").value;
    const agronomo = document.getElementById("planoNomeAgronomo").value;
    const valor = parseFloat(document.getElementById("planoValor").value);
    const visitas = parseInt(document.getElementById("planoQtdVisitas").value);
    const status = document.getElementById("planoStatus").value;

    if (planoEditandoId) {
        const idx = planos.findIndex(p => p.id === planoEditandoId);
        planos[idx] = { id: planoEditandoId, fazenda, agronomo, valor, visitas, status };
        alert("Plano atualizado!");
    } else {
        const novoId = planos.length > 0 ? Math.max(...planos.map(p => p.id)) + 1 : 1;
        planos.push({ id: novoId, fazenda, agronomo, valor, visitas, status });
        alert("Plano criado com sucesso!");
    }
    fecharModalPlano();
    renderPlanos();
}

function editarPlano(id) {
    const p = planos.find(item => item.id === id);
    if (!p) return;
    planoEditandoId = p.id;
    document.getElementById("tituloModalPlano").textContent = "Editar Plano de Manejo";
    document.getElementById("planoNomeFazenda").value = p.fazenda;
    document.getElementById("planoNomeAgronomo").value = p.agronomo;
    document.getElementById("planoValor").value = p.valor;
    document.getElementById("planoQtdVisitas").value = p.visitas;
    document.getElementById("planoStatus").value = p.status;
    document.getElementById("modalCrudPlano").classList.add("show");
}

function excluirPlano(id) {
    if (confirm("Tem certeza que deseja cancelar/excluir este plano?")) {
        planos = planos.filter(p => p.id !== id);
        renderPlanos();
    }
}

/* =====================================================
   3. CRUD VISITAS TÉCNICAS
===================================================== */
let visitas = [
    { id: 1, plano: "Fazenda Santa Cruz - Plano #1", data: "2024-11-10", diagnostico: "Manejo nutricional adequado. Presença leve de ácaro no talhão 2.", status: "REALIZADA" },
    { id: 2, plano: "Sítio das Águas - Plano #2", data: "2024-11-20", diagnostico: "Aguardando realização de visita preventiva.", status: "AGENDADA" }
];
let visitaEditandoId = null;

function renderVisitas() {
    const tbody = document.getElementById("tabelaVisitasBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (visitas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">Nenhuma visita agendada.</td></tr>`;
        return;
    }

    visitas.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${v.id}</td>
            <td><strong>${v.plano}</strong></td>
            <td>${v.data}</td>
            <td>${v.diagnostico || 'Sem diagnóstico'}</td>
            <td><span class="status-badge status-${v.status.toLowerCase()}">${v.status}</span></td>
            <td class="crud-actions">
                <button class="btn-edit" onclick="editarVisita(${v.id})">Editar</button>
                <button class="btn-delete" onclick="excluirVisita(${v.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalVisita() {
    visitaEditandoId = null;
    document.getElementById("tituloModalVisita").textContent = "Agendar Visita Técnica";
    document.getElementById("visitaPlano").value = "";
    document.getElementById("visitaData").value = "";
    document.getElementById("visitaDiagnostico").value = "";
    document.getElementById("visitaStatus").value = "AGENDADA";
    document.getElementById("modalCrudVisita").classList.add("show");
}

function fecharModalVisita(e) {
    if (e && e.target !== document.getElementById("modalCrudVisita")) return;
    document.getElementById("modalCrudVisita").classList.remove("show");
}

function salvarVisita(e) {
    e.preventDefault();
    const plano = document.getElementById("visitaPlano").value;
    const data = document.getElementById("visitaData").value;
    const diagnostico = document.getElementById("visitaDiagnostico").value;
    const status = document.getElementById("visitaStatus").value;

    if (visitaEditandoId) {
        const idx = visitas.findIndex(v => v.id === visitaEditandoId);
        visitas[idx] = { id: visitaEditandoId, plano, data, diagnostico, status };
        alert("Visita atualizada!");
    } else {
        const novoId = visitas.length > 0 ? Math.max(...visitas.map(v => v.id)) + 1 : 1;
        visitas.push({ id: novoId, plano, data, diagnostico, status });
        alert("Visita agendada!");
    }
    fecharModalVisita();
    renderVisitas();
}

function editarVisita(id) {
    const v = visitas.find(item => item.id === id);
    if (!v) return;
    visitaEditandoId = v.id;
    document.getElementById("tituloModalVisita").textContent = "Editar Visita Técnica";
    document.getElementById("visitaPlano").value = v.plano;
    document.getElementById("visitaData").value = v.data;
    document.getElementById("visitaDiagnostico").value = v.diagnostico;
    document.getElementById("visitaStatus").value = v.status;
    document.getElementById("modalCrudVisita").classList.add("show");
}

function excluirVisita(id) {
    if (confirm("Deseja cancelar/excluir esta visita?")) {
        visitas = visitas.filter(v => v.id !== id);
        renderVisitas();
    }
}

/* =====================================================
   4. CRUD OCORRÊNCIAS DA LAVOURA
===================================================== */
let ocorrencias = [
    { id: 1, fazenda: "Fazenda Santa Cruz", data: "2024-10-25", descricao: "Foco de ferrugem asiática identificado nas folhas inferiores.", status: "RESOLVIDA" },
    { id: 2, fazenda: "Sítio das Águas", data: "2024-11-02", descricao: "Manchas amareladas nas folhas de café.", status: "EM_ANALISE" }
];
let ocorrenciaEditandoId = null;

function renderOcorrencias() {
    const tbody = document.getElementById("tabelaOcorrenciasBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (ocorrencias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">Nenhuma ocorrência registrada.</td></tr>`;
        return;
    }

    ocorrencias.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${o.id}</td>
            <td><strong>${o.fazenda}</strong></td>
            <td>${o.data}</td>
            <td>${o.descricao}</td>
            <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
            <td class="crud-actions">
                <button class="btn-edit" onclick="editarOcorrencia(${o.id})">Editar</button>
                <button class="btn-delete" onclick="excluirOcorrencia(${o.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalOcorrencia() {
    ocorrenciaEditandoId = null;
    document.getElementById("tituloModalOcorrencia").textContent = "Registrar Ocorrência";
    document.getElementById("ocorrenciaFazenda").value = "";
    document.getElementById("ocorrenciaData").value = "";
    document.getElementById("ocorrenciaDescricao").value = "";
    document.getElementById("ocorrenciaStatus").value = "ABERTA";
    document.getElementById("modalCrudOcorrencia").classList.add("show");
}

function fecharModalOcorrencia(e) {
    if (e && e.target !== document.getElementById("modalCrudOcorrencia")) return;
    document.getElementById("modalCrudOcorrencia").classList.remove("show");
}

function salvarOcorrencia(e) {
    e.preventDefault();
    const fazenda = document.getElementById("ocorrenciaFazenda").value;
    const data = document.getElementById("ocorrenciaData").value;
    const descricao = document.getElementById("ocorrenciaDescricao").value;
    const status = document.getElementById("ocorrenciaStatus").value;

    if (ocorrenciaEditandoId) {
        const idx = ocorrencias.findIndex(o => o.id === ocorrenciaEditandoId);
        ocorrencias[idx] = { id: ocorrenciaEditandoId, fazenda, data, descricao, status };
        alert("Ocorrência atualizada!");
    } else {
        const novoId = ocorrencias.length > 0 ? Math.max(...ocorrencias.map(o => o.id)) + 1 : 1;
        ocorrencias.push({ id: novoId, fazenda, data, descricao, status });
        alert("Ocorrência registrada!");
    }
    fecharModalOcorrencia();
    renderOcorrencias();
}

function editarOcorrencia(id) {
    const o = ocorrencias.find(item => item.id === id);
    if (!o) return;
    ocorrenciaEditandoId = o.id;
    document.getElementById("tituloModalOcorrencia").textContent = "Editar Ocorrência";
    document.getElementById("ocorrenciaFazenda").value = o.fazenda;
    document.getElementById("ocorrenciaData").value = o.data;
    document.getElementById("ocorrenciaDescricao").value = o.descricao;
    document.getElementById("ocorrenciaStatus").value = o.status;
    document.getElementById("modalCrudOcorrencia").classList.add("show");
}

function excluirOcorrencia(id) {
    if (confirm("Deseja excluir esta ocorrência?")) {
        ocorrencias = ocorrencias.filter(o => o.id !== id);
        renderOcorrencias();
    }
}

/* =====================================================
   INICIALIZAÇÃO DA APLICAÇÃO
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    renderAgronomos();
    renderFazendas();
    renderPlanos();
    renderVisitas();
    renderOcorrencias();
    selecionarTipo("produtor");
    mudarModoAuth("login");

    // Verifica se existe perfil gravado no localStorage
    const usuarioSalvo = localStorage.getItem("mipsystem_user");

    if (usuarioSalvo) {
        try {
            usuarioAtual = JSON.parse(usuarioSalvo);
            atualizarPerfilUsuario();
            atualizarInterfaceAutenticada(true);
            showSection("view-agronomos");
        } catch (e) {
            localStorage.removeItem("mipsystem_user");
            atualizarInterfaceAutenticada(false);
            showSection("view-auth");
        }
    } else {
        atualizarInterfaceAutenticada(false);
        showSection("view-auth");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharModal();
        fecharModalFazenda();
        fecharModalPlano();
        fecharModalVisita();
        fecharModalOcorrencia();
    }
});
