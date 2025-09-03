<?php
/**
 * Simple script to create a test user for Evoka application
 * Run this script from the command line: php create_test_user.php
 */

// Database configuration - adjust these values to match your setup
$host = '127.0.0.1';
$dbname = 'saledash'; // or your database name
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if test user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute(['testuser']);
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Test user 'testuser' already exists!\n";
        echo "Username: testuser\n";
        echo "Password: testpass\n";
        exit;
    }
    
    // Create test user
    $hashedPassword = password_hash('testpass', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        INSERT INTO users (username, email, password, name, accountType, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $stmt->execute([
        'testuser',
        'test@example.com',
        $hashedPassword,
        'Test User',
        'private'
    ]);
    
    $userId = $pdo->lastInsertId();
    
    echo "✅ Test user created successfully!\n";
    echo "User ID: $userId\n";
    echo "Username: testuser\n";
    echo "Password: testpass\n";
    echo "Email: test@example.com\n";
    echo "Account Type: private\n";
    echo "\n";
    echo "You can now use these credentials to login to your Evoka application.\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\n";
    echo "Make sure:\n";
    echo "1. MySQL is running\n";
    echo "2. Database 'saledash' exists\n";
    echo "3. Database credentials are correct\n";
    echo "4. Users table exists\n";
}
?>

