import { IPagination } from "~/types"

export enum MENTOR_DISCIPLINES {
  COMPUTER_SCIENCE = "Computer Science",
  ENGINEERING = "Engineering",
  BUSINESS_ADMINISTRATION = "Business Administration",
  MEDICINE = "Medicine",
  LAW = "Law",
  DESIGN = "Design",
  PSYCHOLOGY = "Psychology",
  BIOLOGY = "Biology",
  ECONOMICS = "Economics",
  SOCIOLOGY = "Sociology",
}

export enum MENTOR_SKILLS {
  HTML = "HTML",
  CSS = "CSS",
  JAVASCRIPT = "JavaScript",
  TYPESCRIPT = "TypeScript",
  REACT = "React",
  VUE_JS = "Vue.js",
  ANGULAR = "Angular",
  NODE_JS = "Node.js",
  EXPRESS_JS = "Express.js",
  PYTHON = "Python",
  DJANGO = "Django",
  FLASK = "Flask",
  RUBY = "Ruby",
  RUBY_ON_RAILS = "Ruby on Rails",
  JAVA = "Java",
  SPRING = "Spring",
  PHP = "PHP",
  LARAVEL = "Laravel",
  C_SHARP = "C#",
  ASP_NET = "ASP.NET",
  SWIFT = "Swift",
  KOTLIN = "Kotlin",
  FLUTTER = "Flutter",
  REACT_NATIVE = "React Native",
  SQL = "SQL",
  NO_SQL = "NoSQL",
  GIT = "Git",
  DOCKER = "Docker",
  KUBERNETES = "Kubernetes",
  CI_CD = "CI/CD",
  MACHINE_LEARNING = "Machine Learning",
  DATA_ANALYSIS = "Data Analysis",
  UI_UX_DESIGN = "UI/UX Design",
  ADOBE_PHOTOSHOP = "Adobe Photoshop",
  SKETCH = "Sketch",
  FIGMA = "Figma",
  IN_VISION = "InVision",
  PROTOTYPING = "Prototyping",
  CYBERSECURITY = "Cybersecurity",
}

export enum MENTOR_TOOLS {
  REACT = "React",
  VUE_JS = "Vue.js",
  ANGULAR = "Angular",
  HTML = "HTML",
  CSS = "CSS",
  JAVASCRIPT = "JavaScript",
  NODE_JS = "Node.js",
  DJANGO = "Django",
  FLASK = "Flask",
  RUBY_ON_RAILS = "Ruby on Rails",
  SPRING = "Spring",
  EXPRESS_JS = "Express.js",
  MEAN_STACK = "MEAN Stack",
  MERN_STACK = "MERN Stack",
  LAMP_STACK = "LAMP Stack",
  GRAPHQL = "GraphQL",
  FIREBASE = "Firebase",
  FIGMA = "Figma",
  SKETCH = "Sketch",
  ADOBE_XD = "Adobe XD",
  IN_VISION = "InVision",
  AXURE_RP = "Axure RP",
  ADOBE_PHOTOSHOP = "Adobe Photoshop",
  ADOBE_ILLUSTRATOR = "Adobe Illustrator",
  COREL_DRAW = "CorelDRAW",
  AFFINITY_DESIGNER = "Affinity Designer",
  INKSCAPE = "Inkscape",
  DOCKER = "Docker",
  KUBERNETES = "Kubernetes",
  JENKINS = "Jenkins",
  ANSIBLE = "Ansible",
  TERRAFORM = "Terraform",
  REACT_NATIVE = "React Native",
  FLUTTER = "Flutter",
  SWIFT = "Swift",
  KOTLIN = "Kotlin",
  XAMARIN = "Xamarin",
}
export interface IMentor {
  userName: string
  email: string
  password: string
  gender: string
  country: string
  title: string
  company: string
  phoneNumber: string
  emailOtp?: boolean
  introduction: string
  level: number
  linkedInURL: string
  primaryExpertise: string
  secondaryExpertise?: string
  tertiaryExpertise?: string
  disciplines: MENTOR_DISCIPLINES[]
  skills: MENTOR_SKILLS[]
  tools: MENTOR_TOOLS[]
  quickReply: boolean
  education: string
}

export interface IMentorRequestBody extends IMentor {
  avatar: Express.Multer.File[]
}

export interface IMentorModel extends IMentor {
  avatar: string
}

export interface IKeywordPagination extends IPagination {
  keyword?: string
}

export type IAvailableTime = {
  day: DAY_TYPE
  timeCode: number[] | string
}
export interface IUpdateAvailableTime extends IAvailableTime {
  mentorId: string
}

export interface IUpdateAvailableTimeResult {
  id: string
  user_name: string
  available_time_list: IAvailableTime[]
}

export enum DAY {
  "SUN" = 0,
  "MON" = 1,
  "TUE" = 2,
  "WED" = 3,
  "THU" = 4,
  "FRI" = 5,
  "SAT" = 6,
}

export type DAY_TYPE = keyof typeof DAY
export interface IMentorDisciplines {
  mentorId: string
  discipline: MENTOR_DISCIPLINES
}
export interface IMentorSkills {
  mentorId: string
  skill: MENTOR_SKILLS
}
export interface IMentorTools {
  mentorId: string
  tool: MENTOR_TOOLS
}
