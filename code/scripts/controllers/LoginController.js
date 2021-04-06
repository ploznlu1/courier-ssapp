import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DSUManager from "./DSUManager.js";

const model = {
    couriername: {
        label: "Courier name",
        name: "couriername",
        required: true,
        placeholder: "Courier name here...",
        value: ''
    },
    username: {
        label: "Username",
        name: "username",
        required: true,
        placeholder: "Username here...",
        value: ''
    },
    password: {
        label: "Password",
        name: "password",
        required: true,
        placeholder: "Password here...",
        value: '12345678'
    },
    /*  message: "",
     showalert: false,
     showlogin: true,
     showlink: false,
     alertclass: "alert alert-success", */
    modal: {
        opened: false,
        title: "",
        message: ""
    },
    newDSU: {
        label: "New DSU",
        name: "newDSU",
        placeholder: 'Click "Get SSI"',
        value: ""
    },
    loadDSU: {
        label: "Load DSU",
        name: "newDSU",
        placeholder: "Enter DSU keySSI",
        value: ""
    }
}


export default class LoginController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        DSUManager.logOut();

        this.on("loginSubmit", async() => {
            /* let login = this.model.couriername.value + '/' + this.model.username.value; */
            await DSUManager.setUser(this.model.couriername.value, this.model.username.value);
            /*  await new Promise(resolve => setTimeout(resolve, 200)); */
            if (DSUManager.isUserLoggedIn() == true) {
                this.History.navigateToPageByTag("createdemokits");
            } else {
                /*  showModal(this.model, "Error", "Could not sign in"); */
            }
        });
        this.on('closeModal', () => this.model.modal.opened = false);
        this.on('getSSI', async() => {
            DSUManager.createDSU();
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.model.newDSU.value = DSUManager.getSSI();
        });
        this.on('loadDSU', () => {
            this.model.newDSU.value = DSUManager.loadDSU(this.model.loadDSU.value);
            showModal(this.model);
            console.log(this.model.modal);
        });
    }
}

async function showModal(model) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let modal = DSUManager.getModal();
    model.modal.title = modal[0];
    model.modal.message = modal[1];
    if (model.modal.title != "" && model.modal.message != "") {
        model.modal.opened = true;
    }
    return model;
}