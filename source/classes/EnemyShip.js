//constructor
function EnemyShip(game) {
    this.game = game;
}

EnemyShip.prototype.create = function() {
    //create enemyShip enemies
    this.enemyShipGroup = game.add.group();
    this.enemyShipGroup.enableBody = true;
    this.enemyShipGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyShipGroup.createMultiple(5, 'enemyShip');
    this.enemyShipGroup.setAll('anchor.x', 0.5);
    this.enemyShipGroup.setAll('anchor.y', 0.5);
    this.enemyShipGroup.setAll('scale.x', 0.5);
    this.enemyShipGroup.setAll('scale.y', 0.5);
    this.enemyShipGroup.setAll('angle', 180);
    this.enemyShipGroup.forEach(function(enemy) {
        addEnemyEmitterTrail(enemy);
        //adjust enemy bounding box
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
        //set enemy damage to fighter
        enemy.damageAmount = 20;
        enemy.events.onKilled.add(function() {
            enemy.trail.kill();
        });
    });

    //launch enemy ships
    game.time.events.loop(1000, this.launchEnemyShip, this.getEnemyShipGroup()); 
};

EnemyShip.prototype.launchEnemyShip = function() {
    var ENEMY_SPEED = 300;
    //select first enemyShip from enemyShip group
    var enemy = this.getFirstExists(false);
    if (enemy) {
        //spawn in random locations at top of screen with varying horizontal velocity
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //update rotation for each enemy to face the direction they're moving in
        enemy.update = function() {
            enemy.angle = 100 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
            //enemy trail moves with enemy
            enemy.trail.x = enemy.x;
            enemy.trail.y = enemy.y - 10;

            //kill enemies when they move offscreen and repostion to screen top
            if (enemy.y > game.height + 200) {
                enemy.kill();
                enemy.y = -20;
            }
        } 
    }
};

EnemyShip.prototype.getEnemyShipGroup = function() {
    return this.enemyShipGroup;
}

EnemyShip.prototype.getEnemyShip = function() {
    return this.enemyShip;
}

function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, fighter.y - 10, 100);
    enemyTrail.width = 10;
    enemyTrail.makeParticles('explosion', [1, 2, 3, 4, 5]);
    enemyTrail.setXSpeed(20, -20);
    enemyTrail.setRotation(50, -50);
    enemyTrail.setAlpha(0.4, 0, 800);
    enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);    

    enemy.trail = enemyTrail;
} 

