<template>
    <div class="ab-list-content" ref="content">
        <div class="ab-list-sizer" ref="sizer"></div>
        <div v-for="(row, index) in view" :key="index" class="ab-list-row">
            {{ row[textField] }}
        </div>
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
            getHeight() {
                const content = this.content;
                const children = Array.from(content.children);

                if (!children[1]) {
                    return 0;
                }

                this.firstRow = children[1];
                this.lastRow = children[children.length - 1];

                this.firstRowRect = this.firstRow.getBoundingClientRect();
                this.lastRowRect = this.lastRow.getBoundingClientRect();

                if (this.sizer && this.firstRow) {
                    return (this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / this.view.length;
                }

                return 0;
            },

            adjustDimensions(height) {
                if (!this.$el) {
                    return;
                }

                if (!this.source.length) {
                    this.index = 0;
                }

                height = height || this.getHeight();

                if (this.firstRow) {
                    this.firstRow.style.marginTop = `${this.index * height}px`;
                }
            },

            recalcView() {
                const height = this.getHeight();

                this.sizer.style.height = `${this.source.length * height}px`;

                this.adjustDimensions(height);
            },

            instersectionCallback(entries) {
                entries.forEach(entry => {
                    this.index = index(entry) - this.pageSize || 0;
                });
            }
        },

        computed: {
            view() {
                return this.source.slice(this.index, this.pageSize);
            }
        },

        watch: {
            source() {
                this.$nextTick(this.recalcView.bind(this));
            }
        },

        created() {
            this.observer = new IntersectionObserver(this.instersectionCallback.bind(this), {
                root: this.$refs.content,
                rootMargin: "0px",
                threshold: 1
            });
        },

        mounted() {
            this.content = this.$refs.content;
            this.sizer = this.$refs.sizer;

            this.recalcView();

            //if (this.content.children) {
            //    Array.from(this.content.children).forEach(child => {
            //        this.observer.observe(child);
            //    });
            //}
        },

        unmounted() {
            //if (this.content.children) {
            //    Array.from(this.content.children).forEach(child => {
            //        this.observer.unobserve(child);
            //    });
            //}
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
