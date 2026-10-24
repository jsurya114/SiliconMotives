export type EngineeringService = {
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  audience: string;
  scope: [string, string][];
  deliverables: string[];
  projects: string[];
  evidenceNote: string;
  faqs: [string, string][];
  deliveryContext?: { heading: string; paragraphs: string[] };
  regions?: { type: 'City' | 'State' | 'Country'; name: string }[];
};

export const engineeringServices: EngineeringService[] = [
  {
    slug: 'custom-software-development', name: 'Custom software development',
    title: 'Custom Software Development in Kochi, Kerala | SiliconMotives',
    description: 'Custom software development from Kochi, Kerala: CRMs, inventory, invoicing and business applications. Founder-led engineering with remote delivery across India.',
    headline: 'Custom software development in Kochi.',
    intro: 'When spreadsheets and disconnected tools make everyday work harder, a focused application can bring the workflow together. We build custom software around your users, responsibilities and business rules.',
    audience: 'For businesses replacing manual operations, founders defining a first release, and agencies delivering a custom application for a client.',
    scope: [
      ['Business applications', 'Inventory, invoicing, staff workflows and administration connected in one application.'],
      ['CRMs and internal tools', 'Lead records, follow-ups, reporting and access rules shaped around the people doing the work.'],
      ['Product development', 'A scoped first release, with integrations and a plan for the next iteration.'],
    ],
    deliverables: ['Agreed workflows and acceptance criteria', 'Application source and implementation notes', 'Deployment and handover arrangements'],
    projects: ['picbox', 'uniwayin', 'dental-buddy'],
    evidenceNote: 'These project overviews describe the documented product scope: rental inventory and invoicing, education consultancy workflows, and clinic administration.',
    deliveryContext: {
      heading: 'Engineering from Kerala. A clear delivery plan.',
      paragraphs: [
        'SiliconMotives has engineering operations in Kochi, Kerala, and works remotely with businesses and agencies. We agree who will review the work, how decisions will be recorded, and when to meet before starting. The delivery plan sets milestones and approval steps so your team can see what is ready and what happens next.',
        'Start with the records and decisions your team handles today: a lead that needs a follow-up, equipment assigned to a rental job, or an invoice prepared for a customer. We map the workflow, the people allowed to change each record, and the connections to existing systems before choosing the implementation.',
        'The first milestone should have a defined workflow, agreed acceptance criteria and a handover plan. Source ownership, account access, hosting responsibilities and ongoing support are documented in the proposal and contract.',
      ],
    },
    regions: [{ type: 'City', name: 'Kochi' }, { type: 'State', name: 'Kerala' }, { type: 'Country', name: 'India' }],
    faqs: [
      ['Do you work with businesses in Kochi and across Kerala?', 'Yes. Our engineering operations are in Kochi, Kerala, with remote delivery. We agree meeting windows, written updates and review checkpoints around the project. Tell us the business workflow you need to improve and who will use the software.'],
      ['Can we start with one workflow?', 'Yes. We can define a first milestone around the most useful workflow, agree acceptance criteria, and plan further work after reviewing that release.'],
      ['Who owns the source code?', 'Source ownership, third-party dependencies, repository access and handover are documented in the proposal and contract before delivery begins.'],
      ['Do you work with U.S. businesses?', 'We offer remote delivery from Kerala, India. For U.S. teams, we agree meeting overlap, written updates and review checkpoints before starting.'],
    ],
  },
  {
    slug: 'backend-development', name: 'Backend development',
    title: 'Backend Development Services | SiliconMotives',
    description: 'Backend engineering for business applications, commerce and agency projects: APIs, data workflows, integrations and role-based access.',
    headline: 'Backend engineering behind the interface.',
    intro: 'A good interface depends on clear data and dependable workflows. We help define and build the backend that connects your application, business rules and external services.',
    audience: 'For frontend teams, product founders and agencies whose client projects need more than a website or storefront.',
    scope: [
      ['APIs and application logic', 'Define API contracts and implement the rules behind records, orders and business workflows.'],
      ['Data and access', 'Model application data, staff roles and permissions around the actual operating requirements.'],
      ['Integrations', 'Connect payment services, reporting and other systems with clear error handling and ownership.'],
    ],
    deliverables: ['API contracts and integration notes', 'Data model and agreed access rules', 'Source, configuration guidance and handover'],
    projects: ['woobe', 'uniwayin', 'nasalogistics'],
    evidenceNote: 'Relevant product scope includes weight-based commerce and checkout, staff access in a CRM, and driver and order workflows. Explore the documented workflows in each project overview.',
    faqs: [
      ['Can you work with our frontend team?', 'Yes. We agree API contracts, responsibilities and integration checkpoints so your team can build against a clear interface.'],
      ['Can you extend an existing backend?', 'We start by reviewing the current code, deployment and requirements. That review defines what can be extended and what needs a separate change.'],
      ['Will you choose a stack before kickoff?', 'The stack follows the requirements, existing systems and maintenance needs. We document the recommendation during architecture rather than assuming one framework fits every project.'],
    ],
  },
  {
    slug: 'cloud-infrastructure', name: 'Cloud infrastructure engineering',
    title: 'Cloud Infrastructure Engineering | SiliconMotives',
    description: 'Cloud infrastructure planning and implementation for application teams: architecture, environments, deployment and operational handover.',
    headline: 'Cloud infrastructure your team can understand.',
    intro: 'Plan how your application runs before infrastructure becomes a collection of one-off decisions. We help connect application needs with a clear cloud architecture and a manageable deployment approach.',
    audience: 'For teams preparing a launch, moving an application to the cloud, or reviewing an environment that has become difficult to operate.',
    scope: [
      ['Architecture and environments', 'Map compute, networking, application services and data dependencies to the needs of the workload.'],
      ['Implementation and deployment', 'Set up agreed environments and document how configuration and application releases are managed.'],
      ['Operational readiness', 'Plan access, monitoring, backup responsibilities and recovery procedures within the agreed scope.'],
    ],
    deliverables: ['Architecture and environment documentation', 'Configuration and access handover', 'Agreed operating responsibilities and recovery guidance'],
    projects: ['woobe'],
    evidenceNote: 'Woobe’s project record identifies AWS infrastructure. Explore the storefront and checkout requirements in its product overview.',
    faqs: [
      ['Do you guarantee uptime or a lower cloud bill?', 'No fixed uptime or savings claim is made here. Availability requirements, cost constraints and support responsibilities need to be defined against the workload and agreed scope.'],
      ['Can you review an existing environment?', 'Yes. A review can map the current setup, identify gaps and produce a prioritized implementation plan before changes are made.'],
      ['Will you operate the environment after handover?', 'Ongoing operation is a separate agreed scope covering responsibilities, access, review cadence and support hours.'],
    ],
  },
  {
    slug: 'aws-devops', name: 'AWS DevOps engineering',
    title: 'AWS DevOps Engineering Services | SiliconMotives',
    description: 'AWS-focused deployment and infrastructure engineering for application teams: release pipelines, environment configuration and operational handover.',
    headline: 'AWS DevOps. From code to deployment.',
    intro: 'Connect your application release process with the AWS environment it runs in. We help plan deployment steps, environment configuration and the operational checks your team needs around a release.',
    audience: 'For businesses and agencies launching an AWS-backed application or improving an existing AWS delivery workflow.',
    scope: [
      ['AWS deployment planning', 'Review application dependencies, environment boundaries and the deployment path before implementation.'],
      ['CI/CD implementation', 'Define build and release stages, configuration handling, approvals and rollback steps for the project.'],
      ['Release handover', 'Document deployment responsibilities, access and operational checks so the process can be maintained.'],
    ],
    deliverables: ['AWS deployment plan', 'Agreed pipeline and release configuration', 'Release checklist and handover notes'],
    projects: ['woobe'],
    evidenceNote: 'Woobe documents AWS as its cloud infrastructure. The commerce overview provides context for the application and its checkout requirements.',
    faqs: [
      ['How is this different from DevOps consulting?', 'This service focuses on implementing delivery workflows for AWS workloads. DevOps consulting begins with a broader review of the team’s release and operating process.'],
      ['Can you work within an agency’s AWS account?', 'Account ownership, least-privilege access, change approval and handover are agreed before work begins. We can work within the agency or client’s account under those arrangements.'],
      ['Is production support included?', 'Support is scoped explicitly. We agree support hours, escalation routes and responsibilities; this page does not promise round-the-clock incident response.'],
    ],
  },
  {
    slug: 'devops-consulting', name: 'DevOps consulting',
    title: 'DevOps Consulting Services | SiliconMotives',
    description: 'Practical DevOps consulting for release workflows, CI/CD, environment consistency and operational ownership. Start with a scoped engineering review.',
    headline: 'DevOps consulting for repeatable delivery.',
    intro: 'When releases depend on manual steps or knowledge held by one person, start by understanding the workflow. We review how code moves into an environment and turn the findings into an actionable delivery plan.',
    audience: 'For startup teams and agencies dealing with manual releases, unclear operational ownership or inconsistent environments.',
    scope: [
      ['Delivery review', 'Trace the path from code change to deployment, including approvals, configuration and recovery.'],
      ['Prioritized improvements', 'Separate immediate release risks from longer-term automation and architecture work.'],
      ['Implementation support', 'Agree a follow-on milestone for pipelines, documentation or operating practices that your team can maintain.'],
    ],
    deliverables: ['Current workflow and responsibility map', 'Prioritized findings with proposed next steps', 'A scoped implementation and handover plan'],
    projects: ['woobe'],
    evidenceNote: 'Woobe provides context for an application running on AWS. A scoped delivery review can connect those application needs with a release and operating plan.',
    faqs: [
      ['What is the starting engagement?', 'A bounded review of one application or release workflow. We agree access, review questions and deliverables before the review starts.'],
      ['Does consulting include implementation?', 'The review produces findings and a plan. Implementation can be agreed as a separate milestone or included explicitly in the initial scope.'],
      ['Can you support our existing engineers?', 'Yes. We can work directly with your engineers, document decisions and review the handover together. Communication cadence and ongoing support are agreed per engagement.'],
    ],
  },
];

export const servicePath = (slug: string) => `/services/${slug}`;
export const getEngineeringService = (slug: string) => engineeringServices.find(service => service.slug === slug);
