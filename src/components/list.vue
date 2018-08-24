<template>
    <div class="ab-list">
        <div class="ab-list-content" ref="content" tabindex="-1">
            <div class="ab-list-sizer" :style="{ height: sizerHeight }"></div>
            <div ref="container" class="ab-row-container">
                <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" :index="key + index" class="ab-list-row">
                </component>
            </div>
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
                entries.forEach((entry) => {
                    const component = entry.target.__vue__;
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
                return this.source.length - this.pageSize;
            }
        },

        watch: {
            index() {
                this.view = this.source.slice(this.index, this.index + +this.pageSize);

                this.$nextTick(() => {
                    const rows = this._getRows();

                    if (rows) {
                        this.firstRowRect = rows.shift().getBoundingClientRect();
                        this.lastRowRect = rows.pop().getBoundingClientRect();

                        this.contentHeight = Math.round((this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / this.pageSize);

                        const sizerHeight = this.source.length * this.contentHeight;

                        this.scale = Math.ceil(sizerHeight / maxHeight);
                        this.firstMargin = `${Math.round(this.index * this.contentHeight / this.scale)}px`;
                        this.indexOffset = Math.round((this.pageSize - this.content.clientHeight / this.contentHeight) / 2);
                        this.sizerHeight = `${Math.round(sizerHeight / this.scale)}px`;

                        rows.forEach(row => this.observer.observe(row));
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
    .ab-list {
        height: 100%;
    }

    .ab-list-content {
        position: relative;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        will-change: contents;
    }

    .ab-list-sizer {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border: 1px solid transparent;
    }

    .ab-row-container {
        position: sticky;
        top: -43px;
    }
</style>
