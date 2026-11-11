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

5. **Open your browser**

   Your site will be running at `http://localhost:8000` with hot module replacement

## 📋 Available Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `yarn develop`       | Start development server            |
| `yarn build`         | Build for production                |
| `yarn serve`         | Serve production build locally      |
| `yarn clean`         | Clean Vite cache and dist directory |
| `yarn typecheck`     | Run TypeScript type checking        |
| `yarn format`        | Check code formatting with Prettier |
| `yarn format:fix`    | Fix code formatting with Prettier   |
| `yarn lint`          | Check code quality with ESLint      |
| `yarn lint:fix`      | Fix auto-fixable ESLint issues      |
| `yarn test`          | Run unit tests                      |
| `yarn test:watch`    | Run tests in watch mode             |
| `yarn test:coverage` | Run tests with coverage report      |

## 🏗️ Tech Stack

- **Build Tool**: [Vite v5](https://vitejs.dev/) - Next generation frontend tooling
- **Framework**: [React 18](https://reactjs.org/) - Component-based UI library
- **Routing**: [React Router v6](https://reactrouter.com/) - Client-side routing
- **Runtime**: [Node.js 24](https://nodejs.org/) - JavaScript runtime
- **Package Manager**: [Yarn v4 (Berry)](https://yarnpkg.com/) - Fast, reliable package manager
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- **Data**: [Sessionize API](https://sessionize.com/) + YAML files for static content
- **SEO**: [React Helmet Async](https://github.com/staylor/react-helmet-async) - Document head management
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

- **Static Content**: YAML files in `public/data/` (sponsors, hotels) and embedded data (team)
- **Conference Data**: Sessionize API integration for speakers and schedule
- **Data Loading**: Custom utilities in `src/utils/data-loader.ts` for YAML parsing

### Key Features

- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ⚡ **Performance**: Vite's fast HMR, code splitting, and optimized bundling
- 🎯 **SEO**: Meta tags, structured data, and sitemap generation
- 🔍 **Search**: Fuzzy search for sessions and speakers using Fuse.js
- 📅 **Event Management**: Dynamic conference schedule and speaker profiles
- 💼 **Sponsor Management**: Tiered sponsor system with dynamic logos

### Schedule PDF

Use **Download schedule (PDF)** on `/schedule` to save the full attendee
schedule. The PDF keeps the existing A4 portrait print layout, with parallel
talks side by side, full titles and speaker names, and workshops in a
separate panel. Times use Copenhagen time.

Before the first local build, install the PDF renderer:

```bash
yarn playwright install --only-shell chromium
```

`yarn build` generates `dist/schedule.pdf` from `AttendeeScheduleDocument`
using Chromium. It uses the same Sessionize snapshot as the share pages,
and the existing scheduled Sessionize check rebuilds it when schedule data
changes. A failed PDF render fails the build instead of publishing a broken
download. Use `yarn serve` after building to try the download locally.

The renderer runs only during the build and is not published as a page.
`/schedule/print` redirects directly to `/schedule.pdf` through the
Cloudflare Pages rules in `public/_redirects`.

### Track overviews

Open `/schedule/track-overview` directly; it is not linked from site navigation.
Select days and tracks, then use **Copy link** to share the selection.
Each day has one combined overview, followed by talk sheets grouped by track.
The sheets include full abstracts and speaker photos.

Print formats:

- `format=spacious`: one session per sheet, with space for notes.
- `format=paired`: up to two sessions per sheet.
- `format=compact`: fit sessions to each sheet.
- `overview=0`: omit day overviews. **Print overview only** still prints them.

Repeat `date` and `room` parameters to select multiple days and tracks:
`/schedule/track-overview?date=2026-11-19&date=2026-11-20&room=75248&room=75249&format=compact`.

Print on A4 portrait at 100% scale, with browser headers and footers off.
Times use Copenhagen time. The page is public with `noindex` metadata,
not access control. Do not add private speaker data.

## 📊 Data Management

### Sessionize Integration

The site integrates with Sessionize API to fetch:

- Speaker profiles and information
- Conference sessions and schedule
- Event grid and room assignments

Configuration is managed in `src/hooks/use-sessionize.tsx`.

Lightning talk labels use a yellow background with dark text for contrast.
Workshop labels use blue.

### Plenary Sessions

Sessionize's `isPlenumSession` flag makes an event span all track columns.
Plenary presentations show their assigned room and open a shareable talk URL.
Opening or closing a talk keeps the schedule's scroll position, including
when browser back returns to a day link.

Plenary service sessions have no location label. Put any directions in their
description; the schedule shows that description on desktop and mobile.
When a plenary service session overlaps a workshop, a partly transparent
break band covers all tracks. The rounded band has a gray fill; unused
track cells behind it stay white. The workshop card stays continuous and
clickable through the band.

Desktop entries longer than 60 minutes have a 12rem minimum card height.
Mobile cards do not use this minimum.

Schedule cards show start and end times next to the session type badge, or
above the title when there is no badge, on desktop and mobile. Mobile workshop
cards list overlapping service sessions with their time ranges. Sessions that
only meet at an end or start time do not overlap.

### Schedule Day Links

Use either format to link to a conference day:

- Day number: `/schedule#day1` or `/schedule#day2`
- Weekday: `/schedule#thursday` or `/schedule#friday`

Day numbers follow the schedule order. Weekdays use the conference date,
not the visitor's time zone. Date links such as `/schedule#2026-11-19` also work.

The day links above the schedule use day numbers and update the URL. Copy a
link or the browser address to share it. The page scrolls to that day after
the schedule loads.

### Content Management

- **Team Data**: Embedded in `src/utils/data-loader.ts` site metadata
- **Sponsors**: YAML files in `public/data/sponsors/`
- **Hotels**: YAML files in `public/data/hotels/`
- **Images**: Organized by category in `public/images/`

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

- **Image Optimization**: Use native `<img>` tags with proper loading attributes
- **Code Splitting**: Automatic with Vite's build process and React Router
- **Bundle Optimization**: Tree shaking and dead code elimination via Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimization**: Meta tags and structured data via react-helmet-async

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

Talk and speaker social previews refresh periodically. See the `schedule` trigger
in `.github/workflows/deploy-on-sessionize-change.yaml` for the current interval.

### Preview Environments

Per-PR preview deployments to Cloudflare Pages, gated by a label (workflow: `.github/workflows/preview.yaml`).

1. Add the `preview-enabled` label to a PR (only users with write/triage access can apply labels).
2. The **PR Preview** workflow builds the site and deploys it to the `cloudnative-denmark-preview` Cloudflare Pages project under a per-PR alias.
3. A bot comment posts the preview URL — `https://pr-<number>.cloudnative-denmark-preview.pages.dev` — and redeploys on every push while the label is set.
4. The deployment is deleted automatically when the label is removed or the PR is closed/merged.

Requires repo secrets `CLOUDFLARE_API_TOKEN` (Pages:Edit scope) and `CLOUDFLARE_ACCOUNT_ID`.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

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
