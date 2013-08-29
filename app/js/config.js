(function (undefined) {
	var config = {
		env: 'dev',
		appId: '495150223908678',
		channelURL: '//klarthdev.org:8082/fbChannel.html', //todo change that
		serverUrl: "//localhost:8080"
	};
	// check for nodeJS
	var hasModule = (typeof module !== 'undefined' && module.exports);

	// CommonJS module is defined
	if (hasModule) {
		module.exports = config;
	}
	/*global ender:false */
	if (typeof ender === 'undefined') {
		// here, `this` means `window` in the browser, or `global` on the server
		// add `moment` as a global object via a string identifier,
		// for Closure Compiler "advanced" mode
		this['config'] = config;
	}
	/*global define:false */
	if (typeof define === "function" && define.amd) {
		define("config", [], function () {
			return config;
		});
	}
}).call(this);
