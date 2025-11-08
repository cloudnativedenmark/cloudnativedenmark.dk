{
  description = "Cloud Native Denmark development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          name = "cloudnativedenmark-dev";

          buildInputs = with pkgs; [
            nodejs_24
            yarn-berry
            zsh
          ];

          # Use zsh as the shell
          shellHook = ''
            # Print user commands
            echo ""
            echo "🚀 Cloud Native Denmark development environment"
            echo "🐚 Zsh version: $(zsh --version)"
            echo "📦 Node.js version: $(node --version)"
            echo "🧶 Yarn version: $(yarn --version)"
            echo ""
            echo "Available commands:"
            echo "  yarn install       # Install dependencies"
            echo "  yarn develop       # Start development server"
            echo "  yarn build         # Build for production"
            echo "  yarn serve         # Serve production build locally"
            echo "  yarn clean         # Clean Vite cache and dist directory"
            echo "  yarn typecheck     # Run TypeScript type checking"
            echo "  yarn format        # Check code formatting with Prettier"
            echo "  yarn format:fix    # Fix code formatting with Prettier"
            echo "  yarn lint          # Check code quality with ESLint"
            echo "  yarn lint:fix      # Fix auto-fixable ESLint issues"
            echo "  yarn test          # Run unit tests"
            echo "  yarn test:watch    # Run tests in watch mode"
            echo "  yarn test:coverage # Run tests with coverage report"
            echo ""

            exec ${pkgs.zsh}/bin/zsh
          '';

          # Environment variables
          NODE_ENV = "development";

          # Prevent npm/yarn from sending telemetry
          YARN_ENABLE_TELEMETRY = "0";
          NPM_CONFIG_FUND = "false";
          NPM_CONFIG_AUDIT = "false";
        };
      }
    );
}
