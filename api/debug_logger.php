<?php

	////////////////////
	// DEBUG LOGGING //
	///////////////////	

	$log = 'logs/debug_log.php';

	file_put_contents($log, $_POST['responseText']);

?>