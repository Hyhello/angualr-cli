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
                indeterminate: '=',             // boolean  设置 indeterminate 状态，只负责样式控制
                custom: '=',                    // boolean  自定义展示
                label: '@'
            },
            transclude: true,
            link ($scope, element, attrs) {
                // 监听
                $scope.$watch('currentValue', function (val) {
                    if ($scope.indeterminate !== undefined) {
                        $scope.isChecked = val;
                        return;
                    }
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
