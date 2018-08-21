<template>
    <div class="ab-list">
        <div ref="container" class="ab-row-container">
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" :index="key + index" class="ab-list-row">
            </component>
        </div>
        <div class="ab-list-content" ref="content" tabindex="-1">
            <div class="ab-list-sizer" :style="{ height: sizerHeight }"></div>
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
                firstRowRect: {},
                lastRowRect: {},
                sizerHeight: "1px",
                indexOffset: 0,
                visibleCount: 0,
                contentHeight: 1
            };
        },

        methods: {
            _getRows() {
                return this.$refs.container ? Array.from(this.$refs.container.children) : [];
            },

            intersectionCallback(entries) {
                const rows = this._getRows();

                entries.forEach((entry) => {
                    const row = rows[entry.target.__key__ - this.index];
                    const component = row && row.__vue__;

                    if (component) {
                        if (entry.isIntersecting) {
                            component["showing"] && component["showing"].call(component);
                        } else {
                            component["hiding"] && component["hiding"].call(component);
                        }
                    }
                });
            },

            scrollCallback() {
                const endOffset = this.source.length - this.visibleCount;

                let index = Math.round(this.content.scrollTop / this.contentHeight) * this.scale;

                index += index % this.step;

                index < 0 && (index = 0);
                index > endOffset && (index = endOffset);

                this.index = index;
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

                        this.contentHeight = Math.round((this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / len);

                        const sizerHeight = this.source.length * this.contentHeight;

                        this.scale = Math.ceil(sizerHeight / maxHeight);
                        this.sizerHeight = `${Math.round(sizerHeight / this.scale)}px`;
                        this.visibleCount = Math.ceil(this.content.clientHeight / this.contentHeight);

                        rows.forEach(row => {
                            this.observer.unobserve(row);
                            this.observer.observe(row);
                        });
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
        overflow: hidden;
        perspective: 1px;
        position: relative;
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
        position: fixed;
        width: 100%;
        z-index: -1;
        top: 0;
    }
</style>
