<template>
    <div class="fs-slide" :style="{ opacity: this.shown }">
        <span :index="`${index + 1}. `">{{ item.title }}</span>
        <span>{{ item.subtitle }}</span>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-slide",

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
        background: #42b883 50% 0 no-repeat url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20196.32%20170.02%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1{fill:rgba(66,184,131,.3);stroke:rgba(255,255,255,.3);stroke-width:.2px;}.cls-2{fill:rgba(53,73,94,.2);}%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Elogo%3C%2Ftitle%3E<g>%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%200%200%2098.16%20170.02%20196.32%200%20120.83%200%22%2F%3E%3Cpolygon%20class%3D%22cls-2%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%2039.26%200%2098.16%20102.01%20157.06%200%20120.83%200%22%2F%3E</g>%3C%2Fsvg%3E");
        background-size: contain;
    }

    .fs-slide > span {
        flex: 1;
        padding: 10px;
    }

    .fs-slide > span:before {
        content: attr(index);
    }

    .fs-slide:nth-child(2n) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20196.32%20170.02%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1{fill:rgba(66,184,131,.3);stroke:rgba(255,255,255,.3);stroke-width:.2px;}.cls-2{fill:rgba(53,73,94,.2);}%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Elogo%3C%2Ftitle%3E<g transform='scale(1,-1) translate(0,-170)'>%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%200%200%2098.16%20170.02%20196.32%200%20120.83%200%22%2F%3E%3Cpolygon%20class%3D%22cls-2%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%2039.26%200%2098.16%20102.01%20157.06%200%20120.83%200%22%2F%3E</g>%3C%2Fsvg%3E");
        background-position: 50% 100%;
    }
</style>
