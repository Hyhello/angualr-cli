/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：historyCheckCrl
 */

import layui from 'layui';
import './historyCheck.scss';
import { lineRecordHistoryApi } from './historyCheckService.js';

export default ['$scope', '$rootScope', '$resource', 'Paginator', '$MessageBox', '$Message', function ($scope, $rootScope, $resource, Paginator, $MessageBox, $Message) {
    /** **********初始化数据********* */
    $scope.recordList = [];

    $scope.optionList = [
        {
            label: '全部',
            value: ''
        },
        {
            label: 'OK',
            value: '1'
        },
        {
            label: 'NG',
            value: '2'
        }
    ];

    $scope.loading = false;

    // 初始化日期
    layui.use(['laydate'], function () {
        const laydate = layui.laydate;
        const lowDate = new Date();
        let dateStr = '';
        dateStr = lowDate.getFullYear();
        dateStr = dateStr + '-' + lowDate.getMonth() + 1;
        dateStr = dateStr + '-' + lowDate.getDate();
        dateStr = dateStr + ' 23:59:59';
        laydate.render({elem: '#dateId', type: 'datetime', range: true, max: dateStr});
    });

    $scope.searchData = {
        vin: '',         // vin码
        detectionStatus: '',
        pageNum: $rootScope.STATE.pageNum,
        pageSize: $rootScope.STATE.pageSize
    };

    /** **********业务逻辑********* */
    /**
     * 分页查询
     * @param page
     * @param callback
     * @constructor
     */
    $scope.searchPaginator = Paginator.list((page, callback) => {
        $scope.searchData.pageNum = page.currentPage;
        $scope.searchData.pageSize = page.pageSize;
        $resource(lineRecordHistoryApi).get($scope.searchData, (data) => {
            $scope.recordList = data.list || [];
            $scope.loading = false;
            callback(data);
        }, (e) => {
            $scope.loading = false;
        });
    }, $scope.searchData.pageSize);

    // 搜索
    $scope.searchRecord = () => {
        const dateIdValue = document.getElementById('dateId').value;
        if (dateIdValue) {
            const timeList = dateIdValue.split(' - ');
            $scope.searchData.detectStartTime = timeList[0];
            $scope.searchData.detectEndTime = timeList[1];
        } else {
            $scope.searchData.detectStartTime = null;
            $scope.searchData.detectEndTime = null;
        }
        $scope.loading = true;
        $scope.searchPaginator._load(1);
    };
}];
