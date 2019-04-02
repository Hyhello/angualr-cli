/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：配置 store
 */

import app from '@/app';
import state from './state.js';

// 配置全局变量
app.run(['$rootScope', function ($rootScope) {
    $rootScope.STATE = state;
}]);
