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
                list: '=data'
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************初始化数据*************** */
                let childList = [];
                const headerWrapper = findClass($element[0], 'el-table__header-wrapper')[0];
                const bodyWrapper = angular.element(findClass($element[0], 'el-table__body-wrapper')[0]);

                // 滚动事件
                const __scroll = function (ev) {
                    headerWrapper.scrollLeft = ev.target.scrollLeft;
                };

                // 添加child
                this.addChild = (scope) => {
                    childList.push({
                        label: scope.label,
                        width: scope.width,
                        prop: scope.prop
                    });
                    this.calcChild();
                };

                this.calcChild = nextTick(function () {
                    $scope.childList = distinct(childList);
                    $scope.tableWidth = calcWidth($element[0].offsetWidth, $scope.childList);
                    bodyWrapper.on('scroll', __scroll);
                });

                // 移除Child
                this.removeChild = (scope) => {
                    childList = childList.filters(item => item.$id !== scope.$id);
                };

                /** ******************* 注销 ******************** */
                $element.on('$destroy', function () {
                    childList = [];
                    bodyWrapper.off('scroll', __scroll);
                    $scope.$destroy();
                });
            }]
        };
    }]
};
