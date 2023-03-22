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

export type Language = {
  id: string;
  name: string;
  file?: string;
  label: string;
}

export const LANGUAGES: Language[] = [
  {
    id: 'javascript',
    name: 'javascript',
    file: svgJavascript,
    label: 'Javascript',
  },
  {
    id: 'html5',
    name: 'html5',
    file: svgHtml5,
    label: 'HTML5',
  },
  {
    id: 'css3',
    name: 'css3',
    file: svgCss3,
    label: 'CSS3',
  },
  {
    id: 'sql',
    name: 'sql',
    label: 'SQL',
  },
  {
    id: 'python',
    name: 'python',
    file: svgPython,
    label: 'Python',
  },
  {
    id: 'typescript',
    name: 'typescript',
    file: svgTypescript,
    label: 'Typescript',
  },
  {
    id: 'java',
    name: 'java',
    label: 'Java',
  },
  {
    id: 'c#',
    name: 'c#',
    label: 'C#',
  },
  {
    id: 'c++',
    name: 'c++',
    file: svgCplusplus,
    label: 'C++',
  },
  {
    id: 'php',
    name: 'php',
    file: svgPhp,
    label: 'PHP',
  },
  {
    id: 'c',
    name: 'c',
    label: 'C',
  },
  {
    id: 'go',
    name: 'go',
    file: svgGo,
    label: 'Go',
  },
  {
    id: 'rust',
    name: 'rust',
    file: svgRust,
    label: 'Rust',
  },
  {
    id: 'kotlin',
    name: 'kotlin',
    file: svgKotlin,
    label: 'Kotlin',
  },
  {
    id: 'dart',
    name: 'dart',
    file: svgDart,
    label: 'Dart',
  },
  {
    id: 'ruby',
    name: 'ruby', 
    file: svgRuby,
    label: 'Ruby',
  },
  {
    id: 'assembly',
    name: 'assembly',
    file: svgAssembly,
    label: 'Assembly',
  },
  {
    id: 'swift',
    name: 'swift',
    file: svgSwift,
    label: 'Swift',
  },
];

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

export type Technology = {
  id: string;
  name: string;
  file: string;
  label: string;
  category: TechCategory;
  language: string[];
  popularity: number;
}

export const TECHNOLOGIES: Technology[] = [
  {
    id: 'aws',
    name: 'aws',
    file: svgAmazonaws,
    label: 'AWS',
    category: TechCategory.CloudService,
    language: ['python', 'javascript', 'typescript', 'go', 'java'],
    popularity: 7222,
  },
  {
    id: 'astro',
    name: 'astro',
    file: svgAstro,
    label: 'Astro',
    category: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 23217,
  },
  {
    id: 'bun',
    name: 'bun',
    file: svgBun,
    label: 'Bun',
    category: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 36572,
  },
  {
    id: 'contentful',
    name: 'contentful',
    file: svgContentful,
    label: 'Contentful',
    category: TechCategory.CMS,
    language: ['javascript', 'typescript', 'php', 'go', 'java'], // @todo add more
    popularity: 973,
  },
  {
    id: 'deno',
    name: 'deno',
    file: svgDeno,
    label: 'Deno',
    category: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 86752,
  },
  {
    id: 'flutter',
    name: 'flutter',
    file: svgFlutter,
    label: 'Flutter',
    category: TechCategory.SDK,
    language: ['dart'],
    popularity: 147191,
  },
  {
    id: 'mongodb',
    name: 'mongodb',
    file: svgMongodb,
    label: 'MongoDB',
    category: TechCategory.Database,
    language: ['javascript', 'typescript'],
    popularity: 22912,
  },
  {
    id: 'mysql',
    name: 'mysql',
    file: svgMysql,
    label: 'MySQL',
    category: TechCategory.Database,
    language: ['sql'],
    popularity: 17562,
  },
  {
    id: 'nodejs',
    name: 'nodejs',
    file: svgNodedotjs,
    label: 'Node.js',
    category: TechCategory.JSRuntime,
    language: ['javascript', 'typescript'],
    popularity: 91980,
  },
  {
    id: 'postgresql',
    name: 'postgresql',
    file: svgPostgresql,
    label: 'PostgreSQL',
    category: TechCategory.Database,
    language: ['sql'],
    popularity: 11436,
  },
  {
    id: 'react',
    name: 'react',
    file: svgReact,
    label: 'React',
    category: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 198820,
  },
  {
    id: 'reactrouter',
    name: 'reactrouter',
    file: svgReactrouter,
    label: 'React Router',
    category: TechCategory.Library,
    language: ['javascript', 'typescript', 'react-native'],
    popularity: 48978,
  },
  {
    id: 'redux',
    name: 'redux',
    file: svgRedux,
    label: 'Redux',
    category: TechCategory.Library,
    language: ['javascript', 'typescript'],
    popularity: 58965,
  },
  {
    id: 'remix',
    name: 'remix',
    file: svgRemix,
    label: 'Remix',
    category: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 21102,
  },
  {
    id: 'solid',
    name: 'solid',
    file: svgSolid,
    label: 'Solid',
    category: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 23965,
  },
  {
    id: 'storyblok',
    name: 'storyblok',
    file: svgStoryblok,
    label: 'Storyblok',
    category: TechCategory.CMS,
    language: ['javascript', 'typescript'],
    popularity: 296,
  },
  {
    id: 'storybook',
    name: 'storybook',
    file: svgStorybook,
    label: 'Storybook',
    category: TechCategory.Library,
    language: ['javascript', 'typescript'],
    popularity: 75418,
  },
  {
    id: 'strapi',
    name: 'strapi',
    file: svgStrapi,
    label: 'Strapi',
    category: TechCategory.CMS,
    language: ['javascript', 'typescript'],
    popularity: 50437,
  },
  {
    id: 'stripe',
    name: 'stripe',
    file: svgStripe,
    label: 'Stripe',
    category: TechCategory.Payment,
    language: ['javascript', 'typescript'],
    popularity: 3172,
  },
  {
    id: 'tailwindcss',
    name: 'tailwindcss',
    file: svgTailwindcss,
    label: 'tailwindcss',
    category: TechCategory.Utilities,
    language: ['HTML5'],
    popularity: 62949,
  },
  {
    id: 'vue',
    name: 'vue',
    file: svgVuedotjs,
    label: 'Vue',
    category: TechCategory.Framwork,
    language: ['javascript', 'typescript'],
    popularity: 201135,
  },
];

export type Tool = {
  id: string;
  name: string;
  file?: string;
  label: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'figma',
    name: 'figma',
    file: svgFigma,
    label: 'Figma',
  },
  {
    id: 'googleanalytics',
    name: 'googleanalytics',
    file: svgGoogleAnalytics,
    label: 'Google Analytics',
  },
  {
    id: 'googletagmanager',
    name: 'googletagmanager',
    file: svgGoogletagmanager,
    label: 'Google Tag Manager',
  },
  {
    id: 'jirasoftware',
    name: 'jirasoftware',
    file: svgJiraSoftware,
    label: 'Jira',
  },
];

export const ALL_SKILLS = [
  ...LANGUAGES,
  ...TECHNOLOGIES,
  ...TOOLS
].reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});