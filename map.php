<?php

$mode='rw';
$dir='maps';

// Récupérer la liste des maps
if(array_key_exists('GET', $_REQUEST)) {
	$list = '';
	if(is_dir($dir)) {
		if($dh=opendir($dir)) {
			while(($file=readdir($dh)) !== false) {
				if(substr($file, -4) == '.csv') {
					if(is_readable($dir.'/'.$file)) {
						$list .= substr($file, 0, -4)."\n";
					}
				}
			}
			closedir($dh);
		}
	}
	echo $list;
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
