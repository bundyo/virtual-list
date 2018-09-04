<template>
    <div id="app">
        <fusion-list :source="source" columns="150px index, * text" page-size="60" virtual selectable multiple observed v-model="beep">
            <span slot="1" slot-scope="{ row, field, index, selectedField }">
                <fusion-checkbox v-model="row[selectedField]" />
                Checkbox {{ index }}
            </span>
        </fusion-list>
    </div>
</template>

<script>
    const source = [...Array(200000)].map((_, idx) => ({ index: idx, text: `Text ${idx}`, value: idx }));

    export default {
        name: "app",

        data() {
            return {
                beep: source[2]
            }
        },

        created() {
            this.source = source;
        },

        watch: {
            beep(value) {
                console.log(value);
            }
        }
    }
</script>

<style>
    :root {
        --light: 255,255,255;
        --dark: 0,0,0;
        --text-light: 2,85,110;
        --text-dark: 2,39,52;
        --accent-light: 71,129,254;
        --accent-dark: 58,83,255;

        --hs-neutral: 197,11%;
        --gray: 0,0%;

        --color-light: rgb(var(--light));
        --color-dark: rgb(var(--dark));

        --color-text-light: rgb(var(--text-light));
        --color-text-dark: rgb(var(--text-dark));

        --color-text-dark-15: rgba(var(--text-dark), .15);
        --color-text-dark-20: rgba(var(--text-dark), .20);
        --color-text-dark-50: rgba(var(--text-dark), .50);

        --background-90: hsl(var(--hs-neutral), 10%);
        --background-80: hsl(var(--hs-neutral), 20%);
        --background-70: hsl(var(--hs-neutral), 30%);
        --background-60: hsl(var(--hs-neutral), 40%);
        --background-50: hsl(var(--hs-neutral), 50%);
        --background-40: hsl(var(--hs-neutral), 60%);
        --background-30: hsl(var(--hs-neutral), 70%);
        --background-20: hsl(var(--hs-neutral), 80%);
        --background-15: hsl(var(--hs-neutral), 85%);
        --background-10: hsl(var(--hs-neutral), 90%);
        --background-5: hsl(var(--hs-neutral), 95%);
        --background-3: hsl(var(--hs-neutral), 98%);

        --background-light-0: var(--color-light);
        --background-light-1: hsl(var(--gray), 99%); /* #FDFDFD */
        --background-light-2: hsl(var(--gray), 98%); /* #FAFAFA */
        --background-light-3: hsl(var(--gray), 97%); /* #F8F8F8 */
        --background-light-5: hsl(var(--gray), 95%);
        --background-light-7: hsl(var(--gray), 93%);
        --background-light-10: hsl(var(--gray), 90%);

        --color-accent-light: rgb(var(--accent-light));
        --color-accent-dark: rgb(var(--accent-dark));
        --color-midnight-light: #14418B;
        --color-midnight-dark: #0F336D;
        --color-dusk-light: #485c71;
        --color-dusk-dark: #2e3e4f;

        --color-success-light: #00E676;
        --color-success-dark: #06CE6A;
        --color-warning-light: #F2C112;
        --color-warning-dark: #F39C11;
        --color-error-light: #ED473F;
        --color-error-dark: #D84039;

        --color-accent-transparent-01: rgba(var(--accent-dark), .01);
        --color-accent-transparent-02: rgba(var(--accent-dark), .02);
        --color-accent-transparent-03: rgba(var(--accent-dark), .03);
        --color-accent-transparent-1: rgba(var(--accent-dark), .1);
        --color-accent-transparent-2: rgba(var(--accent-dark), .2);

        --transparent-black-02: rgba(var(--dark), .02);
        --transparent-black-05: rgba(var(--dark), .05);
        --transparent-black-1: rgba(var(--dark), .1);
        --transparent-black-2: rgba(var(--dark), .2);
        --transparent-black-4: rgba(var(--dark), .4);
        --transparent-black-5: rgba(var(--dark), .5);
        --transparent-black-7: rgba(var(--dark), .7);
        --transparent-black-9: rgba(var(--dark), .9);

        --transparent-white-1: rgba(var(--light), .1);
        --transparent-white-2: rgba(var(--light), .2);
        --transparent-white-5: rgba(var(--light), .5);
        --transparent-white-7: rgba(var(--light), .7);
        --transparent-white-8: rgba(var(--light), .8);
        --transparent-white-9: rgba(var(--light), .9);

        --transparent-background-dark: hsla(var(--gray), 100%, .97);
    }

    body {
        margin: 0;
    }

    #app {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 600px;
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
