import Data from './models/Data';

import * as listView from './views/listView';
import * as customerView from './views/customerView';
import * as signInView from './views/signInView';

// Skapa ett objekt för att hålla appens "state"
const state = {};
window.state = state;

const data = new Data();

// Automatisk inloggning för utveckling
/* data.signInUser('a@a.com', 'aaaaaa');
console.log('Ran auto login.'); */

// ###################################################
// ###################################################
// ###################################################

/* Funktion för att filtrera kundlistan utifrån vad som matats in
i filter-fältet.
Om färre än tre tecken har matats in görs ingen filtrering. */
function filterArray(customerArray) {
  return new Promise(function(resolve, reject) {
    let filter = state.filter || '';

    // Iterera igenom alla värden i objektet och leta efter matchning. Omvandla båda sidaor till lower case. Om ingen matchning så returnera false. Om matchning så retrunera true.
    function serchForMatch(customer) {
      for (let prop in customer) {
        if (
          customer[prop]
            .toString()
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
          return true;
      }
      return false;
    }

    // Filtrera kundarrayen
    let filteredArray = customerArray.filter(customer => {
      return serchForMatch(customer);
    });

    resolve((state.filteredArray = filteredArray));
  });
}

/* Funktion för att dela upp kundlistan utifrån antal kunder per sida och sidnummer. */
function paginateArray(filteredArray) {
  return new Promise(function(resolve, reject) {
    console.log(`aktuellt sidnummer: ${state.page}`);

    let startIndex = (state.page - 1) * data.numCustomersPerPage;
    let endIndex = state.page * data.numCustomersPerPage;
    resolve((state.paginatedArray = filteredArray.slice(startIndex, endIndex)));
  });
}

/* Funktion för att spara kunddata utifrån data i formulär på skärmen */
function saveCustomer(event) {
  // Hämta kunddata ur formulär
  event.stopImmediatePropagation();

  let cust = state.customerData;
  cust.city = document.getElementById('city').value;
  cust.email = document.getElementById('email').value;
  cust.extraContact = document.getElementById('extracontact').value;
  cust.extraContactEmail = document.getElementById('extracontactemail').value;
  cust.extraContactPhone = document.getElementById('extracontactphone').value;
  cust.firstName = document.getElementById('firstname').value;
  cust.lastName = document.getElementById('lastname').value;
  cust.phone_1 = document.getElementById('phone_1').value;
  cust.phone_2 = document.getElementById('phone_2').value;
  cust.postalcode = document.getElementById('postalcode').value;
  cust.street_1 = document.getElementById('street_1').value;
  cust.street_2 = document.getElementById('street_2').value;

  if (cust.properties) {
    for (let i = 0; i < cust.properties.length; i++) {
      cust.properties[i].city = document.getElementById(`p${i}_city`).value;
      cust.properties[i].postalcode = document.getElementById(
        `p${i}_postalcode`
      ).value;
      cust.properties[i].street_1 = document.getElementById(
        `p${i}_street_1`
      ).value;
      cust.properties[i].street_2 = document.getElementById(
        `p${i}_street_2`
      ).value;
    }
  } else {
    cust.properties = [];
  }

  if (cust.notes) {
    for (let i = 0; i < cust.notes.length; i++) {
      if (document.getElementById(`n${i}_note`).tagName.toLowerCase() === 'p') {
        cust.notes[i].note = document.getElementById(`n${i}_note`).innerHTML;
      } else {
        cust.notes[i].note = document.getElementById(`n${i}_note`).value;
      }
    }
  } else {
    cust.notes = [];
  }

  // Spara kunddata till databasen
  console.log(`Spara kund: ${state.customerId}`);
  data.saveCustomerData(cust).then(result => {
    state.customerDataList[state.customerId] = state.customerData;
    state.customerArray = undefined;
    customerController(state.customerId);
  });
}

// ###################################################
// ###################################################
// ###################################################
// Uppdatera UI utifrån given adress
const controlRoute = () => {
  // Ta reda på vilken sida som är aktuell och lagra denna i "state"
  let currentHash = (state.currentHash = location.hash.replace('#', ''));

  // Kontrollera om användaren har navigerat till login-sidan och om denne inte är inloggad. Om så visa login-sidan och starta login-controllern
  data.userIsLoggedIn().then(isLoggedIn => {
    console.log(`Användaren är inloggad? ${isLoggedIn}`);

    if (!isLoggedIn) {
      if (currentHash === 'signInView') {
        signInView.renderSignInView();
        signInController();
        return;
      } else {
        location.hash = 'signInView';
        return;
      }
    }

    // Kolla om aktuell sida är en kund-sida med kundnummer. Om så visa kund-sidan och starta kund-controller
    if (currentHash.startsWith('customer')) {
      let customerId = (state.customerId = currentHash.match(/[0-9]+\-[0-9]+/));
      // Om det inte finns ett kundnummer gå till listvyn.
      if (!customerId) {
        location.hash = 'listView';
        return;
      }
      console.log(`Kundid: ${customerId}`);
      customerController(customerId);
      return;
    }

    // Om adressen inte är till login eller en kund kontrollera om den är till en fördefinierad sida. Om inte gå till listvyn.
    switch (currentHash) {
      case 'listView':
        listController();
        break;
      default:
        location.hash = 'listView';
    }
  });
};

// ###################################################
// ###################################################
// ###################################################
// signInController
const signInController = () => {
  document.getElementById('signin').addEventListener('click', SignIn, false);

  function SignIn(event) {
    event.preventDefault();
    // For development
    /*    location.hash = 'listView';
       return; */

    var email = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    data.signInUser(email, password).then(() => {
      location.hash = 'indexView';
    });
  }
};

// ###################################################
// ###################################################
// ###################################################
// listController
const listController = () => {
  state.page = state.page || 1;

  function makeList() {
    data
      .getCutomerDataListAsArray()
      .then(customerArray => {
        // filtrera
        return filterArray(customerArray);
      })
      .then(filteredArray => {
        // paginera
        return paginateArray(filteredArray);
      })
      .then(paginatedArray => {
        // render och sätt eventhanterare
        listView.renderList(paginatedArray);
        listView.renderNav();
        document
          .getElementById('filterInput')
          .addEventListener('keyup', function filterHandeler(event) {
            event.stopImmediatePropagation();
            document
              .getElementById('filterInput')
              .removeEventListener('keyup', filterHandeler);
            console.log(`Ändring av filter input, filter är: ${state.filter}`);
            state.filter = event.target.value;
            state.page = 1;
            listView.removeList();
            listView.removeNav();
            makeList();
            document.getElementById('filterInput').focus();
          });

        document
          .getElementById('pageNav')
          .addEventListener('click', function navHandeler(event) {
            event.stopImmediatePropagation();
            let el = event.target.closest('button');

            if (!el) return;

            document.removeEventListener('click', navHandeler);
            state.page = el.dataset.pagenumber;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            listView.removeList();
            listView.removeNav();
            makeList();
          });

        document
          .getElementById('customerList')
          .addEventListener('click', function goToCustomerPage(event) {
            const chosenCustomer = event.target.closest('tr').dataset.id;
            state.filter = '';
            state.customer = chosenCustomer;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            location.hash = `customer${chosenCustomer}`;
          });

        document
          .getElementById('nykund')
          .addEventListener('click', function addCustomer(event) {
            let currentMax = state.customerArray[0].contactId;
            let currentYear = new Date().getFullYear();
            let match = currentMax.match(/([0-9]+)\-([0-9]+)/);
            let firstPart = match[1];
            let secondPart = match[2];

            if (Number(currentYear) > Number(match[1])) {
              firstPart = currentYear;
              secondPart = '0001';
            } else {
              secondPart++;
            }
            secondPart = secondPart.toString().padStart(4, '0');

            let newId = `${firstPart}-${secondPart}`;

            state.customerId = newId;
            state.customerData = Object.create(null);
            state.customerData.addedWhen = new Date().toLocaleDateString();
            state.customerData.city = '';
            state.customerData.contactId = newId;
            state.customerData.email = '';
            state.customerData.extraContact = '';
            state.customerData.extraContactEmail = '';
            state.customerData.extraContactPhone = '';
            state.customerData.firstName = '';
            state.customerData.lastName = '';
            state.customerData.phone_1 = '';
            state.customerData.phone_2 = '';
            state.customerData.postalcode = '';
            state.customerData.street_1 = '';
            state.customerData.street_2 = '';
            state.customerData.properties = [];
            state.customerData.notes = [];

            state.customerDataList[newId] = state.customerData;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            location.hash = `customer${newId}`;
          });
      });
  }

  listView.renderListView();
  makeList();
};

// ###################################################
// ###################################################
// ###################################################
// customerController
const customerController = customerId => {
  data.getCustomerFromId(customerId).then(customerData => {
    customerView.renderCustomerView(customerData);

    document
      .getElementById('back-button')
      .addEventListener('click', function goBack() {
        window.history.back();
      });

    document
      .getElementById('add-property')
      .addEventListener('click', function addPropertyForm(event) {
        customerView.renderNewPropertyForm();
      });

    document
      .getElementById('add-note')
      .addEventListener('click', function addNoteForm(event) {
        customerView.renderNewNoteForm();
      });

    document.getElementById('spara').addEventListener('click', saveCustomer);
  });
};

// ###################################################
// ###################################################
// ###################################################
// Sätt eventhantering
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRoute)
);
