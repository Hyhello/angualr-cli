/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：index.js
 */
import app from '@/app';
import { requireAll } from '@/libs/utils';

const modules = requireAll(require.context('./src', false, /\.js$/));

for (const res in modules) {
    if (modules.hasOwnProperty(res)) {
        app.filter(modules[res].name, modules[res].callback);
    }
}
