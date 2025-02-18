---
title: Automatic Okta Profile Attribute Validation
description: Using built-in Okta features to validate Okta user profile attribute values mapped from your HR source of truth.
date: 2025-02-17
tags:
  - IAM
disclaimer:
---

I recently completed work on a large project at Intercom to migrate our Okta organization from a legacy custom HR integration to Okta's built-in [profile sourcing](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-about-profile-sourcing.htm) feature. I won't bore you with every detail, but one of the most critical issues which prevented us from using profile sourcing in the _past_ was the potential for an HR team member to input invalid data in our HRIS[^1].

Let's say you have groups in Okta for each department in your HRIS, and various department groups in Okta inherit birthright access to certain apps, e.g., users in the `Sales` department inherit access to Salesforce, users in the `Engineering` department inherit access to GitHub, etc... You can use group rules in Okta to put users into the appropriate groups automatically based on their `department` Okta profile attribute, which is sourced directly from your HRIS. This results in completely automating birthright app assignment based on official HR data, which saves a huge amount of toil, delay, and human error!

But what about human error in your HRIS itself? If that's your source of truth, it had better be trustworthy! What if an HR admin makes a typo in a new hire's department value? What if they restructure your company's departments entirely, creating, destroying, or renaming departments without warning? I'll tell you "what if" - a lot of people will lose access to _lot_ of apps! This is a common problem I've seen discussed repeatedly in the Okta admin community, and personally, I've yet to see any recommended solutions that don't ultimately boil down to extolling the virtues of change management and documentation within your HR team.

Don't get me wrong, change management and documentation are vital, but people are only human, and you have to assume mistakes are inevitable. In fact, you should get out ahead of this problem by monitoring logs from your HRIS, so you can detect any unexpected changes before they even make it to Okta. That's outside the scope of this blog post though, and in my opinion, it doesn't eliminate the need to address this risk directly within Okta. Thankfully, there's a built-in Okta feature which enables a surprisingly simple solution: enums! When [adding custom Okta profile attributes](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-add-custom-user-attributes.htm), you can opt to define them as enumerated lists of possible values. If you use this option, it's impossible by design to update a profile attribute with a value that isn't in its pre-defined list of valid values, even if the update is coming from a profile source such as your HRIS.

So what does this look like in practice? Revisiting the above `department` profile attribute example, you can create a new custom enum profile attribute to replace `department` in your Okta group rules, e.g., `department_enum`, into which you can map the exact same department value from your HRIS profile source. The _only_ difference is that updates to this profile attribute can only happen if the value coming from your profile source (or from anywhere) is one of your attribute's enumerated list of valid values:

![Adding a custom Okta profile attribute as an enumerated list of valid values](/images/add-attribute.png)

If your HR team wants to start sending different values from your HRIS to Okta for this profile attribute, they'll need to coordinate a proper change management request with you to update the enumerated list of values first! Otherwise, the updates simply won't happen. Now, this is a great failsafe, since it prevents the sort of catastophic mass-unassignment of apps described above... but it's not exactly ideal either, since this will be entirely silent, and neither you nor your HR team will know there's a problem that needs to be addressed.

Luckily, you can easily automate monitoring and alerting for when invalid data is being imported from your HRIS into Okta too. Let's say your HRIS is Workday. In that case, create a new group in Okta called `Invalid Workday Data` for users with invalid data coming into Okta from Workday as your profile source. Then you can create a group rule to add users to this new `Invalid Workday Data` group if their `department` profile attribute value isn't equal to their `department_enum` profile attribute value. With both of these profile attributes mapped identically in Okta from the same value Workday, this rule will _only_ apply to users with a value in Workday that isn't in your enumerated list of valid values:

![Adding an Okta group rule for invalid Workday data](/images/add-rule.png)

From this point, you can use whatever method you prefer to monitor your Okta tenant for users being added to this group. You can use this monitor to alert your HR team whenever they send invalid values from your HRIS, and have them either correct the values they're sending, or coordinate a proper change management request with you to update the enumerated list of valid values in Okta.

This same technique applies if you want to validate multiple Okta profile attributes, or course. For example, you could create a new custom enum profile attribute to replace `costCenter` in your Okta group rules, e.g., `costCenter_enum`, into which you can map the exact same cost center value from your HRIS profile source. Then you would just need to edit your existing Okta group rule to apply to either the department or the cost center value being invalid:

![Editing an Okta group rule for invalid Workday data](/images/edit-rule.png)

[^1]: HR information system - common examples include Workday or Active Directory.
