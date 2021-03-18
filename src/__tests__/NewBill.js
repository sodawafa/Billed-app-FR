import { screen } from '@testing-library/dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { localStorageMock } from '../__mocks__/localStorage'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import userEvent from '@testing-library/user-event'
import firebase from '../__mocks__/firebase'
import firestore from '../app/Firestore.js'

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee',
  email: 'johndoe@email.com',
  password: 'azerty',
  status: 'connected',
}))
//const firestore = null

const onNavigate = (pathname) => {
  document.body.innerHTML = pathname
  //ROUTES({ pathname })
}

window.alert = (text) => {
  document.body.innerHTML = text
}

const newBill = {
  'id': 1,
  'vat': '80',
  'fileUrl': 'https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a',
  'status': 'accepted',
  'type': 'Hôtel et logement',
  'commentAdmin': 'ok',
  'commentary': 'séminaire billed',
  'name': 'encore',
  'fileName': 'preview-facture-free-201801-pdf-1.jpg',
  'date': '2004-04-04',
  'amount': 400,
  'email': 'a@a',
  'pct': 20,
}
describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then test page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByTestId('expense-type')).toBeTruthy()
      expect(screen.getByTestId('expense-name')).toBeTruthy()
      expect(screen.getByTestId('datepicker')).toBeTruthy()
      expect(screen.getByTestId('amount')).toBeTruthy()
      expect(screen.getByTestId('vat')).toBeTruthy()
      expect(screen.getByTestId('pct')).toBeTruthy()
      expect(screen.getByTestId('commentary')).toBeTruthy()
      expect(screen.getByTestId('file')).toBeTruthy()
    })
  })

  describe('When bill data is passed to NewBill page', () => {
    test('then change file', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })

      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(
        (e) => bill.handleChangeFile(e))
      file.addEventListener('click', handleChangeFile)

      userEvent.click(file)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(document.body.innerHTML).
        toBe('Extension du fichier n\'est pas acceptée')
    })

    test('then create Bill and submit form', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
      bill.createBill = (bill) => bill

      document.querySelector(`select[data-testid="expense-type"]`).value = newBill.type
      document.querySelector(`input[data-testid="expense-name"]`).value = newBill.name
      document.querySelector(`input[data-testid="amount"]`).value = newBill.amount
      document.querySelector(`input[data-testid="datepicker"]`).value = newBill.date
      document.querySelector(`input[data-testid="vat"]`).value = newBill.vat
      document.querySelector(`input[data-testid="pct"]`).value = newBill.pct
      document.querySelector(`textarea[data-testid="commentary"]`).value = newBill.commentary
      bill.fileUrl = newBill.fileUrl
      bill.fileName = newBill.fileName

      const submit = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(
        (e) => bill.handleSubmit(e))
      submit.addEventListener('click', handleSubmit)
      userEvent.click(submit)
      expect(handleSubmit).toHaveBeenCalled()
      expect(document.body.innerHTML).
        toBe('#employee/bills')
    })

    test('then create Bill and submit form error', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
      bill.createBill = (bill) => true
      const submit = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(
        (e) => bill.handleSubmit(e))
      submit.addEventListener('click', handleSubmit)

      userEvent.click(submit)
      expect(handleSubmit).toHaveBeenCalled()
      expect(document.body.innerHTML).
        toBe('Fichier n\'est pas acceptée')
    })

    test('then add new bills', async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      })
      expect(await bill.createBill(newBill)).toBeUndefined()

    })
    test('then add new bills from mock', async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
      bill.createBill = async (newBill) => {
        jest.spyOn(firebase, 'post')
        return await firebase.post(newBill)
      }
      expect(await bill.createBill(newBill)).
        toBe(`The bill has been added with id: ${newBill.id}`)

    })
  })
})
