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
    //turnA: true,
    turnA: !!Math.round(Math.random()),
    damage: null,
    winner: null,
    attacker: null,
    underAttackA: false,
    underAttackB: false,

    //a: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },
    //b: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },
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
        return this.completeProcess();
      }
      if (this.winnerB) {
        this.winner = this.playerB;
        return this.completeProcess();
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
      let t = Object.entries(this.b).sort(([, a], [, b]) => b - a)[0][0];
      this.playable = false;
      this.underAttackB = true;
      this.attacker = i;
      // this.damage = `${this.playerB} is under attacked by ${this.playerA}`;
      this.damage = `Choose ${this.playerB}'s warship to destroy!`;
    },
    makeMoveByB(i) {
      let t = Object.entries(this.a).sort(([, a], [, b]) => b - a)[0][0];
      this.playable = false;
      this.underAttackA = true;
      this.attacker = i;
      // this.damage = `${this.playerA} is under attacked by ${this.playerB}`;
      this.damage = `Choose ${this.playerA}'s warship to destroy!`;
    },
    attackTarget(warship, ua) {
      if (!ua) return;
      if (!this.attacking) return;
      let a = this.underAttackA;
      let attacker = this[a ? 'playerB' : 'playerA'].warships;
      attacker[this.attacker].value = 0;
      warship.value = -1;
      this.underAttackA = this.underAttackB = false;
      this.playable = true;
      this.attacker = null;
    },
    loadPostProcess() {
      enableAutoClick && setTimeout(() => this.random(), clickDelay);
    },
    completeProcess() {
      enableAutoClick && setTimeout(() => location.reload(), refreshDelay);
    },
  },
  beforeMount() {
    if (!enableAutoClick) return;
    startDelay && setTimeout(() => this.random(), startDelay);
  },
}).$mount('main');