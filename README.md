# Telecontact.me - API of your Contact page

TeleContact.me is contact form api for your websites its best for static webpages.
You will instantly get messaged from contact page to your phone via telegram. It allows to create a free endpoinst and allow you to managed it.

Telecontact me works entegrated with Telegram so there is only option to register telecontact.me by having telegram account (for now) and start to using our telegram bot [telecontactformbot](https://telegram.me/telecontactformbot). After that you can use basic functions of telecontact.me. For extra features like saving messages or sending notifiction email to your mail address you can use dashboard with [login](https://telecontact.me/login) here. You need to password via our bot to login with your telegram username.

## API

|No| Name | Method | Endpoint | Explanation |
|:----:|:----|:------:|:--------|:-------------|
|1|Post Form|POST|telecontact.me/form/{hash_id}|             |
|2|Update Email|PUT|telecontact.me/api/v1/user/email|             |
|2|Update Preferences|PUT|telecontact.me/api/v1/user/email|             |
|3|Login|POST|telecontact.me/api/v1/login|             |
|4|Messages|POST|telecontact.me/api/v1/user/messages|             |