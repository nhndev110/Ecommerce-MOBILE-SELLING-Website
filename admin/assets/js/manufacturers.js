'use strict'

import { CallAjax, Loading, Modal, StatusNotification } from './module/index.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const controlCheckbox = $('#control__checkbox--all')
const tbody = $('.table tbody')
const reloadBtn = $('.control__icon.btn-reload')
const createBtn = $('.control__icon.btn-create')
const modalContainer = $('.modal-container')

let checkboxRows = [...$$('.table__col--checkbox')]

const App = {
  manufacturers: {},
  fetchManufacturers: function () {
    const handleData = response => {
      // this.render(JSON.parse(response))
      this.manufacturers = response
      console.log(this.manufacturers)
    }

    CallAjax({ url: './load-data.php', handleData })
  },
  render: function (response) {
    if (response.statusCode === 200) {
      const htmlRows = response.data.map(
        row => `
          <tr>
            <td class="table__row--center">
              <label class="table__col flex-center" for="table-col-${row['id']}">
                <input data-id=${row['id']} type="checkbox" name="" class="table__col--checkbox" id="table-col-${row['id']}">
              </label>
            </td>
            <td class="table__row--center">${row['id']}</td>
            <td class="table__row--center">${row['name']}</td>
            <td class="vertical-align">${row['address']}</td>
            <td class="table__row--center">${row['phone']}</td>
            <td class="table__row--center">
              <button class="table__col flex-center" title="Chỉnh Sửa" data-id="${row['id']}">
                <ion-icon name="color-wand"></ion-icon>
              </button>
            </td>
            <td class="table__row--center">
              <button class="table__col btn-delete flex-center" title="Xóa" data-type="table" data-id="${row['id']}">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </td>
          </tr>
        `
      )
      tbody.innerHTML = htmlRows.join('')
    }
  },
  // Checkbox All Checked
  handleCheckedAll: function () {
    controlCheckbox.onchange = function () {
      const _this = this
      checkboxRows.forEach(element => {
        element.checked = _this.checked

        let idIdx = checkboxCheckeds.ids.indexOf(element.dataset.id)
        let elementIdx = checkboxCheckeds.elements.indexOf(
          element.closest('tr')
        )
        if (_this.checked === true) {
          if (idIdx == -1 && elementIdx == -1) {
            checkboxCheckeds.elements.push(element.closest('tr'))
            checkboxCheckeds.ids.push(element.dataset.id)
          }
        } else {
          checkboxCheckeds.elements.shift()
          checkboxCheckeds.ids.shift()
        }
      })
    }
  },
  handleDelete: function () {
    // ============== Xử lí khi ở trong form vẫn chưa xong ==============
    $$('.btn-delete').forEach(element => {
      element.onclick = function () {
        Loading(
          '.table tbody',
          '../assets/img/loading2.gif',
          'white',
          '100px',
          'center 0',
          '16'
        )

        const btnType = this.dataset.type

        switch (btnType) {
          case 'form': {
            const btnId = this.dataset.id

            CallAjax({
              url: '../manufacturers/process-delete.php',
              data: { id: btnId },
              titleError: 'Thất Bại',
              titleSuccess: 'Thành Công',
              contentSuccess: 'Bạn đã xóa 1 nhà sản xuất !',
            })
            break
          }
          case 'table': {
            // Get id of button
            const btnId = this.dataset.id

            // Handle when success delete
            const handleSuccess = () => this.closest('tr').remove()

            // Show notification when success delete
            const handleDelete = response => {
              StatusNotification({
                response: JSON.parse(response),
                handleSuccess,
                subMessage: 'nhà sản xuất',
              })
              $('.loading') && $('.loading').remove()
            }

            // Call ajax do get response data (status code & status message)
            if (confirm('Bạn muốn xóa nhà sản xuất này ???'))
              CallAjax({
                url: '../manufacturers/process-delete.php',
                data: { id: btnId },
                handleData: handleDelete,
              })
            else $('.loading') && $('.loading').remove()
            break
          }
          case 'control': {
            // Handle when success delete
            const handleSuccess = () => {
              checkboxCheckeds.elements.forEach(element => {
                element.remove()
              })
              _this.handleEventAgain()
            }

            // Show notification when success delete
            const handleDelete = response => {
              StatusNotification({
                response: JSON.parse(response),
                handleSuccess,
                subMessage: 'nhà sản xuất',
              })
              $('.loading') && $('.loading').remove()
            }

            // Check valid call ajax do get response data
            // (status code & status message)
            if (
              typeof checkboxCheckeds.ids.length === 'number' &&
              checkboxCheckeds.ids.length > 0 &&
              confirm('Bạn muốn xóa những nhà sản xuất bạn đã chọn ???')
            ) {
              CallAjax({
                url: '../manufacturers/process-delete.php',
                data: { id: checkboxCheckeds.ids },
                handleData: handleDelete,
              })
            } else {
              if (typeof checkboxCheckeds.ids.length !== 'number')
                alert('Error: datatype invalid !!')
              if (checkboxCheckeds.ids.length <= 0)
                alert('Bạn chưa chọn nhà sản xuất nào !!!')
              $('.loading') && $('.loading').remove()
            }

            break
          }

          default:
            alert('Error: NOT FIND TYPE OF BUTTON DELETE')
            $('.loading') && $('.loading').remove()
        }
      }
    })
  },
  handleEventAgain: function () {
    const _this = this
    checkboxRows = [...$$('.table__col--checkbox')]

    let checkboxCheckeds = {
      ids: [],
      elements: [],
    }

    // Checkbox only one Checked
    checkboxRows.forEach(element => {
      element.onchange = e => {
        const _this = e.target
        if (_this.checked === true) {
          checkboxCheckeds.elements.push(_this.closest('tr'))
          checkboxCheckeds.ids.push(_this.dataset.id)
        } else {
          let idIdx = checkboxCheckeds.ids.indexOf(_this.dataset.id)
          let elementIdx = checkboxCheckeds.elements.indexOf(
            _this.closest('tr')
          )
          checkboxCheckeds.ids.splice(idIdx, 1)
          checkboxCheckeds.elements.splice(elementIdx, 1)
        }

        let cntTrue = 0
        checkboxRows.forEach(element => element.checked && ++cntTrue)
        cntTrue == checkboxRows.length
          ? (controlCheckbox.checked = true)
          : (controlCheckbox.checked = false)
      }
    })
  },
  handleEvent: function () {
    this.handleEventAgain()

    const _this = this

    reloadBtn.onclick = function () {
      Loading(
        '.table',
        '../assets/img/loading2.gif',
        'white',
        '100px',
        'center 0',
        '16'
      )

      const handleReload = response => {
        const data = JSON.parse(response)
        _this.render(data)
        controlCheckbox.checked = false
        $('.loading') && $('.loading').remove()
      }

      CallAjax({
        url: '../manufacturers/load-data.php',
        handleData: handleReload,
      })
    }

    createBtn.onclick = function () {
      modalContainer.style.display = 'block'

      let formData = {}

      const handleSuccess = () => {
        const htmlRows = document.createElement('tr')
        htmlRows.innerHTML = `
          <td class="table__row--center">
            <label class="table__col flex-center" for="table-col-${formData['idInsert']}">
              <input data-id="${formData['idInsert']}" type="checkbox" name="" class="table__col--checkbox" id="table-col-${formData['idInsert']}">
            </label>
          </td>
          <td class="table__row--center">${formData['idInsert']}</td>
          <td class="table__row--center">${formData['name']}</td>
          <td class="vertical-align">${formData['address']}</td>
          <td class="table__row--center">${formData['phone']}</td>
          <td class="table__row--center">
            <button class="table__col flex-center" title="Chỉnh Sửa" href="../manufacturers/form_update.php?id=${formData['idInsert']}">
              <ion-icon name="color-wand" role="img" class="md hydrated" aria-label="color wand"></ion-icon>
            </button>
          </td>
          <td class="table__row--center">
            <button class="table__col btn-delete flex-center" title="Xóa" data-type="table" data-id="${formData['idInsert']}">
              <ion-icon name="trash-outline" role="img" class="md hydrated" aria-label="trash outline"></ion-icon>
            </button>
          </td>
        `

        tbody.appendChild(htmlRows)

        $$('.form-insert .form-input').forEach(e => (e.value = null))

        modalContainer.style.display = 'none'

        _this.handleEventAgain()
      }

      const handleResponse = response => {
        response = JSON.parse(response)
        Object.assign(formData, { idInsert: response.idInsert })

        StatusNotification({
          response,
          handleSuccess,
          subMessage: 'nhà sản xuất',
        })

        $('.loading') && $('.loading').remove()
      }

      const handleDataModal = () => {
        $('.btn-submit').onclick = () => {
          Loading(
            '#wrapper',
            '../assets/img/loading2.gif',
            'black',
            '100px',
            'center'
          )

          $$('.form-insert .form-input').forEach(
            e => (formData[e.name] = e.value)
          )

          CallAjax({
            url: '../manufacturers/process-insert.php',
            data: formData,
            handleData: handleResponse,
          })
        }

        $('.btn-reset').onclick = () => {
          $$('.form-insert .form-input').forEach(e => (e.value = null))
        }
      }

      Modal({ handleModal: handleDataModal })
    }
  },
  start: function () {
    this.fetchManufacturers()

    this.handleEvent()
  },
}

App.start()
