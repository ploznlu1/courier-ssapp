import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DSUManager from "./DSUManager.js";

const model = {
    user: "",
    courier: "",
    modal: {
        opened: false,
        title: "",
        message: ""
    },
    kitid: {
        label: "Kit-ID",
        name: "kitid",
        required: true,
        placeholder: "Kit-ID here...",
        value: ""
    },
    productname: {
        label: "Product Name",
        name: "product Name",
        required: true,
        placeholder: "Prodcut Name here...",
        value: ""
    },
    statusSelect: {
        label: "Status",
        placeholder: "Please select one option...",
        required: true,
        options: [{
            label: "Ready for pickup at Clinical Resource",
            value: "1"
        }, {
            label: "In transit",
            value: "2"
        }, {
            label: "Delivered to patient",
            value: "3"
        }, {
            label: "Ready for pickup at patient",
            value: "4"
        }, {
            label: "Unused product in transit",
            value: "5"
        }, {
            label: "Done",
            value: "6"
        }]
    },
    courierSelect: {
        label: "Courier",
        placeholder: "Please select one option...",
        required: true,
        options: [{
            label: "DHL",
            value: "dhl"
        }, {
            label: "UPS",
            value: "ups"
        }]
    },
    description: {
        label: "Description",
        name: "description",
        required: true,
        placeholder: "Description here...",
        value: ""
    },
    creationdate: {
        label: "Creation Date",
        name: "creationdate"
    },
    kit: {
        id: "",
        kitid: "",
        productname: "",
        status: "",
        courier: "",
        description: "",
        creationdate: ""
    }
}


export default class EditKitController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        this.model.user = DSUManager.getUser();
        this.model.courier = DSUManager.getCourier();
        let state = this.History.getState();
        this.id = typeof state !== "undefined" ? state.id : undefined;
        this.model.kit = getKit(this.id);
        this.on("closeModal", () => this.model.modal.opened = false);
        this.on("saveKit", async() => {


            await DSUManager.createKit(this.model.kit);
            this.History.navigateToPageByTag("adminlist");
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

function getKit(id) {
    let kit = "";
    kit = DSUManager.getKit(id);
    return kit;
}