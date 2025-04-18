/*
 * @Author: czy0729
 * @Date: 2024-11-19 06:29:56
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-19 06:31:56
 */
import { useInitStore } from '@stores'
import { useRunAfter } from '@utils/hooks'
import { NavigationProps } from '@types'
import store from './store'
import { Ctx } from './types'

/** 买入推荐页面逻辑 */
export function useTinygrailAdvanceAskPage(props: NavigationProps) {
  const context = useInitStore<Ctx['$']>(props, store)
  const { $ } = context

  useRunAfter(() => {
    $.init()
  })

  return context
}
