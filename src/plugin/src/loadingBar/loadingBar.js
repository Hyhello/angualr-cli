/**
 * 作者：yeshengqiang
 * 时间：2019-03-21
 * 描述：loading factory
 */

import './loadingBar.scss';
import angular from 'angular';
import tpl from './loadingBar.html';
const loadingTpl = angular.element(tpl);

export default {
    name: '$LoadingBar',
    callback: {
        v: '0.0.1',
        _init () {
            angular.element(document.body).append(loadingTpl);
        },
        $get () {
            return {
                v: this.v,
                open () {},
                close () {}
            };
        }
    }
};
