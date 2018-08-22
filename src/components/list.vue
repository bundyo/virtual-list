<template>
    <div class="fs-list" tabindex="-1">
        <div ref="content" class="fs-list-content">
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" class="fs-list-row"
                       :index="key + index" :style="{ marginTop: key === 0 ? `${firstMargin}px` : 0 }"
                       v-notify-mount @mounted="$nextTick(() => observer.observe($event))">
            </component>
            <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
        </div>
        <div class="fs-scroller" ref="scroller" tabindex="-1">
            <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
        </div>
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

    module.exports = {
        name: "fusion-list",
        props: {
            textField: {
                type: String,
                default: "text"
            },
            step: {
                default: 2
            },
            pageSize: {
                default: 10
            },
            source: {
                type: Array,
                default: () => []
            },
            "row-component": {
                default: "fusion-list-row"
            }
        },

        data() {
            return {
                index: null,
                scale: 1,
                content: null,
                scroller: null,
                observer: null,
                firstMargin: "1px",
                sizerHeight: "1px",
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
                this.scroller.scrollTop += e.deltaY;
                this.scroller.scrollLeft += e.deltaX;
            },

            passKeys(e) {
                this.scroller.scroll({
                    top: this.scroller.scrollTop + keys[e.code] * this.content.clientHeight,
                    behavior: e.repeat ? "instant" : "smooth"
                });
            }
        },

        computed: {
            view() {
                return this.source.slice(this.index, this.index + +this.pageSize);
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
            const passProxy = this.passKeys.bind(this);

            this.content.addEventListener("wheel", this.passWheel.bind(this), true);
            this.$el.addEventListener("keydown", passProxy);

            this.scroller.addEventListener("scroll", this.scrollCallback.bind(this), { passive: true });

            this.observer = new IntersectionObserver(this.intersectionCallback.bind(this), {
                root: this.content,
                rootMargin: "0px",
                threshold: 0
            });

            this.index = 0;
        },
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
        overflow: hidden;
        width: 100%;
        top: 0;
        flex: 1;
    }

    .fs-scroller {
        min-width: 9px;
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
