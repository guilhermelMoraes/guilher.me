import { Form } from 'react-bootstrap';

import Periods from './types/periods.enum';

type Sources = 'albums' | 'tracks' | 'artists';

export type PeriodSelectProps = {
  readonly source: Sources;
  readonly setState: (source: Sources, period: Periods) => Promise<void>;
};

export default function PeriodSelect({ source, setState }: PeriodSelectProps) {
  return (
    <Form.Select
      aria-label="Períodos disponíveis"
      className="mb-2"
      onChange={({ currentTarget }) =>
        setState(source, currentTarget.value as Periods)
      }
    >
      <option value={Periods.LAST_WEEK}>Últimos 7 dias</option>
      <option value={Periods.LAST_MONTH}>Últimos 30 dias</option>
      <option value={Periods.LAST_QUARTER}>Últimos 3 meses</option>
      <option value={Periods.LAST_SIX_MONTHS}>Últimos 6 meses</option>
      <option value={Periods.LAST_YEAR}>Últimos 12 meses</option>
      <option value={Periods.ALL_TIME}>Desde 18 de abril de 2025</option>
    </Form.Select>
  );
}
