import Vue from 'vue'
import Vuex from 'vuex'
import {newBook, newTab, newPage} from '../api'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bookList : [], // 笔记薄列表 
    currentBook : null,  // 当前激活的笔记薄 
    lastBook: null,  // 上一激活的笔记薄
    currentTab : null, 
    lastTab : null,
    currentPage : null,
    lastPage : null, 
    activeTabList : [],  // 当前激活的tab列表 
    activePageList : [],  // 当前激活page列表 
    log : "",
    activeTabIndex : 0,
  },
  getters: {
    // 获取当前的笔记薄列表  
    getBookList : state => {
        return state.bookList;
    },
    // 获取当前的tab列表 
    getTabList : state => {
      return state.activeTabList
    },
    // 获取当前的page列表 
    getPageList : state => {
      return state.activePageList
    }, 
    // 获取当前激活的tab  
    getCurrentTab : state  => {
      return state.currentTab
    },
    // 获取当前激活的tab  
    getCurrentBook : state  => {
      return state.currentBook
    },
    // 获取当前激活的page 
    getCurrentPage : state => {
      return state.currentPage
    },
    getLog : state => {
      return state.log
    },
    getActiveTabIndex : state => {
      return state.activeTabList.indexOf(state.currentTab)
    },
  },
  mutations: {
    // 设置笔记博列表 
    setBookList (state, data) {
        state.bookList = data
        let book = state.bookList.filter(b => {return b.active})
        if (book.length > 0) {
          state.currentBook = book[0]
          state.activeTabList = state.currentBook.tablist

          // 获取激活的tab 
          let tab = state.activeTabList.filter(t => {return t.active})
          if (tab.length > 0) {
            state.currentTab = tab[0]
            state.activePageList = state.currentTab.pagelist

            // 获取激活的page 
            let page = state.activePageList.filter(p => {return p.active}) 
            if (page.length > 0) {
              state.currentPage =page[0]
            }
          }
        }
    },
    // 新增笔记薄  
    addNewBook(state, book) {
      state.bookList.push(book);
    },
    // 更改笔记薄列表  
    changeActiveBook(state, item) {
      // 原活动的book置非活动
      if (state.currentBook) {
        state.lastBook = state.currentBook
        state.lastBook.active = false
      }
      state.currentBook = item
      item.active = true
      state.activeTabList = item.tablist
      // 获取激活的tab 
      let tab = state.activeTabList.filter(t => {return t.active})
      if (tab.length > 0) {
        state.currentTab = tab[0]
        state.activePageList = state.currentTab.pagelist

        // 获取激活的page 
        let page = state.activePageList.filter(p => {return p.active}) 
        if (page.length > 0) {
          state.currentPage =page[0]
        }
      } else {
        // 当没有tab时 当前tab为空 激活的pagelist为空 
        state.currentTab = null;
        state.activePageList = [];
        state.currentPage = null;
      }   
    },
    // 删除笔记薄book 
    deleteBook(state, book) {
      state.bookList.splice(state.bookList.indexOf(book), 1);
    },
    // 新增tab到列表  
    add2TabList(state, item) {
      state.activeTabList.push(item)
    },
    // 更新笔记tab列表 , pos1是当前的正常显示的列表位置 
    changeActiveTab(state, obj) {
      let item = obj.item
      let pos1 = obj.pos1
      //1. 获取当前的active tab  , 修改为false  
      if (state.currentTab) {
        state.currentTab.active = false
      }
      state.lastTab = state.currentTab
      state.currentTab = item
      //2. 将item的active 修改为 true
      state.currentTab.active = true
      //3. 修改激活page值 
      state.activePageList = state.currentTab.pagelist
      state.lastPage = state.currentPage
      let page = state.activePageList.find(p => {return p.active})
      if (page) {
        state.currentPage = page
      } else {
        state.currentPage = null;
      }
      //4. 处理显示位置 
      state.log = ""
      // pos1 = pos1 || 10
      let cindex = state.activeTabList.indexOf(item)
      if (cindex >= pos1) {
        state.log = "State changeActiveTab:" + cindex + " "  + pos1  + item.name + " " + state.activeTabList[pos1-1] + " " + state.activeTabList[cindex];
        [state.activeTabList[pos1-1],state.activeTabList[cindex]] = [state.activeTabList[cindex],state.activeTabList[pos1-1]]
      }
    },
    // 更新激活tab的顺序  
    changeActiveTabPos(state, obj) {
      // 交换pos1和pos2的位置  
      const pos1 = obj.pos1;
      const pos2 = obj.pos2;
      [state.activeTabList[pos1],state.activeTabList[pos2]] = [state.activeTabList[pos2],state.activeTabList[pos1]]
    },
    // 删除 tab 
    deleteTab(state, obj) {
      const item = obj.item;
      state.activeTabList.splice(state.activeTabList.indexOf(item), 1);
    },
    // 新增page 
    addNewPage(state, page) {
      state.activePageList.push(page);
    },
    // 更新page 
    changeActivePage(state, page) {
      if (state.currentPage === page) {
        return ;
      }
      state.lastPage = state.currentPage
      state.currentPage = page
      page.active = true
      if (state.lastPage) {
        state.lastPage.active = false;
      }
    },
    // 删除当前page 
    deletePage(state, page) {
      state.activePageList.splice(state.activePageList.indexOf(page), 1);
      if (state.currentPage == page) {
        state.currentPage = state.lastPage
        
        if (state.currentPage) {
          state.lastPage = null;
          state.currentPage.active = true;
        }
      } else if (state.lastPage == page){
        state.lastPage = null;
      }
    }
  },
  actions: {
    // 新增笔记tab , 
    addNewTab(context, obj) {
      let tab = newTab(obj.name)
      obj.item = tab
      context.commit('add2TabList', tab)
      context.commit('changeActiveTab', obj)
    },
    // 从more tab中switch 
    switchTabMore(context, obj)  {
      context.commit('changeActiveTab', obj)
    }, 
    // 新增笔记薄 
    addNewBook(context , name) {
      let book  = newBook(name)
      context.commit('addNewBook', book)
      context.commit('changeActiveBook', book)
    },
    // 新增笔记页page 
    addNewPage(context, name) {
      let page = newPage(name)
      context.commit('addNewPage', page);
      context.commit('changeActivePage', page);
    },
    // 删除 book 
    deleteBook({commit, state}, book) {
      commit('deleteBook', book);
      // 若删除的book是非激活的 ,可以不处理  
      // 若删除的book是当前激活的 , 则置之为null 并删除tablist pagelist  状态  
      if (state.currentBook == book) {
        state.currentBook = null;
        let b = state.lastBook
        state.lastBook = null;
        if (b) {
          commit('changeActiveBook', b)
        } else if (state.bookList && state.bookList[0]) {
          commit('changeActiveBook', state.bookList[0])
        } else {
          state.activeTabList = []
          state.activePageList = []
        }
      }
      // 若删除的book是上次激活的, 则置之为null 
      else if (state.lastBook == book) {
        state.lastBook = null;
      }
    },
    // 删除 tab 
    deleteTab({commit, state}, obj) {
      // 0. 删除之  
      const tab = obj.item
      commit('deleteTab', obj);
      if (state.currentTab === tab) {
        // 1. 删除的tab是当前的活动tab 
        state.currentTab =  null;
        let t = state.lastTab;
        state.lastTab = null;
        if (t && state.activeTabList.indexOf(t) > -1) {
          commit('changeActiveTab', {item: t, pos1 : obj.pos1})
        } else if(state.activeTabList && state.activeTabList[0]){
          commit('changeActiveTab', {item: state.activeTabList[0], pos1 : obj.pos1})
        } else {
          state.activePageList= []
        }
      } else if (state.lastTab === tab) {
        // 2. 删除的tab不是当前的活动tab
        state.lastTab = null;
      } else {
        // 3. 重新计算正常tab和moretab 
        commit('changeActiveTab', {item: state.activeTabList.find(t=>{return t.active}), pos1: obj.pos1})
      }
    }
  }
})
