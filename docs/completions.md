# Completions

## Creates a completion for the provided prompt and parameters.

### `POST /completions`

### Request Body

### Responses

#### 200

OK

### Examples

#### Example No streaming

Request:

```bash
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_model_id",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'

```

```python
from openai import OpenAI
client = OpenAI()

client.completions.create(
  model="VAR_model_id",
  prompt="Say this is a test",
  max_tokens=7,
  temperature=0
)

```

Response:

```
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "VAR_model_id",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}

```

#### Example Streaming

Request:

```bash
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_model_id",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0,
    "stream": true
  }'

```

```python
from openai import OpenAI
client = OpenAI()

for chunk in client.completions.create(
  model="VAR_model_id",
  prompt="Say this is a test",
  max_tokens=7,
  temperature=0,
  stream=True
):
  print(chunk.choices[0].text)

```

Response:

```
{
  "id": "cmpl-7iA7iJjj8V2zOkCGvWF2hAkDWBQZe",
  "object": "text_completion",
  "created": 1690759702,
  "choices": [
    {
      "text": "This",
      "index": 0,
      "logprobs": null,
      "finish_reason": null
    }
  ],
  "model": "gpt-3.5-turbo-instruct"
  "system_fingerprint": "fp_44709d6fcb",
}

```

---

