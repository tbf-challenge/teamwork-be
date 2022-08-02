CREATE DATABASE teamwork_database;

--\c into teamwork_database

CREATE TABLE article(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    article VARCHAR(63206)
);
