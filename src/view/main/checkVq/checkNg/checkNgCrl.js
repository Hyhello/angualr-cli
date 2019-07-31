import './checkNg.scss';
import { reportVqFailureApi } from './checkNgService';
import { findProductionLineVQRecordApi, queryTodayDetectionNumberApi } from '@/view/main/checkVq/checkVqService.js';

export default ['$scope', '$resource', '$state', '$Message', '$stateParams', function ($scope, $resource, $state, $Message, $stateParams) {
    $scope.vqCheckInfo = {};
    $scope.lineRecordCountNumberInfo = {};

    // 初始化图片
    $scope._src = _require('00000');

    // 获取图片
    function _require (name) {
        return require(`../../../../assets/images/carDoorType/${name}.png`);
    };

    // 查询VQ检测结果
    const _findProductionLineVQRecord = (vin) => {
        $resource(findProductionLineVQRecordApi).get({vin}, (data) => {
            $scope.vqCheckInfo = {};
            if (data.code === 'PAGE_TIPS') {
                $scope.vqCheckInfo.vin = vin;
                $scope.vqCheckInfo.VIN_ERROR = data.message;
            } else {
                $scope.vqCheckInfo.firstLoginTime = data.firstLoginTime;
                const vqCheckInfo = data.runDriveVo || {};
                $scope.vqCheckInfo.scanned = data.scanned;
                $scope.vqCheckInfo.vin = data.vin;
                let nameStr = '';
                ['leftFrontDoorStatus', 'leftBackDoorStatus', 'trunkStatus', 'rightFrontDoorStatus', 'rightBackDoorStatus'].forEach(item => {
                    nameStr += vqCheckInfo[item] === 1 ? 1 : 0;
                    $scope.vqCheckInfo[item] = 1;
                });
                $scope.vqCheckInfo.lteMainStatus = vqCheckInfo.lteMainStatus === 2 ? 1 : 2;
                $scope.vqCheckInfo.lteDiversityStatus = vqCheckInfo.lteDiversityStatus === 2 ? 1 : 2;
                $scope.vqCheckInfo.gpsAntennaStatus = vqCheckInfo.gpsAntennaStatus === 3 ? 1 : 2;
                $scope._src = _require(nameStr);
            }
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.loading = false;
        });
    };

    _findProductionLineVQRecord($stateParams.vin);

     // 获取今日检测数量
     const _getlineRecordCountNumer = () => {
        $resource(queryTodayDetectionNumberApi).get((data) => {
            $scope.lineRecordCountNumberInfo = data || {};
        });
    };
    _getlineRecordCountNumer();         // 统计当前用户今日检测数量

    // 该车检测完成
    $scope.checkOk = () => {
        let params = {
            ...$scope.vqCheckInfo
        };
        delete params.firstLoginTime;
        delete params.scanned;
        $resource(reportVqFailureApi).save(null, params, (data) => {
            $Message.info('检测成功!');
            $state.go('main.checkVq');
        });
    };
}];
