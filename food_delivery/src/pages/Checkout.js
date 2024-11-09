import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const CheckoutWrapper = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  width: 800px;
`;

const CheckoutContainer = styled.div`
  padding: 40px;
  width: 60%;
`;

const Sidebar = styled.div`
  padding: 40px;
  width: 40%;
  background-color: #f9f9f9;
  border-left: 1px solid #ccc;
`;

const ProductDetails = styled.div`
  margin-bottom: 20px;
`;

const SavedAddresses = styled.div`
  margin-bottom: 20px;
`;

const Step = styled.div`
  margin-bottom: 30px;
`;

const StepHeading = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const StepSubheading = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FlexGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7c62b9;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5c478c;
  }
`;

const PreviousButton = styled(Button)`
  background-color: #ccc;
  color: #000;

  &:hover {
    background-color: #999;
  }
`;

const PlaceOrderButton = styled(Button)`
  background-color: #34c759;
  color: #fff;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => (props.active ? '#34c759' : '#ccc')};
  border-radius: 50%;
  margin: 0 5px;
`;

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    shippingMethod: '',
    deliveryDate: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    paymentMethod: '',
    couponCode: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const tempRef = db.collection('temp').doc(user.uid);
          const tempDoc = await tempRef.get();
          const cartItems = tempDoc.data().items;
          setCartItems(cartItems);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (user) {
      try {
        const ordersCollection = collection(db, `users/${user.uid}/orders`);
        const orderRef = await addDoc(ordersCollection, {
          address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
          shipping: {
            method: formData.shippingMethod,
            deliveryDate: formData.deliveryDate,
          },
          payment: {
            cardNumber: formData.cardNumber,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cvc: formData.cvc,
            paymentMethod: formData.paymentMethod,
          },
        });

        await setDoc(doc(db, `users/${user.uid}/address`), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        });

        alert('Order placed successfully!');
      } catch (error) {
        console.error(error);
        alert('Error placing order');
      }
    } else {
      alert('Please sign in to place an order');
    }
  };

  return (
    <PageContainer>
      <CheckoutWrapper>
        <CheckoutContainer>
          <StepHeading>Checkout</StepHeading>
          <ProgressContainer>
            <Dot active={step === 1} />
            <Dot active={step === 2} />
            <Dot active={step === 3} />
          </ProgressContainer>
          {step === 1 && (
            <Step>
              <StepSubheading>Address</StepSubheading>
              <FlexGroup>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FlexGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormGroup>
              <FlexGroup>
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>State</Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FlexGroup>
              <FlexGroup>
                <FormGroup>
                  <Label>ZIP</Label>
                  <Input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <Input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FlexGroup>
              <ButtonContainer>
                <Button onClick={handleNext}>Next</Button>
              </ButtonContainer>
            </Step>
          )}
          {step === 2 && (
            <Step>
              <StepSubheading>Shipping</StepSubheading>
              <FormGroup>
                <Label>Shipping Method:</Label>
                <Select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleChange}
                >
                  <option value="">Select shipping method</option>
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Estimated Delivery Date:</Label>
                <Input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                />
              </FormGroup>
              <ButtonContainer>
                <PreviousButton onClick={handlePrevious}>Previous</PreviousButton>
                <Button onClick={handleNext}>Next</Button>
              </ButtonContainer>
            </Step>
          )}
          {step === 3 && (
            <Step>
              <StepSubheading>Payment</StepSubheading>
              <FormGroup>
                <Label>Card Number:</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />
              </FormGroup>
              <FlexGroup>
                <FormGroup>
                  <Label>Expiry Month:</Label>
                  <Input
                    type="text"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Expiry Year:</Label>
                  <Input
                    type="text"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FlexGroup>
              <FormGroup>
                <Label>CVV:</Label>
                <Input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Payment Method:</Label>
                <RadioGroup>
                  <RadioLabel>
                    <Input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleChange}
                    />
                    Credit Card
                  </RadioLabel>
                  <RadioLabel>
                    <Input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    PayPal
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>
              <FormGroup>
                <Label>Coupon Code:</Label>
                <Input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                />
              </FormGroup>
              <ButtonContainer>
                <PreviousButton onClick={handlePrevious}>Previous</PreviousButton>
                <PlaceOrderButton onClick={handlePlaceOrder}>Place Order</PlaceOrderButton>
              </ButtonContainer>
            </Step>
          )}
        </CheckoutContainer>
        <Sidebar>
          <ProductDetails>
            <StepHeading>Product Details</StepHeading>
              {cartItems.map((item) => (
                <div key={item.productId}>
                  <p>Product Name: {item.name}</p>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Subtotal: ${item.price * item.quantity}</p>
              </div>
            ))}
              <p>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
          </ProductDetails>
        </Sidebar>
      </CheckoutWrapper>
    </PageContainer>
  );
};

export default Checkout;
