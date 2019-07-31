/**
 * 作者：yeshengqiang
 * 时间：2019-04-17
 * 描述：table组件
 */

// import './table.scss';
import tpl from './table.html';
// import { trim } from '@/libs/utils';

export default {
    name: 'vTable',
    // 兼容ie8 则采用$compile 而不是ng-transclude
    callback: ['$compile', function ($compile) {
        return {
            restrict: 'E',
            template: tpl,
            replace: true,
            transclude: true,
            scope: {
                data: '='
            },
            compile (ele, attr, transclude) {
                return ($scope, ele, attr) => {
                    const thead = ele.find('thead').find('tr');

                    transclude($scope, function (clone) {
                        thead.append(clone);
                    });

                    // 注销
                    ele.on('$destroy', function () {
                        $scope.$destroy();
                    });
                };
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                /** ***************初始化数据*************** */
                $scope.childMap = {};
                this.list = $scope.data;
                // 添加child
                this.addChild = (scope) => {
                    $scope.childMap[scope.$id] = {
                        label: scope.label,
                        width: scope.width,
                        prop: scope.prop
                    };
                };

                // remove Child
                this.removeChild = (scope) => {
                    delete $scope.childMap[scope.$id];
                };
            }]
        };
    }]
};
