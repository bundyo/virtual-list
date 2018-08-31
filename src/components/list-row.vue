<template>
    <div class="fs-list-row" :style="{ opacity: row && this.shown }" :class="typeClasses" @mousedown.stop="onClick">
        <template v-for="(column, idx) in columns" class="fs-list-column">
            <slot v-if="row && $parent.$scopedSlots[idx+1] || $parent.$scopedSlots[`header-${idx+1}`]"
                  :name="idx+1" :row="row" :field="column.field" :index="index" :selectedField="selectedField"></slot>
            <span v-else :key="idx+1" v-html="row ? row[column.field] : column.field"></span>
        </template>
    </div>
</template>

<script>
    module.exports = {
        name: "fusion-list-row",

        props: {
            look: {
                default: ""
            },

            row: {},

            columns: {
                default: () => []
            },

            index: {
                default: -1
            },

            selectedField: {
                default: "selected"
            },

            disabledField: {
                default: "disabled"
            },

            multiple: {
                default: false
            }
        },

        data() {
            return {
                shown: .5,
                types: {}
            };
        },

        computed: {
            typeClasses() {
                this.types = this.$fusion.convertToObject(this.look);

                return this.$fusion.getTypeClasses(this.types, {
                    "-selected": this.row && this.row[this.selectedField],
                    "-disabled": this.row && this.row[this.disabledField]
                });
            }
        },

        methods: {
            onClick() {
                if (!this.row) {
                    return;
                }

                if (this.multiple === false && this.row[this.selectedField]) {
                    return;
                }

                const newValue = !this.row[this.selectedField];

                this.$set(this.row, this.selectedField, newValue);
                this.$emit("select", this.index, newValue);
            },

            showing() {
                this.shown = 1;
            },

            hiding() {
                this.shown = .5;
            }
        }
    };
</script>

<style scoped>
    .fs-list-header {
        width: 100%;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        font-size: 10px;
        background: transparent;
        text-transform: uppercase;
        color: var(--transparent-black-5);
    }

    .fs-list-row {
        display: flex;
        flex-direction: row;
        transition: opacity 200ms ease-out;
        will-change: contents;
        align-items: center;
        cursor: default;
    }

    .-selectable .fs-list-content .fs-list-row {
        cursor: pointer;
    }

    .fs-list-row > * {
        padding: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
        font-weight: 200;
        line-height: normal;
    }

    .fs-list-header > * {
        font-size: inherit;
    }

    .fs-list-content .fs-list-row:hover {
        box-shadow: inset 0 0 10000px var(--background-light-5);
    }

    .fs-list-content .fs-list-row.-selected {
        color: var(--color-accent-dark);
        box-shadow: inset 0 0 10000px var(--background-light-7);
    }

    .fs-list-content:focus-within {
        outline: 1px solid var(--color-accent-light);
    }
</style>
