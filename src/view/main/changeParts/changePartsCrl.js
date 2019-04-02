/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：changePartsCrl
 */

import './changeParts.scss';
import { trim } from '@/libs/utils';
import { queryUnbindVehicleApi, changeTboxApi } from './changePartsService.js';

export default ['$scope', '$rootScope', '$resource', '$state', '$Message', function ($scope, $rootScope, $resource, $state, $Message) {
    const changePartsId = document.getElementById('changePartsId');
    /** **********初始化数据********* */
    $scope.focus = true;
    $scope.loading = false;
    $scope.changePartInfo = {};
    $scope.changePartList = [];

    // 查询VQ检测结果
    const _queryUnbindVehicle = (vin) => {
        $resource(queryUnbindVehicleApi).get({vin}, (data) => {
            $scope.changePartInfo = {};
            $scope.changePartList = [];
            if (data.code === 'PAGE_TIPS') {
                $scope.changePartInfo.vin = vin;
                $scope.changePartInfo.VIN_ERROR = data.message;
            } else {
                $scope.changePartInfo = data || {};
                $scope.changePartList = [$scope.changePartInfo];
            }
            changePartsId.value = '';
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.loading = false;
        });
    };

    // 搜索
    $scope.search = () => {
        if (!changePartsId.value) {
            $scope.focus = true;
            return;
        }
        $scope.loading = true;
        _queryUnbindVehicle(trim(changePartsId.value));         // 获取可解绑的车辆
    };

    // 解绑
    $scope.untying = (item) => {
        $resource(changeTboxApi).save({vin: $scope.changePartInfo.vin}, {}, (data) => {
            $Message.success('解绑成功!');
            item.vehicleStatus = 0;
        });
    };

    // 激活
    $scope.activation = () => {
        $state.go('main.productionLine');
    };
}];
