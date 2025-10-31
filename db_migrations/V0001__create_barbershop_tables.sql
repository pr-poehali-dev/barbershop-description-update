CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS masters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    experience INTEGER NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id),
    master_id INTEGER REFERENCES masters(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (name, price, duration) VALUES
('Классическая стрижка', 1500, 45),
('Стрижка + Борода', 2200, 60),
('Королевское бритьё', 1800, 50),
('Детская стрижка', 1000, 30),
('Камуфляж седины', 1200, 40),
('Уход за бородой', 900, 30);

INSERT INTO masters (name, experience, specialty) VALUES
('Александр Иванов', 8, 'Классика и fade'),
('Дмитрий Петров', 5, 'Борода и бритьё'),
('Михаил Сидоров', 10, 'Авторские стрижки');

INSERT INTO bookings (service_id, master_id, booking_date, booking_time, status) 
SELECT 
    (RANDOM() * 5 + 1)::INTEGER,
    (RANDOM() * 2 + 1)::INTEGER,
    CURRENT_DATE - (RANDOM() * 30)::INTEGER,
    ('10:00'::TIME + (RANDOM() * 10 || ' hours')::INTERVAL),
    CASE WHEN RANDOM() > 0.1 THEN 'completed' ELSE 'cancelled' END
FROM generate_series(1, 100);