export const formatDate = (dateStr) => {
  const date = getDate(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)

  return `${parseInt(da)} ${month.substr(0, 3)}. ${ye.toString().substr(2, 4)}`
}

export const getDate = (dateStr) => {
  const date = new Date(dateStr)
  if (isValidDate(date)) {
    return date
  }
  console.log('date format error:', dateStr)
  return new Date('0000')
}

export const isValidDate = (date) => {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    // it is a date
    if (isNaN(date.getTime())) {
      // date is not valid
      return false
    } else {
      // date is valid
      return true
    }
  }
  // not a date
  return false
}

export const isImage = (fileName) => {
  console.log(fileName)
  return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(fileName)
}

export const formatStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'accepted':
      return 'Accepté'
    case 'refused':
      return 'Refused'
  }
}
