# SmartlyQ CLI

[![npm](https://img.shields.io/npm/v/%40smartlyqofficial%2Fcli)](https://www.npmjs.com/package/@smartlyqofficial/cli)

The official command line for the [SmartlyQ API](https://docs.smartlyq.com) - social posting and scheduling, AI content generation (articles, images, video, audio, presentations), SEO research, CRM, chatbots, and more, from one API key.

Built on the official [Node.js SDK](https://www.npmjs.com/package/@smartlyqofficial/node): every SDK method is a CLI command.

## Installation

```bash
npm install -g @smartlyqofficial/cli
```

Requires Node.js 18 or newer.

## Login

```bash
smartlyq login
```

You are prompted for your API key (input is not echoed); it is stored in `~/.smartlyq/config.json` with owner-only permissions. Get a key from your [Developer Dashboard](https://app.smartlyq.com) - keys look like `sqk_live_xxxxxxxxxxxx` (production) or `sqk_test_xxxxxxxxxxxx` (sandbox - free simulated responses, no charges).

Alternatively set `SMARTLYQ_API_KEY`, or pass `--api-key` per command. Resolution order: `--api-key` flag, then the environment variable, then the config file. `smartlyq logout` deletes the stored key.

## Usage

Commands mirror the SDK surface: `smartlyq <resource> <method> [pathArgs...] [flags]`.

```bash
# Who am I?
smartlyq account get-me

# Publish a social post right now
smartlyq social create-post --data '{"text":"Hello from the SmartlyQ CLI!","account_ids":["acc_123"]}'

# Generate an image with AI (returns a job)
smartlyq images generate --data '{"prompt":"A minimalist product shot of a smart speaker"}'

# Poll the job until it completes
smartlyq jobs get job_abc123

# SEO keyword research
smartlyq seo keyword-research --data '{"keyword":"ai marketing","location":"United States"}'

# List draft articles, page 2
smartlyq articles list --query 'status=draft&page=2'
```

Request bodies can also come from a file or stdin:

```bash
smartlyq social create-post --data @post.json
cat post.json | smartlyq social create-post --data -
```

`smartlyq --help` lists all resources, `smartlyq <resource> --help` lists its methods, and `smartlyq <resource> <method> --help` shows the path arguments and the endpoint it calls.

## Flags

| Flag | Description |
| --- | --- |
| `--data <json>` | Request body as JSON. `@file.json` reads a file, `-` reads stdin. |
| `--query <query>` | Query parameters as `k=v&k2=v2` pairs or a JSON object. |
| `--profile <id>` | Act on behalf of a managed Profile (sent as `X-Profile-Id`). |
| `--idempotency-key <key>` | Idempotency key for safely retrying writes. |
| `--api-key <key>` | API key for this invocation (overrides env and config file). |
| `--base-url <url>` | API base URL. Defaults to `https://api.smartlyq.com/v1`. |
| `--output <mode>` | `pretty` (indented JSON, default) or `json` (compact). |
| `--timeout <ms>` | Request timeout in milliseconds. |

Errors print to stderr as `Error <status> <code>: <message> (request <id>)` and exit with code 1.

## Command Reference

Full request/response documentation lives at [docs.smartlyq.com](https://docs.smartlyq.com).

<!-- BEGIN GENERATED REFERENCE -->

### Account

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq account get-me` | `GET /me` | Get current user profile |
| `smartlyq account get-me-usage [--query <query>]` | `GET /me/usage` | Get usage summary |
| `smartlyq account get-me-balance` | `GET /me/balance` | Get wallet balance |
| `smartlyq account get-billing` | `GET /me/billing` | Billing overview |

### AI Captain

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq captain send-message --data <json>` | `POST /captain/messages` | Send AI Captain message |
| `smartlyq captain list-conversations [--query <query>]` | `GET /captain/conversations` | List AI Captain conversations |
| `smartlyq captain get-conversation <conversation-id>` | `GET /captain/conversations/{conversation_id}` | Get AI Captain conversation |

### Analytics

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq analytics get-overview [--query <query>]` | `GET /analytics/overview` | Get analytics overview |
| `smartlyq analytics get-posts [--query <query>]` | `GET /analytics/posts` | Get post analytics |
| `smartlyq analytics get-account <account-id> [--query <query>]` | `GET /analytics/accounts/{account_id}` | Get account analytics |
| `smartlyq analytics daily-metrics [--query <query>]` | `GET /analytics/daily-metrics` | Daily metrics |
| `smartlyq analytics best-time [--query <query>]` | `GET /analytics/best-time` | Best time to post |
| `smartlyq analytics content-decay [--query <query>]` | `GET /analytics/content-decay` | Content decay |
| `smartlyq analytics posting-frequency [--query <query>]` | `GET /analytics/posting-frequency` | Posting frequency vs engagement |
| `smartlyq analytics post-timeline <post-id>` | `GET /analytics/posts/{post_id}/timeline` | Post metric timeline |
| `smartlyq analytics inbox-volume [--query <query>]` | `GET /analytics/inbox/volume` | Inbox volume |
| `smartlyq analytics inbox-heatmap [--query <query>]` | `GET /analytics/inbox/heatmap` | Inbox heatmap |
| `smartlyq analytics inbox-source-breakdown [--query <query>]` | `GET /analytics/inbox/source-breakdown` | Inbox source breakdown |
| `smartlyq analytics inbox-response-time [--query <query>]` | `GET /analytics/inbox/response-time` | Inbox response time |
| `smartlyq analytics inbox-top-accounts [--query <query>]` | `GET /analytics/inbox/top-accounts` | Inbox top accounts |
| `smartlyq analytics inbox-conversations [--query <query>]` | `GET /analytics/inbox/conversations` | Inbox conversation stats |
| `smartlyq analytics inbox-conversation-detail <conversation-id>` | `GET /analytics/inbox/conversations/{conversation_id}` | Conversation analytics |
| `smartlyq analytics get-youtube-channel-insights [--query <query>]` | `GET /analytics/youtube/channel-insights` | YouTube channel insights |
| `smartlyq analytics get-youtube-daily-views [--query <query>]` | `GET /analytics/youtube/daily-views` | YouTube daily views |
| `smartlyq analytics get-youtube-video-retention [--query <query>]` | `GET /analytics/youtube/video-retention` | YouTube audience retention |
| `smartlyq analytics get-youtube-demographics [--query <query>]` | `GET /analytics/youtube/demographics` | YouTube viewer demographics |

### Articles

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq articles generate --data <json>` | `POST /articles/generate` | Generate article |
| `smartlyq articles list [--query <query>]` | `GET /articles` | List articles |
| `smartlyq articles get <article-id>` | `GET /articles/{article_id}` | Get article |
| `smartlyq articles delete <article-id>` | `DELETE /articles/{article_id}` | Delete article |

### Audio

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq audio text-to-speech --data <json>` | `POST /audio/text-to-speech` | Text to speech |
| `smartlyq audio speech-to-text --data <json>` | `POST /audio/speech-to-text` | Speech to text |
| `smartlyq audio get <audio-id>` | `GET /audio/{audio_id}` | Get audio |

### Automations

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq automations list [--query <query>]` | `GET /automations` | List automations |
| `smartlyq automations get <automation-id>` | `GET /automations/{automation_id}` | Get automation |
| `smartlyq automations activate <automation-id>` | `POST /automations/{automation_id}/activate` | Activate automation |
| `smartlyq automations deactivate <automation-id>` | `POST /automations/{automation_id}/deactivate` | Pause automation |
| `smartlyq automations trigger <automation-id> [--data <json>]` | `POST /automations/{automation_id}/trigger` | Trigger automation |
| `smartlyq automations duplicate <automation-id>` | `POST /automations/{automation_id}/duplicate` | Duplicate an automation |
| `smartlyq automations list-versions <automation-id>` | `GET /automations/{automation_id}/versions` | List automation versions |
| `smartlyq automations get-version <automation-id> <version>` | `GET /automations/{automation_id}/versions/{version}` | Get one automation version |
| `smartlyq automations restore-version <automation-id> <version>` | `POST /automations/{automation_id}/versions/{version}/restore` | Restore an automation version |
| `smartlyq automations list-runs <automation-id> [--query <query>]` | `GET /automations/{automation_id}/runs` | List runs |
| `smartlyq automations get-run <automation-id> <run-id>` | `GET /automations/{automation_id}/runs/{run_id}` | Get run |

### Chatbot

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq chatbots list [--query <query>]` | `GET /chatbots` | List chatbots |
| `smartlyq chatbots create --data <json>` | `POST /chatbots` | Create chatbot |
| `smartlyq chatbots get <id>` | `GET /chatbots/{id}` | Get chatbot |
| `smartlyq chatbots update <id> --data <json>` | `PATCH /chatbots/{id}` | Update chatbot |
| `smartlyq chatbots delete <id>` | `DELETE /chatbots/{id}` | Delete chatbot |
| `smartlyq chatbots train <id>` | `POST /chatbots/{id}/train` | Start chatbot training |
| `smartlyq chatbots get-train-status <id>` | `GET /chatbots/{id}/train-status` | Get chatbot training status |
| `smartlyq chatbots send-message <id> --data <json>` | `POST /chatbots/{id}/messages` | Send chatbot message |
| `smartlyq chatbots list-conversations <id> [--query <query>]` | `GET /chatbots/{id}/conversations` | List chatbot conversations |
| `smartlyq chatbots get-conversation-messages <id> <conv-id>` | `GET /chatbots/{id}/conversations/{conv_id}/messages` | Get conversation messages |

### Comments

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq comments list [--query <query>]` | `GET /social/comments` | List comments |
| `smartlyq comments reply-to <comment-id> --data <json>` | `POST /social/comments/{comment_id}/reply` | Reply to a comment |
| `smartlyq comments hide <comment-id>` | `POST /social/comments/{comment_id}/hide` | Hide or unhide a comment |
| `smartlyq comments moderate <comment-id> --data <json>` | `POST /social/comments/{comment_id}/moderate` | Approve or reject a comment |
| `smartlyq comments like <comment-id>` | `POST /social/comments/{comment_id}/like` | Like a comment |
| `smartlyq comments unlike <comment-id>` | `DELETE /social/comments/{comment_id}/like` | Unlike a comment |
| `smartlyq comments delete <comment-id>` | `DELETE /social/comments/{comment_id}` | Delete a comment |
| `smartlyq comments get-post <post-id>` | `GET /social/comments/{post_id}` | Get one post's comments (threaded) |

### Content

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq content rewrite --data <json>` | `POST /content/rewrite` | Rewrite content |
| `smartlyq content generate-caption [--data <json>]` | `POST /content/caption` | Generate a social caption |

### CRM

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq crm delete-contact <id>` | `DELETE /contacts/{id}` | Delete contact |
| `smartlyq crm update-custom-field <id> --data <json>` | `PATCH /custom-fields/{id}` | Update custom field |
| `smartlyq crm bulk-import-contacts --data <json>` | `POST /contacts/bulk` | Bulk import contacts |
| `smartlyq crm contact-channels <id>` | `GET /contacts/{id}/channels` | Contact channels |

### CRM Contacts

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq contacts list [--query <query>]` | `GET /contacts` | List contacts |
| `smartlyq contacts create --data <json>` | `POST /contacts` | Create or upsert a contact |
| `smartlyq contacts get <id>` | `GET /contacts/{id}` | Get a contact |
| `smartlyq contacts update <id> --data <json>` | `PATCH /contacts/{id}` | Update a contact |
| `smartlyq contacts add-tags <id> --data <json>` | `POST /contacts/{id}/tags` | Add tags to a contact |
| `smartlyq contacts remove-tags <id> --data <json>` | `DELETE /contacts/{id}/tags` | Remove tags from a contact |
| `smartlyq contacts list-notes <id>` | `GET /contacts/{id}/notes` | List contact notes |
| `smartlyq contacts add-note <id> --data <json>` | `POST /contacts/{id}/notes` | Add a note to a contact |
| `smartlyq contacts enroll <id> --data <json>` | `POST /contacts/{id}/enroll` | Enroll a contact in an automation |
| `smartlyq contacts add-message <id> --data <json>` | `POST /contacts/{id}/messages` | Log a message on a contact's timeline |
| `smartlyq contacts set-field <id> <slug> --data <json>` | `PUT /contacts/{id}/fields/{slug}` | Set one custom field |
| `smartlyq contacts clear-field <id> <slug>` | `DELETE /contacts/{id}/fields/{slug}` | Clear one custom field |

### CRM Custom Fields

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq custom-fields list` | `GET /custom-fields` | List custom fields |
| `smartlyq custom-fields create --data <json>` | `POST /custom-fields` | Create a custom field |
| `smartlyq custom-fields delete <id>` | `DELETE /custom-fields/{id}` | Delete a custom field |

### CRM Opportunities

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq opportunities list-pipelines` | `GET /pipelines` | List pipelines |
| `smartlyq opportunities create-pipeline --data <json>` | `POST /pipelines` | Create a pipeline |
| `smartlyq opportunities list [--query <query>]` | `GET /opportunities` | List opportunities |
| `smartlyq opportunities create --data <json>` | `POST /opportunities` | Create an opportunity |
| `smartlyq opportunities get <id>` | `GET /opportunities/{id}` | Get an opportunity |
| `smartlyq opportunities update <id> --data <json>` | `PATCH /opportunities/{id}` | Update an opportunity |
| `smartlyq opportunities delete <id>` | `DELETE /opportunities/{id}` | Delete an opportunity |
| `smartlyq opportunities update-status <id> --data <json>` | `POST /opportunities/{id}/status` | Update opportunity status |

### Direct Messages

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq messages list-conversations [--query <query>]` | `GET /social/conversations` | List DM conversations |
| `smartlyq messages list <conversation-id> [--query <query>]` | `GET /social/conversations/{conversation_id}/messages` | List messages in a conversation |
| `smartlyq messages send <conversation-id> --data <json>` | `POST /social/conversations/{conversation_id}/messages` | Send a direct message |
| `smartlyq messages mark-conversation-read <conversation-id>` | `POST /social/conversations/{conversation_id}/read` | Mark a conversation read |
| `smartlyq messages delete <conversation-id> <message-id>` | `DELETE /social/conversations/{conversation_id}/messages/{message_id}` | Delete a sent message |
| `smartlyq messages react-to <conversation-id> <message-id> --data <json>` | `POST /social/conversations/{conversation_id}/messages/{message_id}/reactions` | React to a message |
| `smartlyq messages remove-reaction <conversation-id> <message-id>` | `DELETE /social/conversations/{conversation_id}/messages/{message_id}/reactions` | Remove a message reaction |

### Images

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq images generate --data <json>` | `POST /images/generate` | Generate image |
| `smartlyq images list [--query <query>]` | `GET /images` | List images |
| `smartlyq images get <image-id>` | `GET /images/{image_id}` | Get image |
| `smartlyq images delete <image-id>` | `DELETE /images/{image_id}` | Delete image |

### Jobs

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq jobs list [--query <query>]` | `GET /jobs` | List jobs |
| `smartlyq jobs get <job-id>` | `GET /jobs/{job_id}` | Get job |
| `smartlyq jobs cancel <job-id> [--data <json>]` | `POST /jobs/{job_id}/cancel` | Cancel job |

### Logs

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq logs list [--query <query>]` | `GET /logs` | List developer logs |

### Media

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq media list [--query <query>]` | `GET /media` | List media |
| `smartlyq media get <media-id>` | `GET /media/{media_id}` | Get media |
| `smartlyq media delete <media-id>` | `DELETE /media/{media_id}` | Delete media |
| `smartlyq media get-upload-url --data <json>` | `POST /media/upload-url` | Get presigned upload URL |
| `smartlyq media confirm-upload <media-id>` | `POST /media/{media_id}/confirm` | Confirm a presigned upload |
| `smartlyq media upload-direct --data <json>` | `POST /media/upload-direct` | Upload a file directly |

### Presentations

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq presentations generate --data <json>` | `POST /presentations/generate` | Generate presentation |
| `smartlyq presentations list [--query <query>]` | `GET /presentations` | List presentations |
| `smartlyq presentations get <presentation-id>` | `GET /presentations/{presentation_id}` | Get presentation |
| `smartlyq presentations delete <presentation-id>` | `DELETE /presentations/{presentation_id}` | Delete presentation |

### Profiles

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq profiles list [--query <query>]` | `GET /profiles` | List profiles |
| `smartlyq profiles create --data <json>` | `POST /profiles` | Create a profile |
| `smartlyq profiles get <id>` | `GET /profiles/{id}` | Get a profile |
| `smartlyq profiles update <id> --data <json>` | `PATCH /profiles/{id}` | Update a profile |
| `smartlyq profiles delete <id> --data <json>` | `DELETE /profiles/{id}` | Delete a profile |
| `smartlyq profiles list-accounts <id>` | `GET /profiles/{id}/accounts` | List a profile's connected accounts |
| `smartlyq profiles pause <id>` | `POST /profiles/{id}/pause` | Pause a profile |
| `smartlyq profiles resume <id>` | `POST /profiles/{id}/resume` | Resume a profile |
| `smartlyq profiles create-connect-link <id> [--data <json>]` | `POST /profiles/{id}/connect-link` | Create a hosted connect link |
| `smartlyq profiles create-connect-url <id> <platform> [--data <json>]` | `POST /profiles/{id}/connect/{platform}` | Get a raw connect URL for one platform |
| `smartlyq profiles get-account-billing` | `GET /me/account-billing` | Account billing summary |

### Reviews

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq reviews list [--query <query>]` | `GET /reviews` | List reviews |
| `smartlyq reviews reply-to <review-id> --data <json>` | `POST /reviews/{review_id}/reply` | Reply to review |
| `smartlyq reviews delete-reply <review-id>` | `DELETE /reviews/{review_id}/reply` | Delete review reply |
| `smartlyq reviews sync [--data <json>]` | `POST /reviews/sync` | Sync reviews |

### SEO

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq seo keyword-research --data <json>` | `POST /seo/keyword-research` | Keyword research |
| `smartlyq seo serp --data <json>` | `POST /seo/serp` | Live SERP lookup |
| `smartlyq seo keyword-difficulty --data <json>` | `POST /seo/keyword-difficulty` | Keyword difficulty |
| `smartlyq seo ranked-keywords --data <json>` | `POST /seo/ranked-keywords` | Ranked keywords (rank tracking) |
| `smartlyq seo domain-overview --data <json>` | `POST /seo/domain-overview` | Domain rank overview |
| `smartlyq seo competitors --data <json>` | `POST /seo/competitors` | Organic competitors |
| `smartlyq seo backlinks-summary --data <json>` | `POST /seo/backlinks-summary` | Backlink profile summary |
| `smartlyq seo audit --data <json>` | `POST /seo/audit` | On-page SEO audit |
| `smartlyq seo backlink-prospects --data <json>` | `POST /seo/backlink-prospects` | Backlink prospects (link gap) |
| `smartlyq seo referring-domains --data <json>` | `POST /seo/referring-domains` | Referring domains |
| `smartlyq seo backlink-anchors --data <json>` | `POST /seo/backlink-anchors` | Backlink anchors |
| `smartlyq seo spam-score --data <json>` | `POST /seo/spam-score` | Backlink spam score |
| `smartlyq seo rank-history --data <json>` | `POST /seo/rank-history` | Historical rank overview |
| `smartlyq seo site-audit --data <json>` | `POST /seo/site-audit` | Deep site audit |
| `smartlyq seo brand-lookup --data <json>` | `POST /seo/brand-lookup` | AI Visibility: brand lookup |
| `smartlyq seo prompt-explorer --data <json>` | `POST /seo/prompt-explorer` | AI Visibility: prompt explorer |
| `smartlyq seo ai-audit --data <json>` | `POST /seo/ai-audit` | AI Visibility Audit (async) |

### Shorts

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq shorts generate [--data <json>]` | `POST /shorts/generate` | Generate viral shorts from a long video |
| `smartlyq shorts list [--query <query>]` | `GET /shorts` | List shorts jobs |
| `smartlyq shorts get <uid>` | `GET /shorts/{uid}` | Get shorts job + clips |

### Social

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq social list-accounts` | `GET /social/accounts` | List social accounts |
| `smartlyq social list-posts [--query <query>]` | `GET /social/posts` | List social posts |
| `smartlyq social create-post --data <json>` | `POST /social/posts` | Create post (publish immediately) |
| `smartlyq social schedule-post --data <json>` | `POST /social/posts/schedule` | Schedule post |
| `smartlyq social get-post <post-id>` | `GET /social/posts/{post_id}` | Get social post |
| `smartlyq social update-post <post-id> --data <json>` | `PATCH /social/posts/{post_id}` | Update social post |
| `smartlyq social delete-post <post-id>` | `DELETE /social/posts/{post_id}` | Delete social post |
| `smartlyq social update-account <account-id> --data <json>` | `PATCH /social/accounts/{account_id}` | Rename account |
| `smartlyq social disconnect-account <account-id>` | `DELETE /social/accounts/{account_id}` | Disconnect a social account |
| `smartlyq social get-account-health <account-id>` | `GET /social/accounts/{account_id}/health` | Account health |
| `smartlyq social get-account-reconnect-url <account-id>` | `GET /social/accounts/{account_id}/reconnect-url` | Account reconnect URL |
| `smartlyq social pause-account <account-id>` | `POST /social/accounts/{account_id}/pause` | Pause posting to an account |
| `smartlyq social resume-account <account-id>` | `POST /social/accounts/{account_id}/resume` | Resume posting to an account |
| `smartlyq social retry-post <post-id> --data <json>` | `POST /social/posts/{post_id}/retry` | Retry publishing a post |
| `smartlyq social connect-account-status <platform>` | `GET /social/connect/{platform}` | Poll headless connection status |
| `smartlyq social connect-account <platform> [--data <json>]` | `POST /social/connect/{platform}` | Start headless account connection |
| `smartlyq social list-queues` | `GET /social/queues` | List queues |
| `smartlyq social create-queue --data <json>` | `POST /social/queues` | Create queue |
| `smartlyq social get-queue <queue-id>` | `GET /social/queues/{queue_id}` | Get queue |
| `smartlyq social update-queue <queue-id> --data <json>` | `PUT /social/queues/{queue_id}` | Update queue |
| `smartlyq social delete-queue <queue-id>` | `DELETE /social/queues/{queue_id}` | Delete queue |
| `smartlyq social get-queue-next-slot <queue-id>` | `GET /social/queues/{queue_id}/next-slot` | Get next open slot |
| `smartlyq social preview-queue-slots <queue-id> [--query <query>]` | `GET /social/queues/{queue_id}/preview` | Preview upcoming slots |
| `smartlyq social unpublish-post <post-id> [--data <json>]` | `POST /social/posts/{post_id}/unpublish` | Unpublish post |
| `smartlyq social validate-post --data <json>` | `POST /social/validate/post` | Validate post content |
| `smartlyq social validate-media --data <json>` | `POST /social/validate/media` | Validate media URL |
| `smartlyq social stop-post-recycle <post-id>` | `DELETE /social/posts/{post_id}/recycle` | Stop recycling |
| `smartlyq social bulk-schedule-posts --data <json>` | `POST /social/posts/bulk` | Bulk schedule posts |
| `smartlyq social validate-bulk-batch --data <json>` | `POST /social/posts/bulk/validate` | Validate a bulk batch |
| `smartlyq social bulk-account-health` | `GET /social/accounts/health` | Bulk account health |
| `smartlyq social account-follower-stats [--query <query>]` | `GET /social/accounts/follower-stats` | Follower stats |
| `smartlyq social tiktok-creator-info <account-id>` | `GET /social/accounts/{account_id}/tiktok/creator-info` | TikTok creator info |
| `smartlyq social move-account <account-id> --data <json>` | `POST /social/accounts/{account_id}/move` | Move account to profile |
| `smartlyq social list-account-groups` | `GET /social/account-groups` | List account groups |
| `smartlyq social create-account-group --data <json>` | `POST /social/account-groups` | Create account group |
| `smartlyq social get-account-group <group-id>` | `GET /social/account-groups/{group_id}` | Get account group |
| `smartlyq social update-account-group <group-id> --data <json>` | `PUT /social/account-groups/{group_id}` | Update account group |
| `smartlyq social delete-account-group <group-id>` | `DELETE /social/account-groups/{group_id}` | Delete account group |
| `smartlyq social get-conversation <conversation-id>` | `GET /social/conversations/{conversation_id}` | Get conversation |
| `smartlyq social update-conversation <conversation-id> --data <json>` | `PATCH /social/conversations/{conversation_id}` | Archive / reopen conversation |
| `smartlyq social search-conversations [--query <query>]` | `GET /social/conversations/search` | Search conversations |
| `smartlyq social pinterest-boards <account-id>` | `GET /social/accounts/{account_id}/pinterest/boards` | Pinterest boards |
| `smartlyq social create-pinterest-board <account-id> --data <json>` | `POST /social/accounts/{account_id}/pinterest/boards` | Create a Pinterest board |
| `smartlyq social youtube-playlists <account-id>` | `GET /social/accounts/{account_id}/youtube/playlists` | YouTube playlists |
| `smartlyq social instagram-publishing-limit <account-id>` | `GET /social/accounts/{account_id}/instagram/publishing-limit` | Instagram publishing limit |
| `smartlyq social gmb-performance <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/gmb/performance` | Google Business performance |
| `smartlyq social gmb-search-keywords <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/gmb/search-keywords` | Google Business search keywords |
| `smartlyq social reddit-search <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/reddit/search` | Reddit search |
| `smartlyq social reddit-feed <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/reddit/feed` | Reddit feed |
| `smartlyq social reddit-subreddits <account-id>` | `GET /social/accounts/{account_id}/reddit/subreddits` | Subscribed subreddits |
| `smartlyq social reddit-subreddit-rules <account-id> <subreddit>` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}/rules` | Subreddit rules |
| `smartlyq social instagram-stories <account-id>` | `GET /social/accounts/{account_id}/instagram/stories` | Instagram stories |
| `smartlyq social facebook-post-reactions <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/facebook/post-reactions` | Facebook post reactions |
| `smartlyq social instagram-story-insights <account-id> <story-id> [--query <query>]` | `GET /social/accounts/{account_id}/instagram/stories/{story_id}/insights` | Instagram story insights |
| `smartlyq social x-retweet <account-id> --data <json>` | `POST /social/accounts/{account_id}/x/retweets` | Retweet on X |
| `smartlyq social x-unretweet <account-id> <tweet-id>` | `DELETE /social/accounts/{account_id}/x/retweets/{tweet_id}` | Undo retweet |
| `smartlyq social edit-published-post <post-id> --data <json>` | `POST /social/posts/{post_id}/edit` | Edit published post |
| `smartlyq social update-post-metadata <post-id> --data <json>` | `POST /social/posts/{post_id}/update-metadata` | Update YouTube metadata |
| `smartlyq social sync-external-posts --data <json>` | `POST /social/posts/sync-external` | Sync external posts |
| `smartlyq social account-insights <account-id>` | `GET /social/accounts/{account_id}/insights` | Live account insights |
| `smartlyq social gmb-locations <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/gmb/locations` | List Google locations |
| `smartlyq social gmb-location <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/gmb/location` | Get business info |
| `smartlyq social gmb-update-location <account-id> --data <json>` | `PATCH /social/accounts/{account_id}/gmb/location` | Update business info |
| `smartlyq social gmb-attributes <account-id>` | `GET /social/accounts/{account_id}/gmb/attributes` | Get attributes |
| `smartlyq social gmb-update-attributes <account-id> --data <json>` | `PUT /social/accounts/{account_id}/gmb/attributes` | Update attributes |
| `smartlyq social gmb-attribute-metadata <account-id>` | `GET /social/accounts/{account_id}/gmb/attributes/metadata` | Available attributes |
| `smartlyq social gmb-media <account-id>` | `GET /social/accounts/{account_id}/gmb/media` | List media |
| `smartlyq social gmb-create-media <account-id> --data <json>` | `POST /social/accounts/{account_id}/gmb/media` | Add photo |
| `smartlyq social gmb-delete-media <account-id> --data <json>` | `DELETE /social/accounts/{account_id}/gmb/media` | Delete media |
| `smartlyq social gmb-food-menus <account-id>` | `GET /social/accounts/{account_id}/gmb/food-menus` | Get food menus |
| `smartlyq social gmb-update-food-menus <account-id> --data <json>` | `PUT /social/accounts/{account_id}/gmb/food-menus` | Update food menus |
| `smartlyq social gmb-place-actions <account-id>` | `GET /social/accounts/{account_id}/gmb/place-actions` | List place-action links |
| `smartlyq social gmb-create-place-action <account-id> --data <json>` | `POST /social/accounts/{account_id}/gmb/place-actions` | Create place-action link |
| `smartlyq social gmb-update-place-action <account-id> --data <json>` | `PATCH /social/accounts/{account_id}/gmb/place-actions` | Update place-action link |
| `smartlyq social gmb-delete-place-action <account-id> --data <json>` | `DELETE /social/accounts/{account_id}/gmb/place-actions` | Delete place-action link |
| `smartlyq social gmb-verifications <account-id>` | `GET /social/accounts/{account_id}/gmb/verifications` | List verifications |
| `smartlyq social gmb-verification-options <account-id> [--data <json>]` | `POST /social/accounts/{account_id}/gmb/verifications/options` | Verification options |
| `smartlyq social reddit-subreddit-info <account-id> <subreddit>` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}` | Subreddit info + eligibility |
| `smartlyq social x-mentions <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/x/mentions` | X mentions |
| `smartlyq social send-typing-indicator <conversation-id>` | `POST /social/conversations/{conversation_id}/typing` | Typing indicator |
| `smartlyq social comment-private-reply <comment-id> --data <json>` | `POST /social/comments/{comment_id}/private-reply` | Private reply (comment-to-DM) |
| `smartlyq social get-messenger-menu <account-id>` | `GET /social/accounts/{account_id}/messenger/menu` | Get Messenger menu |
| `smartlyq social set-messenger-menu <account-id> --data <json>` | `PUT /social/accounts/{account_id}/messenger/menu` | Set Messenger menu |
| `smartlyq social delete-messenger-menu <account-id>` | `DELETE /social/accounts/{account_id}/messenger/menu` | Delete Messenger menu |
| `smartlyq social get-ice-breakers <account-id>` | `GET /social/accounts/{account_id}/instagram/ice-breakers` | Get ice breakers |
| `smartlyq social set-ice-breakers <account-id> --data <json>` | `PUT /social/accounts/{account_id}/instagram/ice-breakers` | Set ice breakers |
| `smartlyq social delete-ice-breakers <account-id>` | `DELETE /social/accounts/{account_id}/instagram/ice-breakers` | Delete ice breakers |
| `smartlyq social facebook-page-insights <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/facebook/page-insights` | Facebook page insights |
| `smartlyq social instagram-audience <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/instagram/audience` | Instagram audience demographics |
| `smartlyq social connect-options <account-id>` | `GET /social/accounts/{account_id}/connect-options` | Connection target options |
| `smartlyq social connect-select <account-id> --data <json>` | `POST /social/accounts/{account_id}/connect-select` | Select connection target |
| `smartlyq social get-facebook-page <account-id>` | `GET /social/accounts/{account_id}/facebook/page` | Get Facebook page details |
| `smartlyq social update-facebook-page <account-id> --data <json>` | `PATCH /social/accounts/{account_id}/facebook/page` | Update Facebook page details |
| `smartlyq social update-youtube-playlist <account-id> <playlist-id> --data <json>` | `PATCH /social/accounts/{account_id}/youtube/playlists/{playlist_id}` | Update a YouTube playlist |
| `smartlyq social list-mentions <account-id> [--query <query>]` | `GET /social/accounts/{account_id}/mentions` | List mentions |
| `smartlyq social reply-to-mention <account-id> <mention-id> --data <json>` | `POST /social/accounts/{account_id}/mentions/{mention_id}/reply` | Reply to a mention |
| `smartlyq social list-reddit-flairs <account-id> <subreddit>` | `GET /social/accounts/{account_id}/reddit/subreddits/{subreddit}/flairs` | List subreddit post flairs |

### URLs

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq urls shorten --data <json>` | `POST /urls/shorten` | Shorten URL |
| `smartlyq urls list [--query <query>]` | `GET /urls` | List short URLs |
| `smartlyq urls get <url-id>` | `GET /urls/{url_id}` | Get short URL |
| `smartlyq urls delete <url-id>` | `DELETE /urls/{url_id}` | Delete short URL |
| `smartlyq urls get-stats <url-id>` | `GET /urls/{url_id}/stats` | Get short URL stats |
| `smartlyq urls update-short <id> --data <json>` | `PATCH /urls/{id}` | Update a short URL |

### Videos

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq videos list-models` | `GET /videos/models` | List available video models |
| `smartlyq videos generate --data <json>` | `POST /videos/generate` | Generate video |
| `smartlyq videos list [--query <query>]` | `GET /videos` | List videos |
| `smartlyq videos get <video-id>` | `GET /videos/{video_id}` | Get video |
| `smartlyq videos delete <video-id>` | `DELETE /videos/{video_id}` | Delete video |
| `smartlyq videos generate-hook [--data <json>]` | `POST /videos/hook` | Generate a viral hook line |
| `smartlyq videos suggest-broll --data <json>` | `POST /videos/broll-suggest` | Suggest B-roll moments |
| `smartlyq videos suggest-emphasis --data <json>` | `POST /videos/emphasis` | Suggest on-screen emphasis |
| `smartlyq videos generate-viral-thumbnail --data <json>` | `POST /videos/viral-thumbnail` | Generate a viral thumbnail |

### Webhooks

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq webhooks list` | `GET /webhooks` | List webhooks |
| `smartlyq webhooks create --data <json>` | `POST /webhooks` | Create webhook |
| `smartlyq webhooks update <id> --data <json>` | `PUT /webhooks/{id}` | Update webhook |
| `smartlyq webhooks delete <id>` | `DELETE /webhooks/{id}` | Delete webhook |
| `smartlyq webhooks list-logs [--query <query>]` | `GET /webhooks/logs` | List webhook delivery logs |
| `smartlyq webhooks test <id>` | `POST /webhooks/{id}/test` | Send test webhook |
| `smartlyq webhooks replay-delivery <id>` | `POST /webhooks/deliveries/{id}/replay` | Replay a webhook delivery |

### WhatsApp

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq whats-app send-whats-app-message --data <json>` | `POST /whatsapp/messages` | Send a WhatsApp message |
| `smartlyq whats-app list-whats-app-templates [--query <query>]` | `GET /whatsapp/templates` | List message templates |
| `smartlyq whats-app create-whats-app-template --data <json>` | `POST /whatsapp/templates` | Create a message template |
| `smartlyq whats-app get-whats-app-business-profile [--query <query>]` | `GET /whatsapp/business-profile` | Get business profile |
| `smartlyq whats-app update-whats-app-business-profile --data <json>` | `PATCH /whatsapp/business-profile` | Update business profile |
| `smartlyq whats-app list-whats-app-phone-numbers [--query <query>]` | `GET /whatsapp/phone-numbers` | List phone numbers |
| `smartlyq whats-app list-whats-app-flows [--query <query>]` | `GET /whatsapp/flows` | List flows |
| `smartlyq whats-app create-whats-app-flow --data <json>` | `POST /whatsapp/flows` | Create a flow |
| `smartlyq whats-app get-whats-app-flow <flow-id> [--query <query>]` | `GET /whatsapp/flows/{flow_id}` | Get flow |
| `smartlyq whats-app update-whats-app-flow <flow-id> --data <json>` | `PATCH /whatsapp/flows/{flow_id}` | Update flow |
| `smartlyq whats-app delete-whats-app-flow <flow-id> [--query <query>]` | `DELETE /whatsapp/flows/{flow_id}` | Delete flow |
| `smartlyq whats-app get-whats-app-flow-json <flow-id> [--query <query>]` | `GET /whatsapp/flows/{flow_id}/json` | Get flow JSON asset |
| `smartlyq whats-app upload-whats-app-flow-json <flow-id> --data <json>` | `PUT /whatsapp/flows/{flow_id}/json` | Upload flow JSON |
| `smartlyq whats-app get-whats-app-flow-preview <flow-id> [--query <query>]` | `GET /whatsapp/flows/{flow_id}/preview` | Get flow preview URL |
| `smartlyq whats-app publish-whats-app-flow <flow-id> --data <json>` | `POST /whatsapp/flows/{flow_id}/publish` | Publish flow |
| `smartlyq whats-app deprecate-whats-app-flow <flow-id> --data <json>` | `POST /whatsapp/flows/{flow_id}/deprecate` | Deprecate flow |
| `smartlyq whats-app get-whats-app-blocked-users [--query <query>]` | `GET /whatsapp/block-users` | List blocked users |
| `smartlyq whats-app block-whats-app-users --data <json>` | `POST /whatsapp/block-users` | Block users |
| `smartlyq whats-app unblock-whats-app-users --data <json>` | `DELETE /whatsapp/block-users` | Unblock users |
| `smartlyq whats-app list-whats-app-sandbox-sessions` | `GET /whatsapp/sandbox/sessions` | List your sandbox sessions |
| `smartlyq whats-app create-whats-app-sandbox-session --data <json>` | `POST /whatsapp/sandbox/sessions` | Start a sandbox activation |
| `smartlyq whats-app delete-whats-app-sandbox-session <session-id>` | `DELETE /whatsapp/sandbox/sessions/{session_id}` | Revoke a sandbox session |
| `smartlyq whats-app send-whats-app-sandbox-message <session-id>` | `POST /whatsapp/sandbox/sessions/{session_id}/send` | Send the sandbox template |
| `smartlyq whats-app get-whats-app-number-bridge-status <sender-id>` | `GET /whatsapp/numbers/{sender_id}/bridge` | Bridge status |
| `smartlyq whats-app start-whats-app-number-bridge <sender-id>` | `POST /whatsapp/numbers/{sender_id}/bridge` | Bridge an owned number onto WhatsApp |
| `smartlyq whats-app request-whats-app-number-bridge-code <sender-id> [--data <json>]` | `POST /whatsapp/numbers/{sender_id}/bridge/request-code` | Request a verification code |
| `smartlyq whats-app verify-whats-app-number-bridge <sender-id> --data <json>` | `POST /whatsapp/numbers/{sender_id}/bridge/verify` | Submit the verification code |
| `smartlyq whats-app get-template <name> [--query <query>]` | `GET /whatsapp/templates/{name}` | Get a WhatsApp template |
| `smartlyq whats-app update-template <name> --data <json>` | `PATCH /whatsapp/templates/{name}` | Update a WhatsApp template |
| `smartlyq whats-app delete-template <name> [--query <query>]` | `DELETE /whatsapp/templates/{name}` | Delete a WhatsApp template |
| `smartlyq whats-app update-profile-photo --data <json>` | `POST /whatsapp/business-profile/photo` | Set the WhatsApp profile photo |
| `smartlyq whats-app get-display-name [--query <query>]` | `GET /whatsapp/business-profile/display-name` | Get the WhatsApp display name |
| `smartlyq whats-app update-display-name --data <json>` | `POST /whatsapp/business-profile/display-name` | Request a WhatsApp display-name change |
| `smartlyq whats-app list-template-library [--query <query>]` | `GET /whatsapp/template-library` | Browse the shared template library |
| `smartlyq whats-app create-template-from-library --data <json>` | `POST /whatsapp/templates/from-library` | Adopt a library template |

### Workspaces

| Command | Endpoint | Description |
| --- | --- | --- |
| `smartlyq workspaces list` | `GET /workspaces` | List workspaces (sub-accounts) |
| `smartlyq workspaces create --data <json>` | `POST /workspaces` | Create a workspace (sub-account) |
| `smartlyq workspaces bulk-action --data <json>` | `POST /workspaces/bulk` | Bulk sub-account action |
| `smartlyq workspaces get <id>` | `GET /workspaces/{id}` | Get a workspace (sub-account) |
| `smartlyq workspaces delete <id> --data <json>` | `DELETE /workspaces/{id}` | Delete a workspace (sub-account) |
| `smartlyq workspaces disable-saas <id> [--data <json>]` | `POST /workspaces/{id}/disable-saas` | Disable SaaS mode for a workspace |
| `smartlyq workspaces pause <id>` | `POST /workspaces/{id}/pause` | Pause (suspend) a workspace |
| `smartlyq workspaces resume <id>` | `POST /workspaces/{id}/resume` | Resume a paused workspace |
| `smartlyq workspaces get-subscription <id>` | `GET /workspaces/{id}/subscription` | Get a sub-account's subscription |
| `smartlyq workspaces get-wallet <id>` | `GET /workspaces/{id}/wallet` | Get a sub-account's wallet balance |
| `smartlyq workspaces list-saas-plans` | `GET /saas/plans` | List SaaS plans |
| `smartlyq workspaces get-saas-plan <id>` | `GET /saas/plans/{id}` | Get a SaaS plan |
<!-- END GENERATED REFERENCE -->

## Regeneration

This CLI is generated from the [SmartlyQ OpenAPI spec](https://docs.smartlyq.com). When the spec changes, CI regenerates the commands, README, and tests, bumps the version, and publishes to npm automatically.

## License

MIT
