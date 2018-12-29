<template>
    <v-list class="pa-1" >
        <v-list-tile
            v-for="item in pagelist"
            :key="item.uri"
            @click="selectPage(item)" 
            active-class="page-active" 
            :class="item.active ? 'page-active' : ''"
            :to = "`/pagecontent/${currentBook.uri}/${currentTab.uri}/${item.uri}`"
          >
            <v-list-tile-content class="title font-weight-regular">
              <v-list-tile-title><v-icon icon :color="item.color">edit</v-icon> {{ item.name }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop.prevent="deletePage(item)" class="mr-3">
                <v-icon color="grey">close</v-icon>
              </v-btn>
            </v-list-tile-action>
        </v-list-tile>

        <!-- 添加新增笔记页 -->
        <v-divider ></v-divider>
        <v-list-tile>
            <v-text-field
                v-model="newPageName"
                label="输入笔记页名称"
                clearable
                solo
                append-icon="library_add"
                @click:append="toggleAddNewPage"
            ></v-text-field>
        </v-list-tile>
          <v-dialog v-model="delPageAlert" max-width="290">
              <v-card>
                  <v-card-title class="headline">确定要删该笔记页?</v-card-title>
                  <v-divider ></v-divider>
                  <v-card-text>
                      {{delPage ? delPage.name : ""}}
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click="delPageAlert=false">取消</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="confirmDeletePage(delPage)">删除</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </v-list>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name : 'NotePages',
    data () {
        return {
            newPageName: "",
            delPageAlert : false,
            delPage : null,
        }
    },
    methods : {
        // 新增新页事件  
        toggleAddNewPage : function () {
            if (!this.newPageName || this.newPageName === "") {
                return ;
            }
            this.$store.dispatch('addNewPage', this.newPageName);
            this.newPageName = ""
            // 路由跳转到新页面上  
            //this.$router.push({ path: '/pagecontent/' + this.currentBook.uri + '/' + this.currentTab.uri + '/' + this.currentPage.uri })
        },
        // 选择page事件 
        selectPage : function(item) {
            console.log("selete page")
            this.$store.commit('changeActivePage', item)
        },
        // 删除page事件  
        deletePage : function(item) {
            console.log("delete page")
            this.delPageAlert = true
            this.delPage = item
        }, 
        // 确认删除事件  
        confirmDeletePage : function(item) {
            // commit  
            this.$store.commit('deletePage', item)
            this.delPageAlert = false;
            this.delPage = null;
        }
    },
    computed : {
        ...mapGetters({
            pagelist : 'getPageList',
            currentTab : 'getCurrentTab',
            currentBook : 'getCurrentBook',
            currentPage : 'getCurrentPage'
        })
    }, 
    watch : {
        currentTab : function () {
            console.debug("tab 切换 watched! ")
            if (this.currentPage) {
                console.debug("page切换: router push.")
                this.$router.push({ path: '/pagecontent/' + this.currentBook.uri + '/' + this.currentTab.uri + '/' + this.currentPage.uri })
            } else {
                console.debug("当前无page , 转至空页!")
                this.$router.push({ path: '/pageblank'});
            }
        }
    }
}
</script>

<style scoped>
.page-active {
    background-color: aqua;
}
</style>
