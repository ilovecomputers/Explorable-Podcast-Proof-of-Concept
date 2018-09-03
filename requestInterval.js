/**
/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function (fn, delay) {
	let start = new Date().getTime(),
		handle = {};

	function loop(currentTime) {
		handle.value = requestAnimationFrame(loop);
		const current = new Date().getTime(),
			delta = current - start;

		if (delta >= delay) {
			fn(currentTime);
			start = new Date().getTime();
		}
	}

	handle.value = requestAnimationFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function (handle) {
	window.cancelAnimationFrame(handle.value);
};