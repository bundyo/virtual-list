<template>
    <div class="fs-list-row" :style="{ opacity: row && this.shown }">
        <template v-for="(column, idx) in columns" class="fs-list-column">
            <slot v-if="row && $parent.$scopedSlots[idx+1] || $parent.$scopedSlots[`header-${idx+1}`]"
                  :name="idx+1" :row="row" :field="column.field" :index="index"></slot>
            <span v-else :key="idx+1" v-html="row ? row[column.field] : column.field"></span>
        </template>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-list-row",

        props: [ "row", "index", "columns" ],

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
    .fs-list-header {
        width: 100%;
    }

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
