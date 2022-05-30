import Index from '@/pages/index/index'
import About from '@/pages/about/index'
import SendPage from '@/pages/send'
import ReceivePage from '@/pages/receive'

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/send',
    component: SendPage,
  },
  {
    path: '/receive',
    component: ReceivePage,
  },
]
export default routes
