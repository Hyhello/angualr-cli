/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：loginCrl
 */

import './login.scss';
import angular from 'angular';
import md5 from 'blueimp-md5';
import Cache from '@/libs/cache';
import { checkIe8 } from '@/libs/utils';
import { loginApi } from './loginService.js';

export default ['$scope', '$resource', '$state', '$rootScope', function ($scope, $resource, $state, $rootScope) {
    const cache = new Cache($rootScope.STATE.cacheSize);
    /** **********初始化数据********* */
    $scope.loginInfo = {
        userName: '',
        password: ''
    };

    $scope.userFocus = true;         // 自动获取焦点

    $scope.pwdFocus = false;    // 密码

    $scope.loading = false;      // 加载

    $scope.isShowTips = checkIe8();

    $scope.rememberList = [];
    $scope.isRemember = true;
    $scope.readCookie = false;
    $scope.selectedItem = {};
    /** **********业务逻辑********* */

    // 查看是否有密码记录
    const loginList = cache.getList();
    if (loginList && loginList.length) {
        $scope.loginInfo = {...loginList[0]};
        $scope.rememberList = loginList;
        $scope.isRemember = true;
        $scope.readCookie = true;
    }

    // autoComplete
    $scope.autoSelect = (val, item) => {
        $scope.selectedItem = $scope.loginInfo = {...item};
    };

    // 用户名改变
    $scope.$watch('loginInfo.userName', (newVal, oldVal) => {
        if (newVal === oldVal) return;
        $scope.readCookie = !!$scope.selectedItem.password;
        $scope.loginInfo.password = $scope.selectedItem.password;
        $scope.selectedItem = {};
    });

    // 登陆
    $scope.clickLogin = () => {
        if (!$scope.loginInfo.userName) {
            $scope.userFocus = true;
            return;
        }
        if (!$scope.loginInfo.password) {
            $scope.pwdFocus = true;
            return;
        }
        $scope.loading = true;
        const loginInfo = angular.copy($scope.loginInfo);
        loginInfo.password = $scope.readCookie
                                ? $scope.loginInfo.password
                                : md5($scope.loginInfo.password).toUpperCase();
        $resource(loginApi).get(loginInfo, (data) => {
            const result = data;
            let router = '';
            // 记住密码
            if ($scope.isRemember) {
                // 保存密码
                cache.setItem(loginInfo);
            }
            // 保存登陆信息
            window.sessionStorage.setItem('userInfo', JSON.stringify(result));
            switch (result.userType) {
                case 1:
                    router = 'main.productionLine';
                    break;
                case 2:
                    router = 'main.check';
                    break;
                case 3:
                    router = 'main.checkVq';
                    break;
            }
            $scope.loading = false;
            $state.go(router);
        }, (e) => {
            $scope.loading = false;
        });
    };
}];
