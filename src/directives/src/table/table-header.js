/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableHeader
 */

import './table.scss';
import tpl from './table-header.html';
import { getScrollWidth } from '@/libs/utils';

export default {
    name: 'tableHeader',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            require: '^vTable',
            scope: {
                fixed: '@',
                gutter: '=',
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
                /** ******************* 监听 ******************** */
                $scope.$watch('rowList', () => {
                    if (!$scope.fixed) return;
                    $element.ready(app.calcWidth);
                });
                $scope.$watch('gutter', (val) => {
                    $scope.hasGutterWidth = (val && !$scope.fixed) ? getScrollWidth() : 0;
                });
                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
