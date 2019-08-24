/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableBody
 */

import tpl from './table-body.html';

export default {
    name: 'tableBody',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                rowList: '=',
                colList: '='
            },
            link ($scope, $element, attrs) {
                console.log($scope.rowList);
                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
