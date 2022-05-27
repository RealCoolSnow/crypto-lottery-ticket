import React, { useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'

const Index = () => {
  const { t } = useTranslation()
  useEffect(() => {
    console.log('app created')
  }, [])
  return (
    <ul>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
        <li className="py-8" key={item}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default Index
