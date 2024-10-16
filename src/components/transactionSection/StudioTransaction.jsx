import React, { useEffect, useMemo, useState } from "react";
import style from "../../pages/admin/studios/studio.module.css";

import { GoEye } from "react-icons/go";

import { RiDeleteBin5Fill, RiExpandUpDownLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import bookingPageApi from "../../services/bookingPageApi";

import moment from "moment";
import { CiFilter } from "react-icons/ci";
import CheckBoxFilterComponent from "../../pages/admin/layout/filterComponent/CheckBoxFilterComponent";
import DateAndSearchFilterComponent from "../../pages/admin/layout/filterComponent/DateAndSearchFilterComponent";
import { clearEmptyField } from "../../utils/helperFunction";

import ChoiraLoder2 from "../loader/ChoiraLoder2";
import CopyToClipboard from "../../pages/admin/layout/CopyToClipboard ";
import PaginationNav from "../../pages/admin/layout/PaginationNav";
let PageSize = 10;

let userFiler = true;
let setUserFilterText = {};

function StudioTransaction({
  products,
  setProducts,
  handleChange,
  getStatusColor,
  bookingPageCount,
  totalPage,
  pageCount,
  setPageCount,
  setTotalPage,
  sendFilterDataToapi,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [userFilterText, setUserFilterText] = useState("");
  // const gotoShowDetails = (id) => {
  //   const selectedProduct = products.find((product) => product._id === id);
  //   console.log("navigated=======>", selectedProduct);

  //   navigate(`/service/showBookingDetails?id=${id}`, {
  //     state: { productData: selectedProduct },
  //   });
  // };

  const gotoShowDetails = (id) => {
    const isEditMode = true;
    const selectedProduct = products.find((product) => product._id === id);
    console.log("navigated=======>", selectedProduct);

    navigate(`/studio/edit?id=${id}`, {
      state: {
        productData: selectedProduct,
        navCount: 4,
        isEditMode: isEditMode,
        showMode: true,
      },
    });
  };
  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * PageSize;
  //   const lastPageIndex = firstPageIndex + PageSize;
  //   return products.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, products]);

  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    setProducts(products);
  }, [products]);

  // const getNoOfhours = (bookingTime) => {
  //   return moment
  //     .duration(
  //       moment(bookingTime?.endTime, "HH:mm").diff(
  //         moment(bookingTime?.startTime, "HH:mm")
  //       )
  //     )
  //     .asHours();
  // };
  const closeAllFilter = () => {
    setShowstatusFilter(false);
  };
  const headers = [
    { title: "Id", width: "5%" },
    { title: "User Name", width: "10%" },
    { title: "Studio Name", width: "10%" },
    { title: "Room Price", width: "5%" },
    { title: "Discount  Name", width: "10%" },
    { title: "Discount ", width: "10%" },
    { title: "Amount", width: "10%" },
    { title: "Date", width: "10%" },
    { title: "Status", width: "10%", icon: <CiFilter /> },
    // { title: "", width: "10%", icon: "" },
  ];
  const getDynamicStyle = (shortby, criteria) => ({
    backgroundColor: shortby !== criteria ? "#ffc70133" : "",
  });
  const status = {
    Pending: 0,
    Completed: 1,
    Cancelled: 2,
  };
  //  ["active", "cancelled", "completed"];
  const [showstatusFilter, setShowstatusFilter] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [userAllFilterData, setUserAllFilterData] = useState({});

  useEffect(() => {
    if (selectedData === "") {
      delete sendFilterDataToapi.bookingType;
      console.log("sendFilterDataToapi after reset:", sendFilterDataToapi);
      handleFilterData(sendFilterDataToapi);
    }
  }, [selectedData]);

  const handleResetFilter = () => {
    setSelectedData("");
    console.log("selectedData before reset:", selectedData);
  };

  const handleFilterData = (sendFilterDataToapi) => {
    setProducts([]);
    setPageCount(1);
    // errorAlert(selectedData);
    console.log("selectedData:::::::::::::------>", selectedData);
    delete sendFilterDataToapi.bookingType;
    if (selectedData) {
      sendFilterDataToapi.bookingType = selectedData;
    }
    sendFilterDataToapi.pageCount = pageCount;

    // clearEmptyField(sendFilterDataToapi);
    // bookingPageApi.getBookings(sendFilterDataToapi).then((response) => {
    //   console.log("date filter response:", response);
    //   if (response.status) {
    //     setProducts(response.data);
    //     setTotalPage(response?.paginate?.totalPages);
    //   }
    // });
  };

  return (
    <>
      <div className={style.studioTabelDiv}>
        <DateAndSearchFilterComponent
          searchDisable={true}
          dateDisable={true}

          // setProducts={setProducts}
          // setTotalPage={setTotalPage}
          // pageCount={pageCount}
          // setPageCount={setPageCount}
          // userFiler={userFiler}
          // setUserFilterText={setUserFilterText}
          // userFilterText={userFilterText}
          // userAllFilterData={userAllFilterData}
          // handleFilterData={handleFilterData}
          // sendFilterDataToapi={sendFilterDataToapi}
        />
        <div>
          <table>
            <thead className={style.studiotabelHead}>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} style={{ width: header.width }}>
                    <div className={style.headingContainer}>
                      {header.title}
                      <div
                        className={header.icon !== "" ? style.filterBox : ""}
                        style={
                          index === 8 && selectedData.length > 0
                            ? getDynamicStyle(
                                selectedData,
                                selectedData.length > 0
                              )
                            : {}
                        }
                        onClick={() => {
                          if (index == 8) {
                            setShowstatusFilter(!showstatusFilter);
                          }
                        }}
                        // onClick={handelShortbyClick}
                      >
                        <span>{header.icon}</span>
                        {index == 8 &&
                          (showstatusFilter ? (
                            <CheckBoxFilterComponent
                              data={status}
                              // cusstyle={{ left: "-355%" }}
                              disabledsearch={true}
                              selectedData={selectedData}
                              setSelectedData={setSelectedData}
                              onFilterApply={handleFilterData}
                              onResetFilter={handleResetFilter}
                              sendFilterDataToapi={sendFilterDataToapi}
                              closeAllFilter={() =>
                                console.log("closeAllFilter triggered")
                              }
                            />
                          ) : (
                            ""
                          ))}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products?.length === 0 ? (
                <tr>
                  <td>
                    <ChoiraLoder2 />
                  </td>
                </tr>
              ) : (
                products?.map((products, i) => {
                  return (
                    <tr key={i}>
                      <td title={products._id}>#{products._id.slice(-4)}</td>
                      <td>
                        <CopyToClipboard textToCopy={products.userName} />
                      </td>
                      <td title={products.studioName}>
                        <CopyToClipboard textToCopy={products.studioName} />

                        <br />
                        <small title={products.studioName}>
                          <CopyToClipboard textToCopy={products.roomName} />
                        </small>
                      </td>
                      <td>{products.noOfHours}</td>
                      <td
                        style={{ textAlign: "center" }}
                        title={moment(products.creationTimeStamp).format(
                          "Do MMM  YY, hh:mm a "
                        )}
                      >
                        {moment(products.creationTimeStamp).format(
                          "Do MMM  YY"
                        )}
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        title={moment(products.bookingDate).format(
                          "Do MMM  YY, hh:mm a "
                        )}
                      >
                        {moment(products.bookingDate).format("Do MMM  YY")}
                      </td>

                      {/* <td>{products.planId}</td> */}
                      <td>
                        {`${moment(products?.bookingTime?.startTime, [
                          "HH:mm",
                        ]).format("hh:mm a")} - ${moment(
                          products?.bookingTime?.endTime,
                          ["HH:mm"]
                        ).format("hh:mm a")}`}
                      </td>
                      <td>₹{products?.totalPrice}</td>
                      <td>
                        <div
                          className={style.userProjectStatus}
                          style={{
                            backgroundColor:
                              parseInt(products.bookingStatus) === 0
                                ? "#FFF3CA"
                                : parseInt(products.bookingStatus) == 1
                                ? "#DDFFF3"
                                : "#FFDDDD",
                          }}
                        >
                          {parseInt(products.bookingStatus) === 0
                            ? "Pending"
                            : parseInt(products.bookingStatus) == 1
                            ? "Complete"
                            : "Cancelled"}
                        </div>
                      </td>
                      {/* <td className={style.tableActionbtn}>
                        <div>
                          <GoEye
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              // gotoShowDetails(products._id);
                            }}
                          />{" "}
                          &nbsp;
                          <RiDeleteBin5Fill
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </div>
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className={style.tabelpaginationDiv}>
        <PaginationNav
          pageCount={pageCount}
          totalPage={totalPage}
          setPageCount={setPageCount}
          bookingPageCount={bookingPageCount}
        />
      </div>
    </>
  );
}

export default StudioTransaction;
