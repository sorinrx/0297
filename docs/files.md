# Files

## Returns a list of files.

### `GET /files`

### Parameters

- **purpose** (optional): Only return files with the given purpose.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 10,000, and the default is 10,000.

- **order** (optional): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.


### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.files.list()

```

#### Response

```
{
  "data": [
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "filename": "salesOverview.pdf",
      "purpose": "assistants",
    },
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "filename": "puppy.jsonl",
      "purpose": "fine-tune",
    }
  ],
  "object": "list"
}

```

---

## Upload a file that can be used across various endpoints. Individual files can be up to 512 MB, and the size of all files uploaded by one organization can be up to 100 GB.

The Assistants API supports files up to 2 million tokens and of specific file types. See the [Assistants Tools guide](/docs/assistants/tools) for details.

The Fine-tuning API only supports `.jsonl` files. The input also has certain required formats for fine-tuning [chat](/docs/api-reference/fine-tuning/chat-input) or [completions](/docs/api-reference/fine-tuning/completions-input) models.

The Batch API only supports `.jsonl` files up to 100 MB in size. The input also has a specific required [format](/docs/api-reference/batch/request-input).

Please [contact us](https://help.openai.com/) if you need to increase these storage limits.


### `POST /files`

### Request Body

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"

```

```python
from openai import OpenAI
client = OpenAI()

client.files.create(
  file=open("mydata.jsonl", "rb"),
  purpose="fine-tune"
)

```

#### Response

```
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}

```

---

## Delete a file.

### `DELETE /files/{file_id}`

### Parameters

- **file_id** (required): The ID of the file to use for this request.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/files/file-abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.files.delete("file-abc123")

```

#### Response

```
{
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}

```

---

## Returns information about a specific file.

### `GET /files/{file_id}`

### Parameters

- **file_id** (required): The ID of the file to use for this request.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.files.retrieve("file-abc123")

```

#### Response

```
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}

```

---

## Returns the contents of the specified file.

### `GET /files/{file_id}/content`

### Parameters

- **file_id** (required): The ID of the file to use for this request.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/files/file-abc123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > file.jsonl

```

```python
from openai import OpenAI
client = OpenAI()

content = client.files.content("file-abc123")

```

---

