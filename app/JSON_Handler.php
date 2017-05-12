
<?php
    $str_json = file_get_contents('php://input');

    $obj = json_decode($str_json);

    $fileName = $obj->nombreArchivo;

    // $myfile = fopen("json/categoria.json", "w") or die("Unable to open file!");
    $myfile = fopen($fileName, "w") or die("Unable to open file!");

    fwrite($myfile, $str_json);
    fclose($myfile);
?>



