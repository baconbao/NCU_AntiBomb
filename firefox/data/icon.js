'use strict';

self.port.on('render', function (data) {

	var t_end = data.toString().indexOf(' GB');
	var t_start = data.toString().lastIndexOf('(', t_end);
	var needText = data.toString().substring(t_start+1, t_end);
	needText = parseFloat(needText);

	self.port.emit('fetched-count', needText);
});
