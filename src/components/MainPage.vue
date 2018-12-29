<template>
    <v-container fluid>
        <v-layout row>
            <v-flex xs4 >
                <v-text-field class="ma-0 pa-0 mb-1 headline" v-model="pageData.title" hide-details></v-text-field>
                <span class="caption blue-grey--text ">Created: {{pageData.created_at}} Updated: {{pageData.updated_at}}</span>
            </v-flex>
            <v-flex xs2>

            </v-flex>
            <v-flex xs6>
                
                    <v-chip v-for="(tg , index) in pageData.tags" :key="index" 
                        close outline
                        class="ma-1" small
                    >{{tg}}</v-chip>
                
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-divider class="my-3"></v-divider>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPageContent } from "@/api"

export default {
    name: "MainPage",
    data() {
        return {
            pageData: null,
        }
    },
    computed : {
        ...mapGetters({
            currentTab : 'getCurrentTab',
            currentBook : 'getCurrentBook',
            currentPage : 'getCurrentPage'
        })
    }, 
    // 在路由使获取页面数据  
    beforeRouteUpdate (to, from, next) {
        console.log("In BeforeRouteUpdate: ",to.params.bookid, to.params.tabid, to.params.pageid)
        this.getData(to.params.bookid, to.params.tabid, to.params.pageid)
        next()
    },
    methods : {
        getData : function (bookid , tabid, pageid) {
            getPageContent(bookid, tabid, pageid).then(res => {
                this.pageData = res.data.data
                console.log("获取Page数据: " , this.pageData);
            }).catch(err => {
                console.log("获取page数据异常!", err)
                // 跳转路由  
                //this.$router.push({name: 'error'})
            })
        }
    }
}
</script>
<style scoped>

</style>
