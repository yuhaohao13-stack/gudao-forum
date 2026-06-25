'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const DonateContext = createContext()

export function DonateProvider({ children }) {
  const [showModal, setShowModal] = useState(false)
  const [showPayNowQR, setShowPayNowQR] = useState(false)
  const [toast, setToast] = useState('')

  const openModal = useCallback(() => setShowModal(true), [])
  const closeAll = useCallback(() => { setShowModal(false); setShowPayNowQR(false) }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }, [])

  return (
    <DonateContext.Provider value={{ openModal, showModal, showPayNowQR, setShowPayNowQR, closeAll, toast, showToast }}>
      {children}
    </DonateContext.Provider>
  )
}

export function useDonate() {
  return useContext(DonateContext)
}
