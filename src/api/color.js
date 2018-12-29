const colorf =[
    '#FFFFFF',
    '#FFB7DD',
    '#FFCCCC',
    '#FFC8B4',
    '#FFDDAA',
    '#FFEE99',
    '#FFFFBB',
    '#EEFFBB',
    '#CCFF99',
    '#99FF99',
    '#BBFFEE',
    '#AAFFEE',
    '#99FFFF',
    '#CCEEFF',
    '#CCDDFF',
    '#CCCCFF',
    '#CCBBFF',
    '#D1BBFF',
    '#E8CCFF',
    '#F0BBFF',
    '#FFB3FF'
]
const colord = [
    '#DDDDDD',
    '#FF88C2',
    '#FF8888',
    '#FFA488',
    '#FFBB66',
    '#FFDD55',
    '#FFFF77',
    '#DDFF77',
    '#BBFF66',
    '#66FF66',
    '#77FFCC',
    '#77FFEE',
    '#66FFFF',
    '#77DDFF',
    '#99BBFF',
    '#9999FF',
    '#9F88FF',
    '#B088FF',
    '#D28EFF',
    '#E38EFF',
    '#FF77FF'    
]

const colora = [
    '#AAAAAA',
    '#FF44AA',
    '#FF3333',
    '#FF7744',
    '#FFAA33',
    '#FFCC22',
    '#FFFF33',
    '#CCFF33',
    '#99FF33',
    '#33FF33',
    '#33FFAA',
    '#33FFDD',
    '#33FFFF',
    '#33CCFF',
    '#5599FF',
    '#5555FF',
    '#7744FF',
    '#9955FF',
    '#B94FFF',
    '#E93EFF',
    '#FF3EFF'    
]

const color8 = [
    '#888888',
    '#FF0088',
    '#FF0000',
    '#FF5511',
    '#FF8800',
    '#FFBB00',
    '#FFFF00',
    '#BBFF00',
    '#77FF00',
    '#00FF00',
    '#00FF99',
    '#00FFCC',
    '#00FFFF',
    '#00BBFF',
    '#0066FF',
    '#0000FF',
    '#5500FF',
    '#7700FF',
    '#9900FF',
    '#CC00FF',
    '#FF00FF'    
]

const color6 = [
    '#666666',
    '#C10066',
    '#CC0000',
    '#E63F00',
    '#EE7700',
    '#DDAA00',
    '#EEEE00',
    '#99DD00',
    '#66DD00',
    '#00DD00',
    '#00DD77',
    '#00DDAA',
    '#00DDDD',
    '#009FCC',
    '#0044BB',
    '#0000CC',
    '#4400CC',
    '#5500DD',
    '#7700BB',
    '#A500CC',
    '#CC00CC'    
]

const color4 = [
    '#444444',
    '#A20055',
    '#AA0000',
    '#C63300',
    '#CC6600',
    '#AA7700',
    '#BBBB00',
    '#88AA00',
    '#55AA00',
    '#00AA00',
    '#00AA55',
    '#00AA88',
    '#00AAAA',
    '#0088A8',
    '#003C9D',
    '#0000AA',
    '#2200AA',
    '#4400B3',
    '#66009D',
    '#7A0099',
    '#990099'    
]

const color0 = [
    '#000000',
    '#8C0044',
    '#880000',
    '#A42D00',
    '#BB5500',
    '#886600',
    '#888800',
    '#668800',
    '#227700',
    '#008800',
    '#008844',
    '#008866',
    '#008888',
    '#007799',
    '#003377',
    '#000088',
    '#220088',
    '#3A0088',
    '#550088',
    '#660077',
    '#770077'    
]

// 所有的颜色 , 共 7*21 = 147种 
const colorall = [].concat(colorf, colord, colora, color8, color6, color4, color0)
const colorlist = [colorf, colord, colora, color8, color6, color4, color0]

// 获取一个颜色 
// type取值为 0,4,6,8,a,d,f, 不输入取值为all  
function getColorByIndex(index, type="") {
    if (type == "") {
        type = "all"
    }
    var tmp = "color" + type;
    var cs = eval(tmp)
    return cs[(index + cs.length) % cs.length];
}

// 获取一个随机颜色  
function getColorByRandom() {

}

// 获取一个随机颜色 ; 
// type取值为 0,4,6,8,a,d,f, 不输入取值为all  
// header: 表示是否使用每组颜色的首个值,#00000 ~ #fffff等 ,默认不使用; 
function getColorRandom(type="", header=false) {
    if (header) {
        // 使用header颜色时  
        let i = Math.floor(Math.random() * 150);
        return getColorByIndex(i, type);
    }
    // 不使用header的情况  
    let listindex = Math.floor(Math.random() * 10) % 7;
    let cindex = Math.floor(Math.random() * 30) % 20 + 1;
    if (type && type != "") {
        let colors = eval("color" + type);
        return colors[cindex]
    }
    let colors = colorlist[listindex]
    return colors[cindex]
}

export {
    getColorRandom
}