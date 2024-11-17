# Models

## Lists the currently available models, and provides basic information about each one such as the owner and availability.

### `GET /models`

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.models.list()

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "id": "model-id-0",
      "object": "model",
      "created": 1686935002,
      "owned_by": "organization-owner"
    },
    {
      "id": "model-id-1",
      "object": "model",
      "created": 1686935002,
      "owned_by": "organization-owner",
    },
    {
      "id": "model-id-2",
      "object": "model",
      "created": 1686935002,
      "owned_by": "openai"
    },
  ],
  "object": "list"
}

```

---

## Retrieves a model instance, providing basic information about the model such as the owner and permissioning.

### `GET /models/{model}`

### Parameters

- **model** (required): The ID of the model to use for this request

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/models/VAR_model_id \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.models.retrieve("VAR_model_id")

```

#### Response

```
{
  "id": "VAR_model_id",
  "object": "model",
  "created": 1686935002,
  "owned_by": "openai"
}

```

---

## Delete a fine-tuned model. You must have the Owner role in your organization to delete a model.

### `DELETE /models/{model}`

### Parameters

- **model** (required): The model to delete

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/models/ft:gpt-4o-mini:acemeco:suffix:abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.models.delete("ft:gpt-4o-mini:acemeco:suffix:abc123")

```

#### Response

```
{
  "id": "ft:gpt-4o-mini:acemeco:suffix:abc123",
  "object": "model",
  "deleted": true
}

```

---

