/**
 * 作者：yeshengqiang
 * 时间：2019-03-06
 * 描述：启动app
 */
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngResource from 'angular-resource';

// 启动app
const app = angular.module('app', [uiRouter, ngResource]);

export default app;
