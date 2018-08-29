import Vue from 'vue';
import App from './App.vue';
import fusion from  "./fusion.js";

Vue.use(fusion);

Vue.config.productionTip = false;

Vue.$load(["list", "list-row"])
    .then(() => {
        new Vue({
            render: h => h(App)
        }).$mount('#app');
    });
