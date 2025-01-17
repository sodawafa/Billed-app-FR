import { ROUTES_PATH } from '../constants/routes.js'
import {
  formatDate,
  formatStatus,
  getDate,
  isImage,
} from '../app/format.js'
import Logout from './Logout.js'

export default class {
  constructor ({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) {
      buttonNewBill.addEventListener('click',(e) => this.handleClickNewBill(e))
    }
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) {
      iconEye.forEach(icon => {
        icon.addEventListener('click', (e) => this.handleClickIconEye(e))
      })
    }
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = e => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (e, icon, fileName, billUrl) => {
    //console.log('see', icon, fileName, billUrl)
    if (!icon) icon = e.currentTarget
    if (!billUrl) billUrl = icon.getAttribute('data-bill-url')
    if (!fileName) fileName = icon.parentNode.querySelector(
      '.eye-title').innerText
    if (isImage(fileName) === 1) {
      const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
      $('#modaleFile').
        find('.modal-body').
        html(
          `<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`)
      $('#modaleFile').modal('show')
    } else if (isImage(fileName) === 2) {
      window.open(billUrl, '_blank')
      $('#modaleFile').find('.modal-body').html('')
    }
  }

  // not need to cover this function by tests
  getBills = () => {
    const userEmail = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')).email : ''
    if (this.firestore) {
      return this.firestore.bills().get().then(snapshot => {
        const bills = snapshot.docs.map(doc => ({
          ...doc.data(),
          date: formatDate(doc.data().date),
          status: formatStatus(doc.data().status),
          dateTmp: getDate(doc.data().date),
        })).filter(bill => bill.email === userEmail)
        /* dateTmp: variable temporaire pour la comparaison*/
        return bills
      }).catch(error => error)
    }
  }
}
