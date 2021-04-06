let dsu = "";
let user = "";
let courier = "";
let userLoggedIn = false;
let ssi = "loading...";
let modaltitle = "";
let modalmessage = "";


const opendsu = require("opendsu");
const resolver = opendsu.loadApi("resolver");
const keyssispace = opendsu.loadApi("keyssi");
const seedSSI = keyssispace.createSeedSSI('default');


async function createDSU() {
    await new Promise((resolve, reject) => {
        try {
            resolver.createDSU(seedSSI, (err, dsuInstance) => {

                dsu = dsuInstance;
                resolve();

            });
        } catch (err) {
            reject(err);
        }
    }).then(() => {
        dsu.getKeySSIAsString((err, dsussi) => { console.log(dsussi) });
        console.log("DSU", dsu);
        console.log("Creation SSI", dsu.getCreationSSI());
        ssi = dsu.getCreationSSI();
    }).catch((err) => {
        console.error(err);
    });
}

function getSSI() {
    return ssi;
}

function loadDSU(ssi) {
    try {
        resolver.loadDSU(ssi, (err, dsuInstance) => {

            dsu = dsuInstance;
            console.log("DSU loaded", dsu);
            modaltitle = "Success";
            modalmessage = "DSU has been loaded";


        })
    } catch (err) {
        console.error(err);
        modaltitle = "Error";
        modalmessage = "DSU has NOT been loaded, check console";
    }


}

function getDSU() {
    return dsu;
}

async function setUser(courierParameter, userParameter) {
    await new Promise((resolve, reject) => {
        let loginArray = [courierParameter, userParameter];
        dsu.writeFile('/userdetails', loginArray.toString(), (err) => {
            if (err) {
                reject(err);
            } else {
                courier = loginArray[0];
                user = loginArray[1];
                resolve(loginArray + " saved as login.");
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

function getCourier() {
    return courier;
}

function logOut() {
    user = "";
    userLoggedIn = false;
}

function isUserLoggedIn() {
    return userLoggedIn;
}

async function createKit(kit) {
    await new Promise((resolve, reject) => {
        dsu.listFiles('/', (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    }).then((files) => {
        console.log();
        if (kit.id == "") {
            kit.id = (files.length - 2).toString();
        }
    }).catch((message) => {
        console.log(message);
    });
    await new Promise((resolve, reject) => {
        dsu.writeFile('/kit' + kit.id, JSON.stringify(kit), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve("Kit created with ID: " + kit.id);

            }
        })
    }).then((message) => {
        console.log();
        kit.id = "";
    }).catch((message) => {
        console.log(err);
    })

}

function getKits() {
    let kits = [];
    dsu.listFiles('/', (err, files) => {
        console.log(files);
        files.forEach((kit, index) => {
            if (kit != "dsu-metadata-log" && kit != "userdetails") {
                /* console.log(`i:${index} | Kit:`, kit); */
                dsu.readFile('/' + kit, (err, buffer) => {
                    const dataObject = JSON.parse(buffer.toString());
                    /*   console.log(dataObject); */
                    kits.push(dataObject);
                });
            }

        });
        console.log(kits);
    });
    /*   await new Promise(resolve => setTimeout(resolve, 200)); */
    return kits;
}

function getKit(id) {
    let kit = "";
    dsu.readFile('/kit' + id, (err, buffer) => {
        const dataObject = JSON.parse(buffer.toString());
        /*   console.log(dataObject); */
        kit = dataObject;
    });
    return kit;
}

function getModal() {
    console.log(modaltitle, modalmessage);
    return [modaltitle, modalmessage];
}

export default {
    createDSU,
    getSSI,
    loadDSU,
    getDSU,
    setUser,
    getUser,
    getCourier,
    logOut,
    isUserLoggedIn,
    createKit,
    getKits,
    getKit,
    getModal
}