// src/helper/firebaseService.js
import { ref, set, get, serverTimestamp, update } from "firebase/database";
import { db, storage } from "../../firebase.config";
import { v4 as uuidv4 } from "uuid"; // Import uuid library
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

export async function createService(data) {
  try {
    const servicesRef = ref(db, "services/" + data.id);
    data.createdAt = serverTimestamp();

    await set(servicesRef, data);
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

export async function fetchCategories() {
  try {
    const categoriesRef = ref(db, "services");
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      const categories = snapshot.val();
      return Object.keys(categories).map((key) => ({
        id: key,
        ...categories[key],
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function addServiceToCategory(categoryId, services) {
  try {
    const categoryRef = ref(db, `services/${categoryId}/services`);
    const snapshot = await get(categoryRef);
    let existingServices = [];
    if (snapshot.exists()) {
      existingServices = Object.values(snapshot.val());
    }
    const updatedServices = [
      ...existingServices,
      ...services.map((service) => ({ ...service, id: uuidv4() })),
    ];
    await set(categoryRef, updatedServices);
    console.log("Services added successfully!");
  } catch (error) {
    console.error("Error adding services:", error);
  }
}

export const uploadFile = (imageUpload) => {
  if (imageUpload === null) {
    toastifyError("Please select an image");
    return;
  }
  const imageRef = storageRef(storage, `products/${uuidv4()}`);

  uploadBytes(imageRef, imageUpload)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          saveData(url);
        })
        .catch((error) => {
          toastifyError(error.message);
        });
    })
    .catch((error) => {
      toastifyError(error.message);
    });
};
