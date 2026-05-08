import ollama from "ollama";

async function main() {
    const response = await ollama.chat({
        model : "deepseek-r1",
        messages :[
            {
                role : "user",
                content: "What is the capital of France?"
            },
        ],

        stream : false,
        think : true,
    });

    console.log('Thinking:\n==============\n\n' + response.message.think);
    console.log('Thinking:\n==============\n\n' + response.message.content);
}