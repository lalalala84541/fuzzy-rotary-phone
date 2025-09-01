<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Define the data file path
$dataFile = 'g2b_data.json';

// Handle POST request (store data)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);
    
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data format']);
        exit;
    }
    
    // Read existing data
    $existingData = [];
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    
    // Add new data
    $existingData[] = $data;
    
    // Write back to file
    file_put_contents($dataFile, json_encode($existingData));
    
    echo json_encode(['success' => true]);
}
// Handle GET request (retrieve data)
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode([]);
    }
}
// Handle OPTIONS request (CORS preflight)
else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// Handle other methods
else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
