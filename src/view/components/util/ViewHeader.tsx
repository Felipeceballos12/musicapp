type ViewHeaderProps = {
  title: string;
  canGoBack?: boolean;
  showBackButton?: boolean;
  hideOnScroll?: boolean;
  showOnDesktop?: boolean;
  showBorder?: boolean;
  renderButton?: () => JSX.Element;
};

export function ViewHeader({
  title,
  canGoBack,
  showBackButton = true,
  hideOnScroll,
  showOnDesktop,
  showBorder,
  renderButton,
}: ViewHeaderProps) {}

// This Component need to finish
