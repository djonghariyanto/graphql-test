{
  description = "example-node-js-flake";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        buildNodeJs = pkgs.callPackage "${<nixpkgs>}/pkgs/development/web/nodejs/nodejs.nix" {
          python = pkgs.python3;
        };

        # nodejs = buildNodeJs {
        #   enableNpm = true;
        #   version = "22.3.0";
        #   sha256 = "sha256-v7hb0dylF3YfkEbWFgD4MNGZNdbWw27e0BV4oZMmEEw=";
        # };
      in {
        flakedPkgs = pkgs;

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            typescript
          ];
        };
      }
    );
}
