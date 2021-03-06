var Enemy = (function() {
  var DEFAULT_SIZE = 10;
  var DEFAULT_SPEED = 2;
  var DEFAULT_HP = 100;
  var DEFAULT_DAMAGE_PER_HIT = 5;

  var Enemy = function(options) {
    this.position = new Vector(options.topLeftX, options.topLeftY);
    this.size = new Vector(options.size || DEFAULT_SIZE);
    this.speed = options.speed || DEFAULT_SPEED;

    this.maxHp = options.hp || DEFAULT_HP;
    this.hp = this.maxHp;
    this.maxDamagePerHit = options.damage || DEFAULT_DAMAGE_PER_HIT;
    this.isMoving = true;
    this.attackingBuilding = undefined;

    this.target = options.target;
    this.direction = this.setDirection(this.position, this.target.center);
  }

  Enemy.prototype.setDirection = function(currentPosition, targetPosition) {
    return currentPosition.directionTo(targetPosition);
  };

  Enemy.prototype.moveOrAttack = function(buildings) {
    this.checkForCollisions(buildings);
    this.move();
    if (this.attackingBuilding) {
      this.attack(this.attackingBuilding);
    }
  };

  Enemy.prototype.checkForCollisions = function(buildings) {
    for (var i = 0; i < buildings.length; i++) {
      if (this.collidesWith(buildings[i])) {
        this.isMoving = false;
        this.attackingBuilding = buildings[i];
        return
      }
    }
  };

  Enemy.prototype.collidesWith = function(building) {
    return (this.position.x < building.position.x + building.sizeOnBoardX &&
      this.position.x + this.size.x > building.position.x &&
      this.position.y < building.position.y + building.sizeOnBoardY &&
      this.position.y + this.size.y > building.position.y);
  };

  Enemy.prototype.move = function() {
    if (this.isMoving) {
      this.position.addInPlace(this.direction.randomScale(this.speed / 2,this.speed));
    }
  };

  Enemy.prototype.attack = function(building) {
    var damage = Math.floor(Math.random() * this.maxDamagePerHit);
    building.receiveDamage(damage);
    if (building.isDestroyed()) {
      this.attackingBuilding = undefined;
      this.isMoving = true;
    }
  };

  Enemy.prototype.centerX = function() {
    return this.position.x + this.size.x / 2;
  };

  Enemy.prototype.centerY = function() {
    return this.position.y + this.size.y / 2;
  };

  Enemy.prototype.center = function() {
    return {x: this.centerX(), y: this.centerY()};
  };

  Enemy.prototype.distanceFrom = function(object) {
    return Vector.distanceBetween(this.center(), object.center);
  };

  Enemy.prototype.receiveDamage = function(damage) {
    this.hp -= damage;
  };

  Enemy.prototype.isDestroyed = function() {
    return this.hp <= 0;
  };

  return Enemy;
})()
