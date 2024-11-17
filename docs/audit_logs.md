# Audit Logs

## List user actions and configuration changes within this organization.

### `GET /organization/audit_logs`

### Parameters

- **effective_at** (optional): Return only events whose `effective_at` (Unix seconds) is in this range.
- **project_ids[]** (optional): Return only events for these projects.
- **event_types[]** (optional): Return only events with a `type` in one of these values. For example, `project.created`. For all options, see the documentation for the [audit log object](/docs/api-reference/audit-logs/object).
- **actor_ids[]** (optional): Return only events performed by these actors. Can be a user ID, a service account ID, or an api key tracking ID.
- **actor_emails[]** (optional): Return only events performed by users with these emails.
- **resource_ids[]** (optional): Return only events performed on these targets. For example, a project ID updated.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (optional): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

#### 200

Audit logs listed successfully.

### Examples

#### Request

```bash
curl https://api.openai.com/v1/organization/audit_logs \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json" \

```

#### Response

```
{
    "object": "list",
    "data": [
        {
            "id": "audit_log-xxx_yyyymmdd",
            "type": "project.archived",
            "effective_at": 1722461446,
            "actor": {
                "type": "api_key",
                "api_key": {
                    "type": "user",
                    "user": {
                        "id": "user-xxx",
                        "email": "user@example.com"
                    }
                }
            },
            "project.archived": {
                "id": "proj_abc"
            },
        },
        {
            "id": "audit_log-yyy__20240101",
            "type": "api_key.updated",
            "effective_at": 1720804190,
            "actor": {
                "type": "session",
                "session": {
                    "user": {
                        "id": "user-xxx",
                        "email": "user@example.com"
                    },
                    "ip_address": "127.0.0.1",
                    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            },
            "api_key.updated": {
                "id": "key_xxxx",
                "data": {
                    "scopes": ["resource_2.operation_2"]
                }
            },
        }
    ],
    "first_id": "audit_log-xxx__20240101",
    "last_id": "audit_log_yyy__20240101",
    "has_more": true
}

```

---

