/**
 * 作者：Hyhello
 * 时间：2019-08-24
 * 描述：tableHeader
 */

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
                gutter: '=',
                colList: '=',
                tableWidth: '='
            },
            link ($scope, $element, attrs) {
                /** ******************* 监听 ******************** */
                $scope.$watch('gutter', (val) => {
                    $scope.hasGutterWidth = val ? getScrollWidth() : 0;
                });
                /** ******************* 注销 ******************** */
                $element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
