import { type ReactNode } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type StatProps = {
  readonly label: string;
  readonly stat: ReactNode;
};

export default function Stat({ label, stat }: StatProps) {
  return (
    <div className="col-6 col-sm-3">
      <div className="rounded">
        <small className="d-block text-center text-truncate" title={label}>
          {label}{' '}
          <OverlayTrigger
            overlay={
              <Tooltip>
                Dados coletados a partir de 18 de abril de 2025.
              </Tooltip>
            }
          >
            <i className="bi bi-info-circle" />
          </OverlayTrigger>
        </small>
        <h4 className="text-center mb-0">{stat}</h4>
      </div>
    </div>
  );
}
