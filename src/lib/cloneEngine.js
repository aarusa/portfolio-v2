const FACETS = ["overview", "does", "tech", "why", "how", "hard"];

const projects = {
  pupsplash: {
    name: "PupSplash",
    href: "/projects/pupsplash",
    test: /\b(pupsplash|pup splash|pups|groomer|grooming|groom|dogs?|booking|appointment|calendar|coat|desk)\b/,
    overview:
      "PupSplash is a dog grooming booking app. People create accounts, and those accounts carry roles — admin, groomer, editor — with permissions that follow the role. A user creates a client profile, adds that client’s dogs, adds the studio’s services, and books an appointment for a client and a specific dog.",
    does:
      "In practice: sign in, land in a role, manage clients and their dogs, define services with durations, and fill a day with appointments. The appointment always names the client and the specific dog. The desk on this site is the small version of that loop — pick client, dog, and service, book it, and watch the day fill until a long groom no longer fits.",
    tech:
      "PupSplash’s product path is a full-stack booking system: accounts and roles, client and dog records, services, and appointment slots. On this portfolio the working model is plain React and JavaScript in the browser — no backend call — so you can feel the day-fit rule without accounts. The real product keeps permissions and data behind an API; the prototype keeps the deciding rule visible.",
    why:
      "A grooming day falls apart when the dog, the owner, and the service live in three different notebooks. I wanted one account system where the role decides what you may touch, and the appointment always names both the client and the dog.",
    how:
      "The working model on the PupSplash page is a small prototype, not the product. Pick a client, a dog, and a service, book the appointment, and read the list of what landed on the day. Underneath, a fit function refuses a service that does not fit the minutes left.",
    hard:
      "Roles are easy to list and easy to get wrong. An editor who can quietly book, or a groomer who can rewrite the service menu, makes the shop feel unsafe. The permission has to be visible in the moment you try to do the thing.",
  },
  yam: {
    name: "YAM",
    href: "/projects/yam",
    test: /\b(yam|meals?|meal plan|recipes?|dinner|lunch|breakfast|cooking|kitchen|pantry|grocery|groceries|food)\b/,
    overview:
      "YAM is an AI meal planner and recipe generator, with a pantry. You can choose ingredients yourself, cook from what is already in the pantry, mix the two, or let the model decide. It builds breakfast, lunch, snack, and dinner around your calorie target and how you like to eat.",
    does:
      "You set people, time, diet, and exclusions. YAM returns a day of meals that prefer shared ingredients, or it refuses clearly when nothing fits. The product also keeps a pantry and a calorie preference, and can start from chosen ingredients, pantry stock, a mix, or the model. The page prototype is the day generator slice you can run without an account.",
    tech:
      "YAM’s product uses an AI model for messy meal language, with product rules — diet, minutes, calories, pantry — enforced in code so the model cannot quietly drop them. On this site the working model is React plus plain JavaScript: a generator that scores recipe overlap and refuses impossible days. No cloud call in the prototype; the real product can hand a day to a model while those constraints stay in functions you can test.",
    why:
      "A generator that ignores the pantry writes a shopping list you will not carry home. The plan should be able to start from food you already have, food you still need, or a mix, and still land on a full day.",
    how:
      "The prototype on the YAM page plans one day from time, diet, and exclusions, and prefers recipes that share ingredients. That is a small slice. The product also keeps a pantry, a snack, and a calorie preference, and lets you start from chosen ingredients, pantry items, a mix, or the model.",
    hard:
      "Four meals and a pantry can sprawl. The hard part is letting you choose how much to hand to the model without it dropping the calorie target or the food you said you already own.",
  },
  burnit: {
    name: "Burnit",
    href: "/projects/burnit",
    test: /\b(burnit|burn|calories?|fitness|workout|training|walk|walking|run|running|steps|step count|kilometres|kilometers|km)\b/,
    overview:
      "Burnit calculates calories burned from walking and running. You can enter how many kilometres you covered, or your step count. You can also start from the calories you need to burn, and it tells you how far to walk or run, in kilometres and in steps.",
    does:
      "Two directions. Forward: pick walk or run, enter kilometres or steps and body weight, get a calorie band plus the other count. Reverse: enter calories to burn and weight, get how far to walk and run, in kilometres and steps. The page calculator is that loop — no login, no tracker sync, just the math you can check.",
    tech:
      "Burnit is formula-first, not a black-box model. The portfolio calculator is React with plain JavaScript: MET-style estimates for walk vs run, step length tied to distance, and a band instead of a fake exact calorie. The product can sit next to wearables later; the deciding math stays readable code, not an opaque prediction.",
    why:
      "The numbers people actually have are distance and steps. I wanted the calorie to come from those, and the reverse to be just as plain: if you need to burn a number, how far is that.",
    how:
      "The prototype on the Burnit page does both directions. Pick walk or run, then kilometres or steps, and it returns a calorie band plus the other count. Or enter a calorie target and your weight, and it returns the walk and the run as distance and steps. It is a small prototype, not the full tracker.",
    hard:
      "A step is not a fixed length, and a kilometre walked is not a kilometre run. The model keeps those apart, and it shows a band rather than pretending the body sent a receipt.",
  },
  swifthire: {
    name: "SwiftHire",
    href: "/projects/swifthire",
    test: /\b(swifthire|swift hire|recruiter|recruiters|resume|resumes|hiring|applicant|applicants|candidates)\b/,
    overview:
      "SwiftHire is for recruiters. A recruiter posts a job. Candidates apply. The platform ranks those resumes so the recruiter sees an order, not a pile. It lives on the projects page.",
    does:
      "Post a job description. Collect short resumes. Rank applicants by how their words meet the job, and show the overlapping terms so the order is explainable. The desk on this site is that core: write the role, add people, rank, read why someone is first.",
    tech:
      "SwiftHire’s product path is a recruiting platform: job posts, applications, and a ranking step a recruiter can defend. The portfolio desk is React and plain JavaScript — tokenize the job and each resume, score shared meaningful words, sort, and surface the hits. No cloud ranking model in the prototype; the real product can grow models around that loop without hiding why someone moved up.",
    why:
      "Applications arrive faster than anyone can read them fairly. Ranking from the resume, against the job that was posted, is the screen a recruiter actually needs.",
    how:
      "The prototype lets you write the job, add candidates with a short resume, and rank them by how the words in the resume meet the words in the post. The real product is the platform around that: post, apply, rank. The desk on the page is only a small prototype.",
    hard:
      "A rank that cannot be explained is just a sort. The useful version shows why someone is first. The prototype keeps that small: the overlapping words are visible under the name.",
  },
};

const posts = [
  {
    id: "github-pages",
    href: "/blog/github-pages",
    test: /\b(github pages|gh pages|deploy|deployment|vite base|static host|react deploy)\b/,
    title: "Deploy a React app to GitHub Pages",
    overview:
      "“Deploy a React app to GitHub Pages” is the step-by-step note from 28 September 2026. Set Vite’s base, build, publish dist with Actions, copy index.html to 404.html for client routes, then verify a hard refresh on an inner URL.",
  },
  {
    id: "python-ai-models",
    href: "/blog/python-ai-models",
    test: /\b(python|openai|groq|together|openrouter|ai models|llm client|compatible|base_url)\b/,
    title: "Use any OpenAI-compatible model from Python",
    overview:
      "“Use any OpenAI-compatible model from Python” is the practical note: pip install openai, call OpenAI normally, then point base_url and model at Groq, Together, OpenRouter, or Ollama without rewriting the chat call.",
  },
  {
    id: "code-decides",
    href: "/blog/code-decides",
    test: /\b(code decides|product rules|refusals|model write|constraints in code)\b/,
    title: "Let the model write. Let the code decide.",
    overview:
      "“Let the model write. Let the code decide.” argues that language models handle messy input, while duration, diet, and calorie bands belong in functions you can refuse and test.",
  },
  {
    id: "working-model-first",
    href: "/blog/working-model-first",
    test: /\b(working model|prototype|before the product|interactive clone)\b/,
    title: "Ship a working model before the product",
    overview:
      "“Ship a working model before the product” is about building the core loop first — the desk, the overlap, the burn — as a small interactive argument before accounts and polish.",
  },
  {
    id: "ollama-local",
    href: "/blog/ollama-local",
    test: /\b(ollama|local model|run locally|llama3|free models)\b/,
    title: "Install Ollama and run free models locally",
    overview:
      "“Install Ollama and run free models locally” walks through download, ollama pull, terminal chat, and calling localhost:11434/v1 from the OpenAI Python package.",
  },
];

const lab = {
  dayload: {
    name: "Dayload",
    href: "/lab/dayload",
    test: /\b(dayload)\b/,
    overview:
      "Dayload is a lab experiment: an eight-hour grooming desk. You add real service lengths until a double coat no longer fits. The snippet underneath is the fit function the buttons call.",
  },
  pantry: {
    name: "Pantry",
    href: "/lab/pantry",
    test: /\b(pantry)\b/,
    overview:
      "Pantry is the other experiment. You tick recipes and watch ingredients split into things you buy once and things you buy twice. It is the overlap idea from YAM with the generator taken out, so you can see the score by hand.",
  },
  rinse: {
    name: "Rinse",
    href: "/lab/rinse",
    test: /\b(rinse)\b/,
    overview:
      "Rinse is a small game. A brush crosses a muddy span and you hit rinse while it is over the coat. I made it while thinking about one-handed confirmation at a wet table. It stayed because it is good for two minutes and no longer.",
  },
  range: {
    name: "Range",
    href: "/lab/range",
    test: /\b(play range|range game|the game range)\b/,
    overview:
      "Range is the other game. Eight workouts, described in a sentence. You guess a calorie number and the lab estimator answers with a band. Burnit’s own calculator is the one for kilometres and steps. Landing inside the band is the win. Hitting a fake exact digit is not the skill.",
  },
};

function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pack(paragraphs, memory, suggestions, link) {
  return {
    text: paragraphs.filter(Boolean).join("\n\n"),
    memory,
    suggestions,
    link: link || null,
  };
}

function suggestionsFor(memory) {
  if (memory?.topic === "project" && memory.id === "pupsplash") {
    return ["What does PupSplash actually do?", "What tech does it use?", "Why refuse a booking?", "What was hard?"];
  }
  if (memory?.topic === "project" && memory.id === "yam") {
    return ["What does YAM actually do?", "What tech does it use?", "Why overlap?", "What was hard?"];
  }
  if (memory?.topic === "project" && memory.id === "burnit") {
    return ["What does Burnit actually do?", "What tech does it use?", "How do steps become calories?", "What was hard?"];
  }
  if (memory?.topic === "project" && memory.id === "swifthire") {
    return ["What does SwiftHire actually do?", "What tech does it use?", "How does the ranking work?", "What was hard?"];
  }
  if (memory?.topic === "writing") return ["Which project is that about?", "What else did you write?"];
  if (memory?.topic === "lab") return ["How do I play?", "Show me the experiments"];
  return ["What does PupSplash actually do?", "What tech does YAM use?", "How does Burnit count a walk?"];
}

function projectPack(id, facet) {
  const project = projects[id];
  const memory = { topic: "project", id, facet };
  const link =
    facet === "how" || facet === "does"
      ? { href: `${project.href}#try`, label: `Try ${project.name}` }
      : { href: project.href, label: `Open ${project.name}` };
  return pack([project[facet]], memory, suggestionsFor(memory), link);
}

function detectProjects(q) {
  return Object.entries(projects)
    .filter(([, project]) => project.test.test(q))
    .map(([id]) => id);
}

function facetFrom(q) {
  if (/\b(tech|technology|technologies|stack|built with|built in|framework|react|laravel|python|javascript|api|backend|frontend|database|db)\b/.test(q)) {
    return "tech";
  }
  if (/\b(actually do|what does it do|what do(es)? .+ do|features?|functionality|users? (can|do)|in practice|day to day|core loop)\b/.test(q)) {
    return "does";
  }
  if (/\b(why|reason|matter|problem|point of)\b/.test(q)) return "why";
  if (/\b(hard|difficult|tradeoff|trade off|wrong|challenge)\b/.test(q)) return "hard";
  if (/\b(how|work|works|build|built|model|desk|parser|generator|prototype|working model)\b/.test(q)) return "how";
  return "overview";
}

function isThinFollowUp(q, memory) {
  if (q.split(" ").length > 6) return false;
  if (!/^(more|tell me more|go on|continue|elaborate|what else|deeper|keep going|why|how|tech|stack|example)\b/.test(q)) return false;
  const mentioned = detectProjects(q);
  if (mentioned.length && memory?.id && !mentioned.includes(memory.id)) return false;
  return true;
}

export function respond(raw, memory = { topic: null, id: null, facet: null }) {
  const q = clean(raw);
  if (!q) {
    return pack(["Ask me about a project, an essay, or something in the lab."], memory, suggestionsFor(memory));
  }

  if (/^(hi|hey|hello|yo|good morning|good afternoon|good evening)\b/.test(q) && q.split(" ").length < 6) {
    return pack(
      ["I’m here. Ask me about PupSplash, YAM, Burnit, or SwiftHire — or about the blog and the lab. I answer from this site, in the first person, and I stay with the work."],
      { topic: "about", id: null, facet: "overview" },
      ["Tell me about PupSplash", "What do you write about?", "What can I play?"],
    );
  }

  if (/how are you|how s it going|what s up/.test(q)) {
    return pack(
      ["Working, which is my favorite state. PupSplash, YAM, and Burnit are on the home page. SwiftHire is with them on the projects page."],
      { topic: "about", id: null, facet: "overview" },
      suggestionsFor(null),
    );
  }

  if (/\b(thank|thanks|cheers)\b/.test(q)) {
    return pack(["Anytime. Stay on a project if you want the next layer."], memory, suggestionsFor(memory));
  }

  if (isThinFollowUp(q, memory) && memory?.topic === "project" && memory.id && projects[memory.id]) {
    const order = FACETS;
    let facet = facetFrom(q);
    if (facet === "overview") {
      const current = order.indexOf(memory.facet);
      facet = order[Math.min(order.length - 1, current + 1)] || "why";
    }
    return projectPack(memory.id, facet);
  }

  if (/\b(who are you|your name|what is your name|are you (a )?real|are you (an )?ai|are you a (bot|clone|model)|digital clone|about you|introduce yourself)\b/.test(q)) {
    return pack(
      [
        "I’m a digital clone of Arusha Shahi. Software engineer, AI explorer. I run in your browser from the work on this site — no cloud model behind this chat.",
        "I can talk about four products. PupSplash is the grooming booking app. YAM is the meal planner, with a pantry. Burnit counts walking and running calories from kilometres or steps. SwiftHire ranks resumes for recruiters. I also know the blog and the lab.",
      ],
      { topic: "about", id: null, facet: "overview" },
      ["What do you actually do?", "Tell me about the three projects", "Where can I reach you?"],
    );
  }

  if (/\b(what do you do|your work|your job|software engineer|ai explorer|background|who is arusha)\b/.test(q)) {
    return pack(
      [
        "I build software, and I explore AI by putting it inside a product that has to survive a real task. PupSplash books grooming appointments under real roles. YAM plans meals from a pantry, ingredients, or the model. Burnit turns kilometres and steps into calories. SwiftHire ranks resumes against a job a recruiter posted.",
        "Where a plain rule is clearer, I keep the plain rule. Burnit’s distance math is a formula. YAM can still hand a day to a model. That split matters to me.",
      ],
      { topic: "about", id: null, facet: "craft" },
      ["How do you use AI?", "Tell me about Burnit", "What did you write?"],
    );
  }

  if (/\b(how do you use ai|your approach to ai|thoughts on ai|ai philosophy|language model)\b/.test(q)) {
    return pack(
      [
        "I use AI where language is messy and a tired person should not have to fill a form. YAM can plan a day from a pantry, from ingredients you name, or from the model, and it still has to keep the calorie target. SwiftHire has to turn a pile of resumes into an order a recruiter can explain.",
        "Where a formula is enough, I keep the formula. Burnit turns kilometres or steps into a calorie band, and the other way around. If I cannot say what a number is made of, I do not print a single digit and call it exact.",
      ],
      { topic: "about", id: null, facet: "ai" },
      ["How does Burnit count a walk?", "How does YAM plan a day?"],
    );
  }

  if (/\b(stack|tech|technologies|react|laravel|python|what do you build with|what tech)\b/.test(q) && detectProjects(q).length === 0) {
    return pack(
      [
        "This portfolio site is React and plain JavaScript — no TypeScript. The working models you can try (booking desk, meal day, burn calculator, resume rank) run entirely in the browser.",
        "Across the real products I work the full path: interface, API, and the constraint underneath. PupSplash needs roles and appointments. YAM can use a model for meals while diet and pantry rules stay in code. Burnit stays formula-first. SwiftHire ranks with an explainable overlap score. Ask about any one project for its specific stack.",
      ],
      { topic: "about", id: null, facet: "stack" },
      ["What tech does PupSplash use?", "What tech does YAM use?", "What tech does Burnit use?"],
    );
  }

  if (/\b(what does .+ (actually )?do|actually do|what can (users?|people|i) do|core loop|in practice)\b/.test(q) && detectProjects(q).length === 0) {
    return pack(
      [
        "Four products, four jobs. PupSplash books a client and their dog under a role. YAM plans a day of meals from pantry, ingredients, or a model. Burnit turns kilometres or steps into calories — and the reverse. SwiftHire posts a job and ranks the resumes that come back.",
        "Name a project and I will go into what it actually does, the tech, or the hard part.",
      ],
      { topic: "list", id: null, facet: "does" },
      ["What does PupSplash actually do?", "What does YAM actually do?", "What does Burnit actually do?"],
    );
  }

  if (/\b(email|contact|reach|hire|github|linkedin|available)\b/.test(q)) {
    return pack(
      [
        "GitHub is github.com/aarusa. LinkedIn is linkedin.com/in/arushashahi. Both are in the footer too.",
        "If you want to see how I think before you write, the blog is the cleanest path. The clone can keep going on any of the products.",
      ],
      { topic: "contact", id: null, facet: "overview" },
      ["What do you write about?", "Tell me about YAM"],
      { href: "https://github.com/aarusa", label: "GitHub" },
    );
  }

  if (/\b(compare|versus|vs|difference|differ|between|all three|in common|thread)\b/.test(q) || detectProjects(q).length >= 2) {
    const ids = detectProjects(q);
    const pair = ids.length >= 2 ? ids.slice(0, 2) : ["pupsplash", "yam", "burnit"];
    if (pair.length === 3 || ids.length === 0) {
      return pack(
        [
          "PupSplash books a client and their dog, under a role. YAM plans breakfast, lunch, snack, and dinner from ingredients, a pantry, or the model, against a calorie preference. Burnit turns kilometres or steps into calories, and can also tell you how far you still need to go. SwiftHire posts a job, takes applications, and ranks the resumes.",
          "They are different rooms. Each one keeps the deciding part visible.",
        ],
        { topic: "compare", id: "all", facet: "overview" },
        ["Tell me about PupSplash", "Tell me about YAM", "Tell me about Burnit"],
      );
    }
    const [a, b] = pair;
    return pack(
      [
        `${projects[a].name} and ${projects[b].name} are different rooms with the same habit. ${projects[a].overview}`,
        projects[b].overview,
        "Ask me why on either one if you want the sharper version.",
      ],
      { topic: "project", id: a, facet: "overview" },
      [`Why ${projects[a].name}?`, `How does ${projects[b].name} work?`],
    );
  }

  const earlyPost = posts.find((post) => post.title.toLowerCase().split(" ").every((word) => word.length < 4 || q.includes(word)) && post.test.test(q));
  if (earlyPost || posts.some((post) => post.test.test(q))) {
    const match = earlyPost || posts.find((post) => post.test.test(q));
    if (match && /\b(essay|write|wrote|writing|read|blog|deploy|python|json|model|prototype|working model|ollama|openai)\b/.test(q)) {
      return pack([match.overview], { topic: "writing", id: match.id, facet: "overview" }, ["What else did you write?"], {
        href: match.href,
        label: "Read the essay",
      });
    }
  }

  const foundProjects = detectProjects(q);
  if (/\b(projects|portfolio|case stud|what have you|show me your work|what did you build|what are you building)\b/.test(q) && foundProjects.length === 0) {
    return pack(
      [
        "Four projects. PupSplash is dog-grooming booking, with roles, clients, dogs, services, and appointments. YAM is an AI meal planner with a pantry. Burnit calculates walk and run calories from kilometres or steps. SwiftHire lets recruiters post a job and rank the resumes that come back.",
        "The home page leads with the first three. SwiftHire is on the projects page with them. I can go into why, how, or the hard part of any one.",
      ],
      { topic: "list", id: null, facet: "overview" },
      ["Tell me about PupSplash", "Tell me about YAM", "Tell me about Burnit"],
    );
  }

  if (foundProjects.length === 1 && !/\b(blog|essay|wrote|writing|lab|game)\b/.test(q)) {
    return projectPack(foundProjects[0], facetFrom(q));
  }

  if (/\b(blog|blogs|essay|essays|writing|write|wrote|read)\b/.test(q)) {
    const match = posts.find((post) => post.test.test(q));
    if (match) {
      return pack(
        [match.overview],
        { topic: "writing", id: match.id, facet: "overview" },
        ["What else did you write?", "Which project is that about?"],
        { href: match.href, label: "Read the essay" },
      );
    }
    return pack(
      [
        "Five notes on the blog. “Deploy a React app to GitHub Pages” is the step-by-step ship guide. “Use any OpenAI-compatible model from Python” shows how to point the openai package at other hosts. “Let the model write. Let the code decide.” is the product rule. “Ship a working model before the product” and “Install Ollama and run free models locally” close the set.",
        "They are written to be read, not skimmed as cards. The writing index is the quiet room on this site.",
      ],
      { topic: "writing", id: null, facet: "overview" },
      ["The GitHub Pages note", "The OpenAI Python client", "Install Ollama"],
      { href: "/blog", label: "Open the blog" },
    );
  }

  const postHit = posts.find((post) => post.test.test(q) || q.includes(post.title.toLowerCase()));
  if (postHit) {
    return pack([postHit.overview], { topic: "writing", id: postHit.id, facet: "overview" }, ["What else did you write?"], {
      href: postHit.href,
      label: "Read the essay",
    });
  }

  if (/\b(lab|experiment|experiments|game|games|play)\b/.test(q)) {
    const item = Object.entries(lab).find(([, entry]) => entry.test.test(q));
    if (item) {
      const [, entry] = item;
      return pack([entry.overview], { topic: "lab", id: item[0], facet: "overview" }, ["What else is in the lab?"], {
        href: entry.href,
        label: entry.href.includes("rinse") || entry.href.includes("range") ? `Play ${entry.name}` : `Open ${entry.name}`,
      });
    }
    if (/\b(play|game|games)\b/.test(q)) {
      return pack(
        [
          "Two games live in the lab with the experiments. Rinse is a timing toy: hit the brush while it is over the muddy span. Range asks you to guess a calorie and scores you if you land inside Burnit’s band.",
          "Dayload and Pantry are the experiments, if you would rather push a model than play.",
        ],
        { topic: "lab", id: "games", facet: "overview" },
        ["How do I play Range?", "What is Dayload?"],
        { href: "/lab/range#play", label: "Play Range" },
      );
    }
    return pack(
      [
        "The lab holds experiments and games in one place. Dayload lets you overfill a grooming day until the long job is refused. Pantry shows ingredient overlap by hand. Rinse and Range are playable.",
        "I kept them together because they are the same habit at a smaller size: a rule you can touch.",
      ],
      { topic: "lab", id: null, facet: "overview" },
      ["Open Dayload", "How do I play Rinse?", "How do I play Range?"],
      { href: "/lab", label: "Open the lab" },
    );
  }

  const labHit = Object.entries(lab).find(([, entry]) => entry.test.test(q));
  if (labHit) {
    return pack([labHit[1].overview], { topic: "lab", id: labHit[0], facet: "overview" }, ["What else is in the lab?"], {
      href: labHit[1].href,
      label: `Open ${labHit[1].name}`,
    });
  }

  if (/\b(weather|news|stock|crypto|password|hack|poem|homework)\b/.test(q)) {
    return pack(
      [
        "That sits outside this clone. I stay with the work on the site: PupSplash, YAM, Burnit, the blog, and the lab. Ask me about one of those and I will actually answer.",
      ],
      memory,
      suggestionsFor(memory),
    );
  }

  if (foundProjects.length === 1) {
    return projectPack(foundProjects[0], facetFrom(q));
  }

  return pack(
    [
      "I don’t have a good answer for that from the work I keep here. Ask what a project actually does, what tech it uses, why it exists, how the model works, or what was hard — for PupSplash, YAM, Burnit, or SwiftHire.",
    ],
    memory,
    ["What does PupSplash actually do?", "What tech does YAM use?", "How does Burnit count a walk?"],
  );
}
