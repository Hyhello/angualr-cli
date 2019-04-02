/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：入口文件
 */
import 'babel-polyfill';
import 'normalize.css';
import angular from 'angular';
import '@/assets/style/common.scss';
import './directives/';
import './filters/';
import './factory/';
import './plugin/';
import './router/';
import './store/';

// 启动app
angular.bootstrap(document, ['app']);
