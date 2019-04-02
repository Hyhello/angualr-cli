/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：trim
 */

import { trim } from '@/libs/utils';

export default {
    name: 'trim',
    callback () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    if (!ngModel.$isEmpty(val)) {
                        return trim(val);
                    }
                });
            }
        };
    }
};
