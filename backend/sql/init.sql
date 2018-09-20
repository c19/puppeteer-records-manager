create database manager;
\c manager;
create table records (
    "id" serial primary key,
    "name" varchar,
    "timestamp" timestamp
);

create table events (
    "id" serial primary key,
    "belongTo" int references records(id),
    "json" json
);
