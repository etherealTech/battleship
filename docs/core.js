class Warship {
  constructor(player) {
    this.value = 0;
    this.player = player;
  }
  
  valueOf() {
    return this.value;
  }
}

class Player {
  constructor(name, team) {
    this.name = name;
    this.team = team;
    this.warships = [];
    this.turn = false;
    this.winner = false;
    this.attacking = false;
    this.underattack = false;
    this.attacker = null;
    this.target = null;
  }
  
  generateWarships(qty = 5) {
    for (let i=0; i<qty; i++) {
      this.warships.push(new Warship(this));
    }
    return this;
  }
  
  toString() {
    return this.name;
  }
}