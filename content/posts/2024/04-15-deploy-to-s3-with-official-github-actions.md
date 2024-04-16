---
title: Deploy a Static Website to AWS S3 with Official GitHub Actions
description:
date: 2024-04-15
tags:
  - Infrastructure as Code
  - Terraform
  - Security
  - CI/CD
  - GitHub Actions
  - AWS
  - S3
disclaimer:
---

I've been doing some "spring cleaning" in AWS and GitHub related to [yesterday's post](https://blog.lucascantor.com/block-search-engine-indexing-of-cloudfront-content-with-a-custom-response-headers-policy/), and while I was digging around, I realized there was a way to update my blogging stack and finally move it off GitHub Pages and instead use an AWS S3 bucket behind CloudFront, just like all of of my other websites.

## My Previous Blogging Setup

In the past, my blog's hosting provider was GitHub Pages, becase it was free and fully supported by first-party GitHub Actions, but I was also using an AWS CloudFront distribution in front of GitHub Pages, in order to enforce [HSTS](https://infosec.mozilla.org/guidelines/web_security#http-strict-transport-security), a strong [content security policy](https://infosec.mozilla.org/guidelines/web_security#content-security-policy), and other security best practices. You can see [my blog's scan summary on Mozilla Observatory](https://observatory.mozilla.org/analyze/blog.lucascantor.com) to get an overview of these security features if you're curious.

Unfortunately, this configuration meant that if I ever exceeded the AWS free Usage Tier, I would be charged [standard pricing for data transfer out](https://aws.amazon.com/cloudfront/pricing/), due to my CloudFront distribution's GitHub Pages origin being external to AWS. In practice, this hadn't happened in the several years I'd been hosting my blog this way, and it wasn't likely to happen ever, but it was exactly the kind of thing that ~~worried~~ annoyed me in principle.

## An Ideal Solution

It looks like I'm late to the party, but there's a ["Configure AWS Credentials" GitHub Action](https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions) from the official aws-actions GitHub org This is _exactly_ what I've been looking for, because it means I don't need to trust any third-party dependencies.

Even better, this official GitHub Action has support to authenticate by assuming an AWS role directly via a GitHub OIDC identity provider in AWS. This is _also_ exactly what I've been looking for, because it means I don't need to create any long-lived static AWS IAM secrets to store in GitHub. You can see my [Terraform Cloud Dynamic Provider Credentials](https://blog.lucascantor.com/terraform-cloud-dynamic-provider-credentials/) post for a more in-depth explanation of the benefits of an analagous setup between AWS and Terraform Cloud.

Both of these capabilities combined allow me to publish blog posts via [simple markdown files added to my blog's GitHub repo](https://github.com/lucascantor/blog.lucascantor.com/pull/73/files), leveraging GitHub Actions to build the blog as a static website with Eleventy, and then deploying the entire site to its hosting provider. In effect, the "user experience" for me as my blog's author would remain identical, but as my blog's admin, I'd be reaping the operational, pricing, and security benefits of hosting it in an AWS S3 bucket alongside all of the other websites I manage.

## How to Do This

There are some docs and blog posts out there, including from [GitHub](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) and [AWS](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/) themselves, about how to use the "Configure AWS Credentials" GitHub Action this way specifically.

Unfortunately, none of the examples I found exactly matched my intended use-case, and the AWS blog post even contained a typo (an extra space after `repo:` in the IAM role trust policy template). So you don't need to figure this out yourself from scratch, here's my own completed configuration as code:

### AWS Configuration via Terraform

```hcl
# ------------------------------------------------------------------------------------------
# Variables

variable "github_actions_aws_audience" {
  type        = string
  default     = "sts.amazonaws.com"
  description = "The audience value to use in run identity tokens"
}

variable "github_actions_hostname" {
  type        = string
  default     = "token.actions.githubusercontent.com"
  description = "URL of the GitHub OIDC IdP to use with AWS"
}

variable "github_actions_organization_name" {
  type        = string
  default     = "example-org"
  description = "The name of the GitHub organization to use with AWS"
}

variable "github_actions_repo_name" {
  type        = string
  default     = "example.com"
  description = "The name of the GitHub repo to use with AWS"
}

variable "github_actions_branch_name" {
  type        = string
  default     = "main"
  description = "The name of the GitHub repo branch to use with AWS"
}

# ------------------------------------------------------------------------------------------
# IAM OIDC identity providers

# GitHub Actions OIDC identity provider TLS certificate
data "tls_certificate" "github_actions_certificate" {
  url = "https://${var.github_actions_hostname}"
}

# GitHub Actions OIDC identity provider
resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = data.tls_certificate.github_actions_certificate.url
  client_id_list  = [var.github_actions_aws_audience]
  thumbprint_list = [data.tls_certificate.github_actions_certificate.certificates[0].sha1_fingerprint]
}

# ------------------------------------------------------------------------------------------
# IAM roles

# Role for GitHub Actions to assume
resource "aws_iam_role" "github_actions_sts_assumption_role" {
  name = "github-actions-sts-assumption-role"

  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Effect": "Allow",
     "Principal": {
       "Federated": "${aws_iam_openid_connect_provider.github_actions.arn}"
     },
     "Action": "sts:AssumeRoleWithWebIdentity",
     "Condition": {
       "StringEquals": {
         "token.actions.githubusercontent.com:sub": "repo:${var.github_actions_organization_name}/${var.github_actions_repo_name}:ref:refs/heads/${var.github_actions_branch_name}",
         "token.actions.githubusercontent.com:aud": "${var.github_actions_aws_audience}"
       }
     }
   }
 ]
}
EOF
}

# ------------------------------------------------------------------------------------------
# IAM policies

# Policy to grant read-write access to example.com S3 bucket
resource "aws_iam_policy" "example_com_s3" {
  name   = "example_com_s3"
  policy = data.aws_iam_policy_document.example_com_s3.json
}

data "aws_iam_policy_document" "example_com_s3" {
  statement {
    effect = "Allow"

    actions = [
      "s3:List*",
      "s3:Describe*",
      "s3:Get*",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = [
      "arn:aws:s3:::example.com",
      "arn:aws:s3:::example.com/*",
    ]
  }
}

# Attachment of AWS-managed admin policy to admin group
resource "aws_iam_group_policy_attachment" "admin_group_admin_policy" {
  group      = aws_iam_group.admin.name
  policy_arn = data.aws_iam_policy.admin.arn
}

# Attachment of AWS-managed admin policy to Terraform Cloud STS assumption role
resource "aws_iam_role_policy_attachment" "terraform_cloud_sts_assumption_role_admin_policy" {
  role       = aws_iam_role.terraform_cloud_sts_assumption_role.name
  policy_arn = data.aws_iam_policy.admin.arn
}

# Attachment of policy granting read-write access to example.com S3 bucket to GitHub Actions STS assumption role
resource "aws_iam_role_policy_attachment" "github_actions_sts_assumption_role_admin_policy" {
  role       = aws_iam_role.github_actions_sts_assumption_role.name
  policy_arn = resource.aws_iam_policy.example_com_s3.arn
}
```

### GitHub Actions Configuration YAML File

```yaml
name: Build Eleventy site and deploy it to AWS S3

on:
  # Runs on pushes targeting the main branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets required permissions of the GITHUB_TOKEN
permissions:
  contents: read # Required for actions/checkout
  id-token: write # Required for requesting the JWT

jobs:
  # Build and deploy job
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 'node'
          check-latest: true

      - name: Install dependencies & build site
        run: |
          npm install
          npm run build

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<YOUR_AWS_ACCOUNT_ID>:role/github-actions-sts-assumption-role
          aws-region: us-east-1

      - name: Deploy site to S3
        run: |
          aws s3 sync ./_site s3://example.com/ --delete
```
