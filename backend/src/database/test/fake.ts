import _ from "lodash";
import jsf from "json-schema-faker";
import { faker } from "@faker-js/faker/locale/fr";
import { PartialDeep } from "type-fest";
import Mongo from "@/database";

jsf.extend("faker", () => {
    return faker;
});

jsf.format("objectId", () => {
    return new Mongo.Types.ObjectId();
});

jsf.option({
    alwaysFakeOptionals: true,
    resolveJsonPath: true
});

export async function generate<DataModel extends typeof Mongo.Model>(model: DataModel, overwrite?: PartialDeep<InstanceType<DataModel>>): Promise<InstanceType<DataModel>> {
    const jsonSchema = makeJsonSchema(model.schema);
    let fake = await jsf.resolve(jsonSchema);
    fake = _.merge(fake, overwrite);
    const generatedModel = await model.create(fake);
    return generatedModel as InstanceType<DataModel>;
}

function makeJsonSchema(model: Mongo.Schema): any {
    const properties = {};

    model.eachPath((path, schemaType) => {
        if (!(schemaType as any).isRequired && !(schemaType as any).options.faker) {
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
