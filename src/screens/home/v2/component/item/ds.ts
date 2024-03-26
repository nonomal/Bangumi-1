/*
 * @Author: czy0729
 * @Date: 2024-01-20 09:11:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-03-26 18:04:54
 */
import { rc } from '@utils/dev'
import { Override, Subject, SubjectId } from '@types'
import { TabLabel } from '../../types'
import { COMPONENT as PARENT } from '../ds'

export const COMPONENT = rc(PARENT, 'Item')

export const COMPONENT_MAIN = rc(COMPONENT)

export const WEEK_DAY_MAP = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日'
} as const

/** index.tsx */
export type Props = {
  index: number
  subjectId: SubjectId
  subject: Override<
    Subject,
    {
      /** 收藏时间 (游戏才有) */
      time?: string
    }
  >
  title?: TabLabel

  /** 看到多少集 */
  epStatus: string | number
}

/** item.tsx */
export const DEFAULT_PROPS = {
  index: 0 as number,
  title: '' as TabLabel,
  subjectId: 0 as SubjectId,
  type: '2' as Subject['type'],
  image: '' as Subject['images']['medium'],
  name: '' as Subject['name'],
  name_cn: '' as Subject['name_cn'],
  doing: 0 as Subject['collection']['doing'],

  /** 看到多少集 */
  epStatus: '' as string | number,

  /** 收藏时间 (游戏才有) */
  time: '' as string
}
