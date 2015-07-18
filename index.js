'use strict';

var csv = require('csv-parser');
var iconv = require('iconv-lite');
var xlsx = require('node-xlsx');
var fs = require('fs');

var FILE_NAME = 'test.csv';
var OUTPUT_FILE_NAME = 'out.xlsx';
var converterStream = iconv.decodeStream('gbk');
var readStream = fs.createReadStream(FILE_NAME).pipe(converterStream).pipe(csv());
var header = null;

var buffer = [];
readStream.on('data', function(data){
	if( !header ){
		header = Object.keys(data);
		buffer.push(header);
	}
	var dataArray = [];
	for( var o in data ){
		dataArray.push(data[o]);
	}
	buffer.push(dataArray);
});

readStream.on('end', function(){
	console.log('converting...');
	buffer = xlsx.build([{name:"sheet1", data: buffer}]);
	fs.writeFileSync(OUTPUT_FILE_NAME, buffer);
	console.log('convert succeed.');
});
