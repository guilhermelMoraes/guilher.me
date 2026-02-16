import { Badge } from 'react-bootstrap';

import type { CardProps } from '../card/card.component';
import Card from '../card/card.component';
import PeriodSelect, {
  type PeriodSelectProps,
} from './period-select.component';

type TopItemsProps = {
  readonly periodSelector: PeriodSelectProps;
  readonly items: CardProps[];
};

export default function TopItems({
  items,
  periodSelector,
}: TopItemsProps) {
  return (
    <>
      <PeriodSelect
        source={periodSelector.source}
        setState={periodSelector.setState}
      />
      <div className="container-fluid px-0">
        <div className="row g-2">
          {items.map(({ topPill, ...rest }, index) => (
            <div key={`${rest.link}-${index}`} className="col-lg-4">
              <Card
                topPill={
                  <Badge
                    className="mb-0 d-flex align-items-center"
                    style={{ maxWidth: 150 }}
                  >
                    <p className="mb-0 text-truncate">{topPill}</p>
                  </Badge>
                }
                {...rest}
              />
            </div>
          ))}
        </div>
      </div>
    </>   
  );
}
