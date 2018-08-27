<template>
    <div class="fs-list" tabindex="-1" :class="typeClasses" @mousedown="onClick" @keydown="onKeyDown" @focus="onFocus" @blur="onBlur">
        <!--<component :is="rowComponent" v-if="header" :columns="parsedColumns" class="fs-list-header">-->
            <!--<template v-for="(column, idx) in parsedColumns" :slot="idx+1">-->
                <!--<slot :name="'header-' + (idx+1)"></slot>-->
            <!--</template>-->
        <!--</component>-->
        <div ref="content" class="fs-list-content" :class="{ '-focused': hasFocus }">
            <component :is="rowComponent" v-for="(row, key) in view" :key="key + index" :row="row" class="fs-list-row"
                       :index="key + index" :style="{ marginTop: key === 0 ? `${firstMargin}px` : 0 }" v-bind="$attrs"
                       :columns="parsedColumns" @mousedown.native.stop @select="onSelectRow" :disabled-field="disabledField"
                       v-notify-mount @mounted="$nextTick(() => observer.observe($event))">
                <slot v-for="(column, idx) in parsedColumns" :slot="idx+1" :name="idx+1" :row="row"
                      :field="column.field" :index="idx"></slot>
            </component>
            <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
        </div>
        <div v-if="virtual" class="fs-scroller" ref="scroller" tabindex="-1">
            <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
        </div>
        <div v-if="columns" v-html="style"></div>
    </div>
</template>

<script>
    function cssId() {
        return Math.random().toString(36).substr(2, 10);
    }

    function convertToObject(str) {
        const splitStr = str ? str.split(" ") : [];
        const map = str ? Object.assign(...splitStr.map(key => ({ [key]: true }))) : {};

        map.classes = str ? Object.assign(...splitStr.map(key => ({ [`-${key}`]: true }))) : {};

        return map;
    }

    function getTypeClasses(types, extensions, defaultTypes) {
        return Object.assign(defaultTypes ? defaultTypes.map(key => ({ [key]: true })) : {}, types.classes, extensions);
    }

    const maxHeight = 10000000;
    const keys = {
        "ArrowDown": .05,
        "ArrowUp": -.05,
        "PageDown": 1,
        "PageUp": -1,
        "Space": 1
    };

    const columnRegExp = /\s*,\s*/;

    module.exports = {
        name: "fusion-list",
        props: {
            look: {
                default: ""
            },
            source: {
                type: Array,
                default: () => []
            },
            "row-component": {
                default: "fusion-list-row"
            },
            columns: {
                type: String,
                default: ""
            },
            tabindex: {
                default: -1
            },
            selectedField: {
                type: String,
                default: "selected"
            },
            disabledField: {
                type: String,
                default: "disabled"
            },
            step: {
                default: 2
            },
            pageSize: {
                default: 40
            },
            selectable: {
                type: Boolean
            },
            virtual: {
                type: Boolean
            },
            autoscroll: {
                type: Boolean
            },
            disabled: {
                type: Boolean
            },
            header: {
                default: true
            }
        },

        model: {
            prop: "value",
            event: "select"
        },

        data() {
            return {
                guidClass: `-${cssId()}`,
                index: null,
                scale: 1,
                content: null,
                scroller: null,
                observer: null,
                firstMargin: "1px",
                sizerHeight: "1px",
                selectedRow: -1,
                hasFocus: false,
                tabbingIndex: this.selectable ? this.tabindex || 0 : undefined,
                hasSelection: this.selectable,
                passProxy: this.passKeys.bind(this)
            };
        },

        methods: {
            _getRows() {
                return Array.from(this.content.querySelectorAll(".fs-list-row:not(.fs-sizer)"));
            },

            intersectionCallback(entries) {
                entries.forEach((entry) => {
                    const component = entry.target.__vue__;
                    const event = entry.isIntersecting ? "showing" : "hiding";

                    component && component[event] && component[event].call(component);
                });
            },

            scrollCallback() {
                const endOffset = this.source.length - this._getRows().length;

                let index = Math.round(this.scroller.scrollTop / this.rowHeight * this.scale) - this.indexOffset;

                index += index % this.step;

                index < 0 && (index = 0);
                index > endOffset && (index = endOffset);

                this.index = index;
                this.content.scrollTop = this.scroller.scrollTop;
            },

            passWheel(e) {
                if (e.deltaMode) {
                    const lineHeight = keys["ArrowDown"] * this.content.clientHeight;

                    this.scroller.scrollTop += e.deltaY * lineHeight;
                    this.scroller.scrollLeft += e.deltaX * lineHeight;
                } else {
                    this.scroller.scrollTop += e.deltaY;
                    this.scroller.scrollLeft += e.deltaX;
                }
            },

            passKeys(e) {
                keys[e.code] && this.scroller.scroll({
                    top: this.scroller.scrollTop + keys[e.code] * this.content.clientHeight,
                    behavior: e.repeat ? "instant" : "smooth"
                });
            },

            detachCallbacks() {
                this.content.removeEventListener("wheel", this.passWheel.bind(this), true);
                this.$el.removeEventListener("keydown", this.passProxy);

                this.scroller.removeEventListener("scroll", this.scrollCallback.bind(this));
            },

            attachCallbacks() {
                this.content.addEventListener("wheel", this.passWheel.bind(this), true);
                this.$el.addEventListener("keydown", this.passProxy);

                this.scroller.addEventListener("scroll", this.scrollCallback.bind(this));
            },

            onFocus() {
                this.hasFocus = true;
            },

            onBlur() {
                this.hasFocus = false;
            },

            onClick() {
            },

            onSelectRow() {
            },

            onKeyDown() {
            }
        },

        computed: {
            view() {
                return this.source.slice(this.index, this.index + +this.pageSize);
            },

            types() {
                return convertToObject(this.look);
            },

            typeClasses() {
                return getTypeClasses(this.types, {
                    "-disabled": this.disabled,
                    "-selectable": this.hasSelection,
                    "-scrollable": this.pageSize > 0,
                    "-virtual": this.virtual,
                    "-focused": this.hasFocus,
                    [this.guidClass]: true
                });
            },

            parsedColumns() {
                return (this.columns.split(columnRegExp) || []).map((value) => {
                    const output = {};

                    ({ 0: output.width, 1: output.field } = value.split(" "));

                    return output;
                });
            },

            style() {
                let output = "<style>";

                this.parsedColumns.forEach((value, key) => {
                    output += `.${this.guidClass} .fs-list-row>*:nth-child(${key + 1}){width: ${value.width};${value.width === "auto" ?
                        "flex: 1;" : ""}}\n`;
                });

                return `${output}</style>`;
            }
        },

        watch: {
            index() {
                const rows = this._getRows();
                const len = rows.length;

                if (len) {
                    const firstRowRect = rows.shift().getBoundingClientRect();
                    const lastRowRect = len > 1 && rows.pop().getBoundingClientRect();

                    this.rowHeight = Math.round((lastRowRect.top - firstRowRect.top + lastRowRect.height) / len);

                    const sizerHeight = this.source.length * this.rowHeight;

                    this.scale = sizerHeight / maxHeight;
                    this.scale <= 1 && (this.scale = Math.ceil(this.scale));

                    this.firstMargin = this.index * this.rowHeight / this.scale;
                    this.visibleCount = Math.ceil(this.content.clientHeight / this.rowHeight);
                    this.indexOffset = Math.floor((this.pageSize - this.visibleCount) / 2);
                    this.sizerHeight = `${this.scale <= 1 ? sizerHeight :
                        Math.max(this.pageSize * this.rowHeight + this.firstMargin, sizerHeight / this.scale)}px`;
                }
            }
        },

        mounted() {
            this.content = this.$refs.content;
            this.scroller = this.$refs.scroller;

            if (this.virtual) {
                this.attachCallbacks();
            }

            this.observer = new IntersectionObserver(this.intersectionCallback.bind(this), {
                root: this.content,
                rootMargin: "0px",
                threshold: 0
            });

            this.index = 0;

            this.$emit("mounted");
        },

        beforeDestroy() {
            if (this.virtual) {
                this.detachCallbacks();
            }
        }
    }
</script>

<style scoped>
    .fs-list {
        height: 100%;
        display: flex;
    }

    .fs-list-content,
    .fs-scroller {
        position: relative;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        will-change: contents;
    }

    .fs-list-content {
        width: 100%;
        top: 0;
        flex: 1;
    }

    .fs-list.-virtual > .fs-list-content {
        overflow: hidden;
    }

    .fs-scroller {
        min-width: 17px;
        flex-basis: fit-content;
        outline: none;
    }

    .fs-sizer {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border-left: 1px solid transparent;
    }
</style>
