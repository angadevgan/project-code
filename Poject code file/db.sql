CREATE DATABASE health_tracker;

USE health_tracker;

CREATE TABLE records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    steps INT NOT NULL,
    calories INT NOT NULL,
    sleep FLOAT NOT NULL
);
