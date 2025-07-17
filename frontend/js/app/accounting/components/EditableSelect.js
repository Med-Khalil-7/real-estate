import React, {useState} from 'react'
import {Text} from '@react-pdf/renderer'
import compose from '../styles/compose'


const EditableSelect = ({
                          className,
                          options,
                          canEdit,
                          value,
                          onChange,
                          pdfMode,
                        }) => {
  const [isEditing, setIsEditing] = useState(false)


  return (
    <>
      {pdfMode ? (
        <Text style={compose('invoice-span ' + (className ? className : ''))}>{value.name}</Text>
      ) : (
        <><select
          disabled={!canEdit}
          className={'invoice-input ' + (className ? className : '')}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onBlur={() => setIsEditing(false)}
          autoFocus={true}
        >
          <option value={null}>Select a tax</option>
          {options?.map((o) => (
            <option key={o.name} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        </>
      )}
    </>
  )
}

export default EditableSelect
