/*
 * @Author: czy0729
 * @Date: 2024-10-22 07:08:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-10-22 07:14:15
 */
import React from 'react'
import { ToolBar } from '@components'
import { obc } from '@utils/decorators'
import { DATA_ANIME_TARGET, DATA_GAME_TARGET } from '@constants'
import { Ctx } from '../../types'

const DATA = {
  动画: DATA_ANIME_TARGET,
  游戏: DATA_GAME_TARGET
} as const

/** 受众 */
function Target(_props, { $ }: Ctx) {
  const data = DATA[$.typeCn]
  if (!data) return null

  return (
    <ToolBar.Popover
      key={$.typeCn}
      data={data}
      text={$.target || '受众'}
      type={$.target === '' ? undefined : 'desc'}
      onSelect={$.onTargetSelect}
      heatmap='排行榜.受众选择'
    />
  )
}

export default obc(Target)
