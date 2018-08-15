<template>
    <div id="app">
        <list :source="source"/>
    </div>
</template>

<script>
    import list from "./components/list.vue";

    export default {
        name: "app",
        components: {
            list
        },
            data() {
                return {
                    source: [
                        { text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }, { text: "6" },
                        { text: "7" }, { text: "8" }, { text: "9" }, { text: "10" }, { text: "11" }, { text: "12" },
                        { text: "13" }, { text: "14" }, { text: "15" }, { text: "16" }, { text: "17" }, { text: "18" }
                    ]
                };
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
