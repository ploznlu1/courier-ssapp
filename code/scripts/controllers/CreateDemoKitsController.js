import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DSUManager from "./DSUManager.js";

const model = {
    user: "",
    courier: "",
    id: {
        value: ""
    },
    kitid: {
        label: "Kit-ID",
        name: "kitid",
        required: true,
        placeholder: "Kit-ID here...",
        value: ''
    },
    productname: {
        label: "Product Name",
        name: "product Name",
        required: true,
        placeholder: "Prodcut Name here...",
        value: ''
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
        value: ''
    },
    kit: {
        id: "",
        kitid: "",
        productname: "",
        status: "",
        courier: "",
        description: "",
        creationdate: ""
    },
    modal: {
        opened: false,
        title: "",
        message: ""
    }
}


export default class CreateDemoKitsController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        this.model.courier = DSUManager.getCourier();
        this.model.user = DSUManager.getUser();
        this.on("createKit", async() => {
            this.model.kit.kitid = this.model.kitid.value;
            this.model.kit.productname = this.model.productname.value;
            this.model.kit.status = this.model.statusSelect.value;
            this.model.kit.courier = this.model.courierSelect.value;
            this.model.kit.description = this.model.description.value;
            let date = Date(Date.now());
            this.model.kit.creationdate = date.toString();

            await DSUManager.createKit(this.model.kit);
            showModal(this.model, "Success", ("Kit " + this.model.kit.kitid + " created successfully."));

            this.model.id.value = "";
            this.model.kitid.value = "";
            this.model.productname.value = "";
            this.model.statusSelect.value = "";
            this.model.courierSelect.value = "";
            this.model.description.value = "";
            this.model.kitid.value = "";
        });
        this.on('closeModal', () => this.model.modal.opened = false);
        this.on('showList', () => this.History.navigateToPageByTag("adminlist"));
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