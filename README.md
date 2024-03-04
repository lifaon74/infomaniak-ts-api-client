# Infomaniak Node and Deno API Library

This library provides convenient access to the Infomaniak REST API from TypeScript or JavaScript.

To learn how to use the Infomaniak API, check out our [API Documentation](https://developer.infomaniak.com/getting-started).

## Installation

```bash
npm install --save @infomaniak/client-api
# or
yarn add @infomaniak/client-api
```

You can import in Deno via:

```ts
import { InfomaniakClient } from 'https://deno.land/x/@infomaniak/client-api@v0.1.0/mod.ts';
```

**[Getting started](./tutorials/getting-started.md)**

## Usage

The full API of this library can be found directly in the files, with many [code examples](./examples).

The code below shows how to get started using the `llm API`:

```ts
import { load } from 'https://deno.land/std@0.217.0/dotenv/mod.ts';
import { InfomaniakClient } from 'https://deno.land/x/@infomaniak/client-api@v0.1.0/mod.ts';

await load({
  export: true,
});

async function main() {
  const token: string = Deno.env.get('INFOMANIAK_LLM_TOKEN')!;

  const client = new InfomaniakClient({
    apiKey: token,
  });
  
  const response = await client.llm.query({
    product_id: 60,
    messages: [
      {
        role: 'user',
        content: 'Write a short letter to your future self',
      },
    ],
  });

  console.log(response);
}

main();
```

---

**NOTE:** currently only the LLM API is supported. But additions to our other APIs are planed in a near future.

---
