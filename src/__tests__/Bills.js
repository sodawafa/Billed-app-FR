import { screen } from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
import { bills } from '../fixtures/bills.js'
import Bills from '../containers/Bills.js'
import { localStorageMock } from '../__mocks__/localStorage'
import DashboardFormUI from '../views/DashboardFormUI'
import { ROUTES } from '../constants/routes'
import Dashboard from '../containers/Dashboard'
import userEvent from '@testing-library/user-event'

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

describe(
  'Given I am connected as Employee and I am on Bills page and I clicked on a bill',
  () => {
    describe('When I click on the icon eye', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage',
          { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
        const html = BillsUI({ data: [bills[0]] })
        console.log(bills[0])
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

        const handleClickIconEye = jest.fn(billsClass.handleClickIconEye)

        const eye = screen.getByTestId('icon-eye')
        //expect(eye).toBeUndefined();
        eye.addEventListener('click', handleClickIconEye(eye))
        userEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()
        const modale = screen.getByTestId('modaleFileEmployee')
        expect(modale).toBeTruthy()
      })
    })
  })
