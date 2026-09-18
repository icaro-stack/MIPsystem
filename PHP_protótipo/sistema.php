<?php
// Proteção de Acesso: O PHP obriga a fazer login primeiro!
session_start();
if (!isset($_SESSION['logado']) || $_SESSION['logado'] !== true) {
    header("Location: index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MIPsystem - Plataforma</title>
    <!-- CSS Externo -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">MIP<span>system</span></div>
        <nav>
            <a href="#" onclick="showSection('view-agronomos'); return false;">Agrônomos</a>
            <a href="#" onclick="showSection('view-chat'); return false;">Conversas</a>
            <a href="index.html" class="btn-profile" style="background: #c0392b;">Sair do Sistema</a>
        </nav>
    </header>

    <main class="container">
        <!-- SEÇÃO AGRÔNOMOS -->
        <section id="view-agronomos" class="view-section active">
            <div class="page-header">
                <span class="section-label">Bem-vindo, <?php echo htmlspecialchars($_SESSION['nome_usuario']); ?>!</span>
                <h1>Encontre seu Engenheiro Agrônomo</h1>
            </div>
            
            <div class="search-panel">
                <div class="search-bar">
                    <span>🔎</span>
                    <input type="text" id="searchInput" placeholder="Buscar por nome..." oninput="filtrarAgronomos()">
                </div>
            </div>
            
            <div id="agronomosGrid" class="agronomos-grid"></div>
            <div id="noResults" class="no-results hidden">Nenhum profissional encontrado</div>
        </section>

        <!-- SEÇÃO DE CHAT -->
        <section id="view-chat" class="view-section">
            <div class="chat-container">
                <div class="chat-header">
                    <strong>Atendimento MIPsystem</strong>
                </div>
                <div id="chatMessages" class="chat-messages">
                    <div class="message received">Olá! Como posso ajudar com sua produção?</div>
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Digite sua mensagem...">
                    <button onclick="enviarMensagem()">Enviar</button>
                </div>
            </div>
        </section>
    </main>

    <!-- Modal de Plano -->
    <div id="planModal" class="modal-overlay" onclick="fecharModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="fecharModal()">×</button>
            <h2>Solicitar Plano</h2>
            <p>Profissional selecionado: <strong id="modalAgronomoNome">-</strong></p>
            <form onsubmit="enviarSolicitacaoPlano(event)">
                <div class="form-group"><label>Nome da fazenda</label><input type="text" id="planoFazenda" required></div>
                <button type="submit" class="auth-submit">Enviar solicitação</button>
            </form>
        </div>
    </div>

    <!-- JS Externo -->
    <script src="script.js"></script>
</body>
</html>