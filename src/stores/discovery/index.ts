/*
 * @Author: czy0729
 * @Date: 2019-06-22 15:44:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-16 23:44:07
 */
import { observable, computed } from 'mobx'
import { getTimestamp } from '@utils'
import store from '@utils/store'
import { fetchHTML, xhr, xhrCustom } from '@utils/fetch'
import { log } from '@utils/dev'
import { HTMLDecode } from '@utils/html'
import { HOST, LIST_EMPTY, HOST_NING_MOE, HOST_ANITAMA } from '@constants'
import {
  HTML_TAGS,
  HTML_CATALOG,
  HTML_CATALOG_DETAIL,
  HTML_BLOG_LIST,
  HTML_CHANNEL,
  HTML_WIKI,
  HTML_ACTION_CATALOG_CREATE,
  HTML_ACTION_CATALOG_ADD_RELATED,
  HTML_ACTION_CATALOG_MODIFY_SUBJECT,
  HTML_ACTION_CATALOG_DELETE,
  HTML_ACTION_CATALOG_EDIT
} from '@constants/html'
import { Id } from '@types'
import {
  NAMESPACE,
  DEFAULT_TYPE,
  INIT_NINGMOE_DETAIL_ITEM,
  INIT_ANITAMA_TIMELINE_ITEM,
  INIT_CATALOG_ITEM,
  INIT_CATELOG_DETAIL_ITEM,
  INIT_BLOG_ITEM,
  INIT_CHANNEL
} from './init'
import {
  analysisTags,
  analysisCatalog,
  analysisCatalogDetail,
  cheerioBlog,
  cheerioChannel,
  cheerioWiki
} from './common'
import { DoCatalogAddRelate } from './types'

class Discovery extends store {
  state = observable({
    /**
     * 随机看看
     */
    random: LIST_EMPTY,

    /**
     * 柠萌条目信息
     * @param {*} bgmId
     */
    ningMoeDetail: {
      0: INIT_NINGMOE_DETAIL_ITEM
    },

    /**
     * 标签
     * @param {*} type
     */
    tags: {
      _: (type = DEFAULT_TYPE, filter) => `${type}|${filter}`,
      0: LIST_EMPTY // <INIT_TAGS_ITEM>
    },

    /**
     * 目录
     * @param {*} type '' | collect | me
     * @param {*} page
     */
    catalog: {
      _: (type = '', page = 1) => `${type}|${page}`,
      0: INIT_CATALOG_ITEM
    },

    /** 目录详情 */
    catalogDetail: {
      0: INIT_CATELOG_DETAIL_ITEM
    },

    /**
     * 全站日志
     * @param {*} type all => '' | anime | book | game | music | real
     * @param {*} page
     */
    blog: {
      _: (type = '', page = 1) => `${type}|${page}`,
      0: INIT_BLOG_ITEM
    },

    /**
     * 日志查看历史
     * @param {*} blogId
     */
    blogReaded: {
      0: false
    },

    /**
     * 频道聚合
     * @param {*} type
     */
    channel: {
      0: INIT_CHANNEL,
      anime: INIT_CHANNEL,
      book: INIT_CHANNEL,
      game: INIT_CHANNEL,
      music: INIT_CHANNEL,
      real: INIT_CHANNEL
    },

    /**
     * 在线人数
     */
    online: 0,

    /**
     * 维基人
     */
    wiki: {
      counts: [],
      timeline: {
        all: [],
        lock: [],
        merge: [],
        crt: [],
        prsn: [],
        ep: [],
        relation: [],
        subjectPerson: [],
        subjectCrt: []
      },
      last: {
        all: [],
        anime: [],
        book: [],
        music: [],
        game: [],
        real: []
      }
    },

    /**
     * Anitama文章列表
     * @param {*} page
     */
    anitamaTimeline: {
      _: (page = 1) => page,
      0: INIT_ANITAMA_TIMELINE_ITEM
    },

    /**
     * @param {*} page
     */
    dmzjTimeline: {
      _: (page = 1) => page,
      0: INIT_ANITAMA_TIMELINE_ITEM
    },

    /**
     * @param {*} page
     */
    gcoresTimeline: {
      _: (page = 1) => page,
      0: INIT_ANITAMA_TIMELINE_ITEM
    }
  })

  init = () =>
    this.readStorage(
      [
        'ningMoeDetail',
        // 'tags',
        'catalog',
        'catalogDetail',
        'blog',
        'blogReaded',
        'channel',
        'online',
        'wiki'
      ],
      NAMESPACE
    )

  // -------------------- get --------------------
  /**
   * 目录详情
   * @param {*} id
   */
  catalogDetail(id?: Id) {
    return computed<typeof INIT_CATELOG_DETAIL_ITEM>(() => {
      const { catalogDetail } = this.state
      return catalogDetail[id] || INIT_CATELOG_DETAIL_ITEM
    }).get()
  }

  /**
   * 日志查看历史
   * @param {*} blogId
   */
  blogReaded(blogId?: Id) {
    return computed<boolean>(() => {
      const { blogReaded } = this.state
      return blogReaded[blogId] || false
    }).get()
  }

  // -------------------- fetch --------------------
  /**
   * 随便看看
   * @param {*} refresh
   */
  fetchRandom = async refresh => {
    const url = `${HOST_NING_MOE}/api/get_random_bangumi`
    log(`⚡️ 柠萌动漫随便看看 ${url}`)

    try {
      const { list, pagination } = this.random
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          current_list: refresh ? '[]' : `[${list.map(item => item.id).join()}]`
        })
      }).then(response => response.json())

      let random
      if (data.code === 200) {
        const nextList = data.data.map(({ classification: item }) => ({
          id: item.id,
          bgmId: item.bgm_id,
          cover: item.bangumi_cover,
          jp: HTMLDecode(item.en_name),
          cn: HTMLDecode(item.cn_name),
          desc: item.description,
          eps: item.eps,
          airDate: item.air_date
        }))

        const key = 'random'
        random = {
          list: refresh ? nextList : [...list, ...nextList],
          pagination: {
            page: pagination.page + 1,
            pageTotal: 100
          },
          _loaded: getTimestamp()
        }
        this.setState({
          [key]: random
        })
        this.setStorage(key, undefined, NAMESPACE)
      }

      return Promise.resolve(random)
    } catch (error) {
      return Promise.resolve(LIST_EMPTY)
    }
  }

  /**
   * 搜索柠萌动漫信息
   * @param {*} keyword 关键字
   */
  fetchNingMoeDetailBySearch = async ({ keyword }) => {
    const url = `${HOST_NING_MOE}/api/search`
    log(`⚡️ 搜索柠萌动漫信息 ${url}, ${keyword}`)

    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          bangumi_type: '',
          keyword,
          limit: 10,
          page: 1,
          token: null,
          type: 'anime'
        })
      }).then(response => response.json())

      let ningMoeDetail = INIT_NINGMOE_DETAIL_ITEM
      if (data.code === 200) {
        if (Array.isArray(data.data)) {
          const key = 'ningMoeDetail'
          const { id, bgm_id: bgmId } = data.data[0].classification
          ningMoeDetail = {
            id,
            bgmId
          }
          this.setState({
            [key]: {
              [bgmId]: ningMoeDetail
            }
          })
          this.setStorage(key, undefined, NAMESPACE)
        }
      }

      return Promise.resolve(ningMoeDetail)
    } catch (error) {
      return Promise.resolve(INIT_NINGMOE_DETAIL_ITEM)
    }
  }

  /**
   * 查询柠萌动漫信息
   * @param {*} id
   * @param {*} bgmId
   */
  fetchNingMoeDetail = async ({ id, bgmId }) => {
    const url = `${HOST_NING_MOE}/api/get_bangumi`
    log(`⚡️ 查询柠萌动漫信息 ${url}`)

    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          bangumi_id: id
        })
      }).then(response => response.json())

      let ningMoeDetail = INIT_NINGMOE_DETAIL_ITEM
      if (data.code === 200) {
        const key = 'ningMoeDetail'
        ningMoeDetail = {
          id,
          bgmId

          // @todo 暂时不做播放视频, 所以bakUrl无意义
          // eps: data.data.posts.reverse().map(item => ({
          //   bakUrl: item.bak_url,
          //   sort: item.eps
          // }))
        }
        this.setState({
          [key]: {
            [bgmId]: ningMoeDetail
          }
        })
        this.setStorage(key, undefined, NAMESPACE)
      }

      return Promise.resolve(ningMoeDetail)
    } catch (error) {
      return Promise.resolve(INIT_NINGMOE_DETAIL_ITEM)
    }
  }

  /**
   * 查询真正的云盘地址
   * @param {*} url
   */
  fetchNingMoeRealYunUrl = async ({ url }) => {
    const _url = `${HOST_NING_MOE}/api/get_real_yun_url`
    log(`⚡️ 查询真正的云盘地址 ${_url}`)

    try {
      const data = await fetch(_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          url
        })
      }).then(response => response.json())

      let ningMoeRealYunUrl = ''
      if (data.code === 200) {
        ningMoeRealYunUrl = data.data.yun_url
      }

      return Promise.resolve(ningMoeRealYunUrl)
    } catch (error) {
      return Promise.resolve('')
    }
  }

  /**
   * Anitama文章列表
   */
  fetchAnitamaTimeline = async (page = 1) => {
    const url = `${HOST_ANITAMA}/timeline?pageNo=${page}`
    log(`⚡️ Anitama文章列表 ${url}`)

    let animataTimeline = INIT_ANITAMA_TIMELINE_ITEM
    try {
      const data = await fetch(url).then(response => response.json())
      if (data.status === 200 && data.success) {
        const key = 'anitamaTimeline'
        animataTimeline = {
          list: data.data.page.list.filter(item => item.entryType === 'article'),
          _loaded: getTimestamp()
        }
        this.setState({
          [key]: {
            [page]: animataTimeline
          }
        })
      }
    } catch (error) {
      // do nothing
    }

    return Promise.resolve(animataTimeline)
  }

  /**
   * DMZJ文章列表
   */
  fetchDMZJTimeline = async (page = 1) => {
    const url = 'https://m.news.dmzj.com'
    log(`⚡️ DMZJ文章列表 ${url}`)

    let data = INIT_ANITAMA_TIMELINE_ITEM
    try {
      const { _response } = await xhrCustom({
        method: 'POST',
        url,
        headers: {
          referer: url,
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
          page: page + 1
        }
      })

      const key = 'dmzjTimeline'
      data = {
        list: JSON.parse(_response).map(item => ({
          aid: item.id,
          url: `${url}/article/${item.id}.html`,
          author: item.authorName,
          origin: '动漫之家',
          cover: {
            url: `https:${item.rowPicUrl}`,
            headers: {
              Referer: url
            }
          },
          title: item.title,
          intro: item.intro,
          subtitle: item.c_create_time
        })),
        _loaded: getTimestamp()
      }

      this.setState({
        [key]: {
          [page]: data
        }
      })
    } catch (error) {}

    return Promise.resolve(data)
  }

  /**
   * GCORES文章列表
   */
  fetchGCORESTimeline = async (page = 1) => {
    log(`⚡️ GCORES文章列表 page=${page}`)

    let data = INIT_ANITAMA_TIMELINE_ITEM
    try {
      const { _response } = await xhrCustom({
        url: `https://www.gcores.com/gapi/v1/originals?page[limit]=12&page[offset]=${
          (page - 1) * 12
          // eslint-disable-next-line max-len
        }&sort=-published-at&include=category,user&filter[is-news]=1&filter[list-all]=0&fields[articles]=title,desc,is-published,thumb,app-cover,cover,comments-count,likes-count,bookmarks-count,is-verified,published-at,option-is-official,option-is-focus-showcase,duration,category,user&fields[videos]=title,desc,is-published,thumb,app-cover,cover,comments-count,likes-count,bookmarks-count,is-verified,published-at,option-is-official,option-is-focus-showcase,duration,category,user&fields[radios]=title,desc,is-published,thumb,app-cover,cover,comments-count,likes-count,bookmarks-count,is-verified,published-at,option-is-official,option-is-focus-showcase,duration,is-free,category,user`,
        headers: {
          referer: 'https://www.gcores.com/news',
          'content-type': 'application/vnd.api+json'
        },
        data: {
          page
        }
      })

      const key = 'gcoresTimeline'
      data = {
        list: JSON.parse(_response).data.map(({ id, attributes }) => ({
          aid: id,
          url: `https://www.gcores.com/articles/${id}`,
          origin: '机核GCORES',
          cover: {
            url: `https://image.gcores.com/${attributes.thumb}?x-oss-process=image/resize,limit_1,m_lfit,w_1600/quality,q_90`,
            headers: {
              Referer: 'https://www.gcores.com/'
            }
          },
          title: attributes.title,
          subtitle: attributes['published-at'].slice(0, 16).replace('T', ' ')
        })),
        _loaded: getTimestamp()
      }

      this.setState({
        [key]: {
          [page]: data
        }
      })
    } catch (error) {
      console.log(error)
    }

    return Promise.resolve(data)
  }

  /**
   * 标签
   */
  fetchTags = async ({ type = DEFAULT_TYPE, filter } = {}, refresh) => {
    const { list, pagination } = this.tags(type, filter)
    const page = refresh ? 1 : pagination.page + 1

    const html = await fetchHTML({
      url: HTML_TAGS(type, page, filter)
    })
    const data = analysisTags(html)

    const key = 'tags'
    const tags = {
      list: refresh ? data.list : [...list, ...data.list],
      pagination: {
        page,
        pageTotal: data.list.length >= 100 ? 100 : page
      },
      _loaded: getTimestamp()
    }

    this.setState({
      [key]: {
        [`${type}|${filter}`]: tags
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return tags
  }

  /**
   * 目录
   */
  fetchCatalog = async ({ type = '', page = 1 } = {}) => {
    const html = await fetchHTML({
      url: HTML_CATALOG(type, page)
    })
    const data = analysisCatalog(html)

    const key = 'catalog'
    this.setState({
      [key]: {
        [`${type}|${page}`]: {
          list: data,
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return data
  }

  /**
   * 目录详情
   */
  fetchCatalogDetail = async ({ id } = {}) => {
    const html = await fetchHTML({
      url: HTML_CATALOG_DETAIL(id)
    })
    const data = analysisCatalogDetail(html)

    const key = 'catalogDetail'
    this.setState({
      [key]: {
        [id]: {
          ...data,
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return data
  }

  /**
   * 全站日志
   */
  fetchBlog = async ({ type = '', page = 1 } = {}) => {
    const key = 'blog'
    const html = await fetchHTML({
      url: HTML_BLOG_LIST(type, page)
    })

    const list = cheerioBlog(html)
    this.setState({
      [key]: {
        [`${type}|${page}`]: {
          list,
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return list
  }

  /**
   * 频道聚合
   */
  fetchChannel = async ({ type }) => {
    const key = 'channel'
    const html = await fetchHTML({
      url: HTML_CHANNEL(type)
    })

    const data = cheerioChannel(html)
    this.setState({
      [key]: {
        [type]: {
          ...data,
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return this.channel(type)
  }

  /**
   * 在线人数
   */
  fetchOnline = async () => {
    const key = 'online'
    const html = await fetchHTML({
      url: HOST
    })

    const match = html.match(/<small class="grey rr">online: (\d+)<\/small>/)
    if (match && match[1]) {
      this.setState({
        [key]: parseInt(match[1])
      })
      this.setStorage(key, undefined, NAMESPACE)
    }

    return this.online
  }

  /**
   * 维基人
   */
  fetchWiki = async () => {
    const key = 'wiki'
    const html = await fetchHTML({
      url: HTML_WIKI()
    })

    const data = cheerioWiki(html)
    this.setState({
      [key]: {
        ...data,
        lastCounts: this[key].counts
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return this[key]
  }

  // -------------------- page --------------------
  /**
   * 更新日志查看历史
   */
  updateBlogReaded = blogId => {
    const { blogReaded } = this.state
    this.setState({
      blogReaded: {
        ...blogReaded,
        [blogId]: true
      }
    })
  }

  // -------------------- action --------------------
  /**
   * 新建目录
   */
  doCatalogCreate = ({ formhash, title, desc }, success) => {
    xhr(
      {
        url: HTML_ACTION_CATALOG_CREATE(),
        data: {
          formhash,
          title,
          desc,
          submit: '创建目录'
        }
      },
      success
    )
  }

  /**
   * 删除目录
   */
  doCatalogDelete = ({ catalogId, formhash }, success) => {
    xhr(
      {
        url: HTML_ACTION_CATALOG_DELETE(catalogId),
        data: {
          formhash,
          submit: '我要删除这个目录'
        }
      },
      success
    )
  }

  /**
   * 编辑目录
   */
  doCatalogEdit = ({ catalogId, formhash, title, desc }, success) => {
    xhr(
      {
        url: HTML_ACTION_CATALOG_EDIT(catalogId),
        data: {
          formhash,
          title,
          desc,
          submit: '保存修改'
        }
      },
      success
    )
  }

  /**
   * 目录添加条目
   */
  doCatalogAddRelate: DoCatalogAddRelate = (
    { catalogId, subjectId, formhash, noConsole },
    success
  ) => {
    xhr(
      {
        url: HTML_ACTION_CATALOG_ADD_RELATED(catalogId),
        data: {
          formhash,
          cat: '0',
          add_related: subjectId,
          submit: '添加条目关联'
        },
        noConsole
      },
      success
    )
  }

  /**
   * 目录移除条目
   */
  doCatalogDeleteRelate = ({ erase }, success) => {
    xhr(
      {
        url: `${HOST}${erase}&ajax=1`
      },
      success
    )
  }

  /**
   * 目录修改条目
   */
  doCatalogModifySubject = ({ modify, formhash, content, order }, success) => {
    xhr(
      {
        url: HTML_ACTION_CATALOG_MODIFY_SUBJECT(modify),
        data: {
          formhash,
          content,
          order,
          submit: '提交'
        }
      },
      success
    )
  }
}

const Store = new Discovery()
Store.setup()

export default Store