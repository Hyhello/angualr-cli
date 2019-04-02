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
            switch (+val) {
                case 1:
                    str = '整装下线';
                    break;
                default:
                    str = 'VQ下线';
                    break;
            }
            return str;
        };
    }
};
