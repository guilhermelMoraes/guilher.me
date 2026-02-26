import { useState } from 'react';
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
        {socialMedias[typeOfLink].map(({ href, icon, title }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={title}
          >
            <i className={`bi ${icon} fs-1 text-secondary`} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialMediaLinks;
