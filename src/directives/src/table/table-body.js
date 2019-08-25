/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableBody
 */

import './table.scss';
import tpl from './table-body.html';

export default {
    name: 'tableBody',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            require: '^vTable',
            scope: {
                fixed: '@',                      // fixed 固定定位
                stripe: '=',                     // 是否为斑马纹 table 【boolean】 default: false
                rowList: '=',
                colList: '=',
                tableWidth: '='
            },
            link ($scope, $element, attrs, app) {
                // 样式
                $scope.classes = function (item) {
                    const isHidden = !!($scope.fixed ? item.fixed !== $scope.fixed : item.fixed);
                    return {
                        [`is-${item.align}`]: !!item.align,
                        [`is-hidden`]: isHidden
                    };
                };
                /** ******************* 监听 ******************** */
                $scope.$watch('rowList', () => {
                    if (!$scope.fixed) return;
                    $element.ready(app.calcHeight);
                });

                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
