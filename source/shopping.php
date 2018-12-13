<?php
include('session.php');

if (isset($_POST['shield'])) {
    $shieldAdd = $_POST['shield'];
    //Make sure that the session variable actually exists!
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = array();
        $arr = $_SESSION['cart'];
        array_push($arr, $shieldAdd);
        $_SESSION['cart'] = $arr;
        header("location: CheckOut.php");
    } else {
        $arr = $_SESSION['cart'];
        array_push($arr, $shieldAdd);
        $_SESSION['cart'] = $arr;
        header("location: CheckOut.php");
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
            <a href="CheckOut.php">
                <div id="logout">Your Cart</div>
            </a> 
            <a href="index.php">
                <div id="logout">Back to Homepage</div>
            </a>      
        </div>              


        <br>
        <h1 id="title">Upgrade your shield</h1><br>       
        <br>

        <div id="create">  
            <form name="myForm" action="shopping.php" method="POST">
                <div class="container">
                    <label for="username">Select your extra shield</label>
                    <select id="shield" name="shield">
                        <?php
                        $sql = "SELECT * FROM VerticalShooter_entity_shield";
                        $result = mysqli_query($connection, $sql);
                        while ($row = mysqli_fetch_assoc($result)) {
                            echo "<option value='{$row['id']}'>{$row['value']} shield = \${$row['amount']}</option>";
                        }
                        ?>
                    </select>
                    <button id="createbutton" type="submit">Add to your cart</button>
                    <br>  
                </div>   
            </form>
        </div>  

    </body>
</html>