var timestamp = 0;

function time100() {
    time100.cb = function(t, r) {
        alert("На сервере" + new Date(t) + " На компью " + new Date(r))
        timestamp = t;

    };
};
time100();
i = document.createElement("script")
i.setAttribute("src", "//time100.ru/api.php?type=cb&t=" + new Date().getTime())
j = document.getElementsByTagName("head").item(0)
j.appendChild(i)

window.onload = function() {
    var timestart = performance.now();

    // начать повторы с интервалом 1 сек
    var timerId = setInterval(function() {
        var x = (performance.now() - timestart) | 0;
        document.getElementById('timestamp').innerHTML = "гринвич " + new Date(timestamp + x).toUTCString() + "<br>местное " + new Date(timestamp + x) + "<br>на компе " + new Date();
    }, 673); //значение интервала не важно, лучше меньше 1000
}