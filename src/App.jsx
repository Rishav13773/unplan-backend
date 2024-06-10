// src/App.js
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  createService,
  fetchCategories,
  addServiceToCategory,
} from "./helper/createFunctions";
import { storage } from "../firebase.config"; // Import storage from firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary functions

const App = () => {
  const [serviceData, setServiceData] = useState({
    categoryName: "",
    imageUrl: "",
    services: [
      {
        id: uuidv4(),
        name: "",
        description: "",
        price: "",
        sets: "",
      },
    ],
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const [isUploading, setIsUploading] = useState(false); // State to show upload status

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await fetchCategories();
      setCategories(categories);
    };

    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...serviceData.services];
    updatedServices[index][name] = value;
    setServiceData((prevData) => ({
      ...prevData,
      services: updatedServices,
    }));
  };

  const handleAddService = () => {
    setServiceData((prevData) => ({
      ...prevData,
      services: [
        ...prevData.services,
        {
          id: uuidv4(),
          name: "",
          description: "",
          price: "",
          sets: "",
        },
      ],
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (imageFile) {
      setIsUploading(true);
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
      setServiceData((prevData) => ({
        ...prevData,
        imageUrl,
      }));
      setIsUploading(false);
    }

    const updatedServiceData = {
      ...serviceData,
      imageUrl: imageUrl || serviceData.imageUrl,
    };

    if (selectedCategory) {
      // Add new services to the existing category
      await addServiceToCategory(selectedCategory, updatedServiceData.services);
    } else {
      // Create a new category with services
      const newServiceId = uuidv4();
      const newServiceData = { ...updatedServiceData, id: newServiceId };
      await createService(newServiceData);
    }
  };

  return (
    <div className="App">
      <h1>Add Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedCategory(selectedValue);
              if (selectedValue) {
                const selectedCategoryData = categories.find(
                  (category) => category.id === selectedValue
                );
                setServiceData((prevData) => ({
                  ...prevData,
                  categoryName: selectedCategoryData.categoryName,
                  imageUrl: selectedCategoryData.imageUrl,
                }));
              } else {
                setServiceData((prevData) => ({
                  ...prevData,
                  categoryName: "",
                  imageUrl: "",
                }));
              }
            }}
          >
            <option value="">Create a new category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        {!selectedCategory && (
          <>
            <div>
              <label>New Category Name:</label>
              <input
                type="text"
                name="categoryName"
                value={serviceData.categoryName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input type="file" onChange={handleImageChange} required />
              {isUploading && <p>Uploading image...</p>}
            </div>
          </>
        )}
        {serviceData.services.map((service, index) => (
          <div key={service.id}>
            <h2>Service {index + 1}</h2>
            <div>
              <label>Service Name:</label>
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={service.description}
                onChange={(e) => handleServiceChange(index, e)}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="text"
                name="price"
                value={service.price}
                onChange={(e) => handleServiceChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Sets:</label>
              <input
                type="text"
                name="sets"
                value={service.sets}
                onChange={(e) => handleServiceChange(index, e)}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddService}>
          Add Another Service
        </button>
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default App;
