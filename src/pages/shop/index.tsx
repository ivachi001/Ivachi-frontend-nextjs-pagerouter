import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Select, Empty, Image } from "antd";
import styles from "./shop.module.scss";

const { Option } = Select;

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Natural Shampoo",
    price: 19.99,
    category: "Hair Care",
    image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg",
    description: "Natural ingredients for healthy hair",
  },
  {
    id: 2,
    name: "Organic Hair Oil",
    price: 24.99,
    category: "Hair Care",
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg",
    description: "Nourishing hair oil for strong and shiny hair",
  },
  {
    id: 3,
    name: "Face Moisturizer",
    price: 29.99,
    category: "Skin Care",
    image: "https://images.pexels.com/photos/4465829/pexels-photo-4465829.jpeg",
    description: "Hydrating face cream for all skin types",
  },
  {
    id: 4,
    name: "Anti-aging Serum",
    price: 34.99,
    category: "Skin Care",
    image: "https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg",
    description: "Advanced formula for youthful skin",
  },
  {
    id: 5,
    name: "Complete Hair Care Kit",
    price: 59.99,
    category: "Kits and Combo",
    image: "https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg",
    description: "Complete hair care solution in one package",
  },
  {
    id: 6,
    name: "Skin Care Essentials",
    price: 79.99,
    category: "Kits and Combo",
    image: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg",
    description: "Essential skin care products bundle",
  },
  {
    id: 7,
    name: "Hair Conditioner",
    price: 18.99,
    category: "Hair Care",
    image: "https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg",
    description: "Deep conditioning treatment for soft hair",
  },
  {
    id: 8,
    name: "Face Cleanser",
    price: 22.99,
    category: "Skin Care",
    image: "https://images.pexels.com/photos/4465794/pexels-photo-4465794.jpeg",
    description: "Gentle cleansing for radiant skin",
  },
];
const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // useEffect(() => {
  //   const category = searchParams.get("category");
  //   if (category) {
  //     setSelectedCategory(category.replace("-", " "));
  //     filterProducts(category.replace("-", " "));
  //   } else {
  //     setFilteredProducts(products);
  //   }
  // }, [searchParams, products]);

  const filterProducts = (category: string) => {
    const filtered = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    filterProducts(value);
  };

  return (
    <div className={styles.shopContainer}>
      <div className={styles.filterSection}>
        <h1>Shop All Products</h1>
        <div className={styles.filters}>
          <Select
            value={selectedCategory || undefined}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            className={styles.categorySelect}
            allowClear
          >
            <Option value="Hair Care">Hair Care</Option>
            <Option value="Skin Care">Skin Care</Option>
            <Option value="Kits and Combo">Kits and Combo</Option>
          </Select>
          {selectedCategory && (
            <Tag
              closable
              onClose={() => handleCategoryChange("")}
              className={styles.categoryTag}
            >
              {selectedCategory}
            </Tag>
          )}
        </div>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <div className={styles.imageContainer}>
                      <Image alt={product.name} src={product.image} />
                    </div>
                  }
                  className={styles.productCard}
                >
                  <Card.Meta
                    title={product.name}
                    description={product.description}
                  />
                  <div className={styles.productPrice}>
                    ${product.price.toFixed(2)}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No products found" />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
