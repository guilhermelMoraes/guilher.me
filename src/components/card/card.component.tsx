import { useState, type ReactNode } from 'react';

import s from './card.module.css';

export type CardProps = {
  readonly topPill?: ReactNode;
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
};

export default function Card({
  topPill = null,
  image,
  header,
  body,
  link,
  mode = 'content',
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
            {topPill}
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
    <CardFallback />
  );
}

function CardFallback({ image }: CardProps) {
  return (
    <div className="d-flex gap-2 border rounded p-2 shadow-sm h-100 placeholder-glow" aria-hidden="true">
      <img
        alt="Loading card cover placeholder"
        className={`${s['card__cover']} rounded placeholder h-100`}
      />
      <div className={`${s['card__details']} d-flex flex-column`}>
        <header>
          <h4 className="mb-1 placeholder" />
        </header>
      </div>
    </div>
  );
}
