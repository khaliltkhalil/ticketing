async function getProducts() {
  const products = [
    { name: "k", id: "12" },
    { name: "g", id: "14" },
  ];
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(products), 5000);
  });
}

export default async function Products() {
  const products = await getProducts();
  console.log("product page");

  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
