<template>
  <div id="app">
    <list />
  </div>
</template>

<script>
  import list from './components/list.vue';

  export default {
    name: 'app',
    components: {
      list
    }
  }
</script>

<style>
  #app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
