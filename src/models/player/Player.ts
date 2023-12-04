export default class Player {

    private readonly _name: string;
    constructor(name: string) {
        this._name = name;
    }
    public get name(): string {
        return this._name;
    }
}