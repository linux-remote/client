const Vue = window.Vue;
import {wellSize, trimEnd0, timeFormat} from './util';

Vue.filter('wellSize', wellSize);
Vue.filter('trimEnd0', trimEnd0);
Vue.filter('timeFormat', timeFormat);