<template>
    <div id="app">
        <fusion-list :source="source" page-size="20"/>
    </div>
</template>

<script>
    import Vue from "vue";
    import list from "./components/list.vue";
    import listRow from "./components/list-row.vue";

    Vue.directive("notify-mount", {
        inserted: function (el, binding, vnode) {
            vnode.componentInstance.$emit("mounted", el);
        }
    });

    Vue.component(list.name, list);
    Vue.component(listRow.name, listRow);

    const source = [...Array(10000)].map((_, text) => ({ text: `Text ${text}` }));

    export default {
        name: "app",

        created() {
            this.source = source;
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
