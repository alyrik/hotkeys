import React from 'react';
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
import { Collapse, Container, Spacer, Text } from '@nextui-org/react';

import { AnalyticsData } from '../../models/AnalyticsData';
import { EChartsOption } from 'echarts-for-react/src/types';
import { FormValue } from '../../models/FormValue';
import { IMAGE_HOST, screenMapping } from '../../config/config';
import Zoom from 'react-medium-image-zoom';

interface IAnalyticsProps {
  data: AnalyticsData;
  individualData: AnalyticsData | null;
  topUsersData: AnalyticsData[] | null;
  userPlace: number | null;
}

interface ITotalValues {
  [FormValue.Always]: number;
  [FormValue.Sometimes]: number;
  [FormValue.Never]: number;
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

const getPercent = (count: number, total: number) =>
  Math.round((count / total) * 100);

const valueFormatter = (value: number) => `${value}%`;

const generateTotalValuesTemplate = () => ({
  [FormValue.Always]: 0,
  [FormValue.Sometimes]: 0,
  [FormValue.Never]: 0,
});

const prepareTotalValues = (data: AnalyticsData | null) => {
  if (!data) return generateTotalValuesTemplate();

  return Object.entries(data).reduce(
    (result, [key, value]) => {
      result[FormValue.Always] += value[FormValue.Always];
      result[FormValue.Sometimes] += value[FormValue.Sometimes];
      result[FormValue.Never] += value[FormValue.Never];

      return result;
    },
    {
      [FormValue.Always]: 0,
      [FormValue.Sometimes]: 0,
      [FormValue.Never]: 0,
    },
  );
};

const prepareTotalSum = (values: ITotalValues) =>
  values[FormValue.Always] +
  values[FormValue.Sometimes] +
  values[FormValue.Never];

const prepareOverallData = (totalValues: ITotalValues, totalSum: number) => [
  {
    value: getPercent(totalValues[FormValue.Always], totalSum),
    name: itemNames[FormValue.Always],
    itemStyle: { color: itemStyles[FormValue.Always] },
    tooltip: {
      valueFormatter,
    },
  },
  {
    value: getPercent(totalValues[FormValue.Sometimes], totalSum),
    name: itemNames[FormValue.Sometimes],
    itemStyle: { color: itemStyles[FormValue.Sometimes] },
    tooltip: {
      valueFormatter,
    },
  },
  {
    value: getPercent(totalValues[FormValue.Never], totalSum),
    name: itemNames[FormValue.Never],
    itemStyle: { color: itemStyles[FormValue.Never] },
    tooltip: {
      valueFormatter,
    },
  },
];

const prepareTotalOptions = (
  data: ReturnType<typeof prepareOverallData>,
): EChartsOption => ({
  textStyle: {
    fontSize: 16,
  },
  title: {
    text: 'Overall usage of IDE functionality via hotkeys',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
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
}) => {
  const totalValues = prepareTotalValues(data);
  const totalIndividualValues = prepareTotalValues(individualData);
  const totalSum = prepareTotalSum(totalValues);
  const totalIndividualSum = prepareTotalSum(totalIndividualValues);

  const preparedOverallData = prepareOverallData(totalValues, totalSum);
  const preparedIndividualOverallData = prepareOverallData(
    totalIndividualValues,
    totalIndividualSum,
  );

  const preparedDetailedData = Object.entries(data).reduce<
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
  preparedDetailedData
    .sort(
      (prev, next) =>
        next.values[FormValue.Never].raw - prev.values[FormValue.Never].raw,
    )
    .sort(
      (prev, next) =>
        prev.values[FormValue.Always].raw - next.values[FormValue.Always].raw,
    );

  const preparedIndividualDetailedData = Object.entries(
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

  // TODO: use filter and concat instead of sort?
  preparedIndividualDetailedData
    .sort((prev, next) => (next.status === FormValue.Sometimes ? -1 : 1))
    .sort((prev, next) => (next.status === FormValue.Always ? -1 : 1));

  const totalOptions = prepareTotalOptions(preparedOverallData);
  const totalIndividualOptions = prepareTotalOptions(
    preparedIndividualOverallData,
  );
  const detailedOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
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
          valueFormatter,
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
          valueFormatter,
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
          valueFormatter,
        },
        data: preparedDetailedData.map((item) => ({
          name: item.values[FormValue.Never].id,
          value: item.values[FormValue.Never].raw,
        })),
      },
    ],
  };

  return (
    <div>
      {/* TODO: render user place */}
      {userPlace && (
        <Container display="flex" direction="column" justify="center">
          <Text
            size={50}
            css={{
              textGradient: '45deg, #f3ec78 -20%, #af4261 50%',
              letterSpacing: '$normal',
            }}
            weight="bold">
            Congratulations!
          </Text>
          <Text
            size={50}
            css={{
              textGradient: '45deg, #f3ec78 -20%, #af4261 50%',
              letterSpacing: '$normal',
            }}
            weight="bold">
            You&apos;re in the {placeMap[userPlace]} place!
          </Text>
          <Text
            size={50}
            css={{
              textGradient: '45deg, #f3ec78 -20%, #af4261 50%',
              letterSpacing: '$normal',
            }}
            weight="bold">
            👍
          </Text>
          <Spacer y={2} />
        </Container>
      )}
      <Text
        h2
        size={40}
        css={{
          textGradient: '45deg, $blue500 -20%, $pink500 50%',
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
          legendselectchanged(event: any) {
            // TODO: Sort if only one item is selected
            console.log('changed', event);
          },
        }}
      />
      {individualData && (
        <>
          <Spacer y={5} />
          <Text
            h2
            size={40}
            css={{
              textGradient: '45deg, $blue500 -20%, $pink500 50%',
            }}
            weight="bold">
            Your results
          </Text>
          <Spacer y={2} />
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
          <Spacer y={3} />
          <Collapse.Group splitted={true} style={{ padding: 0 }}>
            {preparedIndividualDetailedData.map((item) => (
              <Collapse
                key={item.name}
                title={
                  <Text size={24} weight="bold" color={itemStyles[item.status]}>
                    {itemSymbols[item.status]} {item.name}
                  </Text>
                }>
                <Zoom
                  overlayBgColorStart="rgba(0, 0, 0, 0)"
                  overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
                  zoomMargin={50}>
                  <div>
                    <img
                      src={IMAGE_HOST + item.imageSrc}
                      alt={item.name}
                      width="100%"
                    />
                  </div>
                </Zoom>
              </Collapse>
            ))}
          </Collapse.Group>
        </>
      )}
      {topUsersData && (
        <>
          <Spacer y={5} />
          <Text
            h2
            size={40}
            css={{
              textGradient: '45deg, $blue500 -20%, $pink500 50%',
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
        </>
      )}
    </div>
  );
};

export default Analytics;
