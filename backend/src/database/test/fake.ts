import Mongo from "@/database";
import _ from "lodash";
import * as jsf from "json-schema-faker";
import faker from "faker/locale/fr";

jsf.extend("faker", () => {
    return faker;
});

jsf.format("objectId", () => {
    return Mongo.Types.ObjectId();
});

jsf.option({
    alwaysFakeOptionals: true,
    resolveJsonPath: true
});

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export async function generate<DataModel extends typeof Mongo.Model>(model: DataModel, overwrite?: DeepPartial<InstanceType<DataModel>>): Promise<InstanceType<DataModel>> {
    const jsonSchema = makeJsonSchema(model.schema);
    let fake = await jsf.resolve(jsonSchema);
    fake = _.merge(fake, overwrite);
    const generatedModel = await model.create(fake);
    return generatedModel as InstanceType<DataModel>;
}

function makeJsonSchema(model: Mongo.Schema): any {
    const properties = {};

    model.eachPath((path, schemaType) => {
        if (!(schemaType as any).isRequired) {
            return;
        }
        const options = (schemaType as any).options;
        let value = null;
        switch (schemaType.constructor.name) {
        case "SchemaString":
            value = { type: "string" };
            break;
        case "SchemaNumber":
            value = { type: "number" };
            break;
        case "SchemaDate":
            value = { type: "string", format: "date-time" };
            break;
        case "ObjectId":
            value = { type: "string", format: "objectId" };
            break;
        }

        if (value) {
            _.set(properties, path, { ...options, ...value });
        }
    });

    return {
        type: "object",
        properties
    };
}
