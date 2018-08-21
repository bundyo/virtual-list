<template>
    <div class="fs-list">
        <div ref="content" class="fs-list-content">
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" class="fs-list-row"
                       :index="key + index" :style="{ marginTop: key === 0 && firstMargin || 0 }"
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

    export default {
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
            snap: {
                type: Boolean,
                default: false
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
                indexOffset: 0,
                rowHeight: 1
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

            snapToClosest() {
                const rows = this._getRows();

                rows.some((row) => {
                    const rect = row.getBoundingClientRect();

                    if (-rect.top > this.scroller.scrollTop) {
                        this.scroller.scrollTop = -rect.top;

                        return true;
                    }
                });
            },

            scrollCallback() {
                const endOffset = this.source.length - this.visibleCount;

                if (this.snap) {
                    this.snapToClosest();
                }

                let index = Math.round(this.scroller.scrollTop / this.rowHeight * this.scale) - this.indexOffset;

                index += index % this.step;

                index < 0 && (index = 0);
                index > endOffset && (index = endOffset);

                this.index = index;
                this.content.scrollTop = this.scroller.scrollTop;
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
                    const lastRowRect = rows.pop().getBoundingClientRect();

                    this.rowHeight = Math.round((lastRowRect.top - firstRowRect.top + lastRowRect.height) / len);

                    const sizerHeight = this.source.length * this.rowHeight;

                    this.scale = Math.ceil(sizerHeight / maxHeight);
                    this.firstMargin = `${this.index * this.rowHeight / this.scale}px`;
                    this.visibleCount = Math.ceil(this.content.clientHeight / this.rowHeight);
                    this.indexOffset = Math.floor((this.pageSize - this.visibleCount) / 2);
                    this.sizerHeight = `${sizerHeight / this.scale}px`;
                }
            }
        },

        mounted() {
            this.content = this.$refs.content;
            this.scroller = this.$refs.scroller;

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
        position: absolute;
        overflow: hidden;
        width: 100%;
    }

    .fs-sizer {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border: 1px solid transparent;
    }
</style>
