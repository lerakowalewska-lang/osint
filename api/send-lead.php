<?php
register_shutdown_function(function () {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (!headers_sent()) header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e['message'] . ' in ' . basename($e['file']) . ':' . $e['line']]);
    }
});
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

if (empty($body['name']) || empty($body['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and phone are required']);
    exit;
}

$configFile = __DIR__ . '/tg-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Config not found']);
    exit;
}
require_once $configFile;

$name   = htmlspecialchars($body['name'],   ENT_QUOTES, 'UTF-8');
$phone  = htmlspecialchars($body['phone'],  ENT_QUOTES, 'UTF-8');
$source = htmlspecialchars($body['source'] ?? 'website', ENT_QUOTES, 'UTF-8');

$TG_CHAT_ID = '-5268453636';

$date    = new DateTime('now', new DateTimeZone('Europe/Moscow'));
$dateStr = $date->format('d.m.Y H:i') . ' МСК';

$text = "🔥 *Новая заявка с сайта HuntedLead*\n\n"
      . "👤 *Имя:* $name\n"
      . "📞 *Телефон:* $phone\n"
      . "📌 *Страница:* $source\n"
      . "🕐 *Время:* $dateStr";

$ch = curl_init("https://api.telegram.org/bot" . TG_BOT_TOKEN . "/sendMessage");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode([
        'chat_id'    => $TG_CHAT_ID,
        'text'       => $text,
        'parse_mode' => 'Markdown',
    ]),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Telegram request failed']);
    exit;
}

$data = json_decode($response, true);

if (!empty($data['ok'])) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $data['description'] ?? 'Unknown error']);
}
