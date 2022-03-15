/*
 * @Author: czy0729
 * @Date: 2019-09-19 00:35:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-16 05:32:28
 */
import React from 'react'
import { Header, Page, Touchable, Flex, Iconfont, Text } from '@components'
import { _ } from '@stores'
import { inject, obc } from '@utils/decorators'
import StatusBarEvents from '@tinygrail/_/status-bar-events'
import ToolBar from '@tinygrail/_/tool-bar'
import Tabs from '@tinygrail/_/tabs-v2'
import Right from './right'
import List from './list'
import Store from './store'
import { tabs, sortDS } from './ds'

export default
@inject(Store)
@obc
class TinygrailCharaAssets extends React.Component {
  async componentDidMount() {
    const { $ } = this.context
    const { form } = $.params
    if (form === 'lottery') {
      $.initFormLottery()
    } else {
      $.init()
    }
  }

  getCount = route => {
    const { $ } = this.context
    switch (route.key) {
      case 'chara':
        return $.myCharaAssets?.chara?.list?.length || 0

      case 'temple':
        return $.temple?.list?.length === 2000 ? '2000+' : $.temple?.list?.length || 0

      case 'ico':
        return $.myCharaAssets?.ico?.list?.length || 0

      default:
        return 0
    }
  }

  renderIncreaseBtn() {
    const { $ } = this.context
    const { editing } = $.state
    return (
      editing && (
        <Touchable onPress={$.increaseBatchSelect}>
          <Flex style={styles.check}>
            <Iconfont name='md-done-all' size={16} color={_.colorTinygrailText} />
          </Flex>
        </Touchable>
      )
    )
  }

  renderContentHeaderComponent() {
    const { $ } = this.context
    const { page, level, sort, direction } = $.state
    if (page > 1) return undefined

    return (
      <ToolBar
        data={sortDS}
        level={level}
        levelMap={$.levelMap}
        sort={sort}
        direction={direction}
        renderLeft={this.renderIncreaseBtn()}
        onLevelSelect={$.onLevelSelect}
        onSortPress={$.onSortPress}
      />
    )
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.state
    return (
      <>
        <StatusBarEvents />
        <Header
          title={$.params?.userName ? `${$.params.userName}的持仓` : '我的持仓'}
          alias='我的持仓'
          hm={['tinygrail/chara/assets', 'TinygrailCharaAssets']}
          statusBarEvents={false}
          statusBarEventsType='Tinygrail'
          headerRight={() => <Right $={$} />}
        />
        <Page
          style={_.container.tinygrail}
          loaded={_loaded}
          loadingColor={_.colorTinygrailText}
        >
          <Tabs
            routes={tabs}
            renderContentHeaderComponent={this.renderContentHeaderComponent()}
            renderItem={item => <List key={item.key} id={item.key} />}
            renderLabel={({ route, focused }) => (
              <Flex style={styles.labelText} justify='center'>
                <Text type='tinygrailPlain' size={13} bold={focused}>
                  {route.title}
                </Text>
                {!!this.getCount(route) && (
                  <Text type='tinygrailText' size={11} bold lineHeight={13}>
                    {' '}
                    {this.getCount(route)}{' '}
                  </Text>
                )}
              </Flex>
            )}
          />
        </Page>
      </>
    )
  }
}

const styles = _.create({
  check: {
    paddingHorizontal: 8,
    height: 44,
    marginTop: -2
  },
  labelText: {
    width: '100%'
  }
})
