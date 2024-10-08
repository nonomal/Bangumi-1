/*
 * @Author: czy0729
 * @Date: 2022-06-14 13:46:57
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-09-13 18:06:06
 */
import { CatalogDetailItem } from '@stores/discovery/types'
import { CalalogsItem } from '@stores/users/types'
import { Id, SubjectId } from '@types'

export type Props = {
  id?: SubjectId
  defaultExpand?: Id
  defaultEditItem?: CatalogDetailItem
  visible?: boolean
  title?: string
  onClose?: () => any
}

export type State = {
  visible: boolean
  expand: Id[]
  list: CalalogsItem[]

  /** 是否正在新建目录, 目录编辑 */
  create: boolean | string
  title: string
  desc: string

  /** 条目编辑 */
  edit: Id
  content: string
  order: string | number
}
