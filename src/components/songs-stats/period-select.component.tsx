import { Form } from 'react-bootstrap';
import Periods from '../../types/periods.enum';

type Show = 'albums' | 'tracks' | 'artists';

type PeriodSelectProps = {
  readonly source: Show;
  readonly teste: (source: Show, period: Periods) => Promise<void>;
};

export default function PeriodSelect({ source, teste }: PeriodSelectProps) {
  return (
    <Form.Select
      aria-label="Períodos disponíveis"
      className="d-inline-block w-25 mb-2"
      onChange={({ currentTarget }) =>
        teste(source, currentTarget.value as Periods)
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
