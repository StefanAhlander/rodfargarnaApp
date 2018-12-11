import * as firebase from 'firebase';

import {
  elements
} from './base';

function createRow(customer) {
  return `<tr data-id="${customer.contactId}">
    <th scope = "row"> ${customer.contactId}</th>
    <td>${customer.firstName} ${customer.lastName}</td>
    <td>${customer.street_1}</td>
    <td>${customer.city}</td>
  </tr>`
}


export const renderNav = () => {
  const pages = Math.ceil(state.filteredArray.length / data.numCustomersPerPage);
  const navArray = [];
  for (let i = 1; i < pages + 1; i++) {
    navArray.push(`<button type="button" class="btn btn-secondary mr-2 mb-2 ${i == state.page ? 'active' : ''}" data-pagenumber="${i}">${i}</button>`);
  }
  const markup = `
      <nav id="pageNav" class = "btn-group">
        <ul>
          ${navArray.join('')}
        </ul>
      </nav>`;
  elements.app.insertAdjacentHTML('beforeend', markup);
}

export const removeList = () => {
  let listEl = document.getElementById('list');
  listEl.parentElement.removeChild(listEl);
}

export const removeNav = () => {
  let listEl = document.getElementById('pageNav');
  listEl.parentElement.removeChild(listEl);
}

export const renderListView = (customerList) => {
  const markup = `
    <div>
      <h2 > Rödfärgarna Kundregister </h2>
      <br>
      <div class="d-flex">
        <input id="filterInput" class="mr-auto" type = "text" placeholder = "Filtrera.." ><button id="nykund" class="btn btn-info btn-lg ml-auto">Ny kund <i class="fas fa-user-plus"></i></button>
      </div>
      <br>
    </div>
  `;

  elements.app.innerHTML = markup;
};

export const renderList = (customerList) => {
  const markup = `
    <div id = "list">
      <div class = "table-responsive">
        <table class = "table table-striped">
          <thead>
            <tr>
              <th scope = "col">Kundnummer</th>
              <th scope = "col">Namn</th>
              <th scope = "col">Adress</th>
              <th scope = "col">Ort</th>
            </tr>
          </thead>
          <tbody id="customerList">
            ${customerList.map(customer => createRow(customer)).join('')}
          </tbody>
        </table>
      </div>
    </div>`

  elements.app.insertAdjacentHTML('beforeend', markup);
}