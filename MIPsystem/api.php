<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params(['httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off','samesite'=>'Lax','path'=>'/']);
    session_start();
}
require_once __DIR__.'/conexao.php';
function out(mixed $data, int $status=200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit; }
function fail(string $message, int $status=400): never { out(['erro'=>$message],$status); }
function field(string $key): string { return trim((string)($_POST[$key]??'')); }
function required(string $key, int $max=255): string { $v=field($key); if ($v==='' || mb_strlen($v)>$max) fail("Campo inválido: $key"); return $v; }
function integer(string $key): int { $v=filter_var($_POST[$key]??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]); if ($v===false) fail("Identificador inválido: $key"); return $v; }
function enumValue(string $key, array $values): string { $v=field($key); if (!in_array($v,$values,true)) fail("Valor inválido: $key"); return $v; }
function logged(): array { if (empty($_SESSION['id']) || empty($_SESSION['tipo'])) fail('Faça login para continuar.',401); return ['id'=>(int)$_SESSION['id'],'tipo'=>$_SESSION['tipo']]; }
function producer(): int { $u=logged(); if ($u['tipo']!=='produtor') fail('Ação disponível somente para produtores.',403); return $u['id']; }
function csrf(): void { if (!hash_equals((string)($_SESSION['csrf']??''),field('csrf'))) fail('Sessão inválida. Recarregue a página.',403); }
function existsOwned(PDO $pdo,string $table,string $pk,int $id,int $owner): void {
    $s=$pdo->prepare("SELECT 1 FROM $table WHERE $pk=? AND id_fazendeiro=?");$s->execute([$id,$owner]);if(!$s->fetchColumn()) fail('Registro não encontrado ou sem permissão.',404);
}
function ownPlan(PDO $pdo,int $id,int $owner): array {
    $s=$pdo->prepare('SELECT * FROM plano WHERE id_plano=? AND id_fazendeiro=?');$s->execute([$id,$owner]);$r=$s->fetch();if(!$r)fail('Plano não encontrado ou sem permissão.',404);return $r;
}
function ownVisit(PDO $pdo,int $id,int $owner): array {
    $s=$pdo->prepare('SELECT v.* FROM visita_manejo v JOIN plano p ON p.id_plano=v.id_plano WHERE v.id_visita=? AND p.id_fazendeiro=?');$s->execute([$id,$owner]);$r=$s->fetch();if(!$r)fail('Visita não encontrada.',404);return $r;
}
function ownOccurrence(PDO $pdo,int $id,int $owner): array {
    $s=$pdo->prepare('SELECT * FROM ocorrencia WHERE id_ocorrencia=? AND id_fazendeiro=?');$s->execute([$id,$owner]);$r=$s->fetch();if(!$r)fail('Ocorrência não encontrada.',404);return $r;
}
function dateValue(string $key): string { $v=required($key,19);$d=DateTimeImmutable::createFromFormat('!Y-m-d',$v);if(!$d || $d->format('Y-m-d')!==$v)fail('Data inválida.');return $v; }
function money(string $key,bool $positive=false): string { $v=field($key);if(!is_numeric($v)||!is_finite((float)$v)||($positive?(float)$v<=0:(float)$v<0))fail("Valor inválido: $key");return number_format((float)$v,2,'.',''); }
function selectAll(PDO $pdo,string $sql,array $params=[]): array {$s=$pdo->prepare($sql);$s->execute($params);return $s->fetchAll();}
function mutation(PDO $pdo,string $sql,array $params): int {$s=$pdo->prepare($sql);$s->execute($params);return $s->rowCount();}
try {
    $action=(string)($_GET['acao']??$_POST['acao']??'');
    $method=$_SERVER['REQUEST_METHOD']??'GET';
    if($action==='token' && $method==='GET') { if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32)); out(['csrf'=>$_SESSION['csrf']]); }
    if($action==='sessao') {
        if(empty($_SESSION['id'])) out(['autenticado'=>false]);
        out(['autenticado'=>true,'usuario'=>['id'=>(int)$_SESSION['id'],'nome'=>$_SESSION['nome'],'email'=>$_SESSION['email'],'tipo'=>$_SESSION['tipo']],'csrf'=>$_SESSION['csrf']]);
    }
    if($action==='agronomos' && $method==='GET') out(selectAll($pdo,"SELECT id_agronomo AS id,nome_completo AS nome,uf AS estado,crea,especialidade,descricao_perfil AS descricao FROM engenheiro_agronomo WHERE status='ATIVO' ORDER BY nome_completo"));
    if($method!=='POST' && $action!=='fazendas' && $action!=='planos' && $action!=='visitas' && $action!=='ocorrencias' && $action!=='relatorios') fail('Método não permitido.',405);
    if($action==='cadastro') {
        if($method!=='POST')fail('Método não permitido.',405);
        csrf();$tipo=enumValue('tipo',['produtor','agronomo']);$nome=required('nome',150);$email=required('email',150);
        if(!filter_var($email,FILTER_VALIDATE_EMAIL))fail('E-mail inválido.');
        $cpf=required('cpf',14);if(!preg_match('/^\d{3}\.\d{3}\.\d{3}-\d{2}$/',$cpf))fail('CPF deve estar no formato 000.000.000-00.');
        $senha=required('senha',255);if(strlen($senha)<8)fail('A senha deve ter pelo menos 8 caracteres.');
        $tel=field('telefone');if(strlen($tel)>20)fail('Telefone inválido.');
        $hash=password_hash($senha,PASSWORD_DEFAULT);
        if($tipo==='produtor')mutation($pdo,'INSERT INTO fazendeiro (nome_completo,cpf,email,telefone,senha) VALUES (?,?,?,?,?)',[$nome,$cpf,$email,$tel?:null,$hash]);
        else {
            $crea=required('crea',30);$esp=required('especialidade',150);$uf=strtoupper(field('uf')?:'SP');if(!preg_match('/^[A-Z]{2}$/',$uf))fail('UF inválida.');
            mutation($pdo,'INSERT INTO engenheiro_agronomo (nome_completo,cpf,crea,email,telefone,uf,especialidade,senha) VALUES (?,?,?,?,?,?,?,?)',[$nome,$cpf,$crea,$email,$tel?:null,$uf,$esp,$hash]);
        }
        out(['sucesso'=>true,'mensagem'=>'Conta cadastrada. Faça login.']);
    }
    if($action==='login') {
        if($method!=='POST')fail('Método não permitido.',405);
        csrf();$tipo=enumValue('tipo',['produtor','agronomo']);$email=required('email',150);$senha=field('senha');
        $table=$tipo==='produtor'?'fazendeiro':'engenheiro_agronomo';$pk=$tipo==='produtor'?'id_fazendeiro':'id_agronomo';
        $s=$pdo->prepare("SELECT $pk AS id,nome_completo,email,senha,status FROM $table WHERE email=?");$s->execute([$email]);$r=$s->fetch();
        if(!$r || $r['status']!=='ATIVO' || !password_verify($senha,$r['senha']))fail('E-mail ou senha incorretos.',401);
        session_regenerate_id(true);$_SESSION['id']=(int)$r['id'];$_SESSION['tipo']=$tipo;$_SESSION['nome']=$r['nome_completo'];$_SESSION['email']=$r['email'];$_SESSION['csrf']=bin2hex(random_bytes(32));
        out(['sucesso'=>true,'usuario'=>['id'=>(int)$r['id'],'nome'=>$r['nome_completo'],'email'=>$r['email'],'tipo'=>$tipo],'csrf'=>$_SESSION['csrf']]);
    }
    if($action==='logout') {
        if($method!=='POST')fail('Método não permitido.',405);
        csrf();$_SESSION=[];session_destroy();out(['sucesso'=>true]);
    }
    $u=logged();
    if($action==='relatorios' && $method==='GET') {
        if($u['tipo']==='produtor')out(selectAll($pdo,'SELECT * FROM vw_relatorio_planos WHERE id_fazendeiro=? ORDER BY id_plano DESC',[$u['id']]));
        out(selectAll($pdo,'SELECT * FROM vw_financeiro_agronomos WHERE id_agronomo=?',[$u['id']]));
    }
    if($action==='fazendas') {
        $owner=producer();
        if($method==='GET')out(selectAll($pdo,'SELECT * FROM fazenda WHERE id_fazendeiro=? ORDER BY id_fazenda DESC',[$owner]));
        csrf();$op=enumValue('operacao',['create','update','delete']);
        if($op==='delete'){$id=integer('id');existsOwned($pdo,'fazenda','id_fazenda',$id,$owner);mutation($pdo,'DELETE FROM fazenda WHERE id_fazenda=? AND id_fazendeiro=?',[$id,$owner]);out(['sucesso'=>true]);}
        $nome=required('nome',150);$municipio=required('municipio',100);$uf=strtoupper(required('uf',2));if(!preg_match('/^[A-Z]{2}$/',$uf))fail('UF inválida.');
        $area=money('area',true);$status=enumValue('status',['ATIVA','INATIVA']);
        if($op==='create')mutation($pdo,'INSERT INTO fazenda(id_fazendeiro,nome_fazenda,municipio,uf,area_total,status) VALUES(?,?,?,?,?,?)',[$owner,$nome,$municipio,$uf,$area,$status]);
        else {$id=integer('id');existsOwned($pdo,'fazenda','id_fazenda',$id,$owner);mutation($pdo,'UPDATE fazenda SET nome_fazenda=?,municipio=?,uf=?,area_total=?,status=? WHERE id_fazenda=? AND id_fazendeiro=?',[$nome,$municipio,$uf,$area,$status,$id,$owner]);}
        out(['sucesso'=>true]);
    }
    if($action==='planos') {
        $owner=producer();
        if($method==='GET')out(selectAll($pdo,'SELECT p.*,f.nome_fazenda,a.nome_completo AS nome_agronomo FROM plano p JOIN fazenda f ON f.id_fazenda=p.id_fazenda JOIN engenheiro_agronomo a ON a.id_agronomo=p.id_agronomo WHERE p.id_fazendeiro=? ORDER BY p.id_plano DESC',[$owner]));
        csrf();$op=enumValue('operacao',['create','update','delete']);
        if($op==='delete'){$id=integer('id');ownPlan($pdo,$id,$owner);mutation($pdo,'DELETE FROM plano WHERE id_plano=? AND id_fazendeiro=?',[$id,$owner]);out(['sucesso'=>true]);}
        $fazenda=integer('id_fazenda');existsOwned($pdo,'fazenda','id_fazenda',$fazenda,$owner);$agronomo=integer('id_agronomo');
        $s=$pdo->prepare("SELECT 1 FROM engenheiro_agronomo WHERE id_agronomo=? AND status='ATIVO'");$s->execute([$agronomo]);if(!$s->fetchColumn())fail('Agrônomo indisponível.');
        $valor=money('valor');$visitas=integer('quantidade_visitas');$status=enumValue('status',['NEGOCIACAO','AGUARDANDO_PAGAMENTO','ATIVO','PAUSADO','CONCLUIDO','ENCERRADO','CANCELADO']);
        $data=dateValue('data_inicio');$periodicidade=required('periodicidade_visita',100);
        if($op==='create')mutation($pdo,'INSERT INTO plano(id_fazendeiro,id_agronomo,id_fazenda,valor,quantidade_visitas,periodicidade_visita,data_inicio,status) VALUES(?,?,?,?,?,?,?,?)',[$owner,$agronomo,$fazenda,$valor,$visitas,$periodicidade,$data,$status]);
        else {$id=integer('id');ownPlan($pdo,$id,$owner);mutation($pdo,'UPDATE plano SET id_agronomo=?,id_fazenda=?,valor=?,quantidade_visitas=?,periodicidade_visita=?,data_inicio=?,status=? WHERE id_plano=? AND id_fazendeiro=?',[$agronomo,$fazenda,$valor,$visitas,$periodicidade,$data,$status,$id,$owner]);}
        out(['sucesso'=>true]);
    }
    if($action==='visitas') {
        $owner=producer();
        if($method==='GET')out(selectAll($pdo,'SELECT v.*,p.id_fazenda,f.nome_fazenda FROM visita_manejo v JOIN plano p ON p.id_plano=v.id_plano JOIN fazenda f ON f.id_fazenda=p.id_fazenda WHERE p.id_fazendeiro=? ORDER BY v.id_visita DESC',[$owner]));
        csrf();$op=enumValue('operacao',['create','update','delete']);
        if($op==='delete'){$id=integer('id');ownVisit($pdo,$id,$owner);mutation($pdo,'DELETE FROM visita_manejo WHERE id_visita=?',[$id]);out(['sucesso'=>true]);}
        $plano=integer('id_plano');ownPlan($pdo,$plano,$owner);$data=dateValue('data_agendada');$status=enumValue('status',['AGENDADA','REALIZADA','CONFIRMADA','CANCELADA','NAO_REALIZADA']);$diag=field('diagnostico');
        if($op==='create')mutation($pdo,'INSERT INTO visita_manejo(id_plano,data_agendada,diagnostico,status) VALUES(?,?,?,?)',[$plano,$data.' 09:00:00',$diag,$status]);
        else {$id=integer('id');ownVisit($pdo,$id,$owner);mutation($pdo,'UPDATE visita_manejo SET id_plano=?,data_agendada=?,diagnostico=?,status=? WHERE id_visita=?',[$plano,$data.' 09:00:00',$diag,$status,$id]);}
        out(['sucesso'=>true]);
    }
    if($action==='ocorrencias') {
        $owner=producer();
        if($method==='GET')out(selectAll($pdo,'SELECT o.*,p.id_fazenda,f.nome_fazenda FROM ocorrencia o JOIN plano p ON p.id_plano=o.id_plano JOIN fazenda f ON f.id_fazenda=p.id_fazenda WHERE o.id_fazendeiro=? AND p.id_fazendeiro=? ORDER BY o.id_ocorrencia DESC',[$owner,$owner]));
        csrf();$op=enumValue('operacao',['create','update','delete']);
        if($op==='delete'){$id=integer('id');ownOccurrence($pdo,$id,$owner);mutation($pdo,'DELETE FROM ocorrencia WHERE id_ocorrencia=? AND id_fazendeiro=?',[$id,$owner]);out(['sucesso'=>true]);}
        $plano=integer('id_plano');ownPlan($pdo,$plano,$owner);$desc=required('descricao',65000);$status=enumValue('status',['ABERTA','EM_ANALISE','RESOLVIDA','CANCELADA']);
        if($op==='create')mutation($pdo,'INSERT INTO ocorrencia(id_plano,id_fazendeiro,descricao,status) VALUES(?,?,?,?)',[$plano,$owner,$desc,$status]);
        else {$id=integer('id');ownOccurrence($pdo,$id,$owner);mutation($pdo,'UPDATE ocorrencia SET id_plano=?,descricao=?,status=? WHERE id_ocorrencia=? AND id_fazendeiro=?',[$plano,$desc,$status,$id,$owner]);}
        out(['sucesso'=>true]);
    }
    fail('Ação desconhecida.',404);
} catch(PDOException $e) {
    error_log('Erro API: '.$e->getMessage());
    if($e->getCode()==='23000')fail('Registro duplicado ou relacionado a outros dados. Verifique os campos.',409);
    fail('Erro interno ao processar a solicitação.',500);
} catch(Throwable $e) { error_log('Erro inesperado API: '.$e->getMessage());fail('Erro interno no servidor.',500); }
