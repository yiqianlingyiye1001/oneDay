/**
 * 处理歌词
 * 首先获取歌词
 * 解析歌词格式
 * 分离歌词以及各个歌词出现的时间点
 * 从audio中获取对应时间，给单句歌词li加上.actvie，然后进行滚动，注意滚动的特殊位置，起始，结束等
 * 每个歌词对象
 * {time:开始时间，words：歌词内容}
 * 
 */

/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间, words: 歌词内容}
 */

function parseLrc() {
    var lines = lrc.split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            // time: timeStr,
            words: parts[1],
        }
        result.push(obj);
    }
    return result;
}
/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeStr
 * @returns 
 */

function parseTime(timeStr) {
    var parts = timeStr.split(':')
    return +parts[0] * 60 + +parts[1]
}


var lrcData = parseLrc();


var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}

/**
 * 找到播放器播放时间所对应的高亮歌词在数组中的下表
 * 如果歌词无需提示则返回-1
 */

function findIndex() {
    var curTime = doms.audio.currentTime;
    for (var i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }
    return lrcData.length - 1;
}

/**
 * 创建歌词元素li
 */
function createUI() {
    var frag = document.createDocumentFragment(); //文档切片
    for (var i = 0; i < lrcData.length; i++) {
        var li = document.createElement("li");
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createUI();

var containerHeight = doms.container.clientHeight;

var liHeight = doms.ul.children[0].clientHeight;

var maxOffset = doms.ul.clientHeight - containerHeight / 2;

function changeStyle() {
    var index = findIndex();

    // scroll
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;

    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }



    doms.ul.style.transform = `translateY(-${offset}px)`;

    console.log("样式检测")

    var activeLi = doms.ul.querySelector('.active');
    if (activeLi) {
        activeLi.classList.remove('active');
    }
    var li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', changeStyle);
