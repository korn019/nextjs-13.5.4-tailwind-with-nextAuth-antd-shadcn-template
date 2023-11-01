'use client'

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import { useServerInsertedHTML } from 'next/navigation'
import { ConfigProvider } from 'antd'
import React, { useState } from 'react'
import type Entity from '@ant-design/cssinjs/es/Cache'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import theme from '@/theme/themeConfig'

const StyledComponentsRegistry = ({ children }: {
  children: React.ReactNode
}) => {
  const cache = React.useMemo<Entity>(() => createCache(), [createCache])

  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  useServerInsertedHTML(() => (
    <style id='antd' dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ))

  if (typeof window !== 'undefined') return <>{children}</>


  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <StyleProvider cache={cache} hashPriority='high'>
        <ConfigProvider theme={theme}>
          {children}
        </ConfigProvider>
      </StyleProvider>
    </StyleSheetManager>
  )
}

export default StyledComponentsRegistry
