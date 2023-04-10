import svgGo from 'assets/icons/go.svg?raw';
  import svgJavascript from 'assets/icons/javascript.svg?raw';
  import svgTypescript from 'assets/icons/typescript.svg?raw';
  import svgHtml5 from 'assets/icons/html5.svg?raw';
  import svgCss3 from 'assets/icons/css3.svg?raw';
  import svgPython from 'assets/icons/python.svg?raw';
  import svgCplusplus from 'assets/icons/cplusplus.svg?raw';
  import svgPhp from 'assets/icons/php.svg?raw';
  import svgRust from 'assets/icons/rust.svg?raw';
  import svgKotlin from 'assets/icons/kotlin.svg?raw';
  import svgSwift from 'assets/icons/swift.svg?raw';
  import svgDart from 'assets/icons/dart.svg?raw';
  import svgRuby from 'assets/icons/ruby.svg?raw';
  import svgAssembly from 'assets/icons/assemblyscript.svg?raw';
  import svgAmazonaws from 'assets/icons/amazonaws.svg?raw';
  import svgAstro from 'assets/icons/astro.svg?raw';
  import svgBun from 'assets/icons/bun.svg?raw';
  import svgContentful from 'assets/icons/contentful.svg?raw';
  import svgDeno from 'assets/icons/deno.svg?raw';
  import svgFlutter from 'assets/icons/flutter.svg?raw';
  import svgMongodb from 'assets/icons/mongodb.svg?raw';
  import svgMysql from 'assets/icons/mysql.svg?raw';
  import svgNodedotjs from 'assets/icons/nodedotjs.svg?raw';
  import svgPostgresql from 'assets/icons/postgresql.svg?raw';
  import svgReact from 'assets/icons/react.svg?raw';
  import svgReactrouter from 'assets/icons/reactrouter.svg?raw';
  import svgRedux from 'assets/icons/redux.svg?raw';
  import svgRemix from 'assets/icons/remix.svg?raw';
  import svgSolid from 'assets/icons/solid.svg?raw';
  import svgStoryblok from 'assets/icons/storyblok.svg?raw';
  import svgStorybook from 'assets/icons/storybook.svg?raw';
  import svgStrapi from 'assets/icons/strapi.svg?raw';
  import svgStripe from 'assets/icons/stripe.svg?raw';
  import svgTailwindcss from 'assets/icons/tailwindcss.svg?raw';
  import svgVuedotjs from 'assets/icons/vuedotjs.svg?raw';
  import svgFigma from 'assets/icons/figma.svg?raw';
  import svgGoogletagmanager from 'assets/icons/googletagmanager.svg?raw';
  import svgGoogleAnalytics from 'assets/icons/googleanalytics.svg?raw';
  import svgJiraSoftware from 'assets/icons/jirasoftware.svg?raw';

export type TLanguage = typeof LANGUAGES[number]

export const LANGUAGES = [
  {
    id: 'javascript',
    name: 'javascript',
    file: svgJavascript,
    label: 'Javascript',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'html5',
    name: 'html5',
    file: svgHtml5,
    label: 'HTML5',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'css3',
    name: 'css3',
    file: svgCss3,
    label: 'CSS3',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'sql',
    name: 'sql',
    label: 'SQL',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'python',
    name: 'python',
    file: svgPython,
    label: 'Python',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'typescript',
    name: 'typescript',
    file: svgTypescript,
    label: 'Typescript',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'java',
    name: 'java',
    label: 'Java',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'c#',
    name: 'c#',
    label: 'C#',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'c++',
    name: 'c++',
    file: svgCplusplus,
    label: 'C++',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'php',
    name: 'php',
    file: svgPhp,
    label: 'PHP',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'c',
    name: 'c',
    label: 'C',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'go',
    name: 'go',
    file: svgGo,
    label: 'Go',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'rust',
    name: 'rust',
    file: svgRust,
    label: 'Rust',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'kotlin',
    name: 'kotlin',
    file: svgKotlin,
    label: 'Kotlin',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'dart',
    name: 'dart',
    file: svgDart,
    label: 'Dart',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'ruby',
    name: 'ruby', 
    file: svgRuby,
    label: 'Ruby',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'assembly',
    name: 'assembly',
    file: svgAssembly,
    label: 'Assembly',
    category: 'language',
    subcategory: 'language',
  },
  {
    id: 'swift',
    name: 'swift',
    file: svgSwift,
    label: 'Swift',
    category: 'language',
    subcategory: 'language',
  },
] as const;

export enum TechCategory {
  CloudService = 'Cloud Computing Service',
  Framwork = 'Framework',
  JSRuntime = 'JavaScript Runtime',
  CMS = 'Content Management',
  SDK = 'Software Development Kit (SDK)',
  Database = 'Database',
  Library = 'Library',
  Utilities = 'Utilities',
  Payment = 'Payment',
  DevOps = 'Development Operations',
  BusinessTools = 'Business Tools',
}

export type TTechnology = typeof TECHNOLOGIES[number];

export const TECHNOLOGIES = [
  {
    id: 'aws',
    name: 'aws',
    file: svgAmazonaws,
    label: 'AWS',
    catgegory: 'technology',
    subcategory: TechCategory.CloudService,
    language: ['python', 'javascript', 'typescript', 'go', 'java'],
    popularity: 7222,
  },
  {
    id: 'astro',
    name: 'astro',
    file: svgAstro,
    label: 'Astro',
    catgegory: 'technology',
    subcategory: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 23217,
  },
  {
    id: 'bun',
    name: 'bun',
    file: svgBun,
    label: 'Bun',
    catgegory: 'technology',
    subcategory: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 36572,
  },
  {
    id: 'contentful',
    name: 'contentful',
    file: svgContentful,
    label: 'Contentful',
    catgegory: 'technology',
    subcategory: TechCategory.CMS,
    language: ['javascript', 'typescript', 'php', 'go', 'java'], // @todo add more
    popularity: 973,
  },
  {
    id: 'deno',
    name: 'deno',
    file: svgDeno,
    label: 'Deno',
    catgegory: 'technology',
    subcategory: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 86752,
  },
  {
    id: 'flutter',
    name: 'flutter',
    file: svgFlutter,
    label: 'Flutter',
    catgegory: 'technology',
    subcategory: TechCategory.SDK,
    language: ['dart'],
    popularity: 147191,
  },
  {
    id: 'mongodb',
    name: 'mongodb',
    file: svgMongodb,
    label: 'MongoDB',
    catgegory: 'technology',
    subcategory: TechCategory.Database,
    language: ['javascript', 'typescript'],
    popularity: 22912,
  },
  {
    id: 'mysql',
    name: 'mysql',
    file: svgMysql,
    label: 'MySQL',
    catgegory: 'technology',
    subcategory: TechCategory.Database,
    language: ['sql'],
    popularity: 17562,
  },
  {
    id: 'nodejs',
    name: 'nodejs',
    file: svgNodedotjs,
    label: 'Node.js',
    catgegory: 'technology',
    subcategory: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 91980,
  },
  {
    id: 'postgresql',
    name: 'postgresql',
    file: svgPostgresql,
    label: 'PostgreSQL',
    catgegory: 'technology',
    subcategory: TechCategory.Database,
    language: ['sql'],
    popularity: 11436,
  },
  {
    id: 'react',
    name: 'react',
    file: svgReact,
    label: 'React',
    catgegory: 'technology',
    subcategory: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 198820,
  },
  {
    id: 'reactrouter',
    name: 'reactrouter',
    file: svgReactrouter,
    label: 'React Router',
    catgegory: 'technology',
    subcategory: TechCategory.Library,
    language: ['javascript', 'typescript', 'react-native'],
    popularity: 48978,
  },
  {
    id: 'redux',
    name: 'redux',
    file: svgRedux,
    label: 'Redux',
    catgegory: 'technology',
    subcategory: TechCategory.Library,
    language: ['javascript', 'typescript'],
    popularity: 58965,
  },
  {
    id: 'remix',
    name: 'remix',
    file: svgRemix,
    label: 'Remix',
    catgegory: 'technology',
    subcategory: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 21102,
  },
  {
    id: 'solid',
    name: 'solid',
    file: svgSolid,
    label: 'Solid',
    catgegory: 'technology',
    subcategory: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 23965,
  },
  {
    id: 'storyblok',
    name: 'storyblok',
    file: svgStoryblok,
    label: 'Storyblok',
    catgegory: 'technology',
    subcategory: TechCategory.CMS,
    language: ['javascript', 'typescript'],
    popularity: 296,
  },
  {
    id: 'storybook',
    name: 'storybook',
    file: svgStorybook,
    label: 'Storybook',
    catgegory: 'technology',
    subcategory: TechCategory.Library,
    language: ['javascript', 'typescript'],
    popularity: 75418,
  },
  {
    id: 'strapi',
    name: 'strapi',
    file: svgStrapi,
    label: 'Strapi',
    catgegory: 'technology',
    subcategory: TechCategory.CMS,
    language: ['javascript', 'typescript'],
    popularity: 50437,
  },
  {
    id: 'stripe',
    name: 'stripe',
    file: svgStripe,
    label: 'Stripe',
    catgegory: 'technology',
    subcategory: TechCategory.Payment,
    language: ['javascript', 'typescript'],
    popularity: 3172,
  },
  {
    id: 'tailwindcss',
    name: 'tailwindcss',
    file: svgTailwindcss,
    label: 'tailwindcss',
    catgegory: 'technology',
    subcategory: TechCategory.Utilities,
    language: ['HTML5'],
    popularity: 62949,
  },
  {
    id: 'vue',
    name: 'vue',
    file: svgVuedotjs,
    label: 'Vue',
    catgegory: 'technology',
    subcategory: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 201135,
  },
] as const;

export type TTool = typeof TOOLS[number];

export enum ToolCategory {
  Tracking = 'Tracking',
  Design = 'Design',
  TMS = 'Tag Management System',
  ProjectManagement = 'Project Management',
}

export const TOOLS = [
  {
    id: 'figma',
    name: 'figma',
    file: svgFigma,
    label: 'Figma',
    category: 'tool',
    subcategory: ToolCategory.Design,
  },
  {
    id: 'googleanalytics',
    name: 'googleanalytics',
    file: svgGoogleAnalytics,
    label: 'Google Analytics',
    category: 'tool',
    subcategory: ToolCategory.Tracking,
  },
  {
    id: 'googletagmanager',
    name: 'googletagmanager',
    file: svgGoogletagmanager,
    label: 'Google Tag Manager',
    category: 'tool',
    subcategory: ToolCategory.Tracking,
  },
  {
    id: 'jirasoftware',
    name: 'jirasoftware',
    file: svgJiraSoftware,
    label: 'Jira',
    category: 'tool',
    subcategory: ToolCategory.ProjectManagement,
  },
] as const;

export type TSkill = TLanguage | TTechnology | TTool;

export const ALL_SKILLS = [
  ...LANGUAGES,
  ...TECHNOLOGIES,
  ...TOOLS
];

export const ALL_SKILLS_MAP = ALL_SKILLS.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {}) as TSkill[];

export const SKILL_NAME = new Map([
  ['language', 'Languages'],
  ['technology', 'Technologies'],
  ['tool', 'Tools'],
]);
