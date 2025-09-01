<?php
// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Get data from request
$data = isset($_GET['data']) ? $_GET['data'] : '';

if (!empty($data)) {
    // Decode the base64 data
    $decoded = base64_decode($data);
    
    // Append to data file
    file_put_contents('g2b_data.txt', $decoded . "\n", FILE_APPEND);
    
    // Return a 1x1 transparent GIF
    header('Content-Type: image/gif');
    echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
} else {
    // If no data, return all stored data
    header('Content-Type: application/json');
    
    if (file_exists('g2b_data.txt')) {
        $lines = file('g2b_data.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $items = [];
        
        foreach ($lines as $line) {
            try {
                $item = json_decode($line, true);
                if ($item && isset($item['id'])) {
                    $items[] = $item;
                }
            } catch (Exception $e) {
                // Skip invalid lines
            }
        }
        
        echo json_encode($items);
    } else {
        echo json_encode([]);
    }
}
?>
