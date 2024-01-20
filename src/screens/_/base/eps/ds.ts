/*
 * @Author: czy0729
 * @Date: 2021-08-10 00:36:55
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-01-20 09:37:56
 */
import { _ } from '@stores'
import { rc } from '@utils/dev'
import { isMobile } from '@utils/dom'
import { STORYBOOK } from '@constants'
import { Fn, SubjectId, ViewStyle } from '@types'
import { COMPONENT as PARENT } from '../ds'

export const COMPONENT = rc(PARENT, 'Eps')

export const COMPONENT_MAIN = rc(COMPONENT)

export const numbersOfLine = STORYBOOK && !isMobile() ? 10 : 8

export const DEFAULT_PROPS = {
  style: {} as ViewStyle,
  subjectId: 0 as SubjectId,
  layoutWidth: 0 as number,
  marginRight: 0 as number,
  numbersOfLine,
  lines: 4 as number,
  pagination: false as boolean,
  canPlay: false as boolean,
  login: false as boolean,
  advance: false as boolean,
  eps: [] as any[],
  userProgress: {} as any,
  grid: false as boolean,
  orientation: _.orientation,
  flip: false as boolean,
  onFliped: (() => {}) as Fn,
  onSelect: (() => {}) as Fn
}
