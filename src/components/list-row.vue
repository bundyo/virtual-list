<template>
    <div class="ab-list-row">
        <span>{{ item.text }}</span>
        <span>{{ item.text }}</span>
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

        updated() {
            return this.$el.offsetHeight;
        },

        mounted() {
            this.$el.__key__ = this.index;
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 40px;
        display: flex;
        flex-direction: row;
    }

    .ab-list-row > span {
        flex: 1;
    }

    .ab-list-row:nth-child(2n) {
        background: #efefef;
    }
</style>
