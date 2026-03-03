<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_input(mixed $value, int $maxLength): string
{
    $text = trim((string) $value);
    $text = str_replace(["\r", "\0"], ['', ''], $text);
    if (mb_strlen($text) > $maxLength) {
        $text = mb_substr($text, 0, $maxLength);
    }
    return $text;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed']);
}

$rawInput = file_get_contents('php://input');
$decodedInput = json_decode($rawInput ?: '', true);

if (is_array($decodedInput)) {
    $data = $decodedInput;
} else {
    $data = $_POST;
}

$name = clean_input($data['name'] ?? '', 120);
$email = clean_input($data['email'] ?? '', 254);
$message = clean_input($data['message'] ?? '', 4000);
$website = clean_input($data['website'] ?? '', 120); // Honeypot

if ($website !== '') {
    // Pretend success so bots do not learn the honeypot.
    respond(200, ['success' => true]);
}

if ($name === '' || $email === '' || $message === '') {
    respond(422, ['success' => false, 'message' => 'Bitte fülle alle Felder aus.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Ungültige E-Mail-Adresse.']);
}

if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $name)) {
    respond(422, ['success' => false, 'message' => 'Ungültige Eingabe.']);
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitDir = __DIR__ . '/.contact-rate-limit';
$rateLimitFile = $rateLimitDir . '/' . hash('sha256', $ipAddress) . '.json';
$windowSeconds = 60;
$maxRequestsPerWindow = 5;
$now = time();

if (!is_dir($rateLimitDir) && !mkdir($rateLimitDir, 0755, true) && !is_dir($rateLimitDir)) {
    respond(500, ['success' => false, 'message' => 'Serverfehler.']);
}

$timestamps = [];
if (is_file($rateLimitFile)) {
    $existingData = json_decode((string) file_get_contents($rateLimitFile), true);
    if (is_array($existingData)) {
        foreach ($existingData as $timestamp) {
            $timeValue = (int) $timestamp;
            if (($now - $timeValue) <= $windowSeconds) {
                $timestamps[] = $timeValue;
            }
        }
    }
}

if (count($timestamps) >= $maxRequestsPerWindow) {
    respond(429, ['success' => false, 'message' => 'Zu viele Anfragen. Bitte versuche es später erneut.']);
}

$timestamps[] = $now;
file_put_contents($rateLimitFile, json_encode($timestamps), LOCK_EX);

$to = 'hello@aha-kids.de';
$subject = 'Neue Kontaktanfrage über aha-kids.de';
$bodyLines = [
    'Es wurde eine neue Anfrage über das Kontaktformular gesendet:',
    '',
    'Name: ' . $name,
    'E-Mail: ' . $email,
    'Nachricht:',
    $message,
    '',
    'Zeitpunkt: ' . date('Y-m-d H:i:s'),
    'IP: ' . $ipAddress,
];
$body = implode("\n", $bodyLines);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: aha Kids <hello@aha-kids.de>',
    'Reply-To: ' . $email,
];

$mailSent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$mailSent) {
    respond(500, ['success' => false, 'message' => 'E-Mail konnte nicht versendet werden.']);
}

respond(200, ['success' => true]);

