/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：mainCrl
 */

import './main.scss';
import { logoutApi } from './mainService.js';

export default ['$scope', '$resource', '$state', '$filter', '$timeout', '$MessageBox', function ($scope, $resource, $state, $filter, $timeout, $MessageBox) {
    // 初始化数据
    $scope.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    // 计算日期
    const getNowTime = () => {
        $scope.timeRange = $filter('dateFormat')(new Date(), 'yyyy-MM-dd hh:mm:ss');
        $timeout(getNowTime, 1000);
    };
    getNowTime();

    // 退出
    $scope.loginOut = () => {
        $MessageBox.confirm('确定注销登陆?', '提示', {
            confirmButtonText: '是的',
            cancelButtonText: '点错了'
        }).then(() => {
            $resource(logoutApi).get(() => {
                window.sessionStorage.removeItem('userInfo'); // 删除用户信息
                $state.go('login');
            });
        }).catch(() => {});
    };
}];
