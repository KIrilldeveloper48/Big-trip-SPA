import SmartView from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {BAR_HEIGHT, CHART_DATA_TYPE, ChartSymbols} from './../const';
import {getTypesUniq, getChartsData} from "../utils/statistics";

const {MONEY: moneySymbol, TYPE: typeSymbol, TIME_SPEND: timeSpendSymbol} = ChartSymbols;

const renderChart = (ctx, chartType, typeList, data, prefix, suffix = ``) => {
  ctx.height = BAR_HEIGHT * (typeList.length - 1);
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: typeList,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${suffix}${val}${prefix}`
        }
      },
      title: {
        display: true,
        text: chartType,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
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
          minBarLength: 50
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
