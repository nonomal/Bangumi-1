/*
 * @Author: czy0729
 * @Date: 2022-06-14 18:19:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-12-18 04:25:07
 */
import { TEXT_TOTAL } from '@constants'

export const FLITER_SWITCH_LAST_PATH_KEY = '@screens|base|FilterSwitch'

export const FILTER_SWITCH_DS = [
  '番剧',
  '游戏',
  '漫画',
  '文库',
  'ADV',
  'Hentai'
] as const

export const PATH_MAP = {
  番剧: 'Anime',
  游戏: 'Game',
  ADV: 'ADV',
  漫画: 'Manga',
  文库: 'Wenku',
  Hentai: 'Hentai'
} as const

export const TOTAL = TEXT_TOTAL
