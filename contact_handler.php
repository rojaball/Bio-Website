<?php
// Enable CORS for your domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Rate limiting configuration
$max_messages_per_day = 2;
$rate_limit_file = 'rate_limit.json';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$input || !isset($input['from_name']) || !isset($input['from_email']) || 
    !isset($input['subject']) || !isset($input['message']) || !isset($input['user_ip'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

// Get user IP (prioritize forwarded IP if available)
$user_ip = $input['user_ip'];
if (empty($user_ip)) {
    $user_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// Clean and validate inputs
$from_name = htmlspecialchars(trim($input['from_name']));
$from_email = filter_var(trim($input['from_email']), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']));
$message = htmlspecialchars(trim($input['message']));

if (!$from_email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit();
}

// Check rate limiting
function checkRateLimit($ip, $max_messages, $rate_limit_file) {
    $today = date('Y-m-d');
    
    if (!file_exists($rate_limit_file)) {
        return true;
    }
    
    $rate_data = json_decode(file_get_contents($rate_limit_file), true);
    
    if (!isset($rate_data[$ip][$today])) {
        return true;
    }
    
    return $rate_data[$ip][$today] < $max_messages;
}

function incrementRateLimit($ip, $rate_limit_file) {
    $today = date('Y-m-d');
    
    $rate_data = [];
    if (file_exists($rate_limit_file)) {
        $rate_data = json_decode(file_get_contents($rate_limit_file), true) ?: [];
    }
    
    if (!isset($rate_data[$ip])) {
        $rate_data[$ip] = [];
    }
    
    if (!isset($rate_data[$ip][$today])) {
        $rate_data[$ip][$today] = 0;
    }
    
    $rate_data[$ip][$today]++;
    
    // Clean old entries (keep only last 7 days)
    $cutoff_date = date('Y-m-d', strtotime('-7 days'));
    foreach ($rate_data as $ip_key => $ip_data) {
        foreach ($ip_data as $date => $count) {
            if ($date < $cutoff_date) {
                unset($rate_data[$ip_key][$date]);
            }
        }
        if (empty($rate_data[$ip_key])) {
            unset($rate_data[$ip_key]);
        }
    }
    
    file_put_contents($rate_limit_file, json_encode($rate_data));
}

// Check rate limit
if (!checkRateLimit($user_ip, $max_messages_per_day, $rate_limit_file)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Rate limit exceeded. Maximum 2 messages per day.']);
    exit();
}

// Email configuration
$to_email = 'daskibo@gmail.com'; // Hidden from frontend
$email_subject = "Contact Form: " . $subject;

// Create email body
$email_body = "New contact form submission:\n\n";
$email_body .= "Name: " . $from_name . "\n";
$email_body .= "Email: " . $from_email . "\n";
$email_body .= "Subject: " . $subject . "\n";
$email_body .= "Message:\n" . $message . "\n\n";
$email_body .= "Sender IP: " . $user_ip . "\n";
$email_body .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
$headers .= "Reply-To: " . $from_email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to_email, $email_subject, $email_body, $headers)) {
    // Increment rate limit counter
    incrementRateLimit($user_ip, $rate_limit_file);
    
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>
