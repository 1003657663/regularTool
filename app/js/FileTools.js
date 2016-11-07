/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
var fs = require("fs");
var config = require('./config').config;
exports.getAllFiles = function (path, callback) {
	if (path.indexOf('.') != -1) {
		callback(undefined,path);
		return;
	}
	var dirs = [];
	function explorer(path) {
		fs.readdir(path, function (err, files) {
			if (err) {
				console.log(err);
				return;
			}
			files.forEach(function (file, index) {
				if (file[0] == '.' || file[0] == '$') {
					return;
				}
				if (path[path.length - 1] == '/') {
					path = path.substring(0, path.length - 1);
				}
				try {
					fs.stat(path + '/' + file, function (err, stat) {
						if (stat.isDirectory()) {
							if(config.filterDir.indexOf(file)!=-1){
								return;
							}
							explorer(path + '/' + file);
						} else {
							if(config.filterFile.indexOf(file)!=-1){
								return;
							}
							callback(err, path + '/' + file);
						}
					});
				} catch (e) {
					console.log(e);
				}
			});

		});
	}

	if (!path) {
		path = "./";
	}
	explorer(path);
};

exports.readFile = function (path, callback, encoding) {
	if (!encoding) {
		encoding = "utf-8";
	}
	try {
		var file = fs.readFileSync(path, encoding);
		return file;
	} catch (e) {
		return "";
	}
};

exports.hasFile = function (path) {
	if(fs.statSync(path).isFile()){
		return true;
	}
	return false;
};