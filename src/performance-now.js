/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory();
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	}
}(this, function(h){
    if(performance && performance.now){
        return performance.now()
    } else if(process && process.hrtime){
        var hrtime = process.hrtime;
        function getNanoSeconds(){
            var hr = hrtime();
            hr[0] * 1e9 + hr[1]
        }
        var loadTime = getNanoSeconds()
        return (getNanoSeconds() - loadTime) / 1e6
    } else if(Date.now){
        var loadTime = Date.now();
        return Date.now() - loadTime
    } else {
        var loadTime = new Date().getTime()
        return new Date().getTime() - loadTime
    }
}));
