/**
 * 作者：Hyhello
 * 时间：2019-08-03
 * 描述：tree-item
 */

import './treeItem.scss';
import tpl from './treeItem.html';

export default {
    name: 'treeItem',
    callback: ['$timeout', '$compile', ($timeout, $compile) => {
        const offset = 15;

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                label: '@',                                     // 数据展示
                level: '@',                                     // 设置level
                checked: '=',                                   // 是否勾选
                showCheckbox: '=',                              // show-checkbox
                list: '=children'                               // 数据    array
            },
            require: '?^tree',
            link ($scope, element, attrs) {
                if ($scope.list) {
                    $timeout(() => {
                        const template = $compile(`<tree-item
                                                    ng-repeat="item in list track by $index"
                                                    children="item.children"
                                                    checked="item.checked"
                                                    show-checkbox="item._showCheckbox"
                                                    level="{{ item._level }}"
                                                    label="{{ item.label }}"
                                                    >
                                                </tree-item>`)($scope);
                        element.find('div').append(template);
                    });
                }

                /** ********************** 初始化数据 ******************** */
                $scope.visible = false;

                $scope.vModel = false;

                $scope.indeterminate = false;

                // 勾选list
                $scope.checkList = [];

                // 设置样式
                $scope.styles = {
                    'padding-left': `${offset * $scope.level}px`
                };

                /** ********************* 广播/分发事件 ****************** */
                $scope.$on('__select__', (ev, params) => {
                    // 底层
                    if (!$scope.list) return;
                    // 顶层不允许再冒泡
                    if ($scope.level === '0') ev.stopPropagation();
                    console.log($scope.list);
                    console.log(params);
                });

                $scope.$watch('list', (val) => {
                    console.log(val);
                    if (!val) return;
                    $scope.checkList = val.filter(item => item.checked);
                    const len = $scope.checkList.length;
                    $scope.indeterminate = len !== val.length && len !== 0;
                }, true);

                /** ************************* 事件 *********************** */
                $scope.handleToggle = () => {
                    $scope.visible = !$scope.visible;
                };

                // checkbox 触发事件
                $scope.handleCheck = (val) => {
                    $scope.$emit('__select__', {
                        val,
                        $id: $scope.$id
                    });
                    // $scope.$broadcast('__select__', val);
                };

                /** ************************* 销毁 *********************** */
                element.on('$destroy', () => {
                    $scope.$destroy();
                });
            }
        };
    }]
};
