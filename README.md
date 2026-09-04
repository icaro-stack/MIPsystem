# MIPsystem
# 🌿 MIPsystem - Protótipo Front-end

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green)
![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3-blue)

## 📌 Sobre o Projeto
O **MIPsystem** (Plataforma Inteligente para Monitoramento e Otimização de Infraestruturas Sustentáveis) é um Sistema Inteligente de Apoio à Decisão (SaaS) voltado para a vigilância contínua e o manejo inteligente de pragas agrícolas. 

Este repositório contém os artefatos de **Programação para Web I**, referentes à prototipagem das telas do sistema utilizando HTML5 e CSS3 puros. A interface foi construída com foco na usabilidade de agricultores e engenheiros agrônomos, viabilizando a conexão em nuvem entre o campo e os especialistas.

## 🚀 Tecnologias e Conceitos Aplicados
As telas foram desenvolvidas aplicando os conceitos modernos de arquitetura CSS vistos em aula:
- **Mobile-First:** Aprimoramento progressivo (`min-width`) para garantir o funcionamento em dispositivos móveis no campo.
- **Modelo de Caixa (Box Model):** Reset global com `box-sizing: border-box`.
- **Flexbox (1D):** Utilizado em alinhamentos unidimensionais, como a Tela de Login e a Navbar/Sidebar.
- **CSS Grid (2D):** Empregado na estruturação do formulário de vigilância (Dashboard) para melhor distribuição de colunas em telas maiores.
- **Design Tokens:** Uso de Variáveis CSS (`:root`) para padronizar cores e uma escala de espaçamento baseada em 4px, eliminando *magic numbers*.

## 📂 Estrutura de Arquivos
- 📄 `index.html` - Tela de Login e Autenticação (verificação de status financeiro e perfis).
- 📄 `dashboard.html` - Tela de Vigilância e Registro de Praga (Dashboard principal do produtor para envio de fotos e dados).
- 🎨 `styles.css` - Folha de estilos única e modularizada contendo o reset, tokens e media queries.
