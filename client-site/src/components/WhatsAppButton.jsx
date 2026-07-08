import React from 'react'
import { FloatingWhatsApp } from '@digicroz/react-floating-whatsapp';

const WhatsAppButton = () => {
  return (
    <div className="App">
      <FloatingWhatsApp 
        phoneNumber="3165040247" // International format
        accountName="Awan Rent a Car"
        allowEsc={true}
        allowClickAway={true}
        notification={true}
        notificationSound={true}
      />
    </div>
  )
}

export default WhatsAppButton
