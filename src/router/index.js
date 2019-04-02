
/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：路由文件
 */

import app from '@/app';
import _importBase from './_import.js';

const _importHtml = _importBase('html');
const _importJs = _importBase('js');

// 路由转换
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider
        .state('login', {
            url: '/login',
            template: _importHtml('login/login'),
            controller: _importJs('login/loginCrl')
        })
        .state('main', {
            url: '/main',
            abstract: true,
            template: _importHtml('main/main'),
            controller: _importJs('main/mainCrl')
        })
        // 产线检测
        .state('main.productionLine', {
            url: '/productionLine',
            template: _importHtml('main/productionLine/productionLine'),
            controller: _importJs('main/productionLine/productionLineCrl')
        })
        .state('main.historyCheck', {
            url: '/historyCheck',
            template: _importHtml('main/historyCheck/historyCheck'),
            controller: _importJs('main/historyCheck/historyCheckCrl')
        })
        // 检测
        .state('main.check', {
            url: '/check',
            template: _importHtml('main/check/check'),
            controller: _importJs('main/check/checkCrl')
        })
        .state('main.changeParts', {
            url: '/changeParts',
            template: _importHtml('main/changeParts/changeParts'),
            controller: _importJs('main/changeParts/changePartsCrl')
        })
        .state('main.checkVq', {
            url: '/checkVq',
            template: _importHtml('main/checkVq/checkVq'),
            controller: _importJs('main/checkVq/checkVqCrl')
        })
        .state('main.checkVq.checkNg', {
            url: '/checkNg/:vin',
            views: {
                '@main': {
                    template: _importHtml('main/checkVq/checkNg/checkNg'),
                    controller: _importJs('main/checkVq/checkNg/checkNgCrl')
                }
            }
        });
}]);

// 拦截
app.run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name === 'login') return;
        // 检测是否登陆
        if (!window.sessionStorage.getItem('userInfo')) {
            event.preventDefault();
            $state.go('login');
        }
    });
}]);
