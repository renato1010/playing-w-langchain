## Exploring LangChain

This repository serves as a sandbox for experimenting with [LangChain](https://js.langchain.com/v0.2/docs/introduction/), a cutting-edge TypeScript library. The code here is sourced from various tutorials and documentation:

1. [Full Stack AI semantic search](https://www.youtube.com/watch?v=6_mfYPPcZ60) with Next.js...+LangChain By Nader Dabit
2. [LangChain docs](https://js.langchain.com/v0.2/docs/introduction/)
3. [LangChain JS tutorial; Getting Started](https://www.youtube.com/watch?v=MaSynwSIty4&list=PL4HikwTaYE0EG379sViZZ6QsFMjJ5Lfwj&pp=iAQB)

These are straightforward Node.js files written in TypeScript. To execute them, simply use:

```bash
$ tsx path/to/ts/file
```

Instead of using `.env` files, I utilized [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) for managing secrets  
 and deployed the application with Infrastructure as Code (IaC) using [Pulumi](pulumi/index.ts) folder.  
 Check out [env-vars.ts](src/env-vars.ts) to see how these environment variables  
 are making availabe into the code as module exports.
