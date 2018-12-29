<template>
  <div class="text-center">
  
    <div class="jc">
      <v-card class="blue darken-1 white--text ma-4">
        <v-card-text>  
          <p>{{ message }}</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<style>

</style>
<script>
export default {
  data () {
    return {
      message: 'Page Blank.'
    }
  },

  mounted () {
  }
}
</script>