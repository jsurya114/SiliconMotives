/**
 * Verified company facts used across the site. Keep every claim here true and
 * supportable; update this file rather than hard-coding facts in components.
 */

export const founders = [
  {
    name: "Jasil M",
    initials: "JM",
    role: "Founder",
    focus: "Software developer · System & cloud architect",
    linkedin: "https://www.linkedin.com/in/jasilmeledath/",
  },
  {
    name: "Jayasoorya S",
    initials: "JS",
    role: "Co-founder",
    focus: "Software developer · System & cloud architect",
    linkedin: "https://www.linkedin.com/in/jayasoorya-suryadas/",
  },
];

/** Early proof shown under the hero. */
export const proof = [
  { value: "10+", label: "Client projects delivered" },
  { value: "5,000+", label: "Users on a production commerce platform we operate" },
  { value: "AWS", label: "Production infrastructure run in-house" },
  { value: "Build → Operate", label: "We stay responsible after launch" },
];

/** Flagship case study. Set `clientName` (and `url`) once naming is confirmed. */
export const caseStudy = {
  clientName: "" as string,
  url: "" as string,
  title: "Production e-commerce platform",
  users: "5,000+",
  summary:
    "We help develop the platform and run its AWS production infrastructure end to end: from application and API work to deployments, monitoring and day-to-day maintenance.",
  role: [
    "Application development",
    "Backend & APIs",
    "Database",
    "AWS infrastructure",
    "Deployments & CI/CD",
    "Monitoring",
    "Production operations",
    "Ongoing maintenance",
  ],
};

/** Tools the team genuinely uses; only these appear on the site. */
export const stack = {
  software: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
  cloud: ["EC2", "RDS", "S3", "CloudFront", "Route 53", "Terraform"],
  devops: ["Docker", "Terraform", "Nginx", "PM2", "Linux"],
};
