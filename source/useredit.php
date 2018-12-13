<?php
include('session.php');
// SQL query to fetch information of registerd users and finds user match.
$query = mysqli_query($connection, "select role from VerticalShooter_entity_user where username='$login_session'");

//Retrieve data and put into a string
while ($row = mysqli_fetch_array($query)) {
    $role = $row["role"];
}

// If role is not admin
if ($role != "admin") {
    header("location: profile.php");
}

if (empty($_GET['username']) || empty($_GET['action']) && ( $_GET['action'] != "edit" || $_GET['action'] != "delete" || $_GET['action'] != "update")) {
    //echo $action . "||" . $user;
    header("location: admin.php");
} else {
    // Define $username and $action
    $user = $_GET['username'];
    $action = $_GET['action'];

    // Used for MySQL injection protection
    $user = stripslashes($user);
    $user = mysqli_real_escape_string($connection, $user);

    
    //
    //action delete
    //
    if ($action == "delete") {
        $sql = "delete from VerticalShooter_entity_user where username = '$user'";
        if (mysqli_query($connection, $sql)) {
            mysqli_close($connection);
            header("location: UsersManagement.php"); // Redirecting to home page with success
        }
    }
    //
    //action view
    if ($action == "edit") {
        $sql = mysqli_query($connection, "select * from VerticalShooter_entity_user where username='$user'");

        //Retrieve data and put into a string
        while ($row = mysqli_fetch_array($sql)) {
            $fullname = empty($row["fullname"]) ? "" : $row["fullname"];
            $email = empty($row["email"]) ? "" : $row["email"];
            $shield = empty($row["shield"]) ? 0 : $row["shield"];
        }
    }
    //
    //action update
    //
    $error = '';
    if ($action == "update") {

        $pass = $_GET['pswd1'];
        $pass2 = $_GET['pswd2'];
        $fullname = $_GET['fullname'];
        $email = $_GET['email'];
        
        $shield = $_GET['shield'];
        if ($pass != "") {
            $regexPass = '/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{6,20})/';
            if ($pass != $pass2)
                $error = "Passwords don't match";
            if (!preg_match($regexPass, $pass))
                $error = "You have entered an invalid password!";
            $pass = sha1($pass);
        } else {
            $sql = mysqli_query($connection, "select * from VerticalShooter_entity_user where username='$user'");
            while ($row = mysqli_fetch_array($sql)) {
                $pass = $row["password"];
            }
        }
        $regexEmail = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';
        if (!preg_match($regexEmail, $email)) {
            $error = "You have entered an invalid email address!";
        }

        if ($error == '') {
            $sql = "update VerticalShooter_entity_user "
                    . " set password = '$pass' , email = '$email' , fullname = '$fullname' , shield = $shield "
                    . " where username = '$user'";
            if (mysqli_query($connection, $sql)) {
                mysqli_close($connection);
                header("location: UsersManagement.php"); // Redirecting to home page with success
            }
        }
    }
}
?>

<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Update account</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <script type="text/javascript" src="sha1.js"></script>
    </head>

    <body>
        <div class="topright">
            <a href="index.php">
                <div id="logout">Back to Homepage</div>
            </a>      
        </div>              


        <br>
        <h1 id="title">Update an Account</h1><br>       
        <br>
        <div id="createprompt">    
            <h1 id="error" style='color: red;'><?php echo $error; ?></h1>
        </div> 
        <div id="create">  
            <form name="myForm" action="useredit.php" method="GET" onsubmit="return(checkForm());">
                <div class="container">
                    <label for="username">Username</label>
                    <input id="username" type="text" readonly="true" placeholder="Enter Username" name="username" value="<?php echo $user; ?>">

                    <label for="password">Password (Blank if password does not change)</label>
                    <input id="pswd1" type="password" placeholder="Enter Password" name="pswd1">

                    <label for="password">Confirm Password</label>
                    <input id="pswd2" type="password" placeholder="Confirm Password" name="pswd2">

                    <label for="fullname">Fullname</label>
                    <input id="fullname" type="text" placeholder="Enter Fullname" name="fullname" value="<?php echo $fullname; ?>">

                    <label for="email">Email</label>
                    <input id="email" type="text" placeholder="Enter Email" name="email" value="<?php echo $email; ?>">
                    
                    <label for="shield">Shield</label>
                    <input onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" id="shield" type="text" placeholder="Enter Shield" name="shield" value="<?php echo $shield; ?>" required>

                    <input type="hidden" id="action" name="action" value="update"/>
                    <button id="createbutton" type="submit">Submit</button><br>  
                </div>   
            </form>
        </div>  




        <br>
        <div id="passreqs">
            <i>Password must contain:</i>
            <ul>
                <li>6 to 20 characters</li>
                <li>1 capital letter</li>
                <li>1 lower case letter</li>
                <li>1 of @#$%!</li>
            </ul>
        </div>

    </body>
</html>