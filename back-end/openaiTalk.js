const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");

const model = "gpt-3.5-turbo";

class GPTMessage {
  constructor(content) {
    this.role = "user";
    this.content = content;
  }
}
openaiTalk = {};
openaiTalk.aiTemplates = fs
  .readdirSync(path.resolve(__dirname, "ai_templates"))
  .map((e) => {
    const result = {
      name: path.basename(e),
      content: fs
        .readFileSync(path.resolve(__dirname, "ai_templates", e))
        .toString(),
    };
    result.name = result.name.substring(0, result.name.lastIndexOf("."));
    return result;
  });

const openai = new OpenAI({
  apiKey: "jxs6qHq6K5GXOKz",
  baseURL: "https://openai-gateway.hoxigames.xyz:8000/v1",
});

// /**
//  * 让所有的GPT角色对话
//  * @param {*} content
//  * @returns
//  */
openaiTalk.talk = async function (aiCharacters, content = "") {
  // openaiTalk.addHistory(aiCharacters,content);
  result = [];

  for (let i = 0; i < aiCharacters.length; i++) {
    temp = {};
    temp.name = aiCharacters[i].name;
    temp.content = await aiCharacters[i].talk(content);
    result.push(temp);
  }
  return result;
};

/**
 * 增加所有GPT角色的历史记录
 * @param {对话角色的数组} aiCharacters
 * @param {对话的内容} content
 */
openaiTalk.addHistory = function (aiCharacters, content) {
  for (let i = 0; i < aiCharacters.length; i++) {
    aiCharacters[i].pushHistory(content);
  }
};

class AiCharacter {
  name = "";
  template = "";
  history = [];

  constructor(name, template) {
    this.name = name;
    this.template = template;
    this.history = [new GPTMessage(this.template)];
  }

  /**
   *
   * @param {string} message
   * @returns {Promise<string>}
   */
  async talk(message) {
    if (message !== "") this.pushHistory(message);
    const chatCompletion = await openai.chat.completions.create({
      messages: this.history,
      model: model,
    });
    return chatCompletion.choices[0].message.content;
  }

  pushHistory(message) {
    this.history.push(new GPTMessage(message));
  }
}

openaiTalk.createCharacter = function () {
  const template =
    openaiTalk.aiTemplates[~~(Math.random() * openaiTalk.aiTemplates.length)];
  return new AiCharacter(template.name, template.content);
};

module.exports = openaiTalk;
