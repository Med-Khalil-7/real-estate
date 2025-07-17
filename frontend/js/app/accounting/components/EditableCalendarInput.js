import React from 'react'
import {Text} from '@react-pdf/renderer'
import DatePicker from 'react-datepicker'
import compose from '../styles/compose'


const EditableCalendarInput = ({className, value, canEdit, selected, onChange, pdfMode}) => {

  return (
    <>
      {pdfMode ? (
        <Text style={compose('span ' + (className ? className : ''))}>{value}</Text>
      ) : (
        <DatePicker
          disabled={!canEdit}
          className={'invoice-input ' + (className ? className : '')}
          selected={selected}
          onChange={onChange ? (date) => onChange(date) : (date) => null}
          dateFormat="yyyy-MM-dd"
        />
      )}
    </>
  )
}

export default EditableCalendarInput
