<?php
include_once "db.php";
$data = $_POST['data'];
$result = json_decode($data, true);
if(isset($result)){
    $id = $result['id'];
    try{
        //build query
        $delete_query = "DELETE students,courses,grades FROM grades JOIN courses ON courses.id = grades.course_id JOIN students ON grades.student_id = students.id WHERE grades.student_id = :id";
        //prepare query
        $statement = $conn->prepare($delete_query);
        //execute the statement
        $statement->execute(array(":id" => $id));
        if($statement){
            echo "Record have been deleted";
        }
    }catch(PDOException $e){
        echo ("Error has occured".$e->getMessage());
    }
}
?>
