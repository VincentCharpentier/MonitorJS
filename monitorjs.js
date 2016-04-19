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
				// total time
				tt: 0,
				// call count
				cc: 0,
				// timer queue
				queue: [],
				// next timer id
				// Note: start at 1 to avoid identifier.id == false
				nextId: 1
			};
		}
		var id = data[name].nextId++;
		data[name].queue.push({
			id: id,
			ct: performance.now()
		});
		return {
			name: name,
			id: id
		};
	};
	// Stop a record
	Monitor.Stop = function(input) {
		var stoppedAt = performance.now();
		var typeInput = typeof input;
		if (typeInput === "undefined") {
			try {
				// if no name, try to retrieve caller
				// may be impossible in strict mode
				input = arguments.callee.caller.name.toString();
			}
			catch(e) {
				throw "Monitor.Stop : You must provide a referring name as first argument";
			}
		}
		var record = null, name;
		// if only name given
		if (typeInput === "string") {
			name = input;
			if (!data[name] || data[name].queue.length === 0) {
				throw "Called Monitor.Stop before Monitor.Start"
			}
			record = data[name].queue.shift();
		}
		// if record identifier given
		else if (typeInput === "object") {
			if (!input.name || !input.id) {
				throw "Monitor.Stop: input should be a string or an object returned by Monitor.Start";
			}
			name = input.name;
			if (!data[name] || data[name].queue.length === 0) {
				throw "Called Monitor.Stop before Monitor.Start"
			}
			for (var i = 0; i < data[name].queue.length; i++) {
				if (data[name].queue[i].id === input.id) {
					// return & remove from queue
					record = data[name].queue.splice(i,1)[0];
					break;
				}
			}
			if (record === null) {
				throw "Monitor.Stop: Unable to find record with provided identifier";
			}
		}
		data[name].tt += stoppedAt - record.ct;
		data[name].cc++;
	}
	// Cancel a record
	Monitor.Cancel = function(input) {
		var typeInput = typeof input;
		if (typeInput === "undefined") {
			try {
				// if no name, try to retrieve caller
				// may be impossible in strict mode
				input = arguments.callee.caller.name.toString();
			}
			catch(e) {
				throw "Monitor.Cancel : You must provide a referring name as first argument";
			}
		}
		// if only name given
		if (typeInput === "string") {
			if (!data[input] || data[input].queue.length === 0) {
				throw "Called Monitor.Cancel before Monitor.Start"
			}
			data[input].queue.shift();
		}
		// if record identifier given
		else if (typeInput === "object") {
			if (!input.name || !input.id) {
				throw "Monitor.Cancel: input should be a string or an object returned by Monitor.Start";
			}
			if (!data[input.name] || data[input].queue.length === 0) {
				throw "Called Monitor.Cancel before Monitor.Start"
			}
			var record = null;
			for (var i = 0; i < data[input.name].queue.length; i++) {
				if (data[input.name].queue[i].id === input.id) {
					// return & remove from queue
					record = data[input.name].queue.splice(i,1)[0];
					break;
				}
			}
			if (record === null) {
				throw "Monitor.Cancel: Unable to find record with provided identifier";
			}
		}
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
	// Delete a record
	Monitor.Clear = function(name) {
		// for this function user must specify what is wants
		if (typeof name === "undefined") {
			throw "Monitor.Clear: You must specify the record reference";
		}
		if (!data[name]) {
			console.error('Monitor: no records for "' + name + '"');
			return null;
		}
		delete data[name];
	}
	// Clear all logged informations
	Monitor.ClearAll = function() {
		data = {};
	}
	return Monitor;
}());