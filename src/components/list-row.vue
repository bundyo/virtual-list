<template>
    <div class="ab-list-row">
        {{ item.text }}
    </div>
</template>

<script>
    export default {
        name: "fusion-list-row",

        props: ["item", "index"],

        watch: {
            index(value) {
                this.$el.__key__ = value;
            }
        },

        mounted() {
            this.$el.__key__ = this.index;

            this.$emit("mounted", this.$el);
        },

        unmounted() {
            this.$emit("unmounted", this.$el);
        }
    }
</script>

<style scoped>
    .ab-list-row {
        height: 40px;
        border: solid red;
        border-width: 1px 0;
    }

    .ab-list-row:nth-child(2n) {
        background: #efefef;
    }
</style>
