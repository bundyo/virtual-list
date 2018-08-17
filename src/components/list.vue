<template>
    <div class="ab-list">
        <div class="ab-list-content" ref="content" tabindex="-1">
            <div class="ab-list-sizer" ref="sizer" :style="{ height: sizerHeight }"></div>
            <component :is="rowComponent" v-for="(item, key) in view" :key="key + index" :item="item" :index="key + index" class="ab-list-row"
                       @mounted="$nextTick(_ => observer.observe($event))" @unmounted="$nextTick(_ => observer.unobserve($event))"
                       :style="{ marginTop: key === 0 && firstMargin || 0 }" ref="rows">
            </component>
        </div>
    </div>
</template>

<script>
    const visibleElements = [];

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
                index: 0,
                content: null,
                observer: null
            };
        },

        methods: {
            instersectionCallback(entries) {
                entries.reverse().forEach(function(entry) {
                    if (entry.isIntersecting) {
                        visibleElements[entry.boundingClientRect.bottom < entry.rootBounds.height ? "unshift" : "push"](entry.target);
                    } else {
                        const visibilityIndex = visibleElements.indexOf(entry.target);

                        visibilityIndex >= 0 && visibleElements.splice(visibilityIndex, 1);
                    }
                });

                if (visibleElements.length) {
                    this.index = visibleElements[0].__key__ - this.indexOffset;

                    this.index += this.step - (this.index % this.step);

                    this.index < 0 && (this.index = 0);
                    this.index > this.source.length - this.pageSize - 1 && (this.index = this.source.length - this.pageSize - 1);

                    //console.log(this.index, visibleElements[0].__key__, this.indexOffset);
                }
            }
        },

        computed: {
            firstMargin() {
                return `${this.index * this.contentHeight}px`;
            },

            sizerHeight() {
                return `${this.source.length * this.contentHeight}px`;
            },

            indexOffset() {
                return Math.round((this.pageSize - this.content.clientHeight / this.contentHeight) / 2)
            },

            firstRowRect() {
                return this.$refs.rows[0].$el.getBoundingClientRect();
            },

            lastRowRect() {
                return this.$refs.rows[this.$refs.rows.length - 1].$el.getBoundingClientRect();
            },

            contentHeight() {
                if (!this.content) {
                    return 1;
                }

                return Math.round((this.lastRowRect.top - this.firstRowRect.top + this.lastRowRect.height) / this.view.length);
            },

            view() {
                return this.source.slice(this.index, this.index + +this.pageSize);
            }
        },

        mounted() {
            this.content = this.$refs.content;

            this.observer = new IntersectionObserver(this.instersectionCallback.bind(this), {
                root: this.content,
                rootMargin: "0px",
                threshold: 0
            });
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
