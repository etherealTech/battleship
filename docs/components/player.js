Vue.component('player', {
    props: ['color', 'name', 'turn'],
    template: document.getElementById('player').innerHTML,
});