/*
 * @Author: czy0729
 * @Date: 2020-07-15 11:51:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-16 11:49:21
 */
import React from 'react'
import { Component, Page, Text } from '@components'
import { FilterSwitch, Notice } from '@_'
import { _, StoreContext } from '@stores'
import { useObserver } from '@utils/hooks'
import { NavigationProps } from '@types'
import Header from '../anime/header'
import { useHentaiPage } from './hooks'
import List from './list'

/** 找番剧 */
const Hentai = (props: NavigationProps) => {
  const { id, $ } = useHentaiPage(props)

  return useObserver(() => (
    <Component id='screen-hentai'>
      <StoreContext.Provider value={id}>
        <Header title='找番剧' alias='Hentai' hm={['hentai', 'Hentai']} />
        <Page loaded={$.state._loaded}>
          <Notice>此页面已不再维护</Notice>
          {!$.access ? (
            <>
              <FilterSwitch name='Hentai' />
              <Text style={_.mt.lg} align='center'>
                游客或您所在的用户组暂不开放此功能
              </Text>
            </>
          ) : (
            <List $={$} />
          )}
        </Page>
      </StoreContext.Provider>
    </Component>
  ))
}

export default Hentai
