import { screen } from '@testing-library/dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { localStorageMock } from '../__mocks__/localStorage'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import userEvent from '@testing-library/user-event'
import firebase from '../__mocks__/firebase'
import firestore from '../app/Firestore.js'

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then ...', () => {
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

  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee',
  }))

  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }
  const firestore = null

  window.alert = (text) => {
    document.body.innerHTML = text
  }

  describe('When bill data is passed to NewBill page', () => {

    test('then...', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
    })

    test('then...', () => {
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

    test('then...', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
      const submit = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(
        (e) => bill.handleSubmit(e))
      submit.addEventListener('click', handleSubmit)
      userEvent.click(submit)
      expect(handleSubmit).toHaveBeenCalled()
      expect(document.body.innerHTML).
        toBe('Fichier n\'est pas acceptée')
    })

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

    test('then add bills from mock', async () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      })
      await bill.createBill(newBill)
      const postSpy = jest.spyOn(firebase, 'post')
      expect(await firebase.post(newBill)).
        toBe(`The bill has been added with id: ${newBill.id}`)
      expect(postSpy).toHaveBeenCalled()
    })
  })
})
