/*
 * @Author: czy0729
 * @Date: 2019-05-16 01:22:05
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-06-04 17:50:46
 */
import React from 'react'
import { Input } from '@components'
import { stl } from '@utils'
import { obc } from '@utils/decorators'
import { MODEL_SEARCH_CAT } from '@constants'
import { SearchCatCn } from '@types'
import { Ctx } from '../../types'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function SearchBar(_props, { $, navigation }: Ctx) {
  const styles = memoStyles()
  const label = MODEL_SEARCH_CAT.getLabel<SearchCatCn>($.state.cat)
  return (
    <Input
      style={stl(styles.searchIpt, ['人物', '用户'].includes(label) && styles.radius)}
      value={$.state._value}
      returnKeyType='search'
      returnKeyLabel='搜索'
      placeholder={$.isUser ? '输入完整的用户Id' : '输入关键字'}
      autoFocus
      onChangeText={$.onChangeText}
      onFocus={$.onFocus}
      onBlur={$.onBlur}
      onSubmitEditing={() => $.onSubmit(navigation)}
      accessibilityRole='search'
    />
  )
}

export default obc(SearchBar, COMPONENT)
