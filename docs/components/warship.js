Vue.component('warship', {
  props: ['id', 'mirror', 'state', 'colors'],
  template: document.getElementById('warship').innerHTML,
  data: () => ({
    i: 1,
    ended: true,
    image: `images/ships/${Math.floor(Math.random() * 6) + 1}.png`,
  }),
  methods: {
    end() {
      this.ended = true;
      let el = this.$refs['explosion'];
      el.classList.add('opacity-0', '-translate-y-8', 'scale-0');
      el.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    },
  },
  watch: {
    state() {
      if (!this.ended) return;
      this.ended = false;
    },
  },
  mounted() {
    this.$refs['explosion'].addEventListener('transitionend', () => this.end());
  },
});