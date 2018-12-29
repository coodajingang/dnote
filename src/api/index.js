// 提供api接口 , 使用axios 来获取数据  
import http from "@/axios" 
import {getColorRandom} from "./color"

// 获取笔记薄列表 
export function getNoteBookList() {
    return http.get("/notebooklist")
}

// 获取笔记页数据  
export function getPageContent(bookid, tabid, pageid) {
    return http.get('/pagedata', {
        params: {
            bookid : bookid,
            tabid : tabid,
            pageid : pageid
        }
    })
}

// guid 生成算法  
export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

// 新增book 
export function newBook(name, color, tablist) {
    return {
        id :  8, // id没有使用 , 目前暂不考虑按顺序增加 
        name : name, 
        uri : uuid(18),
        color : getColorRandom(),
        active: false,
        tablist : []
    }
}
// 新增tab 
export function newTab(name) {
    return {
        id :  18, // id没有使用 , 目前暂不考虑按顺序增加 
        name : name, 
        uri : uuid(18),
        color : getColorRandom(),
        active: false,
        pagelist : []
      }
}
// 新增page  
export function newPage(name, color) {
    return {
        id :  28, // id没有使用 , 目前暂不考虑按顺序增加 
        name : name, 
        uri : uuid(18),
        color : getColorRandom(),
        active: false
    }
}
