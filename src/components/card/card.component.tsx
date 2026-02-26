import { useState, type ReactNode } from 'react';
import type { Variant } from 'react-bootstrap/esm/types';
import { Badge } from 'react-bootstrap';

import s from './card.module.css';

export type CardProps = {
  readonly topPill?: {
    bg?: Variant;
    content: ReactNode;
    maxWidth?: number;
  };
  readonly header?: string;
  readonly body?: ReactNode;
  readonly link?: string;
  readonly image?: {
    src: string;
    alt: string;
    maxSize?: {
      width?: number;
      height?: number;
    };
  };
  readonly mode?: 'content' | 'placeholder';
  readonly fallbackProps?: CardFallbackProps;
};

export default function Card({
  topPill,
  image,
  header,
  body,
  link,
  mode = 'content',
  fallbackProps,
}: CardProps) {
  const [hasError, setHasError] = useState(false);

  const width = image?.maxSize?.width ?? 124;
  const height = image?.maxSize?.height ?? 124;

  const src =
    hasError || image?.src === '' ? '/song-placeholder.png' : image?.src;

  return mode === 'content' ? (
    <div className="d-flex gap-2 border rounded p-2 shadow-sm h-100">
      {image && (
        <div
          style={{
            maxWidth: width,
            maxHeight: height,
          }}
        >
          <img
            src={src}
            width={width}
            height={height}
            decoding="async"
            loading="lazy"
            alt={image.alt}
            className={`${s['card__cover']} rounded`}
            onError={() => setHasError(true)}
          />
        </div>
      )}
      <div className={`${s['card__details']} d-flex flex-column`}>
        {topPill && header && (
          <header>
            <Badge
              bg={topPill?.bg ?? 'primary'}
              className="d-flex align-items-center mb-1"
              style={{ maxWidth: topPill?.maxWidth }}
            >
              {topPill?.content}
            </Badge>

            <h4 className="text-truncate mb-1" title={header}>
              {header}
            </h4>
          </header>
        )}
        {body && <p className="text-truncate">{body}</p>}
        {link && (
          <footer className="mt-auto">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block text-truncate text-decoration-none"
            >
              Detalhes <i className="bi bi-box-arrow-up-right" />
            </a>
          </footer>
        )}
      </div>
    </div>
  ) : (
    <CardFallback {...fallbackProps} />
  );
}

type CardFallbackProps = {
  readonly image?: {
    width?: number;
    height?: number;
  };
};

function CardFallback({ image }: CardFallbackProps) {
  const width = image?.width ?? 124;
  const height = image?.height ?? 124;

  return (
    <div
      className="d-flex gap-2 border rounded p-2 shadow-sm h-100 placeholder-glow"
      aria-hidden="true"
    >
      <div
        style={{
          maxWidth: width,
          maxHeight: height,
        }}
      >
        <img
          alt="Loading card cover placeholder"
          width={width}
          height={height}
          className={`${s['card__cover']} rounded placeholder h-100`}
        />
      </div>
      <div className={`${s['card__details']} d-flex flex-column flex-grow-1`}>
        <header>
          <span
            className="placeholder placeholder-lg w-50"
            style={{ maxWidth: 170 }}
          />
          <h4 className="mb-1 placeholder w-100" />
        </header>
        <span
          className="placeholder placeholder-lg w-50"
          style={{ maxWidth: 170 }}
        />
        <footer className="mt-auto">
          <span className="placeholder placeholder-lg w-50" />
        </footer>
      </div>
    </div>
  );
}
