/**
 * Icon registry.
 *
 * Only the icons referenced from `src/data` are registered here — keeping the
 * map small avoids pulling the whole lucide set into the client bundle.
 * `getIcon` falls back to `Code` for any unknown name.
 */
import {
  Code,
  Brain,
  Smartphone,
  Cloud,
  Link,
  ShoppingCart,
  Lightbulb,
  Globe,
  Target,
  Zap,
  Heart,
  Users,
  Shield,
  TrendingUp,
  Award,
  Eye,
  MessageSquare,
  PenTool,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const icons = {
  // services
  Code,
  Brain,
  Smartphone,
  Cloud,
  Link,
  ShoppingCart,
  Lightbulb,
  Globe,
  // about
  Target,
  Zap,
  Heart,
  Users,
  Shield,
  TrendingUp,
  Award,
  Eye,
  // process
  MessageSquare,
  PenTool,
  // `Code2` is the legacy alias for `Code` in lucide
  Code2: Code,
  Rocket,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function getIcon(name: string): LucideIcon {
  return (icons as Record<string, LucideIcon>)[name] ?? Code;
}
