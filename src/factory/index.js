/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：index.js
 */
import app from '@/app';
import { requireAll } from '@/libs/utils';

const modules = requireAll(require.context('./src', false, /\.js$/));

for (const res in modules) {
    if (modules.hasOwnProperty(res)) {
        app.factory(modules[res].name, modules[res].callback);
    }
}

// 配置文件
app.config(['$httpProvider', '$urlRouterProvider', '$locationProvider', function ($httpProvider, $urlRouterProvider, $locationProvider) {
    // $urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('httpInterceptor');
}]);
