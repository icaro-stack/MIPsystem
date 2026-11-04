<?php
declare(strict_types=1);
$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: 'sistema_agricola';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    error_log('Erro PDO: '.$e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode(['erro'=>'Não foi possível conectar ao banco.'], JSON_UNESCAPED_UNICODE));
}
