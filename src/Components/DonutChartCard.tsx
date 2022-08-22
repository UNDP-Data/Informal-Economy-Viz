import styled from 'styled-components';
import { describeArc } from '../utils/getArc';

interface Props {
  data: number;
}

const Container = styled.div`
  padding: 2rem 4rem;
  max-width: 23rem;
  width: 100%;
  margin: auto;
`;

export const DonutChartCard = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <Container>
      <svg width='100%' viewBox='0 0 150 150'>
        <circle
          cx={75}
          cy={75}
          r={70}
          fill='none'
          stroke='#fff'
          strokeWidth={10}
        />
        <path
          d={describeArc(75, 75, 70, 0, 360 * (data / 100))}
          fill='none'
          strokeWidth={10}
          style={{ stroke: '#110848' }}
        />
        <text
          x={75}
          y={75}
          textAnchor='middle'
          fontFamily='proxima-nova'
          fontWeight='bold'
          fontSize='36px'
          dy={15}
        >
          {data}
          %
        </text>
      </svg>
    </Container>
  );
};
