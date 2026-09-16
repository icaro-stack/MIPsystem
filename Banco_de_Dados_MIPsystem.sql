CREATE DATABASE IF NOT EXISTS sistema_agricola;

USE sistema_agricola;


CREATE TABLE fazendeiro (
    id_fazendeiro INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE engenheiro_agronomo (
    id_agronomo INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    crea VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    especialidade VARCHAR(150),
    descricao_perfil TEXT,
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE fazenda (
    id_fazenda INT AUTO_INCREMENT PRIMARY KEY,
    id_fazendeiro INT NOT NULL,
    nome_fazenda VARCHAR(150) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    area_total DECIMAL(10,2),
    localizacao VARCHAR(255),
    status ENUM('ATIVA', 'INATIVA') DEFAULT 'ATIVA',

    CONSTRAINT fk_fazenda_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
);


CREATE TABLE conversa (
    id_conversa INT AUTO_INCREMENT PRIMARY KEY,
    id_fazendeiro INT NOT NULL,
    id_agronomo INT NOT NULL,
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ABERTA', 'ENCERRADA') DEFAULT 'ABERTA',

    CONSTRAINT fk_conversa_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro),

    CONSTRAINT fk_conversa_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
);


CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_conversa INT NOT NULL,
    remetente ENUM('FAZENDEIRO', 'AGRONOMO') NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensagem_conversa
        FOREIGN KEY (id_conversa)
        REFERENCES conversa(id_conversa)
);


CREATE TABLE plano (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
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
        'ENCERRADO',
        'CANCELADO'
    ) DEFAULT 'NEGOCIACAO',

    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_plano_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro),

    CONSTRAINT fk_plano_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo),

    CONSTRAINT fk_plano_fazenda
        FOREIGN KEY (id_fazenda)
        REFERENCES fazenda(id_fazenda)
);


CREATE TABLE configuracao_comissao (
    id_comissao INT AUTO_INCREMENT PRIMARY KEY,
    percentual DECIMAL(5,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativa BOOLEAN DEFAULT TRUE
);


CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
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

    CONSTRAINT fk_pagamento_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
);


CREATE TABLE visita_manejo (
    id_visita INT AUTO_INCREMENT PRIMARY KEY,
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

    CONSTRAINT fk_visita_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
);


CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
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

    CONSTRAINT fk_ocorrencia_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano),

    CONSTRAINT fk_ocorrencia_visita
        FOREIGN KEY (id_visita)
        REFERENCES visita_manejo(id_visita),

    CONSTRAINT fk_ocorrencia_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro)
);


CREATE TABLE avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_visita INT NOT NULL,
    id_fazendeiro INT NOT NULL,
    id_agronomo INT NOT NULL,

    nota INT NOT NULL,
    comentario TEXT,

    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_avaliacao_visita
        FOREIGN KEY (id_visita)
        REFERENCES visita_manejo(id_visita),

    CONSTRAINT fk_avaliacao_fazendeiro
        FOREIGN KEY (id_fazendeiro)
        REFERENCES fazendeiro(id_fazendeiro),

    CONSTRAINT fk_avaliacao_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
);


CREATE TABLE saldo_plano (
    id_saldo INT AUTO_INCREMENT PRIMARY KEY,
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

    CONSTRAINT fk_saldo_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano(id_plano)
);


CREATE TABLE saque (
    id_saque INT AUTO_INCREMENT PRIMARY KEY,
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

    CONSTRAINT fk_saque_saldo
        FOREIGN KEY (id_saldo)
        REFERENCES saldo_plano(id_saldo),

    CONSTRAINT fk_saque_agronomo
        FOREIGN KEY (id_agronomo)
        REFERENCES engenheiro_agronomo(id_agronomo)
);