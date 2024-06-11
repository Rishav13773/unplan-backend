import React, { useState, useEffect } from "react";
import { ref, set, push, onValue } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uuid from "react-uuid";

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sets, setSets] = useState("");

  useEffect(() => {
    const categoriesRef = ref(db, "categories");
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategories(Object.entries(data));
      }
    });
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory || !categoryImage) {
      toast.error("Please fill in all fields for category.");
      return;
    }

    const newCategoryRef = push(ref(db, "categories"));
    const key = newCategoryRef.key;
    let imageUrl = "";
    if (categoryImage) {
      const imageRef = storageRef(storage, `categories/${key}`);
      await uploadBytes(imageRef, categoryImage);
      imageUrl = await getDownloadURL(imageRef);
    }
    const newCategoryId = uuid(); // Generating a timestamp-based ID
    set(newCategoryRef, { name: newCategory, imageUrl, id: newCategoryId });
    setNewCategory("");
    setCategoryImage(null);
  };

  const handleAddSubCategory = async (
    categoryId,
    parentSubCategoryId = null
  ) => {
    if (!newSubCategory || !subCategoryImage) {
      toast.error("Please fill in all fields for subcategory.");
      return;
    }

    const subCategoryRef = parentSubCategoryId
      ? ref(
          db,
          `categories/${categoryId}/subcategories/${parentSubCategoryId}/subcategories`
        )
      : ref(db, `categories/${categoryId}/subcategories`);

    const newSubCategoryRef = push(subCategoryRef);
    const key = newSubCategoryRef.key;
    let imageUrl = "";
    if (subCategoryImage) {
      const imageRef = storageRef(storage, `subcategories/${key}`);
      await uploadBytes(imageRef, subCategoryImage);
      imageUrl = await getDownloadURL(imageRef);
    }
    const newSubCategoryId = uuid(); // Generating a timestamp-based ID

    set(newSubCategoryRef, {
      name: newSubCategory,
      imageUrl,
      id: newSubCategoryId,
    });
    setNewSubCategory("");
    setSubCategoryImage(null);
  };

  const handleAddService = (
    categoryId,
    subCategoryId = null,
    nestedSubCategoryId = null
  ) => {
    if (!newService || !description || !price || !sets) {
      toast.error("Please fill in all fields for service.");
      return;
    }

    let serviceRef;

    if (nestedSubCategoryId) {
      serviceRef = ref(
        db,
        `categories/${categoryId}/subcategories/${subCategoryId}/subcategories/${nestedSubCategoryId}/services`
      );
    } else if (subCategoryId) {
      serviceRef = ref(
        db,
        `categories/${categoryId}/subcategories/${subCategoryId}/services`
      );
    } else {
      serviceRef = ref(db, `categories/${categoryId}/services`);
    }

    const newServiceId = uuid(); // Generating a timestamp-based ID

    push(serviceRef, {
      id: newServiceId,
      name: newService,
      description,
      price,
      sets,
    });

    setNewService("");
    setDescription("");
    setPrice(0);
    setSets("");
  };

  const handleFileChange = (e, setImage) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory("");
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Category Manager</h1>
      <div className="add-category">
        <input
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => handleFileChange(e, setCategoryImage)}
          required
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <div className="select-category">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map(([categoryId, category]) => (
            <option key={categoryId} value={categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <select
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
          >
            <option value="">Select Subcategory</option>
            {categories.find(
              ([categoryId]) => categoryId === selectedCategory
            )?.[1].subcategories &&
              Object.entries(
                categories.find(
                  ([categoryId]) => categoryId === selectedCategory
                )?.[1].subcategories
              ).map(([subCategoryId, subCategory]) => (
                <option key={subCategoryId} value={subCategoryId}>
                  {subCategory.name}
                </option>
              ))}
          </select>
        )}
      </div>
      {selectedCategory && (
        <div className="add-subcategory">
          <input
            type="text"
            placeholder="Add new subcategory"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            required
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setSubCategoryImage)}
            required
          />
          <button
            onClick={() =>
              handleAddSubCategory(selectedCategory, selectedSubCategory)
            }
          >
            Add Subcategory
          </button>
        </div>
      )}
      {selectedCategory && (
        <div className="add-service">
          <input
            type="text"
            placeholder="Service Name"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
          <input
            type="text"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
          />
          <button
            onClick={() =>
              handleAddService(selectedCategory, selectedSubCategory)
            }
          >
            Add Service
          </button>
        </div>
      )}
      <div className="categories">
        {categories.map(([categoryId, category]) => (
          <div key={categoryId} className="category">
            <h2>{category.name}</h2>
            {category.imageUrl && (
              <img src={category.imageUrl} alt={category.name} />
            )}
            <div className="subcategories">
              {category.subcategories &&
                Object.entries(category.subcategories).map(
                  ([subCategoryId, subCategory]) => (
                    <div key={subCategoryId} className="subcategory">
                      <h3>{subCategory.name}</h3>
                      {subCategory.imageUrl && (
                        <img
                          src={subCategory.imageUrl}
                          alt={subCategory.name}
                        />
                      )}
                      <div className="subcategories">
                        {subCategory.subcategories &&
                          Object.entries(subCategory.subcategories).map(
                            ([nestedSubCategoryId, nestedSubCategory]) => (
                              <div
                                key={nestedSubCategoryId}
                                className="subcategory"
                              >
                                <h4>{nestedSubCategory.name}</h4>
                                {nestedSubCategory.imageUrl && (
                                  <img
                                    src={nestedSubCategory.imageUrl}
                                    alt={nestedSubCategory.name}
                                  />
                                )}
                                <div className="add-service">
                                  <input
                                    type="text"
                                    placeholder="Service Name"
                                    value={newService}
                                    onChange={(e) =>
                                      setNewService(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    type="text"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    type="number"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) =>
                                      setPrice(parseFloat(e.target.value))
                                    }
                                    required
                                  />
                                  <input
                                    type="text"
                                    placeholder="Sets"
                                    value={sets}
                                    onChange={(e) => setSets(e.target.value)}
                                    required
                                  />
                                  <button
                                    onClick={() =>
                                      handleAddService(
                                        categoryId,
                                        subCategoryId,
                                        nestedSubCategoryId
                                      )
                                    }
                                  >
                                    Add Service
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                      <div className="add-service">
                        <input
                          type="text"
                          placeholder="Service Name"
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value))}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Sets"
                          value={sets}
                          onChange={(e) => setSets(e.target.value)}
                          required
                        />
                        <button
                          onClick={() =>
                            handleAddService(categoryId, subCategoryId)
                          }
                        >
                          Add Service
                        </button>
                      </div>
                    </div>
                  )
                )}
            </div>
            <div className="add-service">
              <input
                type="text"
                placeholder="Service Name"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
              <input
                type="text"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
              />
              <button onClick={() => handleAddService(categoryId)}>
                Add Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
