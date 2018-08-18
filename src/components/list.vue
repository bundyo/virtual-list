<template>
    <div class="ab-list">
        <div class="ab-list-content" ref="content" tabindex="-1">
            <div class="ab-list-sizer" :style="{ height: sizerHeight }"></div>
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" :index="key + index" class="ab-list-row"
                       @mounted="$nextTick(_ => observer.observe($event))" @unmounted="$nextTick(_ => observer.unobserve($event))"
                       :style="{ marginTop: key === 0 && firstMargin || 0 }" ref="rows">
            </component>
        </div>
    </div>
</template>

<script>
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
            intersectionCallback(entries) {
                entries.forEach((entry) => {
                    const component = this.$refs.rows[entry.target.__key__ - this.index];

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
                let index = Math.round(this.content.scrollTop / this.contentHeight) - this.indexOffset;

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
                    const allRows = Array.from(this.content.querySelectorAll("*:not(.ab-list-sizer)"));

                    this.firstRowRect = allRows.shift().getBoundingClientRect();
                    this.lastRowRect = allRows.pop().getBoundingClientRect();

                    this.contentHeight = Math.round((this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / this.view.length);
                    this.firstMargin = `${this.index * this.contentHeight}px`;
                    this.sizerHeight = `${this.source.length * this.contentHeight}px`;
                    this.indexOffset = Math.round((this.pageSize - this.content.clientHeight / this.contentHeight) / 2);
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
        will-change: scroll-position;
    }

    .ab-list-sizer {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border: 1px solid transparent;
    }
</style>
