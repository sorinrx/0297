# Users

## Lists all of the users in the organization.

### `GET /organization/users`

### Parameters

- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

Users listed successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "object": "organization.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "added_at": 1711471533
        }
    ],
    "first_id": "user-abc",
    "last_id": "user-xyz",
    "has_more": false
}

```

---

## Retrieves a user by their identifier.

### `GET /organization/users/{user_id}`

### Parameters

- **user_id** (required): The ID of the user.

### Responses

#### 200

User retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}

```

---

## Modifies a user's role in the organization.

### `POST /organization/users/{user_id}`

### Parameters

- **user_id** (required): The ID of the user.

### Request Body

### Responses

#### 200

User role updated successfully.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'

```

#### Response

```json
{
    "object": "organization.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}

```

---

## Deletes a user from the organization.

### `DELETE /organization/users/{user_id}`

### Parameters

- **user_id** (required): The ID of the user.

### Responses

#### 200

User deleted successfully.

### Examples

#### Request

```bash
curl -X DELETE https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.user.deleted",
    "id": "user_abc",
    "deleted": true
}

```

---

