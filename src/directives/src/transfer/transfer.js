/**
 * 作者：Hyhello
 * 时间：2019-07-22
 * 描述：transfer
 */

import './transfer.scss';
import tpl from './transfer.html';
import { oneOf } from '@/libs/utils';

export default {
    name: 'transfer',
    callback: ['$timeout', ($timeout) => {
        // 配置
        const defaults = {
            titles: ['列表1', '列表2'],
            buttonTexts: [],
            props: {
                key: 'key',
                label: 'label',
                disabled: 'disabled'
            },
            filterPlaceholder: '请输入搜索内容',
            noDataText: '无数据',
			sortKey: 'transfer_index'
        };

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                currentValue: '=vModel',                // 绑定值 , array
                currentTitles: '=titles',               // 标题    array
                currentButtonTexts: '=buttonTexts',     // 按钮文字 array
                filterPlaceholder: '@',                 // filterPlaceholder
                emptyText: '@',                         // 无数据文字提示
                data: '=',                              // 数据    array
                filterable: '=',                        // filterable boolean
                currentProps: '=props',                 // 设置别名 object
                leftDefaultChecked: '=',                // 初始状态下左侧列表的已勾选项的 key 数组  array
                rightDefaultChecked: '=',               // 初始状态下右侧列表的已勾选项的 key 数组  array
                renderContent: '&'                      // 渲染函数 function
            },
            link ($scope, element, attrs) {
                /** ************************* 初始化 *********************** */
                $scope.leftIndeterminate = false;               // 控制checkbox样式
                $scope.rightIndeterminate = false;              // 控制checkbox样式

                $scope.leftCheckList = [];                      // 左边勾选集合

                $scope.rightCheckList = [];                     // 右边勾选集合

                $scope.leftAllChecked = false;                  // 左侧全选

                $scope.rightAllChecked = false;                 // 右侧全选

                $scope.leftModel = '';                          // left 搜索值

                $scope.rightModel = '';                         // right 搜索值

                /** ************************* 配置项 *********************** */
                // 配置别名
                $scope.props = Object.assign(defaults.props, $scope.currentProps || {});
                // 配置title
                $scope.titles = Object.assign(defaults.titles, $scope.currentTitles || []);
                // 配置button text
                $scope.buttonTexts = Object.assign(defaults.buttonTexts, $scope.currentButtonTexts || []);
                // 配置无数据文字展示
                $scope.noDataText = $scope.emptyText || defaults.noDataText;
                // 配置搜索问题
                $scope.placeholder = $scope.filterPlaceholder || defaults.filterPlaceholder;

                /** ************************* 换算 *********************** */
                 // 格式化数据
                const converToData = function (val) {
                    const key = $scope.props.key;
                    const list = $scope.data.slice();
                    const leftList = [];
                    const rightList = [];
                    // 过滤数据
                    list.forEach((item, index) => {
                        item[defaults.sortKey] = index;
                        if (oneOf(item[key], val || [])) {
                            rightList.push(item);
                        } else {
                            leftList.push(item);
                        }
                    });

                    $scope.leftList = leftList.map(item => {
                        const isChecked = item.disabled ? false : oneOf(item[key], $scope.leftDefaultChecked || []);
                        $scope.handleChange(isChecked, item, 'left');
                        return {
                            ...item,
                            isChecked
                        };
                    });

                    $scope.rightList = rightList.map(item => {
                        const isChecked = item.disabled ? false : oneOf(item[key], $scope.rightDefaultChecked || []);
                        $scope.handleChange(isChecked, item, 'right');
                        return {
                            ...item,
                            isChecked
                        };
                    });
                };
                /** ************************* 事件 *********************** */
                // checkbox change
                $scope.handleChange = function (val, item, placment) {
                    const props = `${placment}CheckList`;
                    const key = $scope.props.key;
                    if (val) {
                        $scope[props].push(item[key]);
                    } else {
                        $scope[props] = $scope[props].filter(im => im !== item[key]);
                    }
                };

                // 全选
                $scope.handleAllChange = function (val, placment) {
                    const checkProps = `${placment}CheckList`;
					const props = `${placment}List`;
					const allCheck = `${placment}AllChecked`;
					const len = $scope[props].filter(item => !item.disabled).length;
					if (!len) {
						$timeout(() => {
							$scope[allCheck] = false;
						});
						return;
					}
                    $scope[checkProps] = [];
                    $scope[props] = $scope[props].map(item => {
                        if (item.disabled) {
                            return item;
                        } else {
                            $scope.handleChange(val, item, placment);
                            return {
                                ...item,
								isChecked: val
                            };
                        }
                    });
                };

                // 按钮
                $scope.handleBtn = function (placment) {
                    const temp = [];
                    const unPlacment = placment === 'left' ? 'right' : 'left';
                    const checkProps = `${placment}CheckList`;
                    const props = `${placment}List`;
                    const unProps = `${unPlacment}List`;
                    const key = $scope.props.key;
                    if (!$scope[checkProps].length) return;
                    const list = $scope[props].slice(0);
                    $scope[props] = [];
                    list.forEach(item => {
                        if (oneOf(item[key], $scope[checkProps])) {
							item.isChecked = false;
                            temp.push(item);
                        } else {
                            $scope[props].push(item);
                        }
					});
					$scope[checkProps] = [];
                    $scope[unProps] = $scope[unProps].concat(temp);
				};

				// sort 排序
				$scope.sortIndex = function (obj) {
					return obj[defaults.sortKey];
				};

                // 清除
                $scope.handleClear = function (label) {
                    $scope[label] = '';
                };

                /** ************************* 监听 *********************** */
                // 监听当前值变化
                $scope.$watch('currentValue', converToData, true);

                // 监听全选问题
                $scope.$watch('leftCheckList', function (newVal) {
                    const len = newVal.length;
                    const leftList = $scope.leftList.filter(item => !item.disabled);
                    const leftLength = leftList.length;
                    $scope.leftIndeterminate = len && len !== leftLength;
					$scope.leftAllChecked = leftLength ? len === leftLength : false;
                }, true);

                // 监听全选问题
                $scope.$watch('rightCheckList', function (newVal) {
                    const len = newVal.length;
                    const rightList = $scope.rightList.filter(item => !item.disabled);
                    const rightLength = rightList.length;
					$scope.rightIndeterminate = len && len !== rightLength;
					$scope.rightAllChecked = rightLength ? len === rightLength : false;
                }, true);

                // 监听数据变化
                $scope.$watch('data', function (newVal, oldVal) {
                    if (newVal === oldVal) return;
                    converToData($scope.currentValue);
                }, true);

                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
