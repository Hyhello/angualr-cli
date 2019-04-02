/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：userType
 */

export default {
    name: 'userType',
    callback () {
        return (val) => {
            let str = '';
            switch (+val) {
                case 1:
                    str = '检测人';
                    break;
                default:
                    str = '返修人';
                    break;
            }
            return str;
        };
    }
};
