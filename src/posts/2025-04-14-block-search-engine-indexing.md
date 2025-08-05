---
title: Block Search Engine Indexing of CloudFront Content with a Custom Response Headers Policy
excerpt: Block search engine indexing of CloudFront content using custom response headers policies with X-Robots-Tag noindex.
date: 2025-04-14
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2025-04-14-block-search-engine-indexing.png'
featured: false
tags:
  - Security
  - Infrastructure as Code
  - Terraform
  - AWS
disclaimer:
---

If, like me, you use AWS CloudFront as a CDN to host content stored in an S3 bucket, you might not necessarily want search engines to index that content. When researching a solution to this problem for myself, I found plenty of forum discussions and blog posts suggesting you can accomplish this with a simple `robots.txt` file stored at the root of your S3 bucket. [Google's robots.txt documentation](https://developers.google.com/search/docs/crawling-indexing/robots/intro) warns against doing this, however:

> Warning: Don't use a robots.txt file as a means to hide your web pages (including PDFs and other text-based formats supported by Google) from Google search results.
>
> If other pages point to your page with descriptive text, Google could still index the URL without visiting the page. If you want to block your page from search results, use another method such as password protection or noindex.

Reviewing [Google's noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing), it seemed clear to me that adding a `X-Robots-Tag: noindex` HTTP response header to every response from my entire CloudFront distribution would be the best way to achieve my desired goal, regardless of file type(s) in my S3 bucket:

> A response header can be used for non-HTML resources, such as PDFs, video files, and image files.

Thankfully, CloudFront supports attaching custom [response headers policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/modifying-response-headers.html) directly to CloudFront distributions, so I didn't need to set up a dedicated web server or even a Lambda function for this. Even better, this was very easy to configure entirely via Terraform!

Creating the custom headers policy itself:

```hcl
resource "aws_cloudfront_response_headers_policy" "custom_headers_policy" {
  name    = "CustomHeadersPolicy"
  comment = "Adds a set of custom headers to every response"

  custom_headers_config {
    items {
      header   = "X-Robots-Tag"
      value    = "noindex"
      override = true
    }
  }
}
```

Setting the custom headers policy's id as a CloudFront distribution's `response_headers_policy_id` argument:

```hcl
resource "aws_cloudfront_distribution" "cdn" {
  aliases = [
    "example.com",
  ]
  default_root_object = "index.html"
  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
    ]
    cached_methods = [
      "GET",
      "HEAD",
    ]
    cache_policy_id            = var.managed_cloudfront_caching_optimized_policy_id
    compress                   = true
    response_headers_policy_id = aws_cloudfront_response_headers_policy.custom_headers_policy.id
    target_origin_id           = var.target_origin_id
    viewer_protocol_policy     = "redirect-to-https"
  }
  enabled         = true
  is_ipv6_enabled = true
  origin {
    domain_name = "example.com.s3.amazonaws.com"
    origin_id   = "S3-example.com"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.identities["example.com"].cloudfront_access_identity_path
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.example_com.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}
```
