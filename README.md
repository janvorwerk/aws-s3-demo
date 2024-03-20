# Test case for AWS SDK / Next.js 14 issue

This is a test case for https://github.com/aws/aws-sdk-js-v3/issues/5435

To reproduce:

You should specify three environment variables in your `apps/web/.env.local` file:

```
AWS_ACCESS_KEY="xxxxxxxxxxxxxxxxxxx"
AWS_ACCESS_SECRET="xxxxxxxxxxxxxxxxxxx"
BUCKET_NAME="xxxxxxxxxxxxxxxxxxx"
```

Then

    pnpm install

    cd apps/web
    
    pnpm dev

See that it works well.

Then [upgrade to Next.js 14](https://nextjs.org/docs/app/building-your-application/upgrading/version-14):

    pnpm up -r --latest

Restart

    pnpm dev

And observe...

```
 ⨯ ../../node_modules/.pnpm/@smithy+util-endpoints@1.2.0/node_modules/@smithy/util-endpoints/dist-cjs/index.js (271:0) @ callFunction
 ⨯ TypeError: endpointFunctions[fn] is not a function
    at async SkS3Bucket.exists (../../packages/aws/s3.ts:35:30)
    at async Home (./app/page.tsx:16:20)
null
```
