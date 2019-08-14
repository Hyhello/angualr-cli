import './table.scss';
import tdTpl from './column.html';

export default {
    name: 'vTableColumn',
    callback () {
        return {
            restrict: 'E',
            template: tdTpl,
            replace: true,
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
