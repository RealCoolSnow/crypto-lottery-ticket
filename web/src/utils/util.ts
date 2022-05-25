const showAlert = (message: string | object) => {
  const content = typeof message === 'string' ? message : toString(message)
  alert(content)
}

const toString = (data: any) => JSON.stringify(data)

export { showAlert, toString }
