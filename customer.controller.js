const fs = require("fs");
const customers = JSON.parse(fs.readFileSync("customers.json", "utf-8"));

// List API with search and pagination
const searchCustomer = (req, res) => {
  const { firstName, lastName, city, page = 1, pageSize = 10 } = req.query;

  let filteredCustomers = [...customers];

  if (firstName) {
    filteredCustomers = filteredCustomers.filter((customer) =>
      customer.first_name.toLowerCase().includes(firstName.toLowerCase())
    );
  }

  if (lastName) {
    filteredCustomers = filteredCustomers.filter((customer) =>
      customer.last_name.toLowerCase().includes(lastName.toLowerCase())
    );
  }

  if (city) {
    filteredCustomers = filteredCustomers.filter(
      (customer) => customer.city.toLowerCase() === city.toLowerCase()
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  res.status(200).json({ data: paginatedCustomers });
};

// Get single customer data by id
const getCustomer = (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ message: "Wrong ID,customer not found" });
  }

  res.status(200).json(customer);
};

// List all unique cities with the number of customers
const getAllCities = (req, res) => {
  const cities = {};
  customers.forEach((customer) => {
    cities[customer.city] = (cities[customer.city] || 0) + 1;
  });

  res.status(200).json({ data: cities });
};

// Add a customer with validations
const addUser = (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;

  if (!id || !first_name || !last_name || !city || !company) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingCity = customers.some(
    (customer) => customer.city.toLowerCase() === city.toLowerCase()
  );
  const existingCompany = customers.some(
    (customer) => customer.company.toLowerCase() === company.toLowerCase()
  );

  if (!existingCity || !existingCompany) {
    return res.status(400).json({
      message: "City or company does not exist for an existing customer",
    });
  }

  const customer = { id, first_name, last_name, city, company };

  customers.push(customer);
  fs.writeFileSync(
    "customers.json",
    JSON.stringify(customers, null, 2),
    "utf-8"
  );

  res
    .status(200)
    .json({ data: customer, message: "Customer added successfully" });
};

module.exports = { searchCustomer, getCustomer, getAllCities, addUser };
