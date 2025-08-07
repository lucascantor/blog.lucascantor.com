---
title: A Safari PDF Rendering Bug Workaround
excerpt: Work around a Safari PDF rendering bug that violates content security policies by forcing PDF downloads instead.
date: 2024-07-05
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/rodion-kutsaiev-jAnqHe_mr3o-unsplash.jpg'
featured: false
tags:
  - Web
  - Security
  - AWS
disclaimer:
---

While making some small design changes to my website today, I noticed Safari on macOS was rendering a PDF at a very small scale, rather than filling the entire Safari window, as it usually does. After some troubleshooting, I realized Safari was generating a content security policy error, indicating the PDF itself was violating my site's content security policy by trying to use `unsafe-inline` as its `style-src`.

After failing to reproduce this behavior in any other browser on macOS, or even in Safari on iOS, I found [a StackOverflow post](https://stackoverflow.com/questions/76077768/webkit-pdf-display-seems-to-require-csp-with-unsafe-inline-style-src) discussing this exact same problem, which appears to be a bug in WebKit on macOS. While several commenters on that post have indicated that a software update has since resolved this bug, it clearly hasn't been solved entirely...

I was definitely _not_ inclined to allow `unsafe-inlne` style sources in my site's content security policy as a workaround for this, so instead I decided to set the PDF's `content-disposition` metadata to a value of `attachment` in order to force Safari on macOS (and all browsers, for that matter) to downlad it, rather than attempting (and failing) to render it directly. If you use AWS S3 to host your web content, like I do, here's their documentation on [working with object metadata](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html), for reference.
