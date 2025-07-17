import React from "react";
import {useTranslation} from "react-i18next";


export default function Initial({nextStep, register, setValue, getValues, errors}) {
  const {t} = useTranslation();
  const items = [
    {value: "apartments", text: t("Apartments"), description: t("create apartments with all needed details including number of rooms and bedrooms, facilities..."), icon: "ti ti-key"},
    {value: "villas", text: t("Villas"), description: t("create villas with all needed details including number of rooms, floors, amenities, area size..."), icon: " ti ti-home"},
    {value: "commercials", text: t("Commercial stores"), description: t("create commercials with all needed details including store type, number of rooms, area size..."), icon: "ti ti-money"}
  ];


  const SelectableCard = ({option, selected, onChange}) => {
    return (
      <div className="col-md-6 col-xl-4 grid-margin pricing-card" onClick={onChange}>
        <div className={`card  border pricing-card-body ${selected ? `border-primary`: `border-black`}`}>
          <div className="text-center pricing-card-head py-2">
            <h2>{option.text}</h2>
            <i className={`icon-lg text-primary my-2 ${option.icon}`}/>
          </div>
          <div className="my-2">
            {option.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column justify-content-between">
      <p className="card-description">
        {" "}
        {t("Welcome! please choose a property type")}
      </p>
      <div className="row pricing-table">

        {items.map((option, index) => (
          <SelectableCard
            key={index}
            option={option}
            selected={option.value === getValues("property_type")}
            onChange={() => setValue("property_type", option.value)}
          />))}
      </div>
      <div className="d-flex align-items-end flex-column">
        <button
          className="btn btn-primary mt-auto"
          onClick={e => {
            e.preventDefault();
            nextStep();
          }}
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
}
