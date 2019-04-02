/**
 * 作者：yeshengqiang
 * 时间：2019-03-11
 * 描述：cache
 */

export default class Cache {
    constructor (size) {
        this.Max_Size = size;
        this.list = [];
    }
    getSize () {
        return this.list.length;
    }
    getList () {
        return this.getSize()
                    ? this.list
                    : (this.list = JSON.parse(window.localStorage.getItem('rememberList')) || []);
    }
    containIndex (label) {
        let index = -1;
        let len = this.list.length;
        for (let i = 0; i < len; i++) {
            let resource = this.list[i];
            if (resource.userName === label) {
                index = i;
                break;
            }
        }
        return index;
    }
    unshift (req) {
        let index = this.containIndex(req.userName);
        if (~index) {
            this.list.splice(index, 1);
        }
        this.list.unshift(req);
        this.list = this.list.slice(-this.Max_Size);
    }
    setItem (req) {
        if (!this.getSize()) {
            this.list.push(req);
        } else {
            this.unshift(req);
        }
        window.localStorage.setItem('rememberList', JSON.stringify(this.list));
    }
};
