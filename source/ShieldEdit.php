<?php
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

if (empty($_GET['action']) && ($_GET['action'] != "new" || $_GET['action'] != "edit" || $_GET['action'] != "delete" || $_GET['action'] != "update")) {
    header("location: admin.php");
} else {

    $action = $_GET['action'];
    $value = '';
    $amount = '';
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    } else {
         $id = 0;
    }
    //
    //delete action
    //
    if ($action == "delete") {
        if ($id == 0) {
            header("location: ShieldManagement.php");
        }
        //delete to database
        $sql = "delete from VerticalShooter_entity_shield where id = $id";
        if (mysqli_query($connection, $sql)) {
            mysqli_close($connection);
            header("location: ShieldManagement.php"); // Redirecting to home page with success
        }
    }
    //
    //Edit action
    //
    if ($action == "edit") {
        //check id
        if ($id == 0) {
            header("location: ShieldManagement.php");
        }

        $sql = mysqli_query($connection, "select * from VerticalShooter_entity_shield where id=$id");
        //Retrieve data and put into a string
        while ($row = mysqli_fetch_array($sql)) {
            $value = empty($row["value"]) ? 0 : $row["value"];
            $amount = empty($row["amount"]) ? 0 : $row["amount"];
        }
    }
    //
    //update action
    //
    $error = '';
    if ($action == "update") {
        $value = empty($_GET['value']) ? 0 : $_GET['value'];
        $amount = empty($_GET['amount']) ? 0 : $_GET['amount'];
        $id = empty($_GET['id']) ? 0 : $_GET['id'];
        if ($value == 0) {
            $error = "Value must be greater than 0.";
        }
        if ($amount == 0) {
            $error = "Amount must be greater than 0.";
        }
        if ($id == 0) {
            header("location: ShieldManagement.php");
        }
        //check id exist
        $sql = "SELECT username FROM user WHERE username = '$myusername' and password = '$mypassword'";
        $result = mysqli_query($connection, $sql);
        $count = mysqli_num_rows($result);
        if ($count == 0) {
            header("location: ShieldManagement.php");
        }
        //all info correct --> updateF
        if ($error == '') {
            $sql = "update VerticalShooter_entity_shield set value = $value , amount = $amount where id = $id";
            if (mysqli_query($connection, $sql)) {
                mysqli_close($connection);
                header("location: ShieldManagement.php"); // Redirecting to home page with success
            }
        }
    }
    //
    //new action
    //
    if ($action == "newadd") {
        $value = empty($_GET['value']) ? 0 : $_GET['value'];
        $amount = empty($_GET['amount']) ? 0 : $_GET['amount'];
        if ($value == 0) {
            $error = "Value must be greater than 0.";
        }
        if ($amount == 0) {
            $error = "Amount must be greater than 0.";
        }

        if ($error == '') {
            // Insert into database                 
            $sql = "INSERT INTO VerticalShooter_entity_shield (value, amount)
            VALUES ($value, $amount)";
            if (mysqli_query($connection, $sql)) {
                mysqli_close($connection);
                header("location: ShieldManagement.php"); // Redirecting to home page with success
            }
        }
    }
    if ($action == "new") {
        $action = "newadd";
    }
    if ($action == "edit") {
        $action = "update";
    }
}
?>

<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Update account</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <script type="text/javascript" src="sha1.js"></script>
    </head>

    <body>
        <div class="topright">
            <a href="index.php">
                <div id="logout">Back to Homepage</div>
            </a>      
        </div>              


        <br>
        <h1 id="title">
            <?php
            if ($action == "newadd") {
                echo "Add new sell shield";
            } else {
                echo "Update sell shield";
            }
            ?></h1><br>       
        <br>
        <div id="createprompt">    
            <h1 id="error" style='color: red;'><?php echo $error; ?></h1>
        </div> 
        <div id="create">  
            <form name="myForm" action="ShieldEdit.php" method="GET">
                <div class="container">
                    <label for="value">Value</label>
                    <input onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" id="value" type="text" placeholder="Enter Value" name="value" value="<?php echo $value; ?>">

                    <label for="amount">Amount ($)</label>
                    <input onkeypress="if ( isNaN( String.fromCharCode(event.keyCode) )) return false;" id="amount" type="text" placeholder="Enter Amount" name="amount" value="<?php echo $amount; ?>">

                    <input type="hidden" id="id" name="id" value="<?php echo $id; ?>"/>
                    <input type="hidden" id="action" name="action" value="<?php echo $action; ?>"/>
                    <button id="createbutton" type="submit">Submit</button><br>  
                </div>   
            </form>
        </div>  






    </body>
</html>