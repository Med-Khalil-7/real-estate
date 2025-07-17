import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import DatePicker from "react-datepicker";
import {Bar, Chart, Doughnut, Line} from 'react-chartjs-2';

import {Form} from 'react-bootstrap';
import format from 'date-fns/format'
import api from "../../../../api";
import {CONTRACT_PROFIT} from "../../../../constants/api";


function Profit({contractId}) {
  const {t} = useTranslation();

  const [profit, setProfit] = useState({});
  const today = new Date()
  const [startDate, setStartDate] = useState(today.setMonth(today.getMonth() - 3));
  const [endDate, setEndDate] = useState(new Date());
  const [totalExpencesData, setTotalExpencesData] = useState({});
  const [totalProfitData, setTotalProfitData] = useState({});
  const [deviceSaleData, setDeviceSaleData] = useState({});
  const [invoiceOwed, setInvoiceOwed] = useState({});
  const [billOwed, setBillOwed] = useState({});
  /* formatted date */
  const start = format(startDate, "yyyy-MM")
  const end = format(endDate, "yyyy-MM")

  /* chart options */
  const deviceSaleOptions = {
    scales: {
      xAxes: [{
        stacked: false, barPercentage: 0.5, categoryPercentage: 0.4, position: "bottom", display: true, gridLines: {
          display: false, drawBorder: false, drawTicks: false
        }, ticks: {
          display: true, //this will remove only the label
          stepSize: 500, fontColor: "#a7afb7", fontSize: 14, padding: 10
        }
      }], yAxes: [{
        stacked: false, display: true, gridLines: {
          drawBorder: false, display: true, color: "#eef0fa", drawTicks: false, zeroLineColor: "rgba(90, 113, 208, 0)"
        }, ticks: {
          display: true,
          beginAtZero: true,
          stepSize: 200,
          fontColor: "#a7afb7",
          fontSize: 14,
          callback: function (value, index, values) {
            return value + "k";
          }
        }
      }]
    }, legend: {
      display: false
    }, tooltips: {
      backgroundColor: "rgba(0, 0, 0, 1)"
    }, plugins: {
      datalabels: {
        display: false, align: "center", anchor: "center"
      }
    }
  };
  const totalProfitOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: false
        }
      }],
      xAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0.4
      }
    },
    stepsize: 10
  };

  const pieOptions = {
    legend: {
      display: false,
    },
    borderRadius: 7,
    cutout: 100,
  }

  /**
   * fetch profit data and render charts
   * @returns {Promise<void>}
   */
  const fetchProfit = async () => {
    try {
      /*gradient colors*/
      let myCanvas = document.getElementById('device-bar');
      let ctx = myCanvas.getContext('2d');
      let gradientSale = ctx.createLinearGradient(0, 0, 0, 300)
      gradientSale.addColorStop(0, "rgb(133, 10, 255)");
      gradientSale.addColorStop(0.6195986991271378, "rgb(202, 159, 246)");
      gradientSale.addColorStop(1, "rgb(224, 192, 255)");
      gradientSale.addColorStop(1, "rgb(224, 193, 255)");

      let gradientExpense = ctx.createLinearGradient(0, 0, 0, 300)
      gradientExpense.addColorStop(0, "rgb(255, 151, 0)");
      gradientExpense.addColorStop(0.6195986991271378, "rgb(255, 221, 171)");
      gradientExpense.addColorStop(1, "rgb(249, 232, 205)");
      gradientExpense.addColorStop(1, "rgb(249, 232, 206)");


      let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
      Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
        draw: function () {
          originalDoughnutDraw.apply(this, arguments);

          const chart = this.chart.chart;
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;

          const fontSize = (height / 190).toFixed(2);
          ctx.font = fontSize + "em Nunito";
          ctx.fillStyle = "#00000";
          ctx.textBaseline = "middle";

          const text = chart.config.data.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

          ctx.fillText("", "", "");
          ctx.save();
        }
      });

      const {data} = await api.get(`${CONTRACT_PROFIT.replace("{contractId}", contractId)}`, {
        params: {
          contract_id: contractId,
          start_date: start,
          end_date: end,
        },
      });
      setProfit(data)

      const dates = data.summaries.map((s) => {
        return s.date
      })
      const profits = data.summaries.map((s) => {
        return s.summary.net_profit
      })

      const sales = data.summaries.map((s) => {
        return s.summary.sales_amount
      })
      const expenses = data.summaries.map((s) => {
        return s.summary.expenses_amount
      })

      const {sales_amount} = data.total_summary
      const {expenses_amount} = data.total_summary
      const {unpaid_sales} = data.unpaid_sales
      const {unpaid_expenses} = data.unpaid_sales

      const invoiceTotalOwed = {
        labels: [
          'Paid',
          'Owed',

        ],
        datasets: [{
          data: [sales_amount, unpaid_sales],
          backgroundColor: [
            gradientSale,
            gradientExpense,

          ],
          hoverOffset: 4
        }],
        text: `${unpaid_sales} owed`
      };
      setInvoiceOwed(invoiceTotalOwed)
      const billTotalOwed = {
        labels: [
          'Paid',
          'Owed',

        ],
        datasets: [{
          borderRadius: 7,
          cutout: 100,
          label: 'My First Dataset',
          data: [expenses_amount, unpaid_expenses],
          backgroundColor: [
            gradientSale,
            gradientExpense,

          ],
          hoverOffset: 4
        }],
        text: `${unpaid_expenses} owed`
      };
      setBillOwed(billTotalOwed)

      const totalExpenses = {
        labels: dates,
        datasets: [{
          label: "Expenses",
          data: expenses,
          backgroundColor: [
            'rgba(255, 178, 66, .1)',
          ],
          borderColor: [
            '#ffc542',
          ],
          borderWidth: 2,
          fill: true
        }]
      };
      setTotalExpencesData(totalExpenses)

      const totalProfits = {
        labels: dates,
        datasets: [{
          label: "Profit",
          data: profits,
          backgroundColor: [
            'rgba(182, 109, 255, .1 )',
          ],
          borderColor: [
            '#b66dff',
          ],
          borderWidth: 2,
          fill: true
        }]
      };

      setTotalProfitData(totalProfits)

      const deviceSaleData = {
        labels: dates, datasets: [{
          label: "Sales",
          data: sales,
          backgroundColor: gradientSale,
          borderWidth: 0.3,

          fill: true
        }, {
          label: "expenses",
          data: expenses,
          backgroundColor: gradientExpense,

          borderWidth: 0.3,
          fill: true
        }]
      };
      setDeviceSaleData(deviceSaleData)

    } catch (e) {
      console.error("Failed to fetch data", e)
    }
  }

  /**
   * side effects
   */

  useEffect(() => {
    fetchProfit().then()
  }, []);

  useEffect(() => {
    fetchProfit().then()
  }, [start, end]);


  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="card-title">{t("Profit and loss")}</h4>
          </div>
          <form className="row form-inline d-flex px-1 justify-content-end">
            <Form.Group>
              <DatePicker
                placeholderText="Select start date"
                className="form-control mx-2"
                dateFormat="yyyy-MM"
                showMonthYearPicker
                showFullMonthYearPicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Form.Group>
            <Form.Group>
              <DatePicker
                placeholderText="Select end date"
                className="form-control"
                dateFormat="yyyy-MM"
                showMonthYearPicker
                showFullMonthYearPicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </Form.Group>
          </form>
          <div className="row mt-2 ">
            <div className="col-md-12 px-1">
              <div className="d-flex flex-column justify-content-between dotted-border">

                <div className="card-body ">
                  <p className="text-dark">{t("Profits")}</p>
                  <div className="d-flex align-items-center">
                    <h4 className="font-weight-semibold text-dark"> {profit?.total_summary?.net_profit}</h4>
                    {profit?.indexes?.profit_index > 0 && (
                      <h6 className="text-success font-weight-semibold mx-2">{profit?.indexes?.profit_index}</h6>)}
                    {profit?.indexes?.profit_index < 0 && (
                      <h6 className="text-danger font-weight-semibold mx-2">{profit?.indexes?.profit_index}</h6>)}
                    {profit?.indexes?.profit_index == 0 && (
                      <h6 className=" font-weight-semibold mx-2">{profit?.indexes?.profit_index}</h6>)}
                  </div>
                </div>
                <div className="graph-wrapper">
                  <Line data={totalProfitData} options={totalProfitOptions}/>
                </div>
                <div className="dotted-border">
                <div className="card-body pb-0">
                  <p className="text-dark">Expenses</p>
                  <div className="d-flex align-items-center">
                    <h4 className="font-weight-semibold text-dark"> {profit?.total_summary?.expenses_amount}</h4>
                    {profit?.indexes?.expenses_index > 0 && (
                      <h6 className="text-success font-weight-semibold ml-2">{profit?.indexes?.expenses_index}</h6>)}
                    {profit?.indexes?.expenses_index < 0 && (
                      <h6 className="text-danger font-weight-semibold ml-2">{profit?.indexes?.expenses_index}</h6>)}
                    {profit?.indexes?.expenses_index == 0 && (
                      <h6 className=" font-weight-semibold ml-2">{profit?.indexes?.expenses_index}</h6>)}
                  </div>
                </div>
                <div className="graph-wrapper">
                  <Line data={totalExpencesData} options={totalProfitOptions}/>
                </div>
              </div>

              </div>
            </div>
          </div>

          <div className="row mt-2 d-flex ">
            <div className="col-md-5  d-flex px-1 flex-column justify-content-between">
              <div className="pl-0 pl-lg-4 p-3 dotted-border ">
                <div className="d-xl-flex justify-content-between align-items-center mb-2">
                  <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                    <h3 className="text-dark font-weight-bold mr-2 mb-0">
                      {t("Invoices owed and paid")}
                    </h3>
                  </div>
                  <div className="d-lg-flex">
                    <p className="mr-2 mb-0">{t("Timezone:")}</p>
                    <p className="text-dark font-weight-bold mb-0"></p>
                  </div>
                </div>
                <div
                  id="visit-sale-chart-legend"
                  className="legend-top-right float-right"
                >
                  <ul className="legend-horizontal">
                    <li>
                      <span className="legend-dots bg-info"></span>
                      {t("Paid")}
                    </li>
                    <li>
                      <span className="legend-dots bg-yellow"></span>
                      {t("Owed")}
                    </li>
                  </ul>
                </div>
                <Doughnut
                  height={131}
                  data={invoiceOwed}
                  options={pieOptions}
                />

              </div>
            </div>
            <div className="col-md-7 px-1">
              <div className="grid-margin p-3 dotted-border ">
                <div className="pl-0 pl-lg-4 ">
                  <div className="d-xl-flex justify-content-between align-items-center mb-2">
                    <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                      <h3 className="text-dark font-weight-bold mr-2 mb-0">
                        {t("Balance")}
                      </h3>
                    </div>
                    <div className="d-lg-flex">
                      <p className="mr-2 mb-0">{t("Timezone:")}</p>
                      <p className="text-dark font-weight-bold mb-0"></p>
                    </div>
                  </div>
                  <div
                    id="visit-sale-chart-legend"
                    className="legend-top-right float-right"
                  >
                    <ul className="legend-horizontal">
                      <li>
                        <span className="legend-dots bg-info"></span>
                        {t("Sales")}
                      </li>
                      <li>
                        <span className="legend-dots bg-yellow"></span>
                        {t("Expenses")}
                      </li>
                    </ul>
                  </div>
                  <Bar
                    id="device-bar"
                    height={92}
                    data={deviceSaleData}
                    options={deviceSaleOptions}
                  />
                </div>
              </div>
            </div>
          </div>
          {/*bill accounting stats are disabled*/}
          {/*<div className="row mt-2">
            <div className="col-lg-12 grid-margin  p-3 dotted-border grid-margin-lg-0">
              <div className="pl-0 pl-lg-4 ">
                <div className="d-xl-flex justify-content-between align-items-center mb-2">
                  <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                    <h3 className="text-dark font-weight-bold mr-2 mb-0">
                      {t("Balance")}
                    </h3>
                  </div>
                  <div className="d-lg-flex">
                    <p className="mr-2 mb-0">{t("Timezone:")}</p>
                    <p className="text-dark font-weight-bold mb-0"></p>
                  </div>
                </div>
                <div
                  id="visit-sale-chart-legend"
                  className="legend-top-right float-right"
                >
                  <ul className="legend-horizontal">
                    <li>
                      <span className="legend-dots bg-info"></span>
                      {t("Sales")}
                    </li>
                    <li>
                      <span className="legend-dots bg-yellow"></span>
                      {t("Expenses")}
                    </li>
                  </ul>
                </div>
                <Bar
                  id="device-bar"
                  height={92}
                  data={deviceSaleData}
                  options={deviceSaleOptions}
                />
              </div>
            </div>
          </div>
         <div className="row mt-2">
            <div className="col-md-12  d-flex justify-content-between">
              <div className="col-md-6 mr-2 dotted-border">
                <div className="pl-0 pl-lg-4 p-3 ">
                  <div className="d-xl-flex justify-content-between align-items-center mb-2">
                    <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                      <h3 className="text-dark font-weight-bold mr-2 mb-0">
                        {t("Invoices owed and paid")}
                      </h3>
                    </div>
                    <div className="d-lg-flex">
                      <p className="mr-2 mb-0">{t("Timezone:")}</p>
                      <p className="text-dark font-weight-bold mb-0"></p>
                    </div>
                  </div>
                  <div
                    id="visit-sale-chart-legend"
                    className="legend-top-right float-right"
                  >
                    <ul className="legend-horizontal">
                      <li>
                        <span className="legend-dots bg-info"></span>
                        {t("Paid")}
                      </li>
                      <li>
                        <span className="legend-dots bg-yellow"></span>
                        {t("Owed")}
                      </li>
                    </ul>
                  </div>
                  <Doughnut
                    height={150}
                    data={invoiceOwed}
                    options={pieOptions}
                  />

                </div>
              </div>
              <div className="col-md-6 mr-2 dotted-border">
                <div className="pl-0 pl-lg-4 p-3 ">
                  <div className="d-xl-flex justify-content-between align-items-center mb-2">
                    <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                      <h3 className="text-dark font-weight-bold mr-2 mb-0">
                        {t("Bills owed and paid")}
                      </h3>
                    </div>
                  </div>
                  <div
                    id="visit-sale-chart-legend"
                    className="legend-top-right float-right"
                  >
                    <ul className="legend-horizontal">
                      <li>
                        <span className="legend-dots bg-info"></span>
                        {t("Paid")}
                      </li>
                      <li>
                        <span className="legend-dots bg-yellow"></span>
                        {t("Owed")}
                      </li>
                    </ul>
                  </div>
                  <Doughnut
                    height={150}
                    data={billOwed}
                    options={pieOptions}
                  />
                </div>
              </div>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default Profit;
