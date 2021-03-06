const enableAutoClick = false;
const clickDelay = 300;
const attackDelay = 1200;
const refreshDelay = 800;
const startDelay = 1000;

new Vue({
  data: {
    playable: true,
    playerA: new Player('Blue', 'a').generateWarships(),
    playerB: new Player('Red', 'b').generateWarships(),
    number: undefined,
    turnA: true,
    damage: null,
    winner: null,
    attacker: null,
    underAttackA: false,
    underAttackB: false,
  },
  computed: {
    winnerA() {
      return (
        Object.values(this.b).filter((v) => v < 0).length ===
        Object.keys(this.b).length
      );
    },
    winnerB() {
      return (
        Object.values(this.a).filter((v) => v < 0).length ===
        Object.keys(this.a).length
      );
    },
    a() {
      return this.playerA.warships;
    },
    b() {
      return this.playerB.warships;
    },
    attacking() {
      return this.underAttackA || this.underAttackB;
    },
  },
  methods: {
    random(precentClick = false) {
      if (!this.playable || this.attacking) return;
      if (this.winnerA) {
        this.winner = this.playerA;
        return;
      }
      if (this.winnerB) {
        this.winner = this.playerB;
        return;
      }
      this.damage = null;
      let odd = Object.keys(this.a);
      let n = odd[Math.floor(Math.random() * odd.length)];
      this.number = n;
      if (this.turnA) {
        if (!(n in this.a)) {
          return;
        }
        let z = this.a[n];
        this.turnA = false;
        if (z < 0) {
          this.damage = this.playerA + ' #' + n + ' missed turn!';
          return;
        }
        this.a[n].value++;
      } else {
        if (!(n in this.b)) {
          return;
        }
        let z = this.b[n];
        this.turnA = true;
        if (z < 0) {
          this.damage = this.playerB + ' #' + n + ' missed turn!';
          return;
        }
        this.b[n].value++;
      }
      this.compute();
    },
    compute() {
      let [a, b] = [[], []];
      for (let i in this.a) {
        if (this.a[i] > 3) {
          a.push(i);
        }
      }
      for (let i in this.b) {
        if (this.b[i] > 3) {
          b.push(i);
        }
      }
      if (a.length) {
        return this.makeMoveByA(...a);
      }
      if (b.length) {
        return this.makeMoveByB(...b);
      }
    },
    makeMoveByA(i) {
      this.playable = false;
      this.underAttackB = true;
      this.attacker = i;
      this.damage = `Choose ${this.playerB}'s warship to destroy!`;
    },
    makeMoveByB(i) {
      this.playable = false;
      this.underAttackA = true;
      this.attacker = i;
      this.damage = `Choose ${this.playerA}'s warship to destroy!`;
    },
    attackTarget(warship, ua) {
      if (!ua) return;
      if (warship.value == -1) return;
      if (!this.attacking) return;
      let a = this.underAttackA;
      let attacker = this[a ? 'playerB' : 'playerA'].warships;
      attacker[this.attacker].value = 0;
      warship.value = -1;
      this.underAttackA = this.underAttackB = false;
      this.playable = true;
      this.attacker = null;
    },
  },
}).$mount('main');