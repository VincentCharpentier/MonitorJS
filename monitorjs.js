var Monitor = (function(){
	var Monitor = {};
	var data = {};
	// Start a record
	Monitor.Start = function(name) {
		if (typeof name === "undefined") {
			try {
				// if no name, try to retrieve caller
				// may be impossible in strict mode
				name = arguments.callee.caller.name.toString();
			}
			catch(e) {
				throw "Monitor.Start : You must provide a referring name as first argument";
			}
		}
		if (!data[name]) {
			data[name] = {
				// current timer
				ct: null,
				// total time
				tt: 0,
				// call count
				cc: 0
			};
		}
		data[name].ct = performance.now();
	};
	// Stop a record
	Monitor.Stop = function(name) {
		var stoppedAt = performance.now();
		if (typeof name === "undefined") {
			try {
				// if no name, try to retrieve caller
				// may be impossible in strict mode
				name = arguments.callee.caller.name.toString();
			}
			catch(e) {
				throw "Monitor.Stop : You must provide a referring name as first argument";
			}
		}
		if (!data[name]) {
			throw "Called Monitor.Stop before Monitor.Start"
		}
		data[name].tt += stoppedAt - data[name].ct;
		data[name].ct = null;
		data[name].cc++;
	}
	// Cancel a record
	Monitor.Cancel = function(name) {
		if (typeof name === "undefined") {
			try {
				// if no name, try to retrieve caller
				// may be impossible in strict mode
				name = arguments.callee.caller.name.toString();
			}
			catch(e) {
				throw "Monitor.Stop : You must provide a referring name as first argument";
			}
		}
		if (!data[name]) {
			throw "Called Monitor.Cancel before Monitor.Start"
		}
		data[name].ct = null;
	}
	// Get a record
	Monitor.Get = function(name) {
		// for this function user must specify what is wants
		if (typeof name === "undefined") {
			throw "Monitor.Get: You must specify the record reference";
		}
		if (!data[name]) {
			console.error('Monitor: no records for "' + name + '"');
			return null;
		}
		return {
			name: name,
			total_time: data[name].tt,
			call_count: data[name].cc
		};
	}
	// Get a record
	Monitor.GetAll = function() {
		var results = new Array();
		for (var i in data) {
			results.push({
				name: i,
				total_time: data[i].tt,
				call_count: data[i].cc
			});
		}
		return results;
	}
	// Clear all logged informations
	Monitor.Clear = function() {
		data = {};
	}
	// for debug
	Monitor.Debug = function() {
		console.log(data);
	}
	return Monitor;
}());