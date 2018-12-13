<?php
    //include("config.php");
    include("login.php"); // Includes Login Script
	
    // Checks for any open sessions and redirects
    if(isset($_SESSION['login_user'])) {        
		// Check for admin
       // Establishing connection with server (server_name, user_id, password)
       // $connection = mysqli_connect($servername, $username, $password);
        
        // Selecting database
        //$db = mysqli_select_db($connection, $dbname);
        
        //Retrieve data and put into a string
        while($row = mysqli_fetch_array($query)) { 
                $role = $row["role"];
        }   

        // If admin, redirect to admin page
        if($role=="admin"){
                header("location: admin.php");
        } 
        
        // Otherwise load the normal profile
        else {
            header("location: profile.php");
        }
        
        // Closing Connection
        mysqli_close($connection);
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title>CIS-17B - Vertical Shooter</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
    </head>
    
    <body> 
        <br>
        <h1 id="title">Vertical Shooter!</h1><br>       
        <br>
        
        <div id="login">    
            <form action="" method="post">
                <div class="container">
                    <label for="username">Username</label>
                    <input type="text" placeholder="Enter Username" name="username" required>

                    <label for="password">Password</label>
                    <input type="password" placeholder="Enter Password" name="password" required>
       
                    <button id="loginbutton" name="submit" type="submit" value=" Log in ">Log in</button><br>           
                    
                    <a href="newuser.html">
                        <div id="newuser">Sign up</div>
                    </a>   
                    
                    <span><?php echo $error; ?></span>    
                </div>    
            </form>   
        </div>       
        
    <div id="createprompt">        
        <?php 
            // Spacers
            echo "<br><br><br>";
            
            // Collect the url
            $url = "$_SERVER[REQUEST_URI]";

            // Check if any ?'s exist
            if(strpos($url, '?') !== false) {
                // If they do then check if the account was a success or not
                if($_GET['create'] == "success") {
                    echo '<h1 style="color: green">Successly created the account</h1>';
                }   
                if($_GET['create'] == "error") {
                    echo '<h1 style="color: red">Error creating the account</h1>';
                }
            }
        ?>
    </div>      
        
    </body>
</html>
