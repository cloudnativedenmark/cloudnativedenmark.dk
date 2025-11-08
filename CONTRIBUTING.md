# Contributing to Cloud Native Denmark Website

Thank you for your interest in contributing to the Cloud Native Denmark website! This guide will help you understand our development process and how to submit effective contributions.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and different perspectives
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+ installed
- Git configured with your GitHub account
- Basic knowledge of React, TypeScript, and Vite

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cloudnativedenmark.dk.git
   cd cloudnativedenmark.dk
   ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/vyrwu/cloudnativedenmark.dk.git
   ```

3. **Install dependencies**

   ```bash
   yarn install
   ```

4. **Start development server**

   ```bash
   yarn develop
   ```

5. **Verify setup**
   - Open `http://localhost:8000`
   - Run `yarn typecheck`
   - Run `yarn lint`
   - Run `yarn format`

## 📝 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b docs/update-documentation
```

### Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or improvements

### 2. Make Your Changes

Follow these guidelines when making changes:

#### Code Style

- **TypeScript**: Use strict typing, avoid `any` types
- **React**: Functional components with hooks
- **Components**: Follow composition over inheritance
- **Styling**: Use Tailwind utility classes

#### Component Structure

```typescript
// Example component structure
import React from "react"

interface ComponentProps {
  title: string
  description?: string
  variant?: "default" | "compact"
}

const Component: React.FC<ComponentProps> = ({
  title,
  description,
  variant = "default"
}) => {
  return (
    <div className="component-class">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default Component
```

#### File Organization

- Place components in appropriate directories (`ui/`, `content/`, `layout/`, `features/`)
- Use barrel exports (`index.ts`) for clean imports
- Keep files focused and single-purpose

### 3. Test Your Changes

Before submitting, ensure your changes work correctly:

```bash
# Type checking
yarn typecheck

# Linting
yarn lint

# Code formatting
yarn format:fix

# Build test
yarn build

# Development test
yarn develop
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add speaker search functionality

- Implement fuzzy search using Fuse.js
- Add search input component
- Update speaker list to show filtered results
- Add loading states and empty results handling"
```

#### Commit Message Convention

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Test additions
- `chore:` - Maintenance tasks

## 📋 Pull Request Process

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Your Changes

```bash
git push origin your-branch-name
```

### 3. Create Pull Request

1. Go to the [repository](https://github.com/vyrwu/cloudnativedenmark.dk)
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template completely

#### PR Template Checklist

- [ ] Clear description of changes
- [ ] Screenshots for UI changes
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Breaking changes noted

### 4. Code Review Process

- All PRs require at least one review
- Address feedback promptly and respectfully
- Make requested changes in new commits
- Once approved, maintainers will merge

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### Feature Requests

For new features, provide:

- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Other solutions you considered
- **Use Cases**: Who would benefit from this?

## 🏗️ Architecture Guidelines

### Component Design

- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Design for reuse across the site
- **Accessibility**: Include ARIA labels and keyboard navigation
- **Performance**: Use lazy loading and optimization techniques

### Data Management

- **Static Data**: Use YAML files in `src/data/`
- **Dynamic Data**: Use Sessionize API via custom hooks
- **Static Loading**: Use custom utilities for YAML content loading
- **State**: Use React hooks for local state management

### Styling Guidelines

- **Tailwind CSS**: Use utility classes for styling
- **Responsive**: Mobile-first design approach
- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure proper contrast and focus states

## 🚦 Testing

### Manual Testing

- Test on multiple devices and browsers
- Verify responsive design works correctly
- Check accessibility with screen readers
- Test form submissions and interactions

### Automated Testing

Currently, we rely on:

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Build process for integration testing

## 📚 Resources

### Learning Materials

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project-Specific

- [Sessionize API Documentation](https://sessionize.com/api/v2)
- [Cloud Native Denmark Brand Guidelines](./docs/brand-guidelines.md)

## 💬 Community & Support

### Getting Help

- **GitHub Issues**: Technical questions and bug reports
- **Discussions**: General questions and ideas
- **Email**: [info@cloudnativedenmark.dk](mailto:info@cloudnativedenmark.dk)

### Community Channels

- **LinkedIn**: [Cloud Native Denmark](https://www.linkedin.com/company/cloud-native-denmark/)
- **Website**: [cloudnativedenmark.dk](https://cloudnativedenmark.dk)

## 🎉 Recognition

Contributors are recognized in:

- GitHub contributors list
- Website acknowledgments (for significant contributions)
- Community shout-outs

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Cloud Native Denmark! Your efforts help build a stronger cloud-native community in Denmark. 🇩🇰

