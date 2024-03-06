import { config } from 'dotenv';
import { InfomaniakClient } from '@infomaniak/ts-api-client';

config({
  path: '../../.env'
});

async function llm() {
  const token = process.env.INFOMANIAK_LLM_TOKEN;

  const client = new InfomaniakClient({
    apiKey: token,
  });

  /*
    For prompts: https://github.com/f/awesome-chatgpt-prompts
   */

  // const response = await client.llm.query({
  //   product_id: 60,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: 'Write a short letter to your future self',
  //     },
  //   ],
  // });
  //
  // console.log(response);

  const conversation = client.llm.startConversation({
    product_id: 60,
  });

  const response = await conversation.next(`
    I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is "istanbulu cok seviyom burada olmak cok guzel"
  `);

  console.log(response);
}

llm();

