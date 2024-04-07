---
title: Enforcing Google Chrome Policy on Windows via Third-Party ADMX in Intune
description:
date: 2019-07-07
tags:
  - Old Post
  - Mac Admin
  - Windows Admin
disclaimer:
  text: This is an old post. Content may be out of date.
---

I've been following the Windows MDM landscape closely as it's evolved drastically over the course of the past few years, as capabilities to enforce the same policies one might take for granted in a legacy Active Directory environment have slowly trickled into Microsoft's own native Intune system. As Windows use has also become more common in my corporate environment, which happens to be a G Suite shop, the ability to enforce Google Chrome policy on Windows has become increasingly important as well.

Although Google has published their own documentation page, [Manage Chrome Browser with Microsoft Intune](https://support.google.com/chrome/a/answer/9102677), critical details have sadly remained missing or incorrect for a while now, leaving it up to industry professionals to [piece together working configurations](https://www.petervanderwoude.nl/post/deep-dive-ingesting-third-party-admx-files/comment-page-2/#comment-78469) or wait patiently for Google to complete and correct their documentation.

After finally getting this working myself, I want to make sure I document it for others, as well as my own future use. Here is how I've successfully used Intune to blacklist all Chrome extensions by default, whitelist specific Chrome extensions if the end user wants to opt-in to install them, and force installation of other specific Chrome extensions without requiring user input or approval:

#### Ingest the Chrome ADMX file into Intune

1. Download the [Chrome ADMX templates](https://enterprise.google.com/chrome/chrome-browser/#download)
2. Sign in to the [Microsoft Azure portal](https://portal.azure.com/)
3. Go to **Intune** > **Device configuration** > **Profiles**.
4. Next to **Devices configuration – Profiles**, click **Create profile**.
5. Enter the following text in these fields:
   - Name: `Windows 10 – Chrome configuration`
   - Description: `Configure Chrome via ingested ADMX`
   - Platform: `Windows 10 and later`
   - Profile type: `Custom`
   - Settings: `Custom` (select from drop-down list)
6. Selecting **Custom** in the step above opens a new menu for OMA-URI settings. Click **Add** to add specific policies you can configure and enter the following text:
   - Name: `Chrome ADMX Ingestion`
   - Description: `Ingest Chrome ADMX`
   - OMA-URI: `./Device/Vendor/MSFT/Policy/ConfigOperations/ADMXInstall/Chrome/Policy/ChromeAdmx`
   - Data type: `String` (select from drop-down list)
7. Once you select **String**, a **Value** text field opens below. Using your preferred text editor, copy the full text from the downloaded **chrome.admx** file (from step 1 above).
8. In the **Value** field, paste the copied **chrome.admx** text.
9. Click **OK** and **OK** again to save the Custom OMA-URI settings.
10. Click **Create** to create the new profile.

#### Blacklist all Chrome Extensions by Default

1. Sign in to the [Microsoft Azure portal](https://portal.azure.com/)
2. Go to **Intune** > **Device configuration** > **Profiles**.
3. Click the **Windows 10 – Chrome configuration** profile you created previously.
4. Select **Properties** > **Settings** > **Configure** to open the Custom OMA-URI settings.
5. Click **Add** to add a row.
6. Enter the following text in these fields:
   - Name: `Chrome – ADMX – ExtensionInstallBlacklist`
   - Description: `Blacklist All Chrome Extensions by Default`
   - OMA-URI: `./Device/Vendor/MSFT/Policy/Config/Chrome~Policy~googlechrome~Extensions/ExtensionInstallBlacklist`
   - Data type: `String` (select from drop-down list)
   - Value: `<enabled/> <data id="ExtensionInstallBlacklistDesc" value="1&#xF000;*"/>`

#### Whitelist Specific Chrome Extensions for Users to Install

1. Sign in to the [Microsoft Azure portal](https://portal.azure.com/)
2. Go to **Intune** > **Device configuration** > **Profiles**.
3. Click the **Windows 10 – Chrome configuration** profile you created previously.
4. Select **Properties** > **Settings** > **Configure** to open the Custom OMA-URI settings.
5. Click **Add** to add a row.
6. Enter the following text in these fields (in my example, this whitelists the [1Password (aomjjhallfgjeglblehebfpbcfeobpgk)](https://chrome.google.com/webstore/detail/1password-extension-deskt/aomjjhallfgjeglblehebfpbcfeobpgk) and [1Password X (aeblfdkhhhdcdjpifhhbdiojplfjncoa)](https://chrome.google.com/webstore/detail/1password-x-%E2%80%93-password-ma/aeblfdkhhhdcdjpifhhbdiojplfjncoa) Chrome extensions):
   - Name: `Chrome – ADMX – ExtensionInstallWhitelist`
   - Description: `Whitelist Specific Chrome Extensions`
   - OMA-URI: `./Device/Vendor/MSFT/Policy/Config/Chrome~Policy~googlechrome~Extensions/ExtensionInstallWhitelist`
   - Data type: `String` (select from drop-down list)
   - Value: `<enabled/> <data id="ExtensionInstallWhitelistDesc" value="1&#xF000;aomjjhallfgjeglblehebfpbcfeobpgk&#xF000;2&#xF000;aeblfdkhhhdcdjpifhhbdiojplfjncoa"/>`

Note: for the **Value** field, when creating a key-value pair list with multiple entries, use `&#xF000;` as the separator.

#### Force Install Specific Chrome Extensions as Mandatory

1. Sign in to the [Microsoft Azure portal](https://portal.azure.com/)
2. Go to **Intune** > **Device configuration** > **Profiles**.
3. Click the **Windows 10 – Chrome configuration** profile you created previously.
4. Select **Properties** > **Settings** > **Configure** to open the Custom OMA-URI settings.
5. Click **Add** to add a row.
6. Enter the following text in these fields: (in my example, this forces the [uBlock Origin (cjpalhdlnbpafiamejdnhcphjbkeiagm)](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm) Chrome extension):
   - Name: `Chrome – ADMX – ExtensionInstallForcelist`
   - Description: `Force Specific Chrome Extensions`
   - OMA-URI: `./Device/Vendor/MSFT/Policy/Config/Chrome~Policy~googlechrome~Extensions/ExtensionInstallForcelist`
   - Data type: `String` (select from drop-down list)
   - Value: `<enabled/> <data id="ExtensionInstallForcelistDesc" value="1&#xF000;cjpalhdlnbpafiamejdnhcphjbkeiagm;https://clients2.google.com/service/update2/crx"/>`

Note: for the **Value** field, when creating an ExtensionInstallForcelist, each Chrome extension entry should have its installation source URL appended to the extension ID following a semicolon. In my example, `cjpalhdlnbpafiamejdnhcphjbkeiagm;https://clients2.google.com/service/update2/crx` forces installation of extension ID `cjpalhdlnbpafiamejdnhcphjbkeiagm` from source `https://clients2.google.com/service/update2/crx` (direct from Google itself).

#### Confirm Chrome Policy is Enforced

1. Allow time for Intune to propagate the policy to Chrome on one of the devices you’re managing. If the policy is taking time to push, verify that the device is enrolled and you have synced the device to get the latest policies from Intune.
2. On a managed device, open **Google Chrome**.
3. In the address bar, enter `chrome://policy` to verify that the policy you set is enforced.

As you can see if you read Google's documentation, they've also published their own curated list of [Common Chrome Browser policies for Microsoft Intune](https://docs.google.com/spreadsheets/d/1d62txalah9kyEoJPK5hDS2Lo6cwHX7oPVQrm8ROfNHg/edit#gid=0), which should help get you started if you want to enforce some more policies in addition to my above examples, though this list is unfortunately far from complete for now.
