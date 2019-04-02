/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：echats
 */

import 'echarts/chart/gauge';
import echarts from 'echarts';

export default {
    name: 'echarts',
    callback () {
        return {
            restrict: 'E',
            template: '<div></div>',
            replace: true,
            link: function ($scope, element, attrs) {
                // 设置样式
                element.css('width', attrs.width + 'px');
                element.css('height', attrs.height + 'px');
                const chart = echarts.init(element[0]);
                attrs.$observe('options', (value) => {
                    chart.setOption($scope.$eval(value));
                });
                element.on('$destroy', function () {
                    $scope.$destroy();
                });
            }
        };
    }
};
