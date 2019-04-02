/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：back
 */

export default {
    name: 'goBack',
    callback: ['$window', ($window) => {
        return function ($scope, element) {
            element.bind('click', function (ev) {
                ev = ev || window.event;
                ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                $window.history.go(-1);
            });
            element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }]
};
