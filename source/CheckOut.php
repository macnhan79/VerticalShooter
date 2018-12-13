<?php
include('session.php');

if (isset($_POST['submit'])) {
    //echo "abc";
    $shield = 0;
    if (isset($_SESSION['cart'])) {
        $arrCount = count($_SESSION['cart']);
        for ($i = 0; $i < $arrCount; $i++) {
            $id = $_SESSION['cart'][$i];
            $sql = "SELECT * FROM VerticalShooter_entity_shield where id = $id";
            $result = mysqli_query($connection, $sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $shield += $row['value'];
            }
        }
        //update shield to database
        $sql = "update VerticalShooter_entity_user set shield = shield + $shield where username = '$login_session'";
        if (mysqli_query($connection, $sql)) {
            mysqli_close($connection);
            unset($_SESSION['cart']);
            header("location: profile.php"); // Redirecting to home page with success
        }
    }
}
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Update account</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <script type="text/javascript" src="sha1.js"></script>
    </head>

    <body>
        <div class="topright">
            <a href="shopping.php">
                <div id="logout">Continue Shopping</div>
            </a>      
            <a href="index.php">
                <div id="logout">Back to Homepage</div>
            </a>      
        </div>              


        <br>
        <h1 id="title">Check Out</h1><br>       
        <br>

        <div id="create">  
            <form name="myForm" action="CheckOut.php" method="POST">
                <?php
                $total = 0;
                if (isset($_SESSION['cart'])) {
                    $arrCount = count($_SESSION['cart']);


                    echo"<table border ='1'>";
                    echo"<tr>"
                    . "<td>Shield</td>"
                    . "<td>Amount</td>"
                    . "</tr>";
                    for ($i = 0; $i < $arrCount; $i++) {
                        $id = $_SESSION['cart'][$i];
                        $value = 0;
                        $shield = 0;
                        $sql = "SELECT * FROM VerticalShooter_entity_shield where id = $id";
                        $result = mysqli_query($connection, $sql);
                        while ($row = mysqli_fetch_assoc($result)) {
                            $total += $row['amount'];
                            $shield += $row['value'];
                            $value = $row['value'];
                            $amount = $row['amount'];
                        }
                        echo"<tr><td>{$value}</td>"
                        . "<td>\${$amount}</td>"
                        . "</tr>";
                    }
                    echo"<tr>"
                    . "<td>Total</td>"
                    . "<td>\${$total}</td>"
                    . "</tr>";
                    echo"</table>";
                }
                ?>
                <p>You buy total: <?php echo $shield; ?> shield. You have to pay $<?php echo $total; ?>.</p>
                <button id="createbutton" name="submit" type="submit">Check Out</button>
            </form>
        </div>  

    </body>
</html>