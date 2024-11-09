import React from 'react';
import styled from 'styled-components';

// Container for the entire About Us page
const AboutContainer = styled.div`
  padding: 40px;
  background-color: #f7f7f7;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Header for the main title of the page
const Header = styled.h1`
  margin-bottom: 20px;
`;

// Container for each section of the page
const Section = styled.div`
  max-width: 800px;
  margin-bottom: 20px;
  text-align: center;
`;

// Sub-header for each section title
const SubHeader = styled.h2`
  margin-bottom: 10px;
  color: #007bff;
`;

// Paragraph styling for section content
const Paragraph = styled.p`
  line-height: 1.6;
`;

const AboutUs = () => {
  return (
    <AboutContainer>
      <Header>About Us</Header>
      {/* Welcome section */}
      <Section>
        <SubHeader>Welcome to Organic Theory!</SubHeader>
        <Paragraph>
          At Organic Theory, we are dedicated to bringing the authentic flavors and natural goodness of India to your doorstep. Specializing in the delivery of traditional Indian pickles and premium organic products like dry fruits, our mission is to provide you with the highest quality and taste in every bite.
        </Paragraph>
      </Section>
      {/* Our Story section */}
      <Section>
        <SubHeader>Our Story</SubHeader>
        <Paragraph>
          Founded in [Year], Organic Theory was born out of a love for Indian culinary traditions and a commitment to healthy, natural living. Growing up, we cherished the vibrant flavors of homemade pickles and the nutritional benefits of organic dry fruits. This passion inspired us to create a business that celebrates these age-old traditions and shares them with the world.
        </Paragraph>
      </Section>
      {/* Our Products section */}
      <Section>
        <SubHeader>Our Products</SubHeader>
        <Paragraph>
          <strong>Indian Pickles:</strong> Experience the rich, tangy, and spicy flavors of India with our diverse range of pickles. Made using traditional recipes and the finest ingredients, each jar of our pickles promises an explosion of taste that enhances any meal.
        </Paragraph>
        <Paragraph>
          <strong>Dry Fruits:</strong> Our selection of organic dry fruits includes top-quality almonds, cashews, raisins, and more. Sourced from the best farms, our dry fruits are carefully processed to retain their natural goodness and nutritional value.
        </Paragraph>
      </Section>
      {/* Our Commitment section */}
      <Section>
        <SubHeader>Our Commitment</SubHeader>
        <Paragraph>
          At Organic Theory, quality and customer satisfaction are our top priorities. We ensure that all our products are sourced from trusted farmers and suppliers who adhere to organic and sustainable practices. Our rigorous quality control processes guarantee that you receive only the best products, free from artificial additives and preservatives.
        </Paragraph>
      </Section>
      {/* Closing section */}
      <Section>
        <Paragraph>
          Join us on this journey to rediscover the authentic tastes of India and embrace a healthier lifestyle with Organic Theory.
        </Paragraph>
        <Paragraph>
          Thank you for choosing Organic Theory. We look forward to serving you!
        </Paragraph>
      </Section>
    </AboutContainer>
  );
};

export default AboutUs;
