import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DSUManager from "./DSUManager.js";

const model = {
    user: "",
    courier: "",
    modal: {
        opened: false,
        title: "",
        message: ""
    }
}


export default class CourierListController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        this.model.courier = DSUManager.getCourier();
        this.model.user = DSUManager.getUser();
        this.on("closeModal", () => this.model.modal.opened = false);
        this.on("loadKits", async() => {
            /* await new Promise(resolve => setTimeout(resolve, 400)); */
            this.model.kits = await getCourierKits()
        });
        this.on("showDetails", (event) => {
            const id = event.target.getAttribute("id");
            this.History.navigateToPageByTag("kitdetails", { id: id });
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

function getCourierKits() {
    let kits = DSUManager.getCourierKits();
    console.log("admin ", kits);
    return kits;
}