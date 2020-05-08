<?php

	if ( isset( $_COOKIE['eventCookie'] ) ){

		$res = array(
			"registered" => true,
			"cookie" => $_COOKIE['eventCookie']
		);

	} else {

		if ( isset( $_POST['guestID'] ) ){

			setcookie('eventCookie', $_POST['guestID'], time() + 31556926 , '/');
	
			$res = array(
				"registered" => true,
				"cookie" => $_COOKIE['eventCookie']
			);

		} else {

			$res = array(
				"registered" => false,
				"guestID" => $_POST['guestID']
			);

		}
	}

	echo json_encode($res);

?>