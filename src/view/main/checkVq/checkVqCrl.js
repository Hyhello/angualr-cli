/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：checkCrl
 */
import './checkVq.scss';
import { trim } from '@/libs/utils';
import { fuelOption, engineOption } from './echarts-config';
import { reReportVqResultApi } from '@/view/main/check/checkService';
import { findProductionLineVQRecordApi, reportVqResultApi, queryTodayDetectionNumberApi } from './checkVqService.js';

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
                $scope.vqCheckInfo.firstLoginTime = data.firstLoginTime;
                $scope.isAbleReport = data.vin && !data.isDetection;         // 有值，则不允许上报
                $scope.vqCheckInfo = data.runDriveVo || {};
                $scope.vqCheckInfo.scanned = data.scanned;

                if (data.fuelQuantity) {
                    $scope.fuelOption.series[0].data[0].value = data.runDriveVo.fuelQuantity || 0;
                    $scope.fuelOption.series[0].axisLine.lineStyle.color[0][1] = '#47bac2';
                    $scope.fuelOption.series[0].splitLine.lineStyle.color = '#47bac2';
                    $scope.fuelOption.series[0].title.color = '#47bac2';
                }
                if (data.coolingFluidTemperature) {
                    $scope.engineOption.series[0].data[0].value = data.runDriveVo.coolingFluidTemperature || 0;
                    $scope.engineOption.series[0].axisLine.lineStyle.color[0][1] = '#47bac2';
                    $scope.engineOption.series[0].axisLine.lineStyle.color[1][1] = '#ff4500';
                    $scope.engineOption.series[0].splitLine.lineStyle.color = '#47bac2';
                    $scope.engineOption.series[0].title.color = '#47bac2';
                }
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
        const api = $scope.userType === 2 ? reReportVqResultApi : reportVqResultApi;
        $resource(api).save({vin: $scope.vqCheckInfo.vin, status: val}, {}, (data) => {
            $Message.success('上报成功!');
            _getlineRecordCountNumer();         // 统计当前用户今日检测数量
        });
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

    // 历史检测
    $scope.historyCheck = () => {
        $state.go('main.historyCheck');
    };

    $scope.$on('$destroy', () => {
        _clearTimeout();
    });
}];
