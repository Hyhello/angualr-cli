/**
 *  作者：yeshengqiang
 *  时间：2019-03-08
 *  描述：分页文件
 */
export default {
    name: 'Paginator',
    callback () {
        return {
            list: function (fetchFunction, pageSize) {
                var paginator = {
                    hasNextVar: false,
                    object: {},
                    page: {},
                    pages: [],
                    templateUrl: '',
                    next: function () {
                        if (this.hasNextVar) {
                            this.page.currentPage += 1;
                            this._load();
                        }
                    },
                    _load: function () {
                        var self = this;
                        fetchFunction(this.page, function (data) {
                            self.page.currentPage = data.pageNum;
                            self.page.totalPage = data.totalPage;             // 总页数
                            self.page.totalResult = data.totalData;           // 总数量
                            self.hasNextVar = data.pageNum < data.totalPage;
                            self.templateUrl = 'paging';
                            self.pages = [];
                            var index = 1;
                            if (self.page.currentPage <= 2) {
                                for (let i = 1; i <= self.page.totalPage; i++) {
                                    if (index <= 5) {
                                        self.pages.push(i);
                                        index++;
                                    } else {
                                        return;
                                    }
                                }
                            } else if (self.page.currentPage >= 3 && self.page.totalPage - 2 >= self.page.currentPage) {
                                if (index <= 5) {
                                    for (let i = self.page.currentPage - 2; i <= self.page.currentPage + 2; i++) {
                                        self.pages.push(i);
                                        index++;
                                    }
                                } else {
                                    return;
                                }
                            } else if (self.page.totalPage <= 5) {
                                for (let i = 1; i <= self.page.totalPage; i++) {
                                    self.pages.push(i);
                                }
                                return;
                            } else {
                                if (index <= 5) {
                                    for (let i = self.page.totalPage - 4; i <= self.page.totalPage; i++) {
                                        self.pages.push(i);
                                        index++;
                                    }
                                } else {
                                    return;
                                }
                            }
                        });
                    },
                    hasNext: function () {
                        return this.page.currentPage < this.page.totalPage;
                    },
                    previous: function () {
                        if (this.hasPrevious()) {
                            this.page.currentPage -= 1;
                            this._load();
                        }
                    },
                    hasPrevious: function () {
                        return this.page.currentPage > 1;
                    },
                    go: function (currentPage) {
                        if (currentPage >= 1 && currentPage <= this.page.totalPage) {
                            this.page.currentPage = currentPage;
                            this._load();
                        }
                    },
                    search: function () {
                        this.page.currentPage = 1;
                        this._load();
                    },
                    scrollTo: function () {
                        this.go(this.page.currentPage + 1);
                    }
                };
                paginator.page.currentPage = 1;
                paginator.page.pageSize = pageSize;// 设置每页显示记录数
                paginator._load();// 加载第一页
                return paginator;
            }
        };
    }
};
