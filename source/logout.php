<?php
    // Start session
    session_start();
    
    // Destroying all sessions
    if(session_destroy()) {
        header("Location: index.php"); // Redirecting to home page
    }
?>