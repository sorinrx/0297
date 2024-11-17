# Vector stores

## Returns a list of vector stores.

### `GET /vector_stores`

### Parameters

- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (optional): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (optional): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.


### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_stores = client.beta.vector_stores.list()
print(vector_stores)

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "id": "vs_abc123",
      "object": "vector_store",
      "created_at": 1699061776,
      "name": "Support FAQ",
      "bytes": 139920,
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      }
    },
    {
      "id": "vs_abc456",
      "object": "vector_store",
      "created_at": 1699061776,
      "name": "Support FAQ v2",
      "bytes": 139920,
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      }
    }
  ],
  "first_id": "vs_abc123",
  "last_id": "vs_abc456",
  "has_more": false
}

```

---

## Create a vector store.

### `POST /vector_stores`

### Request Body

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
  -d '{
    "name": "Support FAQ"
  }'

```

```python
from openai import OpenAI
client = OpenAI()

vector_store = client.beta.vector_stores.create(
  name="Support FAQ"
)
print(vector_store)

```

#### Response

```
{
  "id": "vs_abc123",
  "object": "vector_store",
  "created_at": 1699061776,
  "name": "Support FAQ",
  "bytes": 139920,
  "file_counts": {
    "in_progress": 0,
    "completed": 3,
    "failed": 0,
    "cancelled": 0,
    "total": 3
  }
}

```

---

## Retrieves a vector store.

### `GET /vector_stores/{vector_store_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store to retrieve.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_store = client.beta.vector_stores.retrieve(
  vector_store_id="vs_abc123"
)
print(vector_store)

```

#### Response

```
{
  "id": "vs_abc123",
  "object": "vector_store",
  "created_at": 1699061776
}

```

---

## Modifies a vector store.

### `POST /vector_stores/{vector_store_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store to modify.

### Request Body

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
  -d '{
    "name": "Support FAQ"
  }'

```

```python
from openai import OpenAI
client = OpenAI()

vector_store = client.beta.vector_stores.update(
  vector_store_id="vs_abc123",
  name="Support FAQ"
)
print(vector_store)

```

#### Response

```
{
  "id": "vs_abc123",
  "object": "vector_store",
  "created_at": 1699061776,
  "name": "Support FAQ",
  "bytes": 139920,
  "file_counts": {
    "in_progress": 0,
    "completed": 3,
    "failed": 0,
    "cancelled": 0,
    "total": 3
  }
}

```

---

## Delete a vector store.

### `DELETE /vector_stores/{vector_store_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store to delete.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

```python
from openai import OpenAI
client = OpenAI()

deleted_vector_store = client.beta.vector_stores.delete(
  vector_store_id="vs_abc123"
)
print(deleted_vector_store)

```

#### Response

```
{
  id: "vs_abc123",
  object: "vector_store.deleted",
  deleted: true
}

```

---

## Create a vector store file batch.

### `POST /vector_stores/{vector_store_id}/file_batches`

### Parameters

- **vector_store_id** (required): The ID of the vector store for which to create a File Batch.


### Request Body

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/file_batches \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "file_ids": ["file-abc123", "file-abc456"]
    }'

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_file_batch = client.beta.vector_stores.file_batches.create(
  vector_store_id="vs_abc123",
  file_ids=["file-abc123", "file-abc456"]
)
print(vector_store_file_batch)

```

#### Response

```
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "in_progress",
  "file_counts": {
    "in_progress": 1,
    "completed": 1,
    "failed": 0,
    "cancelled": 0,
    "total": 0,
  }
}

```

---

## Retrieves a vector store file batch.

### `GET /vector_stores/{vector_store_id}/file_batches/{batch_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the file batch belongs to.
- **batch_id** (required): The ID of the file batch being retrieved.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_file_batch = client.beta.vector_stores.file_batches.retrieve(
  vector_store_id="vs_abc123",
  batch_id="vsfb_abc123"
)
print(vector_store_file_batch)

```

#### Response

```
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "in_progress",
  "file_counts": {
    "in_progress": 1,
    "completed": 1,
    "failed": 0,
    "cancelled": 0,
    "total": 0,
  }
}

```

---

## Cancel a vector store file batch. This attempts to cancel the processing of files in this batch as soon as possible.

### `POST /vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the file batch belongs to.
- **batch_id** (required): The ID of the file batch to cancel.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST

```

```python
from openai import OpenAI
client = OpenAI()

deleted_vector_store_file_batch = client.beta.vector_stores.file_batches.cancel(
    vector_store_id="vs_abc123",
    file_batch_id="vsfb_abc123"
)
print(deleted_vector_store_file_batch)

```

#### Response

```
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "cancelling",
  "file_counts": {
    "in_progress": 12,
    "completed": 3,
    "failed": 0,
    "cancelled": 0,
    "total": 15,
  }
}

```

---

## Returns a list of vector store files in a batch.

### `GET /vector_stores/{vector_store_id}/file_batches/{batch_id}/files`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the files belong to.
- **batch_id** (required): The ID of the file batch that the files belong to.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (optional): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (optional): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **filter** (optional): Filter by file status. One of `in_progress`, `completed`, `failed`, `cancelled`.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_files = client.beta.vector_stores.file_batches.list_files(
  vector_store_id="vs_abc123",
  batch_id="vsfb_abc123"
)
print(vector_store_files)

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "id": "file-abc123",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123"
    },
    {
      "id": "file-abc456",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123"
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}

```

---

## Returns a list of vector store files.

### `GET /vector_stores/{vector_store_id}/files`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the files belong to.
- **limit** (optional): A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- **order** (optional): Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

- **after** (optional): A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- **before** (optional): A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- **filter** (optional): Filter by file status. One of `in_progress`, `completed`, `failed`, `cancelled`.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_files = client.beta.vector_stores.files.list(
  vector_store_id="vs_abc123"
)
print(vector_store_files)

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "id": "file-abc123",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123"
    },
    {
      "id": "file-abc456",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123"
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}

```

---

## Create a vector store file by attaching a [File](/docs/api-reference/files) to a [vector store](/docs/api-reference/vector-stores/object).

### `POST /vector_stores/{vector_store_id}/files`

### Parameters

- **vector_store_id** (required): The ID of the vector store for which to create a File.


### Request Body

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "file_id": "file-abc123"
    }'

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_file = client.beta.vector_stores.files.create(
  vector_store_id="vs_abc123",
  file_id="file-abc123"
)
print(vector_store_file)

```

#### Response

```
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "created_at": 1699061776,
  "usage_bytes": 1234,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null
}

```

---

## Retrieves a vector store file.

### `GET /vector_stores/{vector_store_id}/files/{file_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the file belongs to.
- **file_id** (required): The ID of the file being retrieved.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"

```

```python
from openai import OpenAI
client = OpenAI()

vector_store_file = client.beta.vector_stores.files.retrieve(
  vector_store_id="vs_abc123",
  file_id="file-abc123"
)
print(vector_store_file)

```

#### Response

```
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "created_at": 1699061776,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null
}

```

---

## Delete a vector store file. This will remove the file from the vector store but the file itself will not be deleted. To delete the file, use the [delete file](/docs/api-reference/files/delete) endpoint.

### `DELETE /vector_stores/{vector_store_id}/files/{file_id}`

### Parameters

- **vector_store_id** (required): The ID of the vector store that the file belongs to.
- **file_id** (required): The ID of the file to delete.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE

```

```python
from openai import OpenAI
client = OpenAI()

deleted_vector_store_file = client.beta.vector_stores.files.delete(
    vector_store_id="vs_abc123",
    file_id="file-abc123"
)
print(deleted_vector_store_file)

```

#### Response

```
{
  id: "file-abc123",
  object: "vector_store.file.deleted",
  deleted: true
}

```

---

