import i18n from '@/locale'
import { Dispatch, RootState } from '@/store'
import LanguageIcon from '@mui/icons-material/Language'
import { MenuItem, Button, Menu } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const LanguageSwitch = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch<Dispatch>()
  const language = useSelector((state: RootState) => state.common.language)
  const languageList = {
    en: 'English',
    cn: '中文简体',
  }

  const onLocaleChanged = (locale: string) => {
    dispatch.common.setLanguage(locale)
    i18n?.changeLanguage(locale)
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center">
      <LanguageIcon color="primary" />
      <div
        id="btn-language-picker"
        className="ml-1"
        onClick={(e) => {
          setAnchorEl(e.currentTarget)
        }}
      >
        {languageList[language]}
      </div>
      <ArrowDropDownIcon color="disabled"/>
      <Menu
        open={open}
        anchorEl={anchorEl}
        MenuListProps={{
          'aria-labelledby': 'btn-language-picker',
        }}
      >
        {Object.keys(languageList).map((key, index) => (
          <MenuItem key={key} onClick={() => onLocaleChanged(key)}>
            {languageList[key]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const MainHeader = () => {
  return (
    <div className="flex items-center w-full px-2 py-4 bg-white">
      <div className="ml-auto">
        <LanguageSwitch />
      </div>
    </div>
  )
}

export default MainHeader
