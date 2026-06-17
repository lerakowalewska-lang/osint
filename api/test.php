<?php
header('Content-Type: application/json');
echo json_encode([
    'ok' => true,
    'php' => phpversion(),
    'curl' => function_exists('curl_init'),
    'config_exists' => file_exists(__DIR__ . '/tg-config.php'),
]);
