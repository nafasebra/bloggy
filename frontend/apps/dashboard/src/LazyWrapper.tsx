import React, { Suspense } from 'react'
import PageLoader from './PageLoader'

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  )
}

export default LazyWrapper
