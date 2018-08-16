<template>
    <div class="ab-list-row">
        {{ item.text }}
    </div>
</template>

<script>
    export default {
        name: "fusion-list-row",

        props: ["item"],

        data() {
            return {
            };
        },

        methods: {
        },

        computed: {
        },

        created() {
        },

        mounted() {
            this.$emit("mounted", this.$el);
        },

        unmounted() {
            this.$emit("unmounted", this.$el);
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 50px;
        border: solid red;
        border-width: 1px 0;
    }

    .ab-list-content {
        position: relative;
        height: 200px;
        overflow: hidden;
        overflow-y: auto;
    }

    .ab-list-sizer {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border: 1px solid transparent;
    }
</style>
