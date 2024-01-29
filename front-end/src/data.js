class StoryScript
{
    constructor(content,name= "主持人",isWait = false)
    {
        this.name = name;
        this.content = content;
        this.isWait = isWait;
  

    }
    static storyData = [
        new StoryScript("很久很久以前，有一个可爱又很乖巧的小女孩，她总喜欢戴着外婆送给她的红色小帽子，所以大家都叫她小红帽。有一天外婆生病了，妈妈让小红帽把蛋糕和水果带去看望外婆。"),
        new StoryScript("妈妈提着篮子里面有蛋糕和葡萄酒上场"),
        new StoryScript("小红帽，你准备好了吗？","妈妈",true),
        new StoryScript("第一幕:森林里"),
        new StoryScript("（唱）我独自走在郊外的小路上，我把糕点带给外婆尝一尝她家住在又远又僻静的地方，我要当心附近是否有大灰狼，当太阳下山岗，我要赶回家，同妈妈一起进入甜蜜梦想。","小红帽"),
        new StoryScript("（唱）我独自走在郊外的小路上，我把糕点带给外婆尝一尝她家住在又远又僻静的地方，我要当心附近是否有大灰狼，当太阳下山岗，我要赶回家，同妈妈一起进入甜蜜梦想。","小红帽"),
    ]

  

}

export default{
    StoryScript
}