// src/App.js
import React, { useState, useEffect } from "react";
import { ref, set, push, onValue } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase.config";

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [subCategoryImage, setSubCategoryImage] = useState(null);

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
    const newCategoryRef = push(ref(db, "categories"));
    const key = newCategoryRef.key;
    let imageUrl = "";
    if (categoryImage) {
      const imageRef = storageRef(storage, `categories/${key}`);
      await uploadBytes(imageRef, categoryImage);
      imageUrl = await getDownloadURL(imageRef);
    }
    set(newCategoryRef, { name: newCategory, imageUrl });
    setNewCategory("");
    setCategoryImage(null);
  };

  const handleAddSubCategory = async (categoryId) => {
    const newSubCategoryRef = push(
      ref(db, `categories/${categoryId}/subcategories`)
    );
    const key = newSubCategoryRef.key;
    let imageUrl = "";
    if (subCategoryImage) {
      const imageRef = storageRef(storage, `subcategories/${key}`);
      await uploadBytes(imageRef, subCategoryImage);
      imageUrl = await getDownloadURL(imageRef);
    }
    set(newSubCategoryRef, { name: newSubCategory, imageUrl });
    setNewSubCategory("");
    setSubCategoryImage(null);
  };

  const handleAddService = (categoryId, subCategoryId = null) => {
    const serviceRef = subCategoryId
      ? ref(
          db,
          `categories/${categoryId}/subcategories/${subCategoryId}/services`
        )
      : ref(db, `categories/${categoryId}/services`);
    push(serviceRef, { name: newService });
    setNewService("");
  };

  const handleFileChange = (e, setImage) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="App">
      <h1>Category Manager</h1>
      <div className="add-category">
        <input
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => handleFileChange(e, setCategoryImage)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <div className="categories">
        {categories.map(([categoryId, category]) => (
          <div key={categoryId} className="category">
            <h2>{category.name}</h2>
            {category.imageUrl && (
              <img src={category.imageUrl} alt={category.name} />
            )}
            <div className="add-subcategory">
              <input
                type="text"
                placeholder="Add new subcategory"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
              />
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setSubCategoryImage)}
              />
              <button onClick={() => handleAddSubCategory(categoryId)}>
                Add Subcategory
              </button>
            </div>
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
                      <div className="add-service">
                        <input
                          type="text"
                          placeholder="Add new service"
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
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
                placeholder="Add new service"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
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
