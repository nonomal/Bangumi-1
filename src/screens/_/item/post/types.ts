/*
 * @Author: czy0729
 * @Date: 2022-06-14 22:58:28
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-14 15:31:16
 */
import { Id, UserId, EventType, ViewStyle } from '@types'

export type Props = {
  /** 容器样式 */
  contentStyle?: ViewStyle

  /** 头像地址 */
  avatar?: string

  /** 用户 Id */
  userId?: UserId

  /** 用户昵称 */
  userName?: string

  /** 存放 bgm 特有的子回复配置字符串 */
  replySub?: string

  /** 回复内容 */
  message?: string

  /** 子回复数据 */
  sub?: any[]

  /** 楼层 Id */
  id?: Id

  /** 作者 Id */
  authorId?: UserId

  /** 楼层 Id, 存在就跳转到对应楼层 */
  postId?: Id

  /** 发帖时间 */
  time?: string

  /** 楼层 */
  floor?: string

  /** 用户签名 */
  userSign?: string

  /** 删除楼层的请求地址 */
  erase?: string

  /** 是否允许渲染 (用于优化) */
  rendered?: boolean

  /** 是否自动检测媒体块 */
  matchLink?: boolean

  /** 传递显示回复弹窗的函数 */
  showFixedTextare?: () => any

  /** 埋点 */
  event?: EventType
}
