import { fireEvent, screen } from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
import { bills } from '../fixtures/bills.js'
import Bills from '../containers/Bills.js'
import { localStorageMock } from '../__mocks__/localStorage'
import DashboardFormUI from '../views/DashboardFormUI'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import Dashboard from '../containers/Dashboard'
import userEvent from '@testing-library/user-event'
import firebase from '../__mocks__/firebase'
import DashboardUI from '../views/DashboardUI'
import NewBillUI from '../views/NewBillUI'

window.open = (url, target) => {
  document.body.innerHTML = url
}
//window.open = jest.fn();
//window.open = () => {};  // provide an empty implementation for window.open
//window.open.mockClear();

/*test Bills date et trie de Bills*/
describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test('Then bills should be ordered from earliest to latest', () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(
        /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).
        map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    describe('When I click on new bill', () => {
      test('Then see new bill page', () => {
        Object.defineProperty(window, 'localStorage',
          { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
        const html = BillsUI({ data: [bills[0]] })
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null

        const billsClass = new Bills({
          document,
          onNavigate,
          firestore,
          bills,
          localStorage: window.localStorage,
        })
        const newBillButton = screen.getByTestId('btn-new-bill')
        //const handleClickNewBill = jest.fn((e) => Bills.handleClickNewBill(e))
        const handleClickNewBill = jest.fn(billsClass.handleClickNewBill)
        newBillButton.addEventListener('click', handleClickNewBill)
        fireEvent.click(newBillButton)
        /*userEvent.click(newBillButton)*/
        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.queryByTestId('form-new-bill')).toBeTruthy()
        const htmlNewBillUI = document.body.innerHTML
        document.body.innerHTML = NewBillUI()
        expect(document.body.innerHTML).toBe(htmlNewBillUI)
      })
    })
  })
})

/* Test Bills page avec les données */
describe(
  'Given I am connected as Employee and I am on Bills page and I clicked on a bill',
  () => {

    describe('When I click on the icon eye to show image', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage',
          { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
        const html = BillsUI({ data: [bills[0]] })
        document.body.innerHTML = html
        /*const html = DashboardFormUI(bills[0])
        document.body.innerHTML = html*/
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null

        const billsClass = new Bills({
          document,
          onNavigate,
          firestore,
          bills,
          localStorage: window.localStorage,
        })

        /*test click sur image et modale */
        const handleClickIconEye = jest.fn(billsClass.handleClickIconEye)

        const eye = screen.getByTestId('icon-eye')
        //expect(eye).toBeUndefined();
        //expect(document.body.innerHTML).toBe('')
        eye.addEventListener('click', handleClickIconEye(eye))
        fireEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = screen.getByTestId('modaleFileEmployee')
        expect(modale).toBeTruthy()
        //expect(modale.querySelector('.modal-body').innerHTML.length).toBeGreaterThan(0)
      })
    })

    describe('When I click on the icon eye to show pdf', () => {
      test('new page must be open', () => {
        Object.defineProperty(window, 'localStorage',
          { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
        const html = BillsUI({ data: [bills[1]] })
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null
        const billsClass = new Bills({
          document,
          onNavigate,
          firestore,
          bills,
          localStorage: window.localStorage,
        })
        /*test click sur image et modale */
        const handleClickIconEye = jest.fn(billsClass.handleClickIconEye)

        const eye = screen.getByTestId('icon-eye')
        //expect(eye).toBeUndefined();
        eye.addEventListener('click', handleClickIconEye(eye))
        fireEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()
        //expect(screen.queryByTestId('modaleFileEmployee')).toBeNull()
        //expect(screen.queryByTestId('window-target')).toBe('_blank')
        /*const newWindowUrl = document.body.innerHTML
        document.body.innerHTML = bills[1].fileUrl
        expect(document.body.innerHTML).toBe(newWindowUrl)*/
      })
    })

  })

// test d'intégration GET
describe('Given I am a user connected as Employee', () => {
  describe('When I navigate to Bills', () => {
    test('fetches bills from mock API GET', async () => {
      const getSpy = jest.spyOn(firebase, 'get')
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test('fetches bills from an API and fails with 404 message error',
      async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error('Erreur 404')),
        )
        const html = BillsUI({ error: 'Erreur 404' })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
    test('fetches messages from an API and fails with 500 message error',
      async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error('Erreur 500')),
        )
        const html = BillsUI({ error: 'Erreur 500' })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
  })
})

