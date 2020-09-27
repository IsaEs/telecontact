# API

## Public

|No| Name | Method | Endpoint | Explanation |
|:----:|:----|:------:|:--------|:-------------|
|1|Post Form|POST|telecontact.me/form/{hash_id}|twelve letter word random key|

## User

- URL: telecontact.me
- Base Prefix: /api/v1/

|No| Name | Method | Endpoint | Explanation |
|:----:|:----|:------:|:--------|:-------------|
|1|Update Email|PUT|user/email|             |
|2|Update Preferences|PUT|/user/preferences|             |
|3|Login|POST|v1/login|             |
|4|Get All Messages|POST|user/messages|             |
|5|Delete Messages|DELETE|user/messages|             |
|6|Get All Forms|POST|user/forms|             |
|7|Delete Form|DELETE|user/form|             |

### EMAIL

#### Add User

- ENDPOINT: /v1/api/add_user
- Method : PUT

Headers:

    Content-Type: application/json
    Authorization: Bearer {Token}
Body:

```json
    {
      "name": "İsa Es",
      "username": "sveyda",
      "password": "Hello",
      "email": "sveyda@zumre.com",
      "phone": "05550005500"
    }
```
