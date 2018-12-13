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
                <a href="admin.php">
                    <div id="logout">Admin Management</div>
                </a>  
            </div>
        </div>

        <br><br>
        <div id="playertitle"><i>Admin:</i> <b><?php echo $login_session; ?></b></div>
        <br><br>

        <div id="admin">
            <p>Update Users</p>
            <?php
            $sql = "SELECT * FROM VerticalShooter_entity_user where role = 'user'";
            $result = mysqli_query($connection, $sql);
            echo"<table border ='1'>";
            echo"<tr>"
            . "<td></td>"
            . "<td>Username</td>"
            . "<td>Full Name</td>"
            . "<td>Email</td>"
            . "<td>Shield</td>"
            . "</tr>";
            while ($row = mysqli_fetch_assoc($result)) {
                echo"<tr><td><a href = 'useredit.php?username={$row['username']}&action=edit'>Edit</a> "
                . "<a onclick='return confirmDelete();' href = 'useredit.php?username={$row['username']}&action=delete'>Delete</a>"
                . "</td>"
                . "<td>{$row['username']}</td>"
                . "<td>{$row['fullname']}</td>"
                . "<td>{$row['email']}</td>"
                . "<td>{$row['shield']}</td></tr>";
            }
            echo"</table>";
            // Close connection
            mysqli_close($connection);
            ?>
        </div>

    </body>
</html>