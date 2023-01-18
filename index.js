/**
 * EchartsAction
 * @description 自动执行echarts轮播，鼠标移入停止，移出恢复。
 *
 * @param {Echarts} instance echarts实例对象
 * @param {Object} configs - 额外配置项
 * @param {number} configs.currentIndex 当前索引
 * @param {number} configs.loopTime 轮播间隔时长
 * @param {number} configs.resetTime 停止后重新开启轮播间隔时长
 * @param {number} configs.seriesIndex echarts 第几个series
 *
 * @example
 * const ehcartsAction = new EchartsAction(myChart);
 * chartsAction = new EchartsAction(this.charts)
 * chartsAction
 *  .doHighlight(1)
 *  .bindMouseover()
 *  .bindGlobalout()
 *  .loop();
 *
 * @author beerui2021@gmail.com
 */
const noop = () => {}
export default class EchartsAction {
	mouseoverEvent = new Set(); // 监听鼠标经过的回调
	mouseoutEvent = new Set(); // 自定义鼠标事件回调
	globaloutEvent = new Set();
	seriesLength = 0; // 数据长度
	isHighlight = false; // 开启高亮轮播
	isSelect = false; // 开启选中
	isShowTip = false; // 开启提示轮播
	isSetNoData = false; // 开启无数据提示
	loopTimer = null; // 循环间隔时间对象
	noDataConfig = { text: '暂无数据', theme: 'light' }; // 无数据配置
	resetTimer = null; // 重置时间对象
	echartOptions = null; // option
	customLoopCallback = noop; // 自定义轮播事件回调
	customMouseoverCallback = noop; // 自定义鼠标移入事件回调
	customMouseoutCallback = noop; // 自定义鼠标移出事件回调
	customGlobaloutCallback = noop; // 自定义全局鼠标移出事件回调
	lightNoData = 'data:image/png;base64,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'
	darkNoData = 'data:image/png;base64,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'
	constructor(instance, configs) {
		this.instance = instance
		const defaultOptions = {
			currentIndex: -1,
			loopTime: 8000,
			resetTime: 8000,
			seriesIndex: 0
		}
		configs = Object.assign(defaultOptions, configs)
		for (const config in configs) {
			if (configs.hasOwnProperty(config)) {
				this[config] = configs[config]
			}
		}
	}

	initActions() {
		if (!this.instance) {
			console.log('EchartsAction Tips: 未传入 echarts 实例！')
			return false
		}
		this.echartOptions = this.instance.getOption()
		if (!this.echartOptions?.series[this.seriesIndex]?.data) {
			console.log('EchartsAction Tips: 缺少必备参数 series: data ！', this.instance)
			return false
		}
		this.seriesLength = this.echartOptions.series[this.seriesIndex].data.length
		if (this.isSetNoData) this.tryNoData()
		if (this.seriesLength === 0) {
			console.log('data长度为零，不执行轮播！')
			return false
		}
		return this
	}
	// 是否满足循环条件
	isCanLoop() {
		return !this.isHighlight && !this.isShowTip && !this.isSelect
	}
	loop() {
		if (!this.initActions()) return
		this.clearLoopTimer()
		this.loopTimer = setInterval(this.loopEvent.bind(this), this.loopTime)
	}

	// 轮流高亮图表的每个区块
	loopEvent() {
		this.isCanLoop() && this.clearLoopTimer()
		this.doDownplay()
		this.isSelect && this.doUnselect()
		this.currentIndex = (this.currentIndex + 1) % this.seriesLength
		this.customLoopCallback && this.customLoopCallback({
			currentIndex: this.currentIndex,
			seriesIndex: this.seriesIndex
		})
		this.isHighlight && this.doHighlight()
		this.isSelect && this.doSelect()
		this.isShowTip && this.doShowTip()
	}

	// 执行echarts事件
	doDispatchAction(type, currentIndex, seriesIndex) {
		this.seriesIndex = !isNaN(seriesIndex) ? seriesIndex : this.seriesIndex
		this.currentIndex = !isNaN(currentIndex) ? currentIndex : this.currentIndex
		this.instance.dispatchAction({
			type: type,
			seriesIndex: this.seriesIndex,
			dataIndex: this.currentIndex
		})
		return this
	}
	// 高亮当前图形
	doHighlight(currentIndex, seriesIndex) {
		return this.doDispatchAction('highlight', currentIndex, seriesIndex)
	}
	// 选中指定的数据。
	doSelect(currentIndex, seriesIndex) {
		return this.doDispatchAction('select', currentIndex, seriesIndex)
	}
	// 取消选中指定的数据。
	doUnselect(currentIndex, seriesIndex) {
		return this.doDispatchAction('unselect', currentIndex, seriesIndex)
	}
	// 换选中状态。
	doToggleSelected(currentIndex, seriesIndex) {
		return this.doDispatchAction('toggleSelected', currentIndex, seriesIndex)
	}
	// 取消之前高亮的图形
	doDownplay(currentIndex, seriesIndex) {
		return this.doDispatchAction('downplay', currentIndex, seriesIndex)
	}
	// 显示 tooltip
	doShowTip(currentIndex, seriesIndex) {
		return this.doDispatchAction('showTip', currentIndex, seriesIndex)
	}
	/**
	 * 是否高亮tooltip
	 * @param flag {Boolean} true/false
	 * @returns {EchartsAction}
	 */
	setShowTip(flag = true) {
		this.isShowTip = flag
		return this
	}

	/**
	 * 是否高亮
	 * @param flag {Boolean} true/false
	 * @returns {EchartsAction}
	 */
	setHighlight(flag = true) {
		this.isHighlight = flag
		return this
	}
	/**
	 * 是否开启选中高亮
	 * @param flag {Boolean} true/false
	 * @returns {EchartsAction}
	 */
	setSelect(flag = true) {
		this.isSelect = flag
		return this
	}
	// 隐藏所有高亮
	stopAllDownplay() {
		this.instance.dispatchAction({
			type: 'downplay',
			seriesIndex: this.seriesIndex
		})
		return this
	}
	// 隐藏所有高亮
	stopAllSelect() {
		this.instance.dispatchAction({
			type: 'unselect',
			seriesIndex: this.seriesIndex,
			dataIndex: 0
		})
		return this
	}
	/**
	 * 停止轮播
	 */
	stop() {
		this.clearLoopTimer()
		this.currentIndex = -1
		return this
	}
	/**
	 * 绑定全局鼠标移入
	 */
	bindMouseover() {
		this.instance.on('mouseover', (el) => {
			if (this.customMouseoverCallback) {
				const obj = this.computedCurrentData(el)
				this.customMouseoverCallback(obj)
				this.executeMouseoverEvent(obj)
			} else {
				this.clearLoopTimer()
				this.executeMouseoverEvent(this.computedCurrentData(el))
				this.stopAllDownplay().stopAllSelect()
				this.isSelect && this.doSelect()
				this.isHighlight && this.doHighlight()
			}
		})
		return this
	}
	computedCurrentData(el) {
		if (el) {
			this.currentIndex = el.dataIndex
			this.seriesIndex = el.seriesIndex
		}
		return {
			currentIndex: this.currentIndex,
			seriesIndex: this.seriesIndex,
			source: el
		}
	}
	setCurrentIndex(index) {
		this.currentIndex = index
		return this
	}
	setSeriesIndex(index) {
		this.seriesIndex = index
		return this
	}
	/**
	 * 绑定鼠标移出
	 */
	bindMouseout() {
		this.clearResetTimer()
		const resetLoop = () => {
			this.clearResetTimer()
			this.executeMouseoutEvent()
			this.loop()
		}
		this.instance.on('mouseout', () => {
			this.customMouseoutCallback && this.customMouseoutCallback()
			this.resetTimer = setTimeout(() => resetLoop(), this.resetTime)
		})
		return this
	}
	/**
	 * 绑定全局鼠标移出
	 */
	bindGlobalout() {
		this.clearResetTimer()
		const resetLoop = () => {
			this.clearResetTimer()
			this.loop()
			this.executeGlobaloutEvent()
		}
		this.instance.on('globalout', () => {
			this.customGlobaloutCallback && this.customGlobaloutCallback()
			this.resetTimer = setTimeout(() => resetLoop(), this.resetTime)
		})
		return this
	}
	setOption(option) {
		if (option) this.echartOptions = option
		this.instance.setOption(this.echartOptions)
		return this
	}
	/**
	 * 设置重置的延迟时长
	 * @param time
	 */
	setResetTime(time) {
		this.resetTime = time
		return this
	}
	/**
	 * 设置轮播的间隔时长
	 * @param time
	 */
	setLoopTime(time) {
		this.loopTime = time
		return this
	}
	/**
	 * 设置暂无数据
	 * @param flag
	 * @param config
	 * @param config.theme light dark
	 * @param config.text 暂无数据
	 * @param config.color 文字颜色
	 * @param config.position 文字位置
	 * @param config.bindVisible 自定义回调函数 返回一个布尔值 true 展示
	 */
	setNoData(flag = true, config) {
		this.isSetNoData = flag
		if (config) {
			this.noDataConfig = Object.assign({
				theme: 'light',
				text: '暂无数据'
			}, config)
		}
		return this
	}
	tryNoData() {
		const _graphic = this.getGraphic(this.noDataConfig)
		if (this.echartOptions?.graphic && this.isArray(this.echartOptions?.graphic[0].elements)) {
			const index = this.echartOptions.graphic[0].elements.findIndex(el => el.__isMounted)
			if (index !== -1) {
				this.echartOptions.graphic[0].elements[index] = Object.assign(this.echartOptions.graphic[0].elements[index], _graphic)
			} else {
				this.echartOptions.graphic = Array.from(new Set([...this.echartOptions.graphic[0].elements, _graphic]))
			}
		}
		if (!this.echartOptions.graphic) this.echartOptions.graphic = [_graphic]
		const timer = setTimeout(() => {
			this.setOption()
			clearTimeout(timer)
		}, 10)
		return this.setOption()
	}
	getGraphic(config) {
		return {
			__isMounted: 'Mounted', // 挂载一次
			type: 'image',
			left: config.left || 'center',
			top: config.top || 'middle',
			silent: true,
			scaleX: config.scaleX || 1,
			scaleY: config.scaleY || 1,
			invisible: config.bindVisible ? !config.bindVisible() : this.seriesLength > 0,
			style: {
				image: config.theme === 'dark' ? this.darkNoData : this.lightNoData
			},
			textContent: {
				invisible: config.bindVisible ? !config.bindVisible() : this.seriesLength > 0,
				style: {
					text: config.text || '暂无数据',
					font: config.font || '',
					fill: config.color ? config.color : (config.theme === 'dark' ? 'rgba(255, 255, 255, .85)' : 'rgba(0, 0, 0, .85)')
				}
			},
			textConfig: {
				origin: 'center',
				scaleX: config.scaleX || 1,
				scaleY: config.scaleY || 1,
				top: config.top || 'middle',
				position: config.position || (config.theme === 'dark' ? [38, 180] : [23, 110])
			}
		}
	}
	isArray(item) {
		if (!item) return false
		return Object.prototype.toString.call(item) === '[object Array]'
	}
	isObject(item) {
		if (!item) return false
		return Object.prototype.toString.call(item) === '[object Object]'
	}
	clearLoopTimer() {
		this.loopTimer && clearInterval(this.loopTimer)
		return this
	}
	clearResetTimer() {
		this.resetTimer && clearInterval(this.resetTimer)
		return this
	}
	/**
	 * 销毁实例，解绑事件
	 */
	destroy() {
		if (this.instance) {
			this.instance.off()
			this.instance.dispose()
		}
		this.mouseoverEvent.clear()
	}
	/**
	 * 添加轮播时触发事件
	 * @param time
	 */
	addMouseoverCallback(cb) {
		this.mouseoverEvent.add(cb)
		return this
	}
	/**
	 * 添加移出时触发事件
	 * @param time
	 */
	addMouseoutCallback(cb) {
		this.mouseoutEvent.add(cb)
		return this
	}
	/**
	 * 添加全局移出时触发事件
	 * @param time
	 */
	addGlobaloutCallback(cb) {
		this.globaloutEvent.add(cb)
		return this
	}
	/**
	 * 执行鼠标移入的回调
	 */
	executeMouseoverEvent(obj) {
		for (const callback of this.mouseoverEvent) {
			callback && callback(obj)
		}
	}
	executeMouseoutEvent() {
		for (const callback of this.mouseoutEvent) {
			callback && callback()
		}
	}
	executeGlobaloutEvent() {
		for (const callback of this.globaloutEvent) {
			callback && callback()
		}
	}
}
