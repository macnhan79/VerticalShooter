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
// include("config.php");
// Establishing connection with server (server_name, user_id, password)
//$connection = mysqli_connect($servername, $username, $password);
// Selecting database
//$db = mysqli_select_db($connection, $dbname);
// SQL query to fetch information of registerd users and finds user match.
$query = mysqli_query($connection, "select role from VerticalShooter_entity_user where username='$login_session'");

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
                <a href="profile.php">
                    <div id="logout">Main menu</div>
                </a> 
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
    </body>
</html>