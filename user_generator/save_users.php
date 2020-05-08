<?php

	require("../db_conn.php");

	///////////////
	// ADD TO DB //
	///////////////


	$firstName = $_GET["firstName"];
	$lastName = $_GET["lastName"];
	$street = $_GET["street"];
	$city = $_GET["city"];
	$state = $_GET["state"];
	$zip = $_GET["zip"];
	$img = $_GET["img"];


	// $sql = "CREATE DATABASE IF NOT EXISTS rsvp_guests;";
	// $sql .= "USE rsvp_guests;";
	// $sql = "CREATE TABLE IF NOT EXISTS guests ( firstName VARCHAR(20), lastName VARCHAR(20), street VARCHAR(80), city VARCHAR(20), stateOrProvince VARCHAR(20), zip VARCHAR(10), thumbnail VARCHAR(60) )';";
	$sql = "INSERT INTO guests (firstName, lastName, street, city, stateOrProvince, zip, thumbnail) VALUES ('$firstName', '$lastName', '$street', '$city', '$state', '$zip', '$img')";


	$query = mysqli_query($conn, $sql);


	if ($query === TRUE) {
	    echo "Record updated successfully";
	} else {
	    echo var_export($conn->error);
	}


	$conn->close();		

?>