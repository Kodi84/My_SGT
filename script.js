var student_array = [];
var  studentName;
var  studentCourse;
var  studentGrade;
var inputIds = ['#studentName','#course','#studentGrade'];
//when button add clicked
function add_button(){
    addStudent();
}

function cancel_button(){
    clearAddStudentForm();
}

function addStudent(){
    var student = {
        studentName:$(inputIds[0]).val(),
        studentCourse:$(inputIds[1]).val(),
        studentGrade:$(inputIds[2]).val(),
        studentId:null
    };
    clearAddStudentForm();
    create_student_api(student);
}

function create_student_api(obj){

    var data = {
        "name":obj.studentName,
        "course":obj.studentCourse,
        "grade":obj.studentGrade
    };
    $.ajax ({
        url:'create.php',
        type: 'POST',
        data: {data: JSON.stringify(data)},
        dataType:'json',
        success:function(student, result)
        {
            if(result[0].message == "please enter valid input"){
                $("#ajax_msg").css("display","block").delay(3000).slideUp(300).html(result[0].message);
            }else if (result[0].message == "record inserted"){
                $("#ajax_msg").css("display","block").delay(3000).slideUp(300).html(result[0].message);
                student_array.push(student);
                student.studentId = result.id;
                updateData();
            }
        }.bind(this,obj)
    });
}

function clearAddStudentForm() { //clear the form
    $(inputIds[0]).val(""); // input doesnt have text! that's why we used val("") to clear the form.
    $(inputIds[1]).val("");
    $(inputIds[2]).val("");
}

var average;
var sum;

function calculateAverage (){
    average=[];
    sum=0;
    for (var i = 0; i < student_array.length; i++){
       var calculation = parseInt(student_array[i].studentGrade); //use parseInt to convert string to number
        sum+=calculation;
    }
    return Math.round(sum/student_array.length*10)/10; //round number to the nearest decimal
}

function updateData (){
    var average = calculateAverage();
    $(".avgGrade").text(average);
    updateStudentList();
}

function updateStudentList (){
    $("tbody").text("");
    for (var i =0 ; i <student_array.length; i++){ //loop through each index in student_array
        addStudentToDom(student_array[i]);//append each object property in html
        calculateAverage();
    }
}

function addStudentToDom(studentObj){
    var first_td = $("<td>").text(studentObj.studentName);
    var second_td = $("<td>").text(studentObj.studentCourse);
    var third_td = $("<td>").text (studentObj.studentGrade);
    var forth_td = $("<td>");
    var new_tr = $("<tr>");
    studentObj.element = new_tr;
    //create delete button
    var new_input = $("<input>",{
       "type":'button',
        "class":'btn btn-danger',
        "value":'Delete',
        "data-id":studentObj.studentId

    });
    new_tr.append(first_td,second_td,third_td,forth_td);
    forth_td.append(new_input);
    $('tbody').append(new_tr);
}

function get_data(){
    student_array =[];
    $.ajax({
        dataType: 'json', //type of data you're expected to get back from server
        method: 'post',
        url:'read.php',
        success:function(result){

            var array_from_server = result.data;
            console.log('result from read.php',array_from_server);
            for (var i=0; i < array_from_server.length ; i++){
                var result_of_array = array_from_server[i];
                var new_student = {};
                new_student.studentName = result_of_array.name;
                new_student.studentGrade = result_of_array.grade;
                new_student.studentCourse = result_of_array.course;
                new_student.studentId = result_of_array.id;
                student_array.push(new_student);
            }
            updateData();
        }
    });
}
function delete_from_api(id){
    var data = {
        "id":id
    };
    $.ajax ({
        url:'delete.php',
        type: 'POST',
        data: {data: JSON.stringify(data)},
        dataType:'json',

        success:function(result)
        {
            if(result.success === true) {

            }else {
                console.log('error');
            }
        }
    });
    for (var i = 0; i < student_array.length; i++) {
        if (student_array[i].studentId === id) {
            console.log('loop called');
            var element = student_array[i].element;
            deleteFromDom(i,element);
        }
    }
}

function deleteFromDom(i,element){
    student_array.splice(i,1);
    updateData();
    $(element).remove();
}

$(document).ready(function(){
    studentName = $('#studentName');
    studentCourse = $('#course');
    studentGrade = $('#studentGrade');
    $('.student-list tbody').on('click','.btn-danger',function(){
        for (var i = 0 ; i < student_array.length ; i++){
            if(student_array[i].studentId == $(this).attr('data-id')){
                delete_from_api(student_array[i].studentId);
            }
        }
    });
    get_data();
});



