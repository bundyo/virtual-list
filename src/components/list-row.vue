<template>
    <div class="fs-list-row" :style="{ opacity: this.shown }">
        <template v-for="(column, idx) in columns" class="fs-list-column">
            <slot :name="idx+1"></slot>
            <span :key="idx+1" v-html="row[column.field]"></span>
        </template>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-list-row",

        props: {
            row: {},

            index: {},

            columns: {},

            textField: {
                type: String,
                default: "text"
            },

            valueField: {
                type: String,
                default: "value"
            },

            iconClassField: {
                type: String,
                default: "iconClass"
            }
        },

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
        }
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
        padding: 10px;
    }

    .fs-list-row:nth-child(2n) {
        background: #efefef;
    }
</style>
