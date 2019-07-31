/**
 *  作者：yeshengqiang
 *  时间：2019-03-08
 *  描述：http服务
 */
import { oneOf } from '@/libs/utils';

export default {
    name: 'httpInterceptor',
    callback: ['$q', '$injector', '$Message', function ($q, $injector, $Message) {
        return {
            responseError (e) {
                const message = e.data.message || '服务器内部错误';
                $Message.error(message);
                return $q.reject({message});
            },
            response (response) {
                if (response.data.code === 'SUCCESS') {
                    return $q.when(response.data);
                }
                // 车辆未与TBOX绑定
                if (response.data.code === 'VEHICLE_NO_BIND_DEVICE') {
                    return $q.when(response);
                }
                // 页面提示
                if (oneOf(response.data.code, [
                    'VIN_ERROR',
                    'VEHICLE_SOLD',
                    'PARAM_ERROR',
                    'VEHICLE_INACTIVE',
                    'NO_DETECTION_DATA',
                    'VEHICLE_NO_ACTIVED',
                    'MARK_FAULT_PART',
                    'NOT_REPEAT_DETECTION',
                    'VEHICLE_OFF_PRODUCTION_LINE',
                    'DEVICE_CODE_INEXISTENCE',
                    'VEHICLE_UNBIND_DETECTION'
                ])) {
                    response.data.code = 'PAGE_TIPS';
                    return $q.when(response);
                }
                // 退出登录
                if (oneOf(response.data.code, ['SESSION_TIMEOUT', 'USER_KICKED_OUT', 'RESET_PASSWORD'])) {
                    $Message.info(response.data.message);
                    $injector.get('$state').go('login');
                    window.sessionStorage.removeItem('userInfo');
                    return $q.reject(response.data);
                }
                $Message.error(response.data.message);
                return $q.reject(response.data);
            },
            request (config) {
                config.headers = config.headers || {};
                // 解决ie缓存问题
                if (config.method.toLowerCase() === 'get') {
                    config.params = config.params || {};
                    config.params.v = +new Date();
                }
                return config;
            },
            requestError (e) {
                const message = e.data.message || '服务器内部错误';
                $Message.error(message);
                return $q.reject({message});
            }
        };
    }]
};
