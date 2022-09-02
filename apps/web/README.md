# web

## Deployment Strategies

**SSR (Server Side Rendering)**
* Static files via S3
* Serving app via Cloudfront
* Customizing content via Lambda@Edge

* https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html#nextjs-ssr-pricing
* https://blog.canopas.com/complete-guide-to-deploying-ssr-vite-apps-on-aws-with-automation-27676113d6ac
* https://stackoverflow.com/questions/61433306/cheapest-way-to-deploy-a-react-app-using-nextjs-ssr-on-aws

**CSR (Client Side Rendering)**
* Static files via S3
* Serving app via Cloudfront
* Use sveltekit static-adapter

## Creating a project

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
