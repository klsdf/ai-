<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <TalkList :characterName="name"   :dialogContent = "content"/>
</template>

<script>
import TalkList from './components/TalkList.vue'


export default {
  name: 'App',
  data()
  {
    return {
        name:"姓名",
        content:"内容"
    }
  },
  components: {
    TalkList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

}
</style>
