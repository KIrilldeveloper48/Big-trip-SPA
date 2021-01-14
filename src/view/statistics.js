import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import SmartView from "./smart";

import {getTypesUniq, getChartsData} from "../utils/statistics";
import {CHART_DATA_TYPE, ChartSymbols, ChartBarProperties, ChartLabelProperties, ChartTitleProperties, ChartStatTypeProperties} from './../const';


const {MONEY: moneySymbol, TYPE: typeSymbol, TIME_SPEND: timeSpendSymbol} = ChartSymbols;
const {BAR_TYPE: barType, BAR_BG: barBg, BAR_HOVER_BG: barHoverBg, BAR_ANCHOR: barAnchor, BAR_THICKNESS: barThickness, BAR_HEIGHT: barHeight, BAR_LENGTH_MIN: minBarLength} = ChartBarProperties;
const {LABEL_SIZE: labelSize, LABEL_COLOR: labelColor, LABEL_ANCHOR: labelAnchor, LABEL_ALIGN: labelAlign} = ChartLabelProperties;
const {TITLE_COLOR: titleColor, TITLE_SIZE: titleSize, TITLE_POSITION: titlePosition} = ChartTitleProperties;
const {TYPE_COLOR: typeColor, TYPE_SIZE: typeSize, TYPE_PADDING: typePadding} = ChartStatTypeProperties;

const renderChart = (ctx, chartType, typeList, data, prefix, suffix = ``) => {
  ctx.height = barHeight * (typeList.length - 1);
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: barType,
    data: {
      labels: typeList,
      datasets: [{
        data,
        backgroundColor: barBg,
        hoverBackgroundColor: barHoverBg,
        anchor: barAnchor
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: labelSize
          },
          color: labelColor,
          anchor: labelAnchor,
          align: labelAlign,
          formatter: (val) => `${suffix}${val}${prefix}`
        }
      },
      title: {
        display: true,
        text: chartType,
        fontColor: titleColor,
        fontSize: titleSize,
        position: titlePosition
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: typeColor,
            padding: typePadding,
            fontSize: typeSize,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength,
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>

            <div class="statistics__item statistics__item--money">
              <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--transport">
              <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--time-spend">
              <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
            </div>
          </section>`;
};

class Statistics extends SmartView {
  constructor(serverData) {
    super();
    this._data = serverData;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
    this._typesUniq = getTypesUniq(this._data);
    this._chartsData = getChartsData(this._typesUniq, this._data);

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._removeCharts();
    }
  }

  _removeCharts() {
    this._moneyChart.destroy();
    this._typeChart.destroy();
    this._timeSpendChart.destroy();
    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._removeCharts();
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderChart(moneyCtx, [CHART_DATA_TYPE.MONEY], this._typesUniq, this._chartsData[CHART_DATA_TYPE.MONEY], ``, moneySymbol);
    this._typeChart = renderChart(typeCtx, [CHART_DATA_TYPE.TYPE], this._typesUniq, this._chartsData[CHART_DATA_TYPE.TYPE], typeSymbol);
    this._timeSpendChart = renderChart(timeSpendCtx, [CHART_DATA_TYPE.TIME_SPEND], this._typesUniq, this._chartsData[CHART_DATA_TYPE.TIME_SPEND], timeSpendSymbol);
  }
}

export default Statistics;
