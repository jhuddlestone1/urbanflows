<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/plain');
$query = isset($_SERVER['QUERY_STRING']) ? escapeshellarg('&'.$_SERVER['QUERY_STRING']) : '';
passthru('curl "https://sheffield-portal.urbanflows.ac.uk/uflobin/ufdex0A?action=CSV_show"'.$query);