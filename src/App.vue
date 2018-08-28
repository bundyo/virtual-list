<template>
    <div id="app">
        <fusion-list :source="source" columns="150px index, * text">
            <span slot="1" slot-scope="{ row, field, index }">
                <input type="checkbox"/>
                Checkbox {{ index }}
            </span>
        </fusion-list>
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

    const source = [...Array(1000)].map((_, idx) => ({ index: idx, text: `Text ${idx}` }));

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
