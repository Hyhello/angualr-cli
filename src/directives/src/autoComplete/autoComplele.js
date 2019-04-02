/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：autoComplete
 */

import './autoComplete.scss';
import tpl from './autoComplete.html';
import { isObj, getStyle } from '@/libs/utils';

const PREFIX = 'map-';

export default {
    name: 'autoComplete',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                currentLabel: '=ngModel',            // select value
                focus: '=?',                         // 获取焦点
                list: '=?',                          // 当前list 集合options
                select: '&'
            },
            link ($scope, element, attrs) {
                let threshold = 0;                                  // 阈值
                const oScroller = element.find('ul').parent();
                /** ************************************************初始化数据***************************************************** */
                // 初始化prop
                $scope.prop = attrs.prop || 'label';
                // placeholder input
                $scope.placeholder = attrs.placeholder || '请输入';
                // 用于是否自动完成
                $scope.autocomplete = attrs.autocomplete || 'off';
                // 当前tabIndex
                $scope.tabIndex = -1;
                // 当前list
                $scope.currentList = [];
                // 当前listMap
                $scope.currentListMap = Object.create(null);
                // 下拉框展示与隐藏
                $scope.showDropdown = false;
                // select
                $scope.selected = false;
                // filterIndex
                $scope.filterIndexList = [];

                /** ************************************************实现类 【extend method】***************************************** */
                // 阻止默认行为
                const stopDefault = (ev) => {
                    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                };
                // 阻止冒泡行为
                const stopPropagation = (ev) => {
                    ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
                };
                // 滚动到可视区
                const scrollIntoView = (i) => {
                    threshold = threshold || parseFloat(getStyle(oScroller[0], 'max-height'));
                    const aLi = element.find('li');
                    oScroller[0].scrollTop += aLi[i].getBoundingClientRect().bottom - oScroller[0].getBoundingClientRect().top - threshold;
                };
                // 键盘上/键盘下
                const navigateOptions = (ev, type) => {
                    let sign = type === 'prev' ? -1 : 1;
                    let maxVal = $scope.currentList.length - 1;
                    let minVal = 0;
                    if ($scope.filterIndexList.length) {
                        maxVal = Math.max.apply(null, $scope.filterIndexList);
                        minVal = Math.min.apply(null, $scope.filterIndexList);
                    }
                    $scope.tabIndex += sign;
                    if ($scope.tabIndex > maxVal) {
                        $scope.tabIndex = minVal;
                    } else if ($scope.tabIndex < minVal) {
                        $scope.tabIndex = maxVal;
                    }
                    scrollIntoView($scope.tabIndex);
                    stopPropagation(ev);
                    stopDefault(ev);
                };
                // 键盘enter
                const selectOption = (ev) => {
                    if ($scope.showDropdown) {
                        stopDefault(ev);
                    }
                    if ($scope.tabIndex === -1) return;
                    $scope.handleSelect($scope.currentList[$scope.tabIndex].$id);
                };
                // 通过label查找 like
                const likeLabel = (val) => {
                    $scope.filterIndexList = [];
                    const reg = new RegExp(val, 'i');
                    let flag = -1;
                    let len = $scope.currentList.length;
                    for (let i = 0; i < len; i++) {
                        let resource = $scope.currentList[i];
                        resource.visible = reg.test(resource.label);
                        if (resource.visible) {
                            flag = i;
                            $scope.filterIndexList.push(i);
                        }
                    }
                    $scope.tabIndex = flag - $scope.filterIndexList.length;
                    $scope.showDropdown = ~flag;
                };
                // 展示所有
                const showAll = () => {
                    $scope.filterIndexList = [];
                    let len = $scope.currentList.length;
                    for (let i = 0; i < len; i++) {
                        $scope.currentList[i].visible = true;
                    }
                    $scope.tabIndex = -1;
                    $scope.selected = false;
                    $scope.showDropdown = false;
                };
                /** ************************************************实现类【scope】************************************************** */
                // input click
                $scope.handleClick = () => {
                    $scope.showDropdown = true;
                };
                // 关闭dropdown
                $scope.handleClosed = (ev) => {
                    // 针对键盘esc / tab
                    if (ev && $scope.showDropdown) {
                        stopPropagation(ev);
                        stopDefault(ev);
                    }
                    $scope.showDropdown = false;
                };
                // select选择
                $scope.handleSelect = (id) => {
                    let resource = $scope.currentListMap[id];
                    $scope.currentLabel = resource.label;
                    $scope.selected = true;
                    $scope.showDropdown = false;
                    attrs.select && $scope.select({value: $scope.currentLabel, item: resource._originData_});
                };
                // 鼠标控制
                $scope.mouseenter = (index) => {
                    $scope.tabIndex = index;
                };
                // 键盘控制
                $scope.handleKeydown = (ev) => {
                    ev = ev || window.event;
                    switch (ev.keyCode) {
                        case 13:
                            selectOption(ev);
                            break;
                        case 9:
                        case 27:
                            $scope.handleClosed(ev);
                            break;
                        case 38:
                            navigateOptions(ev, 'prev');
                            break;
                        case 40:
                            navigateOptions(ev, 'next');
                            break;
                    }
                };
                /** ************************************************实现类 【watch 类】*********************************************** */
                // 监听currentLabel
                $scope.$watch('currentLabel', (newVal, oldVal) => {
                    if (newVal === oldVal) return;
                    if ($scope.selected) return;
                    likeLabel(newVal);
                });

                // 监听list
                $scope.$watch('list', (newVal) => {
                    newVal = newVal || [];
                    $scope.currentList = newVal.map((item, index) => {
                        const $id = `${PREFIX}${index}`;
                        let itemVal = {
                            $id,
                            tabIndex: index,
                            _originData_: item,
                            label: isObj(item) ? item[$scope.prop] : item,
                            visible: true               // 是否展示
                        };
                        $scope.currentListMap[$id] = itemVal;
                        return itemVal;
                    });
                }, true);
                // 监听dropdown 展示与隐藏
                $scope.$watch('showDropdown', (newVal, oldVal) => {
                    if (newVal === oldVal) return;
                    if (!newVal) {
                        // 更改为全部展示
                        showAll();
                    } else {
                        if (!$scope.currentList.length) {
                            $scope.showDropdown = false;
                        }
                    }
                });

                /** *****************************************************销毁********************************************************* */
                element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
