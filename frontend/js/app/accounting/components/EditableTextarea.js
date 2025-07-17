import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {Text} from '@react-pdf/renderer'
import compose from '../styles/compose'
import usePermission from "../../hooks/usePermission";


const EditableTextarea = ({
                            className,
                            placeholder,
                            value,
                            canEdit,
                            onChange,
                            pdfMode,
                            rows,
                          }) => {



  return (
    <>
      {pdfMode ? (
        <Text style={compose('invoice-span ' + (className ? className : ''))}>{value}</Text>
      ) : (
        <TextareaAutosize
          disabled={!canEdit}

          minRows={rows || 1}
          className={'invoice-input ' + (className ? className : '')}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </>
  )
}

export default EditableTextarea
