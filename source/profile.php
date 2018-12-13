<?php
include('session.php');
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Welcome <?php echo $login_session; ?>!</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <body>

        <?php
// SQL query to fetch information of registerd users and finds user match.
        $query = mysqli_query($connection, "select role from VerticalShooter_entity_user where username='$login_session'");
        $role = '';
        //Retrieve data and put into a string
        while ($row = mysqli_fetch_array($query)) {
            $role = $row["role"];
        }
        ?>

        <div id="profile">
            <div class="topright">
                <label>Welcome <?php echo $role ?> <i><?php echo $login_session; ?> !</i></label>
                <a href="logout.php">
                    <div id="logout">Log out</div>
                </a>
                <?php
                if ($role == 'admin') {
                    echo"<a href='admin.php'>"
                    . "<div id='logout'>Admin Management</div>"
                    . "</a>";
                }
                ?>
            </div>              
        </div>  

        <br><br>
        <div id="playertitle"><i>Player:</i> <b><?php echo $login_session; ?></b></div>
        <br><br>

        <div class="container">
            <a href="game.php">
                <div id="startgame">Start the game!</div>
            </a>      
        </div>    
        <div class="container">
            <a href="scores.php">
                <div id="topScores">Top Scores!</div>
            </a>      
        </div>
        <div class="container">
            <a href="shopping.php">
                <div id="topScores">Shopping!</div>
            </a>      
        </div>  
        <?php
        $sql = "SELECT username, score, date FROM VerticalShooter_entity_score WHERE username LIKE '%{$login_session}%'";
        $result = mysqli_query($connection, $sql);
        echo"<table border ='1'>";
        echo"<tr><th colspan=\"3\">Your Scores:</th></tr>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo"<tr><td>{$row['username']}</td><td>{$row['score']}</td><td>{$row['date']}</td></tr>";
        }
        echo"</table>";
        // Close connection
        mysqli_close($connection);
        ?>        
    </body>
</html>