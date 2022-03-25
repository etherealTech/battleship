new Vue({
  data: {
    playable: true,
    playerA: new Player('You', 'a').generateWarships(),
    playerB: new Player('Bot', 'b').generateWarships(),
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
    random() {
      if (!this.turnA) return;
      this.loadProcess();
    },
    loadProcess() {
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
          return this.loadPostProcess();
        }
        let z = this.a[n];
        this.turnA = false;
        if (z < 0) {
          this.damage = this.playerA + ' #' + n + ' missed turn!';
          return this.loadPostProcess();
        }
        this.a[n].value++;
      } else {
        if (!(n in this.b)) {
          return this.loadPostProcess();
        }
        let z = this.b[n];
        this.turnA = true;
        if (z < 0) {
          this.damage = this.playerB + ' #' + n + ' missed turn!';
          return this.loadPostProcess();
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
      this.loadPostProcess();
    },
    makeMoveByA(i) {
      this.playable = false;
      this.underAttackB = true;
      this.attacker = i;
      this.damage = `Choose ${this.playerB}'s warship to destroy!`;
      this.loadPostProcess();
    },
    makeMoveByB(i) {
      let warships = this.a.filter(w => w.value >= 0).sort((a, b) => b.value - a.value);
      this.playable = false;
      this.underAttackA = true;
      this.attacker = i;
      this.damage = `${this.playerB} is attacking...`;
      setTimeout(() => {
        this.destroyTarget(warships[0]);
      }, 600 + Math.random() * 1000);
    },
    attackTarget(warship, turn) {
      if (!turn) return;
      if (!this.attacking) return;
      if (warship.value == -1) return;
      this.destroyTarget(warship);
    },
    destroyTarget(warship) {
      let a = this.underAttackA;
      let attacker = this[a ? 'playerB' : 'playerA'].warships;
      attacker[this.attacker].value = 0;
      warship.value = -1;
      this.underAttackA = this.underAttackB = false;
      this.playable = true;
      this.attacker = null;
      this.loadPostProcess();
    },
    loadPostProcess() {
      if (!this.turnA) {
        setTimeout(() => {
          this.loadProcess();
        }, 400 + Math.random() * 400);
      }
    },
  },
}).$mount('main');