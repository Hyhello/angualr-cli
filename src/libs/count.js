/**
 * 作者：yeshengqiang
 * 时间：2019-03-12
 * 描述：count
 */

import './requestAnimationFrame.js';

export default class Count {
    constructor (startVal, endVal, duration, callback) {
        const ensureNumber = this.constructor.ensureNumber;
        startVal = Number(startVal);
        endVal = Number(endVal);
        duration = Number(duration);
        callback = callback || function () {};
        if (!ensureNumber(startVal) ||
            !ensureNumber(endVal) ||
            !ensureNumber(duration)
        ) {
            console.error(`[Count] startVal (${startVal}) or endVal (${endVal}) or duration (${duration}) is not a number`);
            return;
        }
        this.timer = null;
        this.isStart = false;
        this.isPause = false;
        this.originStartVal = this.startVal = startVal;
        this.endVal = endVal;
        this.originDuration = this.duration = duration || 3000;
        this.callback = callback;
        this.countDown = this.startVal > this.endVal;
    }
    static v = '0.0.1';
    static ensureNumber (val) {
        return !isNaN(val) && typeof val === 'number';
    };
    static easeOutExpo (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    count (timestamp) {
        var
            // 时间进度
            progress,
            // 值
            val;
        if (!this.startTime) {
            this.startTime = timestamp;
        };
        progress = timestamp - this.startTime;
        this.remaining = Math.max(this.duration - progress, 0);
        val = this.countDown
                        ? this.startVal - this.constructor.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration)
                        : this.constructor.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
        this.frameVal = this.countDown
                                ? Math.max(val, this.endVal)
                                : Math.min(val, this.endVal);
        if (progress < this.duration) {
            this.timer = window.requestAnimationFrame(this.count.bind(this));
        } else {
            this.isStart = false;
        }
        this.frameVal = this.isStart ? this.frameVal : this.endVal;
        this.callback(this.frameVal, this.originDuration - this.remaining, !this.isStart);
    };
    start () {
        if (this.isStart) return;
        if (this.endVal === this.frameVal) return;
        this.isStart = true;
        this.timer = window.requestAnimationFrame(this.count.bind(this));
    };
    updateDuration (duration) {
        duration = Number(duration);
        if (!this.constructor.ensureNumber(duration)) {
            console.error('[CountUp] updateDuration() - new duration is not a number: ' + duration);
            return;
        }
        this.originDuration = this.duration = duration;
    };
    update (newEndVal) {
        newEndVal = Number(newEndVal);
        if (!this.constructor.ensureNumber(newEndVal)) {
            console.error('[CountUp] update() - new endVal is not a number: ' + newEndVal);
            return;
        }
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
            this.timer = null;
            this.isStart = false;
        }
        if (newEndVal === this.frameVal) return;
        delete this.startTime;
        this.endVal = newEndVal;
        this.startVal = this.frameVal || this.originStartVal;
        this.duration = this.remaining || this.originDuration;
        this.countDown = this.startVal > this.endVal;
        this.start();
    };
    pause () {
        if (!this.isStart || this.isPause) return;
        this.isPause = true;
        if (this.timer) {
            window.cancelAnimationFrame(this.timer);
            this.timer = null;
        }
        delete this.startTime;
    };
    resume () {
        if (!this.isStart || !this.isPause) return;
        this.isPause = false;
        this.startVal = this.frameVal;
        this.duration = this.remaining;
        this.timer = window.requestAnimationFrame(this.count.bind(this));
    };
    reset () {
        this.timer = null;
        this.isStart = false;
        this.isPause = false;
        delete this.frameVal;
        delete this.remaining;
        delete this.startTime;
        this.duration = this.originDuration;
        this.countDown = this.startVal > this.endVal;
    }
};
