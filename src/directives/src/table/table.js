/**
 * 作者：yeshengqiang
 * 时间：2019-04-17
 * 描述：table组件
 */
import './table.scss';
import angular from 'angular';
import tpl from './table.html';
import { isNumber, findClass } from '@/libs/utils';

export default {
    name: 'vTable',
    // 兼容ie8 则采用$compile 而不是ng-transclude
    callback: ['$compile', '$timeout', function ($compile, $timeout) {
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
            console.log(hasWidthList);
            const len = list.length - hasWidthList.length;
            let totalLabelWidth = _reduce(hasWidthList);
            if (!len) return totalLabelWidth;
            const offset = Math.max((offsetWidth - totalLabelWidth) / len, 80);
            totalLabelWidth = 0;
            list.forEach(item => {
                item.width = item.width || offset;
                totalLabelWidth += +item.width;
            });
            return totalLabelWidth;
        };

        // nextTick
        const nextTick = function (fn, wait) {
            let timer = null;
            return function (...args) {
                if (timer) {
                    $timeout.cancel(timer);
                    timer = null;
                }
                timer = $timeout(() => {
                    fn.apply(this, args);
                }, wait || 0);
            };
        };

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                columnList: '=column',
                list: '=data'
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************初始化数据*************** */
                const headerWrapper = findClass($element[0], 'el-table__header-wrapper')[0];
                const bodyWrapper = angular.element(findClass($element[0], 'el-table__body-wrapper')[0]);

                // 滚动事件
                const __scroll = function (ev) {
                    headerWrapper.scrollLeft = ev.target.scrollLeft;
                };

                const calcChild = nextTick(function () {
                    $scope.tableWidth = calcWidth($element[0].offsetWidth, $scope.columnList || []);
                    bodyWrapper.on('scroll', __scroll);
                });

                $scope.$watch('list', (val) => {
                    calcChild();
                });

                /** ******************* 注销 ******************** */
                $element.on('$destroy', function () {
                    bodyWrapper.off('scroll', __scroll);
                    $scope.$destroy();
                });
            }]
        };
    }]
};
