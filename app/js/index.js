/**
 * Created by chao on 2016/3/19.
 */
window.onload = function () {
    initRegTest();
}

function initRegTest() {
    var aimTextElement = document.getElementById("aim_text");
    var regTextElement = document.getElementById("reg_text");

    var aimText = "", regText = "";

    aimTextElement.addEventListener("keyup", function () {
        aimText = aimTextElement.value;
        startTest(aimText, regText);
    });
    regTextElement.addEventListener("keyup", function () {
        regText = regTextElement.value;
        startTest(aimText, regText);
    });
}

function startTest(aimText, regText) {
    var spli = regText.match(/\/(.*)\/(.*)/);
    if (spli) {
        var reg;
        try {
            reg = new RegExp(spli[1], spli[2]);
        } catch (e) {
            if (e.message.indexOf('Unterminated group') == -1) {
                console.log(e);
            }
        }
    } else {
        if (regText.indexOf('/') == -1) {
            var reg;
            try {
                reg = new RegExp(regText);
            } catch (e) {
                if (e.message.indexOf('Unterminated group') == -1) {
                    console.log(e);
                }
            }
        }
    }
    if (reg) {
        var result = reg.exec(aimText);
    }
    showResult(result);
}

function showResult(result) {
    var allResultTextElement = document.getElementById("all_result_text");
    var resultGroupElement = document.getElementById("result_group");
    var dF = document.createDocumentFragment();
    if (result) {
        allResultTextElement.innerText = result[0];
        for (var i = 1; i < result.length; i++) {
            var div = document.createElement("div");
            div.className = "result_group_addon";
            var span = document.createElement("span");
            var h6 = document.createElement("h6");
            h6.innerHTML = i;
            span.appendChild(h6);
            var pre = document.createElement("pre");
            pre.innerText = result[i];
            div.appendChild(span);
            div.appendChild(pre);

            dF.appendChild(div);
        }
        resultGroupElement.innerHTML = "";
        resultGroupElement.appendChild(dF);
    } else {
        allResultTextElement.innerHTML = "匹配不到";
        resultGroupElement.innerHTML = "";
    }
}