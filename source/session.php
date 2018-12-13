<?php
    include("config.php");

    // Establishing connection with server (server_name, user_id, password)
    //$connection = mysqli_connect($servername, $username, $password);
        
    // Selecting database
    //$db = mysqli_select_db($connection, $dbname);
	
    // Starting session
    session_start();

    // Storing session
    $user_check=$_SESSION['login_user'];
    
    // SQL query to fetch complete information of user
    $ses_sql=mysqli_query($connection, "select username from VerticalShooter_entity_user where username='$user_check'");
    $row = mysqli_fetch_assoc($ses_sql);
    $login_session =$row['username'];
	
    // If the session is set then redirection to home page
    if(!isset($login_session)) {
        mysqli_close($connection);     // Close connection
        header('Location: index.php'); // Redirect to home page
    }
?>