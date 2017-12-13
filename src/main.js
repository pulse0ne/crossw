import Vue from 'vue';
import App from './App';
import VModal from 'vue-js-modal';

import 'font-awesome/css/font-awesome.min.css';

Vue.use(VModal);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});
