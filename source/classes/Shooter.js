//constructor
function Shooter(game) {
    this.game = game;
}

Shooter.prototype.create = function() {
    //create the shooter group and set its properties
    this.shooters = game.add.group();
    this.shooters.enableBody = true;
    this.shooters.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooters.createMultiple(30, 'shooter');
    this.shooters.setAll('anchor.x', 0.5);
    this.shooters.setAll('anchor.y', 0.5);
    this.shooters.setAll('scale.x', 0.5);
    this.shooters.setAll('scale.y', 0.5);
    this.shooters.setAll('angle', 180);
    this.shooters.forEach(function(enemy) {
        enemy.damageAmount = 5;
        });
    //create shooter bullets
    this.createShooterBullets();

    //launch shooter enemies
    game.time.events.loop(7000, this.launchShooter, this.getShooters());
};

Shooter.prototype.createShooterBullets = function() {
    //create the bullet group
    shooterBullets = game.add.group();
    shooterBullets.enableBody = true;
    shooterBullets.physicsBodyType = Phaser.Physics.ARCADE;
    shooterBullets.createMultiple(30, 'shooterBullet');
    shooterBullets.callAll('crop',null, {
        x: 90,
        y: 0,
        width: 90,
        height: 70
    });
    shooterBullets.setAll('alpha', 0.9);
    shooterBullets.setAll('anchor.x', 0.5);
    shooterBullets.setAll('anchor.y', 0.5);
    shooterBullets.setAll('outOfBoundsKill', true);
    shooterBullets.setAll('checkWorldBounds', true);
    shooterBullets.forEach(function(enemy) {
        enemy.body.setSize(20, 20);
    });       
};

Shooter.prototype.launchShooter = function() {
    var startingX = game.rnd.integerInRange(100, game.width - 100);
    var verticalSpeed = 180;
    var spread = 60;
    var frequency = 70;
    var verticalSpacing = 70;
    var numEnemiesInWave = 5;

    //launch shooter enemy wave
    for (var i = 0; i < numEnemiesInWave; i++) {
        var enemy = this.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = verticalSpeed;

            //initiate firing
            var bulletSpeed = 200;
            var firingDelay = 3000;
            enemy.bullets = 1;
            enemy.lastShot = 0;

            //update for each enemy
            enemy.update = function() {
                //move in waves
                this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;
                //illusion of banking
                var bank = Math.cos((this.y + 60) / frequency);
                this.scale.x = 0.5 - Math.abs(bank) / 8;
                this.angle = 180 - bank * 2;

                //fire bullets
                var enemyBullet = shooterBullets.getFirstExists(false);
                if (enemyBullet && fighter.getAlive() && shooterBullets &&
                    this.y > game.width / 8 &&
                    game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = game.time.now;
                        this.shooterBullets--;
                        enemyBullet.reset(this.x, this.y + this.height / 2);
                        enemyBullet.damageAmount = this.damageAmount;
                        var angle = game.physics.arcade.moveToObject(enemyBullet, fighter.getFighter(), bulletSpeed);
                        enemyBullet.angle = game.math.radToDeg(angle);    
                    }
                //check if bullet hits fighter
                game.physics.arcade.overlap(fighter.getFighter(), shooterBullets, fighter.enemyShootsFighter, null, this); 
             
                //kill when enemies go off screen
                if (this.y > game.height + 200) {
                    this.kill();
                    this.y = -20;
                }

            };
        }
    }
}; 

Shooter.prototype.getShooters = function() {
    return this.shooters;
};




