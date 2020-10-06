# Telecontact.me - API of your Contact page

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://telecontact.me)

TeleContact.me is a contact form solution for your websites. A free solution for static web pages.

-----------------

You will instantly get messaged from the contact page to your phone via telegram. It allows you to create free endpoints and allow you to manage it.
Telecontact me works integrated with Telegram so there is only the option to register telecontact.me by having a telegram account (for now) and start to use our telegram bot [telecontactformbot](https://telegram.me/telecontactformbot). After that, you can use the basic functions of telecontact.me. For extra features like saving messages or sending a notification email to your mail address, you can use a dashboard with [Signin](https://www.telecontact.me/signin) here. You need to password via our bot to Sign in with your telegram username.

## Contact Form Example

- Create your hash_id for your domain.
- Copy example form below and replace {HASH_ID} with your one.
- Handle submit event with how ever you want.

```html
<form action="https://telecontact.me/form/{HASH_ID}" method="POST">
  <label>
   Name:
  <input type="text" name="name">
  </label>
  <label>
   Email:
   <input type="email" name="replyto">
  </label>
  <label>
  Message:
  <textarea name="message"></textarea>
  </label>
  <input type="submit" value="Send">
</form>
```

![Example Form](_readme_/exampleform.png "Example Form Telecontact")


![alt text](_readme_/telegram_message.png "Example Form Telecontact")
