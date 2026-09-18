<?php
// Inicia a sessão para "lembrar" que o utilizador fez login
session_start();

// Definição da estrutura de cadastro de utilizadores no PHP
$usuarios_cadastrados = [
    [
        "email" => "carlos@mipsystem.com",
        "senha" => "agronomo123", 
        "nome" => "Carlos Henrique",
        "tipo" => "Engenheiro Agrônomo"
    ],
    [
        "email" => "produtor@fazenda.com",
        "senha" => "safra2026",
        "nome" => "Fazenda São João",
        "tipo" => "Produtor Rural"
    ]
];

// Operacionalizar a entrada do sistema através do clique do botão
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email_informado = $_POST['email'] ?? '';
    $senha_informada = $_POST['senha'] ?? '';

    $autenticado = false;

    // Verificação na estrutura de cadastro
    foreach ($usuarios_cadastrados as $usuario) {
        if ($usuario['email'] === $email_informado && $usuario['senha'] === $senha_informada) {
            $autenticado = true;
            // Guardamos a confirmação de segurança na sessão
            $_SESSION['logado'] = true;
            $_SESSION['nome_usuario'] = $usuario['nome'];
            break;
        }
    }

    if ($autenticado) {
        // Envia para o sistema principal
        header("Location: sistema.php");
        exit();
    } else {
        // Exibe um alerta com JavaScript e volta à tela de login
        echo "<script>
                alert('Acesso Negado! E-mail ou senha incorretos.');
                window.location.href = 'index.html';
              </script>";
        exit();
    }
} else {
    header("Location: index.html");
    exit();
}
?>