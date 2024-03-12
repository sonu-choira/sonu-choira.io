import React, { useEffect, useState } from "react";
import {
  MdAddAPhoto,
  MdCancel,
  MdOutlineAddBox,
  MdOutlineSettings,
} from "react-icons/md";
import style from "../../pages/admin/studios/studio.module.css";

import upload from "../../assets/upload.svg";
import cross from "../../assets/cross.svg";
import StudioFooter from "./StudioFooter";
import WebDashboard2 from "../../pages/produce/WebDashBoard2";
import { IoSearch } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FaRegBell } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { Select } from "antd";

function AddNewStudio({ setSelectTab }) {
  const customStyles = {
    height: "90%",
  };
  const navigate = useNavigate();
  const gotoadminpage = () => {
    navigate("/adminDashboard");
  };
  const data = useLocation();
  console.log("the data id  ================== >", data.state.productData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [studioDetails, setStudioDetails] = useState({
    fullName: "",
    area: "",
    totalRooms: "",
    pincode: "",
    city: "",
    amenities: [],
    aboutUs: {
      aboutUs: "",
      services: "",
      infrastructure: "",
    },
    teamDetails: [{ photo: null, name: "", profile: "" }],
    studioPhotos: [],
    maxGuests: "",
    state: "",
    iframeCode: "",
  });

  useEffect(() => {
    setStudioDetails(data.state.productData);
  }, [data.state.productData]);

  const amenitiesList = [
    { id: "wifi", label: "Wifi" },
    { id: "ac", label: "AC" },
    { id: "dj", label: "DJ" },
    { id: "piano", label: "Piano" },
    { id: "drum", label: "Drum" },
    { id: "carparking", label: "Car Parking" },
    { id: "banjo", label: "Banjo" },
  ];

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleCheckboxChange = (id) => {
    const updatedAmenities = selectedAmenities.includes(id)
      ? selectedAmenities.filter((amenity) => amenity !== id)
      : [...selectedAmenities, id];

    setSelectedAmenities(updatedAmenities);
    console.log(selectedAmenities);
  };
  const [iframeCode, setIframeCode] = useState("");
  const [hasContent, setHasContent] = useState(false);

  const handleIframeCodeChange = (e) => {
    const inputCode = e.target.value;

    // Update the state with the user-entered iframe code
    setIframeCode(inputCode);

    // Update hasContent state based on whether there is content in the textarea
    setHasContent(inputCode.trim() !== "");
  };
  const [teams, setTeams] = useState([{ photo: null, name: "", profile: "" }]);

  const handleAddTeamDetail = () => {
    const newTeam = { photo: null, name: "", profile: "" };
    setTeams([...teams, newTeam]);
    console.log(teams);
  };

  const handlePhotoChange = (event, index) => {
    const newTeams = [...teams];
    newTeams[index].photo = event.target.files[0];
    setTeams(newTeams);
  };

  const handleInputChange = (event, index, field) => {
    const newTeams = [...teams];
    newTeams[index][field] = event.target.value;
    setTeams(newTeams);
  };

  const handleCancelImage = (index) => {
    const newTeams = [...teams];
    newTeams[index].photo = null;
    setTeams(newTeams);
  };

  const handleCancelTeam = (index) => {
    if (teams.length > 1) {
      const newTeams = [...teams];
      newTeams.splice(index, 1);
      setTeams(newTeams);
    }
  };

  const hideAddPhotoIcon = (team) => {
    return team.photo ? { display: "none" } : {};
  };

  const [images, setImages] = useState([]);
  const [isOver, setIsOver] = useState(false);

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    const newImages = [
      ...images,
      ...selectedImages.slice(0, 5 - images.length),
    ];
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    const draggedIndex = event.dataTransfer.getData("text/plain");
    const droppedIndex = images.length;

    // Prevent dropping the item back into its original position
    if (draggedIndex === droppedIndex.toString()) {
      return;
    }

    const draggedImage = images[draggedIndex];
    const newImages = [...images];
    newImages.splice(draggedIndex, 1);
    newImages.splice(droppedIndex, 0, draggedImage);

    setImages(newImages);
  };
  return (
    <>
      <div className={style.wrapper}>
        <WebDashboard2 />
        <div className={style.studioMainScreen}>
          <div className={style.studioHeader}>
            <div>
              <input type="text" placeholder="search" />
            </div>
            <div>
              <IoSearch />
            </div>
            <div>
              <div className={style.notifyIcon}>
                <GoDotFill />
              </div>
              <FaRegBell />
            </div>
            <div>
              <MdOutlineSettings />
            </div>
          </div>

          <div className={style.addNewStudioTitle} style={{ marginTop: "-2%" }}>
            Add new studio
          </div>
          <div className={style.addNewStudioPage}>
            <div>
              <div>
                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="studioName">Studio Name</label>
                  <input
                    type="text"
                    id="studioName"
                    placeholder="Enter Studio Area"
                    name="studioName"
                    value={studioDetails.fullName}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="area">Total Area</label>
                  <input
                    type="text"
                    id="area"
                    placeholder="Enter Approx. Area"
                    name="area"
                    value={studioDetails.area}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        area: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="rooms">Rooms</label>

                  <select
                    id="rooms"
                    name="rooms"
                    value={studioDetails.totalRooms}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        totalRooms: e.target.value,
                      })
                    }
                  >
                    <option>Select No. of Rooms</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="pincode">Studio Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="Enter Pincode"
                    value={studioDetails.pincode}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        pincode: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="addcity">Studio city</label>
                  <input
                    list="city"
                    id="addcity"
                    placeholder="Select city Name"
                    name="addcity"
                    value={studioDetails.city}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        city: e.target.value,
                      })
                    }
                  />
                  <datalist id="city">
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bombay">Bombay</option>
                  </datalist>
                </div>
                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="Amenities">Amenities </label>

                  <Select
                    id="Amenities"
                    mode="multiple"
                    className=""
                    placeholder="Select one or more Amenities"
                    value={
                      studioDetails?.amenities?.map((item) => item.name) || []
                    }
                    onChange={setSelectedItems}
                    style={customStyles}
                    options={studioDetails?.amenities?.map((item) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                  />
                </div>
              </div>
              <div>
                <div className={style.addNewStudioimgBox}>
                  <label htmlFor="selectimg">Image</label>
                  <br />
                  <div>
                    <label className={style.abs} htmlFor="">
                      {images.length === 0 ? (
                        <div>
                          <label htmlFor="selectimg">
                            <img src={upload} alt="" />
                            <div>
                              Drag and Drop or <span>Browse</span> <br /> to
                              upload
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div
                          className={`${style.showMultipleStudioImage} ${
                            isOver ? "drag-over" : ""
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <div>
                            {images.map((image, index) => (
                              <div
                                key={index}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("text/plain", index);
                                }}
                              >
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Uploaded Image ${index + 1}`}
                                  style={{ width: "100%", height: "100%" }}
                                />
                                <span
                                  className={style.cancelImageUpload}
                                  style={{ right: "-10%" }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <img src={cross} alt="" />
                                </span>
                              </div>
                            ))}
                          </div>
                          {images.length <= 4 && (
                            <div>
                              <label
                                htmlFor="selectimg"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  paddingTop: "15%",
                                }}
                              >
                                <img src={upload} alt="" /> Upload
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".jpeg,.png,.svg,.webp,.jpg,.jfif"
                      id="selectimg"
                      name="studioPhotos"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div
                  className={style.addNewStudioinputBox}
                  style={{ paddingTop: "2%" }}
                >
                  <label htmlFor="guest">Max Guests</label>

                  <select
                    id="guest"
                    value={studioDetails.maxGuests}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        maxGuests: e.target.value,
                      })
                    }
                  >
                    <option>Select Maximum Guest allowed</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>

                <div className={style.addNewStudioinputBox}>
                  <label htmlFor="addstate">Select State</label>
                  <input
                    list="state"
                    id="addstate"
                    placeholder="Select state Name"
                    name="state"
                    value={studioDetails.state}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        state: e.target.value,
                      })
                    }
                  />
                  <datalist id="state">
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bombay">Bombay</option>
                  </datalist>
                </div>

                <div className={style.addNewStudioinputBox}>
                  <label
                    htmlFor="iframeCode"
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      fontSize: "18px",
                    }}
                  >
                    Google Maps Embed Code
                  </label>
                  <input
                    type="text"
                    id="iframeCode"
                    placeholder="Paste Google Maps Embed Code here"
                    value={iframeCode}
                    onChange={handleIframeCodeChange}
                  />
                </div>
                <div
                  style={{
                    fontSize: "1vmax",
                    fontWeight: "600",
                    paddingTop: "2%",
                  }}
                >
                  Location
                </div>
                <div
                  className={style.showlocationDiv}
                  style={{
                    width: "100%",
                    height: "40%",

                    overflow: "hidden",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  {hasContent ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: iframeCode }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <span style={{ fontSize: "18px", color: "#888" }}>
                        Location will be visible here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className={style.addNewStudioinputBox2}>
                  <label htmlFor="aboutStudio">About Studio</label>
                  <textarea
                    type="text"
                    id="aboutStudio"
                    placeholder="Enter Studio Details"
                    value={studioDetails.aboutUs.aboutUs}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        aboutUs: {
                          ...studioDetails.aboutUs,
                          aboutUs: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className={style.addNewStudioinputBox2}>
                  <label htmlFor="studioService">Studio Services</label>
                  <textarea
                    type="text"
                    id="studioService"
                    placeholder="Enter Studio Services"
                    value={studioDetails.aboutUs.services}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        aboutUs: {
                          ...studioDetails.aboutUs,
                          services: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className={style.addNewStudioinputBox2}>
                  <label htmlFor="area">Total Area</label>
                  <textarea
                    type="text"
                    id="area"
                    placeholder="Enter Approx. Area"
                    value={studioDetails.aboutUs.infrastructure}
                    onChange={(e) =>
                      setStudioDetails({
                        ...studioDetails,
                        aboutUs: {
                          ...studioDetails.aboutUs,
                          infrastructure: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className={style.roomAndClassSection}>
                  <div>
                    <div className={style.addNewStudioinputBox3}>
                      <label htmlFor="pincode">Rooms</label>
                      <input
                        type="text"
                        id="pincode"
                        placeholder="Enter Pincode"
                        value={studioDetails.roomsDetails}
                        onChange={(e) =>
                          setStudioDetails({
                            ...studioDetails,
                            roomsDetails: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <div className={style.addTeamDetailDiv}>
                      <label htmlFor="Teams">Teams</label>

                      <div className={style.addTeamDetailDynamicDiv}>
                        {teams.map((team, index) => (
                          <div
                            key={index}
                            className={style.addTeamDetailMainDiv}
                          >
                            <div>
                              <label
                                style={{ cursor: "pointer" }}
                                htmlFor={`uploadteamPhoto-${index}`}
                              >
                                <MdAddAPhoto style={hideAddPhotoIcon(team)} />
                              </label>
                              <input
                                type="file"
                                // value={studioDetails.teamDetails}
                                id={`uploadteamPhoto-${index}`}
                                style={{ display: "none" }}
                                onChange={(event) =>
                                  handlePhotoChange(event, index)
                                }
                              />
                              {team.photo && (
                                <div>
                                  <img
                                    src={URL.createObjectURL(team.photo)}
                                    alt={`Team ${index} Photo`}
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                  <span
                                    className={style.cancelImageUpload}
                                    onClick={() => handleCancelImage(index)}
                                  >
                                    <img src={cross} alt="" />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Name"
                                value={team.name}
                                onChange={(event) =>
                                  handleInputChange(event, index, "name")
                                }
                              />
                              <input
                                type="text"
                                placeholder="Profile"
                                // value={team.profile}
                                onChange={(event) =>
                                  handleInputChange(event, index, "profile")
                                }
                              />
                            </div>
                            {teams.length > 1 && (
                              <span
                                style={{ cursor: "pointer" }}
                                className={style.cancelTeamDetailUpload}
                                onClick={() => handleCancelTeam(index)}
                              >
                                <img src={cross} alt="" />
                              </span>
                            )}
                          </div>
                        ))}
                        <span
                          className={style.addTeamDetailbtn}
                          onClick={handleAddTeamDetail}
                        >
                          <MdOutlineAddBox /> &nbsp;<div>Add Person</div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <StudioFooter
            setSelectTab={setSelectTab}
            backOnclick={gotoadminpage}
          />
        </div>
      </div>
    </>
  );
}

export default AddNewStudio;
