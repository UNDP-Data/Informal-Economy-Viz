/* eslint-disable jsx-a11y/iframe-has-title */
import { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { json } from 'd3-request';
import uniqBy from 'lodash.uniqby';
import { queue } from 'd3-queue';
import flattenDeep from 'lodash.flattendeep';
import sortedUniq from 'lodash.sorteduniq';
import {
  CountryGroupDataType, CountryListType, IndicatorMetaDataType, IndicatorMetaDataWithYear,
} from './Types';
import { GrapherComponent } from './GrapherComponent';
import Reducer from './Context/Reducer';
import Context from './Context/Context';
import {
  DEFAULT_VALUES, DATALINK, METADATALINK,
} from './Constants';
import { MultiDonutChartCard } from './Components/MultiDonutChartCard';

const VizAreaEl = styled.div`
  display: flex;
  max-width: 1220px;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 10rem;
`;

const App = () => {
  const [finalData, setFinalData] = useState<CountryGroupDataType[] | undefined>(undefined);
  const [indicatorsList, setIndicatorsList] = useState<IndicatorMetaDataWithYear[] | undefined>(undefined);
  const [regionList, setRegionList] = useState<string[] | undefined>(undefined);
  const [countryList, setCountryList] = useState<CountryListType[] | undefined>(undefined);
  const queryParams = new URLSearchParams(window.location.search);
  const initialState = {
    graphType: queryParams.get('graphType') || 'scatterPlot',
    selectedRegions: queryParams.get('regions')?.split('~') || [],
    selectedCountries: queryParams.get('countries')?.split('~') || [],
    selectedIncomeGroups: queryParams.get('incomeGroups')?.split('~') || [],
    year: 2021,
    selectedCountryGroup: queryParams.get('countryGroup') || 'All',
    xAxisIndicator: queryParams.get('firstMetric') || DEFAULT_VALUES.firstMetric,
    yAxisIndicator: queryParams.get('secondMetric') || DEFAULT_VALUES.secondMetric,
    colorIndicator: queryParams.get('colorMetric') || DEFAULT_VALUES.colorMetric,
    sizeIndicator: queryParams.get('sizeMetric') || undefined,
    showMostRecentData: queryParams.get('showMostRecentData') !== 'false',
    showLabel: queryParams.get('showLabel') === 'true',
    showSource: false,
    trendChartCountry: queryParams.get('trendChartCountry') || undefined,
    multiCountrytrendChartCountries: queryParams.get('multiCountrytrendChartCountries')?.split('~') || ['China', 'India', 'United States of America', 'Indonesia', 'Pakistan'],
    useSameRange: queryParams.get('useSameRange') === 'true',
    reverseOrder: queryParams.get('reverseOrder') === 'true',
    verticalBarLayout: queryParams.get('verticalBarLayout') !== 'false',
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const updateGraphType = (graphType: 'scatterPlot' | 'map' | 'barGraph' | 'trendLine') => {
    dispatch({
      type: 'UPDATE_GRAPH_TYPE',
      payload: graphType,
    });
  };

  const updateMultiCountrytrendChartCountries = (multiCountrytrendChartCountries: string[]) => {
    dispatch({
      type: 'UPDATE_MULTI_COUNTRY_TREND_CHART_COUNTRIES',
      payload: multiCountrytrendChartCountries,
    });
  };

  const updateReverseOrder = (reverseOrder: boolean) => {
    dispatch({
      type: 'UPDATE_REVERSE_ORDER',
      payload: reverseOrder,
    });
  };

  const updateTrendChartCountry = (trendChartCountry: string) => {
    dispatch({
      type: 'UPDATE_TREND_CHART_COUNTRY',
      payload: trendChartCountry,
    });
  };

  const updateSelectedRegions = (selectedRegions: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_REGIONS',
      payload: selectedRegions,
    });
  };

  const updateSelectedCountries = (selectedCountries: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRIES',
      payload: selectedCountries,
    });
  };
  const updateYear = (year: number) => {
    dispatch({
      type: 'UPDATE_YEAR',
      payload: year,
    });
  };

  const updateSelectedCountryGroup = (selectedCountryGroup: 'All' | 'SIDS' | 'LLDC' | 'LDC') => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRY_GROUP',
      payload: selectedCountryGroup,
    });
  };

  const updateXAxisIndicator = (xAxisIndicator: string) => {
    dispatch({
      type: 'UPDATE_X_AXIS_INDICATOR',
      payload: xAxisIndicator,
    });
  };

  const updateYAxisIndicator = (yAxisIndicator?: string) => {
    dispatch({
      type: 'UPDATE_Y_AXIS_INDICATOR',
      payload: yAxisIndicator,
    });
  };

  const updateColorIndicator = (colorIndicator?: string) => {
    dispatch({
      type: 'UPDATE_COLOR_INDICATOR',
      payload: colorIndicator,
    });
  };

  const updateSizeIndicator = (sizeIndicator?: string) => {
    dispatch({
      type: 'UPDATE_SIZE_INDICATOR',
      payload: sizeIndicator,
    });
  };

  const updateSelectedIncomeGroups = (selectedIncomeGroups?: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_INCOME_GROUPS',
      payload: selectedIncomeGroups,
    });
  };

  const updateShowMostRecentData = (selectedIncomeGroups: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_MOST_RECENT_DATA',
      payload: selectedIncomeGroups,
    });
  };

  const updateShowLabel = (showLabel: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_LABEL',
      payload: showLabel,
    });
  };

  const updateShowSource = (showSource: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_SOURCE',
      payload: showSource,
    });
  };

  const updateUseSameRange = (useSameRange: boolean) => {
    dispatch({
      type: 'UPDATE_USE_SAME_RANGE',
      payload: useSameRange,
    });
  };
  const updateBarLayout = (varticalBarLayout: boolean) => {
    dispatch({
      type: 'UPDATE_BAR_LAYOUT',
      payload: varticalBarLayout,
    });
  };

  useEffect(() => {
    queue()
      .defer(json, DATALINK)
      .defer(json, METADATALINK)
      .await((err: any, data: CountryGroupDataType[], indicatorMetaData: IndicatorMetaDataType[]) => {
        if (err) throw err;
        setFinalData(data);
        setCountryList(data.map((d) => ({ name: d['Country or Area'], code: d['Alpha-3 code'] })));
        setRegionList(uniqBy(data, (d) => d['Group 2']).map((d) => d['Group 2']));
        const indicatorsFiltered = indicatorMetaData.filter((d) => d.SSTopics.indexOf('Informal Economy Facility') !== -1);
        const indicatorWithYears: IndicatorMetaDataWithYear[] = indicatorsFiltered.map((d) => {
          const years: number[][] = [];
          data.forEach((el) => {
            const indYears = el.indicators[el.indicators.findIndex((ind) => ind.indicator === d.DataKey)]?.yearlyData.map((year) => year.year);
            if (indYears) years.push(indYears);
          });
          return {
            ...d,
            years: sortedUniq(flattenDeep(years).sort()),
          };
        });
        setIndicatorsList(indicatorWithYears);
      });
  }, []);
  return (
    <>
      <div className='undp-container'>
        {
          queryParams.get('showTopStats') !== 'false'
            ? (
              <>
                <div className='stat-card-container margin-bottom-05'>
                  <div className='stat-card' style={{ width: 'calc(33.33% - 4.67rem)' }}>
                    <h3>80%</h3>
                    <h4>Of enterprises in the world absorbed by Informal Economy</h4>
                  </div>
                  <div className='stat-card' style={{ width: 'calc(33.33% - 4.67rem)' }}>
                    <h3>2 Billion</h3>
                    <h4>People working in the informal economy</h4>
                  </div>
                  <div className='stat-card' style={{ width: 'calc(33.33% - 4.67rem)' }}>
                    <h3>60%</h3>
                    <h4>Of world&apos;s employed population in the informal economy</h4>
                  </div>
                </div>
                <div className='stat-card margin-bottom-05' style={{ width: 'calc(100% - 4rem)' }}>
                  <h6 className='undp-typography' style={{ textAlign: 'center' }}>Share of informal employment in total employment by:</h6>
                  <div className='flex-div flex-wrap flex-space-between flex-vert-align-center'>
                    <MultiDonutChartCard
                      data={[66, 58.1]}
                      keys={['Male', 'Female']}
                      colors={['#00C4AA', '#8700F9']}
                      titleText='Gender'
                    />
                    <MultiDonutChartCard
                      data={[77.1, 58.7]}
                      keys={['15-24 Yrs', '25+ Yrs']}
                      titleText='Age'
                      colors={['#41b6c4', '#253494']}
                    />
                    <MultiDonutChartCard
                      data={[93.8, 84.6, 51.7, 23.8]}
                      keys={['No Edu.', 'Primary', 'Secondary', 'Tertiary']}
                      titleText='Education'
                      colors={['#d7191c', '#fdae61', '#abdda4', '#2b83ba']}
                    />
                    <MultiDonutChartCard
                      data={[80, 43.7]}
                      keys={['Rural', 'Urban']}
                      titleText='Area of Residence'
                      colors={['#4daf4a', '#377eb8']}
                    />
                  </div>
                </div>
              </>
            ) : null
        }
      </div>
      {
        queryParams.get('showVizTool') !== 'false' ? (
          <>
            {
              indicatorsList && finalData && regionList && countryList
                ? (
                  <>
                    <Context.Provider
                      value={{
                        ...state,
                        updateGraphType,
                        updateSelectedRegions,
                        updateYear,
                        updateSelectedCountries,
                        updateSelectedCountryGroup,
                        updateXAxisIndicator,
                        updateYAxisIndicator,
                        updateColorIndicator,
                        updateSizeIndicator,
                        updateSelectedIncomeGroups,
                        updateShowMostRecentData,
                        updateShowLabel,
                        updateShowSource,
                        updateTrendChartCountry,
                        updateMultiCountrytrendChartCountries,
                        updateUseSameRange,
                        updateReverseOrder,
                        updateBarLayout,
                      }}
                    >
                      <div className='undp-container'>
                        <GrapherComponent
                          data={finalData}
                          indicators={indicatorsList}
                          regions={regionList}
                          countries={countryList}
                        />
                      </div>
                    </Context.Provider>
                  </>
                )
                : (
                  <VizAreaEl className='undp-container'>
                    <div className='undp-loader' />
                  </VizAreaEl>
                )
            }
          </>
        ) : null

      }
    </>
  );
};

export default App;
