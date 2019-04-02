/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：focus
 */

// 光标移动到最后一个字母
const focusMoveEnd = (el, len, bool) => {
    if (bool) {
        el.focus();
    } else {
        len = 0;
        el.blur();
    }
    if (document.selection) {
        var sel = el.createTextRange();
        sel.move('character', len);
        sel.collapse(true);
        sel.select();
    } else if (typeof el.selectionStart === 'number' &&
        typeof el.selectionEnd === 'number') {
        el.selectionStart = el.selectionEnd = len;
    }
};

export default {
    name: 'vFocus',
    callback () {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, element, attrs, $timeout) {
                // 为了做简单的功能
                element.bind('blur', () => {
                    // 危险操作
                    $timeout(() => {
                        $scope[attrs.vFocus] = false;
                    });
                });
                $scope.$watch(attrs.vFocus, (newVal) => {
                    focusMoveEnd(element[0], element.val().length, newVal);
                });
                element.on('$destroy', function () {
                    focusMoveEnd(element[0], element.val().length, false);
                    element.unbind('blur');
                    $scope.$destroy();
                });
            }]
        };
    }
};
