/**
 * 作者：Hyhello
 * 时间：2019-07-22
 * 描述：transfer
 */

import './transfer.scss';
import tpl from './transfer.html';

export default {
    name: 'transfer',
    callback: ['$timeout', ($timeout) => {
        // 默认props
        const defaultProps = {
            key: 'key',
            label: 'label',
            disabled: 'disabled'
        };

        // 配置
        const defaults = {
            titles: ['列表1', '列表2']
        };

        console.log(defaultProps);

        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                currentValue: '=vModel',
                titles: '=',                            // 标题
                data: '=',                              // 数据
                props: '=',                             // 设置别名
                renderContent: '&'                      // 渲染函数
            },
            link ($scope, element, attrs) {
                /** ************************* 配置项 *********************** */
                // 配置title
                $scope.currentTitles = Object.assign(defaults.titles, $scope.titles || []);

                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
