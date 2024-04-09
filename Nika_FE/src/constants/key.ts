export const MODAL_KEYS = {
  signIn: "signIn",
  signUp: "signUp",
  confirm: "confirm",
  editBlog: "editBlog",
  createBlog: "create_blog",
} as const

export const keyActionSocket = {
  clearEvent: "CLEAR",
  disconnect: "disconnect",
  createdNewBlog: "createdNewBlog",
}

export const SOCKET_KEYS = {
  disconnect: keyActionSocket.disconnect,
  clearEvent: keyActionSocket.clearEvent,
  createdNewBlog: keyActionSocket.createdNewBlog,
} as const
