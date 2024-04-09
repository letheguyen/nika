export const ADMIN_PATHS = {
  home: "/admin",
  item: '/admin/item',
  blog: '/admin/blog',
  order: '/admin/order',
  feedback: '/admin/feedback',
  dashboard: '/admin/dashboard',
} as const

export const USER_PATHS = {
  shop: "/shop",
  blogs: "/shop/blogs"
} as const

export const APP_PATHS = {
  ...ADMIN_PATHS,
  ...USER_PATHS
} as const
