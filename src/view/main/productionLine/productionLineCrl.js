/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：revisionSearchCrl
 */

import './productionLine.scss';
import { trim } from '@/libs/utils';
import { lineProductApi, lineRecordApi, lineRecordCountNumerApi } from './productionLineService.js';

export default ['$scope', '$rootScope', '$resource', '$state', function ($scope, $rootScope, $resource, $state) {
    // 获取用户登陆信息
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    const productionId = document.getElementById('productionId');

    $scope.list = [
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        },
        {
            value: 1,
            date: new Date(),
            name: 'name'
        }
    ];

    /** **********初始化数据********* */
    $scope.searchData = {
        vin: ''         // vin码
    };

    $scope.focus = true;

    $scope.loading = false;

    $scope.userType = userInfo.userType;

    $scope.lineProductResult = {};

    $scope.lineProductList = [];

    $scope.lineRecordCountNumberInfo = {};

    /** **********业务逻辑********* */

    // 分页查询产线检测记录，获取记录前十条
    const _getlineRecordList = () => {
        // 分页查询产线检测记录
        $resource(lineRecordApi).get({
            pageNum: $rootScope.STATE.pageNum,
            pageSize: 10 || $rootScope.STATE.pageSize
        }, (data) => {
            $scope.lineProductList = data.list || [];
        });
    };

    // 获取今日检测数量
    const _getlineRecordCountNumer = () => {
        $resource(lineRecordCountNumerApi).get((data) => {
            $scope.lineRecordCountNumberInfo = data || {};
        });
    };

    // 跳转
    $scope.go = (str) => {
        $state.go(str);
    };

    // 搜索
    $scope.searchLineProduct = () => {
        if (!productionId.value) {
            $scope.focus = true;
            return;
        }
        $scope.loading = true;
        $scope.searchData.vin = trim(productionId.value);
        $scope.searchData.pageNum = 1;
        $scope.lineProductResult = {};
        // 产线检测
        $resource(lineProductApi).get($scope.searchData, (data) => {
            if (data.code === 'PAGE_TIPS') {
                $scope.lineProductResult.vin = $scope.searchData.vin;
                $scope.lineProductResult.VIN_ERROR = data.message;
            } else {
                $scope.lineProductResult = data;
                $scope.lineProductList = [];
                $scope.lineRecordCountNumberInfo = {};
                _getlineRecordList();               // 获取记录前十条
                _getlineRecordCountNumer();         // 统计当前用户今日检测数量
            }
            $scope.searchData.vin = '';
            productionId.value = '';
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.loading = false;
        });
    };

    // 检测历史
    $scope.historyCheck = () => {
        $state.go('main.historyCheck');
    };

    /** **********初始化页面加载********* */
    _getlineRecordList();               // 获取记录前十条
    _getlineRecordCountNumer();         // 统计当前用户今日检测数量
}];
