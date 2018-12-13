<?php
//include "connect.php";
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
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Admin: <?php echo $login_session; ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="style.css">
        <script>
            function confirmDelete() {
                return confirm("Are you sure want to delete this user?");
            }
        </script>
    </head>
    <body>
        <div id="profile">
            <div class="topright">
                <label>Admin: <i><?php echo $login_session; ?></i></label>

                <a href="logout.php">
                    <div id="logout">Log out</div>
                </a>
                <a href="profile.php">
                    <div id="logout">Main menu</div>
                </a> 
            </div>
        </div>

        <br><br>
        <div id="playertitle"><i>Admin:</i> <b><?php echo $login_session; ?></b></div>
        <br><br>

        <div id="admin">
            <div style="display: table; margin: auto">
                <a href="UsersManagement.php">
                    <div id="logout">Users Management</div>
                </a>
                <a href="ShieldManagement.php">
                    <div id="logout">Shield Management</div>
                </a>  
            </div>

        </div>

    </body>
</html>