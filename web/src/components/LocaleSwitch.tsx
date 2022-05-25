import i18n from '@/locale'
import { Dispatch, RootState } from '@/store'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LocaleSwitch = () => {
  const dispatch = useDispatch<Dispatch>()
  const language = useSelector((state: RootState) => state.common.language)
  const onLocaleChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    dispatch.common.setLanguage(locale)
    i18n?.changeLanguage(locale)
  }
  return (
    <select className="p-2" onChange={onLocaleChanged} defaultValue={language}>
      <option value="en">English</option>
      <option value="cn">中文简体</option>
    </select>
  )
}

export default LocaleSwitch
