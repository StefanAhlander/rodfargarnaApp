import {
  elements
} from '../views/base';

function renderProperties() {
  if (!state.customerData.properties) return '';

  let p = state.customerData.properties;

  let markup = '';

  for (let i = 0; i < p.length; i++) {
    let property = p[i];
    markup += renderProperty(property, i);
  }

  return markup;
}

function renderProperty(p, i) {
  return `
  <div class="row p-2 mb-1" style="background-color: #eee">

    <div class="col-sm">
      <div class="form-group">
        <label for="p${i}_street_1">Gatuadress, rad ett</label>
        <input type="text" class="form-control" id="p${i}_street_1" value="${p.street_1}">
      </div>
      <div class="form-group">
        <label for="p${i}_street_2">Gatuadress, rad två</label>
        <input type="text" class="form-control" id="p${i}_street_2" value="${p.street_2}">
      </div>
    </div>

    <div class="col-sm">
      <div class="form-group">
        <label for="p${i}_postalcode">Postnummer</label>
        <input type="text" class="form-control" id="p${i}_postalcode" value="${p.postalcode}">
      </div>
      <div class="form-group">
        <label for="p${i}_city">Ort</label>
        <input type="text" class="form-control" id="p${i}_city" value="${p.city}">
      </div>
    </div>
  </div>`
}

function renderNotes() {
  if (!state.customerData.notes) return '';
  if (state.customerData.notes.length > 1) {
    let temp = state.customerData.notes.sort((a, b) => b.noteId - a.noteId);
    state.customerData.notes = temp;
  }

  let n = state.customerData.notes;

  let markup = '';

  for (let i = 0; i < n.length; i++) {
    let note = n[i];
    markup += renderNote(note, i);
  }
  return markup;
}

function renderNote(n, i) {
  return `
  <div class="p-2 mb-1" style="background-color: #eee">
    <h6 id="n${i}_addedwhen">${n.addedWhen}</h6>
    <p id="n${i}_note">${n.note}</p>
  </div>`
}

function renderNoteForm(n, i) {
  return `
  <div class="p-2 mb-1" style="background-color: #eee">
    <h6 id="n${i}_addedwhen">${n.addedWhen}</h6>
    <textarea rows="4" style="width: 100%" id="n${i}_note" name="n${i}_note"></textarea>
  </div>`
}
export const renderCustomerView = (customer) => {

  const markup = `
  <div class="d-flex mb-1">
    <button type="button" id="back-button" class="btn btn-info btn-lg mr-auto"><i class="fas fa-backward"></i> Tillbaka</button>
    <button type="button" id="spara" class="btn btn-success btn-lg ml-auto">Uppdatera/Spara <i class="fas fa-save"></i></button>
  </div>
  <div id="contactCard" class="card">
    <div class="card-header">
      <h4>${customer.contactId}</h4>
    </div>
    <div class="card-body">
      <form>
        <div class="row">

          <div class="col-sm">

            <div class="form-group">
              <label for="firstname">Förnamn</label>
              <input type="text" class="form-control" id="firstname" value="${customer.firstName}">
            </div>
            <div class="form-group">
              <label for="lastname">Efternamn</label>
              <input type="text" class="form-control" id="lastname" value="${customer.lastName}">
            </div>
            <div class="form-group">
              <label for="street_1">Gatuadress, första raden</label>
              <input type="text" class="form-control" id="street_1" value="${customer.street_1}">
            </div>
            <div class="form-group">
              <label for="street_2">Gatuadress, andra raden</label>
              <input type="text" class="form-control" id="street_2" value="${customer.street_2}">
            </div>
            <div class="form-group">
              <label for="postalcode">Postnummer</label>
              <input type="text" class="form-control" id="postalcode" value="${customer.postalcode}">
            </div>
            <div class="form-group">
              <label for="city">Ort</label>
              <input type="text" class="form-control" id="city" value="${customer.city}">
            </div>

          </div>

          <div class="col-sm">

            <div class="form-group">
              <label for="phone_1">Primärt telefonnummer</label>
              <input type="text" class="form-control" id="phone_1" value="${customer.phone_1}">
            </div>
            <div class="form-group">
              <label for="phone_2">Sekundärt telefonnummer</label>
              <input type="text" class="form-control" id="phone_2" value="${customer.phone_2}">
            </div>
            <div class="form-group">
              <label for="email">E-postadress</label>
              <input type="text" class="form-control" id="email" value="${customer.email}">
            </div>

            <div style="background-color: #eee; border: 1px solid #ddd;" class="p-2">
              <div class="form-group">
                <label for="extracontact">Andrahands kontaktperson</label>
                <input type="text" class="form-control" id="extracontact" value="${customer.extraContact}">
              </div>
              <div class="form-group">
                <label for="extracontactphone">Telefonnummer</label>
                <input type="text" class="form-control" id="extracontactphone" value="${customer.extraContactPhone}">
              </div>
              <div class="form-group">
                <label for="extracontactemail">E-postadress</label>
                <input type="text" class="form-control" id="extracontactemail" value="${customer.extraContactEmail}">
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>


    <div class="card-header">
      <h4>Fastigheter <button id="add-property" class="btn btn-link"><i class="fas fa-plus-square fa-3x"></i></button></h4>
    </div>
    
    <div id="properties" class="card-body">
      ${renderProperties()}
    </div>

    <div class="card-header">
      <h4>Anteckningar <button id="add-note" class="btn btn-link"><i class="fas fa-plus-square fa-3x"></i></button></h4>
    </div>
    
    <div id="notes" class="card-body">
      ${renderNotes()}
    </div>
  </div>

  `;

  elements.app.innerHTML = markup;
};

export const renderNewPropertyForm = () => {
  if (state.customerData.properties === undefined) state.customerData.properties = [];

  let index = state.customerData.properties.length;
  let property = {
    street_1: '',
    street_2: '',
    postalcode: '',
    city: '',
    propertyId: new Date().getTime()
  }
  state.customerData.properties.push(property);
  let markup = renderProperty(property, index);
  document.getElementById('properties').insertAdjacentHTML('afterbegin', markup);
  console.log(markup);
};

export const renderNewNoteForm = () => {
  if (state.customerData.notes === undefined) state.customerData.notes = [];

  let index = state.customerData.notes.length;
  let note = {
    addedWhen: new Date().toLocaleDateString(),
    note: '',
    noteId: new Date().getTime()
  }
  state.customerData.notes.push(note);
  let markup = renderNoteForm(note, index);
  document.getElementById('notes').insertAdjacentHTML('afterbegin', markup);
  console.log(markup);
  console.log(note.addedWhen, note.note, note.noteId);
};