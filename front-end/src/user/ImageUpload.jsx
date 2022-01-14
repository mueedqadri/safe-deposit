import React, { useState } from "react";
import BaseView from "../core/BaseView";
import { isUserAuthenticated, setImageVerified } from "./UserNetwork";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ImageUpload(props) {
  const [image, setImage] = useState(null);
  const { boxNumber } = isUserAuthenticated();

  const navigate = useNavigate();

  const uploadImage = (event) => {
    event.preventDefault();

    var data = new FormData();
    data.append("image", image);
    data.append("boxNumber", boxNumber);

    console.log(data);
    fetch(
      "https://us-central1-serverless-329200.cloudfunctions.net/dal-safe-ml",
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Success: Your Image Comparison is successful");
          setImageVerified();
          navigate("/chat");
        } else {
          toast.error("Insufficient Images (or) Image Comparison failed");
        }
      })
      .catch((err) => {
        toast.error("Failure: Your Image is not uploaded");
        console.log(err);
      });
  };

  const selectImage = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <BaseView titleString="Use the below form to upload images for box number">
      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-sm ">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title text-black"> Box: {boxNumber}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Image upload should pass the verification
                </h6>
                <div className="input-group mb-3">
                  <label onClick={uploadImage} className="input-group-text">
                    Upload
                  </label>
                  <input
                    onChange={selectImage}
                    type="file"
                    name="image"
                    className="form-control"
                    id="inputGroupFile01"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm"></div>
        </div>
      </div>
    </BaseView>
  );
}
