import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const { revalidateTag } = require('next/cache')

    payload.logger.info(`Revalidating header`)

    revalidateTag('global_header')
  }

  return doc
}
