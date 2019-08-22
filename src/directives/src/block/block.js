/**
 * 作者：Hyhello
 * 时间：2019-08-21
 * 描述：block
 */

import './block.scss';
import tpl from './block.html';

export default {
    name: 'block',
    callback () {
        return {
            restrict: 'E',
            replace: true,
            template: tpl,
            transclude: true,
            scope: {
                vModel: '='
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                // toggle
                $scope.handleToggle = function () {
                    $scope.vModel = !$scope.vModel;
                };

                $scope.$watch('vModel', (val) => {
                    this.currentValue = !!val;
                });

                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }]
        };
    }
};
