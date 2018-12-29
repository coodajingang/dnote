<template>
  <v-app>
    <!-- pages的组件 -->
    <v-navigation-drawer
      fixed v-model="rightnavdrawer"  right clipped app
    >
      <note-pages></note-pages>
    </v-navigation-drawer>
    <v-toolbar color="cyan" dark fixed  app clipped-right dense tabs>
      <v-toolbar-side-icon @click.stop="navdrawer = !navdrawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">NoteBoot</router-link>
      </v-toolbar-title> -->
      <v-toolbar-title>{{currentBook ? currentBook.name : ""}}-{{currentTab ? currentTab.name:""}}-{{currentPage ? currentPage.name : ""}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field prepend-inner-icon="search" solo-inverted flat class="mx-3"></v-text-field>
      <v-toolbar-side-icon  @click.stop="rightnavdrawer = !rightnavdrawer"></v-toolbar-side-icon>
      <v-tabs slot="extension" v-model="moretabs" color="cyan" >
        <v-tab v-for="item in tablist" :key="item.uri" :href="`#tab-${item.uri}`"
          :class="item.active ? 'tab-default tab-active' : 'tab-default'"
          @click.stop="switchTab(item)" 
          
        >{{item.name}}<v-icon small class="ml-1 mr-0 mb-3 close-icon" @click.stop="deleteTab(item)">close</v-icon></v-tab>
        <v-menu v-if="moretablist && moretablist.length>0" bottom class="v-tabs__div">
          <a slot="activator" class="v-tabs__item">more
            <v-icon>arrow_drop_down</v-icon>
          </a>
          <v-list>
            <v-list-tile v-for="m in moretablist" :key="`mm${m.uri}`" @click="switchTab(m)">{{m.name}}</v-list-tile>
          </v-list>
        </v-menu>
        <v-tab @click="addNewTabDialog = true">
          <v-icon>add</v-icon>
        </v-tab>
          <v-dialog v-model="addNewTabDialog" max-width="290">
              <v-card>
                  <v-card-title class="headline">新建笔记薄Part</v-card-title>
                  <v-divider ></v-divider>
                  <v-card-text>
                      <v-text-field v-model="newTabName" label="请输入笔记薄Part名称" clearable
                        :rules="[rules.required, rules.newtab]"
                      ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click="addNewTabDialog=false">取消</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="confirmAddNewTab">新增</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
          <v-dialog v-model="delTabAlert" max-width="290">
              <v-card>
                  <v-card-title class="headline">确定要删该笔记分区?</v-card-title>
                  <v-divider ></v-divider>
                  <v-card-text>
                      {{delTab ? delTab.name : ""}}
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click="delTabAlert=false">取消</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="confirmDeleteTab()">删除</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </v-tabs>
    </v-toolbar>
    <!-- 笔记薄组件 -->
    <v-navigation-drawer v-model="navdrawer" fixed app>
      <note-books @closeBookNavDrawer="navdrawer = !navdrawer"></note-books>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import NoteBooks from "./components/NoteBooks"
import NotePages from "./components/NotePages"
import { getNoteBookList } from "@/api"
import { mapGetters } from 'vuex'

export default {
  name: "App",
  components: {NoteBooks, NotePages},
  data() {
    return {
      navdrawer: false,
      rightnavdrawer: true,
      addNewTabDialog : false, // 新增tab对话框 
      delTabAlert : false, // 删除tab对话框 
      delTab : null , // 待删除的tab 
      newTabName : "", // 新增的tab名称 
      model: "",
      moretabs: null,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      rules: {
        required : value => !!value || '必输',
        newtab : value => {
          return value.length > 0 || '不能为空!'
        },
        tablist : [],
        moretablist : []
      }
    };
  },
  methods: {
    // 确认新增tab对话框处理 
    confirmAddNewTab : function() {
      if (!this.newTabName || this.newTabName === "" ) {
        return ;
      }
      //let item = newTab(this.newTabName)
      this.$store.dispatch('addNewTab', {'name': this.newTabName, 'pos1': this.tabcount});
      this.addNewTabDialog=false;
      this.newTabName = ""
    },
    // 切换more中的tab到正常显示列  
    switchTab : function(item) {
      console.log("切换Tab: ", item, this.tabcount)
      this.moretabs = 'tab-' + item.uri
      this.$store.dispatch('switchTabMore', {'item': item, 'pos1': this.tabcount})
    }, 
    // 删除 tab 
    deleteTab :function (item) {
      console.log("delete tab: " , item.name);
      this.delTabAlert = true;
      this.delTab = item
    }, 
    // 确认删除 tab 
    confirmDeleteTab : function () {
      this.delTabAlert = false;
      this.$store.dispatch('deleteTab', {'item': this.delTab, 'pos1': this.tabcount})
      this.delTab = null;
    }
  },
  computed: {
    // 获取当前激活的tab列表  
    ...mapGetters({
      alltablist : 'getTabList', 
      currentTab : 'getCurrentTab',
      currentBook : 'getCurrentBook',
      currentPage : 'getCurrentPage',
      log: 'getLog',
      activeTabIndex : 'getActiveTabIndex'
    }),
    tabcount : function () {
      // 根据屏幕宽度  计算 保留的tab个数 
      let count = Math.floor( this.screenWidth / 100 ) - 1
      if (count < 1) {
        return 1;
      }
      return count;
    },
    tablist: function () {
      if (this.activeTabIndex >= this.tabcount) {
        [this.alltablist[this.tabcount -1], this.alltablist[this.activeTabIndex]] = [this.alltablist[this.activeTabIndex], this.alltablist[this.tabcount -1]];
      } 
      return this.alltablist.slice(0, this.tabcount)
    },
    moretablist : function() {
      if (this.activeTabIndex >= this.tabcount) {
        [this.alltablist[this.tabcount -1], this.alltablist[this.activeTabIndex]] = [this.alltablist[this.activeTabIndex], this.alltablist[this.tabcount -1]];
      } 
      return this.alltablist.slice(this.tabcount, 9999)
    }, 
    // debugtab : function () {
    //   if (this.activeTabIndex >= this.tabcount) {
    //     return "发生切换:" + this.activeTabIndex + " " + this.alltablist[this.activeTabIndex].name
    //   }
    //   return "未发生切换:" + this.activeTabIndex + " " + this.alltablist[this.activeTabIndex].name
    // },


  },
  watch : {
    currentTab : function (tab) {
      if (tab) {
        this.moretabs = 'tab-' + tab.uri
      } else {
        this.moretabs = ""
      }
      
    }, 
    // alltablist : function () { // 正常显示的tab列表 
    //   this.tablist = this.alltablist.slice(0, this.tabcount)
    //   this.moretablist = this.alltablist.slice(this.tabcount , 9999)
    // }
  },
  created : function () {
    getNoteBookList().then(res =>{
      console.log("获取笔记薄列表:", res.data.data)
      this.$store.commit('setBookList', res.data.data);
    }).catch(err => {
      console.log("获取笔记薄列表异常:", err)
    })
  }, 
  // 钩子函数
  mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
  }
};
</script>

<style scoped>
  .tab-active {
    background-color: red
  }
  .tab-default a {
    padding-right : 0;
  }
  .close-icon {
    color : cyan;
  }
  .close-icon:hover {
    color: #ffffff;
    background-color: blue;
  }
</style>
