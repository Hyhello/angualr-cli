/**
 * 作者：yeshengqiang
 * 时间：2018-04-28
 * 描述：_import.js
 */

const _importBase = (type) => {
    return (file) => {
        return type.toLowerCase() === 'html' ? require('@/view/' + file + '.' + type) : require('@/view/' + file + '.' + type).default;
    };
};

 export default _importBase;
