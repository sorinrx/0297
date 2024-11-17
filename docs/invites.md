# Invites

## Returns a list of invites in the organization.

### `GET /organization/invites`

### Parameters

- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

Invites listed successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/invites?after=invite-abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "organization.invite",
      "id": "invite-abc",
      "email": "user@example.com",
      "role": "owner",
      "status": "accepted",
      "invited_at": 1711471533,
      "expires_at": 1711471533,
      "accepted_at": 1711471533
    }
  ],
  "first_id": "invite-abc",
  "last_id": "invite-abc",
  "has_more": false
}

```

---

## Create an invite for a user to the organization. The invite must be accepted by the user before they have access to the organization.

### `POST /organization/invites`

### Request Body

### Responses

#### 200

User invited successfully.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/invites \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "email": "user@example.com",
      "role": "owner"
  }'

```

#### Response

```json
{
    "object": "organization.invite",
    "id": "invite-abc",
    "email": "user@example.com",
    "role": "owner",
    "invited_at": 1711471533,
    "expires_at": 1711471533,
    "accepted_at": null
}

```

---

## Retrieves an invite.

### `GET /organization/invites/{invite_id}`

### Parameters

- **invite_id** (required): The ID of the invite to retrieve.

### Responses

#### 200

Invite retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.invite",
    "id": "invite-abc",
    "email": "user@example.com",
    "role": "owner",
    "status": "accepted",
    "invited_at": 1711471533,
    "expires_at": 1711471533,
    "accepted_at": 1711471533
}

```

---

## Delete an invite. If the invite has already been accepted, it cannot be deleted.

### `DELETE /organization/invites/{invite_id}`

### Parameters

- **invite_id** (required): The ID of the invite to delete.

### Responses

#### 200

Invite deleted successfully.

### Examples

#### Request

```bash
curl -X DELETE https://api.openai.com/v1/organization/invites/invite-abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.invite.deleted",
    "id": "invite-abc",
    "deleted": true
}

```

---

