/**
 * 作者：yeshengqiang
 * 时间：2019-04-01
 * 描述：switch
 */

import './switch.scss';
import tpl from './switch.html';

export default {
    name: 'vSwitch',
    callback: ['$timeout', ($timeout) => {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                currentValue: '=ngModel',
                active: '=',                // 活动
                inactive: '=',              // 非活动
                label: '='
            },
            link ($scope) {
                $scope.toggle = () => {
                    $scope.currentValue = $scope.currentValue === $scope.active
                                                ? $scope.inactive
                                                : $scope.active;
                };
            }
        };
    }]
};
