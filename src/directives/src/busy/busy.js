/**
 * 作者：yeshengqiang
 * 时间：2019-03-12
 * 描述：loading
 */

import './busy.scss';
import loadingTpl from './busy.html';
import { checkIe8 } from '@/libs/utils';

export default {
    name: 'vBusy',
    callback: ['$compile', ($compile) => {
        return {
            restrict: 'A',
            replace: false,
            scope: true,
            template (element) {
                // 保存原来得数据
                element.data('_originData', element.html());
            },
            link ($scope, element, attrs) {
                // 加载过程提示文字
                $scope.loadingText = attrs.loadingText || '加载中';
                // 是否是ie8
                $scope.isIE8 = checkIe8();

                // 编译后得模板
                const compileTpl = $compile(loadingTpl)($scope);
                const originData = element.data('_originData');

                // 监听loading状态
                $scope.$watch(attrs.vBusy, (newVal) => {
                    element.attr('disabled', newVal);
                    if (newVal) {
                        element.empty().append(compileTpl);
                    } else {
                        element.empty().append(originData);
                    }
                });

                // 注销
                element.on('$destroy', function () {
                    element.removeData('_originData');
                    $scope.$destroy();
                });
            }
        };
    }]
};
