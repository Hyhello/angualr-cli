/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：radio
 */

import './radio.scss';
import radioTpl from './radio.html';

export default {
    name: 'vRadio',
    callback () {
        return {
            restrict: 'E',
            template: radioTpl,
            replace: true,
            transclude: true,
            require: '?^vRadioGroup',
            scope: {
                value: '@',
                currentValue: '=ngModel'
            },
            link ($scope, element, attrs, app) {
                // 点击
                $scope.handlerClick = () => {
                    if (app) {
                        app.setValue(attrs.value);
                    } else {
                        $scope.currentValue = attrs.value !== undefined
                                                ? attrs.value
                                                : !$scope.currentValue;
                    }
                };

                $scope.$watch('currentValue', (val) => {
                    if (app) return;
                    $scope.checked = attrs.value !== undefined
                                        ? val === attrs.value
                                        : !!val;
                });

                // 监听parent值
                if (app) {
                    $scope.$watch(() => app.currentValue, (val) => {
                        $scope.checked = val === attrs.value;
                    });
                }

                // 注销
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }
};
