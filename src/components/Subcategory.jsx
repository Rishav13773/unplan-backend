// Subcategory.js
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase.config";
import { ref, set, push, onValue } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Services from "./Services";

function Subcategory({ parentId }) {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subCategoryComingSoon, setSubCategoryComingSoon] = useState(false);

  useEffect(() => {
    const subcategoriesRef = ref(db, `categories/${parentId}/subcategories`);
    onValue(subcategoriesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSubcategories = [];
      for (let id in data) {
        loadedSubcategories.push({ id, ...data[id] });
      }
      setSubcategories(loadedSubcategories);
    });
  }, [parentId]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const addSubcategory = async () => {
    if (subcategoryName === "") return;

    let photoURL = "";
    if (photo) {
      const photoRef = storageRef(storage, `subcategories/${photo.name}`);
      await uploadBytes(photoRef, photo);
      photoURL = await getDownloadURL(photoRef);
    }

    const newSubcategoryRef = push(
      ref(db, `categories/${parentId}/subcategories`)
    );
    await set(newSubcategoryRef, {
      name: subcategoryName,
      photo: photoURL,
      comingSoon: subCategoryComingSoon,
    });

    setSubcategoryName("");
    setPhoto(null);
    setSubCategoryComingSoon(false);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  return (
    <div className="subcategory-container">
      <div>
        <select value={selectedSubcategory} onChange={handleSubcategoryChange}>
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="input"
        type="text"
        value={subcategoryName}
        onChange={(e) => setSubcategoryName(e.target.value)}
        placeholder="New Subcategory Name"
      />
      <input className="input" type="file" onChange={handlePhotoChange} />
      <label>
        <input
          type="checkbox"
          checked={subCategoryComingSoon}
          onChange={(e) => setSubCategoryComingSoon(e.target.checked)}
        />
        Coming Soon
      </label>

      <button className="button button-green" onClick={addSubcategory}>
        Add Subcategory
      </button>

      {selectedSubcategory && (
        <>
          <h2>
            Selected Subcategory:{" "}
            {
              subcategories.find((subcat) => subcat.id === selectedSubcategory)
                ?.name
            }
          </h2>
          <Services parentId={selectedSubcategory} />
        </>
      )}
    </div>
  );
}

export default Subcategory;
