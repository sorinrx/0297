# Projects

## Returns a list of projects.

### `GET /organization/projects`

### Parameters

- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **include_archived** (optional): If `true` returns all projects including those that have been `archived`. Archived projects are not included by default.

### Responses

#### 200

Projects listed successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects?after=proj_abc&limit=20&include_archived=false \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "id": "proj_abc",
            "object": "organization.project",
            "name": "Project example",
            "created_at": 1711471533,
            "archived_at": null,
            "status": "active"
        }
    ],
    "first_id": "proj-abc",
    "last_id": "proj-xyz",
    "has_more": false
}

```

---

## Create a new project in the organization. Projects can be created and archived, but cannot be deleted.

### `POST /organization/projects`

### Request Body

### Responses

#### 200

Project created successfully.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project ABC"
  }'

```

#### Response

```json
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project ABC",
    "created_at": 1711471533,
    "archived_at": null,
    "status": "active"
}

```

---

## Retrieves a project.

### `GET /organization/projects/{project_id}`

### Parameters

- **project_id** (required): The ID of the project.

### Responses

#### 200

Project retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project example",
    "created_at": 1711471533,
    "archived_at": null,
    "status": "active"
}

```

---

## Modifies a project in the organization.

### `POST /organization/projects/{project_id}`

### Parameters

- **project_id** (required): The ID of the project.

### Request Body

### Responses

#### 200

Project updated successfully.

#### 400

Error response when updating the default project.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Project DEF"
  }'

```

---

## Returns a list of API keys in the project.

### `GET /organization/projects/{project_id}/api_keys`

### Parameters

- **project_id** (required): The ID of the project.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

Project API keys listed successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys?after=key_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.api_key",
            "redacted_value": "sk-abc...def",
            "name": "My API Key",
            "created_at": 1711471533,
            "id": "key_abc",
            "owner": {
                "type": "user",
                "user": {
                    "object": "organization.project.user",
                    "id": "user_abc",
                    "name": "First Last",
                    "email": "user@example.com",
                    "role": "owner",
                    "added_at": 1711471533
                }
            }
        }
    ],
    "first_id": "key_abc",
    "last_id": "key_xyz",
    "has_more": false
}

```

---

## Retrieves an API key in the project.

### `GET /organization/projects/{project_id}/api_keys/{key_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **key_id** (required): The ID of the API key.

### Responses

#### 200

Project API key retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.api_key",
    "redacted_value": "sk-abc...def",
    "name": "My API Key",
    "created_at": 1711471533,
    "id": "key_abc",
    "owner": {
        "type": "user",
        "user": {
            "object": "organization.project.user",
            "id": "user_abc",
            "name": "First Last",
            "email": "user@example.com",
            "role": "owner",
            "added_at": 1711471533
        }
    }
}

```

---

## Deletes an API key from the project.

### `DELETE /organization/projects/{project_id}/api_keys/{key_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **key_id** (required): The ID of the API key.

### Responses

#### 200

Project API key deleted successfully.

#### 400

Error response for various conditions.

### Examples

#### Request

```bash
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.api_key.deleted",
    "id": "key_abc",
    "deleted": true
}

```

---

## Archives a project in the organization. Archived projects cannot be used or updated.

### `POST /organization/projects/{project_id}/archive`

### Parameters

- **project_id** (required): The ID of the project.

### Responses

#### 200

Project archived successfully.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/archive \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "id": "proj_abc",
    "object": "organization.project",
    "name": "Project DEF",
    "created_at": 1711471533,
    "archived_at": 1711471533,
    "status": "archived"
}

```

---

## Returns a list of service accounts in the project.

### `GET /organization/projects/{project_id}/service_accounts`

### Parameters

- **project_id** (required): The ID of the project.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

Project service accounts listed successfully.

#### 400

Error response when project is archived.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts?after=custom_id&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.service_account",
            "id": "svc_acct_abc",
            "name": "Service Account",
            "role": "owner",
            "created_at": 1711471533
        }
    ],
    "first_id": "svc_acct_abc",
    "last_id": "svc_acct_xyz",
    "has_more": false
}

```

---

## Creates a new service account in the project. This also returns an unredacted API key for the service account.

### `POST /organization/projects/{project_id}/service_accounts`

### Parameters

- **project_id** (required): The ID of the project.

### Request Body

### Responses

#### 200

Project service account created successfully.

#### 400

Error response when project is archived.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/service_accounts \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "name": "Production App"
  }'

```

#### Response

```json
{
    "object": "organization.project.service_account",
    "id": "svc_acct_abc",
    "name": "Production App",
    "role": "member",
    "created_at": 1711471533,
    "api_key": {
        "object": "organization.project.service_account.api_key",
        "value": "sk-abcdefghijklmnop123",
        "name": "Secret Key",
        "created_at": 1711471533,
        "id": "key_abc"
    }
}

```

---

## Retrieves a service account in the project.

### `GET /organization/projects/{project_id}/service_accounts/{service_account_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **service_account_id** (required): The ID of the service account.

### Responses

#### 200

Project service account retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.service_account",
    "id": "svc_acct_abc",
    "name": "Service Account",
    "role": "owner",
    "created_at": 1711471533
}

```

---

## Deletes a service account from the project.

### `DELETE /organization/projects/{project_id}/service_accounts/{service_account_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **service_account_id** (required): The ID of the service account.

### Responses

#### 200

Project service account deleted successfully.

### Examples

#### Request

```bash
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/service_accounts/svc_acct_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.service_account.deleted",
    "id": "svc_acct_abc",
    "deleted": true
}

```

---

## Returns a list of users in the project.

### `GET /organization/projects/{project_id}/users`

### Parameters

- **project_id** (required): The ID of the project.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

Project users listed successfully.

#### 400

Error response when project is archived.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/users?after=user_abc&limit=20 \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "object": "organization.project.user",
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

## Adds a user to the project. Users must already be members of the organization to be added to a project.

### `POST /organization/projects/{project_id}/users`

### Parameters

- **project_id** (required): The ID of the project.

### Request Body

### Responses

#### 200

User added to project successfully.

#### 400

Error response for various conditions.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "user_id": "user_abc",
      "role": "member"
  }'

```

#### Response

```json
{
    "object": "organization.project.user",
    "id": "user_abc",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}

```

---

## Retrieves a user in the project.

### `GET /organization/projects/{project_id}/users/{user_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **user_id** (required): The ID of the user.

### Responses

#### 200

Project user retrieved successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}

```

---

## Modifies a user's role in the project.

### `POST /organization/projects/{project_id}/users/{user_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **user_id** (required): The ID of the user.

### Request Body

### Responses

#### 200

Project user's role updated successfully.

#### 400

Error response for various conditions.

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "role": "owner"
  }'

```

#### Response

```json
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}

```

---

## Deletes a user from the project.

### `DELETE /organization/projects/{project_id}/users/{user_id}`

### Parameters

- **project_id** (required): The ID of the project.
- **user_id** (required): The ID of the user.

### Responses

#### 200

Project user deleted successfully.

#### 400

Error response for various conditions.

### Examples

#### Request

```bash
curl -X DELETE https://api.openai.com/v1/organization/projects/proj_abc/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"

```

#### Response

```json
{
    "object": "organization.project.user.deleted",
    "id": "user_abc",
    "deleted": true
}

```

---

