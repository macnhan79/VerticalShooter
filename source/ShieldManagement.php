<?php
//include "connect.php";
include('session.php');
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
                return confirm("Are you sure want to delete this shield?");
            }
        </script>
    </head>
    <body>

        <?php
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
            <p>Shield Management</p>
            <?php
            $sql = "SELECT * FROM VerticalShooter_entity_shield";
            $result = mysqli_query($connection, $sql);
            echo"<table border ='1'>";
            echo"<tr>"
            . "<td><a href = 'ShieldEdit.php?action=new'>Add New</a></td>"
            . "<td>Value</td>"
            . "<td>Amount ($)</td>"
            . "</tr>";
            while ($row = mysqli_fetch_assoc($result)) {
                echo"<tr>"
                . "<td><a href = 'ShieldEdit.php?action=edit&id={$row['id']}'>Edit</a> "
                . "<a onclick='return confirmDelete();' href = 'ShieldEdit.php?action=delete&id={$row['id']}'>Delete</a>"
                . "</td>"
                . "<td>{$row['value']}</td>"
                . "<td>\${$row['amount']}</td>";
            }
            echo"</table>";
            // Close connection
            mysqli_close($connection);
            ?>
        </div>

    </body>
</html>