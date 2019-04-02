/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：checkCrl
 */
import './check.scss';
import { trim } from '@/libs/utils';
import { findProductionLineRecordApi } from './checkService.js';

export default ['$scope', '$resource', '$state', function ($scope, $resource, $state) {
    const checkId = document.getElementById('checkId');
    /** **********初始化数据********* */

    $scope.loading = false;

    $scope.focus = true;

    $scope.checkType = 'imei';
    $scope.checkInto = {};
    $scope.checkList = [];

    const selectOptions = {
        vin: '车架号',
        imei: 'IMEI',
        deviceCode: 'SN'
    };

    // 初始化数据
    // 下拉改变
    $scope.$watch('checkType', (newVal, oldVal) => {
        $scope.placeholder = selectOptions[newVal];
        $scope.focus = true;
    });

    // 检测
    $scope.check = (val) => {
        let router = '';
        switch (val) {
            case 'vq':
                router = 'main.checkVq';
                break;
            case 'production':
                router = 'main.productionLine';
                break;
            case 'change':
                router = 'main.changeParts';
                break;
        }
        $state.go(router);
    };

    // 搜索
    $scope.searchLineProduct = () => {
        if (!checkId.value) {
            $scope.focus = true;
            return;
        }
        const param = {};
        $scope.loading = true;
        param[$scope.checkType] = trim(checkId.value);
        $resource(findProductionLineRecordApi).get(param, (data) => {
            $scope.checkInto = data || {};
            $scope.checkList = [$scope.checkInto];
            checkId.value = '';
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.loading = false;
        });
    };
}];
