<template>
    <div class="fs-slide" :style="{ opacity: this.shown }">
        <span>{{ index }}</span>
        <span>{{ item.text }}</span>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-slide",

        template: '',

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

<style>
    .fs-slide {
        height: 100%;
        display: flex;
        flex-direction: row;
        transition: opacity 200ms ease-out;
        will-change: contents;
        align-items: center;
    }

    .fs-slide > span {
        flex: 1;
        padding: 10px;
    }

    .fs-slide:nth-child(2n) {
        background: #efefef;
    }
</style>
