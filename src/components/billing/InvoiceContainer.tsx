import React from 'react'
import Invoice from './Invoice'

const InvoiceContainer = ({ invoices, busyId, confirmDeleteId, sourceLabels, categories }) => {
  return (
    <ul className="max-h-128 divide-y divide-[#CDE8E5] overflow-y-auto dark:divide-[#616F39]">
      {invoices.map((invoice) => (
        <Invoice
          key={invoice.id}
          busyId={busyId}
          invoice={invoice}
          confirmDelete={confirmDeleteId}
          sourceLabels={sourceLabels}
          categories={categories}
        />
      ))}
    </ul>
  )
}

export default InvoiceContainer