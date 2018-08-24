<template>
    <div class="fs-list-row" :style="{ opacity: this.shown }">
        <span>{{ index }}</span>
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
    }
</script>

<style scoped>
    .fs-list-row {
        height: 40px;
        display: flex;
        flex-direction: row;
        transition: opacity 200ms ease-out;
        will-change: contents;
        align-items: center;
    }

    .fs-list-row > span {
        flex: 1;
    }

    .fs-list-row:nth-child(2n) {
        background: #efefef;
    }
</style>
