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
                isChecked: '=vModel',           // boolean
                disabled: '=',                  // boolean
                handlerChange: '&change',       // 勾选
                indeterminate: '='              // boolean  设置 indeterminate 状态，只负责样式控制
            },
            transclude: true,
            link ($scope, element, attrs) {
                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
