import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {Tab, Tabs} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import api from "../../api";
import {TOWER} from "../../constants/api";
import ApartmentList from "./apartment/List"
import CommercialList from "./commercial/List";


const Details = () => {
  const [tower, setTower] = useState({});
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation()
  const {id} = useParams()
  const getTower = async () => {
    try {
      setLoading(true)
      const {data} = await api.get(`${TOWER}${id}`)
      setTower(data)
    } catch (e) {
      toast.error(e.response.detail)
    } finally {
      setLoading(false)
    }
  }
  /**
   * side effect
   */
  useEffect(() => {
    getTower();
  }, []);

  return (
    <div>
      <div>
        {/* header */}
        <div className="d-sm-flex justify-content-between align-items-start">
          <h2 className="text-dark font-weight-bold mb-2">
            {tower?.name}
          </h2>
        </div>
        {/* row */}
        <div className="row">
          <div className="col-md-12">
            {loading ? (<div className="loader-demo-box">
              <div className="flip-square-loader mx-auto"/>
            </div>) : (<div className="justify-content-between align-items-center tab-transparent">
              <div>
                <Tabs defaultActiveKey="apartments" className="nav">
                  <Tab
                    eventKey="apartments"
                    title={t("Apartments")}
                    className="test-tab"
                  >
                    <ApartmentList towerId={id}/>
                  </Tab>
                  <Tab
                    eventKey="commercials"
                    title={t("Commercial stores")}
                    className="test-tab"
                  >
                    <CommercialList towerId={id}/>
                  </Tab>
                </Tabs>
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Details;
