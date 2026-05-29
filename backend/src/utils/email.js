/** @deprecated Use sendEmail from ./sendEmail.js and emailTriggers.js */
const { sendEmail } = require('./sendEmail');
const { sendOrderConfirmationEmail } = require('./emailTriggers');

const sendOrderConfirmation = async (order, customerEmail) => {
  if (customerEmail && !order.customerEmail) {
    order.customerEmail = customerEmail;
  }
  return sendOrderConfirmationEmail(order);
};

module.exports = { sendOrderConfirmation, sendEmail };
