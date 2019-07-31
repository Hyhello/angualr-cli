/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：checkCrl
 */
import './check.scss';
import { trim } from '@/libs/utils';
import { findProductionLineRecordApi, changeTboxApi, faultPartApi, repairSuccessApi } from './checkService.js';

export default ['$scope', '$resource', '$state', '$Message', function ($scope, $resource, $state, $Message) {
    const checkId = document.getElementById('checkId');
    /** **********初始化数据********* */

    $scope.loading = false;

    $scope.focus = true;

    $scope.describe = 'VIN';
    $scope.checkType = 'vin';
    $scope.checkInto = {};
    $scope.checkList = [];

    const selectOptions = {
        vin: 'VIN编码',
        imei: 'IMEI',
        deviceCode: 'SN'
    };

    // 初始化数据
    // 下拉改变
    $scope.$watch('checkType', (newVal, oldVal) => {
        $scope.placeholder = selectOptions[newVal];
        $scope.focus = true;
    });

    // 清空
    $scope.clear = () => {
        $scope.checkInto = {};
        $scope.checkList = [];
        checkId.value = '';
        $scope.focus = true;
        $scope.loading = false;
    };

    // 检测
    $scope.check = (val) => {
        let router = '';
        let param = {};
        switch (val) {
            case 'vq':
                router = 'main.checkVq';
                break;
            case 'production':
                router = 'main.productionLine';
                break;
        }
        $state.go(router, param);
    };

    // 解绑
    $scope.untying = (item) => {
        $resource(changeTboxApi).save({vin: item.vin}, {}, (data) => {
            $Message.success('解绑成功!');
            $scope.clear();
        });
    };

    // 标记
    $scope.mark = (item) => {
        let params = {};
        params[$scope.checkType] = item[$scope.checkType];
        if (!params[$scope.checkType]) {
            $Message.warning('无SN/imei');
            return;
        }
        $resource(faultPartApi).save(params, {}, (data) => {
            $Message.success('标记故障件成功!');
            $scope.reset();
        });
    };

    // 返修完成
    $scope.repair = (item) => {
        $resource(repairSuccessApi).save({vin: item.vin}, {}, (data) => {
            $Message.success('返修完成!');
            $scope.clear();
        });
    };

    // 重来
    $scope.reset = () => {
        $scope.checkInto = {};
        $scope.checkList = [];
        $scope.checkType = 'vin';
        $scope.loading = false;
    };

    // 搜索
    $scope.searchLineProduct = () => {
        if (!checkId.value) {
            $scope.focus = true;
            return;
        }
        let param = {};
        $scope.loading = true;
        param[$scope.checkType] = trim(checkId.value);
        $resource(findProductionLineRecordApi).get(param, (data) => {
            $scope.checkInto = {};
            $scope.checkList = [];
            if (data.code === 'PAGE_TIPS' || data.code === 'VEHICLE_NO_BIND_DEVICE') {
                if (data.code === 'VEHICLE_NO_BIND_DEVICE') {
                    $scope.checkInto._code = data.code;
                    $scope.checkType = 'deviceCode';
                }
                $scope.checkInto._ERROR = data.message;
                $scope.checkInto.vehicleStatus = data.vehicleStatus;
            } else {
                $scope.checkInto = data || {};
                $scope.checkList = [$scope.checkInto];
            }
            $scope.describe = ($scope.checkType === 'deviceCode' ? 'SN' : $scope.checkType).toUpperCase();
            $scope.checkInto.prevValue = checkId.value;
            checkId.value = '';
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.clear();
        });
    };
}];
