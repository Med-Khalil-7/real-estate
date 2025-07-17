import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as Yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Typeahead} from "react-bootstrap-typeahead";

import api from "../../api";
import { HTML_TEMPLATES } from "../../constants/api";

export default function Add() {

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("template name is required"),
    template_type: Yup.string().required("template type is required"),
    
  });
  // react-form-hooks stuff
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  //select template
  const [templateOptions, setTemplateOptions] = useState([{id:"AC",text:"Apartment contrat"},{id:"EC",text:"Employee contract"},{id:"I",text:"Invoice"}]);
  const templates= templateOptions.map(obj => { return obj.text})
  const findTemp =(test) =>templateOptions.find(obj =>{return obj.text === test})


  /* Router */
  const { id } = useParams();
  let history = useHistory();
  /* Translation */
  const { t } = useTranslation();
  /* State */
  const [editorState, setEditorState] = useState(EditorState.createEmpty());




  /**
   * On state change
   * @param {*} editorState
   */
  const onEditorStateChange = editorState => {
    setEditorState(editorState);
  };

  /**
   * Convert draft to html for saving to database
   * @param {*} data
   */
  const dumpTemplate = data => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };
  
  /**
   * Submit updates
   */
  const handleSave = async (template) => {
    try {
      const rawHtml = dumpTemplate();
      const data = {
        template_type:findTemp(template.template_type).id,
        name: template.name,
        template_code: rawHtml
      };
      await api.post(`${HTML_TEMPLATES}/`, data);
      toast.success("New Reporting Template Added Successfully")
      history.push("/settings/templates");
    } catch (error) {
      toast.error("Template already exists")
    }
  };

  

  return (
    <div>
      <form onSubmit={handleSubmit(handleSave)}>
          {/* <fieldset disabled={!permissions.includes("core.change_unitcontract")}> */}
          <div className="form-row">
          <div className="form-group col-md-4">
              <label>{t("Template name")}</label>
              <input
                name="name"
                id="name"
                {...register("name")}
                placeholder="Write template name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group col-md-4">
              <label>{t("Template type")}</label>
              <Typeahead
                disabled={id}
                name="template_type"
                id="template_type"
                multiple={false}
                labelKey="name"
                isInvalid={errors?.tenant}
                onChange={(selected) => {
                  setValue("template_type", selected[0]);
                }}
                defaultSelected=""
                placeholder="Select Template type"
                options={templates}
              />
              <div className="invalid-feedback" style={{display: "block"}}>{errors.template_type?.message}</div>
            </div>


            
            </div>
            {/* </fieldset> */}
            
      <Card>
        <Card.Body>
          <Card.Title>{t("Template editor")}</Card.Title>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
          />
        </Card.Body>
        <Button type="submit">{t("Save")}</Button>
      </Card>
      </form>
    </div>
  );
}
