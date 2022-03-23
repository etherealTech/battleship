var _t, t;

const enableAutoClick = false;
const clickDelay = 800;
const attackDelay = 1500;
const startDelay = 800;
const refreshDelay = 5500;

let soundtracks = {
  victory() {
    let el = this.$refs.player;
    el.src = 'soundtracks/victory.mp3';
    this._t && clearTimeout(this._t);
  },
  defeated: new Audio('soundtracks/defeated.mp3'),
  explosion() {
    let el = this.$refs.player;
    el.currentTime = 0;
    el.muted = false;
    this._t && clearTimeout(this._t);
  },
  $refs: {
    player: document.getElementById('explosion'),
  },
  onEnded() {
    console.log('ended');
    this._t && clearTimeout(this._t);
    this._t = null;
    this.player.muted = true;
  },
  _t: null,
};

soundtracks.$refs.player.addEventListener('ended', () => soundtracks.onEnded());

new Vue({
  data: {
    playable: true,
    playerA: 'Blue',
    playerB: 'Red',
    number: undefined,
    turnA: true,
    //turnA: !!Math.round(Math.random()),
    damage: null,
    playWithBot: false,
    winner: null,
    attacking: false,
    //a: [0,0,0,0,0], b: [0,0,0,0,0],
    a: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },
    b: { 1: 0, 3: 0, 5: 0, 7: 0, 9: 0 },
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
  },
  methods: {
    random(precentClick = false) {
      if (enableAutoClick && precentClick) return;
      if (this.attacking) return;
      if (!this.playable) return;
      if (this.winnerA) {
        this.winner = this.playerA;
        //enableAutoClick && setTimeout(() => location.reload(), refreshDelay);
        soundtracks.victory();
        return;
      }
      if (this.winnerB) {
        this.winner = this.playerB;
        //enableAutoClick && setTimeout(() => location.reload(), refreshDelay);
        soundtracks.defeated();
        return;
      }
      this.damage = null;
      let odd = [1, 3, 5, 7, 9];
      let n = odd[Math.floor(Math.random() * odd.length)];
      this.number = n;
      if (this.turnA) {
        if (!(n in this.a)) return;
        let z = this.a[n];
        this.turnA = false;
        if (z < 0) {
          this.damage = this.playerA + ' #' + n + ' missed turn!';
          return;
        }
        this.a[n]++;
      } else {
        if (!(n in this.b)) return;
        let z = this.b[n];
        this.turnA = true;
        if (z < 0) {
          this.damage = this.playerB + ' #' + n + ' missed turn!';
          return;
        }
        this.b[n]++;
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
      a.length && this.makeMoveByA(...a);
      b.length && this.makeMoveByB(...b);
      this.playWithBot && this.checkToPlayByBot(a, b);
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
        this.a[i] = 0;
        this.b[t] = -1;
        this.playable = true;
        this.attacking = false;
      }, attackDelay);
      soundtracks.explosion();
    },
    makeMoveByB(i) {
      let t = Object.entries(this.a).sort(([, a], [, b]) => b - a)[0][0];
      this.playable = false;
      this.attacking = true;
      setTimeout(() => {
        this.b[i] = 0;
        this.a[t] = -1;
        this.playable = true;
        this.attacking = false;
      }, attackDelay);
      soundtracks.explosion();
    },
  },
  beforeMount() {
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'z':
          this.turnA && this.random();
          break;
        case '3':
          this.turnA || this.random();
          break;
      }
    });

    if (!enableAutoClick) return;
    t = () => (this.winner ? clearInterval(_t) : this.random());
    setTimeout(() => {
      _t = setInterval(t, clickDelay);
    }, startDelay);
  },
}).$mount('main');
