import React from 'react'
import {Text} from '@react-pdf/renderer'
import compose from '../styles/compose'
import usePermission from "../../hooks/usePermission";


const EditableInput = ({className, placeholder, canEdit, value, onChange, pdfMode}) => {

  return (
    <>
      {pdfMode ? (
        <Text style={compose('span ' + (className ? className : ''))}>{value}</Text>
      ) : (
        <input
          type="text"
          disabled={!canEdit}
          className={'invoice-input ' + (className ? className : '')}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </>
  )
}

export default EditableInput
