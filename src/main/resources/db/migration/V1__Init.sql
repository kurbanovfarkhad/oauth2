drop table if exists car cascade;
drop table if exists users cascade;
drop sequence if exists hibernate_sequence;
create sequence hibernate_sequence start 1 increment 1;
create table car (
  id int8 not null,
  client_address varchar(255),
  about_car varchar(300),
  master_name varchar(255),
  mileage int4 not null,
  car_model varchar(255),
  owner varchar(255),
  client_phone varchar(255),
  year_of_issue timestamp,
  primary key (id)
);

create table users (
  id varchar(25) not null,
  email varchar(255),
  gender varchar(255),
  last_visit timestamp,
  locale varchar(255),
  name varchar(255),
  userpic varchar(255),
  primary key (id)
);