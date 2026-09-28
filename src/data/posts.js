export const posts = [
  {
    slug: "github-pages",
    title: "Deploy a React app to GitHub Pages",
    dek: "Six concrete steps: set the base path, build, publish dist, fix deep links, then verify the URL.",
    date: "2026-09-28",
    displayDate: "28 September 2026",
    minutes: 8,
    sections: [
      {
        heading: null,
        paragraphs: [
          "A Vite React app becomes a folder of static files. GitHub Pages serves that folder. Deploying is not “put React on GitHub.” It is: tell the build its public URL, publish dist, and make client routes survive a refresh.",
          "Do the steps in order. Skipping the base path or the 404 copy is how you get a blank white page or a dead refresh.",
        ],
      },
      {
        heading: "1. Decide the public URL",
        paragraphs: [
          "A user site at username.github.io lives at the root: /. A project site at username.github.io/repo-name lives under /repo-name/.",
          "Write that path down before you touch config. Every asset URL in the build has to start with it.",
        ],
      },
      {
        heading: "2. Set Vite’s base",
        paragraphs: [
          "In vite.config.js, set base to '/repo-name/' for a project site, or '/' for a user site. Keep the trailing slash.",
          "If base is wrong, index.html loads and every /assets/… request 404s. Set this before you build, not after you ship a broken dist.",
        ],
      },
      {
        heading: "3. Build locally and open dist",
        paragraphs: [
          "Run npm run build. Open dist/index.html and confirm script and link tags use your base path, not /assets alone.",
          "If the paths look wrong, fix base and build again. Do not upload a folder you have not checked.",
        ],
      },
      {
        heading: "4. Publish dist with GitHub Actions",
        paragraphs: [
          "In the repository, add a workflow on push to main that: checks out the repo, installs Node, runs npm ci, runs npm run build, uploads the dist folder with actions/upload-pages-artifact, then deploys with actions/deploy-pages.",
          "In Settings → Pages, set the source to GitHub Actions. Do not point Pages at the src branch. Pages should receive the built folder only.",
        ],
      },
      {
        heading: "5. Copy index.html to 404.html",
        paragraphs: [
          "React Router paths like /projects/yam are not real files on Pages. A refresh asks the host for that path and gets a 404.",
          "After the build, copy dist/index.html to dist/404.html (in the workflow, or with a small postbuild script). Pages serves 404.html for missing paths; the app reads the real URL and renders the right screen. Hash routing also works, but keep real paths if you can.",
        ],
      },
      {
        heading: "6. Verify the live site",
        paragraphs: [
          "Open the Pages URL from the Action summary. Soft-navigate to an inner route, then hard-refresh. Both should work.",
          "If assets 404, base is wrong. If only refresh fails, 404.html is missing. If the Action never runs, check the branch name and the Pages source setting. When those three pass, the deploy is done.",
        ],
      },
    ],
  },
  {
    slug: "python-ai-models",
    title: "Use any OpenAI-compatible model from Python",
    dek: "Install the OpenAI package once. Point base_url and model at OpenAI, Groq, Together, OpenRouter, or a local server.",
    date: "2026-09-20",
    displayDate: "20 September 2026",
    minutes: 10,
    sections: [
      {
        heading: null,
        paragraphs: [
          "Many hosts speak the same chat API as OpenAI. You keep the openai Python package, change base_url, api_key, and model, and the rest of your code stays the same.",
          "This note is the install, a normal OpenAI call, then the same call aimed at other providers.",
        ],
      },
      {
        heading: "1. Install the package",
        paragraphs: ["Use a virtualenv, then install openai."],
        codes: [
          {
            label: "Terminal",
            code: `python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install openai`,
          },
        ],
        links: [{ href: "https://pypi.org/project/openai/", label: "openai on PyPI" }],
      },
      {
        heading: "2. Call OpenAI itself",
        paragraphs: [
          "Export your key, then create a client and send a chat completion.",
        ],
        codes: [
          {
            label: "Terminal",
            code: `export OPENAI_API_KEY="sk-..."`,
          },
          {
            label: "chat_openai.py",
            code: `from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "system", "content": "Answer in one short paragraph."},
        {"role": "user", "content": "What is a Vite base path?"},
    ],
)

print(response.choices[0].message.content)`,
          },
        ],
        links: [
          { href: "https://platform.openai.com/docs/api-reference/chat", label: "OpenAI Chat Completions docs" },
          { href: "https://platform.openai.com/api-keys", label: "Create an OpenAI API key" },
        ],
      },
      {
        heading: "3. Point the same client at another host",
        paragraphs: [
          "OpenAI-compatible hosts expose /v1/chat/completions. Pass base_url and that host’s key. Keep the same chat.completions.create call.",
        ],
        codes: [
          {
            label: "chat_compatible.py",
            code: `import os
from openai import OpenAI

# Examples — use one host at a time:
# Groq:       https://api.groq.com/openai/v1
# Together:   https://api.together.xyz/v1
# OpenRouter: https://openrouter.ai/api/v1
# Ollama:     http://localhost:11434/v1

client = OpenAI(
    api_key=os.environ["COMPAT_API_KEY"],  # host key, or "ollama" for local
    base_url=os.environ["COMPAT_BASE_URL"],
)

response = client.chat.completions.create(
    model=os.environ["COMPAT_MODEL"],  # e.g. llama-3.3-70b-versatile
    messages=[
        {"role": "user", "content": "Say hello in one sentence."},
    ],
)

print(response.choices[0].message.content)`,
          },
          {
            label: "Terminal — example env for Groq",
            code: `export COMPAT_BASE_URL="https://api.groq.com/openai/v1"
export COMPAT_API_KEY="gsk_..."
export COMPAT_MODEL="llama-3.3-70b-versatile"
python chat_compatible.py`,
          },
        ],
        links: [
          { href: "https://console.groq.com/docs/openai", label: "Groq OpenAI compatibility" },
          { href: "https://docs.together.ai/docs/openai-api-compatibility", label: "Together OpenAI compatibility" },
          { href: "https://openrouter.ai/docs/quickstart", label: "OpenRouter quickstart" },
        ],
      },
      {
        heading: "4. One helper you can reuse",
        paragraphs: [
          "Wrap creation so the rest of the app only sees complete(messages).",
        ],
        codes: [
          {
            label: "llm.py",
            code: `import os
from openai import OpenAI

def make_client():
    base = os.getenv("COMPAT_BASE_URL")
    if base:
        return OpenAI(api_key=os.environ["COMPAT_API_KEY"], base_url=base)
    return OpenAI()  # default OpenAI API

def complete(messages, model=None):
    client = make_client()
    model = model or os.getenv("COMPAT_MODEL") or "gpt-4.1-mini"
    response = client.chat.completions.create(model=model, messages=messages)
    return response.choices[0].message.content

if __name__ == "__main__":
    print(complete([{"role": "user", "content": "Ping."}]))`,
          },
        ],
      },
      {
        heading: "5. Common failures",
        paragraphs: [
          "401: wrong or missing api_key for that host.",
          "404 on /chat/completions: base_url is missing /v1 (or the host’s documented prefix).",
          "model_not_found: the model id is host-specific. Copy it from that host’s model list, not from OpenAI’s catalogue.",
          "When those three are right, swapping hosts is only env vars.",
        ],
      },
    ],
  },
  {
    slug: "code-decides",
    title: "Let the model write. Let the code decide.",
    dek: "Language models are good at messy input. Product rules belong in functions you can read and refuse.",
    date: "2026-09-12",
    displayDate: "12 September 2026",
    minutes: 7,
    sections: [
      {
        heading: null,
        paragraphs: [
          "A model is useful where the input is language and the output is a draft. It is a bad place to hide the rule that makes the product honest: whether a groom still fits the day, whether a meal respects a diet, whether a calorie band is wide enough to show uncertainty.",
          "I keep that split sharp on purpose. The model may propose. The code accepts, rejects, or asks again.",
        ],
      },
      {
        heading: "Put refusals in functions",
        paragraphs: [
          "If a double coat needs 150 minutes and 40 remain, a function should say no. If breakfast cannot clear dairy and a fifteen-minute clock, the planner should name the broken slot. Those sentences are features. They are not tone.",
          "When the rule lives in a model prompt, you cannot unit-test it, and you cannot explain it to a tired person at a wet table. When it lives in code, you can.",
        ],
      },
      {
        heading: "Give the model a narrow job",
        paragraphs: [
          "Parsing a workout sentence, ranking resumes against a posted job, suggesting a swap when an ingredient is gone — those are language jobs. Feed the model only what it needs, ask for a structured result, then run your own checks.",
          "If the structured result fails validation, ask once more or fall back to a form. Do not silently “fix” the product constraint to save the demo.",
        ],
      },
      {
        heading: "Show the decision surface",
        paragraphs: [
          "Users trust a product that can explain itself. The working models on this site are small because the interesting part is the decision you can watch: the day bar that fills, the shared ingredient that lights up, the band instead of a fake digit.",
          "Keep the model at the edge of that surface. Let the middle stay boring, inspectable, and yours.",
        ],
      },
    ],
  },
  {
    slug: "working-model-first",
    title: "Ship a working model before the product",
    dek: "A small interactive clone of the core loop beats a slide deck — and it fits on a portfolio page.",
    date: "2026-08-30",
    displayDate: "30 August 2026",
    minutes: 6,
    sections: [
      {
        heading: null,
        paragraphs: [
          "Before accounts, payments, and polish, build the loop that makes the product true. For a booking app, that is duration against a day. For a meal planner, overlap against constraints. For a calorie tool, distance in and burn out.",
          "I put those loops on the project pages as working models. They are not the product. They are the argument you can operate with your hands.",
        ],
      },
      {
        heading: "Strip to one decision",
        paragraphs: [
          "Ask what the user must get right on a bad day. Keep that, and a readout that shows the consequence. Cut everything that does not change the decision.",
          "If the prototype needs a tutorial to make sense, the decision is still fuzzy. Tighten the objects until a stranger can fail usefully in under a minute.",
        ],
      },
      {
        heading: "Keep state local and honest",
        paragraphs: [
          "In-browser state is enough for a working model. Prefer plain functions you can paste into a lab snippet. Persistence and multiplayer can wait until the rule is worth keeping.",
          "Label the thing clearly: working model, not the shipped product. Visitors should feel invited to try, not tricked into thinking they opened production.",
        ],
      },
      {
        heading: "Use it to write the real backlog",
        paragraphs: [
          "Once the loop exists, the missing product work becomes obvious: roles, deposits, pantry sync, device sensors. You are no longer inventing features against a blank page. You are wrapping a rule you already trust.",
          "That is why the model comes first. It is cheaper to revise a small desk than to rebuild a platform around a story that never ran.",
        ],
      },
    ],
  },
  {
    slug: "ollama-local",
    title: "Install Ollama and run free models locally",
    dek: "Download Ollama, pull a model, chat in the terminal, then call it from Python with the OpenAI package.",
    date: "2026-08-14",
    displayDate: "14 August 2026",
    minutes: 9,
    sections: [
      {
        heading: null,
        paragraphs: [
          "Ollama runs open models on your machine. No cloud key for the default setup. You install the app, pull a model, and talk to it from the CLI or from Python on http://localhost:11434.",
        ],
        links: [
          { href: "https://ollama.com/", label: "Ollama homepage" },
          { href: "https://ollama.com/download", label: "Download Ollama (macOS, Windows, Linux)" },
          { href: "https://ollama.com/library", label: "Model library" },
        ],
      },
      {
        heading: "1. Install Ollama",
        paragraphs: [
          "macOS and Windows: download the installer from the link above and open it. Linux: use their install script.",
        ],
        codes: [
          {
            label: "Terminal — Linux install",
            code: `curl -fsSL https://ollama.com/install.sh | sh`,
          },
        ],
        links: [{ href: "https://github.com/ollama/ollama", label: "Ollama on GitHub" }],
      },
      {
        heading: "2. Confirm the service is up",
        paragraphs: [
          "After install, the Ollama app (or service) should be running. Check the version and that the API answers.",
        ],
        codes: [
          {
            label: "Terminal",
            code: `ollama --version
curl http://localhost:11434/api/tags`,
          },
        ],
      },
      {
        heading: "3. Pull a free local model",
        paragraphs: [
          "Pick a model size your machine can hold. llama3.2 is a solid small default. mistral and qwen2.5 are common alternatives. Pull once; Ollama caches the weights.",
        ],
        codes: [
          {
            label: "Terminal",
            code: `ollama pull llama3.2
# other useful pulls:
# ollama pull mistral
# ollama pull qwen2.5:7b
ollama list`,
          },
        ],
        links: [
          { href: "https://ollama.com/library/llama3.2", label: "llama3.2 on Ollama" },
          { href: "https://ollama.com/library/mistral", label: "mistral on Ollama" },
          { href: "https://ollama.com/library/qwen2.5", label: "qwen2.5 on Ollama" },
        ],
      },
      {
        heading: "4. Chat from the terminal",
        paragraphs: ["Run an interactive session, or pass one prompt and exit."],
        codes: [
          {
            label: "Terminal",
            code: `ollama run llama3.2
# or one shot:
ollama run llama3.2 "Explain Vite base in two sentences."`,
          },
        ],
      },
      {
        heading: "5. Call Ollama from Python",
        paragraphs: [
          "Ollama exposes an OpenAI-compatible endpoint at /v1. Use the openai package with base_url set to localhost. The api_key value can be any non-empty string.",
        ],
        codes: [
          {
            label: "Terminal",
            code: `pip install openai`,
          },
          {
            label: "chat_ollama.py",
            code: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # required by the client; Ollama does not check it
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[
        {"role": "user", "content": "List three local-first AI tips."},
    ],
)

print(response.choices[0].message.content)`,
          },
        ],
        links: [
          { href: "https://github.com/ollama/ollama/blob/main/docs/openai.md", label: "Ollama OpenAI compatibility docs" },
        ],
      },
      {
        heading: "6. Optional: Ollama’s own Python library",
        paragraphs: ["If you prefer their native client instead of openai:"],
        codes: [
          {
            label: "Terminal",
            code: `pip install ollama`,
          },
          {
            label: "native_ollama.py",
            code: `import ollama

response = ollama.chat(
    model="llama3.2",
    messages=[{"role": "user", "content": "Hello from the native client."}],
)

print(response["message"]["content"])`,
          },
        ],
        links: [{ href: "https://github.com/ollama/ollama-python", label: "ollama-python on GitHub" }],
      },
      {
        heading: "7. If something fails",
        paragraphs: [
          "connection refused: start the Ollama app, then retry curl http://localhost:11434/api/tags.",
          "model not found: run ollama list and use an exact name you have pulled.",
          "Slow or thrashing disk: pull a smaller tag (for example llama3.2:1b) or close other GPU apps.",
          "When the CLI chat works, the Python client on port 11434 will work with the same model name.",
        ],
      },
    ],
  },
];

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}

export function nextPost(slug) {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return posts[0];
  return posts[(index + 1) % posts.length];
}

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function postHaystack(post) {
  const parts = [post.title, post.dek, post.slug, post.displayDate];
  for (const section of post.sections || []) {
    if (section.heading) parts.push(section.heading);
    if (section.paragraphs) parts.push(...section.paragraphs);
    for (const code of section.codes || []) {
      if (code.label) parts.push(code.label);
    }
    for (const link of section.links || []) {
      if (link.label) parts.push(link.label);
    }
  }
  return normalizeSearch(parts.join(" "));
}

const postSearchIndex = new Map(posts.map((post) => [post.slug, postHaystack(post)]));

export function searchPosts(query) {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  if (!tokens.length) return posts;
  return posts.filter((post) => {
    const haystack = postSearchIndex.get(post.slug) || "";
    return tokens.every((token) => haystack.includes(token));
  });
}
