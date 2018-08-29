<template>
    <div class="fs-slide" :style="{ opacity: this.shown }" :class="{ [`-slide-${row.index}`]: true }">
        <div v-if="row.title || row.subtitle" class="slide__header" :index="row.index">
            <span v-if="row.title" class="slide__title" v-html="row.title"></span>
            <span v-if="row.subtitle" class="slide__subtitle" v-html="row.subtitle"></span>
        </div>
        <div v-if="row.quote" class="slide__quote">
            <span v-if="row.quote.text" class="slide__quote-text" v-html="row.quote.text"></span>
            <div v-if="row.quote.author || row.quote.book">
                <span v-if="row.quote.author" v-html="row.quote.author"></span>
                <span v-if="row.quote.book" class="slide__quote-book" v-html="row.quote.book"></span>
            </div>
        </div>
        <div v-if="row.image" class="slide__image">
            <img :src="row.image"/>
        </div>
        <div v-if="row.footer" class="slide__footer" v-html="row.footer"></div>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-slide",

        props: ["row", "columns", "index"],

        data() {
            return {
                shown: .5
            };
        },

        methods: {
            showing() {
                this.shown = 1;

                if (this.row && this.row.cue && console) {
                    console.log("%c--------------------------", "font-size: large");
                    console.log(`%c${this.row.cue.text}`, this.row.cue.css || "color: #42b883; font-size: 16px");
                }
            },

            hiding() {
                this.shown = .5;
            }
        },
    }
</script>

<style>
    .fs-slide {
        height: calc(100% + .2px);
        transition: opacity 200ms ease-out;
        will-change: contents;
        align-items: center;
        background: #42b883 50% 0 no-repeat url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20196.32%20170.02%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1{fill:rgba(66,184,131,.3);stroke:rgba(255,255,255,.3);stroke-width:.2px;}.cls-2{fill:rgba(53,73,94,.2);}%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Elogo%3C%2Ftitle%3E<g>%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%200%200%2098.16%20170.02%20196.32%200%20120.83%200%22%2F%3E%3Cpolygon%20class%3D%22cls-2%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%2039.26%200%2098.16%20102.01%20157.06%200%20120.83%200%22%2F%3E</g>%3C%2Fsvg%3E");
        background-size: contain;
        position: relative;
        text-align: center;
    }

    .fs-slide > * {
        text-align: left;
    }

    .fs-slide .slide__header:before {
        content: attr(index);
        position: absolute;
        top: 0;
        left: 0;
        width: 45px;
        display: flex;
        justify-content: center;
        color: #42b883;
        font-size: 40px;
        font-weight: 400;
        letter-spacing: -6px;
        text-indent: -7px;
    }

    .fs-slide:nth-child(2n) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20196.32%20170.02%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1{fill:rgba(66,184,131,.3);stroke:rgba(255,255,255,.3);stroke-width:.2px;}.cls-2{fill:rgba(53,73,94,.2);}%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Elogo%3C%2Ftitle%3E<g transform='scale(1,-1) translate(0,-170)'>%3Cpolygon%20class%3D%22cls-1%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%200%200%2098.16%20170.02%20196.32%200%20120.83%200%22%2F%3E%3Cpolygon%20class%3D%22cls-2%22%20points%3D%22120.83%200%2098.16%2039.26%2075.49%200%2039.26%200%2098.16%20102.01%20157.06%200%20120.83%200%22%2F%3E</g>%3C%2Fsvg%3E");
        background-position: 50% 100%;
    }

    .slide__header {
        position: relative;
        border: 60px solid transparent;
        padding: 0 0 5px 80px;
        box-shadow: inset 46px 0 0 #fff;
    }

    .slide__title {
        font-size: 40px;
        display: block;
        padding-bottom: 14px;
        line-height: 1em;
        padding-top: 6px;
    }

    .slide__subtitle {
        font-size: 24px;
        color: #EEE;
    }

    .slide__footer {
        position: absolute;
        bottom: 40px;
        right: 40px;
        text-align: right;
    }

    .slide__footer a {
        color: inherit;
        text-decoration: inherit;
    }

    .slide__quote {
        height: 100%;
        display: inline-flex;
        flex-direction: column;
        font-style: italic;
        justify-content: center;
    }

    .slide__header ~ .slide__quote {
        height: 50%;
    }

    .slide__image {
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .slide__header ~ .slide__image {
        height: 50%;
    }

    .slide__image > img {
        height: 50%;
    }

    .slide__header ~ .slide__image > img {
        height: 100%;
    }

    .slide__quote-text {
        font-size: 32px;
        width: 100%;
    }

    .slide__quote > div {
        margin-top: 20px;
        text-align: right;
    }

    .slide__quote-book:before {
        content: " - ";
    }
</style>
