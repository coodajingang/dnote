<template>
    <v-list class="pa-1 pt-4" >
        <!-- 添加新增笔记本 -->
        <v-list-tile>
            <v-text-field
                v-model="newBookName"
                label="输入笔记薄名称"
                clearable
                solo
                append-icon="library_add"
                @click:append="toggleAddNewBook"
                @keyup.enter.prevent.stop="toggleAddNewBook" 
                @keyup.esc.prevent.stop="addNewBookCancel"
            ></v-text-field>
        </v-list-tile>

        <v-divider ></v-divider>
        <v-subheader class="title font-weight-black" inset>笔记薄列表</v-subheader>
        <v-list-tile
            v-for="item in booklist"
            :key="item.uri"
            avatar
            @click="selectNoteBook(item)" 
            active-class="book-active" 
            :class="item.active ? 'book-active' : ''"
          >
            <v-list-tile-avatar size="45px">
              <v-icon :color="item.color" >library_books</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content class="title font-weight-regular">
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="deleteNoteBook(item)" class="mr-3">
                <v-icon color="grey">close</v-icon> <!--delete_outline --> 
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-dialog v-model="delBookAlert" max-width="290">
              <v-card>
                  <v-card-title class="headline">确定要删该笔记薄?</v-card-title>
                  <v-divider ></v-divider>
                  <v-card-text>
                      {{delBook ? delBook.name : ""}}
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click="delBookAlert=false">取消</v-btn>
                      <v-btn color="red darken-1" flat="flat" @click="confirmDeleteBook()">删除</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </v-list>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name :  "NoteBooks",
    data() {
        return {
            delBook: null,   // 待删除的notebook 
            delBookAlert : false, // 删除notebook对话框 
            newBookName : "", // 新笔记薄名称  
        }
    }, 
    computed : {
        ...mapGetters({
            booklist : 'getBookList'
        })
    },
    methods : {
        // 删除notebook , 需要提起确认框 
        deleteNoteBook : function(item) {
            console.log("delete Notebook :", item)
            this.delBook = item;
            this.delBookAlert = true;
        },
        // 确认删除notebook 
        confirmDeleteBook : function () {
            this.delBookAlert = false;
            this.$store.dispatch('deleteBook', this.delBook);
            this.delBook = null;
        },
        // 新增笔记薄事件  
        toggleAddNewBook : function () {
            console.log("add new boot" , this.newBookName)
            if (!this.newBookName || this.newBookName === "") {
                return ;
            }
            this.$store.dispatch('addNewBook', this.newBookName)
            this.newBookName = ""
        },
        // 选择笔记薄  
        selectNoteBook : function(item) {
            console.log("select event!", item.name)
            this.$store.commit('changeActiveBook', item)
            this.$emit('closeBookNavDrawer')
        },
        // 新增笔记薄时  esc按键事件 
        addNewBookCancel : function() {
            this.newBookName = ""
        }
    }
}
</script>

<style scoped>
.book-item {
    border: 1px solid #ddd;
}

.book-active {
    background-color: aqua;
}

</style>

