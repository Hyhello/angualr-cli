/**
 * 作者：yeshengqiang
 * 时间：2019-03-07
 * 描述：checkVqService
 */

export const findProductionLineVQRecordApi = '/api/produce/product/vq/line/findProductionLineVQRecord';        // 查询VQ检测结果

export const findVqHistoryApi = '/api/produce/product/vq/line/findPageList/:pageNum/:pageSize';                // 分页查询产线VQ检测记录（VQ）

export const reportVqResultApi = '/api/produce/product/vq/line/reportVqResult';                                // 人工上报

export const queryTodayDetectionNumberApi = '/api/produce/product/vq/line/queryTodayDetectionNumber';          // 统计当前用户今日检测数量
