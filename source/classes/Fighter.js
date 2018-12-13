var ACCELERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

var bank;
var contrail;
var bullets;
var bulletTimer = 0;
var explosion;
var fighterDeath;

//constructor
function Fighter(game) {
    this.game = game;
    this.sprite = null;
}

Fighter.prototype.create = function() {
    this.fighter = game.add.sprite(400, 500, 'fighter');
    //add health
    this.fighter.health = 200;
    this.fighter.anchor.setTo(0.5, 0.5);
    //give fighter a standard arcade physics body
    game.physics.enable(this.fighter, Phaser.Physics.ARCADE);
    //give fighter more realistic movement
    this.fighter.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    this.fighter.body.drag.setTo(DRAG, DRAG);
    //set weapon level
    this.fighter.weaponLevel = 1; 
    //when fighter dies, kill fighter contrail
    this.fighter.events.onKilled.add(function() {
        contrail.kill();
    });
    
    //create contrail emitter
    this.createContrail();
    //create bullet group
    this.createBullets();
    //create explosion group
    this.createExplosion(); 
    //create explosion for fighter death
    this.createFighterDeath();
};

Fighter.prototype.update = function(cursors, fireButton) {
    //reset fighter and check for key input
    this.fighter.body.acceleration.x = 0;

    //control fighter horizontal movement
    if (cursors.left.isDown) {
        this.fighter.body.acceleration.x = -ACCELERATION;
    } else if (cursors.right.isDown) {
        this.fighter.body.acceleration.x = ACCELERATION;
    }

    //stop fighter movement near screen boundaries
    if (this.fighter.x > game.width - 50) {
        this.fighter.x = game.width - 50;
        this.fighter.body.acceleration.x = 0;
    }
    if (this.fighter.x < 50) {
        this.fighter.x = 50;
        this.fighter.body.acceleration.x = 0;
    }

    //adjust fighter speed using distance from cursor
    if (game.input.x < game.width - 20 && game.input.x > 20 &&
      game.input.y > 20 && game.input.y < game.height - 20) {
        var minDist = 200;
        var dist = game.input.x - this.fighter.x;
        this.fighter.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
    }

    //fighter is scaled/rotated to simulate banking
    bank = this.fighter.body.velocity.x / MAXSPEED;
    this.fighter.scale.x = 1 - Math.abs(bank) / 2;
    this.fighter.angle = bank * 30;

    //attach contrail emitter
    contrail.x = this.fighter.x;  

    //fire bullets if conditions are true
    if (this.fighter.alive && fireButton.isDown) {
        this.fireBullet();
    } 
};

Fighter.prototype.createContrail = function() {
    //create contrail emitter
    contrail = game.add.emitter(this.fighter.x, this.fighter.y + 10, 400);
    contrail.width = 10;
    contrail.makeParticles('bullet');
    contrail.setXSpeed(30, -30);
    contrail.setYSpeed(200, 180);
    contrail.setRotation(50, -50);
    contrail.setAlpha(1, 0.01, 800);
    contrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
    contrail.start(false, 5000, 10);
};

Fighter.prototype.createFighterDeath = function() {
    //explosion when fighter dies
    fighterDeath = game.add.emitter(fighter.x, fighter.y);
    fighterDeath.width = 50;
    fighterDeath.height = 50;
    fighterDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10);
    fighterDeath.setAlpha(0.9, 0, 800);
    fighterDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
};

Fighter.prototype.createBullets = function() {
    //create the bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
};

Fighter.prototype.fireBullet = function() {
    switch (this.fighter.weaponLevel) {
        case 1: //single bullet
        if (game.time.now > bulletTimer) {
            //moderates bullet timing
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 250;
            //grab first bullet from group
            var bullet = bullets.getFirstExists(false);
            if (bullet) {
                //match bullet angle to fighter angle
                var bulletOffset = 20 * Math.sin(game.math.degToRad(this.fighter.angle));
                bullet.reset(this.fighter.x + bulletOffset, this.fighter.y);
                bullet.angle = this.fighter.angle;
                game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                bullet.body.velocity.x += this.fighter.body.velocity.x;
                //set timing of firing
                bulletTimer = game.time.now + BULLET_SPACING;
            }
        }
        break;

        case 2: //3 bullets at a time
        if (game.time.now > bulletTimer) {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 550;
            for (var i = 0; i < 3; i++) {
                //grab first bullet from group
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    //match angle of 2nd bullet to fighter angle
                    var bulletOffset = 20 * Math.sin(game.math.degToRad(this.fighter.angle));
                    bullet.reset(this.fighter.x + bulletOffset, this.fighter.y);
                    //spread the angle of the 1st and 3rd bullets
                    var spreadAngle;
                    if (i === 0) spreadAngle = -20;
                    if (i === 1) spreadAngle = 0;
                    if (i === 2) spreadAngle = 20;
                    bullet.angle = this.fighter.angle + spreadAngle;
                    game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                    bullet.body.velocity.x += this.fighter.body.velocity.x;
                }
                //timing of firing
                bulletTimer = game.time.now + BULLET_SPACING;
            }   
        } 
    }   
};

Fighter.prototype.getFighter = function() {
    return this.fighter;
};

Fighter.prototype.getBullets = function() {
    return bullets;
};

Fighter.prototype.getHealth = function() {
    return this.fighter.health;
};

Fighter.prototype.getWeaponLevel = function() {
    return this.fighter.weaponLevel;
};

Fighter.prototype.getAlive = function() {
    if (this.fighter.alive) {
        return true;
    } else {
        return false;
    }    
};

Fighter.prototype.fighterHit = function(fighter, enemy) {
    enemy.kill();
    //fighter takes damage
    fighter.damage(enemy.damageAmount); 

    if (fighter.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(fighter.body.x, fighter.body.y);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);      
    } else {
        fighterDeath.x = fighter.x;
        fighterDeath.y = fighter.y;
        fighterDeath.start(false, 1000, 10, 10); 
    }    
};

Fighter.prototype.hitEnemyShip = function(bullet, enemy) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.x, enemy.y);
    explosion.anchor.set(0.5, 0.5);
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

    /*

    //launch boss
    if (!bossLaunched && score > 6000) {
        enemyShipSpacing = 5000;
        shooterSpacine = 12000;
        //pause
        game.time.events.add(2000, function() {
            bossLaunched = true;
            launchBoss();
        });
    }
    if (score > 5000 && fighter.weaponLevel < 2) {
        fighter.weaponLevel = 2;
    }
*/
};

Fighter.prototype.enemyShootsFighter = function(fighter, bullet) {
     if (fighter.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.x, bullet.y);
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        explosion.anchor.set(0.5, 0.5);
        explosion.body.velocity.y = bullet.body.velocity.y;
    } else {
      fighterDeath.x = fighter.x;
      fighterDeath.y = fighter.y;
      fighterDeath.start(false, 1000, 10, 10);
    }
    fighter.damage(bullet.damageAmount);
    bullet.kill();

    shields.render();
};


Fighter.prototype.createExplosion = function() {
    //create explosion group
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(function(explosion) {
        explosion.animations.add('explosion');
    });
};







