/**
 * Created by w1003 on 2016/11/6.
 */
module.exports = {
    Error: {
        RegError: 0,
        NoMatchError: 1,
    },
    testReg: function (aimText, regText) {
        var spli = regText.match(/\/(.*)\/(.*)/);
        //error,不可以使用正则表达式匹配，会出错
        if (spli) {
            var reg;
            try {
                reg = new RegExp(spli[1], spli[2]);
            } catch (e) {
                if (e.message.indexOf('Unterminated group') == -1) {
                    return this.Error.RegError;
                }
            }
        } else {
            var reg;
            try {
                reg = new RegExp(regText, "mg");
            } catch (e) {
                if (e.message.indexOf('Unterminated group') == -1) {
                    return this.Error.RegError;
                }
            }
        }
        if (reg) {
            var result = reg.exec(aimText);
        }
        if (result) {
            return result;
        } else {
            return this.Error.NoMatchError;
        }
    },
    replace: function () {

    }
};
