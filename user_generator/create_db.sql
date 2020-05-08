CREATE DATABASE IF NOT EXISTS rsvp_guest;
USE rsvp_guest;

CREATE TABLE IF NOT EXISTS guests ( firstName VARCHAR(20), lastName VARCHAR(20), street VARCHAR(80), city VARCHAR(20), stateOrProvince VARCHAR(20), zip VARCHAR(10), thumbnail VARCHAR(60) );