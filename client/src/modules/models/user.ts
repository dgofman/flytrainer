import { JsonProperty, serialize, deserialize } from './serializable';

export class User {
    @JsonProperty('accountid')
    id: string;
    firstname: string;
    lastname: string;
    balance: number;

    static serialize(user: User): any {
        return serialize(user);
    }

    static deserialize(json: any): User {
        return deserialize(User, json);
    }
}
