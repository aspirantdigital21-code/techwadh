+++
title = "n8n for Beginners: Build Your First Workflow with Docker and AI"
description = "Learn n8n by doing. Run a beginner workflow, set up Docker, test a webhook, and explore AI agents and creator automations in an interactive lab."
summary = "Learn n8n by doing. Run a beginner workflow, set up Docker, test a webhook, and explore AI agents and creator automations in an interactive lab."
date = "2026-11-27T17:00:00+05:30"
slug = "n8n-beginner-guide"
translationKey = "n8n-beginner-guide"
categories = ["Software Guides"]
tags = ["n8n", "Workflow Automation", "AI Agents"]
keywords = ["n8n beginner guide", "n8n Docker setup", "n8n webhook tutorial", "n8n AI agent"]
featured = true
ShowToc = true
ShowReadingTime = true
[cover]
image = "images/covers/n8n-workflow-workshop.webp"
alt = "Manual trigger, field mapping and both IF branches"
caption = "Original TechWadh workflow illustration. Open the official quickstart to see the n8n editor."
+++

A TechWadh article is ready for review. Your automation should move it forward when its status is `ready` and skip it when it is still a `draft`. Run both cases in the lab below, then build the same rule in n8n and extend it to a webhook or Telegram alert.

{{< n8n-lab >}}

### Run these three lab checks

| Change the input | Expected result |
| --- | --- |
| First automation · switch `ready` to `draft` | IF follows the false branch and returns `Skipped` |
| Webhook · clear the name | Validation stops the request and returns `400` |
| YouTube alert · mark the video ID as recorded | The workflow skips the duplicate |

Select a node in the execution path to inspect its JSON.

## What n8n does

n8n, pronounced *n-eight-n*, is a low-code workflow automation platform. Its browser editor lets you link apps, APIs, databases and AI models. A repeatable task becomes a **workflow**. The event that starts it is a **trigger**, each step is a **node**, and one run is an **execution**. The server runs workflows and reads or writes execution data according to its settings. Self-hosted setups commonly start with SQLite and can use PostgreSQL. [Official docs](https://docs.n8n.io/)

![n8n server, proxy, database and external apps](/n8n-guide/architecture.webp)

| Building block | What you use it for |
| --- | --- |
| Trigger | Start manually, on a schedule, from an app event, a webhook or chat |
| Edit Fields | Rename, add or map fields before passing data forward |
| IF / Switch | Route by a condition or several possible values |
| Merge / Loop Over Items | Combine branches or explicitly process batches |
| HTTP Request / Code | Call a REST API or add custom transformations |
| Credentials | Store app authentication separately from workflow fields |
| Execution | Inspect a run and find the step that failed |

## Choose Cloud or local setup

**Cloud** is the shortest route if you want a managed editor. **Local Docker** gives you a workspace for experiments. With Docker running, use the commands below, then open [localhost:5678](http://localhost:5678) and create the owner account. The port binds to your own computer and the named volume preserves the local n8n data between containers. The official docs mark npm-based installs deprecated from n8n 3.0, so check your version before following an older `npx n8n` tutorial. [Docker docs](https://docs.n8n.io/deploy/host-n8n/install-options/install-with-docker.md) · [npm docs](https://docs.n8n.io/deploy/host-n8n/install-options/install-with-npm.md)

```bash
docker volume create n8n_data
docker run --rm --name n8n -p 127.0.0.1:5678:5678 \
  -e GENERIC_TIMEZONE=Asia/Kolkata -e TZ=Asia/Kolkata \
  -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

On an i3 PC with 8 GB RAM, begin with a small workflow and one app. Local resource use depends on Docker, workflow size and what else is running. A laptop workflow stops when the host sleeps or shuts down. For 24/7 delivery, consider managed hosting or a maintained server. A hosted AI model has separate quotas and costs.

## Build your first workflow without an account or API key
1. Create a workflow and add **Manual Trigger**.
2. Add **Edit Fields**. Set two String fields to `name = Rohit` and `status = ready`.
3. Add **IF**. Set the left String value to expression `{{ $json.status }}`, choose **is equal to**, and enter `ready` on the right.
4. On **true**, add **Edit Fields** and set `message` in expression mode to `{{ 'Ready to publish: ' + $json.name }}`. On **false**, add **Edit Fields** and set `message` to `Skipped`.
5. Select **Execute workflow**. Inspect the true branch for `Ready to publish: Rohit`. Change `status` to `draft` and run again. The false branch should return `Skipped`.

![Manual trigger, field mapping and both IF branches](/n8n-guide/first-workflow.webp)

n8n passes a list of **items** between nodes. Each item holds JSON fields, with binary data available when needed. Many nodes process multiple items individually, but check the node and operation before assuming one API call per item. `{{ $json.name }}` reads the current item. `{{ $now.format('yyyy-MM-dd') }}` formats the current date. Refer to a previous node only when you need its data and understand how n8n links items. Pin synthetic output during manual tests to save repeated external calls. [Data structure](https://docs.n8n.io/data/data-structure/) · [Data pinning](https://docs.n8n.io/data/data-pinning/)

## Upgrade to a webhook
1. Replace Manual Trigger with **Webhook**, using `POST` and path `demo-intake`.
2. Map `name` from `{{ $json.body.name }}` and `status` from `{{ $json.body.status }}` in the first Edit Fields node.
3. In the Webhook node choose **When Last Node Finishes** as the response mode. Click **Listen for test event** and copy the **Test URL**.
4. Run the request below while listening. Expect the ready message. Retry with `draft` to test the other route.
5. When you need a real integration, configure webhook authentication, publish the workflow and point the sender at its **Production URL**. Validate required fields before taking an action. A hosted app needs a reachable HTTPS endpoint. [Webhook documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

```bash
curl -i -X POST 'PASTE_N8N_TEST_URL_HERE' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Rohit","status":"ready"}'
```

## Real project for a creator or Unity developer

For YouTube alerts, set **RSS Feed Trigger** to your channel feed, then inspect the returned fields before mapping title and link. Store the stable video ID in a persistent delivery log. Connect a Telegram bot credential, give the bot permission to post to the target channel, and test with a private chat or test channel first. Log delivery after a successful response. The diagram shows a simple single-run flow. For concurrent production runs, reserve a unique event ID before sending and handle failed or uncertain delivery separately.

![YouTube feed, duplicate check and Telegram alert](/n8n-guide/youtube-alert.webp)

| Project | Starting flow |
| --- | --- |
| TechWadh editorial digest | Feed → identify new posts → draft a summary → editor approval |
| Unity build alert | CI build succeeds → authenticated webhook → Telegram message |
| Feedback tracker | Form → validate required fields → Sheet or database → weekly summary |
| Support inbox | Incoming email → classify → create ticket → draft reply |

## Add AI after the workflow is reliable

Use a **Basic LLM Chain** for a fixed task such as summarization. Use an **AI Agent** when the model needs to choose among tools. Attach a chat model, use a narrow prompt, connect a read-only tool for the first project, and add session memory only if the conversation needs it. Before automating a public post, let a person review the draft. For document Q&A, add retrieval from an approved document store. For MCP, check the client/server direction and exactly which tools or data you expose. [AI docs](https://docs.n8n.io/advanced-ai/)

![AI agent, model, tools and human review](/n8n-guide/ai-agent.webp)

## Pick an automation platform and check the real cost

| Tool | Why a beginner might choose it |
| --- | --- |
| n8n | Self-hosting, custom APIs, multi-step workflows and granular control |
| Zapier | Straightforward app-to-app workflows with familiar setup |
| Make | Visual scenarios with multiple branches and data mapping |

n8n advertises execution-based pricing for its paid plans. Zapier bills eligible actions as tasks. Make uses credits whose consumption depends on the operation and feature. Compare the cost for the *same* workload. Community self-hosting can avoid a software subscription under the Sustainable Use License, but hosting and external APIs can cost money. Check license terms before offering a hosted or embedded service to customers. [n8n pricing](https://n8n.io/pricing/) · [n8n licensing FAQ](https://support.n8n.io/article/can-i-use-your-license-for-my-use-case) · [Zapier tasks](https://help.zapier.com/hc/en-us/articles/8496196837261-How-is-task-usage-measured-in-Zapier) · [Make pricing](https://www.make.com/en/pricing)

## Make it ready for regular use

| What went wrong | First check |
| --- | --- |
| Scheduled flow did not start | Published state, workflow timezone and next trigger time |
| Webhook returns 404 | HTTP method, path, active test listener or published Production URL |
| App returns 401 or 403 | Credential, permission and destination account |
| App returns 429 | Provider limits, retry delays and batch size |
| Duplicate messages | Event ID, saved delivery state and concurrent runs |
| Fields are empty | Inspect node output and check `$json.body` versus top-level fields |

Give nodes descriptive names, keep credentials out of exported JSON and test with synthetic data. Configure an **Error Trigger** in a separate workflow and attach it as the error workflow. For a maintained self-hosted instance, keep n8n patched, configure HTTPS and the external webhook URL behind your proxy, prune execution history, and back up the database and credential encryption key together through a secure backup process. At higher volume, evaluate PostgreSQL and queue mode with Redis and workers. [Error handling](https://docs.n8n.io/flow-logic/error-handling/) · [Self-hosting docs](https://docs.n8n.io/hosting/)

## Your first four weeks

**Week 1** · Build the manual workflow and test both branches. **Week 2** · Add HTTP Request and learn field mapping, batching and rate limits. **Week 3** · Publish one authenticated webhook and test retry and duplicate behavior. **Week 4** · Add AI drafting, human review and failure alerts. When looking for a starter workflow, review the nodes and permissions before connecting credentials. [Templates](https://n8n.io/workflows/) · [Community](https://community.n8n.io/)

## Frequently asked questions

### Can I use n8n for free?

The self-hosted Community Edition is available without a software subscription. Hosting and AI model APIs can cost extra. [n8n plans](https://n8n.io/pricing/)

### Do I need to code my first workflow?

Build the Manual Trigger, Edit Fields and IF example in the editor. A short expression inserts the name into the output.

### How do I return the lab’s 400 response from a real webhook?

Set the Webhook response mode to **Using Respond to Webhook Node**. Use IF to validate the name first. On the invalid branch, return a JSON body and HTTP 400 with Respond to Webhook. On the valid branch, complete the workflow and return HTTP 200. [Official Webhook docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

### Where can I see the real n8n editor?

Open the [official n8n quickstart](https://docs.n8n.io/try-it-out/quickstart/). The TechWadh diagrams above show how the examples are wired.

**Also read** [Compare popular AI tools](/grok-vs-chatgpt-vs-gemini-vs-claude/).
