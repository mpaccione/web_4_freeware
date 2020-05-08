<?php

	$headers = apache_request_headers();

	require("db_conn.php");

	////////////////////////
	// GET QUERY RESULTS //
	///////////////////////


		$all_result = mysqli_query($conn, "SELECT * FROM guests");

		
		// Parse Query Data
		if (mysqli_num_rows($all_result) > 0) {

			$all_guests = array();

		    while($row = mysqli_fetch_assoc($all_result)) {

		    	$guest = array(
					    		'id' => $row["id"], 
					    		'firstName' => $row["firstName"], 
					    		'lastName' => $row["lastName"],
					    		'street' => $row["street"],
					    		'city' => $row['city'],
					    		'stateOrProvince' => $row['stateOrProvince'],
					    		'zip' => $row['zip'],
					    		'img' => $row['thumbnail']
					    	);

		    	$all_guests[] = $guest;
		    }
		}

		// XML
		if ($headers['Accept'] == 'application/xml') {

			foreach ($all_guests as $guests) {

				echo "<guest>\n";

				foreach ($guest as $columnName => $value) {
					echo "<${solumnName}" . htmlentities($value) . "</${columnName}>\n";
				}

				echo "</guests>\n";
				
			}
		} else {
			echo json_encode($all_guests);
		}


	$conn->close();

?>