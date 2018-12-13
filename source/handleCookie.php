<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8"/>
        <title>Read Cookie from Javascript and Translate into PHP</title>
    </head>
    <body>
        <?php
        include("config.php");

        // Establishing connection with server (server_name, user_id, password)
        //$connection = mysqli_connect($servername, $username, $password);
        // Selecting database
        //$db = mysqli_select_db($connection, $dbname);
        // Retrieve data
        $text = $_COOKIE["userdata"];
        $userdata = json_decode($text);
        $user = $userdata->username;
        $pass = $userdata->password;
        $fullname = $userdata->fullname;
        $email = $userdata->email;
        $role = "user";
        $shield = 100;

        // Used for MySQL injection protection
        $user = stripslashes($user);
        $pass = stripslashes($pass);
        $user = mysqli_real_escape_string($connection, $user);
        $pass = mysqli_real_escape_string($connection, $pass);

        // Insert into database                 
        $sql = "INSERT INTO VerticalShooter_entity_user (username, password, role, fullname, email, shield)
            VALUES ('$user', '$pass', '$role', '$fullname', '$email', '$shield')";

        // Test if the account was created successfully
        if (mysqli_query($connection, $sql)) {
            header("location: index.php?create=success"); // Redirecting to home page with success
        } else {
            header("location: index.php?create=error"); // Redirecting to home page with error
        }

        // Closing Connection
        mysqli_close($connection);
        ?>    
    </body>
</html>
