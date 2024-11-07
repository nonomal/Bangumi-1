/*
 * @Author: czy0729
 * @Date: 2022-01-28 15:31:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-08 07:07:54
 */
import React from 'react'
import { ActionSheet } from '@components'
import { ItemSetting } from '@_'
import { r } from '@utils/dev'
import { useBoolean, useObserver } from '@utils/hooks'
import { getShows } from '../../utils'
import HtmlExpand from './html-expand'
import ShowAirdayMonth from './show-airday-month'
import ShowCount from './show-count'
import ShowCustomOnair from './show-custom-onair'
import ShowEpInput from './show-ep-input'
import SubjectLayout from './subject-layout'
import { COMPONENT, TEXTS } from './ds'

/** 条目 */
function Subject({ filter, open = false }) {
  r(COMPONENT)

  const { state, setTrue, setFalse } = useBoolean(open)
  const shows = getShows(filter, TEXTS)

  return useObserver(() => {
    if (!shows) return null

    return (
      <>
        <ItemSetting hd='条目' arrow highlight filter={filter} onPress={setTrue} />
        <ActionSheet show={state} title='条目' height={filter ? 440 : 760} onClose={setFalse}>
          {shows.subjectShowAirdayMonth && <ShowAirdayMonth filter={filter} />}
          {shows.subjectHtmlExpand && <HtmlExpand filter={filter} />}
          {shows.showCount && <ShowCount filter={filter} />}
          {shows.showEpInput && <ShowEpInput filter={filter} />}
          {shows.showCustomOnair && <ShowCustomOnair filter={filter} />}
          {shows.layout && <SubjectLayout filter={filter} />}
        </ActionSheet>
      </>
    )
  })
}

export default Subject
