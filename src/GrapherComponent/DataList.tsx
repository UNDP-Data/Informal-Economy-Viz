import { useContext } from 'react';
import sortBy from 'lodash.sortby';
import { format } from 'd3-format';
import { Select } from 'antd';
import {
  CountryGroupDataType,
  CountryListType,
  CtxDataType,
  IndicatorMetaDataWithYear,
} from '../Types';
import Context from '../Context/Context';
import { TrendChartSmall } from './TrendChartSmall';

interface Props {
  data: CountryGroupDataType[];
  indicators: IndicatorMetaDataWithYear[];
  countries: CountryListType[];
}

export const DataList = (props: Props) => {
  const {
    data,
    indicators,
    countries,
  } = props;
  const {
    dataListCountry,
    updateDataListCountry,
  } = useContext(Context) as CtxDataType;
  const dataFiltered = dataListCountry
    ? data.filter((d) => d['Country or Area'] === dataListCountry)[0].indicators.map((d) => ({ ...d, yearlyData: sortBy(d.yearlyData.filter((el) => el.value !== undefined), 'year') }))
    : undefined;
  return (
    <>
      {
        dataFiltered && dataListCountry
          ? (
            <>
              <div className='undp-table-head undp-table-head-sticky'>
                <div style={{ width: '50%' }} className='undp-table-head-cell undp-sticky-head-column'>
                  Indicator
                </div>
                <div style={{ width: '20%' }} className='undp-table-head-cell undp-sticky-head-column align-right'>
                  Recent Value
                </div>
                <div style={{ width: '30%' }} className='undp-table-head-cell undp-sticky-head-column'>
                  Trend
                </div>
              </div>
              {
                dataFiltered.map((d, i) => (indicators.findIndex((el) => el.DataKey === d.indicator) !== -1
                  ? (
                    <div key={i} className='undp-table-row'>
                      <div style={{ width: '50%', fontSize: '1rem' }} className='undp-table-row-cell'>
                        {indicators[indicators.findIndex((el) => el.DataKey === d.indicator)].IndicatorLabelTable}
                      </div>
                      <div style={{ width: '20%' }} className='undp-table-row-cell align-right'>
                        {
                          d.yearlyData.length === 0 ? 'NA' : (
                            <>
                              <span className='bold'>
                                {
                                  indicators[indicators.findIndex((el) => el.DataKey === d.indicator)].LabelPrefix ? `${indicators[indicators.findIndex((el) => el.DataKey === d.indicator)].LabelPrefix} ` : ''
                                }
                                {d.yearlyData[d.yearlyData.length - 1].value !== undefined ? (d.yearlyData[d.yearlyData.length - 1].value as number) < 1000000 ? format(',')(parseFloat((d.yearlyData[d.yearlyData.length - 1].value as number).toFixed(2))).replace(',', ' ') : format('.3s')(d.yearlyData[d.yearlyData.length - 1].value as number).replace('G', 'B') : d.yearlyData[d.yearlyData.length - 1].value }
                                {
                                  indicators[indicators.findIndex((el) => el.DataKey === d.indicator)].LabelSuffix ? ` ${indicators[indicators.findIndex((el) => el.DataKey === d.indicator)].LabelSuffix}` : ''
                                }
                              </span>
                              <br />
                              <span style={{ fontSize: '1rem', color: 'var(--gray-500)' }}>
                                (
                                {d.yearlyData[d.yearlyData.length - 1].year}
                                )
                              </span>
                            </>
                          )
                        }
                      </div>
                      <div style={{ width: '30%' }} className='undp-table-row-cell'>
                        <TrendChartSmall
                          countryName={dataListCountry}
                          data={d.yearlyData}
                          indicator={indicators[indicators.findIndex((el) => el.DataKey === d.indicator)]}
                        />
                      </div>
                    </div>
                  )
                  : null))
              }
            </>
          ) : (
            <div className='center-area-info-el'>
              <h5 className='undp-typography'>Please select countries to see their trends</h5>
              <Select
                showSearch
                className='undp-select'
                placeholder='Please select a country'
                onChange={(d) => { updateDataListCountry(d); }}
                value={dataListCountry}
                maxTagCount='responsive'
              >
                {
                  countries.map((d) => d.name).map((d) => (
                    <Select.Option className='undp-select-option' key={d}>{d}</Select.Option>
                  ))
                }
              </Select>
            </div>
          )
      }
    </>
  );
};
