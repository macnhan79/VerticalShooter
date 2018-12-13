var game = new Phaser.Game(800, 600, Phaser.CANVAS, '2d vertical shooter',
        {
            preload: preload,
            create: create,
            update: update,
            render: render
        });

var fighter;
var enemyShip;
var shooters;
var shooterBullets;
var starfield;
var cursors;
var bank;
var shipTrail;
var explosions;
var fighterDeath;
var bullets;
var fireButton;
var bulletTimer = 0;
var shields;
var score = 0;
var scoreText;
var enemyShipLaunchTimer;
var enemyShipSpacing = 1000;
var shooterTimer;
var shooterLaunched = false;
var shooterSpacine = 2500;
var boss;
var bossLaunchTimer;
var bossLaunched = false;
var bossSpacing = 20000;
var bossBulletTimer = 0;
var bossYdirection = -1;
var gameOver;
var submit;

var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

//load assets
function preload() {
    game.load.image('starfield', 'assets/starfield.gif');
    game.load.image('fighter', 'assets/fighter.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemyShip', 'assets/enemyShip.png');
    game.load.image('shooter', 'assets/shooter.png');
    game.load.image('shooterBullet', 'assets/enemyBullet.png');
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    game.load.bitmapFont('spacefont', 'assets/spacefont/spacefont.png', 'assets/spacefont/spacefont.xml');
    game.load.image('boss', 'assets/boss.png');
    game.load.image('deathRay', 'assets/deathRay.png');
}

var audio = new Audio('assets/sound effects/background_music.mp3');
audio.play();
function create() {
    //background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //create the bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //fighter
    fighter = game.add.sprite(400, 500, 'fighter');
    //add health
    fighter.health = shieldship;
    fighter.anchor.setTo(0.5, 0.5);
    //give fighter a standard arcade physics body
    game.physics.enable(fighter, Phaser.Physics.ARCADE);
    //give fighter more realistic movement
    fighter.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    fighter.body.drag.setTo(DRAG, DRAG);
    fighter.weaponLevel = 1;
    //when fighter dies, kill fighter trail
    fighter.events.onKilled.add(function () {
        shipTrail.kill();
    });
    //revive fighter on restart
    fighter.events.onRevived.add(function () {
        shipTrail.start(false, 5000, 10);
    });

    //create enemyShip enemies
    enemyShip = game.add.group();
    enemyShip.enableBody = true;
    enemyShip.physicsBodyType = Phaser.Physics.ARCADE;
    enemyShip.createMultiple(5, 'enemyShip');
    enemyShip.setAll('anchor.x', 0.5);
    enemyShip.setAll('anchor.y', 0.5);
    enemyShip.setAll('scale.x', 0.5);
    enemyShip.setAll('scale.y', 0.5);
    enemyShip.setAll('angle', 180);
    enemyShip.forEach(function (enemy) {
        addEnemyEmitterTrail(enemy);
        //adjust enemy bounding box
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
        //set enemy damage to fighter
        enemy.damageAmount = 20;
        enemy.events.onKilled.add(function () {
            enemy.trail.kill();
        });
    });

    //create enemyShip enemies recursively
    game.time.events.add(1000, launchShipEnemy);

    //create shooter enemy bullets
    shooterBullets = game.add.group();
    shooterBullets.enableBody = true;
    shooterBullets.physicsBodyType = Phaser.Physics.ARCADE;
    shooterBullets.createMultiple(30, 'shooterBullet');
    shooterBullets.callAll('crop', null, {
        x: 90,
        y: 0,
        width: 90,
        height: 70
    });
    shooterBullets.setAll('alpha', 0.9);
    shooterBullets.setAll('anchor.x', 0.5);
    shooterBullets.setAll('anchor.y', 0.5);
    shooterBullets.setAll('outOfBoundsKill', true);
    shooterBullets.setAll('checkWorldBound', true);
    shooterBullets.forEach(function (enemy) {
        enemy.body.setSize(20, 20);
    });


    //create shooter enemies
    shooters = game.add.group();
    shooters.enableBody = true;
    shooters.physicsBodyType = Phaser.Physics.ARCADE;
    shooters.createMultiple(30, 'shooter');
    shooters.setAll('anchor.x', 0.5);
    shooters.setAll('anchor.y', 0.5);
    shooters.setAll('scale.x', 0.5);
    shooters.setAll('scale.y', 0.5);
    shooters.setAll('angle', 180);
    shooters.forEach(function (enemy) {
        enemy.damageAmount = 40;
    });

    //create boss
    boss = game.add.sprite(0, 0, 'boss');
    boss.exists = false;
    boss.alive = false;
    boss.anchor.setTo(0.5, 0.5);
    boss.damageAmount = 50;
    boss.angle = 180;
    boss.scale.x = 0.6;
    boss.scale.y = 0.6;
    game.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.maxVelocity.setTo(100, 80);
    boss.dying = false;
    boss.finishOff = function () {
        if (!boss.dying) {
            boss.dying = true;
            bossDeath.x = boss.x;
            bossDeath.y = boss.y;
            bossDeath.start(false, 1000, 50, 20);
            //after exlosions kill boss
            game.time.events.add(1000, function () {
                var explosion = explosions.getFirstExists(false);
                var beforeScaleX = explosions.scale.x;
                var beforeScaleY = explosions.scale.y;
                var beforeAlpha = explosions.alpha;
                explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
                explosion.alpha = 0.4;
                explosion.scale.x = 3;
                explosion.scale.y = 3;
                var animation = explosion.play('explosion', 30, false, true);
                animation.onComplete.addOnce(function () {
                    explosion.scale.x = beforeScaleX;
                    explosion.scale.y = beforeScaleY;
                    explosion.alpha = beforeAlpha;
                });
                boss.kill();
                booster.kill();
                boss.dying = false;
                bossDeath.on = false;
                //queue next boss
                bossLaunchTimer = game.time.events.add(game.rnd.integerInRange(bossSpacing, bossSpacing + 5000), launchBoss);
            });
            //reset pacing for enemies
            shooterSpacine = 2500;
            enemyShipSpacing = 1000;

            //give bonus health
            fighter.health = Math.min(100, fighter.health + 40);
            shields.render();
        }
    };

    //boss death ray
    function addRay(leftRight) {
        var ray = game.add.sprite(leftRight * boss.width * 0.75, 0, 'deathRay');
        ray.alive = false;
        ray.visible = false;
        boss.addChild(ray);
        ray.crop({
            x: 0,
            y: 0,
            width: 40,
            height: 40
        });
        ray.anchor.x = 0.5;
        ray.anchor.y = 0.5;
        ray.scale.x = 2.5;
        ray.damageAmount = boss.damageAmount;
        game.physics.enable(ray, Phaser.Physics.ARCADE);
        ray.body.setSize(ray.width / 5, ray.height / 4);
        ray.update = function () {
            this.alpha = game.rnd.realInRange(0.6, 1);
        };
        boss['ray' + (leftRight > 0 ? 'Right' : 'Left')] = ray;
    }
    addRay(1);
    addRay(-1);
    //ship is seen inside the ray
    var ship = game.add.sprite(0, 0, 'boss');
    ship.anchor = {
        x: 0.5,
        y: 0.5
    };
    boss.addChild(ship);

    boss.fire = function () {
        if (game.time.now > bossBulletTimer) {
            var raySpacing = 3000;
            var chargeTime = 1500;
            var rayTime = 1500;

            function chargeAndShoot(side) {
                ray = boss['ray' + side];
                ray.name = side;
                ray.revive();
                ray.y = 80;
                ray.alpha = 0;
                ray.scale.y = 13;
                game.add.tween(ray).to({alpha: 1}, chargeTime, Phaser.Easing.Linear.In, true).onComplete.add(function (ray) {
                    ray.scale.y = 150;
                    var audio = new Audio('assets/sound effects/ray_gun.mp3');
                    audio.play();
                    game.add.tween(ray).to({Y: -1500}, rayTime, Phaser.Easing.Linear.In, true).onComplete.add(function (ray) {
                        ray.kill();
                    });
                });
            }
            chargeAndShoot('Right');
            chargeAndShoot('Left');

            bossBulletTimer = game.time.now + raySpacing;
        }
    };

    boss.update = function () {
        if (!boss.alive)
            return;

        boss.rayLeft.update();
        boss.rayRight.update();

        if (boss.y > 140) {
            boss.body.acceleration.y = -50;
        }
        if (boss.y < 140) {
            boss.body.acceleration.y = 50;
        }
        if (boss.x > fighter.x + 50) {
            boss.body.acceleration.x = -50;
        } else if (boss.x < fighter.x - 50) {
            boss.body.acceleration.x = 50;
        } else {
            boss.body.acceleration.x = 0;
        }
        //give boss illusion of banking
        var bank = boss.body.velocity.x / MAXSPEED;
        boss.scale.x = 0.6 - Math.abs(bank) / 3;
        boss.angle = 180 - bank * 20;

        booster.x = boss.x + -5 * bank;
        booster.y = boss.y + 10 * Math.abs(bank) - boss.height / 2;

        //fire if fighter in target
        var angleToPlayer = game.math.radToDeg(game.physics.arcade.angleBetween(boss, fighter)) - 90;
        var anglePointing = 180 - Math.abs(boss.angle);
        if (anglePointing - angleToPlayer < 18) {
            boss.fire();
        }
    }

    //boss boosters
    booster = game.add.emitter(boss.body.x, boss.body.y - boss.height / 2);
    booster.width = 0;
    booster.makeParticles('shooterBullet');
    booster.forEach(function (p) {
        p.crop({
            x: 120,
            y: 0,
            width: 45,
            height: 50
        });
        //shift particles left and right randomly to make two trails
        p.anchor.x = game.rnd.pick([1, -1]) * 0.95 + 0.5;
        p.anchor.y = 0.75;
    });
    booster.setXSpeed(0, 0);
    booster.setRotation(0, 0);
    booster.setYSpeed(-30, -50);
    booster.gravity = 0;
    booster.setAlpha(1, 0.1, 400);
    booster.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
    boss.bringToTop();

    //add game input controls
    cursors = game.input.keyboard.createCursorKeys();
    //use 'space' for trigger
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //create emitter for the fighter's contrail
    shipTrail = game.add.emitter(fighter.x, fighter.y + 10, 400);
    shipTrail.width = 10;
    shipTrail.makeParticles('bullet');
    shipTrail.setXSpeed(30, -30);
    shipTrail.setYSpeed(200, 180);
    shipTrail.setRotation(50, -50);
    shipTrail.setAlpha(1, 0.01, 800);
    shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);

    shipTrail.start(false, 5000, 10);

    //create explosion group
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(function (explosion) {
        explosion.animations.add('explosion');
    });

    //explosion when fighter dies
    fighterDeath = game.add.emitter(fighter.x, fighter.y);
    fighterDeath.width = 50;
    fighterDeath.height = 50;
    fighterDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10);
    fighterDeath.setAlpha(0.9, 0, 800);
    fighterDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

    //boss death
    bossDeath = game.add.emitter(boss.x, boss.y);
    bossDeath.width = boss.width / 2;
    bossDeath.height = boss.height / 2;
    bossDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 20);
    bossDeath.setAlpha(0.9, 0, 900);
    bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);

    //shields stats
    shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + fighter.health + '%', 50);
    shields.render = function () {
        shields.text = 'Shields: ' + Math.max(fighter.health, 0) + '%';
    };
    shields.render();

    //create score
    scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
    scoreText.render = function () {
        scoreText.text = 'Score: ' + score;
    };
    scoreText.render();

    //game over text
    gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
    gameOver.x = gameOver.x - gameOver.textWidth / 2;
    gameOver.y = gameOver.y - gameOver.textHeight / 3;
    gameOver.visible = false;
}

function update() {
    //background scrolled 2 pixels in y direction every frame
    starfield.tilePosition.y += 2;

    //reset fighter and check for key input
    fighter.body.acceleration.x = 0;

    if (cursors.left.isDown) {
        fighter.body.acceleration.x = -ACCELERATION;
    } else if (cursors.right.isDown) {
        fighter.body.acceleration.x = ACCELERATION;
    }

    //stop fighter at edges of screen
    if (fighter.x > game.width - 50) {
        fighter.x = game.width - 50;
        fighter.body.acceleration.x = 0;
    }
    if (fighter.x < 50) {
        fighter.x = 50;
        fighter.body.acceleration.x = 0;
    }

    //fire bullet
    if (fighter.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
        fireBullet();
    }
    //the fighter moves towards the cursor going faster if further away
    if (game.input.x < game.width - 20 && game.input.x > 20 &&
            game.input.y > 20 && game.input.y < game.height - 20) {
        var minDist = 200;
        var dist = game.input.x - fighter.x;
        fighter.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
    }

    //the fighter will be scaled and rotated  to give illusion
    //of banking at high speed.
    bank = fighter.body.velocity.x / MAXSPEED;
    fighter.scale.x = 1 - Math.abs(bank) / 2;
    fighter.angle = bank * 30;

    //keep the fighter's trail lined up with the fighter
    shipTrail.x = fighter.x;

    //check for collisions
    game.physics.arcade.overlap(fighter, enemyShip, shipCollide, null, this);
    game.physics.arcade.overlap(enemyShip, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(fighter, shooters, shipCollide, null, this);
    game.physics.arcade.overlap(shooters, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(boss, bullets, hitEnemy, bossHitTest, this);
    game.physics.arcade.overlap(fighter, boss.rayLeft, enemyHitsPlayer, null, this);
    game.physics.arcade.overlap(fighter, boss.rayRight, enemyHitsPlayer, null, this);

    game.physics.arcade.overlap(shooterBullets, fighter, enemyHitsPlayer, null, this);


    //check if game over
    if (!fighter.alive && gameOver.visible === false) {
        gameOver.visible = true;
        gameOver.alpha = 0;
        var audio = new Audio('assets/sound effects/Game over.wav');
        audio.play();
        //reset game by clicking
        function setResetHandlers() {
            var audio = new Audio('assets/sound effects/background_music.mp3');
            audio.play();
            //tapRestart = game.input.onTap.addOnce(_restart, this);
            //spaceRestart = fireButton.onDown.addOnce(_restart, this);
            function _restart() {
                tapRestart.detach();
                spaceRestart.detach();
                restart();
            }
        }
        var fadeInGameOver = game.add.tween(gameOver);
        fadeInGameOver.to({alpha: 1.0}, 1000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.onComplete.add(setResetHandlers);
        fadeInGameOver.start();
        submitScore(score, 1);
    }
}

function render() {
    /*debug bounding box for enemy collisions
     for (var i = 0; i < enemyShip.length; i++) {
     game.debug.body(enemyShip.children[i]);
     }
     game.debug.body(fighter);
     */
}

function fireBullet() {
    //so that bullets don't fire too fast
    switch (fighter.weaponLevel) {
        case 1:
            if (game.time.now > bulletTimer) {
                var BULLET_SPEED = 400;
                var BULLET_SPACING = 250;
                //grab first bullet from group
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    //fire it at same angle as fighter
                    var bulletOffset = 20 * Math.sin(game.math.degToRad(fighter.angle));
                    bullet.reset(fighter.x + bulletOffset, fighter.y);
                    bullet.angle = fighter.angle;
                    game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                    bullet.body.velocity.x += fighter.body.velocity.x;
                    //set spacing
                    bulletTimer = game.time.now + BULLET_SPACING;
                    var audio = new Audio('assets/sound effects/zap_blast_laser.mp3');
                    audio.play();
                }
            }
            break;

        case 2:
            if (game.time.now > bulletTimer) {
                var BULLET_SPEED = 400;
                var BULLET_SPACING = 550;
                for (var i = 0; i < 3; i++) {
                    //grab first bullet from group
                    var bullet = bullets.getFirstExists(false);
                    if (bullet) {
                        //fire it at same angle as fighter
                        var bulletOffset = 20 * Math.sin(game.math.degToRad(fighter.angle));
                        bullet.reset(fighter.x + bulletOffset, fighter.y);
                        var audio = new Audio('assets/sound effects/Gun+Silencer.mp3');
                        audio.play();
                        //spread angle of 1st and 3rd bullets
                        var spreadAngle;
                        if (i === 0)
                            spreadAngle = -20;
                        if (i === 1)
                            spreadAngle = 0;
                        if (i === 2)
                            spreadAngle = 20;
                        bullet.angle = fighter.angle + spreadAngle;
                        game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                        bullet.body.velocity.x += fighter.body.velocity.x;
                    }
                    //set spacing
                    bulletTimer = game.time.now + BULLET_SPACING;
                }
            }
    }
}

function launchShipEnemy() {
    var ENEMY_SPEED = 300;

    //select first enemyShip enemy from enemy group
    var enemy = enemyShip.getFirstExists(false);
    if (enemy) {
        //spawn in different locations at top of screen with varying velocity
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //update rotation for each enemy to face the direction they're moving in
        enemy.update = function () {
            enemy.angle = 100 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
            //enemy trail moves with enemy
            enemy.trail.x = enemy.x;
            enemy.trail.y = enemy.y - 10;

            //kill enemies when they move offscreen
            if (enemy.y > game.height + 200) {
                enemy.kill();
                enemy.y = -20;
            }
        }
    }

    //launch another enemy recursively
    enemyShipLaunchTimer = game.time.events.add(game.rnd.integerInRange(enemyShipSpacing, enemyShipSpacing + 1000), launchShipEnemy);
}

function launchShooter() {
    var startingX = game.rnd.integerInRange(100, game.width - 100);
    var verticalSpeed = 180;
    var spread = 60;
    var frequency = 70;
    var verticalSpacing = 70;
    var numEnemiesInWave = 5;

    //launch shooter enemy wave
    for (var i = 0; i < numEnemiesInWave; i++) {
        var enemy = shooters.getFirstExists(false);
        if (enemy) {
            enemy.startingX = startingX;
            enemy.reset(game.width / 2, -verticalSpacing * i);
            enemy.body.velocity.y = verticalSpeed;

            //initiate firing
            var bulletSpeed = 400;
            var firingDelay = 2000;
            enemy.bullets = 1;
            enemy.lastShot = 0;

            //update for each enemy
            enemy.update = function () {
                //move in waves
                this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;
                //illusion of banking
                bank = Math.cos((this.y + 60) / frequency);
                this.scale.x = 0.5 - Math.abs(bank) / 8;
                this.angle = 180 - bank * 2;

                //fire
                enemyBullet = shooterBullets.getFirstExists(false);
                if (enemyBullet && this.alive && this.bullets &&
                        this.y > game.width / 8 &&
                        game.time.now > firingDelay + this.lastShot) {
                    this.lastShot = game.time.now;
                    this.bullets--;
                    enemyBullet.reset(this.x, this.y + this.height / 2);
                    enemyBullet.damageAmount = this.damageAmount;
                    var angle = game.physics.arcade.moveToObject(enemyBullet, fighter, bulletSpeed);
                    enemyBullet.angle = game.math.radToDeg(angle);
                    var audio = new Audio('assets/sound effects/Gun+Silencer.mp3');
                    audio.play();
                }

                //kill when enemies go off screen
                if (this.y > game.height + 200) {
                    this.kill();
                    this.y = -20;
                }
            };
        }
    }
    //send another wave recursively
    shooterTimer = game.time.events.add(game.rnd.integerInRange(shooterSpacine, shooterSpacine + 4000), launchShooter);
}

function launchBoss() {
    boss.reset(game.width / 2, -boss.height);
    booster.start(false, 1000, 10);
    boss.health = 501;
    bossBulletTimer = game.time.now + 5000;
}

function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, fighter.y - 10, 100);
    enemyTrail.width = 10;
    enemyTrail.makeParticles('explosion', [1, 2, 3, 4, 5]);
    enemyTrail.setXSpeed(20, -20);
    enemyTrail.setRotation(50, -50);
    enemyTrail.setAlpha(0.4, 0, 800);
    enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
    var audio = new Audio('assets/sound effects/Rocket Thrusters.mp3');
    audio.play();
    enemy.trail = enemyTrail;
}

function shipCollide(fighter, enemy) {
    enemy.kill();
    //fighter takes damage
    fighter.damage(enemy.damageAmount);
    shields.render();
    if (fighter.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(fighter.body.x + fighter.body.halfWidth, fighter.body.y + fighter.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        var audio = new Audio('assets/sound effects/Grenade+3.mp3');
        audio.play();
    } else {
        fighterDeath.x = fighter.x;
        fighterDeath.y = fighter.y;
        fighterDeath.start(false, 1000, 10, 10);
    }
}

function hitEnemy(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);

    if (enemy.finishOff && enemy.health < 5) {
        enemy.finishOff();
    } else {
        enemy.damage(enemy.damageAmount);
    }
    bullet.kill();

    //increase score for enemy hit
    score += enemy.damageAmount * 10;
    scoreText.render();

    //as score increases, enemy spacing decreases
    enemyShipSpacing *= 0.9;
    //shooter enemies start at a score threshold of 1000
    if (!shooterLaunched && score > 1000) {
        shooterLaunched = true;
        launchShooter();
        //slow down enemyShip enemies
        enemyShipSpacing *= 2;
    }

    //launch boss
    if (!bossLaunched && score > 6000) {
        enemyShipSpacing = 5000;
        shooterSpacine = 12000;
        //pause
        game.time.events.add(2000, function () {
            bossLaunched = true;
            launchBoss();
        });
    }
    if (score > 5000 && fighter.weaponLevel < 2) {
        fighter.weaponLevel = 2;
    }
}

function bossHitTest(boss, bullet) {
    if ((bullet.x > boss.x + boss.width / 5 && bullet.y > boss.y) ||
            (bullet.x < boss.x - boss.with / 5 && bullet.y > boss.y)) {
        return false;
    } else {
        return true;
    }
}

function enemyHitsPlayer(fighter, bullet) {
    bullet.kill();
    fighter.damage(bullet.damageAmount);
    shields.render();

    if (fighter.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(fighter.body.x + fighter.body.halfWidth, fighter.body.y + fighter.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
    } else {
        fighterDeath.x = fighter.x;
        fighterDeath.y = fighter.y;
        fighterDeath.start(false, 1000, 10, 10);
    }
}

function restart() {
    //reset enemies
    enemyShip.callAll('kill');
    game.time.events.remove(enemyShipLaunchTimer);
    game.time.events.add(1000, launchShipEnemy);
    shooters.callAll('kill');
    shooterBullets.callAll('kill');
    game.time.events.remove(shooterTimer);
    boss.kill();
    booster.kill();
    game.time.events.remove(bossLaunchTimer);

    shooters.callAll('kill');
    game.time.events.remove(shooterTimer);

    //revive fighter
    fighter.weaponLevel = 1;
    fighter.revive();
    fighter.health = 100;
    shields.render();
    score = 0;
    scoreText.render();

    //hide game over text
    gameOver.visible = false;

    //reset pacing
    enemyShipSpacing = 1000;
    shooterLaunched = false;
    bossLaunched = false;
}

function submitScore(score, exdays) {
    //submit to PHP
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "score=" + score + ";" + expires + ";path=/";
    window.location.href = "submit.php";
}