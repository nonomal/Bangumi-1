/*
 * @Author: czy0729
 * @Date: 2021-05-05 03:28:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-04-11 21:46:00
 */
import React from 'react'
import { View } from 'react-native'
import { Component, Expand } from '@components'
import { InView, PreventTouchPlaceholder, SectionTitle } from '@_'
import { _, systemStore, useStore } from '@stores'
import { stl } from '@utils'
import { ob } from '@utils/decorators'
import { TITLE_GAME } from '../../ds'
import { Ctx } from '../../types'
import IconHidden from '../icon/hidden'
import IconPS from '../icon/ps'
import Split from '../split'
import Details from './details'
import Thumbs from './thumbs'
import { COMPONENT } from './ds'

function Game({ onBlockRef }) {
  const { $ } = useStore<Ctx>()
  if (!$.showGame[1]) return null

  const { showGameInfo } = systemStore.setting
  return (
    <Component id='screen-subject-game'>
      <View style={_.container.layout} ref={ref => onBlockRef(ref, TITLE_GAME)} />
      <InView style={stl(_.mt.lg, !showGameInfo && _.short)}>
        <Expand>
          <SectionTitle
            style={_.container.wind}
            right={
              !showGameInfo ? (
                <IconHidden name={TITLE_GAME} value='showGameInfo' />
              ) : (
                !$.gameInfo?.isADV && <IconPS />
              )
            }
            icon={!showGameInfo && 'md-navigate-next'}
            splitStyles
            onPress={() => $.onSwitchBlock('showGameInfo')}
          >
            {TITLE_GAME}
          </SectionTitle>
          {showGameInfo && (
            <>
              <Thumbs />
              <Details />
            </>
          )}
          <PreventTouchPlaceholder />
        </Expand>
      </InView>
      <Split />
    </Component>
  )
}

export default ob(Game, COMPONENT)
