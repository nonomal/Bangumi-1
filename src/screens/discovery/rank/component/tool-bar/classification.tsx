/*
 * @Author: czy0729
 * @Date: 2024-10-22 07:08:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-10-22 07:14:15
 */
import React from 'react'
import { ToolBar } from '@components'
import { obc } from '@utils/decorators'
import { DATA_CLASSIFICATION } from '@constants'
import { Ctx } from '../../types'

const DATA = {
  游戏: DATA_CLASSIFICATION
} as const

/** 分级 */
function Classification(_props, { $ }: Ctx) {
  const data = DATA[$.typeCn]
  if (!data) return null

  return (
    <ToolBar.Popover
      key={$.typeCn}
      data={data}
      text={$.classification || '分级'}
      type={$.classification === '' ? undefined : 'desc'}
      onSelect={$.onClassificationSelect}
      heatmap='排行榜.分级选择'
    />
  )
}

export default obc(Classification)
