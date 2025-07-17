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
import { HTML_TEMPLATE } from "../../constants/api";

export default function Edit() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("template name is required")
  });

  // react-form-hooks stuff
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  /* Router */
  const { id } = useParams();
  let history = useHistory();
  /* Translation */
  const { t } = useTranslation();
  /* State */
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  /* offcanvas for the template value guide */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * Fetch template data
   */
  const fetchTemplate = async () => {
    try {
      const { data } = await api.get(
        HTML_TEMPLATE.replace("{template_id}", id)
      );
      loadTemplate(data.template_code);
      setValue("name",data.name);
      setValue("template_type",data.template_type)
      
    } catch (err) {
      toast.error(err.message);
    }
  };
  /**
   * On state change
   * @param {*} editorState
   */
  const onEditorStateChange = editorState => {
    setEditorState(editorState);
  };

  /**
   * Convert html to draft state
   * @param {*} data
   */
  const loadTemplate = data => {
    const contentBlock = htmlToDraft(data);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };

  /**
   * Convert draft to html for saving to database
   * @param {*} data
   */
  const dumpTemplate = data => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  /**
   * Side effects
   */
  useEffect(() => {
    fetchTemplate();
  }, []);

  /**
   * Submit updates
   */
  const handleSave = async (template) => {
    try {
      const rawHtml = dumpTemplate();
      const data = {
        name:template.name,
        template_code: rawHtml
      };
      await api.patch(`${HTML_TEMPLATE.replace("{template_id}", id)}/`, data);
      history.push("/settings/templates");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div><form onSubmit={handleSubmit(handleSave)}>
    {/*  */}
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
        <input
          disabled={true}
          name="template_type"
          id="template_type"
          {...register("template_type")}
          className={`form-control`}
        />
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
