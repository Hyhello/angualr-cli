/**
 * 作者：yeshengqiang
 * 时间：2019-03-12
 * 描述：contains
 */
import angular from 'angular';
const contains = function (a, b, itself) {
    if (itself && a === b) return true;
    if (a.contains) {
        if (a.nodeType === 9) return true;
        return a.contains(b);
    } else if (a.compareDocumentPosition) {
        return !!(a.compareDocumentPosition(b) & 16);
    }
    while ((b = b.parentNode)) { if (a === b) return true; }
    return false;
};

export default {
    name: 'ngContains',
    callback () {
        return {
            restrict: 'A',
            link ($scope, element, attrs) {
                const el = angular.element(document);
                element._eleClickOutSide_ = (ev) => {
                    ev = ev || window.event;
                    const target = event.target || event.srcElement;
                    if (!contains(element[0], target, element[0] === target)) {
                        $scope.$apply(() => {
                            $scope.$eval(attrs.ngContains);
                        });
                        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                    }
                };
                el.bind('click', element._eleClickOutSide_);
                element.on('$destroy', function () {
                    el.unbind('click', element._eleClickOutSide_);
                    element._eleClickOutSide_ = null;
                    $scope.$destroy();
                });
            }
        };
    }
};
