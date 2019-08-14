/**
 * 作者：yeshengqiang
 * 时间：2019-04-17
 * 描述：table组件
 */

import './table.scss';
import tpl from './table.html';
import { isNumber } from '@/libs/utils';

export default {
    name: 'vTable',
    // 兼容ie8 则采用$compile 而不是ng-transclude
    callback: ['$compile', '$timeout', function ($compile, $timeout) {
        // 去重
        const distinct = (arr) => {
            const list = arr;
            const tempObj = {};
            arr = [];
            list.forEach(item => {
                if (!tempObj[item.label]) {
                    arr.push(item);
                    tempObj[item.label] = 1;
                }
            });
            return arr;
        };

        // 计算值
        const _reduce = function (list) {
            let totalLabelWidth = 0;
            list.forEach(item => {
                totalLabelWidth += +item.width;
            });
            return totalLabelWidth;
        };

        // 计算col width
        const calcWidth = function (offsetWidth, list) {
            const hasWidthList = list.filter(item => isNumber(+item.width));
            const totalLabelWidth = _reduce(hasWidthList);
            const offset = offsetWidth - totalLabelWidth;
            const len = list.length - hasWidthList.length;
            if (!len) return totalLabelWidth;
            list.forEach(item => {
                item.width = offset / len;
            });
            return offsetWidth;
        };

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                list: '=data'
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************初始化数据*************** */
                let childList = [];
                const offsetWidth = $element[0].offsetWidth;

                // 添加child
                this.addChild = (scope) => {
                    childList.push({
                        label: scope.label,
                        width: scope.width,
                        prop: scope.prop
                    });
                    $scope.childList = distinct(childList);
                    $scope.tableWidth = calcWidth(offsetWidth, $scope.childList);
                };

                // 移除Child
                this.removeChild = (scope) => {
                    childList = childList.filters(item => item.$id !== scope.$id);
                };

                /** ******************* 注销 ******************** */
                $element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }]
        };
    }]
};
