type DocsTocItem = {
  title: string;
  href: string;
};

const docsToc: Record<string, DocsTocItem[]> = {
  "/": [
    { title: "Preview", href: "#preview" },
    { title: "Create workspace", href: "#create-workspace" },
    { title: "Usage", href: "#usage" },
    { title: "Works with", href: "#works-with" },
    { title: "Install shape", href: "#install-shape" },
    { title: "V1 scope", href: "#v1-scope" },
  ],
  "/getting-started": [
    { title: "Add the component", href: "#add-the-component" },
    { title: "Use it uncontrolled", href: "#use-it-uncontrolled" },
    { title: "Use it controlled", href: "#use-it-controlled" },
  ],
  "/api": [
    { title: "Root props", href: "#root-props" },
    { title: "List props", href: "#list-props" },
    { title: "Item props", href: "#item-props" },
    { title: "Trigger props", href: "#trigger-props" },
    { title: "Content props", href: "#content-props" },
    { title: "Navigation props", href: "#navigation-props" },
    { title: "useStepper hook", href: "#usestepper-hook" },
    { title: "Primitive parts", href: "#primitive-parts" },
    { title: "Composable trigger", href: "#composable-trigger" },
  ],
  "/examples": [
    { title: "Create workspace", href: "#create-workspace" },
    { title: "Checkout flow", href: "#checkout-flow" },
    { title: "Workspace onboarding", href: "#workspace-onboarding" },
    { title: "Controlled review", href: "#controlled-review" },
  ],
  "/styling": [
    { title: "Theme tokens", href: "#theme-tokens" },
    { title: "State selectors", href: "#state-selectors" },
    { title: "Customize by composition", href: "#customize-by-composition" },
  ],
  "/changelog": [
    { title: "Added", href: "#added" },
    { title: "Release link", href: "#release-link" },
    { title: "Next direction", href: "#next-direction" },
  ],
};

export { docsToc };
export type { DocsTocItem };
