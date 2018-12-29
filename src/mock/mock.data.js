import Mock from 'mockjs'

import {getColorRandom} from "../api/color"

let data = {
  users: [],
  types: [],
  posts: [],
  comments: [],
  notebooks : [],
  pagedata : {}
}
// 生成pagedata 页数据  
data.pagedata = genpagedata()

function genpagedata() {
    return Mock.mock({
        title : "@ctitle(5, 10)",
        author : '@cname',
        pagetype : 'md',
        url : '',
        created_at: '@datetime',
        updated_at: '@datetime',
        tags : ['@word(1,3)','@word(1,3)','@word(1,3)','@cword(1,3)','@cword(1,3)','@cword(1,3)'],
        content : '@cparagraph(5,10)'
    });
}

// 生成笔记薄列表
for (let i = 1; i <5; i++) {
    let book = genadata(i);
    book.tablist = []
    data.notebooks.push(book);

    if (i == 3) {
        book.active = true;
    }

    // 添加tabs  
    for (let j = 1 ; j <=20 ; j++) {
        let tab = genadata(j);
        tab.pagelist=[]
        book.tablist.push(tab);

        if (j == 6) {
            tab.active = true;
        }

        // 添加pages 
        for (let k=1 ; k < 20 ; k++) {
            let page = genadata(k)
            tab.pagelist.push(page)
            if (k == 10) {
                page.active = true;
            }
        }
    }

}

function genadata(i) {
    return Mock.mock({
        id :  i,
        name : '@first',
        uri : '@guid',
        color : getColorRandom(),
        active: false
    })
}

for (let i = 1; i <= 30; i++) {
  data.users.push(Mock.mock({
    id: i,
    username: '@first',
    password: '123456',
    avatar: '@image',
    nickname: '@name',
    // avatar: Mock.Random.image(),
    created_at: '@datetime',
    updated_at: '@datetime',
    deleted_at: null
  }))
}

export default data