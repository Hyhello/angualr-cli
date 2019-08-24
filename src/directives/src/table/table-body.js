/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableBody
 */

import tpl from './table-body.html';

export default {
    name: 'tableBody',
    callback: ['$timeout', ($timeout) => {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            require: '^vTable',
            scope: {
                stripe: '=',                     // 是否为斑马纹 table 【boolean】 default: false
                rowList: '=',
                colList: '=',
                tableWidth: '='
            },
            link ($scope, $element, attrs, app) {
                /** ******************* 监听 ******************** */
                $scope.$watch('rowList', () => {
                    $timeout(app.calcHeight);
                });

                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }]
};
