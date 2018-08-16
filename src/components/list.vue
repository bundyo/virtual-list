<template>
    <div class="ab-list-content" ref="content">
        <div class="ab-list-sizer" ref="sizer" :style="{ height: sizerHeight }"></div>
        <component :is="rowComponent" v-for="(item, index) in view" :key="index" :item="item" class="ab-list-row"
                   @mounted="observer.observe($event)" @unmounted="observer.unobserve($event)"
                   :style="{ marginTop: index === 0 && firstMargin }" ref="rows">
        </component>
    </div>
</template>

<script>
    function index(element) {
        if (element && element.parentElement) {
            return Array.from(element.parentElement.children).indexOf(element);
        }

        return -1;
    }

    export default {
        name: "fusion-list",
        props: {
            textField: {
                type: String,
                default: "text"
            },
            pageSize: {
                type: Number,
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
                index: 0,
                content: null,
                sizer: null,
                firstRow: null,
                lastRow: null
            };
        },

        methods: {
            instersectionCallback(entries) {
                entries.some(entry => {
                    if (entry.intersectionRatio > 0 && entry.isIntersecting && entry.boundingClientRect.y < 0 ||
                        entry.intersectionRatio < 0 && !entry.isIntersecting) {
                        console.log(entry);
                        this.index = index(entry.target) - 1;

                        this.index < 0 && (this.index = 0);

                        return true;
                    }
                });
            }
        },

        computed: {
            firstMargin() {
                return `${this.index * this.contentHeight}px`;
            },

            sizerHeight() {
                console.log(this.source.length, this.contentHeight);
                return `${this.source.length * this.contentHeight}px`;
            },

            contentHeight() {
                if (!this.content) {
                    return 0;
                }

                const rows = this.$refs.rows;
                const firstRowRect = rows[0].$el.getBoundingClientRect();
                const lastRowRect = rows[rows.length - 1].$el.getBoundingClientRect();

                return Math.round((lastRowRect.top - firstRowRect.top + lastRowRect.height) / this.view.length);
            },

            view() {
                return this.source.slice(this.index, this.index + this.pageSize);
            }
        },

        created() {
            this.observer = new IntersectionObserver(this.instersectionCallback.bind(this), {
                root: this.$refs.content,
                rootMargin: "0px",
                threshold: 0
            });
        },

        mounted() {
            this.content = this.$refs.content;
            this.sizer = this.$refs.sizer;
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 50px;
        border: solid red;
        border-width: 1px 0;
    }

    .ab-list-content {
        position: relative;
        height: 200px;
        overflow: hidden;
        overflow-y: auto;
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
