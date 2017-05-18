
<?php
include_once "db.php";
$data = $_POST['data'];
$result = json_decode($data, true);

if(!empty($result['name'] && !empty($result['course'] && !empty($result['grade'])))){
    $name = $result['name'];
    $course = $result['course'];
    $grade = $result['grade'];
    try{
        //build query
        $insertQuery = "INSERT INTO `students`(`id`, `name`, `created`, `modified`) VALUES (null, :name , now(), null); ";
        $insertQuery .= "INSERT INTO `courses`(`id`, `name`, `instructor_id`) VALUES (null, :course, 3); ";
        $insertQuery .= "INSERT INTO `grades`(`id`,`student_id`,`course_id`,`grade`,`created`,`modifed`) VALUES (null, (SELECT id FROM `students` ORDER BY id DESC LIMIT 1), (SELECT id FROM `courses` ORDER BY id DESC LIMIT 1), :grade, now(), null); ";

        //prepare query
        $statement = $conn->prepare($insertQuery);
        //execute the statement
        $statement->execute(array(":name"=>$name,":course"=>$course,":grade" => $grade));
        $id = $conn->lastInsertId();
        $output = ['id'=>$id];
        if($statement){
            $output[]['message'] = 'record inserted';
            echo json_encode($output);
        }
    }catch(PDOException $e){
        echo ("Error has occured".$e->getMessage());
    }
}else{
    $output = [];
    $output[]['message']='please enter valid input';
    echo json_encode($output);
}
?>

