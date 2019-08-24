/**
 * 作者：yeshengqiang
 * 时间：2019-04-17
 * 描述：table组件
 */
import './table.scss';
import tpl from './table.html';
// import { isNumber, findClass } from '@/libs/utils';

export default {
    name: 'vTable',
    // 兼容ie8 则采用$compile 而不是ng-transclude
    callback: ['$compile', '$timeout', function ($compile, $timeout) {
        // const zIndex = 0;

        // // 计算值
        // const _reduce = function (list) {
        //     let totalLabelWidth = 0;
        //     list.forEach(item => {
        //         totalLabelWidth += +item.width;
        //     });
        //     return totalLabelWidth;
        // };

        // // 计算col width
        // const calcWidth = function (offsetWidth, list) {
        //     const hasWidthList = list.filter(item => isNumber(+item.width));
        //     console.log(hasWidthList);
        //     const len = list.length - hasWidthList.length;
        //     let totalLabelWidth = _reduce(hasWidthList);
        //     if (!len) return totalLabelWidth;
        //     const offset = Math.max((offsetWidth - totalLabelWidth) / len, 80);
        //     totalLabelWidth = 0;
        //     list.forEach(item => {
        //         item.width = item.width || offset;
        //         totalLabelWidth += +item.width;
        //     });
        //     return totalLabelWidth;
        // };

        // // nextTick
        // const nextTick = function (fn, wait) {
        //     let timer = null;
        //     return function (...args) {
        //         if (timer) {
        //             $timeout.cancel(timer);
        //             timer = null;
        //         }
        //         timer = $timeout(() => {
        //             fn.apply(this, args);
        //         }, wait || 0);
        //     };
        // };

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                list: '=data'
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************** 初始化数据 **************** */
                $scope.colList = [];                        // col列表

                // 添加child
                this.addChild = (scope) => {
                    $scope.colList.push({
                        $id: scope.$id,
                        prop: scope.prop,
                        width: scope.width,
                        label: scope.label
                    });
                };

                // removeChild
                this.removeChild = (scope) => {
                    $scope.colList = $scope.colList.filter(item => item.$id !== scope.$id);
                };

                /** ******************* 注销 ******************** */
                $element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }]
        };
    }]
};
