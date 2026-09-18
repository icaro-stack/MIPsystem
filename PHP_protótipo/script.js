/* =====================================================
   MIPSYSTEM
   JAVASCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   DADOS DEMONSTRATIVOS
===================================================== */

const agronomos = [
    {
        id: 1,
        nome: "Carlos Henrique",
        estado: "SP",
        estadoNome: "São Paulo",
        crea: "CREA-SP 123456",
        especialidade: "Soja e Milho",
        descricao: "Engenheiro agrônomo especializado em produção de soja e milho, com atuação em manejo de culturas, acompanhamento de lavouras e planejamento agrícola."
    },
    {
        id: 2,
        nome: "Mariana Oliveira",
        estado: "MG",
        estadoNome: "Minas Gerais",
        crea: "CREA-MG 234567",
        especialidade: "Café",
        descricao: "Profissional especializada em cafeicultura, com experiência em manejo de lavouras, acompanhamento de produção e estratégias para melhoria da produtividade."
    },
    {
        id: 3,
        nome: "Rafael Santos",
        estado: "PR",
        estadoNome: "Paraná",
        crea: "CREA-PR 345678",
        especialidade: "Soja e Trigo",
        descricao: "Engenheiro agrônomo com atuação em soja e trigo, realizando acompanhamento técnico, manejo de culturas e orientação para produtores rurais."
    },
    {
        id: 4,
        nome: "Juliana Costa",
        estado: "MT",
        estadoNome: "Mato Grosso",
        crea: "CREA-MT 456789",
        especialidade: "Algodão",
        descricao: "Especialista em produção de algodão, com foco em manejo agrícola, acompanhamento de lavouras e planejamento das atividades da propriedade."
    },
    {
        id: 5,
        nome: "Lucas Ferreira",
        estado: "GO",
        estadoNome: "Goiás",
        crea: "CREA-GO 567890",
        especialidade: "Milho",
        descricao: "Engenheiro agrônomo especializado na cultura do milho, oferecendo acompanhamento técnico e orientação para aumento da produtividade."
    },
    {
        id: 6,
        nome: "Ana Beatriz",
        estado: "BA",
        estadoNome: "Bahia",
        crea: "CREA-BA 678901",
        especialidade: "Fruticultura",
        descricao: "Profissional especializada em fruticultura, com atuação em planejamento, manejo e acompanhamento técnico de propriedades rurais."
    }
];


/* =====================================================
   VARIÁVEIS
===================================================== */

let tipoUsuario = "produtor";
let modoAuth = "login";
let agronomoSelecionado = null;
let usuarioAtual = null;


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function showSection(sectionId) {
    document.body.classList.remove("show-all-sections");
    const sections = document.querySelectorAll(".view-section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function showAllSections() {
    document.body.classList.add("show-all-sections");
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   AGRÔNOMOS
===================================================== */

function obterIniciais(nome) {
    return nome
        .split(" ")
        .slice(0, 2)
        .map(nome => nome.charAt(0))
        .join("")
        .toUpperCase();
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
                <div class="card-avatar">
                    ${obterIniciais(agronomo.nome)}
                </div>
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


/* =====================================================
   FILTROS
===================================================== */

function filtrarAgronomos() {
    const busca = document.getElementById("searchInput").value.toLowerCase().trim();
    const estado = document.getElementById("stateFilter") ? document.getElementById("stateFilter").value : "";
    const especialidade = document.getElementById("specialtyFilter") ? document.getElementById("specialtyFilter").value : "";

    const resultado = agronomos.filter(agronomo => {
        const correspondeBusca = agronomo.nome.toLowerCase().includes(busca) || agronomo.especialidade.toLowerCase().includes(busca);
        const correspondeEstado = !estado || agronomo.estado === estado;
        const correspondeEspecialidade = !especialidade || agronomo.especialidade === especialidade;

        return correspondeBusca && correspondeEstado && correspondeEspecialidade;
    });

    renderAgronomos(resultado);
}


/* =====================================================
   PERFIL DO AGRÔNOMO
===================================================== */

function verPerfil(id) {
    const agronomo = agronomos.find(item => item.id === id);

    if (!agronomo) {
        alert("Agrônomo não encontrado.");
        return;
    }

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

    const nome = agronomoSelecionado.nome;
    const titulo = document.getElementById("chatAgronomoNome");

    if (titulo) {
        titulo.textContent = nome;
    }

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
        resposta.textContent = "Obrigado pela mensagem! O engenheiro agrônomo poderá responder sua solicitação em breve.";
        messages.appendChild(resposta);
        messages.scrollTop = messages.scrollHeight;
    }, 800);
}


/* =====================================================
   PLANO
===================================================== */

function abrirPlano(id) {
    const agronomo = agronomos.find(item => item.id === id);

    if (!agronomo) {
        alert("Agrônomo não encontrado.");
        return;
    }

    agronomoSelecionado = agronomo;
    document.getElementById("modalAgronomoNome").textContent = agronomo.nome;
    document.getElementById("planModal").classList.add("show");
}

function abrirPlanoDoAgronomo() {
    if (!agronomoSelecionado) return;
    abrirPlano(agronomoSelecionado.id);
}

function fecharModal(event) {
    if (event && event.target !== document.getElementById("planModal")) return;
    document.getElementById("planModal").classList.remove("show");
}

function enviarSolicitacaoPlano(event) {
    event.preventDefault();
    const fazenda = document.getElementById("planoFazenda").value;

    if (!agronomoSelecionado) return;

    alert(
        `Solicitação enviada com sucesso!\n\n` +
        `Agrônomo: ${agronomoSelecionado.nome}\n` +
        `Fazenda: ${fazenda}\n\n` +
        `Esta é uma demonstração do MIPsystem. A solicitação será integrada ao banco de dados posteriormente.`
    );

    fecharModal();
    event.target.reset();
}


/* =====================================================
   LOGIN / CADASTRO (Controles de Interface)
===================================================== */

function mudarModoAuth(modo) {
    modoAuth = modo;
    const loginForm = document.getElementById("loginForm");
    const cadastroForm = document.getElementById("cadastroForm");
    const btnLogin = document.getElementById("btnLoginMode");
    const btnCadastro = document.getElementById("btnCadastroMode");
    const titulo = document.getElementById("authTitle");
    const subtitulo = document.getElementById("authSubtitle");

    if (!loginForm || !cadastroForm) return;

    if (modo === "login") {
        loginForm.classList.remove("hidden");
        cadastroForm.classList.add("hidden");
        if(btnLogin) btnLogin.classList.add("active");
        if(btnCadastro) btnCadastro.classList.remove("active");
        if(titulo) titulo.textContent = "Entrar no MIPsystem";
        if(subtitulo) subtitulo.textContent = "Acesse sua conta para continuar.";
    } else {
        loginForm.classList.add("hidden");
        cadastroForm.classList.remove("hidden");
        if(btnLogin) btnLogin.classList.remove("active");
        if(btnCadastro) btnCadastro.classList.add("active");
        if(titulo) titulo.textContent = "Criar conta";
        if(subtitulo) subtitulo.textContent = "Cadastre-se gratuitamente no MIPsystem.";
    }
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁";
    }
}


/* =====================================================
   INICIALIZAÇÃO DO SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Apenas renderiza os agrónomos e garante que não tenta abrir abas inexistentes
    if(document.getElementById("agronomosGrid")) {
        renderAgronomos();
    }
});


/* =====================================================
   FECHAR MODAL COM ESC
===================================================== */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharModal();
    }
});