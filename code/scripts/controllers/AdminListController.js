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
    searchStatus: {
        label: "Search by Status",
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
            /*wird nicht benutzt*/
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
    searchID: {
        label: "Search by ID",
        name: "searchID",
        required: true,
        placeholder: "ID here...",
        value: ""
    }
}


export default class AdminListController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        this.model.courier = DSUManager.getCourier();
        this.model.user = DSUManager.getUser();
        this.on("closeModal", () => this.model.modal.opened = false);
        this.on("createKit", () => this.History.navigateToPageByTag("createdemokits"));
        this.on("loadKits", async() => this.model.kits = await getKits());
        this.on("editKit", (event) => {
            const id = event.target.getAttribute("id");
            this.History.navigateToPageByTag("editkit", { id: id });
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

function getKits() {
    let kits = DSUManager.getKits();
    console.log("admin ", kits);
    return kits;
}