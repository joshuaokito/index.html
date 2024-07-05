sCREATE DATABASE reservations_db;

USE reservations_db;

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    price VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
