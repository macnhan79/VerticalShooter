<?php
    include("config.php");

    // Starting Session
    session_start();

    // Variable to store an error message
    $error='';

    // Check if _POST was set
    if (isset($_POST['submit'])) {
	// Check if _POST contains any empty fields
        if (empty($_POST['username']) || empty($_POST['password'])) {
            $error = "Username or Password is invalid"; // Set error message
        }
        else {
            // Establishing connection with server (server_name, user_id, password)
            //$connection = mysqli_connect($servername, $username, $password);

            // Selecting database
            //$db = mysqli_select_db($connection, $dbname);
            
            // Define $username and $password
             $user=$_POST['username'];
            $pass=$_POST['password']; 

            // Used for MySQL injection protection
            $user = stripslashes($user);
            $pass = stripslashes($pass);
            $user = mysqli_real_escape_string($connection, $user);
            $pass = mysqli_real_escape_string($connection, $pass);
            
            //Encypting for DB
            $pass = sha1($pass);
            
            // Insert into database                 
            //$sql = "INSERT INTO VerticalShooter_entity_user (username, password, role)
            //VALUES ('$user', '$pass', 'user')";
            //mysqli_query($connection, $sql);
            
            // SQL query to fetch information of registerd users and finds user match.
            $query = mysqli_query($connection, "select * from VerticalShooter_entity_user where password='$pass' AND username='$user'");
            $rows = mysqli_num_rows($query);
			
            // Check if information was retrieved
            if ($rows == 1) {
		// Initializing session
                $_SESSION['login_user']=$user;
				
                //Retrieve data and put into a string
                while($row = mysqli_fetch_array($query)) { 
                        $role = $row["role"];
                }   

                // If admin, redirect to admin page
                if($role=="admin"){
                        header("location: admin.php");  // Redirect
                } 
                //Otherwise redirecting to home page
                else {
                    header("location: profile.php");
                }
            }
            else {
                $error = "Username or Password is invalid"; // Set error message
            }

            // Closing Connection
            mysqli_close($connection);
        }
    }
?>