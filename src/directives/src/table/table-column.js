/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableColumn
 */

import tpl from './table-column.html';

export default {
    name: 'vTableColumn',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            require: '^vTable',
            scope: {
                prop: '@',
                align: '@',
                label: '@',
                width: '@'
            },
            link ($scope, $element, attrs, app) {
                // 添加了$scope
                app.addChild($scope);

                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    app.removeChild($scope);
                    $scope.$destroy();
                });
            }
        };
    }
};
