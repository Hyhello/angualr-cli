/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：keyenter
 */

export default {
    name: 'ngEnter',
    callback () {
        return {
            restrict: 'A',
            link ($scope, element, attrs) {
                element.bind('keypress', (ev) => {
                    ev = ev || window.event;
                    if (event.keyCode === 13) {
                        $scope.$eval(attrs.ngEnter);
                        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                        return false;
                    }
                });
                element.on('$destroy', function () {
                    element.unbind('keypress');
                    $scope.$destroy();
                });
            }
        };
    }
};
