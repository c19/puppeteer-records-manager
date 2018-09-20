create database manager;
\c manager;
create table records (
    "id" serial primary key,
    "name" varchar,
    "timestamp" timestamp DEFAULT now(),
    "url" varchar,
    "eventCount" int,
    "events" json
);