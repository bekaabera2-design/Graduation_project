CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role VARCHAR(20) DEFAULT 'student'
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  department VARCHAR(100),
  year INT,
  status VARCHAR(20) DEFAULT 'pending',
  user_id INT REFERENCES users(id)
);