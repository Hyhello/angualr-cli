/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：checkCrl
 */
import './checkVq.scss';
import { trim } from '@/libs/utils';
import { fuelOption, engineOption } from './echarts-config';
import { reReportVqResultApi } from '@/view/main/check/checkService';
import { findProductionLineVQRecordApi, queryTodayDetectionNumberApi } from './checkVqService.js';

export default ['$scope', '$resource', '$state', '$timeout', '$Message', function ($scope, $resource, $state, $timeout, $Message) {
    // 获取用户登陆信息
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    const checkVqId = document.getElementById('checkVqId');
    /** **********初始化数据********* */
    let timer = null;
    $scope.loading = false;
    $scope.focus = true;
    $scope.userType = userInfo.userType;
    $scope.fuelOption = fuelOption;
    $scope.engineOption = engineOption;
    $scope.isAbleReport = false;            // 是否允许上报
    $scope.lineRecordCountNumberInfo = {};
    $scope.vqCheckInfo = {};
    // 初始化图片
    $scope._src = _require('00000');

    // 获取图片
    function _require (name) {
        return require(`../../../assets/images/carDoorType/${name}.png`);
    };

    // 获取今日检测数量
    const _getlineRecordCountNumer = () => {
        $resource(queryTodayDetectionNumberApi).get((data) => {
            $scope.lineRecordCountNumberInfo = data || {};
        });
    };
    _getlineRecordCountNumer();         // 统计当前用户今日检测数量

    // clearTimeout
    const _clearTimeout = () => {
        if (timer) {
            $timeout.cancel(timer);
            timer = null;
        }
    };

    // setTimeout
    const _setTimeout = (vin) => {
        timer = $timeout(() => {
            _findProductionLineVQRecord(vin);
        }, 5000);
    };

    // 查询VQ检测结果
    const _findProductionLineVQRecord = (vin) => {
        _clearTimeout();
        $resource(findProductionLineVQRecordApi).get({vin}, (data) => {
            $scope.vqCheckInfo = {};
            if (data.code === 'PAGE_TIPS') {
                $scope.vqCheckInfo.vin = vin;
                $scope.vqCheckInfo.VIN_ERROR = data.message;
            } else {
                $scope.isAbleReport = data.vin && !data.isDetection;         // 有值，则不允许上报
                $scope.vqCheckInfo = data.runDriveVo || {};
                $scope.vqCheckInfo.scanned = data.scanned;
                $scope.vqCheckInfo.firstLoginTime = data.firstLoginTime;
                let nameStr = '';
                ['leftFrontDoorStatus', 'leftBackDoorStatus', 'trunkStatus', 'rightFrontDoorStatus', 'rightBackDoorStatus'].forEach(item => {
                    nameStr += $scope.vqCheckInfo[item] === 1 ? 1 : 0;
                });
                $scope._src = _require(nameStr);
            }
            checkVqId.value = '';
            $scope.focus = true;
            $scope.loading = false;
            _setTimeout(vin);
        }, (e) => {
            $scope.loading = false;
        });
    };

    // 上报ok
    const _reportVq = (val) => {
        _clearTimeout();
        $resource(reReportVqResultApi).save({vin: $scope.vqCheckInfo.vin, status: val}, {}, (data) => {
            $Message.success('上报成功!');
            _getlineRecordCountNumer();         // 统计当前用户今日检测数量
            if (userInfo.userType === 2) {
                $state.go('main.check');
            } else {
                $state.reload();
            }
        });
    };

    // 返回到返修页面
    $scope.go = () => {
        $state.go('main.check');
    };

    // 判断
    $scope.checkVq = (val) => {
        if (val === 2) {
            $state.go('main.checkVq.checkNg', {vin: $scope.vqCheckInfo.vin});
            return;
        }
        _reportVq(val);
    };

    // 搜索
    $scope.search = () => {
        if (!checkVqId.value) {
            $scope.focus = true;
            return;
        }
        $scope.loading = true;
        // 查询VQ检测结果
        _findProductionLineVQRecord(trim(checkVqId.value));
        _getlineRecordCountNumer();         // 统计当前用户今日检测数量
    };

    // 检测历史
    $scope.historyCheck = () => {
        $state.go('main.vqhistory');
    };

    $scope.$on('$destroy', () => {
        _clearTimeout();
    });
}];
