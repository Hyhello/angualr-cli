/**
 * 作者：yeshengqiang
 * 时间：2019-03-21
 * 描述：message
 */
import './message.scss';
import angular from 'angular';
import Count from '@/libs/count';
import tpl from './message.html';

export default {
    name: '$Message',
    callback () {
        let baseIndex = 3000;
        const body = angular.element(document.body);

        // 配置项
        this.defaults = {
            duration: 3000
        };

        // 编译
        const compile = (tpl, data) => {
            return tpl.replace(/{{(.*?)}}/g, function (_, $1) {
                return data[$1];
            });
        };

        /***************************主体内容****************************** */

        const Message = (msg, type) => {
            const messageTpl = angular.element(compile(tpl, {msg})).css('z-index', baseIndex++).addClass(`hy-message--${type}`);
            const _count = new Count(0, 100, 500, (val, status) => {
                messageTpl
                    .css('top', val * 0.6 + 'px')
                    .css('opacity', val / 100)
                    .css('filter', `alpha(opacity: ${val})`);
                if (status) {
                    val === 0 && messageTpl.remove();
                }
            });
            body.append(messageTpl);
            _count.start();
            window.setTimeout(() => {
                _count.update(0);
            }, this.defaults.duration);
        };

        // 版本
        Message.v = '0.0.1';

        // info
        Message.info = (msg) => {
            Message(msg, 'info');
        };

        // success
        Message.success = (msg) => {
            Message(msg, 'success');
        };

        // warning
        Message.warning = (msg) => {
            Message(msg, 'warning');
        };

        // error
        Message.error = (msg) => {
            Message(msg, 'error');
        };

        this.$get = () => {
            return Message;
        };
    }
};
