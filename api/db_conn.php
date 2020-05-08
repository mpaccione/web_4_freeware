<?php	
	// Live Server
	// $servername = "localhost";
	// $username = "mapaccio_web4";
	// $password = "rspaccio";
	// $db = "mapaccio_rsvp";

	// Local Server
	$servername = "localhost";
	$username = "root";
	$password = "";
	$db = "rsvp_guests";



	/////////////
	// CONNECT //
	/////////////



		// Create connection
		$conn = mysqli_connect($servername, $username, $password);
		mysqli_set_charset( $conn, 'utf8');
		mysqli_select_db($conn, $db);

		// Check connection
		if (!$conn) {
		    die("Connection failed: " . mysqli_connect_error());
		}
?>