import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DSUManager from "./DSUManager.js";

const model = {
    user: "",
    courier: "",
    log: {
        label: "Log",
        name: "log",
        required: true,
        placeholder: 'Click "Load Log"',
        value: ""
    },
    dsulog: ""
}

export default class AuditController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(model)));
        this.model.courier = DSUManager.getCourier();
        this.model.user = DSUManager.getUser();
        this.on("closeModal", () => this.model.modal.opened = false);
        this.on("loadLog", async() => this.model.dsulog = await loadLog());
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

async function loadLog() {
    let dsulog = await DSUManager.getLog();

    return dsulog;
}