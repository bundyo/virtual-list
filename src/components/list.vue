<template>
    <div class="ab-list-container">
        <div class="ab-list-sizer"></div>
        <div v-for="(row, index) in view" :key="index" class="ab-list-row">
            {{ row[row.textField] }}
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
        options: {
            props: {
                source: {
                    type: Array,
                    default: []
                }
            },

            data() {
                return {
                    index: 0,
                    pageSize: 10,
                    textField: "text"
                };
            },

            methods: {
                adjustHeight() {
                    if (!this.$el) {
                        return;
                    }

                    const firstChild = this.$el.firstChild;

                    if (firstChild) {
                        firstChild.style.height = `${this.source.length * parseFloat(firstChild.nextElementSibling.offsetHeight)}px`;
                    }
                },

                instersectionCallback(entries) {
                    entries.forEach(entry => {
                        this.index = index(entry) - this.pageSize || 0;
                    });
                }
            },

            computed: {
                view() {
                    this.adjustHeight();

                    return this.source.slice(this.index, this.pageSize);
                }
            },

            created() {
                this.observer = new IntersectionObserver(this.instersectionCallback.bind(this), {
                    root: document.querySelector("#scrollArea"),
                    rootMargin: "0px",
                    threshold: 1
                });
            },

            mounted() {
                this.adjustHeight();

                if (this.$el.children) {
                    Array.from(this.$el.children).forEach(child => {
                        this.observer.observe(child);
                    });
                }
            },

            unmounted() {
                if (this.$el.children) {
                    Array.from(this.$el.children).forEach(child => {
                        this.observer.unobserve(child);
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 50px;
        border: solid red;
        border-width: 1px 0;
    }

    .ab-list-container {
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