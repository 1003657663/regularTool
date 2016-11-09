/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
var fs = require("fs");
exports.getAllFiles = function (path,setting, callback) {
	if (path.indexOf('.') != -1) {
		callback(undefined, path);
		return;
	}
	var dirs = [];
	function explorer(path) {
		fs.readdir(path, function (err, files) {
			if (err) {
                callback(err,path);
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
							if (setting.filterName.indexOf(file) != -1) {
								return;
							}
							explorer(path + '/' + file);
						} else {
							if (setting.filterName.indexOf(file) != -1) {
								return;
							}
							callback(err, path + '/' + file);
						}
					});
				} catch (e) {
					callback(e,path);
				}
			});

		});
	}

	if (!path) {
		return false;
	}
	explorer(path);
};

exports.readFile = function (path, callback, encoding) {
	if (!encoding) {
		encoding = "utf-8";
	}
	var file = fs.readFile(path, encoding, callback);
};

exports.hasFile = function (path) {
	if (fs.statSync(path).isFile()) {
		return true;
	}
	return false;
};