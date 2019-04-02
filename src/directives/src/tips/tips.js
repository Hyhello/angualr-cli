/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：tips
 */
import './tips.scss';
import Count from '@/libs/count';
import tipsTpl from './tips.html';

export default {
    name: 'vTips',
    callback: ['$timeout', ($timeout) => {
        return {
            restrict: 'E',
            template: tipsTpl,
            replace: true,
            transclude: true,
            link ($scope, element, attrs) {
                element.ready(() => {
                    let timer = null;
                    const duration = attrs.duration || 600;
                    const defer = attrs.defer || 3000;
                    const EButton = element.find('button');
                    const height = element.css('height');
                    const count = new Count(parseFloat(height), 0, duration, (val) => {
                        element.css('height', `${val}px`);
                    });
                    const timeout = (defer) => {
                        if (timer) {
                            $timeout.cancel(timer);
                            timer = null;
                        }
                        timer = $timeout(() => {
                            count.start();
                        }, defer);
                    };
                    timeout(defer);
                    EButton.bind('click', () => {
                        if (timer) {
                            $timeout.cancel(timer);
                            timer = null;
                        }
                        count.start();
                    });
                    attrs.$observe('duration', (value) => {
                        if (!value) return;
                        count.updateDuration(value);
                    });
                    attrs.$observe('defer', (value) => {
                        if (!value) return;
                        timeout(value);
                    });
                    element.on('$destroy', function () {
                        $scope.$destroy();
                        $timeout.cancel(timer);
                        timer = null;
                        count.reset();
                    });
                });
            }
        };
    }]
};
