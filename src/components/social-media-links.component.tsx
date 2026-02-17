import { useState } from 'react';
import { Form } from 'react-bootstrap';

type LinkData = {
  icon: string;
  href: string;
  title: string;
};

const socialMedias: Record<string, LinkData[]> = {
  professional: [
    {
      icon: 'bi-linkedin',
      href: 'https://www.linkedin.com/in/guilhermelmoraes/?locale=en',
      title: 'LinkedIn',
    },
    {
      icon: 'bi-envelope-at-fill',
      href: 'mailto:moraes.guilherme32@proton.me',
      title: 'E-mail',
    },
    {
      icon: 'bi-github',
      href: 'https://github.com/guilhermelMoraes',
      title: 'Github',
    },
  ],
  personal: [
    {
      icon: 'bi-steam',
      href: 'https://steamcommunity.com/id/ego_patronus/',
      title: 'Steam',
    },
    {
      icon: 'bi-strava',
      href: 'https://www.strava.com/athletes/38100403',
      title: 'Strava',
    },
    {
      icon: 'bi-instagram',
      href: 'https://www.instagram.com/ego_patronus/',
      title: 'Instagram',
    },
    {
      icon: 'bi-twitch',
      href: 'https://www.twitch.tv/ego_patronus',
      title: 'Twitch',
    },
    {
      icon: 'bi-spotify',
      href: 'https://open.spotify.com/user/12149673892',
      title: 'Spotify',
    },
    {
      icon: 'bi-playstation',
      href: 'https://psnprofiles.com/ego_patronus',
      title: 'Playstation',
    },
    {
      icon: 'bi-xbox',
      href: 'https://www.xbox.com/pt-BR/play/user/egopatronus',
      title: 'Xbox',
    },
    {
      icon: 'bi-nintendo-switch',
      href: 'https://lounge.nintendo.com/friendcode/7073-8254-1724/DV5KgCRf3k',
      title: 'Nintendo Switch',
    },
    {
      icon: 'bi-discord',
      href: 'https://www.discordapp.com/users/742895195506343987',
      title: 'Discord',
    },
  ],
};

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
