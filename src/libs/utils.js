/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：utils
 */

import angular from 'angular';

const _toString = Object.prototype.toString;

const _slice = Array.prototype.slice;

export const copy = angular.copy;

// _typeof
export const _typeof = (type) => {
    return _toString.call(type).replace(/\[object (\w+?)\]/, '$1').toLowerCase();
};

// 去除两边空格
export const trim = function (str) {
    const reg = /^\s+|\s+$/g;
    return str.replace(reg, '');
};

// formateDate
export const formateDate = function (date, fmt) { // author: meizz
    if (!date) return null;
    if (typeof date === 'string') {
        date = date.replace(/-/g, '/');
    }
    date = new Date(date);
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
    return fmt;
};

// 加载所有
export const requireAll = requireContext => {
    let resource = {};
    requireContext.keys().forEach(item => {
        let src = item.replace(/(?:.*?)(\w+)\.js$/, '$1');
        const result = requireContext(item);
        resource[src] = ('default' in result)
                                    ? { ...result.default }
                                    : { ...result };
    });
    return resource;
};

// 检测是否是ie8及以下
export const checkIe8 = () => {
    const DEFAULT_VERSION = 8.0;
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') > -1 && ua.match(/msie ([\d.]+)/)[1] <= DEFAULT_VERSION;
};

// oneOf
export const oneOf = (target, list) => {
    return new RegExp('\\b' + target + '\\b', 'g').test(list.toString());
};

// 驼峰 adfaAbb - adfa-Abb
export const hump = (s) => {
    s = s.replace(/([A-Z])/g, '-$1').toLowerCase();
    return s.charAt(0) === '-' ? s.substr(1) : s;
};

// isObj
export const isObj = (obj) => {
    return obj !== null && typeof obj === 'object';
};

export const getStyle = (obj, attr) => {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, false).getPropertyValue(attr);
    } else {
        return obj.currentStyle[attr];
    }
};

// 通过class 查找
export const findClass = (iParent, iClass) => {
    iParent = iParent || document;
    if (iParent.getElementsByClassName) {
        return _slice.call(iParent.getElementsByClassName(iClass));
    } else {
        const aList = iParent.getElementsByTagName('*');
        let list = [];
        for (let i = 0; i < aList.length; i++) {
            if (new RegExp(iClass).test(aList[i].className)) {
                list.push(aList[i]);
            }
        }
        return list;
    }
};

// 判断是否是一个number
export const isNumber = (n) => {
    return !isNaN(n) && typeof n === 'number';
};

// hasClass
export const hasClass = (el, className) => {
    const reg = new RegExp(`\b${className}\b`, 'i');
    return reg.test(el.className);
};

// removeClass
export const removeClass = (el, className) => {
    const reg = new RegExp(`\b${className}\b`, 'i');
    if (!hasClass(el, className)) return;
    el.className = el.className.replace(reg, '');
};

// addClass
export const addClass = (el, className) => {
    if (hasClass(el, className)) return;
    el.className = el.className.split(/\s+/).concat([className]).join(' ');
};

// 获取滚动条宽度
export const getScrollWidth = () => {
    const oDiv = document.createElement('div');
    const styles = {
        width: '100px',
        height: '1px',
        position: 'absolute',
        visibility: 'hidden',
        overflowY: 'scroll'
    };
    for (let i in styles) {
        oDiv.style[i] = styles[i];
    }
    document.body.appendChild(oDiv);
    const scrollbarWidth = oDiv.offsetWidth - oDiv.clientWidth;
    oDiv.remove();
    return scrollbarWidth;
};
