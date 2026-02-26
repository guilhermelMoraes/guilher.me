import { useState, type CSSProperties } from 'react';
import { Form } from 'react-bootstrap';

import socialMedias from '../data/social-media-links.data.json';

function SocialMediaLinks() {
  const [linkSwitch, setLinkSwitch] = useState(false);

  const typeOfLink: keyof typeof socialMedias = linkSwitch
    ? 'personal'
    : 'professional';

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <Form.Switch
        id="links-switch"
        label={linkSwitch ? 'Pessoal' : 'Profissional'}
        onChange={(e) => setLinkSwitch(e.target.checked)}
        checked={linkSwitch}
      />
      <div className="d-flex gap-4 flex-wrap align-items-center justify-content-center">
        {socialMedias[typeOfLink].map(({ href, icon, title, color }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={title}
            className="social-link"
            style={{ '--brand-color': color } as CSSProperties}
          >
            <i className={`bi ${icon} fs-1`} />
          </a>
        ))}
      </div>
      <style>{`
        .social-link i {
          color: var(--bs-secondary);
          transition: color 0.3s ease;
        }

        .social-link:hover i {
          color: var(--brand-color) !important;
        }
      `}</style>
    </div>
  );
}

export default SocialMediaLinks;
