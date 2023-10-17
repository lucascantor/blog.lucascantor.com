---
title: An iPhone App Built for Two
description:
date: 2023-10-16
tags:
  - iPhone
  - iOS
  - apps
  - swift
  - swiftUI
---

## Hello Again 👋🏼

It's been a while! I haven't felt much like blogging since 2020 came around, for any of a number of obvious reasons 🤷‍♂️

That said, I `did a thing`™️, and I'd like to share my experience. I spent some time working sporadically this past Spring to build my first "real" iPhone app. The app is [SpendSlope](https://apps.apple.com/us/app/spendslope/id1663967071), an intiutive "visual budgeting" app, which I initially released back in April 2023. After updating it for iOS 17 recently, I figured now is as good a time as any to write about it!

## Imposter Syndrome

This whole process has frankly been outside my comfort zone, but that's really the only way to learn and grow. Although my friends and family know me as a "computer person," and I specifically went to school for computer science, and I've enjoyed what I consider to be significant success and recognition in a career as a computer systems engineer, I'd never been able to wrap my head around iOS app development, no matter how many times I tried.

The latest in my series of ongoing failed attempts focused on development in [SwiftUI](https://developer.apple.com/xcode/swiftui/) specifcally, and this time, for whatever reason, it finally clicked for me. I think the thing about SwiftUI that works so well for the way _my_ brain works is its [declarative syntax](https://en.wikipedia.org/wiki/Declarative_programming). In hindsight, I've always felt that other declarative languages have made the most sense to me intuitively. For example, the majority of the professional work I've enjoyed most (and been proudest of) has all been built via [Terraform](https://www.terraform.io). Frankly, ever since learning about SwiftUI, I've been ecstatic to get to use that same declarative paradigm to conquer a programming challenge I've struggled with for so long.

I'd also like to give a shout out to Paul Hudson for his absolutely amazing site, [Hacking with Swift](https://www.hackingwithswift.com/learn), which made the process of learning SwiftUI even easier. Paul is an astonisingly generous and brilliant person, and if you're at all interested in Swift, they absolutely deserve your time, attention, and support.

## The Mother of Invention

Aside from the many technical hurdles inherant in developing and publishing any iPhone app, another issue I think I've always struggled with has been the lack of a good idea. It sounds trite, but good code comes naturally as a result of a good idea (among other necessary things), and rarely, if ever, the other way around.

Looking back, I think I've literally struggled _even more_ to find a budgeting app that works for me, than I've struggled to learn iOS app development in a way that works for me, and that's saying something! Somewhat poetically, it seems both of these problems shared the same solution.

What I've never found in any budgeting app has been a seemingly simple combination of just two features:

- Show me how much money, in literal dollars and cents, each member of my household can spend per day through the rest of the month, while staying under budget
- Show me what that amount looks like, drawn visually on a line graph, compared to our household's _actual_ spending

The idea, which ~~steals~~ borrows heavily from [Weather Line](https://weatherlineapp.com) (RIP), is to give me an immediate, intuitive, visual understanding of the rate at which I'm spending money, compared to a "safe" rate which is required to stay under my budget for the month. If I get in the habit of using the app to log spending in real-time, this provides a natural feedback mechanism which _literally_ shows me the impact of a purchase I'm making, giving me an opportunity to think logically, and to reevaluate whether the purchase is even necessary.

I've seen an app or two on occasion that sort of comes close to this concept, but never without a bloated and complex list of irrelevant features, shady ads and data-mining practices, or hacky bank and credit card integrations. What I eventually realized is that I should just build this app for myself (and for my partner), and not worry about solving theoretical problems or addressing theoretical use-cases that potential customers might have. This was incredibly liberating, and it also eliminated an unnecessary mental "barrier to entry" to getting an iOS app published in the App Store[^1].

[^1]: Of course, there's still the literal $100 per year barrier to entry, which Apple charges me for the privilege of running my own app on my own phone... 🙃

## My Gift to You

In summary, SpendSlope is an intuitive visual budgeting app, and it works for me because I built it for me, but if the concept sounds like it might make sense to you, I encourage you to give it a try. It's [available for free in the App Store](https://apps.apple.com/us/app/spendslope/id1663967071), and it's got a very clear, concise, and respectful [privacy policy](https://kindredcode.com/privacy). (TL;DR - I don't _ever_ access any of your data, period.)

I only ask two things of you in return:

- If you _do_ end up using and enjoying SpendSlope, please leave a (hopefully positive) review in the App Store.
- Remember that impostor syndrome is real, every smart person experiences it, and that you can't compare yourself to others.
