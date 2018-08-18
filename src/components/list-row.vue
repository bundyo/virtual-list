<template>
    <div class="ab-list-row" :style="{ opacity: this.shown }">
        {{ item.text }}
    </div>
</template>

<script>
    export default {
        name: "fusion-list-row",

        props: ["item", "index"],

        data() {
            return {
                shown: .5
            };
        },

        methods: {
            showing() {
                this.shown = 1;
            },

            hiding() {
                this.shown = .5;
            }
        },

        watch: {
            index(value) {
                this.$el.__key__ = value;
            }
        },

        mounted() {
            this.$el.__key__ = this.index;

            this.$emit("mounted", this.$el);
        },

        unmounted() {
            this.$emit("unmounted", this.$el);
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 40px;
        border: solid red;
        border-width: 1px 0;
        transition: opacity 100ms ease-out;
        will-change: contents;
    }

    .ab-list-row:nth-child(2n) {
        background: #efefef;
    }
</style>
