import { Configuration, OpenAIApi } from "openai";
import Koa from "koa"
import Router from "koa-router";
import express from "express";
import path from "path";

// 最新 node 核心包的导入写法
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
// 获取 __filename 的 ESM 写法
const __filename = fileURLToPath(import.meta.url);
// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://platform.openai.com/docs/api-reference/images

const configuration = new Configuration({
    //organization: process.env.APP_ORG,
    apiKey: process.env.APP_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

const app = new Koa()
const router = new Router();


router.get("/chat", async (ctx, next) => {
    // 获取请求中的参数
    const { prompt } = ctx.request.query;

    const res = await openai.createCompletion({
        // 对话模型
        model: "text-davinci-003",//  dialogue-babi-001 对话模型
        prompt: prompt,
        max_tokens: 2048,
        temperature: 0.2
    })
    let choices = res.data.choices;
    let  text = "";
	choices.forEach(item=>{
		text+="<p>"+item.text+" </p> ";
	});			
    // 将生成的内容返回给客户端
    ctx.body = text
});

router.get("/image", async (ctx, next) => {
    // 获取请求中的参数
    const { prompt } = ctx.request.query;
    const res = await openai.createImage({
        // 对话模型
        model: "image-alpha-001",
        prompt: prompt,
        size: "256x256",
        n: 1
    })
    // 将生成的内容返回给客户端
    var url = res.data.data[0].url

    ctx.body = "<img src=\"" + url + "\"></>"
});

//app.use(express.static(path.join(__dirname, './dist')))
// 启用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
});

