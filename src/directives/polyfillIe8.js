/**
 * 作者：yeshengqiang
 * 时间：2019-03-14
 * 描述：为了兼容ie8得指令
 * document.createElement(yourTagName)- 创建自定义标签名 - 因为这只是对旧版本IE的问题，所以你需要指定加载条件。对于每一个没有命名空间并且在HTML中没有定义的标签，你需要提前声明以使得IE识别。
 * 注意：ie8 并不支持v-bbb-ccc 组件，请保持不超过一个短横线，即：v-bbbccc
 */
import { checkIe8, hump } from '@/libs/utils';

const polyfillIe8 = (tag) => {
    if (!checkIe8()) return;
    document.createElement(hump(tag));
};

export default polyfillIe8;
