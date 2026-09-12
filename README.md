# MIPsystem

## Integrantes

Ícaro Bantim Piazentim - 117993 Gabriel Pimenta - 117507 Pietro Silva - 119462 Matheus Domene - 119129 Guilherme Caetano - 118533

## 🌿 MIPsystem - Protótipo Front-end

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-4c1?style=flat-square) ![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3%20%7C%20JavaScript-007ec6?style=flat-square)

### 📌 Sobre o Projeto

O **MIPsystem** (Plataforma Inteligente para Monitoramento e Otimização de Infraestruturas Sustentáveis) é um Sistema Inteligente de Apoio à Decisão (SaaS) voltado para a vigilância contínua e o manejo inteligente de pragas agrícolas.

Este repositório contém os artefatos de **Programação para Web I**, referentes à prototipagem das telas do sistema utilizando HTML5, CSS3 puros e JavaScript Vanilla. A interface foi construída com foco na usabilidade de agricultores e engenheiros agrônomos, viabilizando a conexão em nuvem entre o campo e os especialistas através de funcionalidades interativas e dinâmicas.

### 🚀 Tecnologias e Conceitos Aplicados

As telas foram desenvolvidas aplicando os conceitos modernos de arquitetura CSS e manipulação de DOM vistos em aula:

* **Mobile-First**: Aprimoramento progressivo (`min-width`) para garantir o funcionamento em dispositivos móveis no campo.
* **Modelo de Caixa (Box Model)**: Reset global com `box-sizing: border-box`.
* **Flexbox (1D)**: Utilizado em alinhamentos unidimensionais, como a Tela de Login e a Navbar/Sidebar.
* **CSS Grid (2D)**: Empregado na estruturação do formulário de vigilância (Dashboard) para melhor distribuição de colunas em telas maiores.
* **Design Tokens**: Uso de Variáveis CSS (`:root`) para padronizar cores e uma escala de espaçamento baseada em 4px, eliminando *magic numbers*.
* **Manipulação do DOM**: Criação e renderização de novos componentes na tela em tempo real (como a janela de chat e o modal de planos) utilizando `createElement` e `innerHTML`.
* **Event Listeners**: Interceptação de ações do usuário (como `click` e `keyup`) para acionar o sistema de busca em tempo real e a interatividade dos botões, utilizando `preventDefault` para evitar o recarregamento da página.
* **Injeção de Estilos Dinâmicos**: Inserção de regras CSS específicas diretamente via JavaScript para os componentes gerados dinamicamente (Modais e Chat flutuante), sem poluir o arquivo principal.
* **Filtros e Laços de Repetição**: Uso de métodos de array e strings (`forEach`, `toLowerCase`, `includes`) para varrer os elementos na tela e criar a funcionalidade de "Live Search" e o filtro por especialidades (*badges*).

