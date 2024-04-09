export const convertObjectToArray = (object: Object | any): Array<any> => {
  return Object.keys(object).map((key) => object[key])
}

export const formatMessageError = (message: string, name: string) => {
  if (message.includes('[]')) return message.replace('[]', name)
  return message
}

export const formatDate = (date: string) => {
  const inputDate = new Date(date)

  const day = String(inputDate.getUTCDate()).padStart(2, '0')
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0')
  const year = inputDate.getUTCFullYear()

  const hours = String(inputDate.getUTCHours()).padStart(2, '0')
  const minutes = String(inputDate.getUTCMinutes()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
}
