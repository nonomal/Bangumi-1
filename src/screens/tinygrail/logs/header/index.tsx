/*
 * @Author: czy0729
 * @Date: 2024-03-10 15:52:45
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-19 13:36:57
 */
import React from 'react'
import { Header as HeaderComp } from '@components'
import { useStore } from '@stores'
import { ob } from '@utils/decorators'
import IconGo from '@tinygrail/_/icon-go'
import { Ctx } from '../types'
import { COMPONENT } from './ds'

function Header() {
  const { $ } = useStore<Ctx>()
  return (
    <HeaderComp
      title='资金日志'
      hm={['tinygrail/logs', 'TinygrailLogs']}
      statusBarEvents={false}
      statusBarEventsType='Tinygrail'
      headerRight={() => <IconGo $={$} />}
    />
  )
}

export default ob(Header, COMPONENT)
