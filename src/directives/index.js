/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：index.js
 */
import app from '@/app';
import polyfillIe8 from './polyfillIe8';
import { requireAll } from '@/libs/utils';

const modules = requireAll(require.context('./src', true, /\.js$/));

for (const res in modules) {
    if (modules.hasOwnProperty(res)) {
        // 为了指令兼容ie8
        polyfillIe8(modules[res].name);
        app.directive(modules[res].name, modules[res].callback);
    }
}
