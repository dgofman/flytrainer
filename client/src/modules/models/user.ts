import { JsonProperty, serialize } from './serializable';

export class User {
    @JsonProperty('accountid')
    id: string;
    firstname: string;
    lastname: string;
    balance: number;

    static serialize(json: any): User {
        return serialize(User, json);
    }
}
