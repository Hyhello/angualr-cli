/**
 * 作者：yeshengqiang
 * 时间：2019-03-11
 * 描述：echarts-config
 */

export const fuelOption = {
    tooltip: {
        formatter: '{a} <br/>{c} {b}'
    },
    series: [
        {
            name: '油表',
            type: 'gauge',
            center: ['50%', '85%'],    // 默认全局居中
            radius: '160%',
            min: 0,
            max: 100,
            startAngle: 180,
            endAngle: 0,
            splitNumber: 4,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[1, '#c4ccd3']],
                    width: 2
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#657180',
                    fontSize: 9
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#c4ccd3'
                }
            },
            pointer: {
                width: 2
            },
            title: {
                show: true,
                color: '#c4ccd3',
                fontSize: 10
            },
            detail: {
                show: false
            },
            data: [{value: 0, name: 'L'}]
        }
    ]
};

export const engineOption = {
    tooltip: {
        formatter: '{a} <br/>{c} {b}'
    },
    series: [
        {
            name: '发动机冷却液',
            type: 'gauge',
            center: ['50%', '85%'],    // 默认全局居中
            radius: '160%',
            min: 0,
            max: 160,
            startAngle: 180,
            endAngle: 0,
            splitNumber: 8,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.75, '#c4ccd3'], [1, '#c4ccd3']],
                    width: 2
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#657180',
                    fontSize: 9
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#c4ccd3',
                    width: 3
                }
            },
            pointer: {
                width: 2
            },
            title: {
                show: true,
                color: '#c4ccd3',
                fontSize: 10
            },
            detail: {
                show: false
            },
            data: [{value: 0, name: '℃'}]
        }
    ]
};
