type DocsTocItem = {
  title: string;
  href: string;
};

const docsToc: Record<string, DocsTocItem[]> = {
  "/": [
    { title: "Install", href: "#install" },
    { title: "Preview", href: "#preview" },
    { title: "Create workspace", href: "#create-workspace" },
    { title: "Why another Stepper?", href: "#why-another-stepper" },
  ],
  "/getting-started": [
    { title: "Install package", href: "#install-package" },
    { title: "Copy the component", href: "#copy-the-component" },
    { title: "Use it uncontrolled", href: "#use-it-uncontrolled" },
    { title: "Use it controlled", href: "#use-it-controlled" },
  ],
  "/forms": [
    { title: "Primitive boundary", href: "#primitive-boundary" },
    { title: "Validation flow", href: "#validation-flow" },
    { title: "Form wizard", href: "#form-wizard" },
  ],
  "/patterns": [
    { title: "Circle progress", href: "#circle-progress" },
    { title: "Controls only", href: "#controls-only" },
    { title: "Route-based stepper", href: "#route-based-stepper" },
    { title: "Mobile drawer pattern", href: "#mobile-drawer-pattern" },
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
    { title: "NPM package usage", href: "#npm-package-usage" },
    { title: "Required tokens", href: "#required-tokens" },
    { title: "State selectors", href: "#state-selectors" },
    { title: "Customize by composition", href: "#customize-by-composition" },
  ],
  "/changelog": [
    { title: "Changed", href: "#changed" },
    { title: "Tag link", href: "#tag-link" },
    { title: "Next direction", href: "#next-direction" },
  ],
};

export { docsToc };
export type { DocsTocItem };
