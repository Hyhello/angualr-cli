/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：radio
 */

import './radio.scss';
import radioGroupTpl from './radioGroup.html';

export default {
    name: 'vRadioGroup',
    callback () {
        return {
            restrict: 'E',
            template: radioGroupTpl,
            replace: true,
            transclude: true,
            scope: {
                currentValue: '=ngModel',
                handlerChange: '&change'
            },
            controller: ['$scope', function ($scope) {
                this.setValue = (val) => {
                    $scope.currentValue = val;
                };
                $scope.$watch('currentValue', (val) => {
                    this.currentValue = val;
                    $scope.handlerChange({value: val});
                });
            }],
            link ($scope, element) {
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }
};
