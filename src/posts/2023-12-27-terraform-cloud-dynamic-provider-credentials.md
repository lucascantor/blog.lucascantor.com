---
title: Terraform Cloud Dynamic Provider Credentials
excerpt: 'Replace static AWS IAM secrets with dynamic provider credentials in Terraform Cloud using OIDC trust relationships.'
date: 2023-12-27
author:
  name: 'Lucas Cantor'
  image: '/assets/images/lucas-cantor.jpg'
feature_image: '/assets/images/2023-12-27-terraform-cloud-dynamic-provider-credentials.png'
featured: false
tags:
  - Infrastructure as Code
  - Terraform
  - AWS
disclaimer:
---

After years without a good solution to my "static AWS IAM user secrets" problem, I've recently set up [Dynamic Provider Credentials](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/dynamic-provider-credentials) for AWS in my Terraform Cloud org.

Hashicorp's docs offer a great explanation of both the security and convenience benefits:

> Using static credentials in your workspaces to authenticate providers presents a security risk, even if you rotate your credentials regularly. Dynamic provider credentials improve your security posture by letting you provision new, temporary credentials for each run... This workflow eliminates the need to manually manage and rotate credentials across your organization. It also lets you use the cloud platform’s authentication and authorization tools to scope permissions based on metadata, such as a run’s phase, its workspace, or its organization.

## How Dynamic Credentials Work

Rather than manually minting and rotating long-lived static IAM user secrets, you configure a trust relationship between Terraform Cloud and AWS (or any supported platform you want to manage via Terraform).

When implementing this for AWS, Terraform Cloud is effectively authorized as an OIDC identity provider, which delegates ephemerial tokenized access to your AWS org, verified by Terraform Cloud’s public signing key. Even better, you can scope that access granularly, by assigning any AWS IAM role(s) to this trust relationship itself!

## Configuring This via Terraform

You can follow [Hashicorp's docs](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/dynamic-provider-credentials/aws-configuration) to configure this all manually, but assuming you're already managing your AWS org via Terraform, and you're just looking to migrate to this new authentication mechanism, you can, of course, easily configure this all via Terraform instead! 🚀

### example.tf

```hcl
# ------------------------------------------------------------------------------------------
# Variables

variable "tfc_aws_audience" {
  type        = string
  default     = "aws.workload.identity"
  description = "The audience value to use in run identity tokens"
}

variable "tfc_hostname" {
  type        = string
  default     = "app.terraform.io"
  description = "The hostname of the TFC or TFE instance to use with AWS"
}

variable "tfc_organization_name" {
  type        = string
  default     = "YOUR_ORG_NAME"
  description = "The name of the Terraform Cloud organization to use with AWS"
}

variable "tfc_project_name" {
  type        = string
  default     = "YOUR_PROJECT_NAME"
  description = "The name of the Terraform Cloud project under which a workspace will be used"
}

variable "tfc_workspace_name" {
  type        = string
  default     = "YOUR_WORKSPACE_NAME"
  description = "The name of the Terraform Cloud workspace to connect to AWS"
}

# ------------------------------------------------------------------------------------------
# Data

data "tls_certificate" "tfc_certificate" {
  url = "https://${var.tfc_hostname}"
}

# ------------------------------------------------------------------------------------------
# IAM OIDC identity providers

resource "aws_iam_openid_connect_provider" "terraform_cloud" {
  url             = data.tls_certificate.tfc_certificate.url
  client_id_list  = [var.tfc_aws_audience]
  thumbprint_list = [data.tls_certificate.tfc_certificate.certificates[0].sha1_fingerprint]
}

# ------------------------------------------------------------------------------------------
# IAM roles

resource "aws_iam_role" "terraform_cloud_sts_assumption_role" {
  name = "terraform-cloud-sts-assumption-role"

  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Effect": "Allow",
     "Principal": {
       "Federated": "${aws_iam_openid_connect_provider.terraform_cloud.arn}"
     },
     "Action": "sts:AssumeRoleWithWebIdentity",
     "Condition": {
       "StringEquals": {
         "${var.tfc_hostname}:aud": "${one(aws_iam_openid_connect_provider.terraform_cloud.client_id_list)}"
       },
       "StringLike": {
         "${var.tfc_hostname}:sub": "organization:${var.tfc_organization_name}:project:${var.tfc_project_name}:workspace:${var.tfc_workspace_name}:run_phase:*"
       }
     }
   }
 ]
}
EOF
}

# ------------------------------------------------------------------------------------------
# IAM policies

data "aws_iam_policy" "admin" {
  name = "AdministratorAccess"
}

resource "aws_iam_role_policy_attachment" "terraform_cloud_sts_assumption_role_admin_policy" {
  role       = aws_iam_role.terraform_cloud_sts_assumption_role.name
  policy_arn = data.aws_iam_policy.admin.arn
}
```
