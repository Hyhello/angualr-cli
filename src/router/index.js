
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
            controller: _importJs('login/loginCrl'),
            data: {
                title: '登陆'
            }
        })
        .state('text', {
            url: '/text',
            template: _importHtml('text/text'),
            controller: _importJs('text/textCrl'),
            data: {
                title: '测试'
            }
        })
        .state('main', {
            url: '/main',
            abstract: true,
            template: _importHtml('main/main'),
            controller: _importJs('main/mainCrl'),
            data: {
                title: '首页'
            }
        })
        // 产线检测
        .state('main.productionLine', {
            url: '/productionLine',
            template: _importHtml('main/productionLine/productionLine'),
            controller: _importJs('main/productionLine/productionLineCrl'),
            data: {
                title: '总装检测'
            }
        })
        .state('main.historyCheck', {
            url: '/historyCheck',
            template: _importHtml('main/historyCheck/historyCheck'),
            controller: _importJs('main/historyCheck/historyCheckCrl'),
            data: {
                title: '总装检测历史'
            }
        })
        .state('main.vqhistory', {
            url: '/vqhistory',
            template: _importHtml('main/vqhistory/vqhistory'),
            controller: _importJs('main/vqhistory/vqhistoryCrl'),
            data: {
                title: 'vq检测历史'
            }
        })
        // 检测
        .state('main.check', {
            url: '/check',
            template: _importHtml('main/check/check'),
            controller: _importJs('main/check/checkCrl'),
            data: {
                title: '返修换件'
            }
        })
        .state('main.checkVq', {
            url: '/checkVq',
            template: _importHtml('main/checkVq/checkVq'),
            controller: _importJs('main/checkVq/checkVqCrl'),
            data: {
                title: 'VQ检测'
            }
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
        if (toState.name === 'login' || toState.name === 'text') return;
        // 检测是否登陆
        if (!window.sessionStorage.getItem('userInfo')) {
            event.preventDefault();
            $state.go('login');
        }
    });
    // 设置title
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        $rootScope.STATE.routeTitle = toState.data.title;
    });
}]);
