/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：vehicleStatus
 */

export default {
    name: 'vehicleStatus',
    callback () {
        return (val) => {
            let str = '';
            switch (val) {
                case 1:
                    str = '总装下线NG';
                    break;
                case 2:
                    str = 'VQ检测NG';
                    break;
            }
            return str;
        };
    }
};
