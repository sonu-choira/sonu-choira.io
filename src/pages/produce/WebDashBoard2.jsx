import React, { useEffect, useState } from "react";
import style from "../produce/dashboard.module.css";
import logo from "../../assets/img/logo-choira.svg";
import create from "../../assets/img/dashboard_img/create.svg";
import produce from "../../assets/img/dashboard_img/produce_selected.svg";
import community from "../../assets/img/dashboard_img/community.svg";
import tanmay from "../../assets/img/dashboard_img/tanmay.png";
import ProfileEdit from "./ProfileEdit";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { useLocale } from "antd/es/locale";
import { LuHome } from "react-icons/lu";
import { TbSpeakerphone } from "react-icons/tb";
function WebDashboard2({ tabCount, setTabCount, navCount }) {
  const navigate = useNavigate();

  let { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("Overview")) {
      setTabCount(1);
    } else if (pathname.includes("User")) {
      setTabCount(2);
    } else if (pathname.includes("Teams")) {
      setTabCount(3);
    } else if (pathname.includes("Apps&More")) {
      setTabCount(4);
    } else if (pathname.includes("Bookings")) {
      setTabCount(5);
    } else if (pathname.includes("Promotions")) {
      setTabCount(6);
    }
  }, [pathname, setTabCount]);

  useEffect(() => {
    if (navCount) {
      setTabCount(navCount);
    }
  }, [navCount, setTabCount]);

  const [editProfile, setEditProfile] = useState(false);
  const editProfiletab = () => {
    setEditProfile(true);
  };

  const gotoAllStudioDetailPage = () => {
    setTabCount(4);
    navigate("/adminDashboard/Apps&More/studio");
  };

  const gotoBookings = () => {
    setTabCount(5);
    navigate("/adminDashboard/Bookings/studio");
  };
  const gotoPromotions = () => {
    setTabCount(6);
    // navigate("/adminDashboard/Bookings/studio");
  };

  const gotoOverview = () => {
    setTabCount(1);
    navigate("/adminDashboard/Overview");
  };
  const gotoStudios = () => {
    setTabCount(2);
    navigate("/adminDashboard/User");
  };

  const gotoTeams = () => {
    setTabCount(3);
    navigate("/adminDashboard/Teams/StudioPatners");
  };

  return (
    <>
      <ProfileEdit editProfile={editProfile} setEditProfile={setEditProfile} />
      <div className={style.sidebar}>
        <div className={style.sidebarMain}>
          <div className={style.section1}>
            <div>
              <img src={logo} alt="" />
            </div>
            <div className={style.community}>
              <div
                className={tabCount === 1 ? style.tabActive : style.padding}
                onClick={gotoOverview}
              >
                <LuHome style={{ fontSize: "1vmax" }} />
                DashBoard
              </div>
              <div
                className={tabCount === 2 ? style.tabActive : style.padding}
                onClick={gotoStudios}
              >
                <FaRegUser style={{ fontSize: "1vmax" }} />
                User
              </div>
              <div
                className={tabCount === 3 ? style.tabActive : style.padding}
                onClick={gotoTeams}
              >
                <AiOutlineTeam style={{ fontSize: "1.3vmax" }} />
                Teams
              </div>
              <div
                className={tabCount === 4 ? style.tabActive : style.padding}
                onClick={gotoAllStudioDetailPage}
              >
                <img src={produce} alt="" />
                App & More
              </div>
              <div
                className={tabCount === 5 ? style.tabActive : style.padding}
                onClick={gotoBookings}
              >
                <img src={produce} alt="" />
                Bookings
              </div>
              {/* <div
                className={tabCount === 6 ? style.tabActive : style.padding}
                onClick={gotoPromotions}
              >
                <TbSpeakerphone style={{ fontSize: "1vmax" }} />
                Promotions
              </div> */}
            </div>
          </div>

          <div className={style.section2}>
            <div
              className={style.section2Main}
              style={{ cursor: "pointer" }}
              onClick={editProfiletab}
            >
              <div>
                <img src={tanmay} alt="" />
              </div>
              <div>
                <h5>Tanmay</h5> <br />
                <h6>Music Producer</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebDashboard2;
