import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/sdk',
    name: 'Public SDK',
    description: 'Learn how to use the ICPay SDK on the frontend with your publishable key.',
  },
  {
    href: '/sdk-secret',
    name: 'Private SDK',
    description: 'Understand how to use the ICPay SDK on the server with your secret key.',
  },
  {
    href: '/widget-install',
    name: 'Widget Installation',
    description: 'Learn how to install and configure the ICPay Widget components.',
  },
  {
    href: '/webhooks',
    name: 'Webhooks',
    description: 'Configure webhooks to receive real-time payment notifications.',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
