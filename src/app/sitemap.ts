import glob from 'fast-glob'
import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import * as path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.icpay.org'
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'local'
  const isStaging = appEnv === 'staging'

  if (isStaging) {
    return []
  }

  const appDir = path.join(process.cwd(), 'src', 'app')
  const files = await glob('**/page.mdx', { cwd: appDir })

  const entries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(appDir, file)
      let lastModified: Date = new Date()
      try {
        const stats = await fs.stat(filePath)
        lastModified = stats.mtime
      } catch {
        // Fallback to now if stat fails
      }

      const urlPath = '/' + file.replace(/(^|\/)page\.mdx$/, '')

      const isRoot = urlPath === '/'
      return {
        url: `${baseUrl}${urlPath}`,
        lastModified,
        changeFrequency: isRoot ? 'weekly' : 'monthly',
        priority: isRoot ? 1 : 0.6,
      } satisfies MetadataRoute.Sitemap[number]
    }),
  )

  // Sort for stable output: root first, then alphabetical
  entries.sort((a, b) => {
    if (a.url === `${baseUrl}/`) return -1
    if (b.url === `${baseUrl}/`) return 1
    return a.url.localeCompare(b.url)
  })

  return entries
}


