<?php
declare(strict_types=1);

$recipient = 'support@seacoastpath.com';
$redirectBase = 'contact.html#contactForm';

function clean_value(string $value): string {
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

if (!empty($_POST['company_site'] ?? '')) {
    header('Location: ' . $redirectBase);
    exit;
}

$name = clean_value((string)($_POST['name'] ?? ''));
$email = filter_var((string)($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$company = clean_value((string)($_POST['company'] ?? ''));
$interest = clean_value((string)($_POST['interest'] ?? ''));
$website = clean_value((string)($_POST['website'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || !$email || $interest === '' || $message === '') {
    header('Location: contact.html?form=invalid#contactForm');
    exit;
}

$safeMessage = trim(str_replace("\r", '', $message));
$subject = 'New SeacoastPath inquiry: ' . $interest;
$body = "New inquiry from seacoastpath.com\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Company: {$company}\n"
    . "Interest: {$interest}\n"
    . "Website: {$website}\n\n"
    . "Message:\n{$safeMessage}\n";

$headers = [
    'From: SeacoastPath Website <support@seacoastpath.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));
header('Location: contact.html?form=' . ($sent ? 'sent' : 'error') . '#contactForm');
exit;
