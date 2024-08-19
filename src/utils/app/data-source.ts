/*
 * @Author: czy0729
 * @Date: 2023-12-23 07:16:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-19 11:57:03
 */
import { isObservableArray } from 'mobx'
import { STORYBOOK } from '@constants'
import { CDN_OSS_MAGMA_MONO, CDN_OSS_MAGMA_POSTER, CDN_OSS_SUBJECT } from '@constants/cdn'
import { HOST, HOST_2, IMG_DEFAULT } from '@constants/constants'
import { getJSON } from '@assets/json'
import userData from '@assets/json/user.json'
import {
  AnyObject,
  Avatar,
  Cover,
  Id,
  ListEmpty,
  Paths,
  ScrollEvent,
  SubjectId,
  SubjectTypeCn
} from '@types'
import { HTMLDecode, removeHTMLTag } from '../html'
import { get } from '../protobuf'
import { getTimestamp } from '../utils'
import { getSetting } from './utils'
import {
  BANGUMI_URL_TEMPLATES,
  FIND_SUBJECT_CN_CACHE_MAP,
  FIND_SUBJECT_JP_CACHE_MAP,
  GET_AVATAR_CACHE_MAP,
  HEIGHT,
  HOST_IMAGE,
  NO_IMGS,
  RATING_MAP,
  SITE_MAP,
  TYPE_MAP,
  X18_CACHE_MAP,
  X18_DS,
  X18_TITLE
} from './ds'

/** 猜测数据中大概有多少项 */
export function guessTotalCount(list: ListEmpty, limit: number = 10) {
  if (!list?._loaded || !list?.list?.length || typeof list?.pagination?.pageTotal !== 'number') {
    return 0
  }

  if (list.pagination.pageTotal <= 1) return list.list.length

  return list.pagination.pageTotal * limit
}

/** 统一更新控制页面懒渲染 visibleBottom 变量的函数 */
export function updateVisibleBottom({ nativeEvent }: ScrollEvent) {
  if (typeof this.setState !== 'function') return

  const { contentOffset, layoutMeasurement } = nativeEvent
  const screenHeight = layoutMeasurement.height
  const visibleBottom = contentOffset.y + screenHeight
  if (visibleBottom <= (this.state.visibleBottom || 0)) return

  this.setState({
    visibleBottom: visibleBottom + HEIGHT * 0.5
  })
}

/** 是否数组, 若为 mobx 观察的数组使用原生方法是判断不出来的 */
export function isArray(arr: any) {
  if (!arr) return false
  return Array.isArray(arr) || isObservableArray(arr)
}

/** 判断收藏动作 */
export function getAction(typeCn: SubjectTypeCn) {
  if (typeCn === '书籍') return '读'
  if (typeCn === '游戏') return '玩'
  if (typeCn === '音乐') return '听'
  return '看'
}

/** 查找条目中文名 */
export function findSubjectCn(jp: string = '', subjectId?: SubjectId): string {
  if (!getSetting()?.cnFirst) return jp

  if (FIND_SUBJECT_CN_CACHE_MAP.has(jp)) return FIND_SUBJECT_CN_CACHE_MAP.get(jp)

  const bangumiData = get('bangumi-data') || []
  if (!bangumiData.length) return jp

  const item = bangumiData.find(
    // 没有 id 则使用 jp 在 bangumi-data 里面匹配
    item => subjectId == item.id || item.j === HTMLDecode(jp)
  )
  if (item) {
    const cn = item.c || ''
    if (cn) {
      FIND_SUBJECT_CN_CACHE_MAP.set(jp, cn)
      return cn
    }
  }

  FIND_SUBJECT_CN_CACHE_MAP.set(jp, jp)
  return jp
}

/** 查找条目日文名 */
export function findSubjectJp(cn: string = '', subjectId?: SubjectId): string {
  if (FIND_SUBJECT_JP_CACHE_MAP.has(cn)) return FIND_SUBJECT_JP_CACHE_MAP.get(cn)

  const bangumiData = get('bangumi-data') || []
  if (!bangumiData.length) return cn

  const item = bangumiData.find(
    // 没有 id 则使用 jp 在 bangumi-data 里面匹配
    item => subjectId == item.id || item.c === HTMLDecode(cn)
  )
  if (item) {
    const jp = item.j || ''
    if (jp) {
      FIND_SUBJECT_JP_CACHE_MAP.set(cn, jp)
      return jp
    }
  }

  FIND_SUBJECT_JP_CACHE_MAP.set(cn, cn)
  return cn
}

/** 简单控制请求频率工具函数, 若不需要发请求返回 true */
export function opitimize(data: any, s = 60) {
  if (STORYBOOK || !data?._loaded) return false

  return getTimestamp() - Number(data?._loaded || 0) < s
}

/** 适配系统中文优先返回合适字符串 */
export function cnjp(cn: any, jp: any) {
  const { cnFirst } = getSetting()
  return HTMLDecode(cnFirst ? cn || jp : jp || cn)
}

let x18SubjectIds: SubjectId[] = []

/**
 * 是否敏感条目
 * @param {*} subjectId
 * @param {*} title     辅助检测, 有关键字则都认为是 18x
 */
export function x18(subjectId: SubjectId, title?: string) {
  if (!x18SubjectIds.length) {
    x18SubjectIds = getJSON('thirdParty/nsfw.min', [], true).map(item => item.i)
    if (!x18SubjectIds.length) return false
  }

  if (!subjectId) return false

  if (typeof subjectId === 'string') {
    subjectId = Number(subjectId.replace('/subject/', ''))
  }

  if (X18_CACHE_MAP.has(subjectId)) return X18_CACHE_MAP.get(subjectId)

  const flag = x18SubjectIds.includes(subjectId)
  if (flag) {
    X18_CACHE_MAP.set(subjectId, true)
    return true
  }

  if (title) {
    const flag = X18_TITLE.some(item => title.includes(item))
    if (flag) {
      X18_CACHE_MAP.set(subjectId, true)
      return true
    }
  }

  X18_CACHE_MAP.set(subjectId, false)
  return false
}

/** 猜测是否敏感字符串 */
export function x18s(str: string) {
  const _str = String(str).toLowerCase()
  return X18_DS.some(item => _str.includes(item))
}

/** 修复链接 */
export function fixedBgmUrl(url: string = '') {
  try {
    let _url = url
    if (!_url.includes('http://') && !_url.includes('https://')) {
      _url = `${HOST}${_url}`
    }
    _url.includes('http://') && (_url = _url.replace('http://', 'https://'))
    _url.includes(HOST_2) && (_url = _url.replace(HOST_2, HOST))
    return _url
  } catch (error) {
    return url
  }
}

/** 判断是否bgm的链接, 若是返回页面信息, 否则返回 false */
export function matchBgmLink(url: string = ''):
  | false
  | {
      route: Paths
      params?: AnyObject
      app?: boolean
    } {
  try {
    const _url = fixedBgmUrl(url)

    // 自定义的 App 内协议
    if (_url.indexOf('https://App/') === 0) {
      const [, , , route = '', params = ''] = _url.split('/')
      if (route && params) {
        const [key, value] = params.split(':')
        return {
          route: route as Paths,
          params: {
            [key]: value
          },
          app: true
        }
      }
    }

    if (!_url.includes(HOST)) return false

    // 超展开内容 [/rakuen/topic/{topicId}]
    if (_url.includes('/rakuen/topic/')) {
      const topicId = _url.replace(`${HOST}/rakuen/topic/`, '')
      return {
        route: 'Topic',
        params: {
          topicId
        }
      }
    }

    if (_url.includes('/group/topic/')) {
      const topicId = `group/${_url.replace(`${HOST}/group/topic/`, '')}`
      return {
        route: 'Topic',
        params: {
          topicId
        }
      }
    }

    // 条目 > 讨论版
    if (_url.includes('/subject/topic/')) {
      const topicId = `subject/${_url.replace(`${HOST}/subject/topic/`, '')}`
      return {
        route: 'Topic',
        params: {
          topicId
        }
      }
    }

    // 本集讨论 [/ep/\d+]
    // 结构与超展开内容类似, 跳转到超展开内容
    if (_url.includes('/ep/')) {
      const topicId = _url.replace(`${HOST}/`, '').replace('subject/', '')
      return {
        route: 'Topic',
        params: {
          topicId
        }
      }
    }

    // 条目 [/subject/{subjectId}]
    if (_url.includes('/subject/')) {
      const subjectId = _url.replace(`${HOST}/subject/`, '')
      return {
        route: 'Subject',
        params: {
          subjectId
        }
      }
    }

    // 个人中心 [/user/{userId}]
    // 排除时间线回复 [user/{userId}/timeline/status/{timelineId}]
    if (_url.includes('/user/') && _url.split('/').length <= 6) {
      const userId = _url.replace(`${HOST}/user/`, '')
      return {
        route: 'Zone',
        params: {
          userId
        }
      }
    }

    // 人物 [/character/\d+, /person/\d+]
    if (_url.includes('/character/') || _url.includes('/person/')) {
      const monoId = _url.replace(`${HOST}/`, '')
      return {
        route: 'Mono',
        params: {
          monoId
        }
      }
    }

    // 小组
    if (_url.includes('/group/')) {
      const groupId = _url.replace(`${HOST}/group/`, '')
      return {
        route: 'Group',
        params: {
          groupId
        }
      }
    }

    // 标签
    if (_url.includes('/tag/')) {
      // ['https:', ', 'bangumi.tv', 'anime', 'tag', '剧场版', 'airtime', '2018']
      const params = _url.split('/')
      return {
        route: 'Tag',
        params: {
          type: params[3],
          tag: decodeURIComponent(params[5]),
          airtime: params[7]
        }
      }
    }

    // 吐槽
    if (_url.includes('/timeline/status/')) {
      const splits = _url.split('/timeline/status/')
      const _userId = splits[0].replace('https://bgm.tv/user/', '')
      const _id = splits[1]
      return {
        route: 'Say',
        params: {
          sayId: _id,
          userId: _userId
        }
      }
    }

    // 目录
    if (_url.includes('/index/')) {
      const _id = _url.split('/index/')[1]
      return {
        route: 'CatalogDetail',
        params: {
          catalogId: _id
        }
      }
    }

    // 日志
    if (_url.includes('/blog/')) {
      const _id = _url.split('/blog/')[1]
      return {
        route: 'Blog',
        params: {
          blogId: _id
        }
      }
    }

    return false
  } catch (error) {
    return false
  }
}

/** 自动判断封面 CDN 地址 */
export function matchCoverUrl(src: any, noDefault?: boolean, prefix?: string) {
  if (typeof src !== 'string') return src

  const { cdn, cdnOrigin } = getSetting()
  const fallback = noDefault ? '' : IMG_DEFAULT

  /** 有些情况图片地址分析错误, 排除掉 */
  if (NO_IMGS.includes(src)) return IMG_DEFAULT || fallback

  /** magma 高级会员图片源 */
  if (cdn && cdnOrigin === 'magma' && typeof src === 'string' && src.includes(HOST_IMAGE)) {
    if (src.includes('/pic/crt/')) return CDN_OSS_MAGMA_MONO(src) || fallback

    return CDN_OSS_MAGMA_POSTER(getCoverMedium(src), prefix) || fallback
  }

  /** @deprecated 旧免费 CDN 源头, 国内已全部失效 */
  if (cdn) {
    return CDN_OSS_SUBJECT(getCoverMedium(src), cdnOrigin as 'fastly' | 'OneDrive') || fallback
  }

  /** 大图不替换成低质量图 */
  if (typeof src === 'string' && src?.includes('/l/')) return src

  /** 保证至少为中质量图 */
  return getCoverMedium(src) || fallback
}

/** 获取中质量 bgm 图片 */
export function getCoverMedium(src: any = '', mini: boolean = false) {
  // 角色图片因为是对头部划图的, 不要处理
  // 用户图床也没有其他质量
  if (
    typeof src !== 'string' ||
    src === '' ||
    src.includes('/crt/') ||
    src.includes('/photo/') ||
    !src.includes(HOST_IMAGE)
  ) {
    return src
  }

  // 用户头像和小组图标没有/c/类型
  if (mini || src.includes('/user/') || src.includes('/icon/')) {
    return fixedRemoteImageUrl(src.replace(/\/g\/|\/s\/|\/c\/|\/l\//, '/m/'))
  }

  return fixedRemoteImageUrl(src.replace(/\/g\/|\/s\/|\/m\/|\/l\//, '/c/'))
}

/**
 * 获取低质量 bgm 图片
 *  - bgm 图片质量 g < s < m < c < l, 只用 s, m(c), l
 *  - CDN 开启下 Avatar 组件会忽略 s, 把 s 转成 m(c)
 */
export function getCoverSmall(src?: Avatar): Avatar<'s'>
export function getCoverSmall(src?: Cover): Cover<'s'>
export function getCoverSmall(src: string): string
export function getCoverSmall(
  src: Avatar | Cover | string = ''
): Avatar<'s'> | Cover<'s'> | string {
  if (
    typeof src !== 'string' ||
    src === '' ||
    src.includes('/photo/') ||
    !src.includes(HOST_IMAGE)
  ) {
    return src
  }

  return fixedRemoteImageUrl(src.replace(/\/g\/|\/s\/|\/c\/|\/l\//, '/s/'))
}

/** 获取高质量 bgm 图片 */
export function getCoverLarge(src = '', size: 200 | 400 = 400) {
  if (
    typeof src !== 'string' ||
    src === '' ||
    src.includes('/photo/') ||
    !src.includes(HOST_IMAGE)
  ) {
    return src
  }

  let cover = fixedRemoteImageUrl(src.replace(/\/g\/|\/s\/|\/m\/|\/c\//, '/l/'))
  if (size !== 400) return cover.replace('/r/400/', `/r/${size}/`)
  return cover
}

/** 获取新格式 bgm 封面大图 */
export function getCover400(src: string = '', size: 100 | 200 | 400 | 600 | 800 = 400): string {
  if (typeof src === 'string' && src.includes('lain.bgm.tv')) {
    return fixedRemoteImageUrl(
      src
        // 使用新增的 r/400 前缀
        .replace(/lain.bgm.tv\/pic\/cover\/(g|s|c|m|l)\//, `lain.bgm.tv/r/${size}/pic/cover/l/`)
        // 不使用 nxn 直接使用 r/400
        .replace(/\/r\/\d+x\d+\//, `/r/${size}/`)
        // 不使用 r/800
        .replace('/r/800/', `/r/${size}/`)
    )
  }

  return src
}

/** 获取条目封面中等质量地址 */
export function getSubjectCoverCommon(url: string): string {
  return fixedRemoteImageUrl(
    url.replace(/\/\/lain.bgm.tv\/r\/\d+\/pic\/cover\/(g|s|m|l)\//, '//lain.bgm.tv/pic/cover/c/')
  )
}

/** 获取人物封面中等质量地址 */
export function getMonoCoverSmall(url: string): string {
  return fixedRemoteImageUrl(
    url
      .replace(/\/\/lain.bgm.tv\/r\/\d+\/pic\/crt\/[gsmcl]\//g, '//lain.bgm.tv/pic/crt/g/')
      .replace(/\/[gsmcl]\//g, '/g/')
  )
}

/** 修复远程图片地址 */
export function fixedRemoteImageUrl(url: any) {
  if (typeof url !== 'string') return url

  let value = url

  // 协议
  if (value.indexOf('https:') === -1 && value.indexOf('http:') === -1) {
    value = `https:${value}`
  }

  // fixed: 2022-09-27, 去除 cf 无缘无故添加的前缀
  // 类似 /cdn-cgi/mirage/xxx-xxx-1800/1280/(https://abc.com/123.jpg | img/smiles/tv/15.fig)
  value = value.replace(/\/cdn-cgi\/mirage\/.+?\/\d+\//g, '').replace('http://', 'https://')

  // 带有服务器 r/800 前缀的必须是 l 大小的图片
  if (/\/r\/\d+\//.test(value)) value = value.replace(/\/(g|s|m|c)\//, '/l/')

  return value
}

/** 获取颜色 type */
export function getType(label: string, defaultType: string = 'plain') {
  return TYPE_MAP[label] || defaultType
}

/** 获取评分中文 */
export function getRating(score: number): (typeof RATING_MAP)[keyof typeof RATING_MAP] | '' {
  if (score === undefined) return ''
  return RATING_MAP[Math.floor(score + 0.5)] || RATING_MAP[1]
}

/**
 * 获得在线播放地址
 * @param {*} item bangumiInfo 数据项
 */
export function getBangumiUrl(item: { site?: string; id?: Id; url?: string }): string {
  if (!item) return ''

  const { site, id, url } = item || {}
  if (site && site in BANGUMI_URL_TEMPLATES) {
    return url || BANGUMI_URL_TEMPLATES[site](id)
  }

  return ''
}

/** 从 cookies 字符串中分析 cookie 值 */
export function getCookie(cookies = '', name: string) {
  const list = cookies.split('; ')
  for (let i = 0; i < list.length; i += 1) {
    const arr = list[i].split('=')
    if (arr[0] == name) return decodeURIComponent(arr[1])
  }
  return ''
}

/**
 * bangumi-data 的 min 转换成正常 item
 * @param {*} item
 *
 * {
 *   id: 132734,
 *   j: '冴えない彼女の育てかた♭',
 *   c: '路人女主的养成方法 ♭',
 *   s: {
 *     p: 'SP3XVb0jk9E0sho',
 *     i: 'a_19rrh9f1yl',
 *     ni: 'saenai2',
 *     b: 28228738
 *   }
 *   [t: 'tv']
 * }
 */
export function unzipBangumiData(
  item: {
    id?: any
    s?: any
    j?: string
    c?: string
    t?: string
  } = {}
) {
  const sites: {
    site: 'bangumi' | 'bilibili' | 'qq' | 'iqiyi' | 'acfun' | 'youku'
    id: string
  }[] = [
    {
      site: 'bangumi',
      id: String(item.id)
    }
  ]
  Object.keys(item.s || {}).forEach(s =>
    sites.push({
      site: SITE_MAP[s],
      id: String(item.s[s])
    })
  )

  return {
    title: item.j,
    type: item.t || 'tv',
    sites,
    titleTranslate: {
      'zh-Hans': [item.c]
    }
  }
}

/** 获取符合预期的回复纯文字 */
export function getCommentPlainText(str: string) {
  const pattern = /<img[^>]+alt="\((bgm\d+)\)"[^>]*>/
  return removeHTMLTag(
    str
      .replace(/<div class="quote">(.+?)<\/div>/g, '')
      .replace(/<br>/g, '\n')
      .replace(pattern, '($1)')
  )
}

/** 在本地数据中尽量获取用户头像地址, 目的为进行减少 API 请求 */
export function getAvatarLocal(userId: string) {
  if (!userId) return false

  if (GET_AVATAR_CACHE_MAP.has(userId)) return GET_AVATAR_CACHE_MAP.get(userId)

  let find = userData[userId]
  if (!find) find = Object.values(userData).find((item: any) => item.i == userId)

  if (!find?.a) {
    GET_AVATAR_CACHE_MAP.set(userId, false)
    return false
  }

  const avatar = `https://lain.bgm.tv/pic/user/l/000/${find.a}.jpg`
  GET_AVATAR_CACHE_MAP.set(userId, avatar)
  return avatar
}
