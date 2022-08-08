CREATE DATABASE teamwork;

--\c into teamwork

CREATE TABLE article(
    id BIGINT,
    title VARCHAR(100),
    images VARCHAR(100),
    content TEXT,
    authorId BIGINT,
    published SMALLINT
);
