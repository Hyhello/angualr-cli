/**
 * 作者：Hyhello
 * 时间：2019-07-31
 * 描述：checkbox
 */

import './checkbox.scss';
import tpl from './checkbox.html';

export default {
    name: 'checkbox',
    callback: ['$timeout', ($timeout) => {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                currentValue: '=vModel',
                disabled: '=',                  // boolean
                indeterminate: '=',             // boolean
                custom: '=',                    // boolean
                label: '@'
            },
            transclude: true,
            link ($scope, element, attrs) {
                // 监听
                $scope.$watch('currentValue', function (val) {
                    $scope.isChecked = val === $scope.label;
                });

                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
