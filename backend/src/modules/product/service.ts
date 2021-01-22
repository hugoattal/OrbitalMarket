import ProductModel, {IProduct} from "./model";

export async function create(product: IProduct) {
    await ProductModel.create(product);
}

export async function get(id: string) {
    return ProductModel.findById(id).exec();
}
