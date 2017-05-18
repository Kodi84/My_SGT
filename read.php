<?php
include_once "db.php";
try{
    $readQuery = "SELECT students.name,students.id,courses.name AS course,grades.grade FROM courses JOIN grades ON grades.course_id = courses.id JOIN students ON students.id = grades.student_id";
    $output = [];
    $statement = $conn->query($readQuery);
    while($row = $statement->fetch(PDO::FETCH_ASSOC)){
        $output["data"][]=$row;
    }
}catch(PDOException $e){
    echo ("Error has occured".$e->getMessage());
}
$output = json_encode($output);
print_r($output);
?>