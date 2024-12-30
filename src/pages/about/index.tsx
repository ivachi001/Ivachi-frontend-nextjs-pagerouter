import React from "react";
import styles from "./about.module.scss";

const AboutPage = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1>About Us</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Story</h2>
          <p>
            Welcome to [Your Company Name], where innovation meets excellence.
            Founded in [year], we've been committed to delivering exceptional
            [products/services] and creating lasting relationships with our
            customers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide outstanding solutions that empower
            businesses and individuals to achieve their goals. We believe in
            innovation, quality, and customer satisfaction above all else.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Our Values</h2>
          <ul>
            <li>Innovation and Creativity</li>
            <li>Customer-First Approach</li>
            <li>Quality and Excellence</li>
            <li>Integrity and Transparency</li>
            <li>Continuous Improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
