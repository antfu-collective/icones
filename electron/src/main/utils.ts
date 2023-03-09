import { Notification, app } from 'electron'

export const showNotification = (mes: string) => {
  new Notification({ title: app.name, body: mes }).show()
}
