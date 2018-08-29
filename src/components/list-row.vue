<template>
    <div class="fs-list-row" :style="{ opacity: row && this.shown }" :class="typeClasses" @mousedown.stop="onClick">
        <template v-for="(column, idx) in columns" class="fs-list-column">
            <slot v-if="row && $parent.$scopedSlots[idx+1] || $parent.$scopedSlots[`header-${idx+1}`]"
                  :name="idx+1" :row="row" :field="column.field" :index="index"></slot>
            <span v-else :key="idx+1" v-html="row ? row[column.field] : column.field"></span>
        </template>
    </div>
</template>

<script>
    function convertToObject(str) {
        const splitStr = str ? str.split(" ") : [];
        const map = str ? Object.assign(...splitStr.map(key => ({ [key]: true }))) : {};

        map.classes = str ? Object.assign(...splitStr.map(key => ({ [`-${key}`]: true }))) : {};

        return map;
    }

    function getTypeClasses(types, extensions, defaultTypes) {
        return Object.assign(defaultTypes ? defaultTypes.map(key => ({ [key]: true })) : {}, types.classes, extensions);
    }

    module.exports = {
        name: "fusion-list-row",

        props: {
            look: {
                default: ""
            },

            row: {
                default: () => {}
            },

            columns: {
                default: () => []
            },

            index: {
                default: -1
            },

            valueField: {
                default: "value"
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
                shown: .5
            };
        },

        computed: {
            isSelected() {
                return this.row && this.row[this.selectedField];
            },

            types() {
                return convertToObject(this.look);
            },

            typeClasses() {
                return getTypeClasses(this.types, {
                    "-selected": this.isSelected,
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

                 this.$set(this.row, this.selectedField, !this.row[this.selectedField]);
             },

            emitSelect() {
                this.$emit("select", this.index, this.row);
            },

            showing() {
                this.shown = 1;
            },

            hiding() {
                this.shown = .5;
            }
        },

        watch: {
            row(value, oldValue) {
                if (this.isSelected && !_.isEqual(value, oldValue)) {
                    this.emitSelect();
                }
            },

            isSelected(value, oldValue) {
                if (value !== oldValue) {
                    this.emitSelect();
                }
            },

            mounted() {
                if (this.isSelected) {
                    this.emitSelect();
                }
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
