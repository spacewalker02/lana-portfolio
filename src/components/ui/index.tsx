// Small, reusable primitives. Imported across many components.

import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './ui.module.scss';


// MonoLabel: monospaced section markers

interface MonoLabelProps {
  children: ReactNode;
  block?: boolean;
  className?: string;
}
export function MonoLabel({ children, block = false, className }: MonoLabelProps) {
  return (
    <span
      className={[styles.monoLabel, block ? styles.monoBlock : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

// StatusPill: green dot + label used in hero

interface StatusPillProps {
  label: string;
  available?: boolean;
}
export function StatusPill({ label, available = true }: StatusPillProps) {
  return (
    <span className={styles.statusPill}>
      <span
        className={`${styles.statusDot} ${available ? styles.statusDotOk : ''}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

// Tag: monospaced pill, used in cards

interface TagProps {
  children: ReactNode;
}
export function Tag({ children }: TagProps) {
  return <span className={styles.tag}>{children}</span>;
}

// Button: primary (filled) and ghost variants

type ButtonVariant = 'primary' | 'ghost';

interface BaseButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${variant === 'ghost' ? styles.btnGhost : ''} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  children,
  className,
  ...rest
}: AnchorButtonProps) {
  return (
    <a
      className={`${styles.btn} ${variant === 'ghost' ? styles.btnGhost : ''} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </a>
  );
}

// SVG icons

export function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </svg>
  );
}