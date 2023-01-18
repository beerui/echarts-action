
<div align='center'>

[![npm version](https://img.shields.io/npm/v/@brewer/echarts-action.svg)](https://www.npmjs.com/package/@brewer/echarts-action) [![license](https://img.shields.io/npm/l/@brewer/ehcarts-action)](LICENSE.md) ![NPM Downloads](https://img.shields.io/npm/dt/@brewer/echarts-action?color=%23fb7182&label=downloads)

</div>

### EchartsAction 图表自动切换

> 自动执行echarts轮播，鼠标移入停止，移出恢复。

适合大屏展示项目中单个图表需要轮播高亮，选中，tooltip切换等功能。调用方式简单，易上手。

### 快速开始

#### 安装
```
npm i @brewer/echarts-action
```

```
import EchartsAction form '@brewer/echarts-action'
```

#### 使用
```
this.chartsAction = new EchartsAction(this.charts, configs) // config 见下方
this.chartsAction
  .setOption(option)    //  设置echarts的option
  .setNoData(true, {    // true: 无数据时会展示无数据的提示 {}: 自定义展示的内容样式
    theme: 'dark',      // light dark
    top: '20%',
    scaleX: 1.2,
    scaleY: 1.2,
    font: '24px "STHeiti", sans-serif',
    position: [20, 180]
  })
  .setHighlight()   // 开启高亮轮播
  .setShowTip()     // 开启tooltip轮播
  .doHighlight(1)   // 执行高亮轮播 从索引1开始
  .doShowTip()      // 执行tooltip轮播
  .bindMouseover()  // 绑定鼠标移入事件
  .bindMouseout()   // 绑定鼠标移出事件（有移入就得有移出，不然不会清除绑定监听）
  .loop()           // 开启定时器执行循环
```

#### Config 配置项
```
@param {Object} configs - 额外配置项
@param {number} configs.currentIndex 当前索引
@param {number} configs.loopTime 轮播间隔时长
@param {number} configs.resetTime 停止后重新开启轮播间隔时长
@param {number} configs.seriesIndex echarts 第几个series
```


#### Method 方法
| 方法 | 介绍 | 参数     | 默认值   |
| --- | --- |--------|-------|
| setOption | 设置echarts的option | option | null  |
| setShowTip | 是否打开tooltip | flag | true/false |
| setHighlight | 是否打开highlight | flag | true/false |
| setSelect | 是否打开高亮select | flag | true/false |
| stop | 停止轮播 | 无 | 无 |
| bindMouseover | 绑定鼠标移入 | 无 | 无 |
| bindMouseout | 绑定鼠标移出 | 无 | 无 |
| bindGlobalout | 绑定全局鼠标移出 | 无 | 无 |
| setResetTime | 设置重置的延迟时长 | time | 8000 |
| setLoopTime | 设置轮播的间隔时长 | time | 8000 |
| setNoData | 设置暂无数据 | (flag, config) | (true/false,config(在下面)) |
| destroy | 销毁实例，解绑事件 | 无 | 无 |
| addMouseoverCallback | 添加移入时触发事件 | callback | () => {} |
| addMouseoutCallback | 添加移出时触发事件 | callback | () => {} |
| addGlobaloutCallback | 添加全局移出时触发事件 | callback | () => {} |
| addGlobaloutCallback | 添加全局移出时触发事件 | callback | () => {} |


##### setNoData Config
```
@param flag 是否展示无数据
@param config 额外配置项
@param config.theme light dark
@param config.text 暂无数据
@param config.color 文字颜色
@param config.position 文字位置
@param config.bindVisible 自定义回调函数 返回一个布尔值 true 展示
```














