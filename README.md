# Telecontact.me - API of your Contact page

TeleContact.me is contact form api for your websites its best for static webpages and also entegrated with Telegram.
You will direclty message from your phone via telegram. It allows to create a free forms via telegram.
You can also set your email adress via web interface and can get message from your email.

## Register

There is only option to register telecontact.me by having telegram account and start to using our telegram bot [telecontactformbot](https://telegram.me/telecontactformbot). After that you can use basic functions of telecontact.me.

You can add contact form. List your form and get instantly notified when you get update from form.

## API

|No| Name | Method | Endpoint | Explanation |
|:----:|:----|:------:|:--------|:-------------|
|1|Post Form|POST|telecontact.me/form/{hash_id}|             |
|2|Update Email|PUT|telecontact.me/api/v1/user/email|             |
|2|Update Preferences|PUT|telecontact.me/api/v1/user/email|             |
|3|Login|POST|telecontact.me/api/v1/login|             |
|4|Messages|POST|telecontact.me/api/v1/user/messages|             |