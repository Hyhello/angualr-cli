/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：productResult
 */

export default {
    name: 'productResult',
    callback () {
        return (val) => {
            let str = '';
            switch (+val) {
                case 1:
                    str = 'OK';
                    break;
                case 2:
                    str = 'NG';
                    break;
            }
            return str;
        };
    }
};
