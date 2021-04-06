let dsu = "";
let user = "";
let userLoggedIn = false;

function createDSU() {

    const opendsu = require("opendsu");
    const resolver = opendsu.loadApi("resolver");
    const keyssispace = opendsu.loadApi("keyssi");
    const seedSSI = keyssispace.createSeedSSI('default');
    resolver.createDSU(seedSSI, (err, dsuInstance) => {
        if (err) {
            console.log(err);
        }
        dsu = dsuInstance;
    });
}

function getDSU() {
    return dsu;
}

async function setUser(login) {
    await new Promise((resolve, reject) => {
        let loginString = JSON.stringify(login);
        dsu.writeFile('/userdetails', loginString, (err) => {
            if (err) {
                reject(err);
            } else {
                user = loginString;
                resolve(loginString + " saved as login.");
            }
        });
    }).then((message) => {
        console.log('success', message);
        userLoggedIn = true;
    }).catch((message) => {
        console.log("error", message);
    });


}

function getUser() {
    /*   let username = "dsads";
      dsu.readFile('/userdetails', (err, buffer) => {
          let dataObject = JSON.parse(buffer.toString());
          console.log("dataobject:", dataObject);
          username = dataObject;
          if (err) {
              console.log(err);
          }
          console.log("username:", username);
          return username;
      }); */
    return user;

}

function logOut() {
    user = "";
    userLoggedIn = false;
}

function isUserLoggedIn() {
    return userLoggedIn;
}

function loadDSU() {
    /* resolver.loadDSU(keySSI, (err, dsu) => {
        if (err) {
            console.log(err);
        }
    }); */
}

export default {
    createDSU,
    getDSU,
    setUser,
    getUser,
    logOut,
    isUserLoggedIn,
    loadDSU
}