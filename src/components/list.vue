<template>
    <div class="fs-list" :tabindex="tabbingIndex" :class="typeClasses" @keydown="onKeyDown" @focus="onFocus" @blur="onBlur">
        <component :is="rowComponent" v-if="header" :columns="parsedColumns" class="fs-list-header">
            <template v-for="(column, idx) in parsedColumns" :slot="idx+1" slot-scope="{ field }">
                <slot :name="`header-${idx+1}`" :field="field"></slot>
            </template>
        </component>
        <div class="fs-list-body">
            <div ref="content" class="fs-list-content" @wheel.capture="passWheel"
                 @mousedown.capture="suspendUpdates" @mouseup.capture="resumeUpdates">
                <component :is="rowComponent" v-for="(row, key) in view" :key="key + index" :row="row" class="fs-list-row"
                           :index="key + index" :style="{ marginTop: key === 0 ? `${firstMargin}px` : 0 }" v-bind="$attrs"
                           :columns="parsedColumns" @mousedown.native.stop @select="onSelectRow" :disabled-field="disabledField"
                           v-fusion-mount @mounted="$nextTick(() => observer.observe($event))">
                    <template v-for="(column, idx) in parsedColumns" :slot="idx+1" slot-scope="{ row, field, index, selectedField }">
                        <slot :name="idx+1" :row="row" :field="field" :index="index" :selectedField="selectedField"></slot>
                    </template>
                </component>
                <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
            </div>
            <div v-if="virtual" class="fs-scroller" ref="scroller" tabindex="-1">
                <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
            </div>
        </div>
        <div v-show="false" v-if="columns" v-html="style"></div>
    </div>
</template>

<script>
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
            rowComponent: {
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
            virtual: {
                type: Boolean
            },
            selectable: {
                type: Boolean
            },
            multiple: {
                default: false
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
                view: [],
                guidClass: `-${this.$fusion.uniqId()}`,
                index: null,
                scale: 1,
                content: null,
                scroller: null,
                observer: null,
                remnant: 0,
                firstMargin: "1px",
                sizerHeight: "1px",
                selectedRows: [],
                hasFocus: false,
                suspended: false,
                tabbingIndex: this.selectable ? this.tabindex || 0 : undefined,
                hasSelection: this.selectable,

                updateProxy: this.updateScroller.bind(this)
            };
        },

        methods: {
            _getRows() {
                return Array.from(this.content.querySelectorAll(".fs-list-row"));
            },

            _setView() {
                this.view = this.virtual ? this.source.slice(this.index, this.index + +this.pageSize) : this.source;
            },

            intersectionCallback(entries) {
                entries.forEach((entry) => {
                    const component = entry.target.__vue__;
                    const event = entry.isIntersecting ? "showing" : "hiding";

                    component && component[event] && component[event].call(component);
                });
            },

            adjustIndex(index) {
                const endOffset = this.source.length - this.view.length;

                if (!index) {
                    index = Math.round(this.scroller.scrollTop / this.rowHeight * this.scale) - this.indexOffset;
                }

                index += index % this.step;

                if (index < 0) {
                    this.remnant = index - index * 2;
                    index = 0;
                } else {
                    this.remnant = 0;
                }

                index > endOffset && (index = endOffset);

                this.index = index;

                if (!this.suspended) {
                    this.content.scrollTop = this.scroller.scrollTop;
                }
            },

            scrollCallback() {
                if (!this.virtual) {
                    return;
                }

                this.adjustIndex();
            },

            passWheel(e) {
                if (!this.virtual) {
                    return;
                }

                if (e.deltaMode) {
                    const lineHeight = keys["ArrowDown"] * this.content.clientHeight;

                    this.scroller.scrollTop += e.deltaY * lineHeight;
                    this.scroller.scrollLeft += e.deltaX * lineHeight;
                } else {
                    this.scroller.scrollTop += e.deltaY;
                    this.scroller.scrollLeft += e.deltaX;
                }
            },

            onFocus() {
                this.hasFocus = true;
            },

            onBlur() {
                this.hasFocus = false;
            },

            onSelectRow(index, newValue) {
                const selected = this.source[index];

                this.$set(this.source[index], this.selectedField, newValue);

                this.selectedRows[index] = selected;

                if (this.multiple === false) {
                    this.selectedRows.forEach((value, key) => {
                        if (value[this.selectedField] && key !== index) {
                            this.source[key][this.selectedField] = false;

                            delete this.selectedRows[key];
                        }
                    });
                }

                if (!this.virtual) {
                    this._setView();
                }

                this.$emit("select", this.multiple === false ? this.selectedRows[index] : Object.values(this.selectedRows));

                this.scrollSelectionIntoView(index);
            },

            scrollSelectionIntoView(index) {
                if (this.virtual) {
                    this.itemList = this._getRows();
                }

                const element = this.itemList[index - this.index];
                const offset = this.indexOffset - this.remnant;

                if (!element) {
                    return;
                }

                this.suspendUpdates();
                if (element.offsetTop <= this.content.scrollTop) {
                    element.scrollIntoView(true);
                    this.virtual && this.adjustIndex(index - offset);
                }

                if (element.offsetTop + element.clientHeight >= this.content.scrollTop + this.content.clientHeight) {
                    element.scrollIntoView(false);
                    this.virtual && this.adjustIndex(index - this.visibleCount - offset);
                }

                this.updateScroller();
                this.resumeUpdates();
            },

            onKeyDown(e) {
                if (this.hasSelection && this.multiple === false && this.selectedRows.length) {
                    const index = +Object.keys(this.selectedRows)[0];

                    let selectedIndex;

                    switch (e.key) {
                        case "ArrowUp": selectedIndex = index - 1;
                            break;
                        case "ArrowDown": selectedIndex = index + 1;
                            break;
                        case "PageUp": selectedIndex = index - Math.round(this.visibleCount - 1);
                            break;
                        case "PageDown": selectedIndex = index + Math.round(this.visibleCount - 1);
                    }

                    selectedIndex <= 0 && (selectedIndex = 0);
                    selectedIndex >= this.source.length && (selectedIndex = this.source.length - 1);

                    if (selectedIndex !== index) {
                        this.onSelectRow(selectedIndex, !this.source[selectedIndex][this.selectedField]);
                    }

                    return;
                }

                if (!this.virtual) {
                    return;
                }

                keys[e.code] && this.scroller.scroll({
                    top: this.scroller.scrollTop + keys[e.code] * this.content.clientHeight,
                    behavior: e.repeat ? "instant" : "smooth"
                });
            },

            updateScroller() {
                if (this.virtual) {
                    this.scroller.scrollTop = this.content.scrollTop;
                }
            },

            suspendUpdates() {
                if (!this.virtual) {
                    return;
                }

                this.suspended = true;

                this.content.addEventListener("scroll", this.updateProxy);
            },

            resumeUpdates() {
                if (!this.virtual) {
                    return;
                }

                this.suspended = false;

                this.content.removeEventListener("scroll", this.updateProxy);
            }
        },

        computed: {
            typeClasses() {
                return this.$fusion.getTypeClasses(this.$fusion.convertToObject(this.look), {
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
                this._setView();
            },

            source() {
                this._setView();
            },

            view() {
                this.$nextTick(() => {
                    this.itemList = this._getRows();

                    if (!this.virtual) {
                        return;
                    }

                    const len = this.itemList.length;

                    if (len) {
                        const firstRowRect = this.itemList.shift().getBoundingClientRect();
                        const lastRowRect = len > 1 && this.itemList.pop().getBoundingClientRect();

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
                });
            }
        },

        mounted() {
            this.content = this.$refs.content;
            this.scroller = this.$refs.scroller;

            if (this.virtual) {
                this.scroller.addEventListener("scroll", this.scrollCallback.bind(this));

                setTimeout(this.adjustIndex.bind(this));
            }

            this.index = 0;

            this.observer = new IntersectionObserver(this.intersectionCallback.bind(this), {
                root: this.content,
                rootMargin: "0px",
                threshold: 0
            });

            this.$emit("mounted");
        }
    };
</script>

<style scoped>
    .fs-list {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .fs-list-body {
        flex: 1;
        min-height: 100px;
        position: relative;
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
    }

    .fs-scroller {
        position: absolute;
        bottom: 0;
        right: 0;
        min-width: 17px;
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
