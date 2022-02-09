import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
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

import { AnalyticsData } from '../../models/AnalyticsData';
import { Spacer } from '@nextui-org/react';
import { EChartsOption } from 'echarts-for-react/src/types';
import { FormValue } from '../../models/FormValue';
import { screenMapping } from '../../config/config';

interface IAnalyticsProps {
  data: AnalyticsData;
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

const Analytics: React.FC<IAnalyticsProps> = ({ data }) => {
  const totalValues = Object.entries(data).reduce(
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
  const sum =
    totalValues[FormValue.Always] +
    totalValues[FormValue.Sometimes] +
    totalValues[FormValue.Never];

  const preparedOverallData = [
    {
      value: getPercent(totalValues[FormValue.Always], sum),
      name: itemNames[FormValue.Always],
      itemStyle: { color: itemStyles[FormValue.Always] },
      tooltip: {
        valueFormatter,
      },
    },
    {
      value: getPercent(totalValues[FormValue.Sometimes], sum),
      name: itemNames[FormValue.Sometimes],
      itemStyle: { color: itemStyles[FormValue.Sometimes] },
      tooltip: {
        valueFormatter,
      },
    },
    {
      value: getPercent(totalValues[FormValue.Never], sum),
      name: itemNames[FormValue.Never],
      itemStyle: { color: itemStyles[FormValue.Never] },
      tooltip: {
        valueFormatter,
      },
    },
  ];

  const preparedDetailedData = Object.entries(data).reduce<
    {
      name: string;
      values: { [key: string]: { raw: number; formatted: string } };
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
          formatted: `${alwaysValue}%`,
        },
        [FormValue.Sometimes]: {
          raw: sometimesValue,
          formatted: `${sometimesValue}%`,
        },
        [FormValue.Never]: {
          raw: neverValue,
          formatted: `${neverValue}%`,
        },
      },
    });

    return result;
  }, []);
  preparedDetailedData.sort((prev, next) => {
    return (
      prev.values[FormValue.Always].raw - next.values[FormValue.Always].raw
    );
  });
  console.log('PREPARED DETAILED DATA', preparedDetailedData);

  const totalOptions: EChartsOption = {
    textStyle: {
      fontSize: 16,
    },
    title: {
      text: 'Overall usage of IDE functions via hotkeys',
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
        data: preparedOverallData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  const detailedOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
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
          name: `${item.values[FormValue.Always].raw}%`,
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
        data: preparedDetailedData.map(
          (item) => item.values[FormValue.Sometimes].raw,
        ),
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
        data: preparedDetailedData.map(
          (item) => item.values[FormValue.Never].raw,
        ),
      },
    ],
  };

  // TODO: render personal report

  return (
    <div>
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
      <Spacer y={5} />
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
            // TODO: Opem modal (?) with clicked GIF
            console.log('CLICK EVENT', event);
          },
          legendselectchanged(event: any) {
            // TODO: Sort if only one item is selected
            console.log('changed', event);
          },
        }}
      />
    </div>
  );
};

export default Analytics;
