import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Cloud Native Denmark`,
    description:
      "Cloud Native Denmark shares knowledge about Cloud Native Techonologies and creates community networks in Denmark within this area.",
    siteUrl: `https://cloudnativedenmark.dk`,
    menuLinks: [
      {
        name: "Schedule",
        link: "/schedule",
      },
      {
        name: "Convince Your Boss",
        link: "/convince-your-boss",
      },
      {
        name: "Team",
        link: "/team",
      },
    ],
    team: [
      {
        name: "Camilla Larsen",
        position: "",
        image: "team/organizer-camilla-larsen.jpg",
        linkedin: "camilla-larsen-tux",
      },
      {
        name: "Jinhong Brejnholt",
        position:
          "Chief Cloud Architect & Global Head of Cloud and Container Platform Engineering @ Saxo Bank A/S",
        image: "team/organizer-jinhong-brejnholt.jpg",
        linkedin: "jbrejnholt",
      },
      {
        name: "Kasper Borg Nissen",
        position: "Developer Relations @ Dash0",
        image: "team/organizer-kasper-nissen.jpg",
        linkedin: "kaspernissen",
      },
      {
        name: "Per Hedegaard Christiansen",
        position: "Chief Container Platform Engineer @ Saxo Bank A/S",
        image: "team/organizer-per-christiansen.jpg",
        linkedin: "perhchristiansen",
      },
      {
        name: "Ryan Gough",
        position: "Technical Product Owner @ JYSK",
        image: "team/organizer-ryan-gough.jpg",
        linkedin: "ryanjgough",
      },
      {
        name: "Thor Anker Kvisgård Lange",
        position: "Team Lead Platform Development @ Netic",
        image: "team/organizer-thor-lange.jpg",
        linkedin: "thor-lange-26b388",
      },
      {
        name: "Nikita Hald Sørensen",
        position:
          "Communication and event coordinator @ Coding Pirates & Innovation Lab",
        image: "team/organizer-nikita-hald.jpg",
        linkedin: "nikitahald",
      },
      {
        name: "Allan Højgaard Jensen",
        position: "Platform Development Specialist @ Netic",
        image: "team/organizer-allan.jpg",
        linkedin: "allanhoejgaardjensen/",
      },
      {
        name: "Søren Boss Jacobsen",
        position: "Regional Sales Manager @ EDB",
        image: "team/organizer-soren.jpg",
        linkedin: "sorenbossjacobsen",
      },
      {
        name: "Mads Høgstedt Danquah",
        position: "Lead Engineer @ the LEGO Group",
        image: "team/organizer-mads.jpg",
        linkedin: "danquah",
      },
      {
        name: "Aditya Sundaramurthy",
        position: "Platform Engineer @ Novo Nordisk",
        image: "team/organizer-aditya.jpg",
        linkedin: "aditya-sundaramurthy",
      },
      {
        name: "Aleksander Nowak",
        position: "Senior Platform Engineer @ ZeroNorth",
        image: "team/organizer-alek.jpg",
        linkedin: "aleknowak",
      },
    ],
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-svgr-svgo",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-transformer-yaml",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`,
      },
      __key: "data",
    },
  ],
};

export default config;
