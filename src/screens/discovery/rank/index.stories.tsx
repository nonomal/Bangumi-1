/*
 * @Author: czy0729
 * @Date: 2023-04-09 10:33:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-11 01:53:54
 */
import React from 'react'
import {
  Page,
  StorybookPage,
  StorybookList,
  StorybookNavigation,
  getStorybookRoute
} from '@components'
import { urlStringify } from '@utils'
import { ic } from '@utils/decorators'
import { useMount } from '@utils/hooks'
import List from './list'
import Store from './store'
import { Ctx } from './types'

const Component = ic(Store, (props, { $ }: Ctx) => {
  useMount(() => {
    $.init()
  })

  return (
    <Page>
      <List />
    </Page>
  )
})

export default {
  title: 'screens/Rank',
  component: Component
}

export const Rank = () => {
  const route = getStorybookRoute('Rank')
  return (
    <StorybookPage>
      <StorybookList>
        <Component
          key={urlStringify(route.params)}
          navigation={StorybookNavigation}
          route={route}
        />
      </StorybookList>
    </StorybookPage>
  )
}
