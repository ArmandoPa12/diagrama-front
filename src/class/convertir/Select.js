import { Base } from "./Base.js";

export class Select extends Base {
    render() {
        const options = (this.opciones || []).map(opt => `<option>${opt}</option>`).join("");
        return `
        <select formControlName="${this.text}"  class="form-control" >
            <option value="">Seleccionar ${this.text}</option>
            <option *ngFor="let opcion of ${this.text}_opciones" [value]="opcion">{{ opcion }}</option>
        </select>`;
    }
}