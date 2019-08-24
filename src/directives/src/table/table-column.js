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
                label: '@',
                width: '@'
            },
            link ($scope, $element, attrs, app) {
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
