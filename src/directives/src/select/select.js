/**
 * 作者：yeshengqiang
 * 时间：2019-03-12
 * 描述：selectInput
 */

import './select.scss';
import tpl from './select.html';
import { isObj, getStyle } from '@/libs/utils';

const PREFIX = 'map-';

export default {
    name: 'vSelect',
    callback () {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                prop: '=?',                          // prop, default: {label: 'label', value: 'value'}
                list: '=',                          // list
                disabled: '=?',                      // disabled
                clearable: '=?',                     // clear
                filterable: '=?',                    // 是否开启filter
                currentValue: '=ngModel',           // select value
                change: '&',                        // select value 发生改变时候触发
                clear: '&',                         // 输入框清空时候触发
                blur: '&',                          // 失去焦点触发
                focus: '&'                          // 获取焦点触发
            },
            link ($scope, element, attrs) {
                let threshold = 0;
                const oInp = element.find('input');
                const oScroller = element.find('ul').parent();
                /** ************************************************初始化数据***************************************************** */
                $scope.prop = Object.assign({
                    label: 'label',
                    value: 'value'
                }, $scope.prop || {});
                // placeholder input
                $scope.placeholder = attrs.placeholder || '请输入';
                // 用于是否自动完成
                $scope.autocomplete = attrs.autocomplete || 'off';
                // filterable 进行搜索时候匹配
                $scope.noMatchText = attrs.noMatchText || '无匹配数据';
                // input hover
                $scope.hover = false;
                // 当前tabIndex
                $scope.tabIndex = 0;
                // noData
                $scope.noData = false;
                // empty click
                $scope.emptyClick = false;
                // select
                $scope.selected = false;
                // 当前list
                $scope.currentList = [];
                // currentLabel
                $scope.currentLabel = '';
                // 下拉框展示与隐藏
                $scope.showDropdown = false;
                // clearabled 展示与否
                $scope.showClearBtn = false;
                // filterIndex
                $scope.filterIndexList = [];
                // 当前listMap
                $scope.currentListMap = Object.create(null);

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
                    $scope.handleSelect($scope.currentList[$scope.tabIndex].$id);
                };
                // 通过value查找label, bool: false, bool = true, 则通过label查找value
                const valueFindLabel = (val) => {
                    $scope.currentLabel = '';
                    let len = $scope.currentList.length;
                    for (let i = 0; i < len; i++) {
                        let resource = $scope.currentList[i];
                        resource.selected = resource.value === val;
                        if (resource.selected) {
                            $scope.currentLabel = resource.label;
                            $scope.tabIndex = i;
                        }
                    }
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
                    $scope.tabIndex = flag - $scope.filterIndexList.length + 1;
                    $scope.noData = !~flag;
                };
                // 展示所有
                const showAll = () => {
                    $scope.filterIndexList = [];
                    $scope.tabIndex = 0;
                    let len = $scope.currentList.length;
                    for (let i = 0; i < len; i++) {
                        let resource = $scope.currentList[i];
                        resource.visible = true;
                        resource.selected = resource.value === $scope.currentValue;
                        if (resource.selected) $scope.tabIndex = i;
                    }
                    $scope.selected = false;
                    $scope.emptyClick = false;
                };
                /** ************************************************实现类【scope】************************************************** */
                // 展示showDropdown
                $scope.handlerFocus = () => {
                    $scope.showDropdown = true;
                };
                // 关闭dropdown
                $scope.handleClosed = () => {
                    $scope.showDropdown = false;
                };
                // hover enter
                $scope.mouseenter = () => {
                    $scope.hover = true;
                    $scope.showClearBtn = !!($scope.clearable && $scope.currentLabel);
                };
                // hover leave
                $scope.mouseleave = () => {
                    $scope.hover = false;
                    $scope.showClearBtn = false;
                };
                // empty input
                $scope.emptyLabel = (ev) => {
                    ev = ev || window.event;
                    stopPropagation(ev);
                    $scope.tabIndex = 0;
                    $scope.emptyClick = true;
                    $scope.currentValue = $scope.currentLabel = '';
                    $scope.showDropdown = $scope.showClearBtn = false;
                    // 触发clear方法
                    attrs.clear && $scope.clear();
                    return false;
                };
                // item hover
                $scope.mouseItemEnter = (index) => {
                    $scope.tabIndex = index;
                };
                // select选择
                $scope.handleSelect = (id) => {
                    let resource = $scope.currentListMap[id];
                    $scope.currentLabel = resource.label;
                    $scope.currentValue = resource.value;
                    $scope.selected = true;
                    $scope.showDropdown = false;
                    attrs.select && $scope.select({value: $scope.currentLabel, item: resource._originData_});
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
                // 监听currentValue
                $scope.$watch('currentValue', (newVal, oldVal) => {
                    if (newVal === oldVal) return;
                    if ($scope.emptyClick) return;
                    valueFindLabel(newVal);
                });
                // 监听currentLabel
                $scope.$watch('currentLabel', (newVal, oldVal) => {
                    if (newVal === oldVal) return;
                    if ($scope.selected) return;
                    if ($scope.emptyClick) return;
                    if (!$scope.filterable || !$scope.showDropdown) return;
                    likeLabel(newVal);
                });
                // 监听dropdown 展示与隐藏
                $scope.$watch('showDropdown', (newVal, oldVal) => {
                    if (newVal === oldVal) return;
                    if (newVal) {
                        showAll();
                    } else {
                        oInp[0].blur();
                        valueFindLabel($scope.currentValue);
                    }
                });
                // 监听list
                $scope.$watch('list', (newVal) => {
                    newVal = newVal || [];
                    $scope.currentList = newVal.map((item, index) => {
                        const $id = `${PREFIX}${index}`;
                        const isObject = isObj(item);
                        let itemVal = {
                            $id,
                            tabIndex: index,
                            _originData_: item,
                            label: isObject ? item[$scope.prop.label] : item,
                            value: isObject ? item[$scope.prop.value] : item,
                            visible: true,               // 是否展示
                            selected: false
                        };
                        $scope.currentListMap[$id] = itemVal;
                        return itemVal;
                    });
                    valueFindLabel($scope.currentValue);
                }, true);

                /** *****************************************************销毁********************************************************* */
                element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }
};
