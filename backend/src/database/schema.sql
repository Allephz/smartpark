-- Tabel bookings untuk fitur booking slot
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    slot_id INT NOT NULL,
    status ENUM('RESERVED', 'OCCUPIED', 'COMPLETED') DEFAULT 'RESERVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE
);
-- Buat database
CREATE DATABASE IF NOT EXISTS smartpark_db;
USE smartpark_db;

-- Buat tabel users (pengguna)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel parking_lots (area parkir)
CREATE TABLE IF NOT EXISTS parking_lots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_capacity INT NOT NULL,
    description TEXT,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel parking_slots (slot parkir)
CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED') DEFAULT 'AVAILABLE',
    parking_lot_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE
);

-- Data awal untuk admin dan user
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$your_hashed_password', 'ADMIN'),
('user', 'user@example.com', '$2a$10$your_hashed_password', 'USER');

-- Data awal untuk area parkir
INSERT INTO parking_lots (name, total_capacity, description) VALUES
('Mall A - Lantai 1', 15, 'Area parkir lantai dasar'),
('Mall A - Lantai 2', 10, 'Area parkir lantai atas');

-- Data awal untuk slot parkir Mall A - Lantai 1
INSERT INTO parking_slots (slot_number, status, parking_lot_id)
SELECT 
    CONCAT('A1-', numbers.n), 
    'AVAILABLE',
    1
FROM (
    SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
) numbers;

-- Data awal untuk slot parkir Mall A - Lantai 2
INSERT INTO parking_slots (slot_number, status, parking_lot_id)
SELECT 
    CONCAT('A2-', numbers.n), 
    'AVAILABLE',
    2
FROM (
    SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) numbers;