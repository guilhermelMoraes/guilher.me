import { useState, type ReactNode } from 'react';

import s from './card.module.css';

type CardProps = {
  readonly topPill?: ReactNode;
  readonly header: string;
  readonly body?: ReactNode;
  readonly link?: string;
  readonly image: {
    src: string;
    alt: string;
    maxSize?: {
      width?: number;
      height?: number;
    };
  };
};

export default function Card({
  topPill = null,
  image,
  header,
  body,
  link,
}: CardProps) {
  const [src, setSrc] = useState<string>(image.src ?? '/song-placeholder.png');

  const width = image?.maxSize?.width ?? 124;
  const height = image?.maxSize?.height ?? 124;

  return (
    <div className="d-flex gap-2 border rounded p-2 shadow-sm h-100">
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
          loading="lazy"
          alt={image.alt}
          className="rounded"
          onError={() => setSrc('/song-placeholder.png')}
        />
      </div>
      <div className={`${s['card__details']} d-flex flex-column`}>
        <header>
          {topPill}
          <h4 className="text-truncate mb-1" title={header}>
            {header}
          </h4>
        </header>
        <p className="text-truncate">{body}</p>
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
      </div>
    </div>
  );
}
