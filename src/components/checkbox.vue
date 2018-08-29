<template>
    <div class="fs-checkbox fs-element -checkbox" :class="typeClasses" @click="$emit('click', $event)">
        <div v-if="external && label" class="checkbox__text" v-html="label"></div>
        <span v-if="external" class="checkbox__externals -on">{{ offLabel }}</span>
        <input :id="guid" type="checkbox" class="checkbox__input" v-model="toggleValue" :name="name" :disabled="disabled">
        <label :for="guid" class="checkbox__label" :on-label="external ? '' : onLabel" :off-label="external ? '' : offLabel">
            <div>
                <i class="checkbox__icon fa fa-check"></i>
            </div>
            <span v-if="!external && label" class="checkbox__text" v-html="label"></span>
            <slot></slot>
        </label>
        <span v-if="external" class="checkbox__externals -off">{{ onLabel }}</span>
    </div>
</template>

<script>
    export default {
        name: "fusion-checkbox",

        props: ["look", "value", "name", "disabled", "label", "on-label", "off-label", "checked", "external-labels"],

        data() {
            return {
                guid: this.$fusion.uniqId(),
                external: this.externalLabels !== undefined
            };
        },

        computed: {
            types() {
                return this.$fusion.convertToObject(this.look);
            },

            typeClasses() {
                return this.$fusion.getTypeClasses(this.types, {
                    "-disabled": this.disabled,
                    "-checked": this.checked,
                    "-external-labels": this.external
                });
            },

            toggleValue: {
                get() {
                    return this.value || this.checked;
                },

                set(value) {
                    this.$emit("input", value);
                }
            }
        }
    };
</script>

<style scoped>
    /* Checkbox and Radio buttons */

    html .fs-radio,
    html .fs-checkbox {
        line-height: 20px;
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
    }

    html .fs-checkbox {
        font-size: x-small;
    }

    html .fs-radio .radio__icon,
    html .fs-radio .radio__icon:before,
    html .fs-radio .radio__input:active + label .radio__icon {
        background: var(--background-light-3);
    }

    html .fs-radio .radio__label {
        vertical-align: middle;
        width: auto;
    }

    .fs-checkbox .checkbox__input {
        position: absolute;
        margin: 0;
        width: 1em;
        height: 1em;
        font-size: 14px;
        z-index: 2;
        opacity: 0;
        cursor: pointer;
    }

    .fs-checkbox .checkbox__input:disabled,
    .fs-checkbox .checkbox__input:disabled + label {
        cursor: default;
    }

    .fs-radio .radio__icon,
    .fs-checkbox .checkbox__icon {
        top: 0;
        float: none;
        width: 1em;
        height: 1em;
        font-size: 15px;
        border-radius: 2px;
        color: var(--background-light-3);
        background: currentColor;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: border-color .3s;
        transition-property: color, border-color;
    }

    .fs-radio .radio__icon:before,
    .fs-checkbox .checkbox__icon:before {
        font-size: 11px;
    }

    html .fs-radio .radio__label .fs-icon {
        margin-bottom: 10px;
    }

    html .fs-radio .radio__label .radio__text {
        position: relative;
    }

    html .fs-radio .radio__input:checked + label .radio__icon,
    html .fs-checkbox .checkbox__input:active + label .checkbox__icon,
    html .fs-checkbox .checkbox__input:checked + label .checkbox__icon {
        border-color: var(--color-accent-dark);
        background-color: var(--color-accent-dark);
        color: var(--background-light-0);
    }

    html .fs-radio .radio__input:focus + label .radio__icon,
    html .fs-checkbox .checkbox__input:focus + label .checkbox__icon {
        border-color: var(--color-accent-dark);
    }

    .fs-checkbox .checkbox__input:checked + label .checkbox__icon:before,
    .fs-checkbox .checkbox__input:checked + label .radio__icon:before {
        opacity: 1;
    }

    .fs-checkbox .checkbox__input:indeterminate + label .checkbox__icon:before {
        opacity: 1;
        content: '';
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        margin: -25%;
    }

    .fs-checkbox .checkbox__label,
    .fs-radio .radio__label {
        position: relative;
        width: 100%;
        white-space: nowrap;
        cursor: pointer;
        transition: color .3s;
        font-weight: 600;
    }

    .fs-checkbox .checkbox__label .checkbox__text,
    .fs-checkbox .checkbox__label .radio__text,
    .fs-radio .radio__label .checkbox__text,
    .fs-radio .radio__label .radio__text {
        display: inline-block;
        vertical-align: middle;
        white-space: normal;
        margin-left: 5px;
    }

    .fs-checkbox.-ellipsis,
    .fs-radio.-ellipsis {
        width: 100%;
    }

    .fs-checkbox.-ellipsis label .checkbox__text,
    .fs-checkbox.-ellipsis label .radio__text,
    .fs-radio.-ellipsis label .checkbox__text,
    .fs-radio.-ellipsis label .radio__text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: break-word;
        width: 100%;
        padding-left: 21px;
        margin-left: -16px;
    }


    /* Checkbox span text */

    html .fs-radio .radio__label span,
    html .fs-checkbox .checkbox__label {
        display: inline-flex;
        align-items: center;
    }

    html .fs-radio .radio__label span {
        justify-content: center;
    }

    html .fs-checkbox .checkbox__label > div {
        position: relative;
        height: 100%;
    }

    html .fs-radio .radio__label,
    html .fs-checkbox .checkbox__label {
        position: relative;
        z-index: 0;
        display: inline-flex;
        align-items: center;
    }

    html .fs-radio .radio__label .radio__text,
    html .fs-checkbox .checkbox__label .checkbox__text {
        font-weight: 400;
        font-size: 13px;
        color: var(--color-text-dark);
    }

    html .fs-radio .radio__input:disabled + label .radio__icon:before,
    html .fs-checkbox.-disabled .checkbox__label .checkbox__icon {
        opacity: .5;
    }

    html .fs-radio .radio__input:disabled + label .radio__icon,
    html .fs-checkbox.-disabled .checkbox__label .checkbox__icon {
        border-color: var(--background-30);
    }

    html .fs-radio.-disabled .radio__label .radio__text,
    html .fs-checkbox.-disabled .checkbox__label .checkbox__text {
        color: var(--transparent-black-5);
    }

    /* Focus states */

    html .fs-checkbox.-switch .checkbox__input + label .checkbox__icon,
    html .fs-checkbox .checkbox__input + label > div:after,
    html .fs-radio .radio__input + label > div:after,
    :-webkit-any(main, .ab-dialog) .fs-button:after {
        content: "\a0";
        position: absolute;
        display: block;
        z-index: 0;
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border-radius: 2px;
        background: none;
        border: 1px solid transparent;
        transition: border .2s ease-out;
    }

    html .fs-checkbox.-switch svg path,
    html .fs-checkbox.-switch label > div:after,
    html .fs-checkbox.-switch label .checkbox__icon:after,
    html .fs-checkbox.-switch label .checkbox__icon:before {
        display: none;
    }

    html .fs-checkbox.-switch .checkbox__input + label .checkbox__icon,
    html .fs-radio .radio__input + label .radio__icon:after {
        border-radius: 50px;
    }

    html .fs-checkbox.-switch .checkbox__input:focus + label .checkbox__icon,
    html .fs-checkbox.-switch .checkbox__input:active + label .checkbox__icon,
    html .fs-checkbox .checkbox__input:checked:focus + label > div:after,
    html .fs-checkbox .checkbox__input:checked:active + label > div:after,
    html .fs-radio .radio__input:checked:focus + label .radio__icon:after,
    html .fs-radio .radio__input:checked:active + label .radio__icon:after,
    :-webkit-any(main, .ab-dialog) .fs-button:focus:after {
        border-color: var(--color-accent-light);
    }

    /* Switch */

    .fs-checkbox.-switch {
        display: inline-block;
        vertical-align: baseline;
    }

    .fs-radio .radio__label,
    .fs-checkbox .checkbox__label,
    .fs-checkbox.-switch input + label:after,
    .fs-checkbox.-switch input + label:before {
        display: block;
    }

    .fs-radio,
    .fs-checkbox,
    .fs-radio .radio__label,
    .fs-checkbox.-switch input + label {
        position: relative;
    }

    .fs-checkbox.-switch input + label:after,
    .fs-checkbox.-switch input + label:before {
        position: absolute;
    }

    .fs-checkbox.-switch input + label:after {
        background: var(--background-20);
    }

    .fs-checkbox.-switch input + label,
    .fs-checkbox.-switch input:checked + label {
        border: 1px solid var(--background-20);
    }

    .fs-checkbox.-switch input:checked + label:before {
        content: attr(on-label);
        color: var(--color-accent-dark);
    }

    .fs-checkbox.-switch.-always-on input + label:after {
        background: var(--color-accent-dark);
    }

    .fs-checkbox.-switch input:checked + label:after {
        background: var(--color-accent-dark);
    }

    .fs-checkbox.-switch svg,
    .fs-checkbox.-switch label .checkbox__icon {
        display: none;
    }

    html .fs-checkbox.-switch .checkbox__text {
        flex: 100%;
        font-size: 13px;
        padding-bottom: 8px;
    }

    html .fs-checkbox.-switch input + label {
        text-indent: 0;
        width: 40px;
        background: var(--background-light-3);
    }

    html .fs-checkbox.-switch input:checked + label:after {
        left: 21px;
    }

    .fs-checkbox.-switch .checkbox__label .checkbox__text {
        font-size: 12px;
        margin-left: 50px;
    }

    .fs-checkbox.-switch.-external-labels > .checkbox__externals,
    .fs-checkbox.-switch.-external-labels .checkbox__label {
        display: inline-block;
        vertical-align: middle;
    }

    .fs-checkbox.-switch.-external-labels > .checkbox__externals {
        font-size: 12px;
    }

    .fs-checkbox.-switch.-external-labels > .checkbox__externals.-on {
        margin: 0 5px 0 0;
    }

    .fs-checkbox.-switch.-external-labels > .checkbox__externals.-off {
        margin: 0 0 0 5px;
    }
</style>
