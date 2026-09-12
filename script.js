document.addEventListener('DOMContentLoaded', function() {
    
    // INJEÇÃO DE ESTILOS PARA O CHAT E MODAL (Sem precisar alterar o style.css)
    const estilosDinamicos = document.createElement('style');
    estilosDinamicos.innerHTML = `
        /* Estilos do Modal de Planos */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 450px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .modal-content h2 { color: #1b4332; margin-bottom: 1rem; }
        .modal-content select, .modal-content button { width: 100%; padding: 10px; margin-top: 10px; border-radius: 5px; }
        .btn-confirmar { background: #1b4332; color: white; border: none; font-weight: bold; cursor: pointer; }
        .btn-cancelar { background: #ccc; border: none; cursor: pointer; }
        
        /* Estilos do Chat Flutuante */
        .chat-box { position: fixed; bottom: 20px; right: 20px; width: 320px; background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; z-index: 1000; overflow: hidden; }
        .chat-header { background: #1b4332; color: white; padding: 12px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
        .chat-messages { height: 250px; padding: 10px; overflow-y: auto; background: #f4f7f6; display: flex; flex-direction: column; gap: 8px; }
        .chat-msg { background: #e9ecef; padding: 8px; border-radius: 5px; font-size: 0.9rem; align-self: flex-start; max-width: 80%; }
        .chat-msg.minha { background: #d8f3dc; align-self: flex-end; }
        .chat-input { display: flex; border-top: 1px solid #ccc; }
        .chat-input input { flex: 1; border: none; padding: 12px; outline: none; }
        .chat-input button { background: #52b788; color: white; border: none; padding: 0 15px; cursor: pointer; font-weight: bold; }
        .close-btn { cursor: pointer; font-size: 1.2rem; }
    `;
    document.head.appendChild(estilosDinamicos);

    // 1. SISTEMA DE BUSCA E FILTROS
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const cards = document.querySelectorAll('.card-agronomo');
    const searchSection = document.querySelector('.search-section');

    const contador = document.createElement('p');
    contador.style.marginTop = '15px';
    contador.style.fontWeight = 'bold';
    contador.style.color = '#52b788';
    searchSection.appendChild(contador);

    function buscarAgronomos() {
        const termoBusca = searchInput.value.toLowerCase().trim();
        let visiveis = 0;

        cards.forEach(card => {
            const textoCard = card.innerText.toLowerCase();
            if (textoCard.includes(termoBusca)) {
                card.style.display = 'flex';
                visiveis++;
            } else {
                card.style.display = 'none';
            }
        });
        contador.innerText = termoBusca === '' ? '' : `${visiveis} especialista(s) encontrado(s).`;
    }

    searchButton.addEventListener('click', buscarAgronomos);
    searchInput.addEventListener('keyup', buscarAgronomos);

    document.querySelectorAll('.badge').forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', function() {
            searchInput.value = this.innerText;
            buscarAgronomos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 2. INTERFACE REAL DE CHAT
    document.querySelectorAll('.btn-chat').forEach(botao => {
        botao.addEventListener('click', function(evento) {
            evento.preventDefault();
            
            // Remove chat anterior se existir
            const chatExistente = document.querySelector('.chat-box');
            if(chatExistente) chatExistente.remove();

            // Pega o nome do agrônomo do card
            const nomeAgronomo = this.closest('.card-agronomo').querySelector('h3').innerText;

            // Constrói a interface do chat
            const chatBox = document.createElement('div');
            chatBox.className = 'chat-box';
            chatBox.innerHTML = `
                <div class="chat-header">
                    <span>${nomeAgronomo}</span>
                    <span class="close-btn" onclick="this.closest('.chat-box').remove()">×</span>
                </div>
                <div class="chat-messages">
                    <div class="chat-msg">Olá! Sou o ${nomeAgronomo}. Como posso ajudar no manejo da sua lavoura hoje?</div>
                </div>
                <form class="chat-input">
                    <input type="text" placeholder="Digite sua mensagem..." required>
                    <button type="submit">Enviar</button>
                </form>
            `;
            document.body.appendChild(chatBox);

            // Funcionalidade de enviar mensagem no chat
            const formChat = chatBox.querySelector('form');
            formChat.addEventListener('submit', function(e) {
                e.preventDefault();
                const inputMsg = this.querySelector('input');
                const mensagensContainer = chatBox.querySelector('.chat-messages');
                
                // Adiciona mensagem do usuário
                mensagensContainer.innerHTML += `<div class="chat-msg minha">${inputMsg.value}</div>`;
                inputMsg.value = '';
                mensagensContainer.scrollTop = mensagensContainer.scrollHeight;

                // Resposta automática do agrônomo (mock de backend)
                setTimeout(() => {
                    mensagensContainer.innerHTML += `<div class="chat-msg">Recebi sua foto/mensagem. Vou analisar a ocorrência e retorno em breve.</div>`;
                    mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
                }, 1000);
            });
        });
    });

    // 3. INTERFACE REAL DE CONTRATAÇÃO DE PLANO (SaaS MIPsystem)
    document.querySelectorAll('.btn-plan').forEach(botao => {
        botao.addEventListener('click', function(evento) {
            evento.preventDefault();
            
            const modalExistente = document.querySelector('.modal-overlay');
            if(modalExistente) modalExistente.remove();

            const nomeAgronomo = this.closest('.card-agronomo').querySelector('h3').innerText;

            // Constrói o Modal com os planos do MIPsystem
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.innerHTML = `
                <div class="modal-content">
                    <h2>Contratar: ${nomeAgronomo}</h2>
                    <p>Selecione o plano de assinatura SaaS de vigilância para sua propriedade:</p>
                    
                    <select id="plano-selecionado">
                        <option value="basico">Plano Básico (SLA 48h) - R$ 299/mês</option>
                        <option value="profissional">Plano Profissional (SLA 24h) - R$ 599/mês</option>
                        <option value="corporativo">Plano Corporativo (SLA 6h + Gestão de Estoque) - Sob Consulta</option>
                    </select>

                    <button class="btn-confirmar">Confirmar Assinatura</button>
                    <button class="btn-cancelar" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                </div>
            `;
            document.body.appendChild(modalOverlay);

            // Ação de confirmar contrato
            const btnConfirmar = modalOverlay.querySelector('.btn-confirmar');
            btnConfirmar.addEventListener('click', function() {
                const plano = modalOverlay.querySelector('#plano-selecionado').value;
                this.innerText = 'Processando Pagamento...';
                this.style.backgroundColor = '#6c757d';
                
                // Simula o tempo de requisição com o backend/banco de dados
                setTimeout(() => {
                    modalOverlay.innerHTML = `
                        <div class="modal-content" style="text-align: center;">
                            <h2 style="color: #52b788;">Assinatura Ativada! ✓</h2>
                            <p>Sua propriedade agora está coberta. O ${nomeAgronomo} já foi notificado.</p>
                            <button class="btn-confirmar" onclick="this.closest('.modal-overlay').remove()">Fechar</button>
                        </div>
                    `;
                }, 1500);
            });
        });
    });
});