/**
 * 作者：yeshengqiang
 * 时间：2019-04-17
 * 描述：table组件
 */
import './table.scss';
import angular from 'angular';
import tpl from './table.html';
import { isNumber, findClass, getScrollWidth } from '@/libs/utils';

export default {
    name: 'vTable',
    callback: ['$timeout', function ($timeout) {
        // 默认配置
        const _defaults = {
            zIndex: 0,
            minWidth: 80,
            defaultClass: 'v-table_',
            scrollWidth: getScrollWidth()
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
            const offset = Math.max((offsetWidth - totalLabelWidth) / len, _defaults.minWidth);
            totalLabelWidth = 0;
            list.forEach(item => {
                let width = +(item.width || 0);
                width = width ? Math.max(width, _defaults.minWidth) : offset;
                item.width = width;
                totalLabelWidth += width;
            });
            return totalLabelWidth;
        };

        // 计算calcHasgutter
        const calcGutter = function (list) {
            let len = list.length;
            while (len--) {
                if (list[len].width > (_defaults.minWidth + _defaults.scrollWidth)) {
                    list[len].width -= _defaults.scrollWidth;
                    break;
                }
            }
        };

        // 排序列表
        const sortList = function (list) {
            const fixedLeftList = [];
            const fixedRightList = [];
            const tempList = [];
            list.forEach((item) => {
                if (item.fixed === 'left') {
                    fixedLeftList.push(item);
                } else if (item.fixed === 'right') {
                    fixedRightList.push(item);
                } else {
                    tempList.push(item);
                }
            });
            return fixedLeftList.concat(tempList, fixedRightList);
        };

        // 获取fix
        const getFixWidth = function (list) {
            const fixedLeftList = [];
            const fixedRightList = [];
            list.forEach(item => {
                if (item.fixed === 'left') {
                    fixedLeftList.push(item);
                } else if (item.fixed === 'right') {
                    fixedRightList.push(item);
                }
            });
            return {
                fixedLeftWidth: _reduce(fixedLeftList),
                fixedRightWidth: _reduce(fixedRightList)
            };
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
                list: '=data',
                height: '@',                    // Table 的高度，默认为自动高度。如果 height 为 number 类型，Table 的高度会受控于外部样式。
                border: '=',                    // 是否带有纵向边框 table 【boolean】 default: false
                stripe: '='                     // 是否为斑马纹 table 【boolean】 default: false
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************** 初始化数据 **************** */
                const zIndex = ++_defaults.zIndex;
                const oElHeader = findClass($element[0], 'el-table__header-wrapper')[0];
                const oElBody = angular.element(findClass($element[0], 'el-table__body-wrapper')[0]);
                $scope.childList = [];                                // col列表
                $scope.elHeight = 0;                                  // height style
                $scope.fixedRightWidth = $scope.fixedLeftWidth = 0;   // fix宽度

                // 添加child
                this.addChild = (scope) => {
                    $scope.childList.push({
                        $id: scope.$id,
                        prop: scope.prop,
                        fixed: scope.fixed,
                        width: scope.width,
                        label: scope.label,
                        align: scope.align
                    });
                };

                // 移除Child
                this.removeChild = (scope) => {
                    $scope.childList = $scope.childList.filter(item => item.$id !== scope.$id);
                };

                // x轴滚动
                this.xScroll = () => {
                    if (!$scope.is_scroll_x) return;
                    oElHeader.scrollLeft = oElBody[0].scrollLeft;
                    let placment = 'left';
                    if (oElHeader.scrollLeft === 0) {
                        placment = 'left';
                    } else if (oElHeader.scrollLeft === ($scope.tableWidth - oElHeader.offsetWidth)) {
                        placment = 'right';
                    } else {
                        placment = 'middle';
                    }
                    $scope.row_scrolling_placment = placment;
                };

                // y轴滚动
                this.yScroll = () => {
                    if (!$scope.is_scroll_y) return;
                    if ($scope.fixedLeftWidth) {
                        findClass($element[0], 'el-table__fixed-body-wrapper')[0].scrollTop = oElBody[0].scrollTop;
                    }
                    if ($scope.fixedRightWidth) {

                    }
                };

                // 滚动事件函数
                this.scrollEvent = () => {
                    $timeout(() => {
                        this.xScroll();
                        this.yScroll();
                    });
                };

                // 计算高度
                this.calcHeight = () => {
                    const tableBody = findClass(oElBody[0], 'el-table__body')[0];
                    $timeout(() => {
                        $scope.tableBodyWidth = $scope.tableWidth;                  // 多次会调用所以要初始化再计算
                        $scope.bodyFixedHeight = $scope.bodyHeight = ($scope.height || $element[0].offsetHeight) - oElHeader.offsetHeight;
                        $scope.is_scroll_y = tableBody.offsetHeight > $scope.bodyHeight;
                        $scope.elFixedHeight = $scope.elHeight = $element[0].offsetHeight;
                        if ($scope.is_scroll_y) {
                            $scope.tableBodyWidth -= _defaults.scrollWidth;
                            calcGutter($scope.colList);
                        }
                        if ($scope.is_scroll_x) {
                            $scope.elFixedHeight -= _defaults.scrollWidth;
                            $scope.bodyFixedHeight -= _defaults.scrollWidth;
                        }
                    });
                };

                // 计算宽度
                this.calcWidth = () => {
                    $timeout(() => {
                        const offsetWidth = oElHeader.offsetWidth;
                        $scope.tableBodyWidth = $scope.tableWidth = calcWidth(offsetWidth, $scope.colList);
                        const res = getFixWidth($scope.colList);
                        $scope.fixedRightWidth = res.fixedRightWidth;
                        $scope.fixedLeftWidth = res.fixedLeftWidth;
                        $scope.is_scroll_x = $scope.tableWidth > offsetWidth;
                        if ($scope.is_scroll_x) {
                            this.scrollEvent();
                        } else {
                            $scope.row_scrolling_placment = 'none';
                        }
                    });
                };

                // 监听事件
                oElBody.on('scroll', this.scrollEvent);

                /** ******************* 监听 ******************** */
                $scope.$watch('childList', nextTick((val) => {
                    $scope.colList = sortList(val || []).map((item, index) => {
                        return {
                            ...item,
                            className: `${_defaults.defaultClass}_${zIndex}_column_${index + 1}`
                        };
                    });
                }));

                /** ******************* 注销 ******************** */
                $element.on('$destroy', function () {
                    // 清除事件
                    oElBody.off('scroll', this.scrollEvent);
                    $scope.$destroy();
                });
            }]
        };
    }]
};
