import './table.scss';
import tdTpl from './td.html';

export default {
    name: 'tableCell',
    callback () {
        return {
            restrict: 'E',
            template: tdTpl,
            replace: true,
            transclude: true,
            require: '^vTable',
            scope: {
                prop: '@',
                label: '@',
                width: '@'
            },
            link ($scope, $element, $attrs, ctrl) {
                ctrl.addChild($scope);
                // 注销
                $element.on('$destroy', function () {
                    ctrl.removeChild($scope);
                    $scope.$destroy();
                });
            }
        };
    }
};
