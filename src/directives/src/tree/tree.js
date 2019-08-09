/**
 * 作者：Hyhello
 * 时间：2019-08-03
 * 描述：tree
 */

import './tree.scss';
import tpl from './tree.html';

export default {
    name: 'tree',
    callback: ['$timeout', ($timeout) => {
        const level = 0;

        const defaults = {
            props: {
                label: 'label',
                children: 'children',
                disabled: 'disabled'
            }
        };

        // 转数据
        const convertToData = function (options) {
            if (!options.list) return options.list;
            const list = [];
            const props = options.props;
            const _level = options.level + 1;
            options.list.forEach(item => {
                const tempObj = {
                    ...item,
                    _level: _level - 1,
                    _showCheckbox: !!options.showCheckbox,
                    label: item[props.label],
                    disabled: !!item[props.disabled],
                    children: item[props.children]
                };
                if (tempObj.children) {
                    tempObj.children = convertToData({
                        ...options,
                        level: _level,
                        list: tempObj.children
                    });
                }
                list.push(tempObj);
            });
            return list;
        };

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                emptyText: '@',                         // 无数据文字提示
                showCheckbox: '=',                      // 是否展示checkbox
                defaultProps: '=props',                 // 配置单独属性
                data: '='                               // 数据    array
            },
            link ($scope, element, attrs) {
                const props = Object.assign({}, defaults.props, $scope.defaultProps);
                /** ************************* 监听 *********************** */
                $scope.$watch('data', function (val) {
                    $scope.list = convertToData({
                        list: val,
                        level: level,
                        props: props,
                        showCheckbox: $scope.showCheckbox
                    });
                });
                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
