# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `yarn develop` or `yarn start` - Start development server (runs on http://localhost:8000)
- `yarn build` - Build the site for production
- `yarn serve` - Serve the production build locally
- `yarn clean` - Clean Gatsby cache and public directory
- `yarn typecheck` - Run TypeScript type checking
- `yarn format` - Check code formatting with Prettier
- `yarn format:fix` - Fix code formatting with Prettier
- `yarn lint` - Check code quality with ESLint
- `yarn lint:fix` - Fix auto-fixable ESLint issues
- `yarn test` - Run unit tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report

### Dependencies

- Install dependencies with `yarn install`
- This project uses yarn (yarn.lock present)

## Architecture Overview

This is a **Gatsby v5 site** for Cloud Native Denmark, a technical conference website built with **TypeScript**, **React**, and **Tailwind CSS**.

### Core Technologies

- **Gatsby** - Static site generator with GraphQL data layer
- **React 18** - UI framework with TypeScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Key Architectural Patterns

#### Data Sources & Management

- **YAML-driven content**: Sponsors, hotels, and team data stored as YAML files in `src/data/`
- **Sessionize API integration**: Live conference data (speakers, schedule, sessions) fetched from Sessionize API via custom hooks
- **GraphQL data layer**: Gatsby's GraphQL for static data, REST API calls for dynamic data
- **File-based routing**: Pages in `src/pages/` become routes automatically

#### Component Architecture

- **Modular component system**: Organized by purpose (ui/, content/, layout/, features/)
- **Composition-based design**: Complex UIs built from simple, reusable components
- **Variant-based styling**: Components adapt via props (Button variants, Section variants, etc.)
- **Barrel exports**: Clean imports via index.ts files
- **Layout system**: Central `Layout` component with refactored `Header` and `Footer`
- **Modal management**: Centralized modal state with `useModalManagement` hook

#### External Dependencies

- **Sessionize Integration**: Conference data fetched from `https://sessionize.com/api/v2/{sessionId}/view/` endpoints
- **Session ID**: Currently set to `ri9gml9f` in `use-sessionize.tsx:3`
- **Data Types**: Complex TypeScript interfaces for Speaker, Session, GridEntry, etc.

### Directory Structure

```
src/
├── components/     - Modular component system
│   ├── ui/        - Basic UI building blocks (Button, Section, Container)
│   ├── content/   - Content-specific components (TeamGrid, SponsorGrid, VideoEmbed)
│   ├── layout/    - Layout components (PageHeader, HeroSection)
│   └── features/  - Feature components (SessionCard, SpeakerList, modals)
├── data/          - YAML content files (sponsors, hotels, team)
├── hooks/         - Custom React hooks (Sessionize API, modal management, scroll visibility)
├── images/        - Static assets and images
├── pages/         - Gatsby pages (auto-routed, now using component composition)
├── styles/        - Global CSS styles
└── utils/         - Shared utilities (time formatting, etc.)
```

### Key Features

- **Conference Schedule**: Dynamic grid layout with session management
- **Speaker Profiles**: Interactive speaker cards with modal details
- **Sponsor Management**: Tiered sponsor system (Platinum, Gold, Bronze, Community, Partners)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Important Implementation Details

#### Sessionize Integration (`src/hooks/use-sessionize.tsx`)

- Two main hooks: `useSessionizeSpeakers` and `useSessionizeSchedule`
- Complex data transformation merging multiple API endpoints
- Handles speakers, sessions, and grid data with cross-referencing

#### Content Management

- Team data embedded in `gatsby-config.ts` site metadata
- Sponsor/hotel data in YAML files under `src/data/`
- Images organized by category in `src/images/`

#### Styling Approach

- Tailwind v4 with PostCSS configuration
- Custom color scheme defined in Tailwind config
- SVG icons imported as React components via `@svgr/webpack`

### Development Considerations

- **Component-driven development**: Pages built by composing reusable components
- **TypeScript strict mode**: Full type safety with comprehensive interfaces
- **Responsive-first design**: Mobile-first approach with Tailwind CSS utilities
- **Performance optimized**: Code splitting, tree shaking, and image optimization
- **Consistent styling**: Variant-based component design with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Developer experience**: Barrel exports, clear prop interfaces, and component documentation

