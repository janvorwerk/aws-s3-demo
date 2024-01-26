# Demo of using AWS S3 in NextJs

You should specify three environment variables in your `.env.local` file:

```
AWS_ACCESS_KEY="xxxxxxxxxxxxxxxxxxx"
AWS_ACCESS_SECRET="xxxxxxxxxxxxxxxxxxx"
BUCKET_NAME="xxxxxxxxxxxxxxxxxxx"
```

Then

    pnpm install

    pnpm dev

See that it works well.

Then [upgrade to Next.js 14](https://nextjs.org/docs/app/building-your-application/upgrading/version-14):

    pnpm up next react react-dom --latest

And observe... that it still works like a charm! 😂. There must be something else on my private repo. I have been crafting this test case for nothing.