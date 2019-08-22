/**
 * 作者：Hyhello
 * 时间：2019-08-21
 * 描述：extend
 */

import './block.scss';
import Count from '@/libs/count';
import tpl from './blockExtend.html';

export default {
    name: 'blockExtend',
    callback: ['$timeout', ($timeout) => {
        const getHeight = (el) => {
            el.style.display = 'block';
            const height = el.getBoundingClientRect().height;
            el.style.display = 'none';
            return height;
        };

        return {
            restrict: 'E',
            replace: true,
            template: tpl,
            require: '^block',
            transclude: true,
            link ($scope, $element, attr, app) {
                const _count = new Count(0, 0, 3000, function (val, status) {
                    $element[0].style.display = 'block';
                    $element.css('height', val + 'px');
                    if (status) {
                        // if (val) {
                        //     $element[0].style.display = 'none';
                        // } else {
                        //     $element[0].style.display = 'block';
                        // }
                        $element.css('height', 'auto');
                    }
                });

                // _emit
                if (app) {
                    $scope.$watch(() => app.currentValue, (val) => {
                        $element.css('height', val ? getHeight($element[0]) : 'auto' + 'px');
                        // _count.update(val ? getHeight($element[0]) : 0);
                    });
                }

                $element.on('$destroy', () => {
                    _count && _count.reset();
                    $scope.$destroy();
                });
            }
        };
    }]
};
