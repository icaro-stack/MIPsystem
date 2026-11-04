CREATE DATABASE IF NOT EXISTS sistema_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_agricola;

-- =====================================================
-- 1. USUÁRIOS DA PLATAFORMA
-- =====================================================

-- Tabela de Fazendeiros (Produtores Rurais)
CREATE TABLE fazendeiro (
    id_fazendeiro INT AUTO_INCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL, -- Suporte à autenticação do site
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_fazendeiro PRIMARY KEY (id_fazendeiro),
    CONSTRAINT uq_fazendeiro_cpf UNIQUE (cpf),
    CONSTRAINT uq_fazendeiro_email UNIQUE (email)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Engenheiros Agrônomos
CREATE TABLE engenheiro_agronomo (
    id_agronomo INT AUTO_INCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    crea VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    uf CHAR(2) NOT NULL DEFAULT 'SP', -- Suporte ao filtro por estado da vitrine
    especialidade VARCHAR(150),
    descricao_perfil TEXT,
    senha VARCHAR(255) NOT NULL, -- Suporte à autenticação do site
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_engenheiro_agronomo PRIMARY KEY (id_agronomo),
    CONSTRAINT uq_agronomo_cpf UNIQUE (cpf),
    CONSTRAINT uq_agronomo_crea UNIQUE (crea),
    CONSTRAINT uq_agronomo_email UNIQUE (email)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. PROPRIEDADES RURAIS E ATENDIMENTO
-- =====================================================

-- Tabela de Fazendas
CREATE TABLE fazenda (
    id_fazenda INT AUTO_INCREMENT,
    id_fazendeiro INT NOT NULL,
    nome_fazenda VARCHAR(150) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    area_total DECIMAL(10,2) NOT NULL,
    localizacao VARCHAR(255),
    status ENUM('ATIVA', 'INATIVA') DEFAULT 'ATIVA',

    CONSTRAINT pk_fazenda PRIMARY KEY (id_fazenda),
    CONSTRAINT fk_fazenda_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_fazenda_area CHECK (area_total > 0)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Conversas (Chat)
CREATE TABLE conversa (
    id_conversa INT AUTO_INCREMENT,
    id_fazendeiro INT NOT NULL,
    id_agronomo INT NOT NULL,
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ABERTA', 'ENCERRADA') DEFAULT 'ABERTA',

    CONSTRAINT pk_conversa PRIMARY KEY (id_conversa),
    CONSTRAINT fk_conversa_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_conversa_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Mensagens
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT,
    id_conversa INT NOT NULL,
    remetente ENUM('FAZENDEIRO', 'AGRONOMO') NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_mensagem PRIMARY KEY (id_mensagem),
    CONSTRAINT fk_mensagem_conversa
        FOREIGN KEY (id_conversa)
        REFERENCES conversa(id_conversa)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PLANOS DE MANEJO E VISITAS TÉCNICAS
-- =====================================================

-- Tabela de Planos de Manejo
CREATE TABLE plano (
    id_plano INT AUTO_INCREMENT,
    id_fazendeiro INT NOT NULL,
    id_agronomo INT NOT NULL,
    id_fazenda INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    quantidade_visitas INT NOT NULL,
    periodicidade_visita VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    descricao TEXT,
    status ENUM(
        'NEGOCIACAO',
        'AGUARDANDO_PAGAMENTO',
        'ATIVO',
        'PAUSADO',
        'CONCLUIDO',
        'ENCERRADO',
        'CANCELADO'
    ) DEFAULT 'NEGOCIACAO',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_plano PRIMARY KEY (id_plano),
    CONSTRAINT fk_plano_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_plano_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_plano_fazenda
        FOREIGN KEY (id_fazenda)
        REFERENCES fazenda(id_fazenda)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_plano_valor CHECK (valor >= 0),
    CONSTRAINT chk_plano_visitas CHECK (quantidade_visitas > 0)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Visitas Técnicas
CREATE TABLE visita_manejo (
    id_visita INT AUTO_INCREMENT,
    id_plano INT NOT NULL,
    data_agendada DATETIME NOT NULL,
    data_realizada DATETIME,
    observacoes TEXT,
    diagnostico TEXT,
    recomendacoes TEXT,
    localizacao_realizacao VARCHAR(255),
    evidencias TEXT,
    status ENUM(
        'AGENDADA',
        'REALIZADA',
        'CONFIRMADA',
        'CANCELADA',
        'NAO_REALIZADA'
    ) DEFAULT 'AGENDADA',

    CONSTRAINT pk_visita_manejo PRIMARY KEY (id_visita),
    CONSTRAINT fk_visita_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ocorrências na Lavoura
CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT,
    id_plano INT NOT NULL,
    id_visita INT,
    id_fazendeiro INT NOT NULL,
    descricao TEXT NOT NULL,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM(
        'ABERTA',
        'EM_ANALISE',
        'RESOLVIDA',
        'CANCELADA'
    ) DEFAULT 'ABERTA',

    CONSTRAINT pk_ocorrencia PRIMARY KEY (id_ocorrencia),
    CONSTRAINT fk_ocorrencia_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_visita
        FOREIGN KEY (id_visita)
        REFERENCES visita_manejo(id_visita)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_ocorrencia_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Avaliações Técnicas
CREATE TABLE avaliacao (
    id_avaliacao INT AUTO_INCREMENT,
    id_visita INT NOT NULL,
    id_fazendeiro INT NOT NULL,
    id_agronomo INT NOT NULL,
    nota INT NOT NULL,
    comentario TEXT,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_avaliacao PRIMARY KEY (id_avaliacao),
    CONSTRAINT fk_avaliacao_visita
        FOREIGN KEY (id_visita)
        REFERENCES visita_manejo(id_visita)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_avaliacao_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_avaliacao_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_avaliacao_nota CHECK (nota BETWEEN 1 AND 5)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. REGRAS FINANCEIRAS E PAGAMENTOS
-- =====================================================

-- Tabela de Configuração de Comissão da Plataforma
CREATE TABLE configuracao_comissao (
    id_comissao INT AUTO_INCREMENT,
    percentual DECIMAL(5,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativa BOOLEAN DEFAULT TRUE,

    CONSTRAINT pk_configuracao_comissao PRIMARY KEY (id_comissao),
    CONSTRAINT chk_comissao_percentual CHECK (percentual BETWEEN 0 AND 100)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pagamentos dos Planos
CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT,
    id_plano INT NOT NULL,
    valor_plano DECIMAL(10,2) NOT NULL,
    percentual_comissao DECIMAL(5,2) NOT NULL,
    valor_comissao DECIMAL(10,2) NOT NULL,
    valor_agronomo DECIMAL(10,2) NOT NULL,
    data_pagamento DATETIME,
    status ENUM(
        'PENDENTE',
        'PAGO',
        'CANCELADO',
        'ESTORNADO'
    ) DEFAULT 'PENDENTE',

    CONSTRAINT pk_pagamento PRIMARY KEY (id_pagamento),
    CONSTRAINT fk_pagamento_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_pagamento_valores CHECK (valor_plano >= 0 AND valor_comissao >= 0 AND valor_agronomo >= 0),
    CONSTRAINT chk_pagamento_percentual CHECK (percentual_comissao BETWEEN 0 AND 100)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Saldo do Plano
CREATE TABLE saldo_plano (
    id_saldo INT AUTO_INCREMENT,
    id_plano INT NOT NULL,
    valor_bruto DECIMAL(10,2) NOT NULL,
    percentual_comissao DECIMAL(5,2) NOT NULL,
    valor_comissao DECIMAL(10,2) NOT NULL,
    valor_agronomo DECIMAL(10,2) NOT NULL,
    visitas_previstas INT NOT NULL,
    visitas_realizadas INT DEFAULT 0,
    status_saldo ENUM(
        'PENDENTE',
        'DISPONIVEL',
        'SACADO',
        'CANCELADO'
    ) DEFAULT 'PENDENTE',
    data_liberacao DATETIME,

    CONSTRAINT pk_saldo_plano PRIMARY KEY (id_saldo),
    CONSTRAINT fk_saldo_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_saldo_visitas CHECK (visitas_previstas > 0 AND visitas_realizadas >= 0)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Saques dos Agrônomos
CREATE TABLE saque (
    id_saque INT AUTO_INCREMENT,
    id_saldo INT NOT NULL,
    id_agronomo INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_pagamento DATETIME,
    status ENUM(
        'SOLICITADO',
        'PROCESSANDO',
        'PAGO',
        'RECUSADO',
        'CANCELADO'
    ) DEFAULT 'SOLICITADO',

    CONSTRAINT pk_saque PRIMARY KEY (id_saque),
    CONSTRAINT fk_saque_saldo
        FOREIGN KEY (id_saldo)
        REFERENCES saldo_plano(id_saldo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_saque_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_saque_valor CHECK (valor > 0)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. VIEWS PARA RELATÓRIOS E CONSULTAS (Módulo BD II)
-- =====================================================

-- View: Relatório Completo de Planos e Ocorrências (Join & SubSelect)
CREATE VIEW vw_relatorio_planos AS
SELECT 
    p.id_plano,
    p.id_fazendeiro,
    p.data_inicio,
    p.status AS status_plano,
    p.valor,
    f.nome_fazenda,
    f.municipio,
    f.uf,
    prod.nome_completo AS nome_produtor,
    agr.nome_completo AS nome_agronomo,
    -- SubSelect para contar ocorrências registradas neste plano
    (SELECT COUNT(*) 
     FROM ocorrencia o 
     WHERE o.id_plano = p.id_plano) AS total_ocorrencias_lavoura
FROM plano p
INNER JOIN fazenda f ON p.id_fazenda = f.id_fazenda
INNER JOIN fazendeiro prod ON p.id_fazendeiro = prod.id_fazendeiro
INNER JOIN engenheiro_agronomo agr ON p.id_agronomo = agr.id_agronomo;

-- View: Relatório Financeiro de Agrônomos (Join & SubSelect)
CREATE VIEW vw_financeiro_agronomos AS
SELECT 
    a.id_agronomo,
    a.nome_completo,
    a.crea,
    COUNT(p.id_plano) AS total_planos_ativos,
    COALESCE(SUM(p.valor), 0) AS valor_total_planos_ativos,
    -- SubSelect para buscar o total sacado
    IFNULL((SELECT SUM(s.valor) 
            FROM saque s 
            WHERE s.id_agronomo = a.id_agronomo AND s.status = 'PAGO'), 0) AS total_sacado
FROM engenheiro_agronomo a
LEFT JOIN plano p ON a.id_agronomo = p.id_agronomo AND p.status = 'ATIVO'
GROUP BY a.id_agronomo, a.nome_completo, a.crea;
