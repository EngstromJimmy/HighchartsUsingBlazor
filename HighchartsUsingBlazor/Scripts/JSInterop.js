window.loadHighchart = loadHighchart;

function loadHighchart(id, json) {
    loadScript("https://code.highcharts.com/highcharts.js")
        .then(() => {
            waitForGlobal("Highcharts", function () {
                var obj = looseJsonParse(json);
                Highcharts.chart(id, obj);
            });
        }, () => {
            // error loading file
        });
};

var waitForGlobal = function (key, callback) {
    if (window[key]) {
        callback();
    } else {
        setTimeout(function () {
            waitForGlobal(key, callback);
        }, 100);
    }
};

function looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')();
}

function loadStockchart(id, json) {
    loadScript("https://code.highcharts.com/stock/highstock.js")
        .then(() => {
            loadScript("https://code.highcharts.com/stock/modules/data.js")
                .then(() => {
                    waitForGlobal("Highcharts", function () {
                        var obj = looseJsonParse(json);
                        Highcharts.stockChart(id, obj);
                        SetLanguage();
                    });
                }, () => {
                    // error loading file
                });

        }, () => {
            // error loading file
        });
}


function loadScript(url) {
    return new Promise(function (resolve, reject) {
        var isFound = false;
        var scripts = document.getElementsByTagName("script")
        for (var i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src') == url) {
                isFound = true;
                resolve();
            }
        }

        if (!isFound) {
            var dynamicScripts = [url];
            for (var i = 0; i < dynamicScripts.length; i++) {
                let node = document.createElement('script');
                node.src = dynamicScripts[i];
                node.type = 'text/javascript';
                node.onload = resolve;
                node.onerror = reject;
                node.async = false;
                node.charset = 'utf-8';
                document.getElementsByTagName('head')[0].appendChild(node);
            }
        }
    });
}