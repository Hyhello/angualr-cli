/**
 * 作者：yeshengqiang
 * 时间：2019-03-21
 * 描述：message
 */
import './messageBox.scss';
import angular from 'angular';
import Count from '@/libs/count';
import tpl from './messageBox.html';
import { findClass } from '@/libs/utils';

export default {
    name: '$MessageBox',
    callback () {
        let MessageBoxQueue = [];
        const _count = new Count(0, 0, 500);
        const oInstance = angular.element(tpl);
        const oDocument = angular.element(document);
        const oBody = angular.element(document.body);
        const oModel = angular.element(findClass(oInstance[0], 'hy-message-box__modal')[0]);
        const oMain = angular.element(findClass(oInstance[0], 'hy-message-box__main')[0]);
        const oTitle = angular.element(findClass(oInstance[0], 'hy-message-box__title')[0]);
        const oClosed = angular.element(findClass(oInstance[0], 'hy-message-box__closed')[0]);
        const oMessage = angular.element(findClass(oInstance[0], 'hy-message-box__message')[0]);
        const oConfirmButton = angular.element(findClass(oInstance[0], 'hy-button--primary')[0]);
        const oCancelButton = angular.element(findClass(oInstance[0], 'hy-button--default')[0]);
        oBody.append(oInstance);

        // 配置
        const defaults = {
            title: '提示',
            modelable: true,
            message: '',
            escable: true,
            modelclickable: true,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        };

        // 隐藏
        const hide = () => {
            oInstance.removeClass('show');
            _count.callback = (val, _, status) => {
                // 兼容ie8
                oModel
                    .css('opacity', (val / 100) * 0.6)
                    .css('filter', `alpha(opacity: ${val * 0.6})`)
                oMain
                    .css('opacity', val / 100)
                    .css('filter', `alpha(opacity: ${val})`)
                    .css('margin-top', val * 0.3 - 30 + 'px');
                if (status) {
                    oInstance.addClass('hide');
                    if (oDocument.__outSideClick__) {
                        oDocument.unbind('keydown', oDocument.__outSideClick__);
                        delete oDocument.__outSideClick__;
                    }
                    if (oConfirmButton.__outSideClick__) {
                        oConfirmButton.unbind('click', oConfirmButton.__outSideClick__);
                        delete oConfirmButton.__outSideClick__;
                    }
                    if (oModel.__outSideClick__) {
                        oModel.unbind('click', oModel.__outSideClick__);
                        delete oModel.__outSideClick__;
                    }
                    showNextMsg();
                }
            };
            _count.update(0);
        };

        // 展示
        const show = () => {
            oInstance.removeClass('hide');
            _count.callback = (val, _, status) => {
                // 兼容ie8
                oModel
                    .css('opacity', (val / 100) * 0.6)
                    .css('filter', `alpha(opacity: ${val * 0.6})`)
                oMain
                    .css('opacity', val / 100)
                    .css('filter', `alpha(opacity: ${val})`)
                    .css('margin-top', val * 0.3 - 30 + 'px');
                if (status) {
                    oInstance.addClass('show');
                }
            };
            _count.update(100);
        };

        // 队列
        const showNextMsg = () => {
            const visible = oInstance.hasClass('show');
            const queueLen = MessageBoxQueue.length;
            if (visible || _count.isStart) return;
            if (queueLen) {
                const resource = MessageBoxQueue.shift();
                let options = resource.options;
                for (let i in options) {
                    if (options.hasOwnProperty(i)) {
                        switch (i) {
                            case 'title':
                                oTitle.html(options[i]);
                                break;
                            case 'message':
                                oMessage.html(options[i]);
                                break;
                            case 'confirmButtonText':
                                oConfirmButton.html(options[i]);
                                oConfirmButton.bind('click', oConfirmButton.__outSideClick__ = () => {
                                    hide();
                                    resource.resolve();
                                });
                                break;
                            case 'cancelButtonText':
                                oCancelButton.html(options[i]);
                                break;
                            case 'showCancelButton':
                                if (!options[i]) {
                                    oCancelButton.remove();
                                } else {
                                    oConfirmButton.parent()[0].insertBefore(oCancelButton[0], oConfirmButton[0]);
                                    oCancelButton.bind('click', () => {
                                        hide();
                                        resource.reject();
                                    });
                                }
                                break;
                            case 'showCloseButton':
                                if (!options[i]) {
                                    oClosed.remove();
                                } else {
                                    oClosed.parent().append(oClosed);
                                    oClosed.bind('click', () => {
                                        hide();
                                        resource.reject();
                                    });
                                }
                                break;
                            case 'escable':
                                if (options[i]) {
                                    oDocument.bind('keydown', oDocument.__outSideClick__ = (e) => {
                                        if (e.keyCode === 27) {
                                            hide();
                                            resource.reject();
                                        }
                                    });
                                }
                                break;
                            case 'modelable':
                                if (!options[i]) {
                                    oModel.remove();
                                } else {
                                    oInstance[0].insertBefore(oModel[0], oMain[0]);
                                    if (options['modelclickable']) {
                                        oModel.bind('click', oModel.__outSideClick__ = () => {
                                            hide();
                                            resource.reject();
                                        });
                                    }
                                }
                                break;
                        }
                    }
                }
                show();
            }
        };

        /***************************主体内容****************************** */
        // 主体内容
        const MessageBox = (options) => {
            return new Promise((resolve, reject) => {
                MessageBoxQueue.push({
                    options: angular.extend({}, defaults, options),
                    resolve: resolve,
                    reject: reject
                });
                showNextMsg();
            });
        };

        // 版本
        MessageBox.v = '0.0.1';

        // alert
        MessageBox.alert = (message, title, options = {}) => {
            options = angular.extend({
                title: title,
                message: message,
                $type: 'alert',
                showCancelButton: false
            }, options);
            return MessageBox(options);
        };

        // confirm
        MessageBox.confirm = (message, title, options = {}) => {
            options = angular.extend({
                title: title,
                message: message,
                $type: 'confirm',
                showCancelButton: true
            }, options);
            return MessageBox(options);
        };

        this.$get = () => {
            return MessageBox;
        };
    }
};
