import type { ReactNode, ElementType } from 'react';
import styles from './Container.module.scss'

interface ContainerProps {
    children: ReactNode;
    /** narrow = 760px (case prose); page = 1180px (default sections) */
    size?: 'page' | 'narrow';
    as?: ElementType;
    className?: string;
  }

  export function Container({
    children,
    size = 'page',
    as: Tag = 'div',
    className,
  }: ContainerProps) {
    return (
      <Tag
        className={[
          styles.container,
          size === 'narrow' ? styles.narrow : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </Tag>
    );
  }