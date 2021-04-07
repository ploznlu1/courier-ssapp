import DSU_SSI from "./../../DSU_SSI.js";

let dsu = "";
let user = "";
let courier = "";
let userLoggedIn = false;
let modaltitle = "";
let modalmessage = "";


const opendsu = require("opendsu");
const resolver = opendsu.loadApi("resolver");


/* sync function createDSU() {
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
} */

function loadDSU() {
    try {
        resolver.loadDSU(DSU_SSI.getSSI(), (err, dsuInstance) => {
            dsu = dsuInstance;
            console.log("DSU loaded", dsu);
            setModal("Sucess", "DSU has been loaded");
        })
    } catch (err) {
        console.error(err);
        setModal("Error", "DSU has NOT been loaded, check console");
    }


}

function getDSU() {
    return dsu;
}

async function setUser(courierParameter, userParameter) {
    await new Promise((resolve, reject) => {
        let loginArray = [courierParameter, userParameter];
        dsu.writeFile("/userdetails", loginArray.toString(), (err) => {
            if (err) {
                reject(err);
            } else {
                courier = loginArray[0];
                user = loginArray[1];
                resolve(loginArray + " saved as login.");
            }
        });
    }).then((message) => {
        console.log("success", message);
        userLoggedIn = true;
    }).catch((message) => {
        console.log("error", message);
    });


}

function getUser() {
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
        dsu.listFiles("/", (err, files) => {
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
        dsu.writeFile("/kit" + kit.id, JSON.stringify(kit), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve("Kit " + kit.kitid + " was created.");

            }
        })
    }).then((message) => {
        setModal("Success", message);
        kit.id = "";
    }).catch((err) => {
        setModal("Error", "Kit was NOT created, check console");
        console.log(err);
    })

}

async function getKits() {
    let kits = [];
    await dsu.listFiles("/", async(err, files) => {
        console.log(files);
        await files.forEach(async(kit) => {
            if (kit != "dsu-metadata-log" && kit != "userdetails") {
                await dsu.readFile("/" + kit, (err, buffer) => {
                    let kitObject = JSON.parse(buffer.toString());
                    kits.push(kitObject);
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
    dsu.readFile("/kit" + id, (err, buffer) => {
        const dataObject = JSON.parse(buffer.toString());
        /*   console.log(dataObject); */
        kit = dataObject;
    });
    return kit;
}

async function getCourierKits() {
    let courierKits = [];
    await dsu.listFiles("/", async(err, files) => {
        console.log(files);
        await files.forEach(async(kit) => { /* index needed? */
            if (kit != "dsu-metadata-log" && kit != "userdetails") {
                await dsu.readFile("/" + kit, (err, buffer) => {
                    let kitObject = JSON.parse(buffer.toString());

                    if (kitObject.courier == courier) {
                        courierKits.push(kitObject);
                    }
                });
            }

        });

    });
    return courierKits;
}

function setModal(title, message) {
    modaltitle = title;
    modalmessage = message;
}

function getModal() {
    return [modaltitle, modalmessage];
}

async function nextStep(id) {
    let kit = getKit(id);
    if (kit.status == 1) kit.status = 2;
    else if (kit.status == 2) kit.status = 4;
    else if (kit.status == 4) kit.status = 5;
    else if (kit.status == 5) kit.status = 6;
    await createKit(kit);
    setModal("Success", "Status was changed successfully");
}
export default {
    /*     createDSU,
        getSSI, */
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
    getCourierKits,
    setModal,
    getModal,
    nextStep
}