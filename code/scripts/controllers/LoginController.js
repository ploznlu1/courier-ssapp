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
    }
}


export default class LoginController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        DSUManager.logOut();
        DSUManager.createDSU();
        this.on("loginSubmit", async() => {
            let login = this.model.couriername.value + '/' + this.model.username.value;
            await DSUManager.setUser(login);
            /*  await new Promise(resolve => setTimeout(resolve, 200)); */
            if (DSUManager.isUserLoggedIn() == true) {
                this.History.navigateToPageByTag("createdemokits");
            } else {
                showModal(this.model, "Error", "Could not sign in");
            }
        });
        this.on('closeModal', _ => this.model.modal.opened = false);
    }
}

function showModal(model, title, message) {
    model.modal.title = title;
    model.modal.message = message;
    model.modal.opened = true;
    return model;
}