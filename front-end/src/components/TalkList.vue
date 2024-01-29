<template>
  <div class="fullscreen-bg">
    <div class="fullscreen-bg__image"></div>
  </div>

  <div id="score-area">

    剩余发言机会：{{ talkChance }}

    <div  v-if="win">你赢了</div>
    <div  v-if="lose">你输了</div>
  </div>
  <div class="image-container">
    <!-- <img src="../../imgs/tachie/映月立绘-哭泣.png" alt="立绘" /> -->
    </div>
 
  <div id="dialog-area">
    <div id="dialog-content">
      <a-typography-paragraph v-for="(item) in talkData" :key="item">
            <span> {{ item.name }}</span>: <span>{{ item.content }}</span>
      </a-typography-paragraph>
    </div>

    <div id="dialog-user-input">
      <a-textarea v-model="message" placeholder="" :style="{ width: '50%' }" />
 
      <a-button type="primary" :style="{ width: '20%' }" @click="sendMsg">发送数据</a-button>
    <div style="font-size: 25px;">你是：{{ character }}</div>
    </div>



  </div>
  <!-- <a-layout>
    <a-layout-header>ai剧本杀</a-layout-header>
    <a-layout>
      <a-layout-content>
        <a-typography :style="{ marginTop: '-40px' }">
    
        </a-typography>
      </a-layout-content>
    </a-layout>

    <a-layout-footer>
      <a-typography :style="{ marginTop: '40px' }">
        <a-typography-paragraph>
          
        </a-typography-paragraph>
      </a-typography>
      <a-space direction="vertical" size="large" style="width: 100%  ; display: flex;">
           
      
        <a-typography-text>
      
    </a-typography-text>
      </a-space>
    </a-layout-footer>
  </a-layout> -->
</template>

<script>

import StoryScript from "../data"
StoryScript = StoryScript.StoryScript;
export default {
  name: 'TalkList',
  data() {
    return {
      talkData: [],
      message: "",
      character: "小红帽",
      talkChance :10,
      win:false,
      false:false
    }
  },
  props: ["characterName", "dialogContent"],
  methods: {
    ws: null,
    sendMsg() {
      this.talkChance --;

      if(this.talkChance<=0)
      {
          this.false =true;
      }
      if (this.message == "") {
        alert("不允许发送空白的留言哦！");
        return;
      }
      if(this.message == "init")
      {
        this.ws.send("init")
        return
      }

      let storyScript = new StoryScript(this.message, this.character)
      this.talkData.push(storyScript);

      this.ws.send(`对话：${JSON.stringify(storyScript)}`);
      this.message = "";

    },
    websocketinit() {
      this.ws = new WebSocket("ws://localhost:12345/");
      this.ws.onmessage = (evt) => {
        var message = evt.data;

        if (message.startsWith("update_web:")) {
          let data = message.substring("update_web:".length)
          this.talkData = JSON.parse(data)
          console.log(this.talkData)
        }

        else if (message.startsWith("set_character:")) {
          let data = message.substring("set_character:".length)
          this.character = data
        }
        else if(message.startsWith("win"))
        {
          this.win=true;
        }else if(message.startsWith("lose"))
        {
          this.lose  = true;
        }

      };
      this.ws.onopen = () => {
        this.ws.send("new_character");
        this.ws.send("update_message")
      }



    },

  },
  mounted() {

    this.websocketinit();


  },
}


</script>


<style scoped>


#score-area{
  margin-top: 100px;
  margin-left: 100px;
  font-size: 50px;
}
 .image-container {
            position: relative;
            width: 300px;
            height: 200px;
            overflow: hidden;
        }
        
  .image-container img {
      position: fixed;
      bottom: 0px;
      left: 0px;
      width: 25%;
      height: auto;
      object-fit: cover;
  }


#dialog-area{
  position: fixed;
  width: 70%;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

#dialog-user-input
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#dialog-content{
  background-color: rgba(204, 198, 189, 0.582);
  border-radius: 3%;
  height:800px;
  overflow-y: scroll;
}

#dialog-content span{
  margin-left: 30px;
}
.fullscreen-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
}

.fullscreen-bg__image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('../../imgs/scene/操场.jpg');
}


:deep(.arco-layout-header),
:deep(.arco-layout-footer),
:deep(.arco-layout-sider-children),
:deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}
</style>

