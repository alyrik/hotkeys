import React, { useEffect, useReducer, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import {
  Collapse,
  Container,
  Spacer,
  Text,
  Input,
  Row,
  Button,
  Loading,
} from '@nextui-org/react';
import orderBy from 'lodash.orderby';
import sortBy from 'lodash.sortby';
import { EChartsOption } from 'echarts-for-react/src/types';
import Zoom from 'react-medium-image-zoom';
import { HiCheck } from 'react-icons/hi';
import Bugsnag from '@bugsnag/js';

import { AnalyticsData } from '@/models/AnalyticsData';
import { FormValue } from '@/models/FormValue';
import { IMAGE_HOST } from '@/config/config';
import { useClientDimensions } from '@/helpers/useClientDimensions';
import { themeStyles } from '@/config/theme';
import { screenMapping } from '@/config/screenMapping';
import {
  ITotalValues,
  prepareTotalSum,
  prepareTotalValues,
} from '@/helpers/analytics-converters';
import { getPercent, formatPercent } from '@/helpers/formatters';
import { FormElement } from '@nextui-org/react/types/input/input-props';
import { initialState, reducer } from '@/components/Analytics/store/reducer';
import {
  setInitialUsername,
  setIsDefaultUsername,
  setUsername,
} from '@/components/Analytics/store/actions';
import { useSaveUsername } from '@/mutations/hooks/useSaveUsername';
import dynamic from 'next/dynamic';

const DynamicZoom = dynamic(() => import('react-medium-image-zoom'), {
  ssr: false,
});
const DynamicInnerImageZoom = dynamic(() => import('react-inner-image-zoom'), {
  ssr: false,
});

interface IAnalyticsProps {
  data: AnalyticsData | null;
  individualData: AnalyticsData | null;
  topUsersData: AnalyticsData[] | null;
  userPlace: number | null;
  username: string;
  isDefaultUsername: boolean;
}

const itemStyles = {
  [FormValue.Always]: '#7cffb2',
  [FormValue.Sometimes]: '#fddd60',
  [FormValue.Never]: '#ff6e76',
};
const itemNames = {
  [FormValue.Always]: 'Always',
  [FormValue.Sometimes]: 'Sometimes',
  [FormValue.Never]: 'Never',
};
const itemSymbols = {
  [FormValue.Always]: '✓',
  [FormValue.Sometimes]: '⚠',
  [FormValue.Never]: '✗',
};
const placeMap: Record<number, string> = {
  1: '1st',
  2: '2nd',
  3: '3rd',
};

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  PieChart,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const prepareOverallData = (totalValues: ITotalValues, totalSum: number) => [
  {
    value: getPercent(totalValues[FormValue.Always], totalSum),
    name: itemNames[FormValue.Always],
    itemStyle: { color: itemStyles[FormValue.Always] },
    tooltip: {
      valueFormatter: formatPercent,
    },
  },
  {
    value: getPercent(totalValues[FormValue.Sometimes], totalSum),
    name: itemNames[FormValue.Sometimes],
    itemStyle: { color: itemStyles[FormValue.Sometimes] },
    tooltip: {
      valueFormatter: formatPercent,
    },
  },
  {
    value: getPercent(totalValues[FormValue.Never], totalSum),
    name: itemNames[FormValue.Never],
    itemStyle: { color: itemStyles[FormValue.Never] },
    tooltip: {
      valueFormatter: formatPercent,
    },
  },
];

const prepareTotalOptions = (
  data: ReturnType<typeof prepareOverallData>,
  { isMobile }: { isMobile?: boolean } = {},
): EChartsOption => ({
  textStyle: {
    fontSize: 16,
  },
  title: {
    text: isMobile
      ? 'Hotkeys usage'
      : 'Overall usage of IDE functionality via hotkeys',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    show: !isMobile,
  },
  series: [
    {
      name: 'Usage',
      type: 'pie',
      radius: '60%',
      data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

const Analytics: React.FC<IAnalyticsProps> = ({
  data,
  individualData,
  topUsersData,
  userPlace,
  username,
  isDefaultUsername,
}) => {
  const [
    {
      initialUsername,
      usernameInputValue,
      isDefaultUsername: isDefaultUsernameLocal,
    },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
    initialUsername: username,
    usernameInputValue: username,
    isDefaultUsername,
  });
  const [shownImages, setShownImages] = useState<string[]>([]);

  const { isMobileWidth } = useClientDimensions();
  const {
    mutate: saveUsername,
    isLoading: isSaveUsernameLoading,
    isError: isSaveUsernameError,
  } = useSaveUsername();

  useEffect(() => {
    if (isDefaultUsernameLocal) {
      saveUsername(
        { username: usernameInputValue },
        {
          onSuccess() {
            dispatch(setIsDefaultUsername(false));
          },
          onError(e: any) {
            Bugsnag.notify(e);
          },
        },
      );
    }
  }, []);

  const isUsernameInputButtonShown = initialUsername !== usernameInputValue;

  const totalValues = prepareTotalValues(data);
  const totalIndividualValues = prepareTotalValues(individualData);
  const totalSum = prepareTotalSum(totalValues);
  const totalIndividualSum = prepareTotalSum(totalIndividualValues);

  const preparedOverallData = prepareOverallData(totalValues, totalSum);
  const preparedIndividualOverallData = prepareOverallData(
    totalIndividualValues,
    totalIndividualSum,
  );

  let preparedDetailedData = Object.entries(data ?? {}).reduce<
    {
      name: string;
      values: { [key: string]: { raw: number; id: number } };
    }[]
  >((result, [key, value]) => {
    const total =
      value[FormValue.Always] +
      value[FormValue.Sometimes] +
      value[FormValue.Never];
    const alwaysValue = getPercent(value[FormValue.Always], total);
    const sometimesValue = getPercent(value[FormValue.Sometimes], total);
    const neverValue = getPercent(value[FormValue.Never], total);

    result.push({
      name: screenMapping[Number(key)].title,
      values: {
        [FormValue.Always]: {
          raw: alwaysValue,
          id: Number(key),
        },
        [FormValue.Sometimes]: {
          raw: sometimesValue,
          id: Number(key),
        },
        [FormValue.Never]: {
          raw: neverValue,
          id: Number(key),
        },
      },
    });

    return result;
  }, []);
  preparedDetailedData = orderBy(
    preparedDetailedData,
    [
      (item) => item.values[FormValue.Always].raw,
      (item) => item.values[FormValue.Never].raw,
    ],
    ['asc', 'desc'],
  );

  let preparedIndividualDetailedData = Object.entries(
    individualData ?? {},
  ).reduce<{ name: string; status: FormValue; imageSrc: string }[]>(
    (result, [key, value]) => {
      const status =
        (Object.entries(value).find(
          ([_, responseValue]) => responseValue > 0,
        )?.[0] as FormValue) ?? FormValue.Never;
      const data = screenMapping[Number(key)];

      result.push({
        name: data.title,
        status,
        imageSrc: data.imageSrc,
      });

      return result;
    },
    [],
  );

  preparedIndividualDetailedData = sortBy(preparedIndividualDetailedData, [
    (item) => item.status === FormValue.Always,
    (item) => item.status === FormValue.Sometimes,
  ]);

  const totalOptions = prepareTotalOptions(preparedOverallData, {
    isMobile: isMobileWidth,
  });
  const totalIndividualOptions = prepareTotalOptions(
    preparedIndividualOverallData,
    { isMobile: isMobileWidth },
  );
  const detailedOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      show: !isMobileWidth,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: preparedDetailedData.map((item) => item.name),
    },
    series: [
      {
        name: itemNames[FormValue.Always],
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
        },
        emphasis: {
          focus: 'series',
        },
        itemStyle: { color: itemStyles[FormValue.Always] },
        tooltip: {
          valueFormatter: formatPercent,
        },
        data: preparedDetailedData.map((item) => ({
          name: item.values[FormValue.Always].id,
          value: item.values[FormValue.Always].raw,
        })),
      },
      {
        name: itemNames[FormValue.Sometimes],
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
        },
        emphasis: {
          focus: 'series',
        },
        itemStyle: { color: itemStyles[FormValue.Sometimes] },
        tooltip: {
          valueFormatter: formatPercent,
        },
        data: preparedDetailedData.map((item) => ({
          name: item.values[FormValue.Sometimes].id,
          value: item.values[FormValue.Sometimes].raw,
        })),
      },
      {
        name: itemNames[FormValue.Never],
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
        },
        emphasis: {
          focus: 'series',
        },
        itemStyle: { color: itemStyles[FormValue.Never] },
        tooltip: {
          valueFormatter: formatPercent,
        },
        data: preparedDetailedData.map((item) => ({
          name: item.values[FormValue.Never].id,
          value: item.values[FormValue.Never].raw,
        })),
      },
    ],
  };

  function handleCollapseChange(name: string) {
    if (!shownImages.includes(name)) {
      setShownImages([...shownImages, name]);
    }
  }

  function handleUsernameInputChange({
    target,
  }: React.ChangeEvent<FormElement>) {
    dispatch(setUsername(target.value));
  }

  function handleNameFormSubmit(event: React.FormEvent) {
    event.preventDefault();

    saveUsername(
      { username: usernameInputValue },
      {
        onSuccess() {
          dispatch(setInitialUsername(usernameInputValue));
        },
        onError(e: any) {
          // show error
          Bugsnag.notify(e);
        },
      },
    );
  }

  return (
    <div>
      {userPlace && (
        <Container display="flex" direction="column" justify="center">
          <Text
            size={50}
            css={{
              textGradient: themeStyles.textGradient,
            }}
            weight="bold">
            Congratulations!
          </Text>
          <Text
            size={50}
            css={{
              textGradient: themeStyles.textGradient,
            }}
            weight="bold">
            You&apos;re in the {placeMap[userPlace]} place!
          </Text>
          <Text
            size={50}
            css={{
              textGradient: themeStyles.textGradient,
            }}
            weight="bold">
            👍
          </Text>
          <Spacer y={2} />
        </Container>
      )}
      {data && (
        <>
          <Text
            h2
            size={40}
            css={{
              textGradient: themeStyles.textGradient,
            }}
            weight="bold">
            Total results
          </Text>
          <Spacer y={2} />
          <ReactEChartsCore
            echarts={echarts}
            option={totalOptions}
            notMerge={true}
            lazyUpdate={true}
            theme="dark"
            style={{ height: '600px' }}
            opts={{
              width: 800,
              height: 600,
            }}
          />
          <Spacer y={3} />
          <ReactEChartsCore
            echarts={echarts}
            option={detailedOption}
            notMerge={true}
            lazyUpdate={true}
            theme="dark"
            style={{ height: '1200px' }}
            opts={{
              width: 800,
              height: 1200,
            }}
            onEvents={{
              click(event: any) {
                const params =
                  'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1278,height=646,left=0,top=0';
                const screenData = screenMapping[event.data.name];

                open(
                  `${IMAGE_HOST}${screenData.imageSrc}`,
                  screenData.title,
                  params,
                );
              },
            }}
          />
          <Spacer y={5} />
        </>
      )}
      {individualData && (
        <>
          <Row align="flex-end" justify="flex-start" wrap="wrap">
            <Text
              h2
              size={36}
              css={{
                textGradient: themeStyles.textGradient,
                flexShrink: 0,
                marginRight: 5,
              }}
              weight="bold">
              Your results,{' '}
            </Text>
            <form
              onSubmit={handleNameFormSubmit}
              noValidate={true}
              style={{ flex: 1, minWidth: 280 }}>
              <Input
                aria-label="Provide your username"
                autoComplete="name"
                name="username"
                value={usernameInputValue}
                fullWidth={true}
                status="secondary"
                size="xl"
                contentRightStyling={false}
                contentRight={
                  isUsernameInputButtonShown && (
                    <Button
                      auto={true}
                      color="primary"
                      type="submit"
                      icon={
                        isSaveUsernameLoading ? (
                          <Loading color="currentColor" size="sm" />
                        ) : (
                          <HiCheck size={30} />
                        )
                      }
                      css={{ minWidth: 0 }}
                    />
                  )
                }
                onChange={handleUsernameInputChange}
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  paddingBottom: 2,
                }}
              />
            </form>
          </Row>
          <Spacer y={isMobileWidth ? 1 : 2} />
          <ReactEChartsCore
            echarts={echarts}
            option={totalIndividualOptions}
            notMerge={true}
            lazyUpdate={true}
            theme="dark"
            style={{ height: isMobileWidth ? '400px' : '600px', width: '100%' }}
          />
          <Spacer y={isMobileWidth ? 1 : 3} />
          <Collapse.Group splitted={true} style={{ padding: 0 }}>
            {preparedIndividualDetailedData.map((item) => (
              <Collapse
                key={item.name}
                onChange={() => handleCollapseChange(item.name)}
                title={
                  <Text
                    size={isMobileWidth ? 18 : 24}
                    weight="bold"
                    color={itemStyles[item.status]}>
                    {itemSymbols[item.status]} {item.name}
                  </Text>
                }>
                {shownImages.includes(item.name) &&
                  (isMobileWidth ? (
                    <DynamicInnerImageZoom
                      src={IMAGE_HOST + item.imageSrc}
                      zoomScale={0.5}
                      imgAttributes={{ alt: item.name }}
                      hasSpacer={true}
                    />
                  ) : (
                    <DynamicZoom zoomMargin={50}>
                      <div>
                        <img
                          src={IMAGE_HOST + item.imageSrc}
                          alt={item.name}
                          width="100%"
                        />
                      </div>
                    </DynamicZoom>
                  ))}
              </Collapse>
            ))}
          </Collapse.Group>
        </>
      )}
      {topUsersData && (
        <>
          <Text
            h2
            size={40}
            css={{
              textGradient: themeStyles.textGradient,
            }}
            weight="bold">
            Top results
          </Text>
          <Spacer y={2} />
          {topUsersData.map((data, index) => {
            const totalIndividualValues = prepareTotalValues(data);
            const totalIndividualSum = prepareTotalSum(totalIndividualValues);
            const preparedIndividualOverallData = prepareOverallData(
              totalIndividualValues,
              totalIndividualSum,
            );
            const totalIndividualOptions = prepareTotalOptions(
              preparedIndividualOverallData,
            );

            return (
              <div key={index}>
                <Text size={30} weight="bold">
                  {index + 1}
                </Text>
                <ReactEChartsCore
                  echarts={echarts}
                  option={totalIndividualOptions}
                  notMerge={true}
                  lazyUpdate={true}
                  theme="dark"
                  style={{ height: '600px' }}
                  opts={{
                    width: 800,
                    height: 600,
                  }}
                />
                <Spacer y={1} />
              </div>
            );
          })}
          <Spacer y={5} />
        </>
      )}
    </div>
  );
};

export default Analytics;
