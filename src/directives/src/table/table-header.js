/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableHeader
 */

import tpl from './table-header.html';

export default {
    name: 'tableHeader',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            require: '^vTable',
            scope: {
                colList: '=',
                tableWidth: '='
            },
            link ($scope, $element, attrs) {
                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
