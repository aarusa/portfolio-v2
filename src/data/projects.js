export const projects = [
  {
    slug: "pupsplash",
    name: "PupSplash",
    index: "01",
    kind: "Booking",
    year: "2026",
    featured: true,
    line: "A client, their dogs, and a time.",
    dek: "A dog grooming booking app. People have accounts, and those accounts have roles. A client can have more than one dog. Services are yours to define. An appointment belongs to a client and a specific dog.",
    caption: "The dog is on the day. The client is on the account.",
    poster: "pupsplash",
    facts: [
      ["Field", "Dog grooming booking"],
      ["Roles", "Admin, groomer, editor"],
      ["On this page", "A small booking desk"],
    ],
    sections: [
      {
        heading: "Accounts, then permissions",
        paragraphs: [
          "PupSplash starts with a user account. The account is not a single kind of person. An admin runs the shop. A groomer works the day. An editor keeps the records. Each role can do the part of the job that belongs to it, and is kept out of the rest.",
        ],
      },
      {
        heading: "The client is not the dog",
        paragraphs: [
          "A client has a profile, and that profile can hold more than one dog. Maple, Otis, and Juniper do not share a coat, a temperament, or a service. They do share Nora. The appointment is made for the client and then for the dog who is actually coming in.",
        ],
      },
      {
        heading: "Services, then the slot",
        paragraphs: [
          "The studio adds its own services. A bath, a full groom, nails. Once those exist, someone with permission books them: this client, this dog, this service, this day. The desk below is that loop, small enough to try.",
        ],
      },
    ],
  },
  {
    slug: "yam",
    name: "YAM",
    index: "02",
    kind: "Meals",
    year: "2026",
    featured: true,
    line: "Breakfast through dinner, from what you have.",
    dek: "An AI meal planner and recipe generator, with a pantry. You can pick ingredients yourself, cook from what is already there, mix the two, or let the model decide. Breakfast, lunch, snack, and dinner follow your calories and the way you like to eat.",
    caption: "Four meals. A pantry. A calorie target.",
    poster: "yam",
    facts: [
      ["Field", "Meal plans, recipes, pantry"],
      ["Meals", "Breakfast, lunch, snack, dinner"],
      ["On this page", "A day generator"],
    ],
    sections: [
      {
        heading: "Four meals, your way",
        paragraphs: [
          "YAM is a meal planner and a recipe generator. The day it builds has four places: breakfast, lunch, snack, and dinner. Those meals sit on two things you already know about yourself — how you like to eat, and the calories you are tracking.",
          "You do not have to start from a blank prompt. Choose the ingredients, use what the pantry already holds, mix a pantry item with something you still need to buy, or hand the whole day to the model.",
        ],
      },
      {
        heading: "The pantry is part of the plan",
        paragraphs: [
          "A pantry that never meets the generator is just a list. In YAM it is one of the ways a meal is allowed to begin. The prototype on this page is the smaller slice: a day chosen from constraints, with shared ingredients kept visible. The product around it also keeps the pantry, the snack, and the calorie target.",
        ],
      },
    ],
  },
  {
    slug: "burnit",
    name: "Burnit",
    index: "03",
    kind: "Training",
    year: "2026",
    featured: true,
    line: "Kilometres, steps, and the burn.",
    dek: "Burnit calculates calories from walking and running you can count. Tell it the kilometres, or the steps. Or tell it the calories you still need, and it tells you how far to walk or run.",
    caption: "Five kilometres, or the steps that made them.",
    poster: "burnit",
    facts: [
      ["Field", "Walking and running calories"],
      ["Inputs", "Kilometres or step count"],
      ["On this page", "A distance calculator"],
    ],
    sections: [
      {
        heading: "Count what you already did",
        paragraphs: [
          "A walk and a run are different kinds of work, and both can be written down without a watch novel. Burnit takes the mode, your weight, and either the kilometres or the step count, then returns the calories those produced. Steps and kilometres stay tied together, so one count can be read as the other.",
        ],
      },
      {
        heading: "Or count what you still need",
        paragraphs: [
          "The other direction matters just as much. If the goal is a number of calories, Burnit answers with distance: how far to walk, how far to run, and how many steps that is. The calculator below does both. It is the small version of that loop.",
        ],
      },
    ],
  },
  {
    slug: "swifthire",
    name: "SwiftHire",
    index: "04",
    kind: "Hiring",
    year: "2026",
    featured: false,
    line: "The pile becomes an order.",
    dek: "A platform for recruiters. Post a job, let candidates apply, and rank those resumes for the person who has to choose.",
    caption: "The job is posted. The resumes are in order.",
    poster: "swifthire",
    facts: [
      ["Field", "Recruiting"],
      ["For", "Recruiters ranking applicants"],
      ["On this page", "A small ranking desk"],
    ],
    sections: [
      {
        heading: "The recruiter posts the job",
        paragraphs: [
          "SwiftHire begins with the role, written by the recruiter. That post is the thing every resume is read against. Without it, a pile of applications is only a pile.",
        ],
      },
      {
        heading: "Candidates apply",
        paragraphs: [
          "People apply with a resume. The platform holds those applications against the job that was posted, rather than dropping them into a folder no one will open in order.",
        ],
      },
      {
        heading: "Then the resumes are ranked",
        paragraphs: [
          "The useful screen is the order. Recruiters see candidates ranked from the resumes, so the first conversation is with someone the role actually asked for. The desk below posts a job, takes applications, and sorts them. It is a small version of that ranking.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

export function nextProject(slug) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return projects[0];
  return projects[(index + 1) % projects.length];
}
