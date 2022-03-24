const enableAutoClick = false;
const clickDelay = 300;
const attackDelay = 1200;
const refreshDelay = 800;
let startDelay = 1000;

new Vue({
  data: {
    playable: true,
    playerA: new Player('Blue', 'a').generateWarships(),
    playerB: new Player('Red', 'b').generateWarships(),
    number: undefined,
    //turnA: true,
    turnA: !!Math.round(Math.random()),
    damage: null,
    playWithBot: false,
    winner: null,
    attacking: false,
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
  },
  methods: {
    random(precentClick = false) {
      if ((startDelay && enableAutoClick) && precentClick)
        return;
      startDelay = 1;
      if (this.attacking || !this.playable) return;
      if (this.winnerA) {
        this.winner = this.playerA;
        enableAutoClick && setTimeout(() => location.reload(), refreshDelay);
        return;
      }
      if (this.winnerB) {
        this.winner = this.playerB;
        enableAutoClick && setTimeout(() => location.reload(), refreshDelay);
        return;
      }
      this.damage = null;
      let odd = Object.keys(this.a);
      let n = odd[Math.floor(Math.random() * odd.length)];
      this.number = n;
      if (this.turnA) {
        if (!(n in this.a)) {
          enableAutoClick && setTimeout(() => this.random(), clickDelay);
          return;
        }
        let z = this.a[n];
        this.turnA = false;
        if (z < 0) {
          this.damage = this.playerA + ' #' + n + ' missed turn!';
          enableAutoClick && setTimeout(() => this.random(), clickDelay);
          return;
        }
        this.a[n].value++;
      } else {
        if (!(n in this.b)) {
          enableAutoClick && setTimeout(() => this.random(), clickDelay);
          return;
        }
        let z = this.b[n];
        this.turnA = true;
        if (z < 0) {
          this.damage = this.playerB + ' #' + n + ' missed turn!';
          enableAutoClick && setTimeout(() => this.random(), clickDelay);
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
      enableAutoClick && setTimeout(() => this.random(), clickDelay);
      // this.playWithBot && this.checkToPlayByBot(a, b);
    },
    checkToPlayByBot(a, b) {
      if (!this.turnA && !(a.length && b.length)) {
        this.playable = false;
        setTimeout(() => {
          this.playable = true;
          this.random();
        }, Math.random() * 1000 + 800);
      }
    },
    makeMoveByA(i) {
      let t = Object.entries(this.b).sort(([, a], [, b]) => b - a)[0][0];
      this.playable = false;
      this.attacking = true;
      this.damage = `${this.playerB} #${i} attacked to ${this.playerA} #${t}`;
      setTimeout(() => {
        this.a[i].value = 0;
        this.b[t].value = -1;
        this.playable = true;
        this.attacking = false;
        enableAutoClick && setTimeout(() => this.random(), clickDelay);
      }, attackDelay);
    },
    makeMoveByB(i) {
      let t = Object.entries(this.a).sort(([, a], [, b]) => b - a)[0][0];
      this.playable = false;
      this.attacking = true;
      setTimeout(() => {
        this.b[i].value = 0;
        this.a[t].value = -1;
        this.playable = true;
        this.attacking = false;
        enableAutoClick && setTimeout(() => this.random(), clickDelay);
      }, attackDelay);
    },
  },
  beforeMount() {
    if (!enableAutoClick) return;
    startDelay && setTimeout(() => this.random(), startDelay);
  },
}).$mount('main');