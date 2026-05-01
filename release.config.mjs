const packageRoot = "packages/stepper";

const releaseConfig = {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "build", release: "patch" },
          { type: "chore", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "test", release: false },
          { type: "ci", release: false },
          { type: "style", release: false },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle: "# Changelog",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: `${packageRoot}/CHANGELOG.md`,
        changelogTitle: "# @francozeta/stepper Changelog",
      },
    ],
    [
      "@semantic-release/npm",
      {
        pkgRoot: packageRoot,
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          `${packageRoot}/CHANGELOG.md`,
          `${packageRoot}/package.json`,
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};

export default releaseConfig;
