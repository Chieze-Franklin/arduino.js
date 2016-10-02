'use strict';

var board = require("board");

var __low = 0;
var __high = 5;

var __pinConditions = new Map();

var __analogWrite = function(pin, value){
	value = __map(value, 0, 255, __low, __high);
	board.write(pin, value);
}
var __map = function(value, fromlow, fromhigh, tolow, tohigh){
	var DF = fromhigh - fromlow;
	var DT = tohigh - tolow;
	var newVal = ((DT / DF) * (value - fromlow)) + tolow;
	return newVal;
}

var __tone = function(pin, frequency, duration){
	var timeDelayInMilliseconds = 1000.0 / (2.0 * frequency);

	__pinConditions.set(pin, true);

	var part1 = function(){
		board.write(pin, __high);
		if(__pinConditions.get(pin))
			board.pause(timeDelayInMilliseconds, part2);
	}

	var part2 = function(){
		board.write(pin, __low);
		if(__pinConditions.get(pin))
			board.pause(timeDelayInMilliseconds, part1);
	}	

	if(duration != undefined && duration != null){
		setTimeout(function(){ __pinConditions.set(pin, false); }, duration);
	}
	
	part1();
}

module.exports = {
	INPUT: board.IN,
	OUTPUT: board.OUT,

	HIGH: __high,
	LOW: __low,

	D0: board.P0,
	D1: board.P1,
	D2: board.P2,
	D3: board.P3,
	D4: board.P4,
	D5: board.P5,
	D6: board.P6,
	D7: board.P7,
	D8: board.P8,
	D9: board.P9,
	D10: board.P10,
	D11: board.P11,
	D12: board.P12,
	D13: board.P13,
	A0: board.P14,
	A1: board.P15,
	A2: board.P16,
	A3: board.P17,
	A4: board.P18,
	A5: board.P19,

	analogWrite : __analogWrite,
	constrain: function(value, min, max){
		if(value > max){
			value = max;
		}
		if(value < min){
			value = min;
		}
		return value;
	},
	delay : function(ms, callback){
		board.pause(ms, callback);
	},
	delayMicroseconds : function(microseconds, callback){
		board.pause(microseconds / 1000, callback);
	},
	delaySync : function(milliseconds){
		board.pauseSync(milliseconds);
	},
	delayMicrosecondsSync : function(microseconds){
		board.pauseSync(microseconds / 1000);
	},
	digitalRead : function(pin){
		return board.read(pin);
	},
	digitalWrite : function(pin, value){
		if(value == this.HIGH || value == this.LOW){
			board.write(pin, value);
		}  
		else{
			//TODO: what do I do??
		}
	},
	map : __map,
	noTone: function(pin){
		__pinConditions.set(pin, false);
	},
	millis: function(){
		return board.upTime() * 1000;
	},
	pinMode : function(pin, mode){
		board.setPinMode(pin, mode);
	},
	tone: __tone,

	Serial: {
		begin: function(baud){
			//baud is how many bits per second are transmitted
		},
		print: function(message){
			console.log(message);
		},
		println: function(message){
			//console.log(message + '\n');
			this.print(message + '\n');
		}
	}
};