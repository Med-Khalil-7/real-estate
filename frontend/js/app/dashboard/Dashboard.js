import React, { useEffect, useState } from "react";
import { Dropdown, ProgressBar, Tab, Tabs } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import api from "../../api";
import {
  DASHBAORD,
  PROPERTY_CONTRACTS,
  CONTRACT_PDF_TEMPLATE
} from "../../constants/api";
import { formatDistance } from "date-fns";
import { useTranslation } from "react-i18next";
import Profit from "../contracts/property-contracts/accounting/Profit";
import Select from "react-select";
import { format } from "date-fns";
import usePermission from "../hooks/usePermission";
import { Link } from "react-router-dom";

export default function Dashboard() {
  /* Default dash stuff */
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { is_superuser, is_landlord, is_tenant, permissions } = usePermission();
  const [saleOptions, setSaleOptions] = useState({
    scales: {
      yAxes: [
        {
          display: false,
          gridLines: {
            drawBorder: false,
            display: false,
            drawTicks: false
          },
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ],
      xAxes: [
        {
          display: false,
          position: "bottom",
          gridLines: {
            drawBorder: false,
            display: false,
            drawTicks: false
          },
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ]
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
    tooltips: {
      backgroundColor: "rgba(2, 171, 254, 1)"
    }
  });
  const [salespredictionData, setSalespredictionData] = useState({});
  const [salesprediction2Data, setSalesprediction2Data] = useState({});
  const [salesprediction3Data, setSalesprediction3Data] = useState({});
  const [salesprediction4Data, setSalesprediction4Data] = useState({});
  /* Contract stats data */
  const [dashboardData, setDashboardData] = useState({});

  const fetchDashData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(DASHBAORD);
      console.log(data);
      setDashboardData(data);
    } catch (err) {
      toast.error(err.response.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashData();
    var gradient1 = document.getElementById("prediction1").getContext("2d");
    var gradientBg1 = gradient1.createLinearGradient(0, 0, 0, 181);
    gradientBg1.addColorStop(0, "rgba(164,97,216, 1)");
    gradientBg1.addColorStop(1, "rgba(255, 255, 255, 0.27)");

    var gradient2 = document.getElementById("prediction2").getContext("2d");
    var gradientBg2 = gradient2.createLinearGradient(25, 0, 25, 80);
    gradientBg2.addColorStop(0, "rgba(164,97,216, 1)");
    gradientBg2.addColorStop(1, "rgba(255, 255, 255, 0.27)");

    var gradient3 = document.getElementById("prediction3").getContext("2d");
    var gradientBg3 = gradient3.createLinearGradient(25, 0, 25, 80);
    gradientBg3.addColorStop(0, "#0062ff");
    gradientBg3.addColorStop(1, "rgba(255, 255, 255, 0.27)");

    var gradient4 = document.getElementById("prediction4").getContext("2d");
    var gradientBg4 = gradient4.createLinearGradient(25, 0, 25, 80);
    gradientBg4.addColorStop(0, "#0062ff");
    gradientBg4.addColorStop(1, "rgba(255, 255, 255, 0.27)");

    const newSalespredictionData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Margin",
          data: [5, 10, 6, 12, 7, 14, 16],
          backgroundColor: gradientBg1,
          borderColor: ["#a461d8"],
          borderWidth: 3,
          fill: true
        }
      ]
    };
    const newSalesprediction2Data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Margin",
          data: [16, 14, 7, 12, 6, 10, 5],
          backgroundColor: gradientBg2,
          borderColor: ["#a461d8"],
          borderWidth: 3,
          fill: true
        }
      ]
    };
    const newSalesprediction3Data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Margin",
          data: [3, 4, 2, 3, 1, 2, 3],
          backgroundColor: gradientBg3,
          borderColor: ["#0062ff"],
          borderWidth: 3,
          fill: true
        }
      ]
    };
    const newSalesprediction4Data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Margin",
          data: [3, 2, 1, 3, 2, 4, 3],
          backgroundColor: gradientBg4,
          borderColor: ["#0062ff"],
          borderWidth: 3,
          fill: true
        }
      ]
    };
    setSalespredictionData(newSalespredictionData);
    setSalesprediction2Data(newSalesprediction2Data);
    setSalesprediction3Data(newSalesprediction3Data);
    setSalesprediction4Data(newSalesprediction4Data);
  }, []);

  const totalProfitData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Margin",
        data: [5, 4, 6, 4.5, 5.5, 4, 5, 4.2, 5.5],
        backgroundColor: ["#cfe1ff"],
        borderColor: ["#0062ff"],
        borderWidth: 3,
        fill: true
      }
    ]
  };

  const totalProfitOptions = {
    scales: {
      yAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ],
      xAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0
      }
    }
  };
  const totalExpencesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Margin",
        data: [4, 5, 6, 5, 4, 5, 4, 6, 5],
        backgroundColor: ["#e1fff3"],
        borderColor: ["#3dd597"],
        borderWidth: 3,
        fill: true
      }
    ]
  };

  const totalExpencesOptions = {
    scales: {
      yAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ],
      xAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
            stepSize: 10
          }
        }
      ]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0
      }
    }
  };

  const deviceSaleData = {
    labels: [
      "Iphone",
      "Google",
      "Sumsung",
      "Huawei",
      "Xiaomi",
      "Oppo",
      "Vivo",
      "Lg"
    ],
    datasets: [
      {
        label: "Demand",
        data: [450, 500, 300, 350, 200, 320, 310, 700],
        backgroundColor: [
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8"
        ],
        borderColor: [
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8",
          "#a461d8"
        ],
        borderWidth: 1,
        fill: false
      },
      {
        label: "Supply",
        data: [250, 100, 310, 75, 290, 100, 500, 260],
        backgroundColor: [
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a"
        ],
        borderColor: [
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a",
          "#fc5a5a"
        ],
        borderWidth: 1,
        fill: false
      }
    ]
  };

  const deviceSaleOptions = {
    scales: {
      xAxes: [
        {
          stacked: false,
          barPercentage: 0.5,
          categoryPercentage: 0.4,
          position: "bottom",
          display: true,
          gridLines: {
            display: false,
            drawBorder: false,
            drawTicks: false
          },
          ticks: {
            display: true, //this will remove only the label
            stepSize: 500,
            fontColor: "#a7afb7",
            fontSize: 14,
            padding: 10
          }
        }
      ],
      yAxes: [
        {
          stacked: false,
          display: true,
          gridLines: {
            drawBorder: false,
            display: true,
            color: "#eef0fa",
            drawTicks: false,
            zeroLineColor: "rgba(90, 113, 208, 0)"
          },
          ticks: {
            display: true,
            beginAtZero: true,
            stepSize: 200,
            fontColor: "#a7afb7",
            fontSize: 14,
            callback: function(value, index, values) {
              return value + "k";
            }
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgba(0, 0, 0, 1)"
    },
    plugins: {
      datalabels: {
        display: false,
        align: "center",
        anchor: "center"
      }
    }
  };
  const accountRetensionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Demand",
        data: [33, 48, 39, 36, 36],
        backgroundColor: [
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8"
        ],
        borderColor: ["#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8"],
        borderWidth: 1,
        fill: false
      },
      {
        label: "Demand",
        data: [94, 28, 49, 25, 20],
        backgroundColor: [
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8"
        ],
        borderColor: ["#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8"],
        borderWidth: 1,
        fill: false
      },
      {
        label: "Demand",
        data: [66, 33, 25, 36, 69],
        backgroundColor: [
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8",
          "#d8d8d8"
        ],
        borderColor: ["#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8", "#d8d8d8"],
        borderWidth: 1,
        fill: false
      }
    ]
  };
  const accountRetensionOptions = {
    scales: {
      xAxes: [
        {
          stacked: false,
          position: "bottom",
          display: true,
          barPercentage: 0.7,
          categoryPercentage: 1,
          gridLines: {
            display: false,
            drawBorder: false,
            drawTicks: false
          },
          ticks: {
            display: true, //this will remove only the label
            stepSize: 500,
            fontColor: "#a7afb7",
            fontSize: 14,
            padding: 10
          }
        }
      ],
      yAxes: [
        {
          stacked: false,
          display: true,
          gridLines: {
            drawBorder: false,
            display: true,
            color: "#c31a56",
            drawTicks: false,
            zeroLineColor: "rgba(90, 113, 208, 0)"
          },
          ticks: {
            display: false,
            beginAtZero: true,
            stepSize: 40,
            fontColor: "#a7afb7",
            fontSize: 14,
            callback: function(value, index, values) {
              return value + "k";
            }
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgba(0, 0, 0, 1)"
    },
    plugins: {
      datalabels: {
        display: false,
        align: "center",
        anchor: "center"
      }
    }
  };
  const pageViewAnalyticData = {
    labels: [
      dashboardData?.daily_transaction_amount?.date
        ? dashboardData?.daily_transaction_amount?.date
        : []
    ],
    datasets: [
      {
        label: "deposit",
        data: dashboardData?.daily_transaction_amount?.deposit
          ? dashboardData?.daily_transaction_amount?.deposit
          : [],
        backgroundColor: ["rgba(216,247,234, 0.19)"],
        borderColor: ["#3dd597"],
        borderWidth: 2,
        fill: true,
        pointBorderColor: "#fff",
        pointBackgroundColor: "#3dd597",
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };
  const pageViewAnalyticOptions = {
    scales: {
      yAxes: [
        {
          display: true,
          gridLines: {
            drawBorder: false,
            display: true,
            drawTicks: false,
            color: "#eef0fa",
            zeroLineColor: "rgba(90, 113, 208, 0)"
          },
          ticks: {
            beginAtZero: true,
            stepSize: 50,
            display: true,
            padding: 10
          }
        }
      ],
      xAxes: [
        {
          display: true,
          position: "middle",
          gridLines: {
            drawBorder: false,
            display: false,
            drawTicks: false
          },
          ticks: {
            beginAtZero: true,
            stepSize: 10,
            fontColor: "#a7afb7",
            padding: 10
          }
        }
      ]
    },
    legend: {
      display: true
    },
    elements: {
      point: {
        radius: 1
      },
      line: {
        tension: 0
      }
    },
    tooltips: {
      backgroundColor: "rgba(2, 171, 254, 1)"
    }
  };
  const myBalanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Demand",
        data: [90, 85, 100, 105],
        backgroundColor: ["#0062ff", "#0062ff", "#0062ff", "#0062ff"],
        borderColor: ["#0062ff", "#0062ff", "#0062ff", "#0062ff"],
        borderWidth: 1,
        fill: false
      },
      {
        label: "Supply",
        data: [200, 200, 200, 200],
        backgroundColor: ["#eef0fa", "#eef0fa", "#eef0fa", "#eef0fa"],
        borderColor: ["#eef0fa", "#eef0fa", "#eef0fa", "#eef0fa"],
        borderWidth: 1,
        fill: false
      }
    ]
  };
  const myBalanceOptions = {
    scales: {
      xAxes: [
        {
          stacked: true,
          barPercentage: 0.7,
          position: "bottom",
          display: true,
          gridLines: {
            display: false,
            drawBorder: false,
            drawTicks: false
          },
          ticks: {
            display: true, //this will remove only the label
            stepSize: 500,
            fontColor: "#111",
            fontSize: 12,
            padding: 10
          }
        }
      ],
      yAxes: [
        {
          stacked: false,
          display: false,
          gridLines: {
            drawBorder: true,
            display: false,
            color: "#eef0fa",
            drawTicks: false,
            zeroLineColor: "rgba(90, 113, 208, 0)"
          },
          ticks: {
            display: true,
            beginAtZero: true,
            stepSize: 200,
            fontColor: "#a7afb7",
            fontSize: 14,
            callback: function(value, index, values) {
              return value + "k";
            }
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgba(0, 0, 0, 1)"
    },
    plugins: {
      datalabels: {
        display: false,
        align: "center",
        anchor: "center"
      }
    }
  };

  const percentage = (total, partial) => {
    return (100 * partial) / total;
  };

  const contractCard = contract => {
    return (
      <div className="card">
        <div className="card-body  recent-activity">
          <h4 className="card-title">{contract?.tenant?.name}</h4>
          <div className="d-lg-flex justify-content-between align-items-center">
            <h1 className="text-dark mb-0">
              {contract?.cashflows ? contract.cashflows[0]["balance"] : 0}
            </h1>
          </div>
          <p className="mb-3 pb-1">
            {t("Deposit:")}{" "}
            <span className="font-weight-bold">{contract.deposit}</span>
          </p>
          <div className="overflow-auto" style={{ height: "300px" }}>
            {contract.cashflows.map((transaction, index) => {
              return (
                <div
                  className="d-flex mb-3"
                  key={`contract-${contract.id}-cashflow-${index}`}
                >
                  <div>
                    <div className="activity-info bg-danger">
                      {transaction.description.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="activity-details">
                    <h4 className="text-dark font-weight-normal mb-1">
                      {t(transaction.description)}
                    </h4>
                    <p className="mb-1">{transaction.amount}</p>
                    <p className="text-small mb-0">
                      {formatDistance(new Date(transaction.date), new Date())}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const [selectedContractId, setSelectedContractId] = useState(null);
  const [contractData, setContractData] = useState(null);

  const handleContractChange = selectedOption => {
    setSelectedContractId(selectedOption.value);
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${PROPERTY_CONTRACTS}`);
      setContractData(response.data);
      // setSelectedContractId(response.data[response.data.length])
      setSelectedContractId(response.data[0].id);
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error?.response?.data?.detail);
      } else {
        toast.error("Error signing contract");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const contractOptions = contractData
    ? contractData.map(contract => ({
        value: contract.id,
        label: contract.id
      }))
    : [];

  const ContractCard = contract => {
    return (
      <div className="card rounded shadow-none border">
        <div className="card-body">
          <div className="mb-3">
            <div className="d-inline-flex align-items-center">
              {/* Contract Cashflow */}
              <div className="text-muted">
                
              </div>
              <div className="wrapper">
                <div className="d-flex align-items-center mb-2 mr-2">
                  <h3 className="mb-0 font-weight-medium text-dark ">
                    {contract?.tenant?.full_name}
                  </h3>
                </div>
                <div className="d-flex align-items-center font-weight-medium text-muted">
                  <i className="mdi mdi-map-marker-outline mr-2" />
                  <p className="mb-0 text-muted">{contract?.address}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3">
            {/* Contract Details */}
            <div className="d-flex align-items-center ">
              <p>
                <span className="text-dark">{t("Landlord")}</span> <br />
                <h4 className="font-weight-medium text-dark">{contract.landlord.full_name}</h4>
              </p>
            </div>
          </div>
          <div className="mb-3">
            {/* Start date */}
            <div className="d-flex align-items-center">
              <p>
                <span className="text-dark">{t("Start date")}</span> <br />
                <h4 className="font-weight-medium text-dark">{format(new Date(contract.start_date), "MM/dd/yyyy")}</h4>
              </p>
            </div>
          </div>
          <div className="mb-3">
            {/* End date */}
            <div className="d-flex align-items-center">
              <p>
                <span className="text-dark">{t("End date")}</span> <br />
                <h4 className="font-weight-medium text-dark">{format(new Date(contract.end_date), "MM/dd/yyyy")}</h4>
              </p>
            </div>
          </div>
          <div className="d-flex align-self-center">
            {/* Dropdown */}
            <div className="wrapper d-flex justify-content-end">
              <Dropdown>{/* Dropdown content */}</Dropdown>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-3 col-6">
              {/* Contract Status */}
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                {/* Contract status icons */}
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">{t("Status")}</p>
                  <div className="fluid-container">
                    <h3 className="mb-2 font-weight-medium text-dark">
                      {contract.state === "S" && t("Signed")}
                      {contract.state === "N" && t("Not signed")}
                      {contract.state === "T" && t("Terminated")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-3 col-6">
              {/* Contract Deposit */}
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">{t("Deposit")}</p>
                  <div className="fluid-container">
                    <h3 className="mb-2 font-weight-medium text-dark">
                      {contract.deposit}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-3 col-6">
              {/* Location Price */}
              <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                <div className="wrapper text-center text-sm-left">
                  <p className="card-text mb-0 text-dark">
                    {t("Location price")}
                  </p>
                  <div className="fluid-container">
                    <h3 className="mb-2 font-weight-medium text-dark">
                      {contract.location_price}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="d-sm-flex justify-content-between align-items-start">
          <h2 className="text-dark font-weight-bold mb-2">
            {" "}
            {t("Overview dashboard")}
          </h2>
          <div className="d-sm-flex justify-content-xl-between align-items-center mb-2">
            <div
              className="btn-group d-none d-xl-flex bg-white p-3"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-link text-light py-0 font-weight-medium border-right"
              >
                {t("7 Days")}
              </button>
              <button
                type="button"
                className="btn btn-link text-dark py-0 font-weight-medium border-right"
              >
                {t("1 Month")}
              </button>
              <button
                type="button"
                className="btn btn-link text-light font-weight-medium py-0"
              >
                {t("3 Month")}
              </button>
            </div>
            <div className="dropdown ml-0 ml-md-4 mt-2 mt-lg-0">
              <Dropdown alignRight>
                <Dropdown.Toggle className="bg-white dropdown-toggle border-0 p-3 mr-0 text-muted d-flex align-items-center">
                  <i className="mdi mdi-calendar mr-1"></i>
                  {t("24 Mar 2019 - 24 Mar 2019")}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    {t("24 Mar 2019 - 24 Mar 2019")}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {t("24 April 2019 - 24 May 2019")}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {t("24 May 2019 - 24 Jun 2019")}
                  </Dropdown.Item>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item>
                    {t("24 Jun 2019 - 24 July 2019")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* for testing Only */}

        {/* <h5 className="mb-2 text-dark font-weight-normal">Contract ID</h5>
        <Select
          value={selectedContractId}
          onChange={handleContractChange}
          options={contractOptions}
          placeholder={
            selectedContractId == null
              ? "Select a contract..."
              : selectedContractId
          }
        />
        <br /> */}

        {/* Render the <Profit /> component and pass the selectedContractId as a key */}
        {/* {selectedContractId && (
          <Profit key={selectedContractId} contractId={selectedContractId} />
        )} */}

        <div className="row">
          <div className="col-md-12">
            <div className="justify-content-between align-items-center tab-transparent">
              <Tabs defaultActiveKey="Business" className="nav">
                <Tab
                  eventKey="Users"
                  title={t("Users")}
                  className="test-tab"
                  disabled
                >
                  <p>1</p>
                </Tab>
                <Tab eventKey="Business" title={t("Business")}>
                  {loading ? (
                    <div className="loader-demo-box">
                      <div className="flip-square-loader mx-auto" />
                    </div>
                  ) : (
                    <div>
                      <div className="row">
                        <div className="col-xl-3 col-lg-6 col-sm-6 grid-margin">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="mb-2 text-dark font-weight-normal">
                                {t("Contracts")}
                              </h5>
                              <h2 className="mb-4 text-dark font-weight-bold">
                                {dashboardData?.contract_count}
                              </h2>
                              <div className="px-4 d-flex align-items-center">
                                <svg width="0" height="0">
                                  <defs>
                                    <linearGradient id="progress-order">
                                      <stop offset="0%" stopColor="#1579ff" />
                                      <stop offset="100%" stopColor="#7922e5" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <CircularProgressbarWithChildren
                                  className="progress-order"
                                  value={100}
                                >
                                  <div>
                                    <i className="mdi mdi-file-document icon-md absolute-center text-dark"></i>
                                  </div>
                                </CircularProgressbarWithChildren>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-sm-6 grid-margin">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="mb-2 text-dark font-weight-normal">
                                {t("Signed")}
                              </h5>
                              <h2 className="mb-4 text-dark font-weight-bold">
                                {dashboardData?.signed_contract_count}
                              </h2>
                              <div className="px-4 d-flex align-items-center">
                                <svg width="0" height="0">
                                  <defs>
                                    <linearGradient
                                      id="progress-visitors"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                      y2="0%"
                                    >
                                      <stop offset="0%" stopColor="#b4ec51" />
                                      <stop offset="100%" stopColor="#429321" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <CircularProgressbarWithChildren
                                  className="progress-visitors"
                                  value={percentage(
                                    dashboardData?.contract_count,
                                    dashboardData?.signed_contract_count
                                  )}
                                >
                                  <div>
                                    <i className="mdi mdi-checkbox-marked-circle-outline icon-md absolute-center text-dark"></i>
                                  </div>
                                </CircularProgressbarWithChildren>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3  col-lg-6 col-sm-6 grid-margin ">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="mb-2 text-dark font-weight-normal">
                                {t("Not signed")}
                              </h5>
                              <h2 className="mb-4 text-dark font-weight-bold">
                                {dashboardData?.unsigned_contract_count}
                              </h2>
                              <div className="px-4 d-flex align-items-center">
                                <svg width="0" height="0">
                                  <defs>
                                    <linearGradient
                                      id="progress-impressions"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                      y2="0%"
                                    >
                                      <stop offset="0%" stopColor="#fad961" />
                                      <stop offset="100%" stopColor="#f76b1c" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <CircularProgressbarWithChildren
                                  className="progress-impressions"
                                  value={percentage(
                                    dashboardData?.contract_count,
                                    dashboardData?.unsigned_contract_count
                                  )}
                                >
                                  <div>
                                    <i className="mdi mdi-alert-circle-outline icon-md absolute-center text-dark"></i>
                                  </div>
                                </CircularProgressbarWithChildren>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-sm-6 grid-margin ">
                          <div className="card">
                            <div className="card-body text-center">
                              <h5 className="mb-2 text-dark font-weight-normal">
                                {t("Terminated")}
                              </h5>
                              <h2 className="mb-4 text-dark font-weight-bold">
                                {dashboardData?.terminated_contract_count}
                              </h2>
                              <div className="px-4 d-flex align-items-center">
                                <svg width="0" height="0">
                                  <defs>
                                    <linearGradient
                                      id="progress-followers"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                      y2="0%"
                                    >
                                      <stop offset="0%" stopColor="#f5515f" />
                                      <stop offset="100%" stopColor="#9f041b" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <CircularProgressbarWithChildren
                                  className="progress-followers"
                                  value={percentage(
                                    dashboardData?.contract_count,
                                    dashboardData?.terminated_contract_count
                                  )}
                                >
                                  <div>
                                    <i className="mdi mdi-archive icon-md absolute-center text-dark"></i>
                                  </div>
                                </CircularProgressbarWithChildren>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {!loading ? (
                          <>
                            {contractData != null &&
                              contractData.map(contract => {
                                return (
                                  <div
                                    key={contract.id}
                                    className="col-md-12 mb-5"
                                  >
                                    <div className="row">
                                      <div className="col-md-4 mb-2">
                                        {ContractCard(contract)}
                                      </div>
                                      <div className="col-md-8 mb-2">
                                        <Profit
                                          key={contract.id}
                                          contractId={contract.id}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </>
                        ) : (
                          <div className="loader-demo-box">
                            <div className="flip-square-loader mx-auto" />
                          </div>
                        )}
                      </div>
                      {/* Transaction stats */}
                      {/* <div className="row">
                    <div className="col-sm-4 grid-margin stretch-card">
                      <div className="card card-danger-gradient">
                        <div className="card-body mb-4">
                          <h4 className="card-title mb-3 text-white">
                            {t("Account Retention")}
                          </h4>
                          <Bar
                            data={accountRetensionData}
                            options={accountRetensionOptions}
                          />
                        </div>
                        <div className="card-body bg-white p-md-1 pt-4">
                          <div className="row pt-4">
                            <div className="col-xl-12">
                              <div className="text-center conversion-border">
                                <h4>{t("Balance")}</h4>
                                <h1 className="text-dark font-weight-bold mb-md-3">
                                  {dashboardData?.total_balance}
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-8  grid-margin stretch-card">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-xl-flex justify-content-between mb-2">
                            <h4 className="card-title">
                              {t("Page views analytics")}
                            </h4>
                          </div>
                          <Line
                            data={{
                              labels: dashboardData?.daily_transaction_amount?.date, datasets: [{
                                label: t("deposit"),
                                data: dashboardData?.daily_transaction_amount?.deposit,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#3dd597"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#3dd597"
                              }, {
                                label: t("payment"),
                                data: dashboardData?.daily_transaction_amount?.payment,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#9c2784"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#9c2784"
                              }, {
                                label: t("provision"),
                                data: dashboardData?.daily_transaction_amount?.provision,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#27489c"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#27489c"
                              }, {
                                label: t("rent"),
                                data: dashboardData?.daily_transaction_amount?.rent,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#9c2784"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#9c2784"
                              }, {
                                label: t("discount"),
                                data: dashboardData?.daily_transaction_amount?.discount,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#9c5827"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#9c5827"
                              }, {
                                label: t("deposit_refund"),
                                data: dashboardData?.daily_transaction_amount?.deposit_refund,
                                backgroundColor: ["rgba(216,247,234, 0.19)"],
                                borderColor: ["#c41f3b"],
                                borderWidth: 2,
                                fill: true,
                                pointBorderColor: "#fff",
                                pointBackgroundColor: "#c41f3b"
                              }]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                      {/* Contracts */}
                      {/* <div className="row mb-4">
                        {dashboardData?.contracts
                          ? dashboardData.contracts.map(contract => {
                              return (
                                <div
                                  className="col-xl-4 col-lg-6 col-sm-6 grid-margin grid-margin-lg-0 mb-3"
                                  key={`contract-${contract.id}`}
                                >
                                  {contractCard(contract)}
                                </div>
                              );
                            })
                          : "No contracts availabe"}
                      </div> */}
                      {/* test */}
                      {/* <div className="row">
                    <div className="col-12 grid-margin">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="d-flex justify-content-between align-items-center">
                                <h4 className="card-title">
                                  {t("Recent Activity")}
                                </h4>
                                <div className="dropdown dropdown-arrow-none">
                                  <Dropdown alignRight>
                                    <Dropdown.Toggle
                                      className="btn p-0 text-dark bg-transparent border-0 hide-carret">
                                      <i className="mdi mdi-dots-vertical"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item>
                                        <i className="mdi mdi-eye-outline mr-2"></i>
                                        View Project{" "}
                                      </Dropdown.Item>
                                      <Dropdown.Item>
                                        <i className="mdi mdi-pencil-outline mr-2"></i>
                                        Edit Project{" "}
                                      </Dropdown.Item>
                                      <Dropdown.Item>
                                        <i className="mdi mdi-delete-outline mr-2"></i>
                                        Delete Project{" "}
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-4 grid-margin  grid-margin-lg-0">
                              <div className="wrapper pb-5 border-bottom">
                                <div className="text-wrapper d-flex align-items-center justify-content-between mb-2">
                                  <p className="mb-0 text-dark">
                                    {t("Total Profit")}
                                  </p>
                                  <span className="text-success">
                                      <i className="mdi mdi-arrow-up"></i>2.95%
                                    </span>
                                </div>
                                <h3 className="mb-0 text-dark font-weight-bold">
                                  $ 92556
                                </h3>
                                <Line
                                  data={totalProfitData}
                                  options={totalProfitOptions}
                                />
                              </div>
                              <div className="wrapper pt-5">
                                <div className="text-wrapper d-flex align-items-center justify-content-between mb-2">
                                  <p className="mb-0 text-dark">{t("Expenses")}</p>
                                  <span className="text-success">
                                      <i className="mdi mdi-arrow-up"></i>52.95%
                                    </span>
                                </div>
                                <h3 className="mb-4 text-dark font-weight-bold">
                                  $ 59565
                                </h3>
                                <Line
                                  data={totalExpencesData}
                                  options={totalExpencesOptions}
                                />
                              </div>
                            </div>
                            <div className="col-lg-9 col-sm-8 grid-margin  grid-margin-lg-0">
                              <div className="pl-0 pl-lg-4 ">
                                <div className="d-xl-flex justify-content-between align-items-center mb-2">
                                  <div className="d-lg-flex align-items-center mb-2 mb-xl-0">
                                    <h3 className="text-dark font-weight-bold mr-2 mb-0">
                                      {t("Devices sales")}
                                    </h3>
                                    <h5 className="mb-0">{t("( growth 62% )")}</h5>
                                  </div>
                                  <div className="d-lg-flex">
                                    <p className="mr-2 mb-0">{t("Timezone:")}</p>
                                    <p className="text-dark font-weight-bold mb-0">
                                      {t("GMT - 0400 Eastern Delight Time")}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  id="visit-sale-chart-legend"
                                  className="legend-top-right float-right"
                                >
                                  <ul className="legend-horizontal">
                                    <li>
                                      <span className="legend-dots bg-info"></span>
                                      {t("Demand")}
                                    </li>
                                    <li>
                                      <span className="legend-dots bg-danger"></span>
                                      {t("Supply")}
                                    </li>
                                  </ul>
                                </div>
                                <Bar
                                  data={deviceSaleData}
                                  options={deviceSaleOptions}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                      <div className="row">
                        <div className="col-xl-4 col-lg-12 col-sm-12 grid-margin grid-margin-lg-0 stretch-card">
                          <div className="card">
                            <div className="card-body recent-activity">
                              <h4 className="card-title">
                                {t("Recent Activity")}
                              </h4>
                              <div className="d-flex mb-3">
                                <div>
                                  <div className="activity-info bg-danger">
                                    {" "}
                                    I{" "}
                                  </div>
                                </div>
                                <div className="activity-details">
                                  <h4 className="text-dark font-weight-normal">
                                    Iva Barber
                                  </h4>
                                  <p className="mb-0">
                                    {t("added new task on trello")}
                                  </p>
                                  <p className="text-small mb-0">05:58AM</p>
                                </div>
                              </div>
                              <div className="d-flex mb-3">
                                <div className="activity-info bg-warning">
                                  {" "}
                                  D{" "}
                                </div>
                                <div className="activity-details">
                                  <h4 className="text-dark font-weight-normal">
                                    Dorothy Romero
                                  </h4>
                                  <p className="mb-0">
                                    {t("added new task on trello")}
                                  </p>
                                  <p className="text-small mb-0">02:50PM</p>
                                </div>
                              </div>
                              <div className="d-flex mb-3">
                                <div className="activity-info bg-success">
                                  {" "}
                                  R{" "}
                                </div>
                                <div className="activity-details">
                                  <h4 className="text-dark font-weight-normal">
                                    Ricardo Hawkins
                                  </h4>
                                  <p className="mb-0">
                                    {t("added new task on trello")}
                                  </p>
                                  <p className="text-small mb-0">05:22AM</p>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="activity-info hide-border bg-info">
                                  {" "}
                                  N{" "}
                                </div>
                                <div className="activity-details">
                                  <h4 className="text-dark font-weight-normal">
                                    Noah Montgomery
                                  </h4>
                                  <p className="mb-0">
                                    {t("added new task on trello")}
                                  </p>
                                  <p className="text-small mb-0">08:19PM</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-sm-6 grid-margin grid-margin-lg-0 stretch-card">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="card-title">{t("My Balance")}</h4>
                              <div className="d-lg-flex justify-content-between align-items-center">
                                <h1 className="text-dark mb-0">$3258</h1>
                                <p className="text-success mb-0 font-weight-medium">
                                  +30.56% ($121)
                                </p>
                              </div>
                              <p className="mb-5 pb-1">
                                {t("Deposit:")}
                                <span className="font-weight-bold">$5430</span>
                              </p>
                              <Bar
                                data={myBalanceData}
                                options={myBalanceOptions}
                              />
                              <div className="border p-3 mt-2">
                                <div className="row">
                                  <div className="col-sm-6 mb-4 mb-lg-0">
                                    <div className="d-lg-flex justify-content-between align-items-center mb-1">
                                      <div className="text-small text-dark">
                                        {t("Available")}:
                                      </div>
                                      <span className="font-weight-bold text-dark text-small ">
                                        30.56%
                                      </span>
                                    </div>
                                    <ProgressBar variant="success" now={30} />
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="d-lg-flex justify-content-between align-items-center mb-1">
                                      <div className="text-small text-dark">
                                        {t("Pending")}:
                                      </div>
                                      <span className="font-weight-bold text-small text-dark">
                                        69.44%
                                      </span>
                                    </div>
                                    <ProgressBar variant="info" now={70} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-sm-6 grid-margin grid-margin-lg-0 stretch-card">
                          <div className="card">
                            <div className="card-body">
                              <div className="dotted-border p-3 mb-3">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <h4 className="card-title mb-1">
                                      {t("Sales Prediction")}
                                    </h4>
                                  </div>
                                  <div className="col-sm-6">
                                    <Line
                                      data={salespredictionData}
                                      options={saleOptions}
                                      id="prediction1"
                                    />
                                    <h3 className="font-weight-bold mt-3 text-dark">
                                      $3258
                                    </h3>
                                    <p className="text-muted mb-0">
                                      350-985 sales
                                    </p>
                                  </div>
                                  <div className="col-sm-6">
                                    <Line
                                      data={salesprediction2Data}
                                      options={saleOptions}
                                      id="prediction2"
                                    />
                                    <h3 className="font-weight-bold mt-3 text-dark">
                                      $3258
                                    </h3>
                                    <p className="text-muted mb-0">
                                      350-985 sales
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="dotted-border p-3">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <h4 className="card-title mb-1">
                                      {t("Stock History")}
                                    </h4>
                                  </div>
                                  <div className="col-sm-6">
                                    <Line
                                      data={salesprediction3Data}
                                      options={saleOptions}
                                      id="prediction3"
                                    />
                                    <h3 className="font-weight-bold mt-3 text-dark">
                                      $3258
                                    </h3>
                                    <p className="mb-0 text-muted">
                                      350-985 sales
                                    </p>
                                  </div>
                                  <div className="col-sm-6">
                                    <Line
                                      data={salesprediction4Data}
                                      options={saleOptions}
                                      id="prediction4"
                                    />
                                    <h3 className="font-weight-bold text-dark  mt-3">
                                      $3258
                                    </h3>
                                    <p className="mb-0 text-muted">
                                      350-985 sales
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Tab>
                <Tab eventKey="Performance" title={t("Performance")} disabled>
                  <p>3</p>
                </Tab>
                <Tab eventKey="Conversion" title={t("Conversion")} disabled>
                  <p>4</p>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
