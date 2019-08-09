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
                list: '=children'                               // 数据    array
            },
            require: '?^tree',
            link ($scope, element, attrs) {
                if ($scope.list) {
                    $timeout(() => {
                        const template = $compile(`<tree-item
                                                    ng-repeat="item in list track by $index"
                                                    children="item.children"
                                                    level="{{ item._level }}"
                                                    label="{{ item.label }}"
                                                    >
                                                </tree-item>`)($scope);
                        element.find('div').append(template);
                    });
                }

                /** ********************** 初始化数据 ******************** */
                $scope.visible = false;

                // 设置样式
                $scope.styles = {
                    'padding-left': `${offset * $scope.level}px`
                };

                console.log($scope);

                /** ************************* 事件 *********************** */
                $scope.handleToggle = function () {
                    $scope.visible = !$scope.visible;
                };

                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
