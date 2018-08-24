<template>
    <div id="app">
        <fusion-list :source="source" page-size="80"/>
    </div>
</template>

<script>
    import Vue from "vue";
    import list from "./components/list.vue";
    import listRow from "./components/list-row.vue";

    Vue.component(list.name, list);
    Vue.component(listRow.name, listRow);

    const source = [...Array(200000)].map((_, text) => ({ text: `Text ${text}` }));

    export default {
        name: "app",
        data() {
            return {
                source
            };
        }
    }
</script>

<style>
    body {
        margin: 0;
    }

    #app {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 600px;
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
