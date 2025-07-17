import React, {useEffect, useState} from 'react'
import EditableInput from '../components/EditableInput'
import EditableTextarea from '../components/EditableTextarea'
import EditableSelect from '../components/EditableSelect'
import _ from "lodash"
import EditableCalendarInput from '../components/EditableCalendarInput'
import Document from '../components/Document'
import Page from '../components/Page'
import View from '../components/View'
import Text from '../components/Text'
import {useHistory, useParams} from "react-router-dom"
import format from 'date-fns/format'
import api from "../../../api";
import {BILL, PROPERTY_CONTRACTS, TAX_RATE} from "../../../constants/api";
import {Button} from "react-bootstrap"
import {toast} from 'react-toastify'
import usePermission from "../../hooks/usePermission";


const BillPage = ({data, pdfMode}) => {
  const dateFormat = 'yyyy-MM-dd'

  const initialProductLine = {
    label: "",
    description: '',
    quantity: '1',
    unit_price_excl_tax: '0.00',
    tax_rate: "",
  }

  const initialInvoice = {
    contract: null,
    tenant: null,
    number: '',
    date_issued: format(new Date(), dateFormat),
    date_dued: format(new Date(), dateFormat),
    lines: [
      {...initialProductLine},
    ],
    notes: '',
    terms: '',
  }
  const [invoice, setInvoice] = useState(data ? {...data} : {...initialInvoice})
  const [taxRates, setTaxRates] = useState([]);
  const [contract, setContract] = useState();
  const [subTotal, setSubTotal] = useState(0)
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const {contractId, billId} = useParams() // route args
  const history = useHistory()
  const {is_superuser, permissions} = usePermission()
  const canEdit = permissions.includes("core.change_bill")

  const date_issued = invoice.date_issued !== '' ? new Date(invoice.date_issued) : new Date()
  const date_dued = invoice.date_issued !== '' ? new Date(invoice.date_dued) : new Date()

  const fetchTaxRates = async () => {
    try {
      const {data} = await api.get(TAX_RATE)
      setTaxRates(data)
    } catch (e) {
      toast.error("Error fetching tax rates")
    }
  }

  /**
   * fetch contract
   * @returns {Promise<void>}
   */
  const fetchContract = async () => {
    try {
      const {data} = await api.get(`${PROPERTY_CONTRACTS}${contractId}`)
      const {tenant, id} = data
      const newInvoice = {...invoice}
      newInvoice["contract"] = id
      newInvoice["tenant"] = tenant.id
      setInvoice(newInvoice)
      setContract(data)
    } catch (e) {
      toast.error("Error fetching contract")
    }
  }

  /**
   * fetch bill
   * @returns {Promise<void>}
   */
  const fetchBill = async () => {
    try {
      const {data} = await api.get(`${BILL}${billId}`)
      setInvoice(data)
    } catch (e) {
      toast.error("Error fetching bill")
    }
  }

  /**
   * handle input changes
   * @param name
   * @param value
   */
  const handleChange = (name, value) => {
    if (name !== 'lines') {
      const newInvoice = {...invoice}

      if (name === 'logoWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'logoWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }

      setInvoice(newInvoice)
    }
  }

  /**
   * handle input change in a line
   * @param index
   * @param name
   * @param value
   */
  const handleProductLineChange = (index, name, value) => {
    const lines = invoice.lines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = {...productLine}

        if (name === 'label') {
          newProductLine[name] = value
        } else {
          if (
            value[value.length - 1] === '.' ||
            (value[value.length - 1] === '0' && value.includes('.'))
          ) {
            newProductLine[name] = value
          } else {
            const n = parseFloat(value)

            newProductLine[name] = (n ? n : 0).toString()
          }
        }

        return newProductLine
      }

      return {...productLine}
    })

    setInvoice({...invoice, lines})
  }

  /**
   * handle line removal
   * @param i
   */
  const handleRemove = (i) => {
    const lines = invoice.lines.filter((productLine, index) => index !== i)

    setInvoice({...invoice, lines})
  }

  /**
   * handle line insertion
   */
  const handleAdd = () => {
    const lines = [...invoice.lines, {...initialProductLine}]

    setInvoice({...invoice, lines})
  }

  /**
   * totals calculations
   * @param quantity
   * @param unit_price_excl_tax
   * @param tax_rate
   * @returns {string}
   */
  const calculateAmount = (quantity, unit_price_excl_tax, tax_rate) => {
    const quantityNumber = parseFloat(quantity)
    const unit_price_excl_tax_num = parseFloat(unit_price_excl_tax)
    const amount = quantityNumber && unit_price_excl_tax_num ? quantityNumber * unit_price_excl_tax_num : 0
    const taxRate = tax_rate ? _.find(taxRates, {"id": parseInt(tax_rate)}) : null
    const amountIncTax = taxRate ? amount + (amount * taxRate.rate) : amount
    return amountIncTax.toFixed(2)
  }

  /**
   * form init
   */
  useEffect(() => {
    setIsLoading(true)
    fetchContract()
      .then(() => fetchContract())
      .then(() => fetchTaxRates())
      .then(() => {
        if (billId) fetchBill()
      })
      .catch((e) => {
        toast.error("Error initializing")
      })
      .finally(() => setIsLoading(false))

  }, []);


  /**
   * side effects
   */
  useEffect(() => {
    let subTotal = 0
    let total = 0
    invoice.lines.forEach(({quantity, unit_price_excl_tax, tax_rate}) => {
      const quantityNumber = parseFloat(quantity)
      const unitPrice = parseFloat(unit_price_excl_tax)
      const taxRate = tax_rate ? _.find(taxRates, {"id": parseInt(tax_rate)}) : null
      const amount = quantityNumber && unitPrice ? quantityNumber * unitPrice : 0
      const amountIncTax = taxRate ? amount + (amount * taxRate.rate) : amount

      subTotal += amount
      total += amountIncTax
    })
    setSubTotal(subTotal)
    setTotal(total)
  }, [invoice.lines])

  /**
   * handle form submit
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    try {
      if (!billId) {
        await api.post(`${BILL}`, invoice)
        toast.success("Bill added successfully")
        history.goBack()
      } else {
        await api.put(`${BILL}${billId}/`, invoice)
        toast.success("Bill updated successfully")
        history.goBack()
      }
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else if (error.response.data) {
        setErrors(error.response.data)
      } else {
        toast.error("Unknown error")
      }
    }
  }

  return (
    <Document pdfMode={pdfMode}>
      {isLoading ? (<div className="loader-demo-box">
          <div className="flip-square-loader mx-auto"/>
        </div>) :
        (<Page className="invoice-wrapper container" pdfMode={pdfMode}>
            {/* {!pdfMode && <Download data={invoice}/>} */}
            <View className="d-flex justify-content-between" pdfMode={pdfMode}>
              <View className="col-md-4 mt-4 mb-2" pdfMode={pdfMode}> <Text className="bold dark mb-1"
                                                                            pdfMode={pdfMode}>
                Bill from:
              </Text>
                <Text pdfMode={pdfMode}>
                  {contract?.landlord?.full_name}
                </Text>
                <Text pdfMode={pdfMode}>
                  {
                    `${contract?.landlord?.address?.city}
                 ${contract?.landlord?.address?.state}
                 ${contract?.landlord?.address?.district}`
                  }
                </Text>


              </View>
              <View className="col-md-5 mt-4" pdfMode={pdfMode}>
                <Text className="h1 center bold">
                  Bill
                </Text>
              </View>
            </View>

            <View className="d-flex justify-content-between mt-2" pdfMode={pdfMode}>
              <View className="col-md-4" pdfMode={pdfMode}>
                <Text className="bold dark mb-1" pdfMode={pdfMode}>
                  Bill to:
                </Text>
                <Text pdfMode={pdfMode}>
                  {contract?.tenant?.full_name}
                </Text>
                <Text pdfMode={pdfMode}>
                  {
                    `${contract?.tenant?.address?.city}
                 ${contract?.tenant?.address?.state}
                 ${contract?.tenant?.address?.district}`
                  }
                </Text>
              </View>
              <View className="col-md-4" pdfMode={pdfMode}>
                <View className="d-flex mb-2" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <Text className="bold" pdfMode={pdfMode}>
                      Number
                    </Text>
                  </View>

                  <View className="w-60" pdfMode={pdfMode}>
                    <Text pdfMode={pdfMode}>
                      {invoice.number}
                    </Text>
                  </View>
                </View>
                <View className="d-flex mb-2" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <Text
                      className="bold"
                      pdfMode={pdfMode}
                    >
                      Date issued
                    </Text>
                  </View>
                  <View className="w-60" pdfMode={pdfMode}>
                    <EditableCalendarInput
                      canEdit={canEdit}
                      value={format(date_issued, dateFormat)}
                      selected={date_issued}
                      onChange={(date) =>
                        handleChange(
                          'date_issued',
                          date && !Array.isArray(date) ? format(date, dateFormat) : ''
                        )
                      }
                      pdfMode={pdfMode}
                    />
                  </View>
                </View>
                <View className="d-flex mb-5" pdfMode={pdfMode}>
                  <View className="w-40" pdfMode={pdfMode}>
                    <Text
                      className="bold"
                      pdfMode={pdfMode}
                    >
                      Due date
                    </Text>
                  </View>
                  <View className="w-60" pdfMode={pdfMode}>
                    <EditableCalendarInput
                      canEdit={canEdit}
                      value={format(date_dued, dateFormat)}
                      selected={date_dued}
                      onChange={(date) =>
                        handleChange(
                          'date_dued',
                          date && !Array.isArray(date) ? format(date, dateFormat) : ''
                        )
                      }
                      pdfMode={pdfMode}
                    />
                    <p className="text-danger text-small">
                      {errors?.date_dued ? errors?.date_dued : ""}
                    </p>
                  </View>
                </View>
              </View>
            </View>

            <View className="row  d-flex" pdfMode={pdfMode}>
              <View className="col-md-3 p-1" pdfMode={pdfMode}>
                <Text className="white bold">
                  Label
                </Text>
              </View>
              <View className="col-md-2 p-1" pdfMode={pdfMode}>
                <Text className="white bold right">
                  Quantity
                </Text>
              </View>
              <View className="col-md-2 p-1" pdfMode={pdfMode}>
                <Text className="white bold right">
                  Unit price
                </Text>
              </View>
              <View className="col-md-2 p-1" pdfMode={pdfMode}>
                <Text className="white bold right">
                  Tax rate
                </Text>
              </View>
              <View className="col-md-2 p-1" pdfMode={pdfMode}>
                <Text className="white bold right">
                  Amount inc. Tax
                </Text>
              </View>
            </View>

            {invoice.lines.map((productLine, i) => {
              return pdfMode && productLine.label === '' ? (
                <Text key={i}/>
              ) : (
                <View key={i} className="row border-bottom mt-2  d-flex" pdfMode={pdfMode}>
                  <View className="col-md-3 pb-1" pdfMode={pdfMode}>
                    <EditableTextarea
                      canEdit={canEdit}
                      className="dark"
                      rows={2}
                      placeholder="Enter item label"
                      value={productLine.label}
                      onChange={(value) => handleProductLineChange(i, 'label', value)}
                      pdfMode={pdfMode}
                    />
                    <p className="text-danger text-small">
                      {errors?.lines?.[i]?.label ? "A label is required" : ""}
                    </p>
                  </View>
                  <View className="col-md-2" pdfMode={pdfMode}>
                    <EditableInput
                      canEdit={canEdit}
                      className="dark right"
                      value={productLine.quantity}
                      onChange={(value) => handleProductLineChange(i, 'quantity', value)}
                      pdfMode={pdfMode}
                    />
                    <p className="text-danger text-small">
                      {errors?.lines?.[i]?.quantity ? "Quantity is required" : ""}
                    </p>
                  </View>
                  <View className="col-md-2" pdfMode={pdfMode}>
                    <EditableInput
                      canEdit={canEdit}
                      className="dark right"
                      value={productLine.unit_price_excl_tax}
                      onChange={(value) => handleProductLineChange(i, 'unit_price_excl_tax', value)}
                      pdfMode={pdfMode}
                    />
                    <p className="text-danger text-small">
                      {errors?.lines?.[i]?.unit_price_excl_tax ? "price is not valid" : ""}
                    </p>
                  </View>
                  <View className="col-md-2" pdfMode={pdfMode}>
                    <EditableSelect
                      canEdit={canEdit}
                      options={taxRates}
                      value={productLine.tax_rate}
                      onChange={(value) => {
                        handleProductLineChange(i, 'tax_rate', value)
                      }}
                      pdfMode={pdfMode}
                    />
                    <p className="text-danger text-small">
                      {errors?.lines?.[i]?.tax_rate ? "choose a tax rate" : ""}
                    </p>
                  </View>
                  <View className="col-md-2 " pdfMode={pdfMode}>
                    <Text className="dark right" pdfMode={pdfMode}>
                      {calculateAmount(productLine.quantity, productLine.unit_price_excl_tax, productLine.tax_rate)}
                    </Text>
                  </View>
                  <View className="col-md-1">
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-danger "
                        aria-label="Remove Row"
                        title="Remove Row"
                        onClick={() => handleRemove(i)}
                      >
                        <span className="mdi mdi-delete bg-red"/>
                      </button>
                    )}
                  </View>
                </View>
              )
            })}

            <View className=" d-flex" pdfMode={pdfMode}>
              <View className="col-md-6 mt-10" pdfMode={pdfMode}>
                {canEdit && (
                  <button className="btn btn-link" onClick={handleAdd}>
                    <span className="mdi mdi-add bg-green mr-10"/>
                    Add Line Item
                  </button>
                )}
              </View>
              <View className="col-md-4 mt-3" pdfMode={pdfMode}>
                <View className="row flex" pdfMode={pdfMode}>
                  <View className="col-md-6 " pdfMode={pdfMode}>
                    <Text className=" bold " pdfMode={pdfMode}>
                      Sub total:
                    </Text>
                  </View>
                  <View className="col-md-6  " pdfMode={pdfMode}>
                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {subTotal?.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View className="row d-flex " pdfMode={pdfMode}>
                  <View className="col-md-6 " pdfMode={pdfMode}>
                    <Text className="bold">TOTAL: </Text>
                  </View>
                  <View className="col-md-6 d-flex" pdfMode={pdfMode}>

                    <Text className="right bold dark" pdfMode={pdfMode}>
                      {total?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-20" pdfMode={pdfMode}>
              <Text className="bold">
                Notes
              </Text>
              <EditableTextarea
                canEdit={canEdit}
                className="w-100"
                rows={2}
                value={invoice.notes}
                onChange={(value) => handleChange('notes', value)}
                pdfMode={pdfMode}
              />
            </View>
            <View className="mt-20" pdfMode={pdfMode}>
              <Text className="bold">
                terms
              </Text>
              <EditableTextarea
                canEdit={canEdit}
                className="w-100"
                rows={2}
                value={invoice.terms}
                onChange={(value) => handleChange('terms', value)}
                pdfMode={pdfMode}
              />
            </View>
            <View className="mt-2 d-flex" pdfMode={pdfMode}>
              {canEdit && (<Button onClick={handleSubmit}>Submit</Button>)}
            </View>
          </Page>
        )
      }
    </Document>
  )
}

export default BillPage
