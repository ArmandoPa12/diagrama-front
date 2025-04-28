import { Base } from "./Base.js";

export class Submit extends Base {
    render() {
        return `
        <button type="submit" class="btn btn-primary d-inline-flex align-items-center" value="Submit">Submit</button>
     `;
    }
}