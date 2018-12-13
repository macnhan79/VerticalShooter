<?php
include('session.php');
$query = mysqli_query($connection, "select shield from VerticalShooter_entity_user where username='$login_session'");

//Retrieve data and put into a string
while ($row = mysqli_fetch_array($query)) {
    $shield = $row["shield"];
}
if ($shield === NULL || $shield < 0) {
    $shield = 100;
}
echo "<script> var shieldship = $shield </script>";
?>

<!DOCTYPE html>
<html>
    <head>
        <title>2d Vertical Shooter</title>
        <meta name="description" content="2d vertical shooter made with Phaser.js">
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <style>
            .body {
                text-align: center;
            }
            canvas { 
                margin: 0 auto; 
                display: block;
            }
        </style>
    </head>
    <body>
        <?php
        // SQL query to fetch information of registerd users and finds user match.
        $query = mysqli_query($connection, "select role from VerticalShooter_entity_user where username='$login_session'");

        //Retrieve data and put into a string
        while ($row = mysqli_fetch_array($query)) {
            $role = $row["role"];
        }

        // Close connection
        //mysqli_close($connection);
        ?>
        <div class="gametable">
            <div class="topright">
                <label>Welcome <?php echo $role ?> <i><?php echo $login_session; ?> !</i></label>
                <a href="logout.php">
                    <div id="logout">Log out</div>
                </a> 
                <a href="profile.php">
                    <div id="logout">Main menu</div>
                </a> 
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div class ="game">
                <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.12.0/phaser.min.js"></script>-->
                <script src="http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js" type="text/javascript"></script>
                <script src="app.js" type="text/javascript"></script>
            </div>
        </div>
        <div style='float:left'>
            <?php
            $sql = "SELECT username, MAX(score) FROM VerticalShooter_entity_score GROUP BY username ORDER BY MAX(score) DESC LIMIT 10";
            $result = mysqli_query($connection, $sql);
            echo"<table border ='1'>";
            echo"<tr><td>Name:</td><td>Score:</td></tr>";
            while ($row = mysqli_fetch_assoc($result)) {
                echo"<tr><td>{$row['username']}</td><td>{$row['MAX(score)']}</td></tr>";
            }
            echo"</table>";
            // Close connection
            mysqli_close($connection);
            ?>        
        </div>
    </body>
</html>