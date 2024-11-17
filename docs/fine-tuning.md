# Fine-tuning

## Creates a fine-tuning job which begins the process of creating a new model from a given dataset.

Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

[Learn more about fine-tuning](/docs/guides/fine-tuning)


### `POST /fine_tuning/jobs`

### Request Body

### Responses

#### 200

OK

### Examples

#### Example Default

Request:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-BK7bzQj3FfZFXr7DbL6xJwfo",
    "model": "gpt-4o-mini"
  }'

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
  training_file="file-abc123",
  model="gpt-4o-mini"
)

```

Response:

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
}

```

#### Example Epochs

Request:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "model": "gpt-4o-mini",
    "hyperparameters": {
      "n_epochs": 2
    }
  }'

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
  training_file="file-abc123",
  model="gpt-4o-mini",
  hyperparameters={
    "n_epochs":2
  }
)

```

Response:

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {"n_epochs": 2},
}

```

#### Example Validation file

Request:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini"
  }'

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
  training_file="file-abc123",
  validation_file="file-def456",
  model="gpt-4o-mini"
)

```

Response:

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
}

```

#### Example W&B Integration

Request:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini",
    "integrations": [
      {
        "type": "wandb",
        "wandb": {
          "project": "my-wandb-project",
          "name": "ft-run-display-name"
          "tags": [
            "first-experiment", "v2"
          ]
        }
      }
    ]
  }'

```

Response:

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": None,
        "run_id": "ftjob-abc123"
      }
    }
  ]
}

```

---

## List your organization's fine-tuning jobs


### `GET /fine_tuning/jobs`

### Parameters

- **after** (optional): Identifier for the last job from the previous pagination request.
- **limit** (optional): Number of fine-tuning jobs to retrieve.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/fine_tuning/jobs?limit=2 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.list()

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-TjX0lMfOniCZX64t9PUQT5hn",
      "created_at": 1689813489,
      "level": "warn",
      "message": "Fine tuning process stopping due to job cancellation",
      "data": null,
      "type": "message"
    },
    { ... },
    { ... }
  ], "has_more": true
}

```

---

## Get info about a fine-tuning job.

[Learn more about fine-tuning](/docs/guides/fine-tuning)


### `GET /fine_tuning/jobs/{fine_tuning_job_id}`

### Parameters

- **fine_tuning_job_id** (required): The ID of the fine-tuning job.


### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ft-AF1WoRqd3aJAHsqc9NY7iL8F \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.retrieve("ftjob-abc123")

```

#### Response

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "davinci-002",
  "created_at": 1692661014,
  "finished_at": 1692661190,
  "fine_tuned_model": "ft:davinci-002:my-org:custom_suffix:7q8mpxmy",
  "organization_id": "org-123",
  "result_files": [
      "file-abc123"
  ],
  "status": "succeeded",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {
      "n_epochs": 4,
      "batch_size": 1,
      "learning_rate_multiplier": 1.0
  },
  "trained_tokens": 5768,
  "integrations": [],
  "seed": 0,
  "estimated_finish": 0
}

```

---

## Immediately cancel a fine-tune job.


### `POST /fine_tuning/jobs/{fine_tuning_job_id}/cancel`

### Parameters

- **fine_tuning_job_id** (required): The ID of the fine-tuning job to cancel.


### Responses

#### 200

OK

### Examples

#### Request

```bash
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.cancel("ftjob-abc123")

```

#### Response

```
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "hyperparameters": {
    "n_epochs":  "auto"
  },
  "status": "cancelled",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}

```

---

## List checkpoints for a fine-tuning job.


### `GET /fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`

### Parameters

- **fine_tuning_job_id** (required): The ID of the fine-tuning job to get checkpoints for.

- **after** (optional): Identifier for the last checkpoint ID from the previous pagination request.
- **limit** (optional): Number of checkpoints to retrieve.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/checkpoints \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

#### Response

```
{
  "object": "list"
  "data": [
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:96olL566:ckpt-step-2000",
      "metrics": {
        "full_valid_loss": 0.134,
        "full_valid_mean_token_accuracy": 0.874
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 2000,
    },
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:7q8mpxmy:ckpt-step-1000",
      "metrics": {
        "full_valid_loss": 0.167,
        "full_valid_mean_token_accuracy": 0.781
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 1000,
    },
  ],
  "first_id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": true
}

```

---

## Get status updates for a fine-tuning job.


### `GET /fine_tuning/jobs/{fine_tuning_job_id}/events`

### Parameters

- **fine_tuning_job_id** (required): The ID of the fine-tuning job to get events for.

- **after** (optional): Identifier for the last event from the previous pagination request.
- **limit** (optional): Number of events to retrieve.

### Responses

#### 200

OK

### Examples

#### Request

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.list_events(
  fine_tuning_job_id="ftjob-abc123",
  limit=2
)

```

#### Response

```
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-ddTJfwuMVpfLXseO0Am0Gqjm",
      "created_at": 1721764800,
      "level": "info",
      "message": "Fine tuning job successfully completed",
      "data": null,
      "type": "message"
    },
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-tyiGuB72evQncpH87xe505Sv",
      "created_at": 1721764800,
      "level": "info",
      "message": "New fine-tuned model created: ft:gpt-4o-mini:openai::7p4lURel",
      "data": null,
      "type": "message"
    }
  ],
  "has_more": true
}

```

---

