<template>
    <div class="fs-list">
        <div class="fs-list-content" ref="content" tabindex="-1">
            <div class="fs-sizer" :style="{ height: sizerHeight }"></div>
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" :index="key + index" class="ab-list-row"
                       @mounted="$nextTick(_ => observer.observe($event))" @unmounted="$nextTick(_ => observer.unobserve($event))"
                       :style="{ marginTop: key === 0 && firstMargin || 0 }" ref="rows">
            </component>
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
                observer: null,
                view: [],
                scrollTop: 0,
                firstRowRect: {},
                lastRowRect: {},
                firstMargin: "1px",
                sizerHeight: "1px",
                indexOffset: 0,
                contentHeight: 1
            };
        },

        methods: {
            _getRows() {
                return Array.from(this.content.querySelectorAll(".fs-list-row:not(.fs-sizer)"));
            },

            intersectionCallback(entries) {
                const rows = this._getRows();

                entries.forEach((entry) => {
                    const row = rows[entry.target.__key__ - this.index];
                    const component = row && row.__vue__;
                    const event = entry.isIntersecting ? "showing" : "hiding";

                    component && component[event] && component[event].call(component);
                });
            },

            scrollCallback() {
                let index = Math.round(this.content.scrollTop / this.contentHeight) * this.scale - this.indexOffset;

                index += this.step - (index % this.step);

                index < 0 && (index = 0);
                index > this.endOffset && (index = this.endOffset);

                this.index = index;
            }
        },

        computed: {
            endOffset() {
                return this.source.length - this.pageSize - 1;
            }
        },

        watch: {
            index() {
                this.view = this.source.slice(this.index, this.index + +this.pageSize);

                this.$nextTick(() => {
                    const rows = this._getRows();
                    const len = rows.length;

                    if (len) {
                        this.firstRowRect = rows.shift().getBoundingClientRect();
                        this.lastRowRect = rows.pop().getBoundingClientRect();

                        this.contentHeight = Math.round((this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / this.view.length);

                        const sizerHeight = this.source.length * this.contentHeight;

                        this.scale = sizerHeight / maxHeight;
                        this.firstMargin = `${Math.round(this.index * this.contentHeight / this.scale)}px`;
                        this.indexOffset = Math.floor((this.pageSize - this.content.clientHeight / this.contentHeight) / 2);
                        this.sizerHeight = `${Math.round(sizerHeight / this.scale)}px`;
                    }
                });
            }
        },

        mounted() {
            this.content = this.$refs.content;

            this.content.addEventListener("scroll", this.scrollCallback.bind(this), { passive: true });

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

    .fs-list-content {
        position: relative;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        will-change: scroll-position;
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
