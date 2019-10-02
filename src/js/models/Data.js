import * as firebase from 'firebase';
import {
  appConfig
} from '../config';

export default class Data {

  constructor() {
    // Sätt antal kunder per sida
    this.numCustomersPerPage = appConfig.numCustomersPerPage;

    // Firebase konfiguration
    const firebaseConfig = appConfig.firebaseConfig;


    //Initialisera Firebase och lagra firebase i state
    firebase.initializeApp(firebaseConfig);
    this.firebase = firebase;

    // Skapa referens till databasen hos Firebase och lagra i state
    this.firebaseDb = firebase.database();
    window.data = this;
  }

  signInUser(email, password) {
    // Sign in with email and pass.
    // [START authwithemail]
    return new Promise(function (resolve, reject) {
      resolve(firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          // [END_EXCLUDE]
        })
        // [END authwithemail]);
      );
    });
  }

  userIsLoggedIn() {
    // Returnera true om användaren är inloggad
    return new Promise(function (resolve, reject) {
      resolve(firebase.auth().currentUser);
    });
  }

  async getNumberOfPagesWithCustomers() {
    // Dela längden på arrayen med antal kunder per sida
    let customerArray = state.customerArray ? state.customerArray : await this.getCutomerDataListAsArray();

    return Math.ceil(customerArray.length / data.numCustomersPerPage);
  }

  getCustomerDataList() {
    // Ladda ner kunddata från Firebase och lagra i state.customerDataList, returnera promise med kunddata
    return new Promise(function (resolve, reject) {
      if (state.customerDataList) resolve(state.customerDataList);
      data.firebaseDb.ref('customers').orderByKey().once('value').then(function (snapshot) {
        resolve(state.customerDataList = snapshot.val());
      });
    });
  }

  getCutomerDataListAsArray() {
    // Returnera promise med kunddata som en array
    return new Promise(function (resolve, reject) {
      if (state.customerArray) resolve(state.customerArray);

      data.getCustomerDataList().then((customerData) => {
        let customerArray = [];
        // Iterera över kunddata och lagra kunderna som objekt i array
        for (let cust in customerData) {
          if (customerData.hasOwnProperty(cust)) {
            customerArray.push(customerData[cust]);
          }
        }
        resolve(state.customerArray = customerArray.reverse());
      });
    });
  }

  getCustomerFromId(customerId) {
    return new Promise(function (resolve, reject) {
      data.getCustomerDataList().then(() => {
        resolve(state.customerData = state.customerDataList[customerId]);
      });
    });
  }

  saveCustomerData(customerData) {
    return new Promise(function (resolve, reject) {
      resolve(firebase.database().ref('customers/' + customerData.contactId).set(customerData));
    });
  }

}
