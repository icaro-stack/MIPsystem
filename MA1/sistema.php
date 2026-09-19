<?php
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
    <title>MIPsystem - Painel de Monitoramento</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">MIP<span>system</span></div>
        <nav>
            <a href="#" onclick="showSection('view-dashboard'); return false;">Dashboard</a>
            <a href="index.html" class="btn-profile" style="background: #c0392b;">Sair</a>
        </nav>
    </header>

    <main class="container">
        <!-- MÓDULO 1: DASHBOARD DE MONITORAMENTO -->
        <section id="view-dashboard" class="view-section active">
            <div class="page-header">
                <span class="section-label">Bem-vindo, <?php echo htmlspecialchars($_SESSION['nome_usuario']); ?>!</span>
                <h1>Painel de Monitoramento de Pragas</h1>
            </div>
            
            <!-- MÓDULO 4: FILTROS E ORDENAÇÃO + BOTAO NOVO -->
            <div class="search-panel" style="align-items: center; justify-content: space-between;">
                <button class="auth-submit" style="width: auto; padding: 0 20px; margin: 0; height: 46px;" onclick="prepararNovoRegistro()">
                    + Novo Registar
                </button>

                <div class="filters">
                    <select id="filtroStatus">
                        <option value="todos">Todos os Status</option>
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                    </select>

                    <select id="filtroPrioridade">
                        <option value="todas">Todas Prioridades</option>
                        <option value="alta">Alta (Vermelho)</option>
                        <option value="media">Média (Amarelo)</option>
                        <option value="baixa">Baixa (Verde)</option>
                    </select>

                    <select id="ordemData">
                        <option value="recentes">Mais Recentes</option>
                        <option value="antigas">Mais Antigos</option>
                    </select>
                </div>
            </div>
            
            <!-- MÓDULO 1: LISTA / GRID -->
            <div id="agronomosGrid" class="agronomos-grid"></div>
            <div id="noResults" class="no-results hidden">Nenhum registro encontrado.</div>
        </section>
    </main>

    <!-- MÓDULO 2 & 3: MODAL DE ADICIONAR / EDITAR -->
    <div id="planModal" class="modal-overlay" onclick="fecharModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="fecharModal()">&times;</button>
            <h2 id="modalTitle">Novo Registar</h2>
            
            <form id="crudForm">
                <input type="hidden" id="regId">
                
                <div class="form-group">
                    <label>Praga / Ocorrência *</label>
                    <input type="text" id="regPraga" required placeholder="Ex: Lagarta-do-cartucho">
                </div>
                
                <div class="form-group">
                    <label>Talhão / Local *</label>
                    <input type="text" id="regTalhao" required placeholder="Ex: Talhão 02 - Milho">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Prioridade *</label>
                        <select id="regPrioridade" required>
                            <option value="alta">Alta</option>
                            <option value="media">Média</option>
                            <option value="baixa">Baixa</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Status *</label>
                        <select id="regStatus" required>
                            <option value="pendente">Pendente</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Data de Registro *</label>
                    <input type="date" id="regData" required>
                </div>

                <div class="form-group">
                    <label>Observação / Ação Recomendada</label>
                    <textarea id="regObs" rows="3" placeholder="Detalhes da amostragem ou defensivo aplicado..."></textarea>
                </div>

                <button type="submit" class="auth-submit">Salvar Registro</button>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>