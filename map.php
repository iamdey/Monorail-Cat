<?php

$mode='rw';

// Récupérer une map
if((strpos($mode, 'r') !== false) && array_key_exists('GET', $_REQUEST)) {
	$id = $_REQUEST['GET'];
	$filename = 'maps/'.trim($id).'.csv';
	if(is_readable($filename)) {
		echo file_get_contents($filename);
	}
}

// Sauvegarder une map
if((strpos($mode, 'w') !== false) && array_key_exists('PUT', $_REQUEST)) {
	$id = $_REQUEST['PUT'];
	$content = $_POST['content'];
	$filename = 'maps/'.$id.'.csv';
	if((is_writable($filename)) || (is_writable('maps') && !file_exists($filename))) {
		file_put_contents($filename, $content);
		echo 'OK';
	} else {
		echo 'ERROR'."\n";
		echo 'PUT = '.$id."\n";
		echo 'content = '.$content."\n";
	}
}

?>
