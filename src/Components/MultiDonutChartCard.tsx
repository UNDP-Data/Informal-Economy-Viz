import styled from 'styled-components';
import { describeArc } from '../utils/getArc';

interface Props {
  data: number[];
  keys: string[];
  colors: string[];
  titleText: string;
}

const Container = styled.div`
  padding: 2rem 0;
  width: calc(25% - 2.5rem);
  margin: auto;
`;

const TitleEl = styled.div`
  color: #110848;
  text-align: left;
  font-weight: bold;
  padding: 2rem;
`;

export const MultiDonutChartCard = (props: Props) => {
  const {
    data,
    keys,
    colors,
    titleText,
  } = props;
  return (
    <Container>
      <TitleEl>
        {titleText}
      </TitleEl>
      <svg width='100%' viewBox='0 0 275 150'>
        {
          data.map((d, i) => (
            <g key={i}>
              <circle
                cx={68}
                cy={68}
                r={65 - (i * 11)}
                fill='none'
                stroke='#fff'
                strokeWidth={10}
              />
              <path
                d={describeArc(68, 68, 65 - (i * 11), 0, 360 * (d / 100))}
                fill='none'
                strokeWidth={7}
                style={{ stroke: colors[i] }}
              />

            </g>
          ))
        }
        {
          data.map((d, i) => (
            <g
              key={i}
              transform={`translate(150,${140 - (i * 20)})`}
            >
              <rect
                x={0}
                y={-15}
                width={12}
                height={12}
                fill={colors[i]}
              />
              <text
                x={0}
                y={0}
                dx={16}
                dy={-5}
                width={15}
                height={15}
                fontSize={12}
                fill={colors[i]}
              >
                {keys[i]}
                {' '}
                (
                {d}
                %)
              </text>

            </g>
          ))
        }
      </svg>
    </Container>
  );
};
