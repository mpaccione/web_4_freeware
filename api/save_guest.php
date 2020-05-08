<?php

	require("db_conn.php");

	////////////////////////
	// GET QUERY RESULTS //
	///////////////////////

	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];
	$email = $_POST['email'];
	$street = $_POST['street'];
	$city = $_POST['city'];
	$stateOrProvince = $_POST['stateOrProvince'];
	$zip = $_POST['zip'];
	$img = $_FILES["img"];
	$upload = $_SERVER['DOCUMENT_ROOT']."/wp-content/themes/webdev/projects/Web_Design_4/Single_Page_Applications/uploaded_img/".$img['name'];
	$uploadUrl = "http://mpaccione.com/wp-content/themes/webdev/projects/Web_Design_4/Single_Page_Applications/uploaded_img/".$img['name'];

	$varArr = array($firstName, $lastName, $email, $street, $city, $stateOrProvince, $zip, $img);

	/////////////////////
	// IMAGE RESIZING //
	////////////////////

	// function resize_jpg($file) {
	//    list($width, $height) = getimagesize($file);
	//    $src = imagecreatefromjpeg($file);
	//    $dst = imagecreatetruecolor($w, $h);
	//    imagecopyresampled($dst, $src, 0, 0, 0, 0, 100, 100, $width, $height);
	//    return $dst;
	// }

	// function resize_png($file) {
	//    list($width, $height) = getimagesize($file);
	//    $src = imagecreatefrompng($file);
	//    $dst = imagecreatetruecolor($w, $h);
	//    imagecopyresampled($dst, $src, 0, 0, 0, 0, 100, 100, $width, $height);
	//    return $dst;
	// }

	// function resize_gif($file) {
	//    list($width, $height) = getimagesize($file);
	//    $src = imagecreatefromgif($file);
	//    $dst = imagecreatetruecolor($w, $h);
	//    imagecopyresampled($dst, $src, 0, 0, 0, 0, 100, 100, $width, $height);
	//    return $dst;
	// }


	// if ($img["type"] == "image/jpeg") { $img = resize_jpg($img); }
	// elseif ($img["type"] == "image/png") { $img = resize_png($img); }
	// elseif ($img["type"] == "image/gif") { $img = resize_gif($img); }
	// else { var_dump("Error With image Filetype! Not a JPG, PNG, or GIF."); }

	$log = 'logs/debug_log.php';
	file_put_contents($log, $upload);

	move_uploaded_file($img["tmp_name"], $upload);

	/////////////////////
	// UPDATE DATABASE //
	////////////////////

	$sql = mysqli_query($conn, "INSERT INTO guests (firstName, lastName, street, city, stateOrProvince, zip, thumbnail) VALUES ('${firstName}', '${lastName}', '${street}', '${city}', '${stateOrProvince}', '${zip}', '${uploadUrl}')");

	
	$query = mysqli_query($conn, $sql);


	if ($query === TRUE) {
	    echo "Record updated successfully";
	} else {
	    echo var_export($conn->error);
	}


	$conn->close();

?>