# Cloud Native Denmark Website

Official website for Cloud Native Denmark (CND), a vibrant community for cloud-native technology enthusiasts in Denmark. This site showcases our conferences, events, speakers, and sponsors.

![Cloud Native Denmark](https://via.placeholder.com/1200x400/1a365d/ffffff?text=Cloud+Native+Denmark)

## 🌟 About

Cloud Native Denmark is the premier community for cloud-native technologies in Denmark. We organize conferences, meetups, and events to bring together developers, DevOps engineers, and technology leaders to share knowledge and advance cloud-native adoption.

## 🚀 Quick Start

### Prerequisites

Choose one of the following development environments:

**Option 1: Nix (Recommended)**

- [Nix](https://nixos.org/download.html) - Package manager with declarative environments
- Run `nix develop` to enter the development shell with all dependencies

**Option 2: Manual Setup**

- Node.js v24+
- Yarn v4+ ([berry](https://github.com/yarnpkg/berry))

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/vyrwu/cloudnativedenmark.dk.git
   cd cloudnativedenmark.dk
   ```

2. **(Optional) Start Development Shell**

   ```bash
   nix develop
   ```

3. **Install dependencies**

   ```bash
   yarn install
   ```

4. **Start development server**

   ```bash
   yarn develop
   ```

   Your site will be running at `http://localhost:8000`

5. **View GraphQL explorer**

   Open `http://localhost:8000/___graphql` to explore the site's data layer

## 📋 Available Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `yarn develop`       | Start development server            |
| `yarn build`         | Build for production                |
| `yarn serve`         | Serve production build locally      |
| `yarn clean`         | Clean Gatsby cache                  |
| `yarn typecheck`     | Run TypeScript type checking        |
| `yarn format`        | Check code formatting with Prettier |
| `yarn format:fix`    | Fix code formatting with Prettier   |
| `yarn lint`          | Check code quality with ESLint      |
| `yarn lint:fix`      | Fix auto-fixable ESLint issues      |
| `yarn test`          | Run unit tests                      |
| `yarn test:watch`    | Run tests in watch mode             |
| `yarn test:coverage` | Run tests with coverage report      |

## 🏗️ Tech Stack

- **Framework**: [Gatsby v5](https://www.gatsbyjs.com/) - Static site generator
- **Runtime**: [Node.js 24](https://nodejs.org/) - JavaScript runtime
- **Package Manager**: [Yarn v4 (Berry)](https://yarnpkg.com/) - Fast, reliable package manager
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [React 18](https://reactjs.org/) - Component-based UI
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- **Data**: [GraphQL](https://graphql.org/) + [Sessionize API](https://sessionize.com/)
- **Images**: [Gatsby Image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) - Optimized images
- **Development Environment**: [Nix](https://nixos.org/) - Reproducible development environments
- **Deployment**: [GitHub Pages](https://pages.github.com/) - Continuous deployment

## 🏛️ Architecture

### Component Structure

```
src/components/
├── ui/           # Basic UI components (Button, Section, Container)
├── content/      # Content-specific components (SponsorGrid, TeamGrid)
├── layout/       # Layout components (Header, Footer, HeroSection)
└── features/     # Feature components (SessionCard, SpeakerModal)
```

### Data Sources

- **Static Content**: YAML files in `src/data/` (sponsors, team, hotels)
- **Conference Data**: Sessionize API integration for speakers and schedule
- **Site Metadata**: Configured in `gatsby-config.ts`

### Key Features

- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ⚡ **Performance**: Optimized images, code splitting, and static generation
- 🎯 **SEO**: Meta tags, structured data, and sitemap generation
- 🔍 **Search**: Fuzzy search for sessions and speakers using Fuse.js
- 📅 **Event Management**: Dynamic conference schedule and speaker profiles
- 💼 **Sponsor Management**: Tiered sponsor system with dynamic logos

## 📊 Data Management

### Sessionize Integration

The site integrates with Sessionize API to fetch:

- Speaker profiles and information
- Conference sessions and schedule
- Event grid and room assignments

Configuration is managed in `src/hooks/use-sessionize.tsx`.

### Content Management

- **Team Data**: Embedded in `gatsby-config.ts` site metadata
- **Sponsors**: YAML files in `src/data/sponsors/`
- **Hotels**: YAML files in `src/data/hotels/`
- **Images**: Organized by category in `src/images/`

## 🔧 Development Guidelines

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive type safety
- **React**: Functional components with hooks, no class components
- **Components**: Modular, composition-based design with clear prop interfaces
- **Styling**: Tailwind CSS v4 utility classes with variant-based component design
- **Testing**: Unit tests for components and hooks using Jest and React Testing Library

### Component Architecture

- **Modular Design**: Components organized by purpose (ui/, content/, layout/, features/)
- **Variant System**: Components adapt via props (Button variants, Section variants)
- **Barrel Exports**: Clean imports via index.ts files
- **TypeScript Interfaces**: All props and data structures are fully typed
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

### Performance & Best Practices

- **Image Optimization**: Use `gatsby-plugin-image` for all images
- **Code Splitting**: Automatic with Gatsby's build process
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimization**: Meta tags, structured data, sitemap generation

For complete development guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 🌍 Deployment

### Production Build

```bash
yarn build
yarn serve  # Test production build locally
```

### GitHub Pages Deployment

The site is automatically deployed to GitHub Pages on every push to the main branch:

- **Production**: `https://cloudnativedenmark.dk`
- **GitHub Pages**: `https://cloudnativedenmark.github.io/cloudnativedenmark.dk`

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.

## 👥 Community

- **Website**: [cloudnativedenmark.dk](https://cloudnativedenmark.dk)
- **LinkedIn**: [Cloud Native Denmark](https://www.linkedin.com/company/cloud-native-denmark/)
- **YouTube**: [CND Channel](https://www.youtube.com/channel/UCyTCrxgT_gGbnqGWvEa9AWg)
- **Email**: [info@cloudnativedenmark.dk](mailto:info@cloudnativedenmark.dk)

## 🙋 Support

If you have questions about the website or need technical support:

1. Check existing [GitHub Issues](https://github.com/vyrwu/cloudnativedenmark.dk/issues)
2. Create a new issue with detailed information
3. Contact the maintainers via email

---

Built with ❤️ by the Cloud Native Denmark community
