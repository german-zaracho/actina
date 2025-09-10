const ProductListItem = ({ product }) => {
    const { _id, productId, name, description, brand, price, category, link, image } = product;

    return (
        <li className="">
            <div className="">
                <h3 className="">{name} <span className="">#{_id}</span></h3>
                <p className=""> {productId} </p>
                <p className=""> {description} </p>
            </div>
        </li>
    );
};
export default ProductListItem;

