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
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            scope: {
                emptyText: '@',                         // 无数据文字提示
                data: '='                               // 数据    array
            },
            link ($scope, element, attrs) {
                console.log($scope.data);

                /** ************************* 销毁 *********************** */
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }]
};
