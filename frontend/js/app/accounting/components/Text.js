import React from 'react'
import {Text as PdfText} from '@react-pdf/renderer'
import compose from '../styles/compose'
import usePermission from "../../hooks/usePermission";


const Text = ({className, pdfMode, children}) => {

  return (
    <>
      {pdfMode ? (
        <PdfText style={compose('invoice-span ' + (className ? className : ''))}>{children}</PdfText>
      ) : (
        <span className={'invoice-span ' + (className ? className : '')}>{children}</span>
      )}
    </>
  )
}

export default Text
