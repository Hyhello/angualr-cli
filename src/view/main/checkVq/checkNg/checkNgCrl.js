import './checkNg.scss';
import { reportVqFailureApi } from './checkNgService';
import { findProductionLineVQRecordApi } from '@/view/main/checkVq/checkVqService.js';

export default ['$scope', '$resource', '$state', '$Message', '$stateParams', function ($scope, $resource, $state, $Message, $stateParams) {
    $scope.vqCheckInfo = {};

    // 查询VQ检测结果
    const _findProductionLineVQRecord = (vin) => {
        $resource(findProductionLineVQRecordApi).get({vin}, (data) => {
            $scope.vqCheckInfo = {};
            if (data.code === 'PAGE_TIPS') {
                $scope.vqCheckInfo.vin = vin;
                $scope.vqCheckInfo.VIN_ERROR = data.message;
            } else {
                $scope.vqCheckInfo.firstLoginTime = data.firstLoginTime;
                $scope.vqCheckInfo = data.runDriveVo || {};
                $scope.vqCheckInfo.scanned = data.scanned;
            }
            $scope.focus = true;
            $scope.loading = false;
        }, (e) => {
            $scope.loading = false;
        });
    };

    _findProductionLineVQRecord($stateParams.vin);

    // 该车检测完成
    $scope.checkOk = () => {
        $resource(reportVqFailureApi).save(null, $scope.vqCheckInfo, (data) => {
            $Message.info('检测成功!');
            $state.go('main.checkVq');
        });
    };
}];
